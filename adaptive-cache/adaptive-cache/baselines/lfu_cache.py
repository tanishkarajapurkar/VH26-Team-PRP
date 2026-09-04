from collections import defaultdict, OrderedDict
from typing import Any, Optional


class LFUCache:
    """Least Frequently Used cache baseline."""

    def __init__(self, capacity: int, name: str = "lfu"):
        self.capacity = capacity
        self.name = name
        self.cache: dict[str, Any] = {}
        self.freq: dict[str, int] = defaultdict(int)
        self.sizes: dict[str, int] = {}
        self.freq_to_keys: dict[int, OrderedDict] = defaultdict(OrderedDict)
        self.min_freq = 0
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
            self._update_freq(key)
            return self.cache[key]
        self.misses += 1
        self.total_cost += 1.0
        return None

    def put(self, key: str, value: Any, size_bytes: int = 1024, **kwargs):
        if key in self.cache:
            old_size = self.sizes.get(key, size_bytes)
            self.current_size -= old_size
            self.cache[key] = value
            self.sizes[key] = size_bytes
            self.current_size += size_bytes
            self._update_freq(key)
            return

        while self.current_size + size_bytes > self.capacity and self.cache:
            self._evict()
            self.evictions += 1

        self.cache[key] = value
        self.sizes[key] = size_bytes
        self.freq[key] = 1
        self.freq_to_keys[1][key] = True
        self.min_freq = 1
        self.current_size += size_bytes

    def _update_freq(self, key: str):
        f = self.freq[key]
        del self.freq_to_keys[f][key]
        if not self.freq_to_keys[f]:
            del self.freq_to_keys[f]
            if self.min_freq == f:
                self.min_freq = f + 1
        self.freq[key] = f + 1
        self.freq_to_keys[f + 1][key] = True

    def _evict(self):
        if self.min_freq not in self.freq_to_keys or not self.freq_to_keys[self.min_freq]:
            return
        evicted_key, _ = self.freq_to_keys[self.min_freq].popitem(last=False)
        evicted_size = self.sizes.pop(evicted_key, 1024)
        del self.cache[evicted_key]
        del self.freq[evicted_key]
        self.current_size -= evicted_size
        if not self.freq_to_keys[self.min_freq]:
            del self.freq_to_keys[self.min_freq]

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
