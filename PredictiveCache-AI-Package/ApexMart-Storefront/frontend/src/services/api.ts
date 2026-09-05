import { Product, Review, CartItem, Order, CategoryInfo } from '../types/index.js';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(filters?: { category?: string; sort?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.sort) params.append('sort', filters.sort);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('API error in getProducts, falling back:', err);
      return [];
    }
  },

  async getProductById(id: number): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('API error in getProductById:', err);
      return null;
    }
  },

  async getReviews(id: number): Promise<Review[]> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/reviews`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async getSimilar(id: number): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/similar`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async getCategories(): Promise<CategoryInfo[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async search(query: string, category = 'all'): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async getRecommendations(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/recommendations`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async getTrending(): Promise<{ product: Product; score: number }[]> {
    try {
      const res = await fetch(`${API_BASE}/trending`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async createOrder(order: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return await res.json();
  }
};
