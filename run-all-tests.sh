#!/bin/bash
set -e

REPOSITORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Backend Setup & Unit Tests ──────────────────────────────
cd "$REPOSITORY_DIR/backend"
pip install -e ".[dev]"
pytest tests/ --cov=app --cov-report=term-missing

# ── Frontend Setup & Unit Tests ─────────────────────────────
cd "$REPOSITORY_DIR/frontend-nextjs"
npm ci
npm run test:run

# ── Functional (E2E) Setup ──────────────────────────────────
cd "$REPOSITORY_DIR/functional-tests"
npm ci

# ── Start Backend ───────────────────────────────────────────
# Run inside backend/ so dotenv loads backend/.env automatically
cd "$REPOSITORY_DIR/backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# ── Start Frontend ──────────────────────────────────────────
# Use --hostname instead of --host
cd "$REPOSITORY_DIR/frontend-nextjs"
npm run dev -- --hostname 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

# Cleanup background processes on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; wait $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

# ── Service Readiness Health Checks ─────────────────────────
echo "Waiting for backend..."
until curl -sSf http://localhost:8000/docs > /dev/null 2>&1; do
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Error: Backend process died."
    exit 1
  fi
  sleep 2
done

echo "Waiting for frontend..."
until curl -sSf http://localhost:3000 > /dev/null 2>&1; do
  if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "Error: Frontend process died."
    exit 1
  fi
  sleep 2
done

# ── Run E2E Tests ───────────────────────────────────────────
cd "$REPOSITORY_DIR/functional-tests"
npm run cypress:run