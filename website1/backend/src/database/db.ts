import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Category,
  Product,
  FlashSale,
  Review,
  CartItem,
  WishlistItem,
  Order,
  TrafficEvent
} from './types.js';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_FLASH_SALES,
  SEED_REVIEWS
} from './seed-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DatabaseService {
  private pool: pg.Pool | null = null;
  private isPostgresConnected = false;

  // In-Memory fallback store
  private categories: Category[] = [];
  private products: Product[] = [];
  private flashSales: FlashSale[] = [];
  private reviews: Review[] = [];
  private carts: Map<string, { id: string; session_id: string; items: CartItem[] }> = new Map();
  private wishlists: Map<string, { id: string; session_id: string; items: WishlistItem[] }> = new Map();
  private orders: Map<string, Order> = new Map();
  private trafficEvents: TrafficEvent[] = [];

  constructor() {
    this.seedFallback();
  }

  private seedFallback() {
    this.categories = JSON.parse(JSON.stringify(SEED_CATEGORIES));
    this.products = JSON.parse(JSON.stringify(SEED_PRODUCTS));
    this.flashSales = JSON.parse(JSON.stringify(SEED_FLASH_SALES));
    this.reviews = JSON.parse(JSON.stringify(SEED_REVIEWS));
  }

  public async init(): Promise<void> {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      try {
        const isCloud = dbUrl.includes('neon.tech') || dbUrl.includes('supabase.co') || dbUrl.includes('sslmode=require');
        this.pool = new pg.Pool({
          connectionString: dbUrl,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
          ssl: isCloud ? { rejectUnauthorized: false } : undefined
        });

        // Test connection
        const client = await this.pool.connect();
        this.isPostgresConnected = true;
        console.log('[DB] Successfully connected to PostgreSQL database');

        // Apply schema if exists
        try {
          const schemaPath = path.join(__dirname, 'schema.sql');
          if (fs.existsSync(schemaPath)) {
            const sql = fs.readFileSync(schemaPath, 'utf8');
            await client.query(sql);
            console.log('[DB] Applied PostgreSQL schema DDL successfully');
          }
          await this.seedPostgres(client);
        } catch (schemaErr) {
          console.warn('[DB] Notice while executing schema DDL:', (schemaErr as Error).message);
        } finally {
          client.release();
        }
      } catch (err) {
        console.warn(
          `[DB] PostgreSQL connection failed (${(err as Error).message}). Falling back to high-performance local store.`
        );
        this.isPostgresConnected = false;
        this.pool = null;
      }
    } else {
      console.log('[DB] DATABASE_URL not specified. Running in self-contained local storage engine.');
    }
  }

  // CATEGORIES
  public async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  public async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id || c.slug === id);
  }

  // PRODUCTS
  public async getProducts(filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    let result = [...this.products];

    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      result = result.filter(
        p => p.category_id.toLowerCase() === cat ||
             p.category_slug?.toLowerCase() === cat ||
             p.category_name?.toLowerCase() === cat
      );
    }

    if (filters.brand) {
      const brands = filters.brand.split(',').map(b => b.trim().toLowerCase());
      result = result.filter(p => brands.includes(p.brand.toLowerCase()));
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined) {
      result = result.filter(p => p.rating >= filters.minRating!);
    }

    // Sorting
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.review_count - a.review_count);
        break;
    }

    const total = result.length;
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 24);
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id || p.slug === id);
  }

  public async getProductReviews(productId: string): Promise<Review[]> {
    const prodReviews = this.reviews.filter(r => r.product_id === productId);
    if (prodReviews.length > 0) return prodReviews;

    // Fallback realistic reviews
    return [
      {
        id: `rev_gen_${productId}_1`,
        product_id: productId,
        rating: 5,
        title: 'Exceeded all my expectations',
        content: 'Premium construction, exceptional performance, and arrived ahead of schedule. Very happy with APTS.',
        author_name: 'Verified Customer',
        verified: true,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: `rev_gen_${productId}_2`,
        product_id: productId,
        rating: 4,
        title: 'Solid build quality and great value',
        content: 'Works as advertised. Setup took less than two minutes. Highly recommended for daily use.',
        author_name: 'Rahul V.',
        verified: true,
        created_at: new Date(Date.now() - 86400000 * 8).toISOString()
      }
    ];
  }

  public async getRelatedProducts(productId: string): Promise<Product[]> {
    const target = await this.getProductById(productId);
    if (!target) return this.products.slice(0, 4);

    return this.products
      .filter(p => p.id !== target.id && p.category_id === target.category_id)
      .slice(0, 4);
  }

  // FLASH SALES & DEALS
  public async getFlashSales(): Promise<FlashSale[]> {
    const activeProducts = this.products.filter(p => p.is_flash_sale);
    return [
      {
        id: 'sale_prime_surge',
        name: 'APTS Prime Hour Flash Sale',
        start_time: new Date(Date.now() - 3600000).toISOString(),
        end_time: new Date(Date.now() + 7200000).toISOString(),
        status: 'active',
        products: activeProducts.map(p => ({
          ...p,
          sale_price: p.flash_sale_price || p.price,
          stock_limit: p.stock + 20,
          sold_count: Math.round((p.stock + 20) * ((p.flash_sale_claimed_percent || 70) / 100))
        }))
      }
    ];
  }

  public async getDeals(): Promise<Product[]> {
    return this.products
      .filter(p => p.discount >= 35)
      .sort((a, b) => b.discount - a.discount);
  }

  public async getRecommendations(): Promise<Product[]> {
    return this.products.slice(0, 8);
  }

  // SEARCH
  public async search(query: string, filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: string;
  } = {}): Promise<{ results: Product[]; total: number }> {
    const q = query.toLowerCase().trim();
    let matches = this.products.filter(p => {
      const matchText = `${p.name} ${p.description} ${p.brand} ${p.category_name || ''}`.toLowerCase();
      return matchText.includes(q);
    });

    if (filters.category && filters.category !== 'all') {
      matches = matches.filter(p => p.category_id === filters.category || p.category_slug === filters.category);
    }
    if (filters.brand) {
      matches = matches.filter(p => p.brand.toLowerCase() === filters.brand!.toLowerCase());
    }
    if (filters.minPrice !== undefined) {
      matches = matches.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      matches = matches.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      matches = matches.filter(p => p.rating >= filters.minRating!);
    }

    return { results: matches, total: matches.length };
  }

  // CART (SESSION BASED)
  public async getCart(sessionId: string): Promise<{ id: string; session_id: string; items: CartItem[]; subtotal: number }> {
    let cart = this.carts.get(sessionId);
    if (!cart) {
      cart = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        session_id: sessionId,
        items: []
      };
      this.carts.set(sessionId, cart);
    }

    // Populate product details
    const populatedItems = cart.items.map(item => {
      const product = this.products.find(p => p.id === item.product_id);
      return {
        ...item,
        product
      };
    });

    const subtotal = populatedItems.reduce(
      (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
      0
    );

    return {
      id: cart.id,
      session_id: cart.session_id,
      items: populatedItems,
      subtotal
    };
  }

  public async addToCart(sessionId: string, productId: string, quantity = 1): Promise<{ success: boolean; cart: any }> {
    const cartData = await this.getCart(sessionId);
    const existingItem = cartData.items.find(i => i.product_id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartData.items.push({
        id: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        cart_id: cartData.id,
        product_id: productId,
        quantity
      });
    }

    this.carts.set(sessionId, {
      id: cartData.id,
      session_id: sessionId,
      items: cartData.items
    });

    return { success: true, cart: await this.getCart(sessionId) };
  }

  public async updateCartItem(sessionId: string, itemId: string, quantity: number): Promise<any> {
    const cartData = await this.getCart(sessionId);
    if (quantity <= 0) {
      cartData.items = cartData.items.filter(i => i.id !== itemId && i.product_id !== itemId);
    } else {
      const item = cartData.items.find(i => i.id === itemId || i.product_id === itemId);
      if (item) item.quantity = quantity;
    }

    this.carts.set(sessionId, {
      id: cartData.id,
      session_id: sessionId,
      items: cartData.items
    });

    return await this.getCart(sessionId);
  }

  public async removeFromCart(sessionId: string, itemId: string): Promise<any> {
    return this.updateCartItem(sessionId, itemId, 0);
  }

  public async clearCart(sessionId: string): Promise<void> {
    const cart = this.carts.get(sessionId);
    if (cart) {
      cart.items = [];
      this.carts.set(sessionId, cart);
    }
  }

  // WISHLIST (SESSION BASED)
  public async getWishlist(sessionId: string): Promise<WishlistItem[]> {
    let list = this.wishlists.get(sessionId);
    if (!list) {
      list = {
        id: `wish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        session_id: sessionId,
        items: []
      };
      this.wishlists.set(sessionId, list);
    }

    return list.items.map(item => ({
      ...item,
      product: this.products.find(p => p.id === item.product_id)
    }));
  }

  public async addToWishlist(sessionId: string, productId: string): Promise<WishlistItem[]> {
    let list = this.wishlists.get(sessionId);
    if (!list) {
      list = {
        id: `wish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        session_id: sessionId,
        items: []
      };
      this.wishlists.set(sessionId, list);
    }

    if (!list.items.some(i => i.product_id === productId)) {
      list.items.push({
        id: `wi_${Date.now()}`,
        wishlist_id: list.id,
        product_id: productId
      });
    }

    return this.getWishlist(sessionId);
  }

  public async removeFromWishlist(sessionId: string, productId: string): Promise<WishlistItem[]> {
    const list = this.wishlists.get(sessionId);
    if (list) {
      list.items = list.items.filter(i => i.product_id !== productId);
    }
    return this.getWishlist(sessionId);
  }

  // ORDERS & CHECKOUT
  public async createOrder(orderData: {
    sessionId: string;
    shippingAddress: any;
    paymentMethod: string;
    items?: { productId: string; quantity: number }[];
  }): Promise<Order> {
    const cart = await this.getCart(orderData.sessionId);
    const rawItems = orderData.items && orderData.items.length > 0
      ? orderData.items.map(it => ({ product_id: it.productId, quantity: it.quantity }))
      : cart.items.map(it => ({ product_id: it.product_id, quantity: it.quantity }));

    const orderItems = rawItems.map(item => {
      const prod = this.products.find(p => p.id === item.product_id);
      return {
        id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        order_id: '',
        product_id: prod?.id || item.product_id,
        quantity: item.quantity,
        price: prod?.price || 999,
        product_name: prod?.name || 'APTS Product',
        product_image: prod?.images?.[0] || ''
      };
    });

    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping_fee = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping_fee;

    const orderNumber = `APTS-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord_${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      session_id: orderData.sessionId,
      subtotal,
      shipping_fee,
      total,
      shipping_address: orderData.shippingAddress || {
        fullName: 'APTS Shopper',
        addressLine1: '42 Silicon Avenue',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        phone: '+91 98765 43210'
      },
      payment_method: orderData.paymentMethod || 'Simulated UPI',
      status: 'confirmed',
      created_at: new Date().toISOString(),
      items: orderItems.map(oi => ({ ...oi, order_id: orderId }))
    };

    this.orders.set(orderId, newOrder);
    this.orders.set(orderNumber, newOrder);

    // Clear cart on checkout
    await this.clearCart(orderData.sessionId);

    return newOrder;
  }

  public async getOrderById(orderId: string): Promise<Order | undefined> {
    return this.orders.get(orderId);
  }

  public async getOrders(sessionId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(o => o.session_id === sessionId);
  }

  // TRAFFIC TELEMETRY
  public async recordTrafficEvent(event: Omit<TrafficEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: TrafficEvent = {
      id: `te_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    this.trafficEvents.push(fullEvent);
    if (this.trafficEvents.length > 2000) {
      this.trafficEvents.shift();
    }

    if (this.isPostgresConnected && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO traffic_events (id, timestamp, endpoint, method, status_code, response_time, source, scenario, session_id, product_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            fullEvent.id,
            fullEvent.timestamp,
            fullEvent.endpoint,
            fullEvent.method,
            fullEvent.status_code,
            fullEvent.response_time,
            fullEvent.source,
            fullEvent.scenario || null,
            fullEvent.session_id || null,
            fullEvent.product_id || null
          ]
        );
      } catch {
        // Silently ignore async DB insert logging errors to not block response
      }
    }
  }


  private async seedPostgres(client: pg.PoolClient) {
    try {
      const checkRes = await client.query("SELECT COUNT(*) as count FROM products");
      if (parseInt(checkRes.rows[0].count, 10) > 0) {
        console.log('[DB] PostgreSQL already contains catalog data (' + checkRes.rows[0].count + ' products); skipping seed.');
        return;
      }

      console.log('[DB] Seeding PostgreSQL database with initial catalog...');

      // Seed categories
      for (const c of SEED_CATEGORIES) {
        await client.query(
          `INSERT INTO categories (id, name, slug, parent_id, image, description)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [c.id, c.name, c.slug, c.parent_id, c.image || null, c.description || null]
        );
      }

      // Seed products
      for (const p of SEED_PRODUCTS) {
        await client.query(
          `INSERT INTO products (id, name, slug, description, price, original_price, discount, category_id, brand, rating, review_count, stock, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO NOTHING`,
          [
            p.id,
            p.name,
            p.slug,
            p.description,
            p.price,
            p.original_price || p.price,
            p.discount || 0,
            p.category_id,
            p.brand,
            p.rating,
            p.review_count,
            p.stock,
            p.status || 'active'
          ]
        );

        if (p.images) {
          for (let i = 0; i < p.images.length; i++) {
            await client.query(
              `INSERT INTO product_images (id, product_id, image_url, sort_order)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (id) DO NOTHING`,
              [`img_${p.id}_${i}`, p.id, p.images[i], i]
            );
          }
        }

        if (p.specifications) {
          for (const [key, val] of Object.entries(p.specifications)) {
            await client.query(
              `INSERT INTO product_specifications (id, product_id, spec_name, spec_value)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (id) DO NOTHING`,
              [`spec_${p.id}_${key}`, p.id, key, String(val)]
            );
          }
        }
      }

      // Seed flash sales
      for (const fs of SEED_FLASH_SALES) {
        await client.query(
          `INSERT INTO flash_sales (id, name, start_time, end_time, status)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [fs.id, fs.name, fs.start_time, fs.end_time, fs.status]
        );

        if (fs.products) {
          for (const fsp of fs.products) {
            await client.query(
              `INSERT INTO flash_sale_products (id, flash_sale_id, product_id, sale_price, stock_limit, sold_count)
               VALUES ($1, $2, $3, $4, $5, $6)
               ON CONFLICT (id) DO NOTHING`,
              [`fsp_${fs.id}_${fsp.id}`, fs.id, fsp.id, fsp.sale_price, fsp.stock_limit, fsp.sold_count]
            );
          }
        }
      }

      // Seed reviews
      for (const r of SEED_REVIEWS) {
        await client.query(
          `INSERT INTO reviews (id, product_id, rating, title, content, author_name, verified, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [r.id, r.product_id, r.rating, r.title, r.content, r.author_name, r.verified ?? true, r.created_at || new Date().toISOString()]
        );
      }

      console.log('[DB] Successfully seeded PostgreSQL with all categories, products, and reviews!');
    } catch (seedErr) {
      console.warn('[DB] Notice during PostgreSQL seed:', (seedErr as Error).message);
    }
  }

  public getTrafficStats(): { totalLogged: number; recentEvents: TrafficEvent[] } {
    return {
      totalLogged: this.trafficEvents.length,
      recentEvents: this.trafficEvents.slice(-20)
    };
  }
}

export const db = new DatabaseService();
