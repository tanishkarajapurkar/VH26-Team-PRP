import { db } from '../db/client.js';
import { Product, Review } from '../db/types.js';

/**
 * ============================================================================
 * PRODUCT SERVICE
 * ============================================================================
 * CURRENT ARCHITECTURE (Website 1):
 *   ProductService -> Supabase
 *
 * FUTURE ARCHITECTURE (Website 2):
 *   ProductService -> [CACHE ENGINE (Redis / In-Memory Tier)] -> Supabase
 *
 * Notice: This service encapsulates all product data access. When the Cache
 * Engine is introduced later, we simply wrap or intercept calls in this
 * service layer without modifying the controllers, routes, or frontend!
 * ============================================================================
 */
export class ProductService {
  async listProducts(filters?: {
    categoryId?: string;
    sort?: string;
    limit?: number;
    isPrime?: boolean;
  }): Promise<Product[]> {
    // [FUTURE HOOK: Cache Check - if cache.has(key) return cache.get(key)]
    return db.getProducts(filters);
  }

  async getProductById(id: string): Promise<Product | null> {
    // [FUTURE HOOK: Cache Check - if cache.has(`prod:${id}`) return cache.get(`prod:${id}`)]
    return db.getProductById(id);
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return db.getProductReviews(productId);
  }

  async getSimilarProducts(productId: string, limit = 4): Promise<Product[]> {
    return db.getSimilarProducts(productId, limit);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return db.searchProducts(query);
  }

  async getCategories() {
    return db.getCategories();
  }
}

export const productService = new ProductService();
