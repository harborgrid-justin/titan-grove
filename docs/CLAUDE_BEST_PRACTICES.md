# LLM Development Guide — Claude on Titan Grove

Enterprise-grade guidance for using **Claude** and **Claude Code** to develop,
review, and operate Titan Grove. This is the long-form reference; the always-on
session memory lives in [`/CLAUDE.md`](../CLAUDE.md), and file-type-specific rules
live in [`.claude/rules/`](../.claude/rules). This document loads on demand, so it
can go deep without costing tokens on every session.

> **Standardize on Claude.** Titan Grove uses Anthropic's Claude models and Claude
> Code as the default coding agents. When building Claude into the product itself,
> use the latest models — **Opus** for hard reasoning, **Sonnet** for balanced
> day-to-day work, **Haiku** for fast, cheap, high-volume tasks.

## Official Anthropic references

Treat the official documentation as the source of truth; this guide adapts it to
our codebase.

- Claude Code best practices — https://code.claude.com/docs/en/best-practices
- Subagents — https://code.claude.com/docs/en/sub-agents
- Memory & `CLAUDE.md` — https://code.claude.com/docs/en/memory
- Skills — https://code.claude.com/docs/en/skills
- Hooks — https://code.claude.com/docs/en/hooks
- Settings & permissions — https://code.claude.com/docs/en/settings · https://code.claude.com/docs/en/permissions
- Reduce token usage / costs — https://code.claude.com/docs/en/costs#reduce-token-usage
- Context window — https://code.claude.com/docs/en/context-window
- Prompt caching — https://code.claude.com/docs/en/prompt-caching
- MCP servers — https://code.claude.com/docs/en/mcp
- Agent teams & parallel sessions — https://code.claude.com/docs/en/agent-teams · https://code.claude.com/docs/en/worktrees
- Headless / non-interactive (CI) — https://code.claude.com/docs/en/headless
- Claude Code on the web — https://code.claude.com/docs/en/claude-code-on-the-web
- Claude API & SDKs — https://docs.claude.com · Anthropic engineering blog — https://www.anthropic.com/engineering

## The one constraint everything follows from

Almost every best practice derives from a single fact: **Claude's context window
fills up fast, and model performance degrades as it fills.** The context window
holds the entire conversation — every message, every file read, every command
output. A single exploration of a 121-package monorepo can burn tens of thousands
of tokens. As it fills, Claude starts to "forget" earlier instructions and make
more mistakes.

So the goal is not "use as few tokens as possible" — it is **spend tokens where they
create value and keep the working context clean**. Maximize useful signal per token;
minimize waste.

## How this repo is wired for Claude

```
titan-grove/
├── CLAUDE.md                     # Project memory — loaded EVERY session. Kept lean.
├── docs/CLAUDE_BEST_PRACTICES.md # This guide — loaded on demand.
└── .claude/
    ├── settings.json             # Team permissions (allowlist + deny), hooks wiring,
    │                             #   MAX_MCP_OUTPUT_TOKENS cap
    ├── hooks/                    # Deterministic enforcement (see "Hooks" below)
    │   ├── filter-test-output.sh #   full-suite test runs → failures + summary only
    │   ├── guard-sensitive.sh    #   deny shell access to .env / generated bindings
    │   └── check-native-build.sh #   SessionStart warning when *.node is missing/stale
    ├── skills/                   # Reusable workflows, loaded on demand
    │   └── scaffold-package/     #   /scaffold-package — new @titan-grove/<name> NAPI crate
    ├── rules/                    # Path-scoped instructions (load only for matching files)
    │   ├── rust-native.md        #   src/**/*.rs, packages/**/*.rs, Cargo.toml, build.rs
    │   ├── typescript.md         #   src|frontend/**/*.{ts,tsx}, backend/**/*.ts
    │   ├── testing.md            #   *.test.ts, tests/**, cypress/**
    │   └── security.md           #   always on (enterprise gate)
    └── agents/                   # Specialized subagents (isolated context windows)
        ├── codebase-explorer.md           #  read-only research        (haiku, maxTurns 30)
        ├── rust-napi-engineer.md          #  native core + bindings    (inherit)
        ├── typescript-service-engineer.md #  service layer             (inherit)
        ├── frontend-engineer.md           #  React/Carbon/Vite UI      (inherit)
        ├── domain-package-expert.md       #  packages/* crates         (inherit)
        ├── test-runner.md                 #  run tests, report failures (sonnet, effort low)
        ├── code-reviewer.md               #  general quality review    (inherit)
        ├── security-reviewer.md           #  security review           (opus, effort high)
        └── docs-writer.md                 #  documentation maintenance (sonnet)
```

