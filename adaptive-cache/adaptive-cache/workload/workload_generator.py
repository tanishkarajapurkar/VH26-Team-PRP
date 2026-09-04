import random
import time
from dataclasses import dataclass
from typing import Generator
from .traffic_patterns import TrafficPattern
from .workload_configs import WorkloadConfig


@dataclass
class Request:
    """A single workload request."""
    time: float
    key: str
    size_bytes: int
    miss_cost: float


class WorkloadGenerator:
    """Generates realistic request streams based on traffic patterns."""

    def __init__(self, config: WorkloadConfig, pattern: TrafficPattern, seed: int = 42):
        self.config = config
        self.pattern = pattern
        self.rng = random.Random(seed)

    def generate(self, start_time: float = 0.0) -> Generator[Request, None, None]:
        """Generate requests according to the traffic pattern."""
        current_time = start_time
        end_time = start_time + self.config.duration

        while current_time < end_time:
            # Get current request rate from pattern
            rate = self.pattern.get_request_rate(current_time)

            # Inter-arrival time (Poisson process)
            inter_arrival = self.rng.expovariate(rate)
            current_time += inter_arrival

            if current_time >= end_time:
                break

            # Get key distribution from pattern
            distribution = self.pattern.get_key_distribution(current_time, self.config.num_keys)

            # Sample key from distribution
            key_idx = self._sample_from_distribution(distribution)
            key = f"item_{key_idx}"

            yield Request(
                time=current_time,
                key=key,
                size_bytes=self.config.value_size_bytes,
                miss_cost=self.config.miss_cost,
            )

    def _sample_from_distribution(self, distribution: list[float]) -> int:
        """Sample an index from a probability distribution."""
        r = self.rng.random()
        cumulative = 0.0
        for i, prob in enumerate(distribution):
            cumulative += prob
            if r <= cumulative:
                return i
        return len(distribution) - 1

    def generate_batch(self, num_requests: int, start_time: float = 0.0) -> list[Request]:
        """Generate a fixed number of requests."""
        requests = []
        for req in self.generate(start_time):
            requests.append(req)
            if len(requests) >= num_requests:
                break
        return requests
