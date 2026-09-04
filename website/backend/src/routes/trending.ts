import { FastifyPluginAsync } from 'fastify';
import { trendingService } from '../services/trending.service.js';

export const trendingRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/trending?limit=10
  fastify.get('/trending', async (request, reply) => {
    const { limit } = request.query as { limit?: string };
    const items = await trendingService.getTrending(limit ? parseInt(limit, 10) : 10);
    return reply.send({ success: true, count: items.length, data: items });
  });

  // POST /api/trending/recalculate
  fastify.post('/trending/recalculate', async (request, reply) => {
    const updated = await trendingService.recalculate();
    return reply.send({
      success: true,
      message: 'Trending scores successfully recalculated from user events (Views + Searches + Carts + Purchases)',
      count: updated.length,
      data: updated
    });
  });
};
