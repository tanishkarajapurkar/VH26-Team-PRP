import { Router } from 'express';
import { db } from '../database/db.js';
export const recommendationRoutes = Router();
// GET /api/v1/recommendations
recommendationRoutes.get('/', async (_req, res) => {
    try {
        const recs = await db.getRecommendations();
        res.setHeader('Cache-Control', 'public, max-age=120');
        res.setHeader('X-Cache-Strategy', 'cacheable-l2');
        res.json(recs);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
