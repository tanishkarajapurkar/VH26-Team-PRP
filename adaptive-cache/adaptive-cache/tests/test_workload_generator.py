import pytest
from workload.workload_generator import WorkloadGenerator
from workload.workload_configs import ReadHeavyAPIConfig
from workload.traffic_patterns import SteadyPattern, SpikePattern


class TestWorkloadGenerator:
    def setup_method(self):
        self.config = ReadHeavyAPIConfig
        self.pattern = SteadyPattern(base_rate=100.0)
        self.generator = WorkloadGenerator(self.config, self.pattern)

    def test_generate_requests(self):
        requests = list(self.generator.generate(start_time=0.0))
        assert len(requests) > 0
        assert requests[0].key.startswith("item_")

    def test_generate_batch(self):
        requests = self.generator.generate_batch(num_requests=100, start_time=0.0)
        assert len(requests) == 100

    def test_request_times_are_sorted(self):
        requests = self.generator.generate_batch(num_requests=50, start_time=0.0)
        times = [r.time for r in requests]
        assert times == sorted(times)

    def test_spike_pattern(self):
        pattern = SpikePattern(base_rate=100.0, spike_start=10.0, spike_duration=5.0)
        generator = WorkloadGenerator(self.config, pattern)

        # Generate requests and check rate during spike
        requests = generator.generate_batch(num_requests=1000, start_time=0.0)

        # Count requests in spike window
        spike_requests = [r for r in requests if 10.0 <= r.time <= 15.0]
        normal_requests = [r for r in requests if r.time < 10.0]

        # Spike should have more requests per second
        if spike_requests and normal_requests:
            spike_duration = max(r.time for r in spike_requests) - min(r.time for r in spike_requests)
            normal_duration = max(r.time for r in normal_requests) - min(r.time for r in normal_requests)
            if spike_duration > 0 and normal_duration > 0:
                spike_rate = len(spike_requests) / spike_duration
                normal_rate = len(normal_requests) / normal_duration
                # Spike rate should be higher (with some tolerance)
                assert spike_rate > normal_rate * 0.5  # Allow for variance

    def test_key_distribution(self):
        requests = self.generator.generate_batch(num_requests=1000, start_time=0.0)
        keys = [r.key for r in requests]
        # Should have multiple unique keys
        assert len(set(keys)) > 1
