import { Router } from 'express';
import { db } from '../database/db.js';
export const cartRoutes = Router();
function getSessionId(req) {
    return req.headers['x-session-id'] || req.query.sessionId || 'anon_session';
}
// GET /api/v1/cart
cartRoutes.get('/', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const cart = await db.getCart(sessionId);
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST /api/v1/cart/items
cartRoutes.post('/items', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const { productId, quantity = 1 } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'productId is required' });
        }
        const result = await db.addToCart(sessionId, productId, quantity);
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// PATCH /api/v1/cart/items/:id
cartRoutes.patch('/items/:id', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const { quantity } = req.body;
        const cart = await db.updateCartItem(sessionId, req.params.id, quantity);
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE /api/v1/cart/items/:id
cartRoutes.delete('/items/:id', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const cart = await db.removeFromCart(sessionId, req.params.id);
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
