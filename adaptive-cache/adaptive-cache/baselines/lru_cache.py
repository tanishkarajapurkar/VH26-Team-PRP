from collections import OrderedDict
from typing import Any, Optional


class LRUCache:
    """Least Recently Used cache baseline."""

    def __init__(self, capacity: int, name: str = "lru"):
        self.capacity = capacity
        self.name = name
        self.cache: OrderedDict[str, Any] = OrderedDict()
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
            self.cache.move_to_end(key)
            return self.cache[key]
        self.misses += 1
        self.total_cost += 1.0
        return None

    def put(self, key: str, value: Any, size_bytes: int = 1024, **kwargs):
        if key in self.cache:
            self.cache.move_to_end(key)
            self.cache[key] = value
            return

        while self.current_size + size_bytes > self.capacity and self.cache:
            evicted_key, _ = self.cache.popitem(last=False)
            self.evictions += 1
            self.current_size -= size_bytes  # simplified

        self.cache[key] = value
        self.current_size += size_bytes

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
        pass  # LRU doesn't track window counts
