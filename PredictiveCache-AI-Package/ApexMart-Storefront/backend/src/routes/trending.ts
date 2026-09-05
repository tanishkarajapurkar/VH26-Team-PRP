import { FastifyInstance } from 'fastify';
import { trendingService } from '../services/trendingService.js';

export async function trendingRoutes(fastify: FastifyInstance) {
  // GET trending products dynamically ranked by engagement score
  fastify.get('/api/trending', async () => {
    return await trendingService.getTrending();
  });
}
