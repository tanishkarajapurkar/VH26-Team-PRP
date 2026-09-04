import time
from collections import defaultdict
from typing import Any, Callable, Optional
from .cache_entry import CacheEntry
from .cost_model import CostModel
from .scoring_engine import ScoringEngine, BucketedQueues
from .weight_controller import WeightController
from .scaling_controller import ScalingController


class AdaptiveCache:
    """Main adaptive cache with multi-factor scoring and dynamic weight adjustment."""

    def __init__(
        self,
        capacity: int,
        cost_model: CostModel,
        name: str = "adaptive",
    ):
        self.capacity = capacity
        self.cost_model = cost_model
        self.name = name

        # Core components
        self.queues = BucketedQueues()
        self.scoring = ScoringEngine()
        self.weight_controller = WeightController(baseline_request_rate=100.0)
        self.scaling_controller = ScalingController(initial_capacity=capacity)

        # Storage
        self.entries: dict[str, CacheEntry] = {}

        # Counters
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        self.refreshes = 0
        self.total_cost = 0.0
        self.current_size = 0
        self.request_count = 0

        # Timing
        self.start_time = 0.0
        self.last_rescore_time = 0.0
        self.rescore_interval = 100  # requests

        # Window tracking
        self.window_hits = 0
        self.window_requests = 0
        self.window_start = 0.0
        self.window_duration = 5.0  # seconds

        # Event callback for dashboard
        self.on_event: Optional[Callable] = None

    def get(self, key: str, now: float = None) -> Optional[Any]:
        """Get value from cache.

        Returns value on hit, None on miss (after fetching from backend).
        """
        if now is None:
            now = time.time()

        self.request_count += 1
        self._update_window(now)

        # Check cache
        if key in self.entries:
            entry = self.entries[key]
            entry.access(now)
            self.hits += 1
            self.window_hits += 1

            # Recompute score with new weights
            weights = self.weight_controller.current_weights
            new_score, dominant = self.scoring.compute_score(entry, now, weights)
            entry.dominant_factor = dominant

            # Transfer to new bucket if score changed significantly
            if abs(new_score - entry.score) > 0.05:
                self.queues.transfer(entry, new_score)
            else:
                entry.score = new_score

            self._emit_event("hit", {
                "key": key,
                "score": round(entry.score, 3),
                "dominant": dominant,
                "bucket": entry.bucket_index,
            })

            return entry.value

        # Cache miss
        self.misses += 1
        self.total_cost += 1.0  # simplified miss cost
        self._emit_event("miss", {"key": key})

        return None

    def put(self, key: str, value: Any, size_bytes: int = 1024, cost_to_retrieve: float = 1.0, now: float = None):
        """Put value into cache."""
        if now is None:
            now = time.time()

        # If key exists, update it
        if key in self.entries:
            entry = self.entries[key]
            entry.value = value
            entry.size_bytes = size_bytes
            entry.cost_to_retrieve = cost_to_retrieve
            entry.access(now)
            entry.update_staleness(now)

            weights = self.weight_controller.current_weights
            new_score, dominant = self.scoring.compute_score(entry, now, weights)
            entry.dominant_factor = dominant
            self.queues.transfer(entry, new_score)
            return

        # Evict if at capacity
        while self.current_size + size_bytes > self.capacity:
            if not self._evict(now):
                break  # Cache is empty

        # Create new entry
        entry = CacheEntry(
            key=key,
            value=value,
            size_bytes=size_bytes,
            created_at=now,
            last_accessed_at=now,
            cost_to_retrieve=cost_to_retrieve,
        )
        entry.update_staleness(now)

        # Compute initial score
        weights = self.weight_controller.current_weights
        score, dominant = self.scoring.compute_score(entry, now, weights)
        entry.score = score
        entry.dominant_factor = dominant

        # Insert into bucketed queues
        self.queues.insert(entry)
        self.entries[key] = entry
        self.current_size += size_bytes

        # Periodic full rescore
        if self.request_count - self.last_rescore_time >= self.rescore_interval:
            self._rescore_all(now)

    def _evict(self, now: float) -> bool:
        """Evict lowest-score entry. Returns True if something was evicted."""
        entry = self.queues.evict_lowest()
        if entry is None:
            return False

        # Check if proactive refresh is better
        if self.cost_model.should_refresh(entry):
            self._emit_event("refresh", {
                "key": entry.key,
                "score": round(entry.score, 3),
                "staleness": round(entry.staleness_risk, 3),
            })
            self.refreshes += 1
            # Put it back with refreshed staleness
            entry.staleness_risk = 0.0
            entry.is_refreshable = False
            entry.created_at = now
            weights = self.weight_controller.current_weights
            new_score, dominant = self.scoring.compute_score(entry, now, weights)
            entry.score = new_score
            entry.dominant_factor = dominant
            self.queues.insert(entry)
            return True

        # Actually evict
        del self.entries[entry.key]
        self.current_size -= entry.size_bytes
        self.evictions += 1

        self._emit_event("eviction", {
            "key": entry.key,
            "score": round(entry.score, 3),
            "dominant": entry.dominant_factor,
            "size": entry.size_bytes,
            "age": round(now - entry.created_at, 1),
        })

        return True

    def _update_window(self, now: float):
        """Update sliding window metrics and trigger weight updates."""
        self.window_requests += 1

        if now - self.window_start >= self.window_duration:
            # Calculate window metrics
            hit_rate = self.window_hits / max(self.window_requests, 1)
            request_rate = self.window_requests / self.window_duration

            # Update weight controller
            self.weight_controller.update(hit_rate, request_rate, now)

            # Update scaling controller
            miss_rate = 1.0 - hit_rate
            avg_penalty = self.total_cost / max(self.misses, 1)
            self.scaling_controller.update(miss_rate, avg_penalty, now)

            # Emit weight update event
            self._emit_event("weight_update", {
                "phase": self.weight_controller.current_phase.value,
                **{f"w{i+1}": round(w, 3) for i, w in enumerate(self.weight_controller.current_weights)},
                "hit_rate": round(hit_rate, 3),
                "request_rate": round(request_rate, 1),
            })

            # Reset window
            self.window_hits = 0
            self.window_requests = 0
            self.window_start = now

            # Reset window counts on entries
            for entry in self.entries.values():
                entry.window_access_count = 0

    def _rescore_all(self, now: float):
        """Periodic full rescore of all entries."""
        entries = list(self.entries.values())
        weights = self.weight_controller.current_weights
        self.scoring.rescore_all(entries, now, weights)

        # Rebuild bucketed queues
        self.queues = BucketedQueues()
        for entry in entries:
            self.queues.insert(entry)

        self.last_rescore_time = self.request_count

        self._emit_event("rescore", {"count": len(entries)})

    def _emit_event(self, event_type: str, data: dict):
        """Emit event to callback if registered."""
        if self.on_event:
            self.on_event(event_type, data)

    def get_state(self) -> dict:
        """Get complete cache state for dashboard."""
        return {
            "name": self.name,
            "capacity": self.capacity,
            "current_size": self.current_size,
            "size_utilization": round(self.current_size / max(self.capacity, 1), 3),
            "entries": len(self.entries),
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": round(self.hits / max(self.hits + self.misses, 1), 3),
            "evictions": self.evictions,
            "refreshes": self.refreshes,
            "total_cost": round(self.total_cost, 4),
            "request_count": self.request_count,
            "bucket_occupancy": self.queues.get_bucket_occupancy(),
            "weight_controller": self.weight_controller.get_state(),
            "scaling_controller": self.scaling_controller.get_state(),
        }

    def reset_window_counts(self):
        """Reset window access counts on all entries."""
        for entry in self.entries.values():
            entry.window_access_count = 0
