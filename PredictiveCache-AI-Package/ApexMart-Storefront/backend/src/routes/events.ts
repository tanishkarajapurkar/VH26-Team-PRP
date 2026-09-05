import { FastifyInstance } from 'fastify';
import { eventService } from '../services/eventService.js';
import { UserEvent } from '../db/supabase.js';

export async function eventRoutes(fastify: FastifyInstance) {
  // POST /api/events - collect user telemetry / behavior
  fastify.post('/api/events', async (request, reply) => {
    const body = request.body as UserEvent;
    if (!body || !body.eventType) {
      return reply.status(400).send({ error: 'eventType is required' });
    }
    await eventService.track(body);
    return { success: true };
  });

  // GET /api/events - view recent events (for debugging or future AI training pipelines)
  fastify.get('/api/events', async (request) => {
    const query = request.query as { limit?: string };
    const limit = query.limit ? parseInt(query.limit, 10) : 50;
    return await eventService.getRecent(limit);
  });
}
