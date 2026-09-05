import { FastifyInstance } from 'fastify';
import { recommendationService } from '../services/recommendationService.js';

export async function recommendationRoutes(fastify: FastifyInstance) {
  // GET recommendations for user
  fastify.get('/api/recommendations', async (request) => {
    const query = request.query as { userId?: string };
    const userId = query.userId || 'user_101';
    return await recommendationService.getRecommendations(userId);
  });
}
