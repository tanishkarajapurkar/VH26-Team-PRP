import { FastifyInstance } from 'fastify';
import { cartService } from '../services/cartService.js';

export async function cartRoutes(fastify: FastifyInstance) {
  // GET /api/cart
  fastify.get('/api/cart', async (request) => {
    const query = request.query as { userId?: string };
    const userId = query.userId || 'user_101';
    return await cartService.getCart(userId);
  });

  // POST /api/cart - replace or update cart items
  fastify.post('/api/cart', async (request) => {
    const body = request.body as { userId?: string; items: any[] };
    const userId = body.userId || 'user_101';
    return await cartService.updateCart(userId, body.items || []);
  });
}
