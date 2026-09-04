import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const flashSaleRoutes = Router();

// GET /api/v1/flash-sales
flashSaleRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const flashSales = await db.getFlashSales();
    res.setHeader('Cache-Control', 'public, max-age=15'); // Rapid changing stock/time
    res.setHeader('X-Cache-Strategy', 'high-traffic-dynamic');
    res.json(flashSales);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/v1/deals
flashSaleRoutes.get('/deals', async (_req: Request, res: Response) => {
  try {
    const deals = await db.getDeals();
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('X-Cache-Strategy', 'cacheable-l1');
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
