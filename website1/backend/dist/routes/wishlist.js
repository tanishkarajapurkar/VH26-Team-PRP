import { Router } from 'express';
import { db } from '../database/db.js';
export const wishlistRoutes = Router();
function getSessionId(req) {
    return req.headers['x-session-id'] || req.query.sessionId || 'anon_session';
}
// GET /api/v1/wishlist
wishlistRoutes.get('/', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const list = await db.getWishlist(sessionId);
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(list);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST /api/v1/wishlist/:productId
wishlistRoutes.post('/:productId', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const list = await db.addToWishlist(sessionId, req.params.productId);
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(list);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE /api/v1/wishlist/:productId
wishlistRoutes.delete('/:productId', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const list = await db.removeFromWishlist(sessionId, req.params.productId);
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(list);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
