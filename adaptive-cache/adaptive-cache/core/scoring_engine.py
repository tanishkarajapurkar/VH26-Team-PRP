from collections import deque
from typing import Optional
from .cache_entry import CacheEntry


class DoublyLinkedList:
    """Doubly-linked list node wrapper for O(1) removal."""

    def __init__(self):
        self.head: Optional[CacheEntry] = None
        self.tail: Optional[CacheEntry] = None
        self.size = 0

    def push_front(self, entry: CacheEntry):
        """Add entry to front of list."""
        entry.prev = None
        entry.next = self.head
        if self.head:
            self.head.prev = entry
        else:
            self.tail = entry
        self.head = entry
        self.size += 1

    def remove(self, entry: CacheEntry):
        """Remove entry from list in O(1)."""
        if entry.prev:
            entry.prev.next = entry.next
        else:
            self.head = entry.next

        if entry.next:
            entry.next.prev = entry.prev
        else:
            self.tail = entry.prev

        entry.prev = None
        entry.next = None
        self.size -= 1

    def pop_tail(self) -> Optional[CacheEntry]:
        """Remove and return the tail (oldest) entry."""
        if not self.tail:
            return None
        entry = self.tail
        self.remove(entry)
        return entry

    def is_empty(self) -> bool:
        return self.size == 0


class BucketedQueues:
    """16-bucket structure for O(1) score-based eviction (CAMP-inspired)."""

    NUM_BUCKETS = 16

    def __init__(self):
        self.buckets = [DoublyLinkedList() for _ in range(self.NUM_BUCKETS)]
        self.key_to_bucket: dict[str, int] = {}
        self.min_occupied = self.NUM_BUCKETS

    def _bucket_for_score(self, score: float) -> int:
        """Map score [0, 1] to bucket index [0, 15]."""
        clamped = max(0.0, min(1.0, score))
        idx = int(clamped * (self.NUM_BUCKETS - 1))
        return idx

    def insert(self, entry: CacheEntry):
        """Insert entry into appropriate bucket."""
        bucket_idx = self._bucket_for_score(entry.score)
        entry.bucket_index = bucket_idx
        self.buckets[bucket_idx].push_front(entry)
        self.key_to_bucket[entry.key] = bucket_idx
        if bucket_idx < self.min_occupied:
            self.min_occupied = bucket_idx

    def remove(self, entry: CacheEntry):
        """Remove entry from its bucket."""
        bucket_idx = self.key_to_bucket.pop(entry.key, entry.bucket_index)
        self.buckets[bucket_idx].remove(entry)
        # Recalculate min_occupied if needed
        if self.buckets[bucket_idx].is_empty() and bucket_idx == self.min_occupied:
            self._recalc_min()

    def transfer(self, entry: CacheEntry, new_score: float):
        """Move entry to new bucket based on updated score."""
        self.remove(entry)
        entry.score = new_score
        self.insert(entry)

    def evict_lowest(self) -> Optional[CacheEntry]:
        """Evict the oldest entry from the lowest non-empty bucket."""
        for i in range(self.NUM_BUCKETS):
            if not self.buckets[i].is_empty():
                entry = self.buckets[i].pop_tail()
                if entry and entry.key in self.key_to_bucket:
                    del self.key_to_bucket[entry.key]
                return entry
        return None

    def _recalc_min(self):
        """Find the lowest non-empty bucket."""
        for i in range(self.NUM_BUCKETS):
            if not self.buckets[i].is_empty():
                self.min_occupied = i
                return
        self.min_occupied = self.NUM_BUCKETS

    def get_bucket_occupancy(self) -> list[int]:
        """Return occupancy counts for each bucket."""
        return [b.size for b in self.buckets]

    def total_size(self) -> int:
        return sum(b.size for b in self.buckets)


class ScoringEngine:
    """Multi-factor scoring engine with running normalization."""

    def __init__(self):
        self.max_observed_interval = 1.0
        self.max_observed_frequency = 1
        self.max_observed_cost_ratio = 1.0

    def compute_score(
        self,
        entry: CacheEntry,
        now: float,
        weights: tuple[float, float, float, float] = (0.15, 0.20, 0.50, 0.15),
    ) -> tuple[float, str]:
        """Compute weighted score for an entry.

        Returns (score, dominant_factor_name).
        """
        w1, w2, w3, w4 = weights

        # Recency: 1.0 = just accessed, 0.0 = very old
        interval = now - entry.last_accessed_at
        self.max_observed_interval = max(self.max_observed_interval, interval)
        recency = 1.0 - min(interval / max(self.max_observed_interval, 0.001), 1.0)

        # Frequency: normalized by max observed
        self.max_observed_frequency = max(self.max_observed_frequency, entry.window_access_count)
        frequency = entry.window_access_count / max(self.max_observed_frequency, 1)

        # Cost efficiency (GDSF-inspired): expensive to retrieve + small = high score
        cost_ratio = entry.cost_to_retrieve / max(entry.size_bytes, 1)
        self.max_observed_cost_ratio = max(self.max_observed_cost_ratio, cost_ratio)
        cost_efficiency = cost_ratio / max(self.max_observed_cost_ratio, 0.0001)

        # Freshness: 1.0 = fresh, 0.0 = stale
        freshness = 1.0 - entry.staleness_risk

        # Weighted sum
        score = w1 * recency + w2 * frequency + w3 * cost_efficiency + w4 * freshness

        # Determine dominant factor
        factors = {
            "recency": w1 * recency,
            "frequency": w2 * frequency,
            "cost_efficiency": w3 * cost_efficiency,
            "freshness": w4 * freshness,
        }
        dominant = max(factors, key=factors.get)

        return score, dominant

    def rescore_all(
        self,
        entries: list[CacheEntry],
        now: float,
        weights: tuple[float, float, float, float],
    ):
        """Full rescore of all entries (periodic)."""
        # Reset running maxima for fresh normalization
        self.max_observed_interval = 1.0
        self.max_observed_frequency = 1
        self.max_observed_cost_ratio = 1.0

        # First pass: compute new maxima
        for entry in entries:
            interval = now - entry.last_accessed_at
            self.max_observed_interval = max(self.max_observed_interval, interval)
            self.max_observed_frequency = max(self.max_observed_frequency, entry.window_access_count)
            cost_ratio = entry.cost_to_retrieve / max(entry.size_bytes, 1)
            self.max_observed_cost_ratio = max(self.max_observed_cost_ratio, cost_ratio)

        # Second pass: compute scores
        for entry in entries:
            score, dominant = self.compute_score(entry, now, weights)
            entry.score = score
            entry.dominant_factor = dominant
