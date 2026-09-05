import { supabase } from '../db/supabase.js';

export class CartService {
  async getCart(userId = 'user_101') {
    return await supabase.getCart(userId);
  }

  async updateCart(userId = 'user_101', items: any[]) {
    return await supabase.updateCart(userId, items);
  }
}

export class OrderService {
  async createOrder(orderData: any) {
    const order = {
      id: `#APX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`,
      userId: orderData.userId || 'user_101',
      customerName: orderData.customerName || 'Alex Chen',
      customerEmail: orderData.customerEmail || 'alex.chen@example.com',
      shippingAddress: orderData.shippingAddress || '742 Evergreen Terrace, Apt 4B, New York, NY 10001',
      deliverySpeed: orderData.deliverySpeed || '⚡ Tomorrow, by 10:00 AM (Prime)',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 345.59,
      paymentStatus: 'PAID',
      trackingStep: 2,
      createdAt: new Date().toISOString()
    };
    return await supabase.createOrder(order);
  }

  async getOrders(userId = 'user_101') {
    return await supabase.getOrders(userId);
  }
}

export const cartService = new CartService();
export const orderService = new OrderService();
