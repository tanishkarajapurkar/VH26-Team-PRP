import { FastifyPluginAsync } from 'fastify';
import { productService } from '../services/product.service.js';

export const searchRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/search?q=laptop
  fastify.get('/search', async (request, reply) => {
    const { q } = request.query as { q?: string };
    if (!q) {
      return reply.send({ success: true, count: 0, query: '', data: [] });
    }

    const results = await productService.searchProducts(q);
    return reply.send({ success: true, count: results.length, query: q, data: results });
  });
};
