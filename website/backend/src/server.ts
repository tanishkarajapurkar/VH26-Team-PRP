import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { productRoutes } from './routes/products.js';
import { categoryRoutes } from './routes/categories.js';
import { searchRoutes } from './routes/search.js';
import { recommendationRoutes } from './routes/recommendations.js';
import { trendingRoutes } from './routes/trending.js';
import { cartRoutes } from './routes/cart.js';
import { orderRoutes } from './routes/orders.js';
import { wishlistRoutes } from './routes/wishlist.js';
import { eventRoutes } from './routes/events.js';
import { trendingService } from './services/trending.service.js';
import { db } from './db/client.js';

dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'warn'
  }
});

// Enable CORS for frontend and simulator
await fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Register API Routes
await fastify.register(productRoutes, { prefix: '/api' });
await fastify.register(categoryRoutes, { prefix: '/api' });
await fastify.register(searchRoutes, { prefix: '/api' });
await fastify.register(recommendationRoutes, { prefix: '/api' });
await fastify.register(trendingRoutes, { prefix: '/api' });
await fastify.register(cartRoutes, { prefix: '/api' });
await fastify.register(orderRoutes, { prefix: '/api' });
await fastify.register(wishlistRoutes, { prefix: '/api' });
await fastify.register(eventRoutes, { prefix: '/api' });

// Health check and root status
fastify.get('/', async () => {
  return {
    name: 'Amazon-Style Store Backend API (Website 1)',
    status: 'online',
    database: db.isSupabaseActive() ? 'Supabase PostgreSQL' : 'Local In-Memory / Seed Catalog',
    endpoints: [
      '/api/products',
      '/api/products/:id',
      '/api/products/:id/reviews',
      '/api/products/:id/similar',
      '/api/categories',
      '/api/search?q=...',
      '/api/trending',
      '/api/recommendations',
      '/api/cart',
      '/api/orders',
      '/api/wishlist',
      '/api/events'
    ]
  };
});

fastify.get('/api/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db.isSupabaseActive() ? 'Supabase PostgreSQL' : 'Local In-Memory / Seed Catalog'
  };
});

// Start periodic background worker to recalculate trending scores every 60s
setInterval(async () => {
  try {
    await trendingService.recalculate();
  } catch (err) {
    // Ignore background periodic errors if idle
  }
}, 60000);

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`=======================================================`);
    console.log(`🚀 Store Backend API running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${db.isSupabaseActive() ? 'Supabase PostgreSQL' : 'Local Seed Catalog'}`);
    console.log(`=======================================================`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
