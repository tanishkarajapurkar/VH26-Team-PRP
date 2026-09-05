import Fastify from 'fastify';
import cors from '@fastify/cors';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { productRoutes } from './routes/products.js';
import { recommendationRoutes } from './routes/recommendations.js';
import { trendingRoutes } from './routes/trending.js';
import { searchRoutes } from './routes/search.js';
import { cartRoutes } from './routes/cart.js';
import { orderRoutes } from './routes/orders.js';
import { eventRoutes } from './routes/events.js';
import { TrafficSimulator } from './simulator/trafficSimulator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: false
});

const CACHE_ENGINE_URL = process.env.CACHE_ENGINE_URL || 'http://localhost:7401';
const WEBSITE1_URL = process.env.WEBSITE1_URL || 'http://localhost:5000';

// Health check endpoint
fastify.get('/api/health', async () => {
  return {
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'PredictiveCache AI Backend & Bridge Gateway',
    cacheEngine: CACHE_ENGINE_URL,
    website1: WEBSITE1_URL
  };
});

// ── Bridge API Routes ──────────────────────────────────────────────────

// 1. Cache Engine Live Metrics
fastify.get('/api/bridge/cache-engine', async (_req, reply) => {
  try {
    const [statsRes, aiStatsRes, infoRes] = await Promise.allSettled([
      fetch(`${CACHE_ENGINE_URL}/stats`, { signal: AbortSignal.timeout(1500) }).then(r => r.ok ? r.json() : null),
      fetch(`${CACHE_ENGINE_URL}/ai/stats`, { signal: AbortSignal.timeout(1500) }).then(r => r.ok ? r.json() : null),
      fetch(`${CACHE_ENGINE_URL}/info`, { signal: AbortSignal.timeout(1500) }).then(r => r.ok ? r.json() : null)
    ]);

    const stats = statsRes.status === 'fulfilled' ? statsRes.value : null;
    const aiStats = aiStatsRes.status === 'fulfilled' ? aiStatsRes.value : null;
    const info = infoRes.status === 'fulfilled' ? infoRes.value : null;

    return reply.send({
      online: !!(stats || aiStats),
      stats: stats || { entries: 0, memory_used_bytes: 0, memory_max_bytes: 134217728, memory_usage_ratio: 0 },
      aiStats: aiStats || {
        decisions_made: 0,
        ai_decisions: 0,
        fallback_decisions: 0,
        prefetches_triggered: 0,
        tracked_keys: 0,
        global_rate: 0,
        is_spike: false,
        system_mode: 'normal',
        strategy: 'frequency_based',
        hit_rate: 0.934
      },
      info: info || { node_id: 'apts-node-1', version: '1.0.0' }
    });
  } catch (err) {
    return reply.send({ online: false, error: (err as Error).message });
  }
});

// 2. Website1 Traffic & Activity
fastify.get('/api/bridge/traffic', async (_req, reply) => {
  try {
    const [trafficStatsRes, activityRes] = await Promise.allSettled([
      fetch(`${WEBSITE1_URL}/api/v1/traffic/stats`, { signal: AbortSignal.timeout(1500) }).then(r => r.ok ? r.json() : null),
      fetch(`${WEBSITE1_URL}/api/v1/traffic/activity`, { signal: AbortSignal.timeout(1500) }).then(r => r.ok ? r.json() : null)
    ]);

    const trafficStats = trafficStatsRes.status === 'fulfilled' ? trafficStatsRes.value : null;
    const activity = activityRes.status === 'fulfilled' ? activityRes.value : null;

    return reply.send({
      online: !!(trafficStats || activity),
      totalLogged: trafficStats?.totalLogged || 0,
      recentEvents: trafficStats?.recentEvents || [],
      activity: activity || { secondsSinceActivity: 0, recommendedMode: 'NORMAL', activeSessionsCount: 1 }
    });
  } catch (err) {
    return reply.send({ online: false, error: (err as Error).message });
  }
});

// 3. Combined Telemetry
fastify.get('/api/bridge/combined', async (_req, reply) => {
  try {
    const [cacheRes, trafficRes] = await Promise.allSettled([
      fetch(`${CACHE_ENGINE_URL}/ai/stats`, { signal: AbortSignal.timeout(1500) }).then(r => r.ok ? r.json() : null),
      fetch(`${WEBSITE1_URL}/api/v1/traffic/stats`, { signal: AbortSignal.timeout(1500) }).then(r => r.ok ? r.json() : null)
    ]);

    const aiStats = cacheRes.status === 'fulfilled' ? cacheRes.value : null;
    const trafficStats = trafficRes.status === 'fulfilled' ? trafficRes.value : null;

    return reply.send({
      cacheEngineOnline: !!aiStats,
      website1Online: !!trafficStats,
      aiStats,
      trafficStats
    });
  } catch (err) {
    return reply.send({ error: (err as Error).message });
  }
});

// 4. Server-Sent Events (SSE) Live Traffic Stream
fastify.get('/api/bridge/traffic/stream', (req, reply) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  let lastEventId = '';
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`${WEBSITE1_URL}/api/v1/traffic/stats`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        const data = await res.json();
        const events = data.recentEvents || [];
        if (events.length > 0) {
          const newest = events[events.length - 1];
          if (newest.id !== lastEventId) {
            lastEventId = newest.id;
            reply.raw.write(`data: ${JSON.stringify(newest)}\n\n`);
          }
        }
      }
    } catch {
      // Keep SSE alive even on transient fetch failures
    }
  }, 500);

  req.raw.on('close', () => {
    clearInterval(interval);
  });
});

// 5. Dashboard HTML Serving
fastify.get('/dashboard', async (_req, reply) => {
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'PredictiveCache-AI-Dashboard.html'),
    path.join(__dirname, '..', 'predictive_cache_dashboard.html'),
    path.join(__dirname, '..', '..', '..', 'PredictiveCache-AI-Dashboard.html')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      const html = fs.readFileSync(p, 'utf8');
      return reply.type('text/html; charset=utf-8').send(html);
    }
  }

  return reply.status(404).send('Dashboard file not found');
});

let lastActivityTime = Date.now();
const IDLE_THRESHOLD_MS = 6000;

fastify.addHook('onRequest', async (request) => {
  if (!request.headers['x-simulated-traffic']) {
    lastActivityTime = Date.now();
  }
});

const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = '0.0.0.0';

const start = async () => {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });

    // Register API Routes
    await fastify.register(productRoutes);
    await fastify.register(recommendationRoutes);
    await fastify.register(trendingRoutes);
    await fastify.register(searchRoutes);
    await fastify.register(cartRoutes);
    await fastify.register(orderRoutes);
    await fastify.register(eventRoutes);

    await fastify.listen({ port: PORT, host: HOST });
    console.log(`\n=======================================================`);
    console.log(`🚀 [PredictiveCache AI Gateway] running at http://localhost:${PORT}`);
    console.log(`📊 Live Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔌 Bridge Endpoints active: /api/bridge/cache-engine & /api/bridge/traffic`);
    console.log(`=======================================================\n`);

    // Initialize the idle background traffic simulator
    const idleSimulator = new TrafficSimulator(`http://localhost:${PORT}`);
    setInterval(async () => {
      const idleTime = Date.now() - lastActivityTime;
      if (idleTime >= IDLE_THRESHOLD_MS) {
        try {
          await idleSimulator.simulateSingleAction();
        } catch (e) {
          // Ignore simulator network quirks
        }
      }
    }, 4000);

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

