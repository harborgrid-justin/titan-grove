# CLAUDE.md — Titan Grove

Project memory for Claude Code. Loaded into every session, so it is kept lean.
Deep guidance lives in `docs/CLAUDE_BEST_PRACTICES.md` (loaded on demand, not every session).

Titan Grove is an enterprise business suite (Oracle EBS 12 competitor): a **Rust
native core compiled through NAPI-RS** and consumed by a **TypeScript** service
layer, plus **121 independent NAPI-RS domain packages** under `packages/`.

## Setup & build

- Install deps with `npm install --force` (peer-dep conflicts are expected; the
  flag is required).
- **The native core must be built before JS can call it.** Run
  `npm run build:native` (release) or `npm run build:native:debug`. This runs
  `napi build` and regenerates `native.js`, `native.d.ts`, and the `*.node`
  binary at the repo root.
- After editing any `src/*.rs` file you MUST re-run `npm run build:native` or the
  TypeScript layer keeps calling the old compiled binary.
- Full legacy build: `npm run build` (native + `vite build` + `tsc || true`).
- A single domain package builds from its own folder: `cd packages/<name> && npx napi build --release`.

## Run

- Dev server (hot reload): `npm run dev` (`ts-node-dev` on `src/index.ts`).
- Production server: `npm start` (`dist/production-server.js`).
- UI dev: `npm run dev:ui` (Vite). Full microservice stack: `npm run start:services`.

## Test, lint, types

- Unit tests: `npm test` (Jest). Coverage: `npm run test:coverage`. Prefer running
  a single test file over the whole suite while iterating.
- Rust tests: `cargo test`. End-to-end: `npm run test:e2e` (Cypress).
- Lint (check only, no writes): `npm run lint:check`. Auto-fix: `npm run lint`.
- Format check: `npm run format:check`. Write: `npm run format`.
- **Type-check explicitly with `npx tsc -p tsconfig.json --noEmit`.** The build
  runs `tsc || true`, so type errors do NOT fail the build — verify types yourself.
- Rust: `cargo check` and `cargo clippy` before reporting Rust work as done.
- Dependency audit: `npm run security:audit`.

## Architecture

- `src/*.rs` + `src/lib.rs` — Rust business-logic core compiled into the root
  `*.node` addon via NAPI-RS. `Cargo.toml` is at the repo root.
- `native.js` / `native.d.ts` — **generated** bindings. Do not hand-edit; rebuild.
- `src/**/*.ts` — TypeScript service layer: `api/`, `server/`, `services/`,
  `modules/`, `domains/`, `database/`, `cache/`, `middleware/`, `security/`.
- `packages/<name>/` — independent NAPI-RS crates (`Cargo.toml`, `build.rs`,
  `src/lib.rs`, generated `index.js`/`index.d.ts`, `test.js`). Published as
  `@titan-grove/<name>`. Each follows the same layout.
- `backend/services/*`, `frontend/*` — npm workspaces (see `package.json`).
- Business logic is centralized; the TS layer orchestrates the Rust core.

## Conventions

- Rust source files are `snake_case.rs`; TS files are `kebab-case.ts`.
- TS path aliases (`@/*`, `@core/*`, `@modules/*`, `@domains/*`, …) are defined in
  `tsconfig.json`; `ts-node` resolves them via `tsconfig-paths`. Use them instead
  of long relative paths.
- TypeScript `strict` mode is **off** — the compiler will not catch null/undefined
  issues for you, so handle them explicitly.
- CommonJS modules (`"type": "commonjs"`), Node `>=18`.
- Conventional Commits. Develop on feature branches; never commit directly to `master`.

## Working effectively (token discipline)

Context is the scarce resource — performance degrades as it fills. Default habits:

- **Delegate exploration.** For codebase searches that span many files, use the
  Explore subagent or `.claude/agents/codebase-explorer` so verbose output stays
  out of the main context. Scope every search narrowly.
- **Run tests via a subagent** (`test-runner`) so logs don't flood the conversation;
  ask for only the failing tests and their errors.
- **`/clear` between unrelated tasks**; after two failed corrections, clear and
  restart with a sharper prompt rather than piling on.
- Reference files with `@path`; don't paste large files. Read only the slice you need.
- Prefer CLI tools and single-test runs over broad commands.

Specialized subagents live in `.claude/agents/`; path-scoped rules in
`.claude/rules/`. Full playbook: `docs/CLAUDE_BEST_PRACTICES.md`.

## Don't

- Don't hand-edit generated `native.js`, `native.d.ts`, `*.node`, or any
  `packages/*/index.{js,d.ts}` — change the Rust source and rebuild.
- Don't read or commit `.env*` files; they hold secrets (see `.env*.example`).
- Don't assume a `tsc`-clean build means types pass — run `--noEmit` yourself.
- Don't run the full Cypress suite to check one flow; target a single spec.
