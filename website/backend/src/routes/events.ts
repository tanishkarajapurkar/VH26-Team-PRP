import { FastifyPluginAsync } from 'fastify';
import { eventService } from '../services/event.service.js';
import { EventType } from '../db/types.js';

export const eventRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/events
  fastify.post('/events', async (request, reply) => {
    const {
      userId,
      user_id,
      sessionId,
      session_id,
      eventType,
      event_type,
      productId,
      product_id,
      categoryId,
      category_id,
      searchQuery,
      search_query,
      metadata
    } = request.body as any;

    const resolvedUserId = userId || user_id || 'user_guest';
    const resolvedType = (eventType || event_type) as EventType;

    if (!resolvedType) {
      return reply.status(400).send({ success: false, error: 'eventType is required' });
    }

    const recorded = await eventService.trackEvent({
      user_id: resolvedUserId,
      session_id: sessionId || session_id || 'session_default',
      event_type: resolvedType,
      product_id: productId || product_id,
      category_id: categoryId || category_id,
      search_query: searchQuery || search_query,
      metadata
    });

    return reply.status(201).send({
      success: true,
      message: 'Event recorded into Supabase user_events',
      data: recorded
    });
  });

  // GET /api/events (recent events stream for monitoring/debugging)
  fastify.get('/events', async (request, reply) => {
    const { limit } = request.query as { limit?: string };
    const events = await eventService.getRecentEvents(limit ? parseInt(limit, 10) : 50);
    return reply.send({ success: true, count: events.length, data: events });
  });
};
