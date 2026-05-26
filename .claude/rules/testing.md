---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**"
  - "cypress/**"
  - "packages/**/test.js"
---

# Testing rules

- Unit tests use **Jest** (`ts-jest`). Run a single file while iterating:
  `npx jest path/to/file.test.ts`. Full suite: `npm test`; coverage: `npm run test:coverage`.
- Rust logic is tested with `cargo test` (root or inside a package dir).
- End-to-end uses **Cypress**. Run one spec, not the whole suite, to check a flow:
  `npx cypress run --spec 'cypress/e2e/<file>.cy.js'`.
- Each `packages/<name>` has a `test.js`; run it with `node packages/<name>/test.js`.
- When a test exercises native code, ensure `npm run build:native` ran first —
  stale bindings produce misleading failures.
- Give changes a way to verify themselves: add a failing test that reproduces a bug
  before fixing it, then make it pass. Don't delete or weaken assertions to go green.
