#!/usr/bin/env bash
# SessionStart: inject at most one line of context when the compiled native
# addon is missing or older than the Rust sources. Prevents the most common
# Titan Grove failure mode — TypeScript silently calling stale bindings —
# without spending tokens when everything is up to date.
set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

msg=''
node_bin=$(ls -t ./*.node 2>/dev/null | head -1)
if [ -z "$node_bin" ]; then
  msg="The native addon (*.node) is not built at the repo root. Run 'npm run build:native' before any JS code path that calls the Rust core (tests included)."
elif [ -d src ]; then
  stale=$(find src -name '*.rs' -newer "$node_bin" -print -quit 2>/dev/null)
  if [ -n "$stale" ]; then
    msg="Rust sources (e.g. $stale) are newer than the compiled $node_bin. Run 'npm run build:native' or TypeScript will call stale bindings."
  fi
fi

[ -z "$msg" ] && exit 0
jq -n --arg m "$msg" \
  '{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:$m}}'
