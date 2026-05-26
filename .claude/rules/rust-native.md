---
paths:
  - "src/**/*.rs"
  - "packages/**/*.rs"
  - "**/Cargo.toml"
  - "**/build.rs"
---

# Rust / NAPI-RS rules

- The root crate compiles `src/*.rs` + `src/lib.rs` into the root `*.node` addon;
  each `packages/<name>/src/lib.rs` compiles into that package's binary.
- **After editing Rust, rebuild bindings** so TypeScript sees the change:
  - Root: `npm run build:native` (release) or `npm run build:native:debug`.
  - A package: `cd packages/<name> && npm run build` (wraps `napi build --platform --release`).
- Never hand-edit generated bindings: `native.js`, `native.d.ts`, `*.node`,
  `packages/*/index.js`, `packages/*/index.d.ts`. Change the Rust source and rebuild.
- Run `cargo check` and `cargo clippy`; fix warnings rather than suppressing them.
- Conventions: `snake_case` file and function names; `serde` for JSON interop;
  `napi`/`napi-derive` for bindings; UUIDs for identifiers; Chrono for timestamps.
- Don't `panic!` across the FFI boundary on recoverable errors — return a `napi::Result`.
- New packages copy the layout of an existing mature crate (e.g. `packages/financial`).
