import heapq
from typing import Any, Optional


class GDSFCache:
    """Greedy Dual-Size Frequency cache baseline.

    Score = frequency / size, with aging via minimum cost.
    """

    def __init__(self, capacity: int, name: str = "gdsf"):
        self.capacity = capacity
        self.name = name
        self.cache: dict[str, Any] = {}
        self.scores: dict[str, float] = {}
        self.frequency: dict[str, int] = {}
        self.sizes: dict[str, int] = {}
        self.min_cost = 0.0
        self.counter = 0  # tie-breaker
        self.heap: list[tuple[float, int, str]] = []  # (score, counter, key)
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        self.total_cost = 0.0
        self.current_size = 0
        self.request_count = 0

    def get(self, key: str, **kwargs) -> Optional[Any]:
        self.request_count += 1
        if key in self.cache:
            self.hits += 1
            self.frequency[key] = self.frequency.get(key, 0) + 1
            self._update_score(key)
            return self.cache[key]
        self.misses += 1
        self.total_cost += 1.0
        return None

    def put(self, key: str, value: Any, size_bytes: int = 1024, **kwargs):
        if key in self.cache:
            self.cache[key] = value
            self.sizes[key] = size_bytes
            self.frequency[key] = self.frequency.get(key, 0) + 1
            self._update_score(key)
            return

        while self.current_size + size_bytes > self.capacity and self.cache:
            self._evict()
            self.evictions += 1

        self.cache[key] = value
        self.sizes[key] = size_bytes
        self.frequency[key] = 1
        self._update_score(key)
        self.current_size += size_bytes

    def _update_score(self, key: str):
        freq = self.frequency.get(key, 1)
        size = max(self.sizes.get(key, 1), 1)
        self.scores[key] = (freq / size) + self.min_cost
        self.counter += 1
        heapq.heappush(self.heap, (-self.scores[key], self.counter, key))

    def _evict(self):
        while self.heap:
            neg_score, _, key = heapq.heappop(self.heap)
            if key in self.cache:
                # Set min_cost to the evicted item's score for aging
                evicted_size = self.sizes.get(key, 1024)
                self.min_cost = -neg_score
                del self.cache[key]
                del self.scores[key]
                del self.frequency[key]
                del self.sizes[key]
                self.current_size -= evicted_size
                return

    def get_state(self) -> dict:
        return {
            "name": self.name,
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": round(self.hits / max(self.hits + self.misses, 1), 3),
            "evictions": self.evictions,
            "total_cost": round(self.total_cost, 4),
            "entries": len(self.cache),
        }

    def reset_window_counts(self):
        pass
