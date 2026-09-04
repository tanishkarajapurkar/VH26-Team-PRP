from dataclasses import dataclass


@dataclass
class ScalingEvent:
    """Record of a scaling decision."""
    time: float
    action: str  # "scale_up" or "scale_down"
    old_capacity: int
    new_capacity: int
    trigger: str  # reason for scaling


class ScalingController:
    """Ski-Rental inspired capacity scaling controller.

    Decides when to "buy" (scale up) vs "rent" (suffer misses).
    Uses sustained deficit detection to avoid oscillation.
    """

    def __init__(
        self,
        initial_capacity: int,
        miss_threshold: float = 0.3,
        sustained_periods: int = 3,
        scale_factor: float = 1.5,
        min_capacity: int = 1024 * 1024,  # 1MB
        max_capacity: int = 500 * 1024 * 1024,  # 500MB
    ):
        self.capacity = initial_capacity
        self.initial_capacity = initial_capacity
        self.miss_threshold = miss_threshold
        self.sustained_periods = sustained_periods
        self.scale_factor = scale_factor
        self.min_capacity = min_capacity
        self.max_capacity = max_capacity

        # Ski-Rental state
        self.deficit_periods = 0
        self.total_rent_cost = 0.0
        self.buy_cost = 0.0
        self.window_miss_rate = 0.0
        self.window_avg_penalty = 0.0
        self.window_duration = 10.0  # seconds

        # History
        self.events: list[ScalingEvent] = []
        self.scale_history: list[dict] = []

    def update(self, miss_rate: float, avg_miss_penalty: float, now: float) -> int:
        """Update scaling state and return current capacity.

        Args:
            miss_rate: Fraction of requests that missed in current window
            avg_miss_penalty: Average cost of a miss
            now: Current time

        Returns:
            Current capacity in bytes
        """
        self.window_miss_rate = miss_rate
        self.window_avg_penalty = avg_miss_penalty

        # Calculate rent cost for this window
        rent_cost = miss_rate * avg_miss_penalty * self.window_duration
        self.total_rent_cost += rent_cost

        # Buy cost is the cost of scaling up
        self.buy_cost = self.capacity * 0.0001  # simplified

        # Check for sustained deficit
        if miss_rate > self.miss_threshold:
            self.deficit_periods += 1
        else:
            self.deficit_periods = max(0, self.deficit_periods - 1)

        # Ski-Rental decision: if deficit sustained long enough, "buy" (scale up)
        if self.deficit_periods >= self.sustained_periods:
            self._scale_up(now)

        # Scale down if hit rate is very high (over-provisioned)
        elif miss_rate < 0.1 and self.capacity > self.initial_capacity:
            self._scale_down(now)

        self.scale_history.append({
            "time": now,
            "capacity": self.capacity,
            "miss_rate": round(miss_rate, 3),
            "deficit_periods": self.deficit_periods,
        })

        return self.capacity

    def _scale_up(self, now: float):
        """Scale up capacity."""
        old = self.capacity
        self.capacity = min(
            int(self.capacity * self.scale_factor),
            self.max_capacity,
        )
        if self.capacity != old:
            self.deficit_periods = 0  # Reset after scaling
            self.events.append(ScalingEvent(
                time=now,
                action="scale_up",
                old_capacity=old,
                new_capacity=self.capacity,
                trigger=f"sustained_deficit_periods={self.sustained_periods}",
            ))

    def _scale_down(self, now: float):
        """Scale down capacity gradually."""
        old = self.capacity
        self.capacity = max(
            int(self.capacity / self.scale_factor),
            self.min_capacity,
            self.initial_capacity,
        )
        if self.capacity != old:
            self.events.append(ScalingEvent(
                time=now,
                action="scale_down",
                old_capacity=old,
                new_capacity=self.capacity,
                trigger="low_miss_rate_overprovisioned",
            ))

    def get_state(self) -> dict:
        """Get current scaling state."""
        return {
            "capacity": self.capacity,
            "capacity_mb": round(self.capacity / (1024 * 1024), 1),
            "deficit_periods": self.deficit_periods,
            "total_rent_cost": round(self.total_rent_cost, 6),
            "buy_cost": round(self.buy_cost, 6),
            "events": len(self.events),
        }

    def get_recent_events(self, n: int = 20) -> list[dict]:
        """Get recent scaling events."""
        return [
            {
                "time": e.time,
                "action": e.action,
                "old_mb": round(e.old_capacity / (1024 * 1024), 1),
                "new_mb": round(e.new_capacity / (1024 * 1024), 1),
                "trigger": e.trigger,
            }
            for e in self.events[-n:]
        ]
