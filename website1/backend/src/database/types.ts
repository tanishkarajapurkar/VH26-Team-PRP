export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image?: string;
  description?: string;
  subcategories?: Category[];
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  title: string;
  content: string;
  author_name: string;
  verified: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number;
  discount: number;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  brand: string;
  rating: number;
  review_count: number;
  stock: number;
  status: string;
  images?: string[];
  specifications?: Record<string, string>;
  is_flash_sale?: boolean;
  flash_sale_price?: number;
  flash_sale_claimed_percent?: number;
  flash_sale_end_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FlashSale {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  status: string;
  products?: (Product & { sale_price: number; stock_limit: number; sold_count: number })[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  product?: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
}

export interface Order {
  id: string;
  order_number: string;
  session_id: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipping_address: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  payment_method: string;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface TrafficEvent {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number;
  source: string;
  scenario?: string;
  session_id?: string;
  product_id?: string;
}
