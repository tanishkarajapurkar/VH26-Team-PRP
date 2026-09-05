import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const wishlistRoutes = Router();

function getSessionId(req: Request): string {
  return (req.headers['x-session-id'] as string) || (req.query.sessionId as string) || 'anon_session';
}

// GET /api/v1/wishlist
wishlistRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const list = await db.getWishlist(sessionId);
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/v1/wishlist/:productId
wishlistRoutes.post('/:productId', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const list = await db.addToWishlist(sessionId, req.params.productId as string);
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /api/v1/wishlist/:productId
wishlistRoutes.delete('/:productId', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const list = await db.removeFromWishlist(sessionId, req.params.productId as string);
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
