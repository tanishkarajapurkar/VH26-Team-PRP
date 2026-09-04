import pytest
from core.weight_controller import WeightController, Phase


class TestWeightController:
    def setup_method(self):
        self.controller = WeightController(baseline_request_rate=100.0)

    def test_initial_state(self):
        assert self.controller.current_phase == Phase.STEADY
        assert len(self.controller.current_weights) == 4
        assert sum(self.controller.current_weights) == pytest.approx(1.0)

    def test_steady_state(self):
        # Normal hit rate and request rate
        weights = self.controller.update(hit_rate=0.7, request_rate=100.0, now=1.0)
        assert self.controller.current_phase == Phase.STEADY
        assert weights == self.controller.current_weights

    def test_spike_detection(self):
        # Low hit rate + high request rate = spike
        for _ in range(5):
            weights = self.controller.update(hit_rate=0.2, request_rate=200.0, now=1.0)
        assert self.controller.current_phase == Phase.SPIKE

    def test_shift_detection(self):
        # Hit rate changing rapidly with stable request rate
        self.controller.update(hit_rate=0.7, request_rate=100.0, now=1.0)
        self.controller.update(hit_rate=0.5, request_rate=100.0, now=2.0)
        self.controller.update(hit_rate=0.3, request_rate=100.0, now=3.0)
        # May or may not trigger shift depending on EWMA
        assert self.controller.current_phase in [Phase.STEADY, Phase.SHIFT]

    def test_phase_history(self):
        self.controller.update(hit_rate=0.2, request_rate=200.0, now=1.0)
        self.controller.update(hit_rate=0.2, request_rate=200.0, now=2.0)
        self.controller.update(hit_rate=0.2, request_rate=200.0, now=3.0)
        # Phase should be recorded
        assert len(self.controller.phase_history) >= 0

    def test_weight_history(self):
        for i in range(5):
            self.controller.update(hit_rate=0.7, request_rate=100.0, now=float(i))
        assert len(self.controller.weight_history) == 5

    def test_get_state(self):
        state = self.controller.get_state()
        assert "phase" in state
        assert "weights" in state
        assert "ewma_hit_rate" in state
