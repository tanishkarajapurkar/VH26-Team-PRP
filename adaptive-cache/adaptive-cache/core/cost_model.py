from abc import ABC, abstractmethod
from .cache_entry import CacheEntry


class CostModel(ABC):
    """Base class for workload-specific cost models."""

    @abstractmethod
    def miss_cost(self, entry: CacheEntry) -> float:
        """Calculate cost of a cache miss for this entry."""
        pass

    @abstractmethod
    def refresh_cost(self, entry: CacheEntry) -> float:
        """Calculate cost of proactively refreshing this entry."""
        pass

    @abstractmethod
    def should_refresh(self, entry: CacheEntry, threshold: float = 0.7) -> bool:
        """Determine if proactive refresh is worthwhile."""
        pass


class ReadHeavyAPICostModel(CostModel):
    """Cost model for read-heavy API workloads.

    Miss cost = api_latency_ms * $/ms + data_size * $/byte
    """

    def __init__(self, latency_ms: float = 50.0, cost_per_ms: float = 0.0001, cost_per_byte: float = 0.000001):
        self.latency_ms = latency_ms
        self.cost_per_ms = cost_per_ms
        self.cost_per_byte = cost_per_byte

    def miss_cost(self, entry: CacheEntry) -> float:
        latency_cost = self.latency_ms * self.cost_per_ms
        size_cost = entry.size_bytes * self.cost_per_byte
        return latency_cost + size_cost

    def refresh_cost(self, entry: CacheEntry) -> float:
        # Refresh is cheaper than miss (async, no client wait)
        return self.miss_cost(entry) * 0.3

    def should_refresh(self, entry: CacheEntry, threshold: float = 0.7) -> bool:
        return entry.is_refreshable and entry.staleness_risk > threshold


class ComputeHeavyRecommenderCostModel(CostModel):
    """Cost model for compute-heavy recommender workloads.

    Miss cost = cpu_time_s * $/cpu_s + memory_mb * $/mb
    """

    def __init__(self, cpu_time_s: float = 0.5, cost_per_cpu_s: float = 0.001, cost_per_mb: float = 0.0001):
        self.cpu_time_s = cpu_time_s
        self.cost_per_cpu_s = cost_per_cpu_s
        self.cost_per_mb = cost_per_mb

    def miss_cost(self, entry: CacheEntry) -> float:
        cpu_cost = self.cpu_time_s * self.cost_per_cpu_s
        mem_cost = (entry.size_bytes / (1024 * 1024)) * self.cost_per_mb
        return cpu_cost + mem_cost

    def refresh_cost(self, entry: CacheEntry) -> float:
        # Refresh still costs CPU but saves latency
        return self.miss_cost(entry) * 0.5

    def should_refresh(self, entry: CacheEntry, threshold: float = 0.6) -> bool:
        return entry.is_refreshable and entry.cost_to_retrieve > 0.001
