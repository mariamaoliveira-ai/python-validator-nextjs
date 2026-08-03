# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install build tools and the package with its dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir -e .

# Copy the application source
COPY . .

# Expose the port uvicorn will listen on
EXPOSE 8000

# Run migrations then start the server
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]