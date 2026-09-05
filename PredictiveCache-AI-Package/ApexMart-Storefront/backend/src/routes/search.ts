import { FastifyInstance } from 'fastify';
import { productService } from '../services/productService.js';

export async function searchRoutes(fastify: FastifyInstance) {
  // GET /api/search?q=...&category=...
  fastify.get('/api/search', async (request) => {
    const query = request.query as { q?: string; category?: string };
    const q = query.q || '';
    const category = query.category || 'all';

    if (!q.trim()) {
      return [];
    }

    return await productService.search(q, category);
  });
}
