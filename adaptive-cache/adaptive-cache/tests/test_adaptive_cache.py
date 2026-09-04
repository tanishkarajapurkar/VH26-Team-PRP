import pytest
from core.adaptive_cache import AdaptiveCache
from core.cost_model import ReadHeavyAPICostModel


class TestAdaptiveCache:
    def setup_method(self):
        self.cost_model = ReadHeavyAPICostModel()
        self.cache = AdaptiveCache(
            capacity=1024 * 1024,  # 1MB
            cost_model=self.cost_model,
        )

    def test_put_and_get(self):
        self.cache.put("key1", "value1", size_bytes=100, now=1.0)
        result = self.cache.get("key1", now=2.0)
        assert result == "value1"
        assert self.cache.hits == 1

    def test_cache_miss(self):
        result = self.cache.get("nonexistent", now=1.0)
        assert result is None
        assert self.cache.misses == 1

    def test_eviction(self):
        # Fill cache to capacity
        for i in range(10):
            self.cache.put(f"key_{i}", f"value_{i}", size_bytes=100000, now=float(i))

        # This should trigger eviction
        self.cache.put("key_new", "value_new", size_bytes=100000, now=10.0)
        assert self.cache.evictions > 0

    def test_hit_rate(self):
        # Put some items
        for i in range(5):
            self.cache.put(f"key_{i}", f"value_{i}", size_bytes=100, now=float(i))

        # Get them
        for i in range(5):
            self.cache.get(f"key_{i}", now=float(i + 10))

        assert self.cache.hits == 5
        assert self.cache.misses == 0

    def test_get_state(self):
        self.cache.put("key1", "value1", size_bytes=100, now=1.0)
        state = self.cache.get_state()
        assert "hit_rate" in state
        assert "entries" in state
        assert "weight_controller" in state

    def test_window_update(self):
        # Simulate many requests to trigger window update
        for i in range(150):
            self.cache.put(f"key_{i}", f"value_{i}", size_bytes=100, now=float(i * 0.1))
            self.cache.get(f"key_{i}", now=float(i * 0.1 + 0.05))

        # Window should have updated
        assert self.cache.weight_controller.ewma_hit_rate > 0
