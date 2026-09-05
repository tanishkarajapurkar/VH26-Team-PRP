import { supabase } from '../db/supabase.js';

export class TrendingService {
  // =========================================================================
  // ARCHITECTURAL INTERFACE:
  // TODAY: Calculated from user_events stream (Views + Searches + Cart + Purchases).
  // LATER: AI Engine consumes raw user_events to compute neural trending scores!
  // =========================================================================
  async getTrending() {
    return await supabase.getTrendingProducts();
  }
}

export const trendingService = new TrendingService();
