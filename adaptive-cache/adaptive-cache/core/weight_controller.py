from dataclasses import dataclass
from enum import Enum
from typing import Optional


class Phase(Enum):
    STEADY = "steady"
    SPIKE = "spike"
    SHIFT = "shift"


@dataclass
class WeightPreset:
    """Weight configuration for a phase."""
    w1: float  # recency
    w2: float  # frequency
    w3: float  # cost_efficiency
    w4: float  # freshness

    def as_tuple(self) -> tuple[float, float, float, float]:
        return (self.w1, self.w2, self.w3, self.w4)


# Phase presets
PHASE_PRESETS = {
    Phase.STEADY: WeightPreset(w1=0.15, w2=0.20, w3=0.50, w4=0.15),
    Phase.SPIKE: WeightPreset(w1=0.40, w2=0.35, w3=0.15, w4=0.10),
    Phase.SHIFT: WeightPreset(w1=0.20, w2=0.15, w3=0.25, w4=0.40),
}


class WeightController:
    """EWMA-based dynamic weight adjustment with phase detection."""

    def __init__(self, alpha: float = 0.3, baseline_request_rate: float = 100.0):
        self.alpha = alpha
        self.baseline_request_rate = baseline_request_rate

        # EWMA state
        self.ewma_hit_rate: float = 0.7
        self.ewma_request_rate: float = baseline_request_rate
        self.prev_hit_rate: float = 0.7
        self.hit_rate_change: float = 0.0

        # Current phase and weights
        self.current_phase: Phase = Phase.STEADY
        self.current_weights: tuple[float, float, float, float] = PHASE_PRESETS[Phase.STEADY].as_tuple()

        # History for dashboard
        self.weight_history: list[dict] = []
        self.phase_history: list[dict] = []

    def update(self, hit_rate: float, request_rate: float, now: float) -> tuple[float, float, float, float]:
        """Update EWMA estimates and detect phase changes.

        Returns current weights tuple.
        """
        # Update EWMA
        self.ewma_hit_rate = self.alpha * hit_rate + (1 - self.alpha) * self.ewma_hit_rate
        self.ewma_request_rate = self.alpha * request_rate + (1 - self.alpha) * self.ewma_request_rate

        # Track hit rate change
        self.hit_rate_change = abs(self.ewma_hit_rate - self.prev_hit_rate)
        self.prev_hit_rate = self.ewma_hit_rate

        # Phase detection
        new_phase = self._detect_phase()

        if new_phase != self.current_phase:
            self.current_phase = new_phase
            self.current_weights = PHASE_PRESETS[new_phase].as_tuple()
            self.phase_history.append({
                "time": now,
                "phase": new_phase.value,
                "weights": self.current_weights,
            })

        # Record weight history
        self.weight_history.append({
            "time": now,
            "w1": self.current_weights[0],
            "w2": self.current_weights[1],
            "w3": self.current_weights[2],
            "w4": self.current_weights[3],
            "phase": self.current_phase.value,
        })

        return self.current_weights

    def _detect_phase(self) -> Phase:
        """Detect current phase based on EWMA metrics."""
        # Spike: low hit rate + high request rate
        if self.ewma_hit_rate < 0.3 and self.ewma_request_rate > self.baseline_request_rate * 1.5:
            return Phase.SPIKE

        # Shift: hit rate changing significantly with stable request rate
        if self.hit_rate_change > 0.05 and abs(self.ewma_request_rate - self.baseline_request_rate) < self.baseline_request_rate * 0.3:
            return Phase.SHIFT

        # Default: steady state
        return Phase.STEADY

    def get_state(self) -> dict:
        """Get current controller state for dashboard."""
        return {
            "phase": self.current_phase.value,
            "weights": {
                "w1": round(self.current_weights[0], 3),
                "w2": round(self.current_weights[1], 3),
                "w3": round(self.current_weights[2], 3),
                "w4": round(self.current_weights[3], 3),
            },
            "ewma_hit_rate": round(self.ewma_hit_rate, 4),
            "ewma_request_rate": round(self.ewma_request_rate, 2),
            "hit_rate_change": round(self.hit_rate_change, 4),
        }

    def get_recent_history(self, n: int = 100) -> list[dict]:
        """Get last n weight history entries."""
        return self.weight_history[-n:]
