import time
from dataclasses import dataclass, field


@dataclass
class RunMetrics:
    """Metrics collected during a single benchmark run."""
    policy_name: str
    scenario: str
    workload: str

    # Timing
    start_time: float = 0.0
    end_time: float = 0.0
    duration: float = 0.0

    # Counters
    total_requests: int = 0
    hits: int = 0
    misses: int = 0
    evictions: int = 0
    refreshes: int = 0

    # Derived
    hit_rate: float = 0.0
    total_cost: float = 0.0

    # Time series
    hit_rate_history: list[dict] = field(default_factory=list)
    cost_history: list[dict] = field(default_factory=list)
    eviction_history: list[dict] = field(default_factory=list)

    # Phase info (adaptive only)
    phase_history: list[dict] = field(default_factory=list)
    weight_history: list[dict] = field(default_factory=list)

    def finalize(self):
        """Compute derived metrics."""
        self.duration = self.end_time - self.start_time
        self.total_requests = self.hits + self.misses
        self.hit_rate = self.hits / max(self.total_requests, 1)

    def to_dict(self) -> dict:
        return {
            "policy": self.policy_name,
            "scenario": self.scenario,
            "workload": self.workload,
            "duration": round(self.duration, 2),
            "total_requests": self.total_requests,
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": round(self.hit_rate, 4),
            "evictions": self.evictions,
            "refreshes": self.refreshes,
            "total_cost": round(self.total_cost, 4),
        }


class MetricsCollector:
    """Collects and aggregates metrics during benchmark runs."""

    def __init__(self):
        self.metrics: list[RunMetrics] = []
        self.current: RunMetrics = None

    def start_run(self, policy_name: str, scenario: str, workload: str) -> RunMetrics:
        """Start collecting metrics for a new run."""
        self.current = RunMetrics(
            policy_name=policy_name,
            scenario=scenario,
            workload=workload,
            start_time=time.time(),
        )
        return self.current

    def record_hit(self, time: float):
        """Record a cache hit."""
        if self.current:
            self.current.hits += 1

    def record_miss(self, time: float, cost: float = 1.0):
        """Record a cache miss."""
        if self.current:
            self.current.misses += 1
            self.current.total_cost += cost

    def record_eviction(self, time: float, key: str, reason: str = "low_score"):
        """Record an eviction event."""
        if self.current:
            self.current.evictions += 1
            self.current.eviction_history.append({
                "time": time,
                "key": key,
                "reason": reason,
            })

    def record_snapshot(self, time: float, hit_rate: float, request_rate: float = 0):
        """Record a time-series snapshot."""
        if self.current:
            self.current.hit_rate_history.append({
                "time": time,
                "hit_rate": hit_rate,
            })
            self.current.cost_history.append({
                "time": time,
                "cost": self.current.total_cost,
            })

    def record_phase(self, time: float, phase: str, weights: dict):
        """Record a phase change (adaptive only)."""
        if self.current:
            self.current.phase_history.append({
                "time": time,
                "phase": phase,
                "weights": weights,
            })

    def end_run(self) -> RunMetrics:
        """Finalize and store current run metrics."""
        if self.current:
            self.current.end_time = time.time()
            self.current.finalize()
            self.metrics.append(self.current)
            result = self.current
            self.current = None
            return result
        return None

    def get_all_metrics(self) -> list[dict]:
        """Get all completed run metrics as dicts."""
        return [m.to_dict() for m in self.metrics]

    def get_comparison_table(self) -> dict:
        """Generate comparison data grouped by scenario and workload."""
        table = {}
        for m in self.metrics:
            key = (m.scenario, m.workload)
            if key not in table:
                table[key] = []
            table[key].append(m.to_dict())
        return table
