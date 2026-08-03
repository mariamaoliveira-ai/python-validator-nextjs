# Python Validator

A web application that validates and corrects Python scripts using static analysis.

## Stack

- **Backend:** FastAPI, SQLAlchemy, Alembic, SQLite
- **Frontend:** React, TypeScript, Vite
- **Tests:** Pytest (unit + integration), Vitest + React Testing Library (components), Cypress (E2E)
- **Infrastructure:** Docker, Docker Compose

## Requirements

- Docker and Docker Compose

## Getting Started

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Running Tests

**Backend**
```bash
docker compose exec backend pytest
```

**Frontend (unit/component)**
```bash
docker compose exec frontend npm run test
```

**E2E**
```bash
npm run cypress:open   # interactive
npm run cypress:run    # headless
```

## Project Structure

```
python-validator/
├── backend/       # FastAPI app
├── frontend/      # React app
├── e2e/           # Cypress specs
└── docker-compose.yml
```

## Features

- Upload a `.py` file and validate the answer
- Validation history persistence
