export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
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
  product?: Product;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
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
  created_at: string;
  items?: OrderItem[];
}

export interface TrendingProduct {
  id: string;
  product_id: string;
  score: number;
  views_count: number;
  searches_count: number;
  cart_count: number;
  purchase_count: number;
  product?: Product;
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
