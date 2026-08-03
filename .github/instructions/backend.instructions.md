---
applyTo: "backend/**"
description: "FastAPI backend conventions for this project"
---
- Routes go in `app/api/routes/`, business logic in `app/services/` — never mix them
- Use Pydantic v2 schemas in `app/schemas/` for request/response; SQLAlchemy models in `app/models/` for DB
- DB session always via `Depends(get_db)` from `app/api/deps.py`
- Use `ruff` for linting — no `flake8` or `black`
- Database is SQLite via SQLAlchemy; use Alembic for all schema changes, never modify tables manually
- Return HTTP 422 for validation errors, 404 for not found, 400 for business rule violations
