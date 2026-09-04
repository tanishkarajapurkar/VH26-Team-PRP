import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const categoryRoutes = Router();

// GET /api/v1/categories
categoryRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await db.getCategories();
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Cache-Strategy', 'cacheable-l1');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/v1/categories/:id/products
categoryRoutes.get('/:id/products', async (req: Request, res: Response) => {
  try {
    const data = await db.getProducts({
      category: req.params.id as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 24
    });
    res.setHeader('Cache-Control', 'public, max-age=120');
    res.setHeader('X-Cache-Strategy', 'cacheable-l1');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
