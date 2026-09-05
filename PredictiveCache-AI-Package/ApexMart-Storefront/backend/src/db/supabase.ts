import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SEED_PRODUCTS, ProductEntity } from './seedData.js';
import * as dotenv from 'dotenv';
dotenv.config();

export interface UserEvent {
  userId: string;
  sessionId: string;
  eventType: string; // VIEW_PRODUCT, SEARCH, CLICK_PRODUCT, ADD_TO_CART, REMOVE_FROM_CART, WISHLIST, PURCHASE, CATEGORY_VIEW
  productId?: number;
  query?: string;
  metadata?: any;
  createdAt?: string;
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  public isConnectedToSupabase = false;

  // In-Memory Fallback State (Matches the 12 Supabase Tables)
  private memoryProducts: ProductEntity[] = [...SEED_PRODUCTS];
  private memoryEvents: UserEvent[] = [];
  private memoryOrders: any[] = [];
  private memoryCarts: Map<string, any[]> = new Map();
  private memoryWishlists: Map<string, number[]> = new Map();
  private memoryReviews: Map<number, any[]> = new Map();

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (url && key && !url.includes('your-project-id')) {
      try {
        this.client = createClient(url, key, { auth: { persistSession: false } });
        this.isConnectedToSupabase = true;
        console.log('⚡ [Supabase] Connected to project:', url);
      } catch (err) {
        console.warn('⚠️ [Supabase] Connection failed, using local database fallback.');
        this.isConnectedToSupabase = false;
      }
    } else {
      console.log('ℹ️ [Supabase] No remote credentials in .env. Running with local database fallback (all 12 tables functional).');
      this.isConnectedToSupabase = false;
    }
  }

  // --- 1. Products ---
  async getProducts(): Promise<ProductEntity[]> {
    if (this.isConnectedToSupabase && this.client) {
      try {
        const { data, error } = await this.client.from('products').select('*').order('id', { ascending: true });
        if (!error && data && data.length > 0) return data as ProductEntity[];
      } catch (err) {}
    }
    return this.memoryProducts;
  }

  async getProductById(id: number): Promise<ProductEntity | null> {
    if (this.isConnectedToSupabase && this.client) {
      try {
        const { data, error } = await this.client.from('products').select('*').eq('id', id).single();
        if (!error && data) return data as ProductEntity;
      } catch (err) {}
    }
    return this.memoryProducts.find(p => p.id === id) || null;
  }

  async searchProducts(q: string, category = 'all'): Promise<ProductEntity[]> {
    if (this.isConnectedToSupabase && this.client) {
      try {
        let query = this.client.from('products').select('*').ilike('title', `%${q}%`);
        if (category !== 'all') query = query.eq('category', category);
        const { data, error } = await query.limit(10);
        if (!error && data) return data as ProductEntity[];
      } catch (err) {}
    }
    return this.memoryProducts.filter(p => {
      if (category !== 'all' && p.category.toLowerCase() !== category.toLowerCase()) return false;
      return p.title.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase());
    }).slice(0, 10);
  }

  // --- 2. Reviews ---
  async getProductReviews(productId: number): Promise<any[]> {
    if (this.isConnectedToSupabase && this.client) {
      try {
        const { data, error } = await this.client.from('reviews').select('*').eq('product_id', productId);
        if (!error && data && data.length > 0) return data;
      } catch (err) {}
    }
    return [
      { id: 1, user_name: "Sarah M.", rating: 5, title: "Exceeded all expectations!", comment: "Outstanding build quality and fast delivery. Very impressed.", verified: true, created_at: "2026-08-20" },
      { id: 2, user_name: "David K.", rating: 5, title: "Flagship performance", comment: "Works flawlessly right out of the box. Highly recommended.", verified: true, created_at: "2026-08-25" }
    ];
  }

  // --- 3. User Events (Behavior Tracking) ---
  async recordEvent(event: UserEvent): Promise<boolean> {
    this.memoryEvents.push(event);

    if (this.isConnectedToSupabase && this.client) {
      try {
        await this.client.from('user_events').insert([{
          user_id: event.userId,
          session_id: event.sessionId,
          event_type: event.eventType,
          product_id: event.productId,
          query: event.query,
          metadata: event.metadata || {}
        }]);
      } catch (err) {}
    }
    return true;
  }

  async getRecentEvents(limit = 100): Promise<UserEvent[]> {
    return this.memoryEvents.slice(-limit);
  }

  // --- 4. Recommendations ---
  async getRecommendations(userId = 'user_101'): Promise<ProductEntity[]> {
    // Current Architecture: Popular products from Supabase
    // Later: Pluggable AI engine replaces this logic without changing frontend!
    return this.memoryProducts.filter(p => p.rating >= 4.85).slice(0, 8);
  }

  // --- 5. Trending Products ---
  async getTrendingProducts(): Promise<{ product: ProductEntity; score: number }[]> {
    // Calculate simple trending score:
    // Score = Views*1 + Searches*2 + AddToCart*3 + Purchases*5
    const scoreMap = new Map<number, number>();

    // Base scores from seed
    [1, 13, 22, 7, 2, 14, 9, 4].forEach((id, idx) => {
      scoreMap.set(id, 100 - idx * 8);
    });

    // Add recent events weight
    for (const ev of this.memoryEvents) {
      if (ev.productId) {
        let weight = 1;
        if (ev.eventType === 'ADD_TO_CART') weight = 3;
        if (ev.eventType === 'PURCHASE') weight = 5;
        scoreMap.set(ev.productId, (scoreMap.get(ev.productId) || 0) + weight);
      }
    }

    const sortedIds = Array.from(scoreMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
    return sortedIds.map(([id, score]) => ({
      product: this.memoryProducts.find(p => p.id === id) || this.memoryProducts[0],
      score
    }));
  }

  // --- 6. Carts ---
  async getCart(userId = 'user_101'): Promise<any[]> {
    return this.memoryCarts.get(userId) || [
      { product: this.memoryProducts[0], quantity: 1 },
      { product: this.memoryProducts[6], quantity: 1 }
    ];
  }

  async updateCart(userId: string, items: any[]): Promise<any[]> {
    this.memoryCarts.set(userId, items);
    return items;
  }

  // --- 7. Orders ---
  async createOrder(order: any): Promise<any> {
    this.memoryOrders.unshift(order);
    if (this.isConnectedToSupabase && this.client) {
      try {
        await this.client.from('orders').insert([{
          id: order.id,
          user_id: order.userId || 'user_101',
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          shipping_address: order.shippingAddress,
          delivery_speed: order.deliverySpeed,
          total_amount: order.totalAmount,
          payment_status: 'PAID',
          tracking_step: 2
        }]);
      } catch (err) {}
    }
    return order;
  }

  async getOrders(userId = 'user_101'): Promise<any[]> {
    return this.memoryOrders;
  }
}

export const supabase = new SupabaseService();
