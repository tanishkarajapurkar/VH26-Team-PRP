#!/usr/bin/env python3
"""Demo script for Adaptive Cache System.

Runs a replayable demo showing:
1. Steady state traffic
2. Sudden spike (5-10x)
3. Adaptation and recovery
4. Return to steady state
"""

import time
import sys
from core.adaptive_cache import AdaptiveCache
from core.cost_model import ReadHeavyAPICostModel
from workload.workload_generator import WorkloadGenerator
from workload.workload_configs import ReadHeavyAPIConfig
from workload.traffic_patterns import SpikePattern


def print_status(cache, phase, elapsed):
    """Print current cache status."""
    state = cache.get_state()
    phase_emoji = {"steady": "🟢", "spike": "🔴", "shift": "🔵"}

    print(f"\r{phase_emoji.get(phase, '⚪')} [{elapsed:.1f}s] "
          f"Phase: {phase.upper():8s} | "
          f"Hit Rate: {state['hit_rate']*100:5.1f}% | "
          f"Requests: {state['request_count']:6d} | "
          f"Entries: {state['entries']:5d} | "
          f"Evictions: {state['evictions']:4d}", end="", flush=True)


def run_demo():
    """Run the full demo scenario."""
    print("=" * 80)
    print("🧠 ADAPTIVE CACHE MANAGEMENT SYSTEM - DEMO")
    print("=" * 80)
    print()

    # Create cache
    config = ReadHeavyAPIConfig
    cost_model = ReadHeavyAPICostModel()
    cache = AdaptiveCache(config.cache_capacity, cost_model, name="adaptive")

    # Create spike traffic pattern
    pattern = SpikePattern(
        base_rate=config.request_rate,
        spike_multiplier=8.0,
        spike_start=30.0,
        spike_duration=15.0,
    )

    # Create workload generator
    generator = WorkloadGenerator(config, pattern)

    print(f"📊 Configuration:")
    print(f"   Cache capacity: {config.cache_capacity / (1024*1024):.0f} MB")
    print(f"   Total keys: {config.num_keys:,}")
    print(f"   Value size: {config.value_size_bytes} bytes")
    print(f"   Base rate: {config.request_rate} req/s")
    print(f"   Spike: 8x at 30s for 15s")
    print()
    print("Starting workload...")
    print("-" * 80)

    start_time = time.time()
    request_count = 0

    for req in generator.generate(start_time=0.0):
        now = req.time
        elapsed = now

        # Determine current phase
        if 30.0 <= now <= 45.0:
            phase = "spike"
        else:
            phase = "steady"

        # Get from cache
        result = cache.get(req.key, now=now)
        if result is None:
            # Cache miss - simulate fetch and store
            cache.put(req.key, f"value_{req.key}", req.size_bytes, req.miss_cost, now=now)

        request_count += 1

        # Print status every 100 requests
        if request_count % 100 == 0:
            print_status(cache, phase, elapsed)

        # Check if demo is complete
        if elapsed >= config.duration:
            break

    print()  # New line after status
    print("-" * 80)
    print()

    # Final report
    state = cache.get_state()
    print("📋 FINAL REPORT")
    print("=" * 40)
    print(f"   Total requests: {state['request_count']:,}")
    print(f"   Final hit rate: {state['hit_rate']*100:.1f}%")
    print(f"   Total evictions: {state['evictions']:,}")
    print(f"   Total refreshes: {state['refreshes']:,}")
    print(f"   Total cost: ${state['total_cost']:.4f}")
    print()

    # Phase transitions
    phases = cache.weight_controller.phase_history
    if phases:
        print("📊 PHASE TRANSITIONS")
        print("-" * 40)
        for p in phases:
            print(f"   {p['time']:.1f}s: {p['phase'].upper()}")
        print()

    # Weight evolution summary
    print("⚖️  WEIGHT EVOLUTION")
    print("-" * 40)
    print(f"   Final weights: w1={state['weight_controller']['weights']['w1']:.3f} "
          f"w2={state['weight_controller']['weights']['w2']:.3f} "
          f"w3={state['weight_controller']['weights']['w3']:.3f} "
          f"w4={state['weight_controller']['weights']['w4']:.3f}")
    print(f"   Final phase: {state['weight_controller']['phase'].upper()}")
    print()

    print("=" * 80)
    print("✅ Demo complete!")
    print("=" * 80)


if __name__ == "__main__":
    run_demo()
