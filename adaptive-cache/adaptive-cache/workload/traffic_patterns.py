import math
import random
from abc import ABC, abstractmethod


class TrafficPattern(ABC):
    """Base class for traffic patterns."""

    @abstractmethod
    def get_request_rate(self, time: float) -> float:
        """Return request rate at given time."""
        pass

    @abstractmethod
    def get_key_distribution(self, time: float, num_keys: int) -> list[float]:
        """Return probability distribution over keys at given time."""
        pass


class SteadyPattern(TrafficPattern):
    """Constant Poisson arrivals with Zipf key distribution."""

    def __init__(self, base_rate: float = 100.0, zipf_alpha: float = 1.0):
        self.base_rate = base_rate
        self.zipf_alpha = zipf_alpha

    def get_request_rate(self, time: float) -> float:
        return self.base_rate

    def get_key_distribution(self, time: float, num_keys: int) -> list[float]:
        return self._zipf_distribution(num_keys, self.zipf_alpha)

    def _zipf_distribution(self, n: int, alpha: float) -> list[float]:
        """Generate Zipf distribution."""
        ranks = list(range(1, n + 1))
        weights = [1.0 / (r ** alpha) for r in ranks]
        total = sum(weights)
        return [w / total for w in weights]


class SpikePattern(TrafficPattern):
    """Baseline rate with sudden 5-10x burst window."""

    def __init__(
        self,
        base_rate: float = 100.0,
        spike_multiplier: float = 8.0,
        spike_start: float = 30.0,
        spike_duration: float = 15.0,
        zipf_alpha: float = 1.0,
    ):
        self.base_rate = base_rate
        self.spike_multiplier = spike_multiplier
        self.spike_start = spike_start
        self.spike_duration = spike_duration
        self.zipf_alpha = zipf_alpha

    def get_request_rate(self, time: float) -> float:
        if self.spike_start <= time <= self.spike_start + self.spike_duration:
            return self.base_rate * self.spike_multiplier
        return self.base_rate

    def get_key_distribution(self, time: float, num_keys: int) -> list[float]:
        # During spike, shift to more uniform distribution (new keys appearing)
        if self.spike_start <= time <= self.spike_start + self.spike_duration:
            return self._zipf_distribution(num_keys, 0.5)  # More uniform
        return self._zipf_distribution(num_keys, self.zipf_alpha)

    def _zipf_distribution(self, n: int, alpha: float) -> list[float]:
        ranks = list(range(1, n + 1))
        weights = [1.0 / (r ** alpha) for r in ranks]
        total = sum(weights)
        return [w / total for w in weights]


class PopularityShiftPattern(TrafficPattern):
    """Gradually rotating hot key set."""

    def __init__(
        self,
        base_rate: float = 100.0,
        num_keys: int = 1000,
        shift_period: float = 60.0,
        zipf_alpha: float = 1.0,
    ):
        self.base_rate = base_rate
        self.num_keys = num_keys
        self.shift_period = shift_period
        self.zipf_alpha = zipf_alpha

    def get_request_rate(self, time: float) -> float:
        return self.base_rate

    def get_key_distribution(self, time: float, num_keys: int) -> list[float]:
        # Rotate the hot set based on time
        offset = int(time / self.shift_period) % num_keys

        ranks = list(range(1, num_keys + 1))
        weights = []
        for r in ranks:
            # Shifted Zipf: hot keys rotate
            shifted_r = ((r - 1 + offset) % num_keys) + 1
            weights.append(1.0 / (shifted_r ** self.zipf_alpha))

        total = sum(weights)
        return [w / total for w in weights]
