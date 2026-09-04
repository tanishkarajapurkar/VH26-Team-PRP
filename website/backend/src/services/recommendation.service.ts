import { db } from '../db/client.js';
import { Product } from '../db/types.js';

/**
 * ============================================================================
 * RECOMMENDATION SERVICE
 * ============================================================================
 * CURRENT ARCHITECTURE (Website 1):
 *   Frontend -> /api/recommendations -> RecommendationService -> Supabase
 *   (Returns popular products, category-based picks, or database-driven recs)
 *
 * FUTURE ARCHITECTURE (Website 2):
 *   Frontend -> /api/recommendations -> RecommendationService -> AI ENGINE -> Supabase
 *   (AI Engine consumes user_events stream to compute real-time personalized recommendations)
 *
 * The API contract and frontend remain completely unchanged.
 * ============================================================================
 */
export class RecommendationService {
  async getRecommendations(userId?: string, limit = 8): Promise<Product[]> {
    // [FUTURE HOOK: AI Engine personalization]
    // If AI Engine is enabled, call aiEngine.getPersonalized(userId)
    // Currently: query Supabase database for popular/stored recommendations
    return db.getRecommendations(userId, limit);
  }
}

export const recommendationService = new RecommendationService();
