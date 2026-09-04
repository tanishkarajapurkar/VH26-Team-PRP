import { FastifyPluginAsync } from 'fastify';
import { recommendationService } from '../services/recommendation.service.js';

export const recommendationRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/recommendations?userId=user_101&limit=8
  fastify.get('/recommendations', async (request, reply) => {
    const { userId, limit } = request.query as { userId?: string; limit?: string };
    const recs = await recommendationService.getRecommendations(
      userId,
      limit ? parseInt(limit, 10) : 8
    );
    return reply.send({ success: true, count: recs.length, data: recs });
  });
};
