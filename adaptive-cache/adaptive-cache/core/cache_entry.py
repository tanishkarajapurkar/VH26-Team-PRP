from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass
class CacheEntry:
    """Represents a single entry in the adaptive cache."""

    key: str
    value: Any
    size_bytes: int
    created_at: float
    last_accessed_at: float
    access_count: int = 0
    window_access_count: int = 0
    cost_to_retrieve: float = 0.0
    staleness_risk: float = 0.0
    is_refreshable: bool = False
    score: float = 0.0
    bucket_index: int = 0
    dominant_factor: str = ""

    # Linked list pointers for bucketed queues
    prev: Optional["CacheEntry"] = None
    next: Optional["CacheEntry"] = None

    def access(self, now: float):
        """Record an access event."""
        self.last_accessed_at = now
        self.access_count += 1
        self.window_access_count += 1

    def update_staleness(self, now: float, max_age: float = 300.0):
        """Update staleness risk based on age."""
        age = now - self.created_at
        self.staleness_risk = min(age / max_age, 1.0)
        self.is_refreshable = self.staleness_risk > 0.5
