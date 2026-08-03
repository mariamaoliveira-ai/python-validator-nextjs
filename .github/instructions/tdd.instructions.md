---
applyTo: ["backend/tests/**", "frontend/src/**/*.test.tsx", "e2e/**/*.cy.ts"]
description: "TDD rules: write failing test first before any implementation"
---
- Write the test before the implementation — Red → Green → Refactor
- Test names: `test_<what>_when_<condition>` (pytest) / `should <behavior> when <condition>` (Vitest/Cypress)
- Unit tests: test one function in isolation, mock external dependencies
- Integration tests (pytest): use TestClient with an in-memory SQLite DB via fixture in `conftest.py`
- E2E (Cypress): test full user flows against the real running app — no mocks unless unavoidable
- Minimum coverage goal: 80% on backend services
