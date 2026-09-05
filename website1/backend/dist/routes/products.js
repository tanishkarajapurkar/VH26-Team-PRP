import { Router } from 'express';
import { db } from '../database/db.js';
export const productRoutes = Router();
// GET /api/v1/products
productRoutes.get('/', async (req, res) => {
    try {
        const { category, brand, minPrice, maxPrice, minRating, sort, page, limit } = req.query;
        const data = await db.getProducts({
            category: category,
            brand: brand,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            sort: sort,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 24
        });
        res.setHeader('Cache-Control', 'public, max-age=60');
        res.setHeader('X-Cache-Strategy', 'cacheable-l1');
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/v1/products/:id
productRoutes.get('/:id', async (req, res) => {
    try {
        const product = await db.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.setHeader('Cache-Control', 'public, max-age=120');
        res.setHeader('X-Cache-Strategy', 'cacheable-l1');
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/v1/products/:id/reviews
productRoutes.get('/:id/reviews', async (req, res) => {
    try {
        const reviews = await db.getProductReviews(req.params.id);
        res.setHeader('Cache-Control', 'public, max-age=180');
        res.setHeader('X-Cache-Strategy', 'cacheable-l2');
        res.json(reviews);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/v1/products/:id/related
productRoutes.get('/:id/related', async (req, res) => {
    try {
        const related = await db.getRelatedProducts(req.params.id);
        res.setHeader('Cache-Control', 'public, max-age=180');
        res.setHeader('X-Cache-Strategy', 'cacheable-l2');
        res.json(related);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
