import { FastifyPluginAsync } from 'fastify';
import { productService } from '../services/product.service.js';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/products
  fastify.get('/products', async (request, reply) => {
    const { categoryId, sort, limit, isPrime } = request.query as {
      categoryId?: string;
      sort?: string;
      limit?: string;
      isPrime?: string;
    };

    const products = await productService.listProducts({
      categoryId,
      sort,
      limit: limit ? parseInt(limit, 10) : undefined,
      isPrime: isPrime === 'true'
    });

    return reply.send({ success: true, count: products.length, data: products });
  });

  // GET /api/products/:id
  fastify.get('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const product = await productService.getProductById(id);

    if (!product) {
      return reply.status(404).send({ success: false, error: 'Product not found' });
    }

    return reply.send({ success: true, data: product });
  });

  // GET /api/products/:id/reviews
  fastify.get('/products/:id/reviews', async (request, reply) => {
    const { id } = request.params as { id: string };
    const reviews = await productService.getProductReviews(id);
    return reply.send({ success: true, count: reviews.length, data: reviews });
  });

  // GET /api/products/:id/similar
  fastify.get('/products/:id/similar', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { limit } = request.query as { limit?: string };
    const similar = await productService.getSimilarProducts(id, limit ? parseInt(limit, 10) : 4);
    return reply.send({ success: true, count: similar.length, data: similar });
  });
};
