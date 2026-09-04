import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  Category,
  Product,
  Review,
  Cart,
  CartItem,
  WishlistItem,
  Order,
  OrderItem,
  UserEvent,
  Recommendation,
  TrendingProduct
} from './types.js';
import {
  initialCategories,
  initialProducts,
  initialReviews,
  initialTrending,
  initialRecommendations,
  initialUsers
} from './seed-data.js';

dotenv.config();

export interface IDatabaseAdapter {
  getCategories(): Promise<Category[]>;
  getProducts(filters?: { categoryId?: string; sort?: string; limit?: number; isPrime?: boolean }): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductReviews(productId: string): Promise<Review[]>;
  getSimilarProducts(productId: string, limit?: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getTrendingProducts(limit?: number): Promise<TrendingProduct[]>;
  getRecommendations(userId?: string, limit?: number): Promise<Product[]>;
  getCart(userId: string): Promise<Cart>;
  addToCart(userId: string, productId: string, quantity: number): Promise<Cart>;
  updateCartItem(userId: string, itemId: string, quantity: number): Promise<Cart>;
  removeFromCart(userId: string, itemId: string): Promise<Cart>;
  getWishlist(userId: string): Promise<Product[]>;
  addToWishlist(userId: string, productId: string): Promise<Product[]>;
  removeFromWishlist(userId: string, productId: string): Promise<Product[]>;
  createOrder(userId: string, shippingAddress: any, paymentMethod: string): Promise<Order>;
  getOrders(userId: string): Promise<Order[]>;
  recordEvent(event: UserEvent): Promise<UserEvent>;
  getUserEvents(limit?: number): Promise<UserEvent[]>;
  recalculateTrending(): Promise<TrendingProduct[]>;
  isSupabaseActive(): boolean;
}

// ============================================================================
// SUPABASE POSTGRESQL ADAPTER
// ============================================================================
class SupabaseAdapter implements IDatabaseAdapter {
  private client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  isSupabaseActive(): boolean {
    return true;
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.client.from('categories').select('*').order('name');
    if (error) throw error;
    return data || [];
  }

  async getProducts(filters?: { categoryId?: string; sort?: string; limit?: number; isPrime?: boolean }): Promise<Product[]> {
    let query = this.client.from('products').select('*');
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.isPrime) {
      query = query.eq('is_prime', true);
    }

