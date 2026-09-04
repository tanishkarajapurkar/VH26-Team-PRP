# 🧠 Adaptive, Application-Aware Cache Management System

An intelligent cache management system that goes beyond static LRU/LFU policies by using a weighted multi-factor scoring engine that adapts at runtime based on workload conditions.

## 🎯 Overview

This system implements:

- **Multi-factor scoring engine** with GDSF-inspired cost efficiency
- **Bucketed queues** (CAMP-inspired) for O(1) score-based eviction
- **EWMA-based dynamic weight adjustment** with phase detection (steady/spike/shift)
- **Ski-Rental algorithm** for cost-aware capacity scaling
- **Per-workload cost models** (Read-Heavy API vs Compute-Heavy Recommender)
- **Real-time React dashboard** with WebSocket streaming

## 🏗️ Architecture

```
adaptive-cache/
├── core/                    # Core cache engine
│   ├── cache_entry.py       # CacheEntry dataclass
│   ├── scoring_engine.py    # Multi-factor scoring + bucketed queues
│   ├── adaptive_cache.py    # Main cache class
│   ├── weight_controller.py # EWMA phase detection
│   ├── cost_model.py        # Per-workload cost models
│   └── scaling_controller.py # Ski-Rental scaling
├── workload/                # Workload generation
├── baselines/               # LRU/LFU/GDSF baselines
├── benchmarking/            # 24-run benchmark suite
├── server/                  # Flask + Socket.IO backend
├── dashboard/               # React frontend
└── tests/                   # Unit tests
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+

### Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install dashboard dependencies
cd dashboard
npm install
cd ..
```

### Running the Demo

```bash
# Run the interactive demo
python run.py demo

# Start the dashboard server
python run.py server

# Run the full benchmark suite
python run.py benchmark
```

### Dashboard

1. Start the server: `python run.py server`
2. Open http://localhost:5000
3. Click "Start" to begin the workload
4. Watch the real-time metrics, weight evolution, and phase changes

## 📊 Scoring Formula

```
Score(x) = w1·Recency(x) + w2·Frequency(x) + w3·CostEfficiency(x) + w4·Freshness(x)
```

### Dynamic Weights by Phase

| Phase | w1 (Recency) | w2 (Frequency) | w3 (Cost) | w4 (Freshness) |
|-------|--------------|----------------|-----------|----------------|
| **Steady** | 0.15 | 0.20 | 0.50 | 0.15 |
| **Spike** | 0.40 | 0.35 | 0.15 | 0.10 |
| **Shift** | 0.20 | 0.15 | 0.25 | 0.40 |

## 🧪 Benchmarking

The system runs a 24-run experiment matrix:
- **4 policies:** LRU, LFU, GDSF, Adaptive
- **3 scenarios:** Steady, Spike, Popularity Shift
- **2 workloads:** Read-Heavy API, Compute-Heavy Recommender

```bash
# Run benchmarks and generate report
python run.py benchmark --output results.md
```

## 🎓 Academic Foundations

- **GDSF (Greedy Dual-Size Frequency):** Cost efficiency scoring
- **CAMP (Cost-Aware Miss Penalty):** Bucketed queue structure
- **Ski-Rental Algorithm:** Capacity scaling decisions
- **EWMA (Exponential Weighted Moving Average):** Phase detection

## 📈 Dashboard Features

- Real-time hit rate and request metrics
- Weight evolution chart showing dynamic adaptation
- Phase indicator (Steady/Spike/Shift)
- Eviction analysis by dominant factor
- Score distribution across buckets

## 🧪 Running Tests

```bash
pytest tests/ -v
```

## 📝 License

UCET Hackathon 2026 - Vidyavardhini's College of Engineering & Technology
