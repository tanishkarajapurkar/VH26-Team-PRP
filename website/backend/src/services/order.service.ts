import { db } from '../db/client.js';
import { Order } from '../db/types.js';

export class OrderService {
  async checkout(userId: string, shippingAddress: any, paymentMethod: string): Promise<Order> {
    return db.createOrder(userId, shippingAddress, paymentMethod);
  }

  async getOrders(userId: string): Promise<Order[]> {
    return db.getOrders(userId);
  }
}

export const orderService = new OrderService();
