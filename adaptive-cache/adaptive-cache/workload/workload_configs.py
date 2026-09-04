from dataclasses import dataclass


@dataclass
class WorkloadConfig:
    """Configuration for a workload type."""
    name: str
    num_keys: int
    value_size_bytes: int
    miss_cost: float  # base cost per miss
    cache_capacity: int  # in bytes
    duration: float  # seconds
    request_rate: float  # requests per second


ReadHeavyAPIConfig = WorkloadConfig(
    name="read_heavy_api",
    num_keys=50000,
    value_size_bytes=1024,  # 1KB
    miss_cost=0.05,  # 50ms API latency
    cache_capacity=50 * 1024 * 1024,  # 50MB
    duration=120.0,
    request_rate=100.0,
)

ComputeHeavyRecommenderConfig = WorkloadConfig(
    name="compute_heavy_recommender",
    num_keys=5000,
    value_size_bytes=4096,  # 4KB
    miss_cost=0.5,  # 500ms CPU time
    cache_capacity=200 * 1024 * 1024,  # 200MB
    duration=180.0,
    request_rate=50.0,
)
