import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const productRoutes = Router();

// GET /api/v1/products
productRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page,
      limit
    } = req.query;

    const data = await db.getProducts({
      category: category as string,
      brand: brand as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
      sort: sort as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 24
    });

    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('X-Cache-Strategy', 'cacheable-l1');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/v1/products/:id
productRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await db.getProductById(req.params.id as string);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.setHeader('Cache-Control', 'public, max-age=120');
    res.setHeader('X-Cache-Strategy', 'cacheable-l1');
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/v1/products/:id/reviews
productRoutes.get('/:id/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await db.getProductReviews(req.params.id as string);
    res.setHeader('Cache-Control', 'public, max-age=180');
    res.setHeader('X-Cache-Strategy', 'cacheable-l2');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/v1/products/:id/related
productRoutes.get('/:id/related', async (req: Request, res: Response) => {
  try {
    const related = await db.getRelatedProducts(req.params.id as string);
    res.setHeader('Cache-Control', 'public, max-age=180');
    res.setHeader('X-Cache-Strategy', 'cacheable-l2');
    res.json(related);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
