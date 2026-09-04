import time
from typing import Any
from ..core.adaptive_cache import AdaptiveCache
from ..core.cost_model import ReadHeavyAPICostModel, ComputeHeavyRecommenderCostModel
from ..baselines.lru_cache import LRUCache
from ..baselines.lfu_cache import LFUCache
from ..baselines.gdsf_cache import GDSFCache
from ..workload.workload_generator import WorkloadGenerator, Request
from ..workload.workload_configs import ReadHeavyAPIConfig, ComputeHeavyRecommenderConfig
from ..workload.traffic_patterns import SteadyPattern, SpikePattern, PopularityShiftPattern
from .metrics_collector import MetricsCollector


class BenchmarkRunner:
    """Runs the full benchmark matrix: 4 policies × 3 scenarios × 2 workloads."""

    def __init__(self):
        self.collector = MetricsCollector()
        self.results = []

    def run_all(self, verbose: bool = True) -> list[dict]:
        """Run the complete benchmark suite."""
        policies = ["lru", "lfu", "gdsf", "adaptive"]
        scenarios = ["steady", "spike", "shift"]
        workloads = ["read_heavy", "compute_heavy"]

        total = len(policies) * len(scenarios) * len(workloads)
        run_num = 0

        for workload in workloads:
            for scenario in scenarios:
                for policy in policies:
                    run_num += 1
                    if verbose:
                        print(f"[{run_num}/{total}] Running {policy} on {workload}/{scenario}...")

                    result = self.run_single(policy, scenario, workload)
                    self.results.append(result)

                    if verbose:
                        print(f"  Hit rate: {result['hit_rate']:.3f}, Cost: ${result['total_cost']:.4f}")

        return self.results

    def run_single(self, policy: str, scenario: str, workload: str) -> dict:
        """Run a single benchmark configuration."""
        # Select workload config
        if workload == "read_heavy":
            config = ReadHeavyAPIConfig
            cost_model = ReadHeavyAPICostModel()
        else:
            config = ComputeHeavyRecommenderConfig
            cost_model = ComputeHeavyRecommenderCostModel()

        # Select traffic pattern
        pattern = self._get_pattern(scenario, config.request_rate)

        # Create cache
        cache = self._create_cache(policy, config.cache_capacity, cost_model)

        # Generate workload
        generator = WorkloadGenerator(config, pattern)

        # Start metrics collection
        metrics = self.collector.start_run(policy, scenario, workload)

        # Run workload
        now = 0.0
        window_size = 100
        request_count = 0

        for req in generator.generate(start_time=0.0):
            now = req.time

            # Get from cache
            result = cache.get(req.key, now=now)
            if result is not None:
                self.collector.record_hit(now)
            else:
                # Cache miss - simulate fetch
                self.collector.record_miss(now, req.miss_cost)
                # Put into cache
                cache.put(req.key, f"value_{req.key}", req.size_bytes, req.miss_cost, now=now)

            request_count += 1

            # Record snapshot every 100 requests
            if request_count % window_size == 0:
                hit_rate = cache.hits / max(cache.hits + cache.misses, 1)
                self.collector.record_snapshot(now, hit_rate)

                # Record phase for adaptive cache
                if policy == "adaptive" and hasattr(cache, 'weight_controller'):
                    state = cache.weight_controller.get_state()
                    self.collector.record_phase(now, state["phase"], state["weights"])

        # End run
        metrics = self.collector.end_run()
        return metrics.to_dict()

    def _create_cache(self, policy: str, capacity: int, cost_model):
        """Create cache instance for given policy."""
        if policy == "lru":
            return LRUCache(capacity)
        elif policy == "lfu":
            return LFUCache(capacity)
        elif policy == "gdsf":
            return GDSFCache(capacity)
        elif policy == "adaptive":
            return AdaptiveCache(capacity, cost_model)
        else:
            raise ValueError(f"Unknown policy: {policy}")

    def _get_pattern(self, scenario: str, base_rate: float):
        """Get traffic pattern for scenario."""
        if scenario == "steady":
            return SteadyPattern(base_rate=base_rate)
        elif scenario == "spike":
            return SpikePattern(base_rate=base_rate)
        elif scenario == "shift":
            return PopularityShiftPattern(base_rate=base_rate)
        else:
            raise ValueError(f"Unknown scenario: {scenario}")

    def get_results(self) -> list[dict]:
        """Get all benchmark results."""
        return self.results
