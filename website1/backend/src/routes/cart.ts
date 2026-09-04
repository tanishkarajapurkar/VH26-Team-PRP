import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const cartRoutes = Router();

function getSessionId(req: Request): string {
  return (req.headers['x-session-id'] as string) || (req.query.sessionId as string) || 'anon_session';
}

// GET /api/v1/cart
cartRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await db.getCart(sessionId);
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/v1/cart/items
cartRoutes.post('/items', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const result = await db.addToCart(sessionId, productId, quantity);
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PATCH /api/v1/cart/items/:id
cartRoutes.patch('/items/:id', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const { quantity } = req.body;
    const cart = await db.updateCartItem(sessionId, req.params.id as string, quantity);
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /api/v1/cart/items/:id
cartRoutes.delete('/items/:id', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await db.removeFromCart(sessionId, req.params.id as string);
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