### Memory hierarchy (load order, broad → specific)

`CLAUDE.md` files are concatenated into context at session start in this order:

1. **Managed policy** (org-wide, cannot be excluded) — Linux: `/etc/claude-code/CLAUDE.md`.
   Use for company-wide security/compliance mandates deployed via MDM/Ansible.
2. **User** — `~/.claude/CLAUDE.md` (personal, all projects).
3. **Project** — `./CLAUDE.md` (this repo, shared via git) **+ `.claude/rules/*.md`**.
4. **Local** — `./CLAUDE.local.md` (gitignored, personal project notes).

Unconditional rules and `CLAUDE.md` load on **every** session and consume tokens;
**path-scoped rules** (those with a `paths:` frontmatter) load only when Claude
touches matching files. That is why our Rust/TypeScript/testing detail lives in
path-scoped rules rather than in `CLAUDE.md`.

> **Why not `@import` the README into `CLAUDE.md`?** Imports are expanded into
> context at launch — they organize, they don't save tokens. We deliberately keep
> `CLAUDE.md` short and reference large docs by path so they load only when needed.

## Subagents: the highest-leverage token tool

A subagent runs in its **own isolated context window** with its own system prompt,
tools, and model. It does noisy work (reading many files, running tests, fetching
docs) and returns only a summary — the verbose output never touches your main
conversation. See https://code.claude.com/docs/en/sub-agents.

**Delegate to a subagent when:**
- A task would flood the main context with search results, logs, or file dumps.
- You want hard tool restrictions (e.g. a read-only reviewer).
- The work is self-contained and can hand back a summary.
- You can route it to a cheaper model (Haiku/Sonnet) to control cost.

**Keep it in the main conversation when:** the task needs tight back-and-forth, the
change is small and targeted, or multiple phases share a lot of context.

How to invoke ours:

```text
Use the codebase-explorer subagent to find where order fulfillment is implemented
across the Rust core and the TypeScript services.

Use the test-runner subagent to run the orders tests and report only failures.

Have the security-reviewer subagent review the staged auth changes before I commit.
```

Design principles (we already follow these in `.claude/agents/`): one job per
subagent, a detailed `description` so Claude knows when to delegate, the minimum
tool set, an explicit `model`, and `memory: project` on the agents whose knowledge
compounds. Two newer frontmatter levers worth knowing:

- **`effort`** (`low`…`max`) tunes thinking depth per agent — `test-runner` runs at
  `low` (mechanical work), `security-reviewer` at `high` (adversarial reasoning).
  Thinking tokens are billed as output tokens, so this is a direct cost dial.
- **`maxTurns`** caps runaway agents — the read-only `codebase-explorer` and
  `test-runner` carry caps so an unscoped question can't burn unbounded turns.
  Agents are instructed to report partial findings when they hit the cap.

Built-in **Explore** (fast, read-only, Haiku) and **Plan** are available
without any setup and skip `CLAUDE.md` to stay cheap.

