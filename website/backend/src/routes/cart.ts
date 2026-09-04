import { FastifyPluginAsync } from 'fastify';
import { cartService } from '../services/cart.service.js';

export const cartRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/cart?userId=user_101
  fastify.get('/cart', async (request, reply) => {
    const { userId } = request.query as { userId?: string };
    if (!userId) {
      return reply.status(400).send({ success: false, error: 'userId query parameter is required' });
    }
    const cart = await cartService.getCart(userId);
    return reply.send({ success: true, data: cart });
  });

  // POST /api/cart
  fastify.post('/cart', async (request, reply) => {
    const { userId, productId, quantity } = request.body as {
      userId: string;
      productId: string;
      quantity?: number;
    };

    if (!userId || !productId) {
      return reply.status(400).send({ success: false, error: 'userId and productId are required' });
    }

    const updatedCart = await cartService.addItem(userId, productId, quantity || 1);
    return reply.send({ success: true, message: 'Item added to cart', data: updatedCart });
  });

  // PUT /api/cart/:id
  fastify.put('/cart/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { userId, quantity } = request.body as { userId: string; quantity: number };

    if (!userId || quantity === undefined) {
      return reply.status(400).send({ success: false, error: 'userId and quantity are required' });
    }

    const updatedCart = await cartService.updateItem(userId, id, quantity);
    return reply.send({ success: true, message: 'Cart item updated', data: updatedCart });
  });

  // DELETE /api/cart/:id
  fastify.delete('/cart/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { userId } = request.query as { userId?: string };

    if (!userId) {
      return reply.status(400).send({ success: false, error: 'userId query parameter is required' });
    }

    const updatedCart = await cartService.removeItem(userId, id);
    return reply.send({ success: true, message: 'Cart item removed', data: updatedCart });
  });
};
