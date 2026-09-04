import pytest
import time
from core.cache_entry import CacheEntry
from core.scoring_engine import ScoringEngine, BucketedQueues


class TestScoringEngine:
    def setup_method(self):
        self.engine = ScoringEngine()

    def test_compute_score_basic(self):
        entry = CacheEntry(
            key="test",
            value="data",
            size_bytes=1024,
            created_at=0.0,
            last_accessed_at=0.0,
            access_count=5,
            window_access_count=5,
            cost_to_retrieve=0.05,
            staleness_risk=0.0,
        )
        score, dominant = self.engine.compute_score(entry, now=1.0)
        assert 0 <= score <= 1
        assert dominant in ["recency", "frequency", "cost_efficiency", "freshness"]

    def test_recency_score(self):
        entry = CacheEntry(
            key="test",
            value="data",
            size_bytes=1024,
            created_at=0.0,
            last_accessed_at=0.0,
        )
        # Just accessed - should have high recency
        score, _ = self.engine.compute_score(entry, now=0.001)
        assert score > 0

    def test_frequency_score(self):
        entry = CacheEntry(
            key="test",
            value="data",
            size_bytes=1024,
            created_at=0.0,
            last_accessed_at=0.0,
            window_access_count=10,
        )
        score, _ = self.engine.compute_score(entry, now=1.0)
        assert score > 0


class TestBucketedQueues:
    def setup_method(self):
        self.queues = BucketedQueues()

    def test_insert_and_evict(self):
        entry = CacheEntry(
            key="test",
            value="data",
            size_bytes=1024,
            created_at=0.0,
            last_accessed_at=0.0,
            score=0.5,
        )
        self.queues.insert(entry)
        assert self.queues.total_size() == 1

        evicted = self.queues.evict_lowest()
        assert evicted is not None
        assert evicted.key == "test"
        assert self.queues.total_size() == 0

    def test_bucket_transfer(self):
        entry = CacheEntry(
            key="test",
            value="data",
            size_bytes=1024,
            created_at=0.0,
            last_accessed_at=0.0,
            score=0.3,
        )
        self.queues.insert(entry)
        old_bucket = entry.bucket_index

        # Transfer to higher score
        self.queues.transfer(entry, 0.8)
        assert entry.bucket_index != old_bucket

    def test_eviction_order(self):
        # Insert entries with different scores
        for i, score in enumerate([0.1, 0.5, 0.9]):
            entry = CacheEntry(
                key=f"item_{i}",
                value=f"data_{i}",
                size_bytes=1024,
                created_at=float(i),
                last_accessed_at=float(i),
                score=score,
            )
            self.queues.insert(entry)

        # Should evict lowest score first
        evicted = self.queues.evict_lowest()
        assert evicted.key == "item_0"  # score 0.1
