import { db } from '../db/client.js';
import { Product } from '../db/types.js';

export class WishlistService {
  async getWishlist(userId: string): Promise<Product[]> {
    return db.getWishlist(userId);
  }

  async add(userId: string, productId: string): Promise<Product[]> {
    return db.addToWishlist(userId, productId);
  }

  async remove(userId: string, productId: string): Promise<Product[]> {
    return db.removeFromWishlist(userId, productId);
  }
}

export const wishlistService = new WishlistService();
