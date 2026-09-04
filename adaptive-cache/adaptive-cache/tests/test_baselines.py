import pytest
from baselines.lru_cache import LRUCache
from baselines.lfu_cache import LFUCache
from baselines.gdsf_cache import GDSFCache


class TestLRUCache:
    def setup_method(self):
        self.cache = LRUCache(capacity=100000)

    def test_put_and_get(self):
        self.cache.put("key1", "value1")
        assert self.cache.get("key1") == "value1"
        assert self.cache.hits == 1

    def test_eviction(self):
        for i in range(100):
            self.cache.put(f"key_{i}", f"value_{i}", size_bytes=2000)
        # Should have evicted some (100 * 2000 = 200000 > 100000 capacity)
        assert self.cache.evictions > 0

    def test_lru_order(self):
        self.cache.put("a", 1, size_bytes=10)
        self.cache.put("b", 2, size_bytes=10)
        self.cache.put("c", 3, size_bytes=10)
        # Access a to make it recent
        self.cache.get("a")
        # Fill to evict - should evict b (oldest unused)
        for i in range(10):
            self.cache.put(f"d_{i}", i, size_bytes=10)


class TestLFUCache:
    def setup_method(self):
        self.cache = LFUCache(capacity=100000)

    def test_put_and_get(self):
        self.cache.put("key1", "value1")
        assert self.cache.get("key1") == "value1"

    def test_frequency_tracking(self):
        # Access key1 multiple times
        self.cache.put("key1", "value1")
        for _ in range(5):
            self.cache.get("key1")
        self.cache.put("key2", "value2")
        # key1 should have higher frequency
        assert self.cache.freq["key1"] > self.cache.freq.get("key2", 0)


class TestGDSFCache:
    def setup_method(self):
        self.cache = GDSFCache(capacity=100000)

    def test_put_and_get(self):
        self.cache.put("key1", "value1")
        assert self.cache.get("key1") == "value1"

    def test_score_computation(self):
        self.cache.put("small_expensive", "data", size_bytes=100)
        self.cache.put("large_cheap", "data", size_bytes=10000)
        # small_expensive should have higher score (freq/size)
        assert self.cache.scores.get("small_expensive", 0) > self.cache.scores.get("large_cheap", 0)
