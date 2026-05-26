# Security rules (always on)

Titan Grove targets Fortune-100 and government deployments. Treat security as a gate.

- Never read, print, or commit `.env`, `.env.business`, `.env.production`, or any
  real secrets. The `.env*.example` files are the only ones that belong in git.
- Validate and sanitize all external input at the boundary (API handlers in
  `src/api` / `src/server`); never trust client data passed into the native core.
- Use parameterized queries — never string-concatenate SQL or shell commands.
- Don't weaken auth: keep RBAC checks, JWT validation, and rate limiting intact.
- Data crossing the TS ↔ Rust NAPI boundary is untrusted: bound-check, avoid panics
  on recoverable errors, and don't deserialize unchecked input into native types.
- For changes touching auth, secrets, the API surface, the DB layer, or the FFI
  boundary, request a review from the `security-reviewer` subagent before merge.
- Flag, never silently work around, a security concern you can't resolve.
