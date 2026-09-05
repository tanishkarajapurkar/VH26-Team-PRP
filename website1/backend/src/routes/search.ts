import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const searchRoutes = Router();

// GET /api/v1/search
searchRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const { category, brand, minPrice, maxPrice, minRating, sort } = req.query;

    const data = await db.search(q, {
      category: category as string,
      brand: brand as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
      sort: sort as string
    });

    res.setHeader('Cache-Control', 'public, max-age=30');
    res.setHeader('X-Cache-Strategy', 'cacheable-search');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
