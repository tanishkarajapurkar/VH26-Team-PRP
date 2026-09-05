export interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  original_price: number;
  rating: number;
  rating_count: number;
  prime_eligible: boolean;
  stock_count: number;
  image_url: string;
  gallery?: string[];
  badges: string[];
  features: string[];
  specs?: Record<string, string>;
  delivery_info?: string;
  description?: string;
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  deliverySpeed: string;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: string;
  trackingStep: number;
  createdAt: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  banner: string;
  itemCount: number;
}
