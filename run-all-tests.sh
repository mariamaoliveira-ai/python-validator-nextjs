#!/bin/bash
set -e

REPOSITORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Backend ────────────────────────────────────────────────
cd "$REPOSITORY_DIR/backend"
pip install -e ".[dev]"
pytest tests/ --cov=app --cov-report=term-missing

# ── Frontend ───────────────────────────────────────────────
cd "$REPOSITORY_DIR/frontend-nextjs"
npm ci
npm run test:run

# ── Functional (E2E) ───────────────────────────────────────
cd "$REPOSITORY_DIR/functional-tests"
npm ci

cd "$REPOSITORY_DIR"
python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd "$REPOSITORY_DIR/frontend-nextjs"
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; wait $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo "Waiting for services..."
until curl -sSf http://localhost:8000/docs > /dev/null 2>&1; do sleep 2; done
until curl -sSf http://localhost:3000 > /dev/null 2>&1; do sleep 2; done

cd "$REPOSITORY_DIR/functional-tests"
npm run cypress:run
