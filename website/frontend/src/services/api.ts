import { Category, Product, Review, Cart, Order, TrendingProduct, EventType } from '../types';

const API_BASE = '/api';

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchProducts(filters?: {
  categoryId?: string;
  sort?: string;
  limit?: number;
  isPrime?: boolean;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.append('categoryId', filters.categoryId);
  if (filters?.sort) params.append('sort', filters.sort);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.isPrime) params.append('isPrime', 'true');

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.data || null;
}

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchSimilarProducts(productId: string, limit = 4): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/${productId}/similar?limit=${limit}`);
  const json = await res.json();
  return json.data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchTrending(limit = 10): Promise<TrendingProduct[]> {
  const res = await fetch(`${API_BASE}/trending?limit=${limit}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchRecommendations(userId?: string, limit = 8): Promise<Product[]> {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  params.append('limit', limit.toString());

  const res = await fetch(`${API_BASE}/recommendations?${params.toString()}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchCart(userId: string): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart?userId=${encodeURIComponent(userId)}`);
  const json = await res.json();
  return json.data || { id: '', user_id: userId, items: [] };
}

export async function addToCart(userId: string, productId: string, quantity = 1): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, quantity })
  });
  const json = await res.json();
  return json.data;
}

export async function updateCartItem(userId: string, itemId: string, quantity: number): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, quantity })
  });
  const json = await res.json();
  return json.data;
}

export async function removeFromCart(userId: string, itemId: string): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart/${itemId}?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  return json.data;
}

export async function fetchWishlist(userId: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/wishlist?userId=${encodeURIComponent(userId)}`);
  const json = await res.json();
  return json.data || [];
}

export async function addToWishlist(userId: string, productId: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId })
  });
  const json = await res.json();
  return json.data || [];
}

export async function removeFromWishlist(userId: string, productId: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/wishlist/${productId}?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  return json.data || [];
}

export async function placeOrder(userId: string, shippingAddress: any, paymentMethod: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, shippingAddress, paymentMethod })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to place order');
  return json.data;
}

export async function fetchOrders(userId: string): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders?userId=${encodeURIComponent(userId)}`);
  const json = await res.json();
  return json.data || [];
}

/**
 * ============================================================================
 * USER EVENT TRACKING DISPATCHER
 * ============================================================================
 * Non-blocking dispatch to POST /api/events -> Supabase user_events
 */
export function trackUserEvent(
  userId: string,
  eventType: EventType,
  payload?: {
    productId?: string;
    categoryId?: string;
    searchQuery?: string;
    metadata?: Record<string, any>;
  }
) {
  try {
    fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        eventType,
        productId: payload?.productId,
        categoryId: payload?.categoryId,
        searchQuery: payload?.searchQuery,
        metadata: payload?.metadata
      })
    }).catch(() => {
      // Non-blocking catch
    });
  } catch (err) {
    // Non-blocking catch
  }
}
