import dotenv from 'dotenv';
dotenv.config();
import { db } from './database/db.js';

async function main() {
  console.log('[Neon Seed] Initializing database with Neon PostgreSQL...');
  await db.init();
  console.log('[Neon Seed] Database initialized successfully!');
  const cats = await db.getCategories();
  console.log('[Neon Seed] Verified categories in DB:', cats.length);
  const prods = await db.getProducts({});
  console.log('[Neon Seed] Verified products in DB:', prods.total);
  process.exit(0);
}

main().catch(err => {
  console.error('[Neon Seed Error]:', err);
  process.exit(1);
});
