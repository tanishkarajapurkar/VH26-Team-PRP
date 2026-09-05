import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_FLASH_SALES, SEED_REVIEWS } from './seed-data.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class DatabaseService {
    pool = null;
    isPostgresConnected = false;
    // In-Memory fallback store
    categories = [];
    products = [];
    flashSales = [];
    reviews = [];
    carts = new Map();
    wishlists = new Map();
    orders = new Map();
    trafficEvents = [];
    constructor() {
        this.seedFallback();
    }
    seedFallback() {
        this.categories = JSON.parse(JSON.stringify(SEED_CATEGORIES));
        this.products = JSON.parse(JSON.stringify(SEED_PRODUCTS));
        this.flashSales = JSON.parse(JSON.stringify(SEED_FLASH_SALES));
        this.reviews = JSON.parse(JSON.stringify(SEED_REVIEWS));
    }
    async init() {
        const dbUrl = process.env.DATABASE_URL;
        if (dbUrl) {
            try {
                this.pool = new pg.Pool({
                    connectionString: dbUrl,
                    max: 20,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 4000
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
                }
                catch (schemaErr) {
                    console.warn('[DB] Notice while executing schema DDL:', schemaErr.message);
                }
                finally {
                    client.release();
                }
            }
            catch (err) {
                console.warn(`[DB] PostgreSQL connection failed (${err.message}). Falling back to high-performance local store.`);
                this.isPostgresConnected = false;
                this.pool = null;
            }
        }
        else {
            console.log('[DB] DATABASE_URL not specified. Running in self-contained local storage engine.');
        }
    }
    // CATEGORIES
    async getCategories() {
        return this.categories;
    }
    async getCategoryById(id) {
        return this.categories.find(c => c.id === id || c.slug === id);
    }
    // PRODUCTS
    async getProducts(filters) {
        let result = [...this.products];
        if (filters.category && filters.category !== 'all') {
            const cat = filters.category.toLowerCase();
            result = result.filter(p => p.category_id.toLowerCase() === cat ||
                p.category_slug?.toLowerCase() === cat ||
                p.category_name?.toLowerCase() === cat);
        }
        if (filters.brand) {
            const brands = filters.brand.split(',').map(b => b.trim().toLowerCase());
            result = result.filter(p => brands.includes(p.brand.toLowerCase()));
        }
        if (filters.minPrice !== undefined) {
            result = result.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            result = result.filter(p => p.price <= filters.maxPrice);
        }
        if (filters.minRating !== undefined) {
            result = result.filter(p => p.rating >= filters.minRating);
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
    async getProductById(id) {
        return this.products.find(p => p.id === id || p.slug === id);
    }
    async getProductReviews(productId) {
        const prodReviews = this.reviews.filter(r => r.product_id === productId);
        if (prodReviews.length > 0)
            return prodReviews;
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
    async getRelatedProducts(productId) {
        const target = await this.getProductById(productId);
        if (!target)
            return this.products.slice(0, 4);
        return this.products
            .filter(p => p.id !== target.id && p.category_id === target.category_id)
            .slice(0, 4);
    }
    // FLASH SALES & DEALS
    async getFlashSales() {
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
    async getDeals() {
        return this.products
            .filter(p => p.discount >= 35)
            .sort((a, b) => b.discount - a.discount);
    }
    async getRecommendations() {
        return this.products.slice(0, 8);
    }
    // SEARCH
    async search(query, filters = {}) {
        const q = query.toLowerCase().trim();
        let matches = this.products.filter(p => {
            const matchText = `${p.name} ${p.description} ${p.brand} ${p.category_name || ''}`.toLowerCase();
            return matchText.includes(q);
        });
        if (filters.category && filters.category !== 'all') {
            matches = matches.filter(p => p.category_id === filters.category || p.category_slug === filters.category);
        }
        if (filters.brand) {
            matches = matches.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
        }
        if (filters.minPrice !== undefined) {
            matches = matches.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            matches = matches.filter(p => p.price <= filters.maxPrice);
        }
        if (filters.minRating !== undefined) {
            matches = matches.filter(p => p.rating >= filters.minRating);
        }
        return { results: matches, total: matches.length };
    }
    // CART (SESSION BASED)
    async getCart(sessionId) {
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
        const subtotal = populatedItems.reduce((sum, item) => sum + (item.product ? item.product.price * item.quantity : 0), 0);
        return {
            id: cart.id,
            session_id: cart.session_id,
            items: populatedItems,
            subtotal
        };
    }
    async addToCart(sessionId, productId, quantity = 1) {
        const cartData = await this.getCart(sessionId);
        const existingItem = cartData.items.find(i => i.product_id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
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
    async updateCartItem(sessionId, itemId, quantity) {
        const cartData = await this.getCart(sessionId);
        if (quantity <= 0) {
            cartData.items = cartData.items.filter(i => i.id !== itemId && i.product_id !== itemId);
        }
        else {
            const item = cartData.items.find(i => i.id === itemId || i.product_id === itemId);
            if (item)
                item.quantity = quantity;
        }
        this.carts.set(sessionId, {
            id: cartData.id,
            session_id: sessionId,
            items: cartData.items
        });
        return await this.getCart(sessionId);
    }
    async removeFromCart(sessionId, itemId) {
        return this.updateCartItem(sessionId, itemId, 0);
    }
    async clearCart(sessionId) {
        const cart = this.carts.get(sessionId);
        if (cart) {
            cart.items = [];
            this.carts.set(sessionId, cart);
        }
    }
    // WISHLIST (SESSION BASED)
    async getWishlist(sessionId) {
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
    async addToWishlist(sessionId, productId) {
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
    async removeFromWishlist(sessionId, productId) {
        const list = this.wishlists.get(sessionId);
        if (list) {
            list.items = list.items.filter(i => i.product_id !== productId);
        }
        return this.getWishlist(sessionId);
    }
    // ORDERS & CHECKOUT
    async createOrder(orderData) {
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
        const newOrder = {
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
    async getOrderById(orderId) {
        return this.orders.get(orderId);
    }
    async getOrders(sessionId) {
        return Array.from(this.orders.values())
            .filter(o => o.session_id === sessionId);
    }
    // TRAFFIC TELEMETRY
    async recordTrafficEvent(event) {
        const fullEvent = {
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
                await this.pool.query(`INSERT INTO traffic_events (id, timestamp, endpoint, method, status_code, response_time, source, scenario, session_id, product_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
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
                ]);
            }
            catch {
                // Silently ignore async DB insert logging errors to not block response
            }
        }
    }
    getTrafficStats() {
        return {
            totalLogged: this.trafficEvents.length,
            recentEvents: this.trafficEvents.slice(-20)
        };
    }
}
export const db = new DatabaseService();