> Subagents cannot spawn subagents. For sustained parallelism use
> [agent teams](https://code.claude.com/docs/en/agent-teams) or parallel sessions in
> [worktrees](https://code.claude.com/docs/en/worktrees) /
> [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web).

## Token maximization & waste-minimization playbook

Concrete tactics, in rough order of impact:

1. **`/clear` between unrelated tasks.** The single biggest win. A clean window with
   a sharp prompt beats a long one polluted with stale context. `/rename` first so
   `/resume` can find the session later.
2. **Delegate exploration and test runs to subagents** so their output stays out of
   the main context (see above).
3. **Plan mode for non-trivial work.** Wrong-direction rework is the most expensive
   waste there is. Shift+Tab into plan mode (or use the Plan subagent), approve the
   approach, then implement. Course-correct early — Escape to stop, `/rewind` to
   restore a checkpoint — instead of letting a bad direction run.
4. **Scope every search.** "Find the EOQ calc in `src/scm.rs`" not "how does
   inventory work?" Unscoped investigation reads hundreds of files and fills context.
5. **Read slices, not whole files.** Reference exact files with `@path`; read only
   the relevant line ranges instead of pasting large files.
6. **Run the narrowest verification.** A single Jest file or one Cypress spec, not
   the whole suite (see `.claude/rules/testing.md`). Our hooks filter full-suite
   output down to failures as a backstop, but a scoped run is still cheaper.
7. **Route by model AND effort.** Haiku for search/format/boilerplate, Sonnet for
   normal coding and review, Opus for hard architecture/security reasoning. Effort
   levels (`/effort`, or `effort:` frontmatter in skills/agents) tune thinking
   depth — thinking tokens bill as output tokens. Our subagents are pre-tuned.
8. **Use `/compact <focus>`** when a long, valuable session approaches the limit
   (e.g. `/compact keep the modified files and test commands`). The
   "Compact instructions" section in `CLAUDE.md` defines what survives by default.
9. **Inspect before you guess.** `/context` shows what is filling the window
   (MCP tools, rules, conversation); `/usage` attributes consumption to skills,
   subagents, plugins, and individual MCP servers over the last 24 h / 7 days.
10. **Use `/btw` for throwaway questions** so the answer never enters history.
11. **Keep `CLAUDE.md` lean.** A bloated memory file makes Claude *ignore* rules
    because the important ones get lost. For each line: "would removing this cause a
    mistake?" If not, cut it. Target < 200 lines.
12. **Prefer CLI tools** (`gh`, `cargo`, `npm`) over MCP servers — CLIs add zero
    per-tool listing overhead. MCP tool definitions are deferred by default (only
    names load until used), and `settings.json` caps any single MCP result via
    `MAX_MCP_OUTPUT_TOKENS=15000`. Disable unused servers from `/mcp`.
13. **Lean on prompt caching.** Stable context (system prompt, `CLAUDE.md`, repeated
    file reads) is cached; forks reuse the parent's cache. See
    https://code.claude.com/docs/en/prompt-caching. More cost levers:
    https://code.claude.com/docs/en/costs#reduce-token-usage.

## Hooks: deterministic enforcement and preprocessing

`CLAUDE.md` is advisory; **hooks are enforced**. Ours live in `.claude/hooks/` and
are wired in `.claude/settings.json` (see https://code.claude.com/docs/en/hooks):

- **`filter-test-output.sh`** (`PreToolUse`, Bash) — rewrites bare full-suite runs
  (`npm test`, `npx jest`, `cargo test`) via the hook `updatedInput` mechanism: the
  suite logs to a temp file, only failure lines plus the summary enter context, the
  full-log path is echoed, and the original exit code is preserved. Scoped, piped,
  or chained commands pass through untouched. This is the documented
  "offload processing to hooks" pattern — thousands of log tokens become dozens.
- **`guard-sensitive.sh`** (`PreToolUse`, Bash) — denies shell commands that touch
  real `.env*` secret files (the `*.example` files stay allowed) or that write to
  generated NAPI bindings via redirection/`sed -i`/`tee`/`mv`/`cp`. This closes the
  gap left by `permissions.deny`, which only covers the Read/Edit/Write tools, not
  `cat`/`grep` through Bash.
- **`check-native-build.sh`** (`SessionStart`) — injects at most one line of context
  when the compiled `*.node` addon is missing or older than `src/*.rs`. This
  pre-empts the most common Titan Grove failure mode (TypeScript silently calling
  stale bindings) for the cost of a single sentence — and zero tokens when the
  build is fresh. It also gives Claude Code on the web / fresh-container sessions
  an immediate signal that `npm run build:native` must run first.

All three fail open if `jq` is missing (permission rules still apply), preserve
the user's intent, and emit JSON per the hooks contract. When a hook rewrites or
denies a command, that is policy — agents are instructed to work with it, not
rephrase around it. Audit them with `/hooks`.

## Lessons from the Claude Code changelog

Recurring problems Anthropic has been working through in Claude Code releases, and
the safeguard this repo carries for each — kept even where the product now handles
it natively, so we stay protected across versions and on the web/remote runtime:

| Recurring issue (changelog theme)              | Product answer                          | Our safeguard |
| ---------------------------------------------- | --------------------------------------- | ------------- |
| Context fills; model degrades, "forgets" rules | Auto-compact, microcompaction, "summarize up to here", CLAUDE.md size warnings | Lean `CLAUDE.md` + path-scoped rules; "Compact instructions" section; `/clear` discipline; subagent delegation |
| Verbose tool output flooding context           | Hook `updatedInput`/`updatedToolOutput` rewriting | `filter-test-output.sh`; test-runner subagent reports failures only |
| MCP servers bloating every prompt              | Deferred tool definitions; `/context`, `/usage` per-server attribution | Prefer CLIs; `MAX_MCP_OUTPUT_TOKENS=15000` in `settings.json`; disable unused servers |
| Runaway/looping agents burning turns           | `maxTurns` frontmatter; Agent View      | Turn caps on `codebase-explorer` (30) and `test-runner` (25) with partial-report instructions |
| Over-thinking on mechanical tasks              | Effort levels per session/skill/agent; `MAX_THINKING_TOKENS` | `effort: low` on test-runner, `effort: high` only where reasoning pays (security-reviewer) |
| Permission fatigue → users bypass safety       | Finer permission rules, auto mode, `hard_deny` | Curated allowlist for safe verification commands (incl. single-spec Cypress); deny list for destructive ops |
| Destructive cleanup (`rm -rf` fallbacks, force push) | Worktree-removal fixes, protected-path prompts | `permissions.deny` on `rm -rf`, force-push, hard reset, `git clean`; `guard-sensitive.sh` |
| Secrets/config exposure via shell              | Shell-startup-file write prompts, sandboxing | `.env` deny rules **plus** the Bash-level guard hook |
| Subagent edits colliding with the main session | `isolation: worktree`, shared-checkout blocking | Worktree isolation available on all agents; engineers report files changed |
| Lost knowledge between sessions                | Agent `memory` scopes, session resume   | `memory: project` on explorer, engineers, and both reviewers |
| Model availability/cost drift                  | `fallbackModel`, fast mode, model aliases | Subagents pin by alias (`haiku`/`sonnet`/`opus`), never full model IDs |

Re-check the changelog (https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
quarterly: when a workaround here becomes a first-class feature, adopt the feature
and keep the safeguard only if it still adds defense in depth.

## Core workflows

### Explore → Plan → Code → Commit
The default for anything non-trivial (https://code.claude.com/docs/en/best-practices):
1. **Explore** in plan mode (or via the Explore subagent) — understand before acting.
2. **Plan** — have Claude write the change plan; edit it before proceeding.
3. **Code** — implement against the plan, verifying as it goes.
4. **Commit** — descriptive message; open a PR.

Skip planning for one-sentence diffs (typo, log line, rename). For large features,
let Claude interview you with `AskUserQuestion` and write a `SPEC.md`, then start a
fresh session to implement it.

### Writer / Reviewer
Use two sessions (or a writer + the `security-reviewer`/`test-runner` subagents): one
implements, a fresh context reviews. Fresh context produces better reviews because it
isn't biased toward code it just wrote.

### Give Claude a way to verify itself
The highest-leverage habit. Provide tests, expected outputs, or screenshots so Claude
checks its own work and fixes root causes instead of suppressing errors. For Titan
Grove that means: a failing test that reproduces the bug, `npx tsc --noEmit` for
types, `cargo clippy` for Rust, and a rebuilt `*.node` before testing native changes.

### Non-interactive / CI
Run Claude headlessly in pipelines and pre-commit hooks
(https://code.claude.com/docs/en/headless):

```bash
claude -p "Review the staged diff for security issues. Output FAIL with reasons or PASS." \
  --allowedTools "Read,Grep,Glob,Bash" --output-format json
```

For large mechanical migrations, fan out across files with a loop of `claude -p`
invocations and `--allowedTools` to scope each run.

## Enterprise governance

- **Permissions.** `.claude/settings.json` (checked into git) allowlists clearly-safe
  commands (tests, lint/type checks, native & UI build, read-only git, single-spec
  Cypress runs — the full suite still prompts, by design) and denies:
  destructive ops (`rm -rf`, force-push, hard reset, branch delete, `git clean`),
  reads of the real `.env*` secret files (the `*.example` files stay readable), and
  **hand-edits to generated bindings** (`native.js`, `native.d.ts`,
  `packages/*/index.{js,d.ts}`) — `napi build` still regenerates them via Bash; only
  the Edit/Write tools are blocked, so change the Rust source and rebuild. Tighten
  per environment with [managed settings](https://code.claude.com/docs/en/settings)
  for `permissions.deny`, sandboxing, and auth — these are *enforced by the client*,
  unlike `CLAUDE.md`, which is advisory.
- **Managed `CLAUDE.md`.** Deploy org-wide security/compliance instructions at the
  managed-policy path (or via the `claudeMd` key in `managed-settings.json`); it
  cannot be excluded by individual users.
- **Secrets.** Never read or commit `.env`, `.env.business`, `.env.production`. Only
  `*.example` files belong in git. The deny rules in `settings.json` enforce this.
  Personal `CLAUDE.local.md`, `.claude/settings.local.json`, and local agent memory
  are gitignored; the shared config (`CLAUDE.md`, `.claude/agents`, `rules`, `skills`,
  `settings.json`) is committed for the whole team.
- **Security gate.** Changes touching auth, the API surface, the DB layer, secrets,
  or the TS↔Rust FFI boundary get a `security-reviewer` pass before merge (see
  `.claude/rules/security.md`).
- **Auditability.** Subagent transcripts persist per session; auto-memory is plain
  markdown you can inspect with `/memory`.
- **Hooks** give *deterministic* enforcement for things that must happen every
  time. We ship three (see "Hooks" above): test-output filtering, the shell-level
  secrets/bindings guard, and the stale-native-build session warning. Use a hook,
  not a `CLAUDE.md` rule, whenever "advisory" isn't enough.

## Anti-patterns (and the fix)

- **Kitchen-sink session** — unrelated tasks pile up in one window. → `/clear`.
- **Correcting in circles** — after two failed corrections, context is polluted with
  dead ends. → `/clear` and write a better prompt with what you learned.
- **Over-specified `CLAUDE.md`** — too long, so Claude ignores half of it. → Prune
  ruthlessly; move detail to path-scoped rules or this guide; convert "must happen"
  rules to hooks.
- **Trust-then-verify gap** — plausible code that fails edge cases. → Always supply a
  verification (test/type-check/clippy). If you can't verify it, don't ship it.
- **Infinite exploration** — "investigate X" reads hundreds of files. → Scope it
  narrowly or delegate to the `codebase-explorer`/Explore subagent.
- **Stale-binding confusion** — TS calls old native behavior after a Rust edit. →
  `npm run build:native` before testing native changes.

## Maintaining this setup

- Run `/init` to refresh `CLAUDE.md` when the build system or layout changes; it
  suggests improvements rather than overwriting.
- Review `.claude/rules/` and `CLAUDE.md` periodically for stale or conflicting
  instructions — contradictions make Claude pick arbitrarily.
- Add to `CLAUDE.md` when Claude makes the same mistake twice or a review catches
  something it should have known. Cut anything Claude already gets right.
- Add **skills** under `.claude/skills/<name>/SKILL.md` for repeatable workflows that
  load on demand (we ship `/scaffold-package`). Follow Anthropic's pattern for more,
  e.g. a `fix-issue` or `release` workflow: https://code.claude.com/docs/en/skills.
- If you adopt other AI tools that read `AGENTS.md`, create one and import it from
  `CLAUDE.md` with `@AGENTS.md` so both read the same instructions without duplication.
- Use the `docs-writer` subagent to keep these files accurate and lean as the code
  evolves. Treat them like code: review, prune, and verify behavior actually shifts.
