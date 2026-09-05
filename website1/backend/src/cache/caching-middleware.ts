/**
 * ============================================================================
 * PREDICTIVECACHE AI: TRANSPARENT EXPRESS CACHING MIDDLEWARE
 * ============================================================================
 * Sits between incoming customer requests and the PostgreSQL / Storage layer.
 * Intercepts GET requests, queries the Rust APTS Cache Engine via TCP :7400,
 * evaluates economic utility U(k), and manages background Markov prefetching.
 * ============================================================================
 */

import { Request, Response, NextFunction } from 'express';
import { aptsCache } from './apts-client.js';
import { predictiveEngine } from './predictive-engine.js';

// Cacheable endpoint prefixes
const CACHEABLE_PREFIXES = [
  '/api/v1/products',
  '/api/v1/categories',
  '/api/v1/flash-sales',
  '/api/v1/deals',
  '/api/v1/recommendations',
  '/api/v1/search',
  '/api/v1/crawler/scrape'
];

export function predictiveCacheMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const url = req.originalUrl || req.url;

  // Check if route matches cacheable patterns
  const isCacheable = CACHEABLE_PREFIXES.some(prefix => url.startsWith(prefix));
  if (!isCacheable) {
    return next();
  }

  const start = performance.now();
  const cacheKey = `apts:${url}`;

  // 1. Check APTS Cache Engine (Rust TCP :7400)
  aptsCache.get(cacheKey).then(cachedValue => {
    if (cachedValue) {
      // CACHE HIT (sub-millisecond data path)
      const durationMs = Math.max(1, Math.round(performance.now() - start));

      predictiveEngine.recordEvent({
        method: req.method,
        path: url,
        isHit: true,
        responseTime: durationMs,
        ttl: 180,
        payloadSize: Buffer.byteLength(cachedValue)
      });

      res.setHeader('X-Cache', 'HIT-APTS');
      res.setHeader('X-Cache-Engine', 'Rust-APTS-Core-v1');
      res.setHeader('X-Response-Time', `${durationMs}ms`);
      res.setHeader('Content-Type', 'application/json');
      return res.send(cachedValue);
    }

    // CACHE MISS: Intercept response to evaluate utility and admit to cache
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    let responseSent = false;

    const handleCacheAdmission = (data: any) => {
      if (responseSent) return;
      responseSent = true;

      const durationMs = Math.max(8, Math.round(performance.now() - start));
      const serialized = typeof data === 'string' ? data : JSON.stringify(data);
      const payloadSizeBytes = Buffer.byteLength(serialized);

      // Evaluate Cost-Aware Economic Utility U(k)
      const evalResult = predictiveEngine.evaluateUtility(url, payloadSizeBytes, durationMs);

      if (evalResult.admit) {
        // Admit into Rust APTS Cache Engine with dynamic surge-scaled TTL
        aptsCache.set(cacheKey, serialized, evalResult.ttl).catch(() => {});
        res.setHeader('X-Cache', 'MISS-STORED');
        res.setHeader('X-Cache-TTL', `${evalResult.ttl}s`);

        // Trigger background Markov lookahead prefetch
        predictiveEngine.triggerMarkovPrefetch(url, async (prefetchPath: string) => {
          try {
            const fetchPort = process.env.PORT || 5001;
            const fetchRes = await fetch(`http://127.0.0.1:${fetchPort}${prefetchPath}`, {
              headers: { 'x-prefetch-worker': 'true' }
            });
            if (fetchRes.ok) {
              return await fetchRes.text();
            }
          } catch {
            // Ignore prewarm error
          }
          return null;
        }).catch(() => {});
      } else {
        res.setHeader('X-Cache', 'BYPASS-REJECTED');
      }

      predictiveEngine.recordEvent({
        method: req.method,
        path: url,
        isHit: false,
        responseTime: durationMs,
        ttl: evalResult.ttl,
        payloadSize: payloadSizeBytes
      });
    };

    res.json = function (body: any) {
      handleCacheAdmission(body);
      return originalJson(body);
    };

    res.send = function (body: any) {
      handleCacheAdmission(body);
      return originalSend(body);
    };

    next();
  }).catch(err => {
    console.warn('[Cache Middleware] Cache lookup exception:', (err as Error).message);
    next();
  });
}
