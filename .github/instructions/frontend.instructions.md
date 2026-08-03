---
applyTo: "frontend/src/**"
description: "React + TypeScript frontend conventions for this project"
---
- TypeScript strict mode — no `any`, no implicit returns
- HTTP calls only in `src/api/validatorApi.ts` — never fetch inside components directly
- Shared types in `src/types/validation.ts`
- Each component in its own folder with a co-located `.test.tsx` file
- Use Vitest + React Testing Library — no Enzyme, no shallow rendering
- Test behavior, not implementation: query by role/label, not by class or id
