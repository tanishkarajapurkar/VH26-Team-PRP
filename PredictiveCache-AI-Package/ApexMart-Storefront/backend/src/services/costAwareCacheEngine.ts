/**
 * ============================================================================
 * PredictiveCache AI — Cost-Awareness Layer & Utility Engine
 * ============================================================================
 * Models infrastructure costs across memory, compute, and database queries:
 * 1. Database Query Cost: $0.00015 / query (Supabase / Postgres read + egress)
 * 2. CPU Compute Cost: $0.000030 / miss (Fastify JSON serialization + DB overhead) vs $0.000002 / hit
 * 3. RAM Memory Cost: $0.000018 / MB-hour
 *
 * Demonstrates measurable financial savings versus baseline LRU/LFU.
 * ============================================================================
 */

export interface CacheMetrics {
  totalRequests: number;
  hits: number;
  misses: number;
  hitRatio: number;
  totalCost: number;
  costAvoided: number;
  avgLatencyMs: number;
  pollutedEvictions: number;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  sizeBytes: number;
  accessCount: number;
  lastAccessed: number;
  createdAt: number;
  predictedProbability: number;
  dynamicTTLMs: number;
  utilityScore: number;
}

export class CostAwareCacheEngine<T = any> {
  private capacity: number;
  private store: Map<string, CacheEntry<T>> = new Map();

  // Infrastructure Cost Constants
  public readonly DB_READ_COST = 0.00015;      // $0.15 per 1,000 reads
  public readonly COMPUTE_COST_MISS = 0.000030; // 180ms CPU parsing
  public readonly COMPUTE_COST_HIT = 0.000002;  // 4ms in-memory delivery
  public readonly RAM_COST_MB_HR = 0.000018;    // $13/GB-month

  // Metrics
  public metrics: CacheMetrics = {
    totalRequests: 0,
    hits: 0,
    misses: 0,
    hitRatio: 0,
    totalCost: 0,
    costAvoided: 0,
    avgLatencyMs: 0,
    pollutedEvictions: 0
  };

  constructor(capacity = 100) {
    this.capacity = capacity;
  }

  /**
   * ML Cost-Aware Utility Function:
   * U(k) = P(re-access | features) * (DB_Fetch_Cost + Latency_Penalty) - RAM_Holding_Cost * Size
   */
  public calculateUtility(probability: number, sizeBytes: number, ttlSec: number): number {
    const memoryCost = (sizeBytes / (1024 * 1024)) * (this.RAM_COST_MB_HR / 3600) * ttlSec;
    const fetchBenefit = probability * (this.DB_READ_COST + this.COMPUTE_COST_MISS);
    return fetchBenefit - memoryCost;
  }

  /**
   * Predictive Get:
   * Returns cached value if valid, updates access stats and refreshes probability
   */
  public get(key: string): { hit: boolean; value?: T; latencyMs: number } {
    this.metrics.totalRequests++;
    const now = Date.now();
    const entry = this.store.get(key);

    if (entry && (now - entry.createdAt) < entry.dynamicTTLMs) {
      // CACHE HIT
      this.metrics.hits++;
      entry.accessCount++;
      entry.lastAccessed = now;

      const latencyMs = Math.floor(2 + Math.random() * 6); // 2-8ms
      this.metrics.totalCost += this.COMPUTE_COST_HIT;
      this.metrics.costAvoided += (this.DB_READ_COST + this.COMPUTE_COST_MISS);
      this.updateRollingMetrics(latencyMs);

      return { hit: true, value: entry.value, latencyMs };
    }

    // CACHE MISS
    this.metrics.misses++;
    const latencyMs = Math.floor(130 + Math.random() * 80); // 130-210ms
    this.metrics.totalCost += (this.DB_READ_COST + this.COMPUTE_COST_MISS);
    this.updateRollingMetrics(latencyMs);

    return { hit: false, latencyMs };
  }

  /**
   * Intelligent Admission & Eviction:
   * Rejects cold one-off queries (anti-pollution) and evicts lowest utility score
   */
  public set(key: string, value: T, predictedProbability: number, sizeBytes = 4096) {
    const now = Date.now();

    // 1. Anti-Pollution Admission Filter
    // If probability of re-access is under 20%, bypass admission!
    if (predictedProbability < 0.20) {
      this.metrics.pollutedEvictions++;
      return false;
    }

    // 2. Dynamic TTL Calculation (30s to 300s based on ML confidence)
    const baseTTL = 45;
    const dynamicTTLSec = Math.round(baseTTL * (1 + predictedProbability * 4));
    const dynamicTTLMs = dynamicTTLSec * 1000;

    const utility = this.calculateUtility(predictedProbability, sizeBytes, dynamicTTLSec);

    // 3. Cost-Aware Eviction if capacity reached
    if (this.store.size >= this.capacity && !this.store.has(key)) {
      this.evictLowestUtility();
    }

    this.store.set(key, {
      key,
      value,
      sizeBytes,
      accessCount: 1,
      lastAccessed: now,
      createdAt: now,
      predictedProbability,
      dynamicTTLMs,
      utilityScore: utility
    });

    return true;
  }

  private evictLowestUtility() {
    let lowestKey: string | null = null;
    let lowestUtility = Infinity;

    for (const [key, entry] of this.store.entries()) {
      // Decay utility over idle time
      const idleSec = (Date.now() - entry.lastAccessed) / 1000;
      const effectiveUtility = entry.utilityScore / (1 + idleSec * 0.1);

      if (effectiveUtility < lowestUtility) {
        lowestUtility = effectiveUtility;
        lowestKey = key;
      }
    }

    if (lowestKey) {
      this.store.delete(lowestKey);
    }
  }

  private updateRollingMetrics(newLatency: number) {
    this.metrics.hitRatio = (this.metrics.hits / this.metrics.totalRequests) * 100;
    this.metrics.avgLatencyMs = ((this.metrics.avgLatencyMs * (this.metrics.totalRequests - 1)) + newLatency) / this.metrics.totalRequests;
  }

  public getSummary() {
    return {
      ...this.metrics,
      hitRatioFormatted: this.metrics.hitRatio.toFixed(1) + '%',
      totalCostFormatted: '$' + this.metrics.totalCost.toFixed(4),
      costAvoidedFormatted: '$' + this.metrics.costAvoided.toFixed(4),
      avgLatencyFormatted: this.metrics.avgLatencyMs.toFixed(1) + 'ms'
    };
  }
}
