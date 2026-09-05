import { supabase } from '../db/supabase.js';

export class ProductService {
  // =========================================================================
  // ARCHITECTURAL INTERFACE:
  // TODAY: Reads directly from Supabase.
  // LATER: Insert Cache Engine lookup here without touching the frontend!
  // =========================================================================
  async getAllProducts() {
    return await supabase.getProducts();
  }

  async getProductById(id: number) {
    return await supabase.getProductById(id);
  }

  async search(query: string, category = 'all') {
    return await supabase.searchProducts(query, category);
  }

  async getReviews(id: number) {
    return await supabase.getProductReviews(id);
  }

  async getSimilar(id: number) {
    const p = await supabase.getProductById(id);
    const all = await supabase.getProducts();
    return all.filter(item => item.id !== id && item.category === p?.category).slice(0, 4);
  }
}

export const productService = new ProductService();
