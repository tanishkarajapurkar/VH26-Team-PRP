import { FastifyInstance } from 'fastify';
import { productService } from '../services/productService.js';
import { CATEGORIES } from '../db/seedData.js';

export async function productRoutes(fastify: FastifyInstance) {
  // GET all products with optional filters
  fastify.get('/api/products', async (request, reply) => {
    const query = request.query as { category?: string; sort?: string; minPrice?: string; maxPrice?: string };
    let items = await productService.getAllProducts();

    if (query.category && query.category !== 'all') {
      items = items.filter(p => p.category.toLowerCase() === query.category!.toLowerCase());
    }

    if (query.minPrice) {
      items = items.filter(p => p.price >= parseFloat(query.minPrice!));
    }
    if (query.maxPrice) {
      items = items.filter(p => p.price <= parseFloat(query.maxPrice!));
    }

    if (query.sort === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (query.sort === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (query.sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    }

    return items;
  });

  // GET product categories
  fastify.get('/api/categories', async () => {
    return CATEGORIES;
  });

  // GET single product by ID
  fastify.get('/api/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const product = await productService.getProductById(parseInt(id, 10));
    if (!product) {
      return reply.status(404).send({ error: 'Product not found' });
    }
    return product;
  });

  // GET product reviews
  fastify.get('/api/products/:id/reviews', async (request, reply) => {
    const { id } = request.params as { id: string };
    const reviews = await productService.getReviews(parseInt(id, 10));
    return reviews;
  });

  // GET similar products
  fastify.get('/api/products/:id/similar', async (request, reply) => {
    const { id } = request.params as { id: string };
    const similar = await productService.getSimilar(parseInt(id, 10));
    return similar;
  });
}
