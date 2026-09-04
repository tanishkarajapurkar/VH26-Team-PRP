import { db } from '../db/client.js';
import { Cart } from '../db/types.js';

export class CartService {
  async getCart(userId: string): Promise<Cart> {
    return db.getCart(userId);
  }

  async addItem(userId: string, productId: string, quantity: number = 1): Promise<Cart> {
    return db.addToCart(userId, productId, quantity);
  }

  async updateItem(userId: string, itemId: string, quantity: number): Promise<Cart> {
    return db.updateCartItem(userId, itemId, quantity);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    return db.removeFromCart(userId, itemId);
  }
}

export const cartService = new CartService();
