export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  category_id: string;
  stock: number;
  images: string[];
  features: string[];
  is_prime: boolean;
  is_best_seller: boolean;
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  created_at?: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  product?: Product;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  items: CartItem[];
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string;
  product?: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at?: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment_method: string;
  created_at?: string;
  items?: OrderItem[];
}

export type EventType =
  | 'VIEW_PRODUCT'
  | 'SEARCH'
  | 'CLICK_PRODUCT'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'WISHLIST'
  | 'PURCHASE'
  | 'CATEGORY_VIEW';

export interface UserEvent {
  id?: string;
  user_id: string;
  session_id?: string;
  event_type: EventType;
  product_id?: string;
  category_id?: string;
  search_query?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  product_id: string;
  score: number;
  reason?: string;
  updated_at?: string;
  product?: Product;
}

export interface TrendingProduct {
  id: string;
  product_id: string;
  score: number;
  views_count: number;
  searches_count: number;
  cart_count: number;
  purchase_count: number;
  updated_at?: string;
  product?: Product;
}