    if (filters?.sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (filters?.sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (filters?.sort === 'rating') {
      query = query.order('rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.client.from('products').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data;
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    const { data, error } = await this.client
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getSimilarProducts(productId: string, limit = 4): Promise<Product[]> {
    const target = await this.getProductById(productId);
    if (!target) return [];

    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('category_id', target.category_id)
      .neq('id', productId)
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async searchProducts(query: string): Promise<Product[]> {
    const clean = query.trim();
    if (!clean) return [];
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .or(`title.ilike.%${clean}%,description.ilike.%${clean}%`);
    if (error) throw error;
    return data || [];
  }

  async getTrendingProducts(limit = 10): Promise<TrendingProduct[]> {
    const { data, error } = await this.client
      .from('trending_products')
      .select('*, product:products(*)')
      .order('score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async getRecommendations(userId?: string, limit = 8): Promise<Product[]> {
    if (userId) {
      const { data: recs } = await this.client
        .from('recommendations')
        .select('*, product:products(*)')
        .eq('user_id', userId)
        .order('score', { ascending: false })
        .limit(limit);

      if (recs && recs.length > 0) {
        return recs.map((r: any) => r.product).filter(Boolean);
      }
    }

    // Default to popular products
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async getCart(userId: string): Promise<Cart> {
    let { data: cart } = await this.client.from('carts').select('*').eq('user_id', userId).single();
    if (!cart) {
      const cartId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const { data: newCart, error } = await this.client
        .from('carts')
        .insert({ id: cartId, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      cart = newCart;
    }

    const { data: items } = await this.client
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('cart_id', cart.id);

    return {
      id: cart.id,
      user_id: userId,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
      items: items || []
    };
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    const existing = cart.items.find(i => i.product_id === productId);

    if (existing) {
      await this.client
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
    } else {
      const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await this.client.from('cart_items').insert({
        id: itemId,
        cart_id: cart.id,
        product_id: productId,
        quantity
      });
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, quantity: number): Promise<Cart> {
    if (quantity <= 0) {
      return this.removeFromCart(userId, itemId);
    }
    await this.client.from('cart_items').update({ quantity }).eq('id', itemId);
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    await this.client.from('cart_items').delete().eq('id', itemId);
    return this.getCart(userId);
  }

  async getWishlist(userId: string): Promise<Product[]> {
    const { data, error } = await this.client
      .from('wishlists')
      .select('*, product:products(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map((w: any) => w.product).filter(Boolean);
  }

  async addToWishlist(userId: string, productId: string): Promise<Product[]> {
    const { data: existing } = await this.client
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (!existing) {
      const wishId = `wish_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await this.client.from('wishlists').insert({
        id: wishId,
        user_id: userId,
        product_id: productId
      });
    }

    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, productId: string): Promise<Product[]> {
    await this.client.from('wishlists').delete().eq('user_id', userId).eq('product_id', productId);
    return this.getWishlist(userId);
  }

  async createOrder(userId: string, shippingAddress: any, paymentMethod: string): Promise<Order> {
    const cart = await this.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cannot checkout an empty cart');
    }

    const total = cart.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const { data: order, error } = await this.client
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        total_amount: total,
        status: 'CONFIRMED',
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      })
      .select()
      .single();

    if (error) throw error;

    const orderItemsToInsert = cart.items.map(item => ({
      id: `ord_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0
    }));

    await this.client.from('order_items').insert(orderItemsToInsert);

    // Clear cart items
    await this.client.from('cart_items').delete().eq('cart_id', cart.id);

    return {
      ...order,
      items: orderItemsToInsert
    };
  }

  async getOrders(userId: string): Promise<Order[]> {
    const { data, error } = await this.client
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async recordEvent(event: UserEvent): Promise<UserEvent> {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const record = {
      id: eventId,
      user_id: event.user_id,
      session_id: event.session_id || 'sess_default',
      event_type: event.event_type,
      product_id: event.product_id || null,
      category_id: event.category_id || null,
      search_query: event.search_query || null,
      metadata: event.metadata || {},
      created_at: new Date().toISOString()
    };
    await this.client.from('user_events').insert(record);
    return record;
  }

  async getUserEvents(limit = 50): Promise<UserEvent[]> {
    const { data, error } = await this.client
      .from('user_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async recalculateTrending(): Promise<TrendingProduct[]> {
    // Trending Score = Views + Searches + Cart additions + Purchases
    const { data: events } = await this.client.from('user_events').select('*');
    const stats: Record<string, { views: number; searches: number; carts: number; purchases: number }> = {};

    const products = await this.getProducts();
    products.forEach(p => {
      stats[p.id] = { views: 0, searches: 0, carts: 0, purchases: 0 };
    });

    (events || []).forEach((e: UserEvent) => {
      if (e.product_id && stats[e.product_id]) {
        if (e.event_type === 'VIEW_PRODUCT' || e.event_type === 'CLICK_PRODUCT') stats[e.product_id].views++;
        if (e.event_type === 'SEARCH') stats[e.product_id].searches++;
        if (e.event_type === 'ADD_TO_CART') stats[e.product_id].carts++;
        if (e.event_type === 'PURCHASE') stats[e.product_id].purchases++;
      }
    });

    for (const [prodId, count] of Object.entries(stats)) {
      const score = count.views * 1 + count.searches * 1 + count.carts * 2 + count.purchases * 5;
      await this.client.from('trending_products').upsert({
        id: `trend_${prodId}`,
        product_id: prodId,
        score,
        views_count: count.views,
        searches_count: count.searches,
        cart_count: count.carts,
        purchase_count: count.purchases,
        updated_at: new Date().toISOString()
      });
    }

    return this.getTrendingProducts();
  }
}

// ============================================================================
// ZERO-FRICTION IN-MEMORY FALLBACK ADAPTER
// (Ensures instant out-of-the-box run on laptop without cloud setup)
// ============================================================================
class InMemoryAdapter implements IDatabaseAdapter {
  private categories: Category[] = [...initialCategories];
  private products: Product[] = [...initialProducts];
  private reviews: Review[] = [...initialReviews];
  private trending: TrendingProduct[] = [...initialTrending];
  private recommendations: Recommendation[] = [...initialRecommendations];
  private carts: Map<string, Cart> = new Map();
  private wishlists: Map<string, Set<string>> = new Map();
  private orders: Order[] = [];
  private events: UserEvent[] = [];

  isSupabaseActive(): boolean {
    return false;
  }

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getProducts(filters?: { categoryId?: string; sort?: string; limit?: number; isPrime?: boolean }): Promise<Product[]> {
    let result = [...this.products];
    if (filters?.categoryId) {
      result = result.filter(p => p.category_id === filters.categoryId);
    }
    if (filters?.isPrime) {
      result = result.filter(p => p.is_prime);
    }
    if (filters?.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters?.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters?.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }
    return result;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.product_id === productId);
  }

  async getSimilarProducts(productId: string, limit = 4): Promise<Product[]> {
    const target = await this.getProductById(productId);
    if (!target) return [];
    return this.products.filter(p => p.category_id === target.category_id && p.id !== productId).slice(0, limit);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.products.filter(
      p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  async getTrendingProducts(limit = 10): Promise<TrendingProduct[]> {
    const sorted = [...this.trending].sort((a, b) => b.score - a.score);
    return sorted.slice(0, limit).map(t => ({
      ...t,
      product: this.products.find(p => p.id === t.product_id)
    }));
  }

  async getRecommendations(userId?: string, limit = 8): Promise<Product[]> {
    if (userId) {
      const userRecs = this.recommendations.filter(r => r.user_id === userId);
      if (userRecs.length > 0) {
        return userRecs
          .map(r => this.products.find(p => p.id === r.product_id))
          .filter((p): p is Product => Boolean(p))
          .slice(0, limit);
      }
    }
    // Return highest rated
    return [...this.products].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  async getCart(userId: string): Promise<Cart> {
    if (!this.carts.has(userId)) {
      this.carts.set(userId, {
        id: `cart_${userId}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: []
      });
    }
    const cart = this.carts.get(userId)!;
    return {
      ...cart,
      items: cart.items.map(item => ({
        ...item,
        product: this.products.find(p => p.id === item.product_id)
      }))
    };
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    const existing = cart.items.find(i => i.product_id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        cart_id: cart.id,
        product_id: productId,
        quantity
      });
    }
    this.carts.set(userId, cart);
    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, quantity: number): Promise<Cart> {
    if (quantity <= 0) {
      return this.removeFromCart(userId, itemId);
    }
    const cart = await this.getCart(userId);
    const item = cart.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
    }
    this.carts.set(userId, cart);
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(i => i.id !== itemId);
    this.carts.set(userId, cart);
    return this.getCart(userId);
  }

  async getWishlist(userId: string): Promise<Product[]> {
    if (!this.wishlists.has(userId)) {
      this.wishlists.set(userId, new Set());
    }
    const ids = Array.from(this.wishlists.get(userId)!);
    return this.products.filter(p => ids.includes(p.id));
  }

  async addToWishlist(userId: string, productId: string): Promise<Product[]> {
    if (!this.wishlists.has(userId)) {
      this.wishlists.set(userId, new Set());
    }
    this.wishlists.get(userId)!.add(productId);
    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, productId: string): Promise<Product[]> {
    if (this.wishlists.has(userId)) {
      this.wishlists.get(userId)!.delete(productId);
    }
    return this.getWishlist(userId);
  }

  async createOrder(userId: string, shippingAddress: any, paymentMethod: string): Promise<Order> {
    const cart = await this.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cannot checkout an empty cart');
    }

    const total = cart.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const orderItems: OrderItem[] = cart.items.map(item => ({
      id: `ord_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0,
      product: item.product
    }));

    const order: Order = {
      id: orderId,
      user_id: userId,
      total_amount: total,
      status: 'CONFIRMED',
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
      items: orderItems
    };

    this.orders.unshift(order);
    // Clear cart
    this.carts.set(userId, { ...cart, items: [] });

    return order;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(o => o.user_id === userId);
  }

  async recordEvent(event: UserEvent): Promise<UserEvent> {
    const evt: UserEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      user_id: event.user_id,
      session_id: event.session_id || 'sess_default',
      event_type: event.event_type,
      product_id: event.product_id,
      category_id: event.category_id,
      search_query: event.search_query,
      metadata: event.metadata || {},
      created_at: new Date().toISOString()
    };
    this.events.push(evt);
    return evt;
  }

  async getUserEvents(limit = 50): Promise<UserEvent[]> {
    return this.events.slice(-limit).reverse();
  }

  async recalculateTrending(): Promise<TrendingProduct[]> {
    const stats: Record<string, { views: number; searches: number; carts: number; purchases: number }> = {};
    this.products.forEach(p => {
      stats[p.id] = { views: 0, searches: 0, carts: 0, purchases: 0 };
    });

    this.events.forEach(e => {
      if (e.product_id && stats[e.product_id]) {
        if (e.event_type === 'VIEW_PRODUCT' || e.event_type === 'CLICK_PRODUCT') stats[e.product_id].views++;
        if (e.event_type === 'SEARCH') stats[e.product_id].searches++;
        if (e.event_type === 'ADD_TO_CART') stats[e.product_id].carts++;
        if (e.event_type === 'PURCHASE') stats[e.product_id].purchases++;
      }
    });

    this.trending = this.products.map(p => {
      const c = stats[p.id];
      const score = (c.views * 1) + (c.searches * 1) + (c.carts * 2) + (c.purchases * 5);
      return {
        id: `trend_${p.id}`,
        product_id: p.id,
        score,
        views_count: c.views,
        searches_count: c.searches,
        cart_count: c.carts,
        purchase_count: c.purchases,
        updated_at: new Date().toISOString(),
        product: p
      };
    }).sort((a, b) => b.score - a.score);

    return this.trending;
  }
}

// Database client selector
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseKey) &&
  !supabaseUrl?.includes('your-project') &&
  supabaseUrl?.startsWith('http');

export const db: IDatabaseAdapter = isSupabaseConfigured
  ? new SupabaseAdapter(supabaseUrl!, supabaseKey!)
  : new InMemoryAdapter();

if (isSupabaseConfigured) {
  console.log('[DB] Connected to Live Supabase PostgreSQL database.');
} else {
  console.log('[DB] Notice: Running in Local In-Memory Mode with Seed Catalog.');
  console.log('[DB] To connect to Supabase, update SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env');
}
