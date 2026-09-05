import { FastifyInstance } from 'fastify';
import { orderService } from '../services/cartService.js';

export async function orderRoutes(fastify: FastifyInstance) {
  // GET /api/orders
  fastify.get('/api/orders', async (request) => {
    const query = request.query as { userId?: string };
    const userId = query.userId || 'user_101';
    return await orderService.getOrders(userId);
  });

  // POST /api/orders - place new order
  fastify.post('/api/orders', async (request, reply) => {
    const body = request.body as any;
    if (!body || !body.items || body.items.length === 0) {
      return reply.status(400).send({ error: 'Order must contain items' });
    }
    const order = await orderService.createOrder(body);
    return order;
  });
}
