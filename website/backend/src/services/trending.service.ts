import { db } from '../db/client.js';
import { TrendingProduct } from '../db/types.js';

/**
 * ============================================================================
 * TRENDING SERVICE
 * ============================================================================
 * Formula for Website 1:
 *   Trending Score = (Views * 1) + (Searches * 1) + (Cart Additions * 2) + (Purchases * 5)
 *
 * Stored in `trending_products` table and exposed via GET /api/trending.
 * Recalculated on demand or via background timer.
 * Later, AI models can replace or enhance the weighting algorithms without altering the API.
 * ============================================================================
 */
export class TrendingService {
  async getTrending(limit = 10): Promise<TrendingProduct[]> {
    return db.getTrendingProducts(limit);
  }

  async recalculate(): Promise<TrendingProduct[]> {
    return db.recalculateTrending();
  }
}

export const trendingService = new TrendingService();
