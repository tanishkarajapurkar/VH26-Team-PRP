#!/bin/bash
# APTS System - Start All Services
# Usage: bash start-all.sh

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "============================================================"
echo "  APTS FULL SYSTEM STARTUP"
echo "============================================================"
echo ""

# ── 1. Cache Engine (Rust) ────────────────────────────────────────
if [ -d "$PROJECT_ROOT/Cache_Engine/target/release" ] && [ -f "$PROJECT_ROOT/Cache_Engine/target/release/aptsd" ]; then
  echo "[1/4] Starting Cache Engine (Rust binary)..."
  cd "$PROJECT_ROOT/Cache_Engine"
  ./target/release/aptsd &
  CACHE_PID=$!
  echo "  Cache Engine PID: $CACHE_PID (port 7400 TCP, 7401 API)"
  sleep 1
else
  echo "[1/4] Cache Engine binary not found, skipping..."
  echo "  Build first: cd Cache_Engine && cargo build --release"
  CACHE_PID=""
fi

# ── 2. Website1 Backend (Express + Neon PostgreSQL) ────────────────
echo "[2/4] Starting Website1 Backend..."
cd "$PROJECT_ROOT/website1/backend"
if [ ! -d "node_modules" ]; then
  echo "  Installing dependencies..."
  npm install --silent 2>/dev/null
fi
npx tsx src/server.ts &
WEBSITE1_PID=$!
echo "  Website1 Backend PID: $WEBSITE1_PID (port 5000)"
sleep 1

# ── 3. PredictiveCache-AI-Package Backend (Fastify + Bridge) ──────
echo "[3/4] Starting PredictiveCache-AI-Package Backend..."
cd "$PROJECT_ROOT/PredictiveCache-AI-Package/ApexMart-Storefront/backend"
if [ ! -d "node_modules" ]; then
  echo "  Installing dependencies..."
  npm install --silent 2>/dev/null
fi
npx tsx src/server.ts &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID (port 4000)"
sleep 1

# ── 4. PredictiveCache-AI-Package Frontend (Vite) ───────────────
echo "[4/4] Starting PredictiveCache-AI-Package Frontend..."
cd "$PROJECT_ROOT/PredictiveCache-AI-Package/ApexMart-Storefront/frontend"
if [ ! -d "node_modules" ]; then
  echo "  Installing dependencies..."
  npm install --silent 2>/dev/null
fi
npx vite --port 3001 &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID (port 3001)"

echo ""
echo "============================================================"
echo "  ALL SERVICES STARTED"
echo "============================================================"
echo ""
echo "  Cache Engine API:          http://localhost:7401/health
  Website1 Backend:          http://localhost:5000/api/v1/health
  PredictiveCache Backend:   http://localhost:4000/api/health
  PredictiveCache Dashboard: http://localhost:4000/dashboard
  PredictiveCache Frontend:  http://localhost:3001
"
echo ""
echo "  Bridge API Endpoints:"
echo "    /api/bridge/cache-engine  - Cache Engine metrics"
echo "    /api/bridge/traffic       - Website1 traffic events"
echo "    /api/bridge/combined      - Unified metrics"
echo "    /api/bridge/traffic/stream - SSE real-time traffic"
echo ""
echo "  Press Ctrl+C to stop all services"
echo ""

# Trap to clean up background processes
cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$CACHE_PID" ] && kill $CACHE_PID 2>/dev/null
  [ -n "$WEBSITE1_PID" ] && kill $WEBSITE1_PID 2>/dev/null
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo "All services stopped."
  exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for any process to exit
wait
