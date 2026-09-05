import { Router } from 'express';
import { db } from '../database/db.js';
export const searchRoutes = Router();
// GET /api/v1/search
searchRoutes.get('/', async (req, res) => {
    try {
        const q = req.query.q || '';
        const { category, brand, minPrice, maxPrice, minRating, sort } = req.query;
        const data = await db.search(q, {
            category: category,
            brand: brand,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            sort: sort
        });
        res.setHeader('Cache-Control', 'public, max-age=30');
        res.setHeader('X-Cache-Strategy', 'cacheable-search');
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
