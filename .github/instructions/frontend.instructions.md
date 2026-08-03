---
applyTo: "frontend-nextjs/app/**"
description: "React + TypeScript frontend conventions for this project"
---
- TypeScript strict mode — no `any`, no implicit returns
- HTTP calls only in `app/api/validatorApi.ts` — never fetch inside components directly
- Each component in its own folder with a co-located `.test.tsx` file
- Use Vitest + React Testing Library — no Enzyme, no shallow rendering
- Follow Next.js app router conventions in `app/`
- Test behavior, not implementation: query by role/label, not by class or id
