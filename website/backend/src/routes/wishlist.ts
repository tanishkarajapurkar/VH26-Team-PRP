import { FastifyPluginAsync } from 'fastify';
import { wishlistService } from '../services/wishlist.service.js';
import { eventService } from '../services/event.service.js';

export const wishlistRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/wishlist?userId=user_101
  fastify.get('/wishlist', async (request, reply) => {
    const { userId } = request.query as { userId?: string };
    if (!userId) {
      return reply.status(400).send({ success: false, error: 'userId query parameter is required' });
    }
    const wishlist = await wishlistService.getWishlist(userId);
    return reply.send({ success: true, count: wishlist.length, data: wishlist });
  });

  // POST /api/wishlist
  fastify.post('/wishlist', async (request, reply) => {
    const { userId, productId } = request.body as { userId: string; productId: string };
    if (!userId || !productId) {
      return reply.status(400).send({ success: false, error: 'userId and productId are required' });
    }

    const updated = await wishlistService.add(userId, productId);

    // Track WISHLIST event
    await eventService.trackEvent({
      user_id: userId,
      event_type: 'WISHLIST',
      product_id: productId
    });

    return reply.send({ success: true, message: 'Added to wishlist', data: updated });
  });

  // DELETE /api/wishlist/:productId?userId=user_101
  fastify.delete('/wishlist/:productId', async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const { userId } = request.query as { userId?: string };
    if (!userId) {
      return reply.status(400).send({ success: false, error: 'userId query parameter is required' });
    }

    const updated = await wishlistService.remove(userId, productId);
    return reply.send({ success: true, message: 'Removed from wishlist', data: updated });
  });
};
