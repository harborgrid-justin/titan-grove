---
name: scaffold-package
description: Scaffold a new independent NAPI-RS domain package under packages/ following Titan Grove's standardized layout. Use when adding a new @titan-grove/<name> native module so it matches the 121 existing packages exactly.
---

# Scaffold a new NAPI-RS package

Create a new `@titan-grove/<name>` package by replicating the standardized layout
that every package under `packages/` shares. Argument: the package name (kebab-case),
e.g. `inventory-forecasting`. Throughout, `<name>` is that kebab-case name and
`<crate>` is `titan-grove-<name>` (the Rust crate / `.node` base name).

## Steps

1. **Copy an existing mature package as the template.** `packages/financial` is a
   good reference. Inspect its files before creating new ones so versions and shape
   match the rest of the repo.

2. **Create the directory and files** under `packages/<name>/`:

   - `Cargo.toml`
     ```toml
     [package]
     name = "titan-grove-<name>"
     version = "1.0.0"
     edition = "2021"
     description = "<one-line description> native module for Titan Grove"
     authors = ["Titan Grove Team"]
     license = "MIT"
     repository = "https://github.com/harborgrid-justin/titan-grove"

     [lib]
     crate-type = ["cdylib"]

     [dependencies]
     napi = { version = "2.13.0", default-features = false, features = ["napi8"] }
     napi-derive = "2.13.0"
     serde = { version = "1.0", features = ["derive"] }
     serde_json = "1.0"
     chrono = { version = "0.4", features = ["serde"] }
     uuid = { version = "1.0", features = ["v4", "serde"] }
     # add rust_decimal = { version = "1.32", features = ["serde"] } only if doing money math

     [build-dependencies]
     napi-build = "2.0.1"

     [profile.release]
     lto = true
     codegen-units = 1
     ```

   - `build.rs`
     ```rust
     extern crate napi_build;

     fn main() {
       napi_build::setup();
     }
     ```

   - `package.json`
     ```json
     {
       "name": "@titan-grove/<name>",
       "version": "1.0.0",
       "description": "<Domain> module for Titan Grove - Native NAPI-RS implementation",
       "main": "index.js",
       "types": "index.d.ts",
       "scripts": {
         "build": "napi build --platform --release --js index.js --dts index.d.ts",
         "build:debug": "napi build --platform --js index.js --dts index.d.ts",
         "test": "node test.js",
         "prepare": "npm run build"
       },
       "author": "Titan Grove Team",
       "license": "MIT",
       "engines": { "node": ">=18.0.0" },
       "dependencies": {},
       "devDependencies": { "@napi-rs/cli": "^2.18.4" },
       "files": ["index.js", "index.d.ts", "*.node"]
     }
     ```
     Copy the `"keywords"` and the `"napi"` block (with its `triples`) from
     `packages/financial/package.json`, adjusting `napi.name` to `titan-grove-<name>`.

   - `src/lib.rs` — start with one `#[napi]`-annotated function or struct, following
     the patterns in the reference package (serde-serializable types, UUID ids,
     Chrono timestamps, `napi::Result` for fallible calls). Do not `panic!` on
     recoverable errors across the FFI boundary.

   - `test.js` — mirror the reference package's `test.js`, exercising the exported API.

3. **Build the bindings** (generates `index.js`, `index.d.ts`, and the `*.node` binary):
   ```bash
   cd packages/<name> && npm run build
   ```
   Never hand-edit the generated `index.js` / `index.d.ts` / `*.node` — change
   `src/lib.rs` and rebuild.

4. **Verify** the crate and the bindings:
   ```bash
   cargo check && cargo clippy
   node packages/<name>/test.js
   ```

5. **Register it** if the repo lists packages anywhere (e.g. `packages/README.md`,
   workspace config) and confirm the count/listing stays consistent.

## Notes

- Heavy Rust logic belongs here, not in the TypeScript layer.
- Keep the new package byte-for-byte consistent with siblings: same file set, same
  dependency versions, same naming. Diverging shapes make the monorepo harder to maintain.
- For larger native work, delegate implementation to the `rust-napi-engineer` or
  `domain-package-expert` subagent.
