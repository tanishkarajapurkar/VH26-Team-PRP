import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const orderRoutes = Router();

function getSessionId(req: Request): string {
  return (req.headers['x-session-id'] as string) || (req.query.sessionId as string) || 'anon_session';
}

// POST /api/v1/checkout
orderRoutes.post('/checkout', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const { shippingAddress, paymentMethod, items } = req.body;

    const order = await db.createOrder({
      sessionId,
      shippingAddress,
      paymentMethod,
      items
    });

    res.setHeader('Cache-Control', 'no-store, private');
    res.status(201).json({
      success: true,
      message: 'Payment simulated successfully. Order confirmed.',
      order
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/v1/orders
orderRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const orders = await db.getOrders(sessionId);
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/v1/orders/:id
orderRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await db.getOrderById(req.params.id as string);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
