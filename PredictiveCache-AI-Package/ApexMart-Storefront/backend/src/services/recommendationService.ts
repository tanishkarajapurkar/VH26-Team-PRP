import { supabase } from '../db/supabase.js';

export class RecommendationService {
  // =========================================================================
  // ARCHITECTURAL INTERFACE:
  // TODAY: Reads high-rated / popular items from Supabase.
  // LATER: Insert AI Engine personalized inference without modifying frontend!
  // =========================================================================
  async getRecommendations(userId = 'user_101') {
    return await supabase.getRecommendations(userId);
  }
}

export const recommendationService = new RecommendationService();
