---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "backend/**/*.ts"
  - "frontend/**/*.ts"
  - "frontend/**/*.tsx"
---

# TypeScript rules

- `strict` mode is **off** in `tsconfig.json`. The compiler will not catch
  null/undefined or implicit-any issues — handle them explicitly.
- The build runs `tsc || true`, so type errors never fail it. Verify types yourself
  with `npx tsc -p tsconfig.json --noEmit` before reporting work as done.
- Use `tsconfig.json` path aliases (`@/*`, `@core/*`, `@modules/*`, `@domains/*`,
  `@shared/*`, `@utils/*`, …) instead of deep relative imports; `ts-node` resolves
  them via `tsconfig-paths`.
- CommonJS (`import`/`require` interop is on via `esModuleInterop`); files are `kebab-case.ts`.
- Reach native business logic through the generated `native.js` bindings. If a
  needed function isn't exposed, change the Rust source (delegate to
  `rust-napi-engineer`) and rebuild — don't reimplement business logic in TS.
- Lint with `npm run lint:check`; reuse helpers in `src/shared` and `src/utils`.
