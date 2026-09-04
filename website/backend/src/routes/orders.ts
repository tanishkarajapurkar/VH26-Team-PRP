import { FastifyPluginAsync } from 'fastify';
import { orderService } from '../services/order.service.js';
import { eventService } from '../services/event.service.js';

export const orderRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/orders?userId=user_101
  fastify.get('/orders', async (request, reply) => {
    const { userId } = request.query as { userId?: string };
    if (!userId) {
      return reply.status(400).send({ success: false, error: 'userId query parameter is required' });
    }
    const orders = await orderService.getOrders(userId);
    return reply.send({ success: true, count: orders.length, data: orders });
  });

  // POST /api/orders
  fastify.post('/orders', async (request, reply) => {
    const { userId, shippingAddress, paymentMethod } = request.body as {
      userId: string;
      shippingAddress: any;
      paymentMethod?: string;
    };

    if (!userId) {
      return reply.status(400).send({ success: false, error: 'userId is required' });
    }

    try {
      const order = await orderService.checkout(
        userId,
        shippingAddress || {
          fullName: 'Alex Miller',
          street: '123 Amazon Way',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA'
        },
        paymentMethod || 'Amazon Pay / Card ending in 4242'
      );

      // Track PURCHASE event for each item in the order
      if (order.items) {
        for (const item of order.items) {
          await eventService.trackEvent({
            user_id: userId,
            event_type: 'PURCHASE',
            product_id: item.product_id,
            metadata: { orderId: order.id, quantity: item.quantity, price: item.price }
          });
        }
      }

      return reply.send({
        success: true,
        message: 'Order placed successfully',
        data: order
      });
    } catch (err: any) {
      return reply.status(400).send({ success: false, error: err.message });
    }
  });
};
