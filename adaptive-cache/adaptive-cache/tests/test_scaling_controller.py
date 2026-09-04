import pytest
from core.scaling_controller import ScalingController


class TestScalingController:
    def setup_method(self):
        self.controller = ScalingController(
            initial_capacity=1024 * 1024,  # 1MB
            miss_threshold=0.3,
            sustained_periods=3,
        )

    def test_initial_capacity(self):
        assert self.controller.capacity == 1024 * 1024

    def test_no_scale_on_low_miss_rate(self):
        for i in range(5):
            self.controller.update(miss_rate=0.1, avg_miss_penalty=0.05, now=float(i))
        assert self.controller.capacity == 1024 * 1024

    def test_scale_up_on_sustained_deficit(self):
        # High miss rate for sustained periods
        for i in range(5):
            self.controller.update(miss_rate=0.5, avg_miss_penalty=0.05, now=float(i))
        # Should have scaled up
        assert self.controller.capacity > 1024 * 1024

    def test_scale_down_on_low_miss_rate(self):
        # First scale up
        for i in range(5):
            self.controller.update(miss_rate=0.5, avg_miss_penalty=0.05, now=float(i))
        initial_scaled = self.controller.capacity

        # Then low miss rate
        for i in range(5):
            self.controller.update(miss_rate=0.05, avg_miss_penalty=0.05, now=float(i + 10))

        # Should have scaled down
        assert self.controller.capacity <= initial_scaled

    def test_get_state(self):
        state = self.controller.get_state()
        assert "capacity" in state
        assert "capacity_mb" in state
        assert "deficit_periods" in state

    def test_events_recorded(self):
        # Trigger scale up
        for i in range(5):
            self.controller.update(miss_rate=0.5, avg_miss_penalty=0.05, now=float(i))
        assert len(self.controller.events) > 0
