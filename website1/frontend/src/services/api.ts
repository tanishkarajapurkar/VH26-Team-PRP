import { Product, Category, Review, FlashSale, Cart, WishlistItem, Order } from '../types';
import { getSessionId } from './session';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const sessionId = getSessionId();
  const headers = {
    'Content-Type': 'application/json',
    'x-session-id': sessionId,
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP error ${res.status}`);
  }

  return res.json();
}

// Products
export async function fetchProducts(params: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') query.set('category', params.category);
  if (params.brand) query.set('brand', params.brand);
  if (params.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
  if (params.minRating !== undefined) query.set('minRating', params.minRating.toString());
  if (params.sort) query.set('sort', params.sort);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());

  return request(`/products?${query.toString()}`);
}

export async function fetchProductById(id: string): Promise<Product> {
  return request(`/products/${id}`);
}

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  return request(`/products/${productId}/reviews`);
}

export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  return request(`/products/${productId}/related`);
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  return request('/categories');
}

// Search
export async function searchProducts(
  q: string,
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: string;
  } = {}
): Promise<{ results: Product[]; total: number }> {
  const query = new URLSearchParams();
  query.set('q', q);
  if (filters.category && filters.category !== 'all') query.set('category', filters.category);
  if (filters.brand) query.set('brand', filters.brand);
  if (filters.minPrice !== undefined) query.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) query.set('maxPrice', filters.maxPrice.toString());
  if (filters.minRating !== undefined) query.set('minRating', filters.minRating.toString());
  if (filters.sort) query.set('sort', filters.sort);

  return request(`/search?${query.toString()}`);
}

// Flash Sales & Deals
export async function fetchFlashSales(): Promise<FlashSale[]> {
  return request('/flash-sales');
}

export async function fetchDeals(): Promise<Product[]> {
  return request('/deals');
}

export async function fetchRecommendations(): Promise<Product[]> {
  return request('/recommendations');
}

// Cart (Session Based)
export async function fetchCart(): Promise<Cart> {
  return request('/cart');
}

export async function addToCart(productId: string, quantity = 1): Promise<{ success: boolean; cart: Cart }> {
  return request('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  return request(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity })
  });
}

export async function removeFromCart(itemId: string): Promise<Cart> {
  return request(`/cart/items/${itemId}`, {
    method: 'DELETE'
  });
}

// Wishlist (Session Based)
export async function fetchWishlist(): Promise<WishlistItem[]> {
  return request('/wishlist');
}

export async function addToWishlist(productId: string): Promise<WishlistItem[]> {
  return request(`/wishlist/${productId}`, {
    method: 'POST'
  });
}

export async function removeFromWishlist(productId: string): Promise<WishlistItem[]> {
  return request(`/wishlist/${productId}`, {
    method: 'DELETE'
  });
}

// Checkout & Orders
export async function submitCheckout(data: {
  shippingAddress: any;
  paymentMethod: string;
}): Promise<{ success: boolean; message: string; order: Order }> {
  return request('/checkout', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  return request(`/orders/${orderId}`);
}

export async function fetchOrders(): Promise<Order[]> {
  return request('/orders');
}
