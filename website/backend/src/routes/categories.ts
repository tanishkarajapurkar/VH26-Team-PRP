import { FastifyPluginAsync } from 'fastify';
import { productService } from '../services/product.service.js';

export const categoryRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/categories
  fastify.get('/categories', async (request, reply) => {
    const categories = await productService.getCategories();
    return reply.send({ success: true, count: categories.length, data: categories });
  });
};
