#!/usr/bin/env bash
# PreToolUse guard (matcher: Bash). Deterministic enforcement of two rules that
# CLAUDE.md can only state advisorily:
#   1. No shell access to real .env secret files (.env*.example stays allowed).
#   2. No shell writes to generated NAPI bindings — change Rust source and rebuild.
# Exit 0 with no output = allow. Fail open if jq is unavailable (permission deny
# rules in settings.json still cover the Read/Edit/Write tools).
set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0
input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty') || exit 0
[ -z "$cmd" ] && exit 0

deny() {
  jq -n --arg reason "$1" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$reason}}'
  exit 0
}

# Text-carrying git commands (commit messages, searches) may mention ".env" in
# prose without touching the files. For those, scan a copy with quoted strings
# blanked out — anything chained on OUTSIDE the quotes is still caught.
scan=$cmd
case "$cmd" in
'git commit'* | 'git log'* | 'git show'* | 'git diff'* | 'git push'*)
  while [[ $scan =~ \"[^\"]*\" ]]; do scan=${scan/"${BASH_REMATCH[0]}"/Q}; done
  while [[ $scan =~ \'[^\']*\' ]]; do scan=${scan/"${BASH_REMATCH[0]}"/Q}; done
  ;;
esac

# Real secret files. Allowed only when every .env reference is an *.example file.
if printf '%s' "$scan" | grep -Eq '\.env(\.business|\.production|\.local)?([^a-zA-Z0-9.]|$)' &&
  ! printf '%s' "$scan" | grep -Eq '\.env[a-zA-Z.]*\.example'; then
  deny "Blocked: command references a real .env secret file. Only the .env*.example files may be read or written (see .claude/rules/security.md)."
fi

# Shell writes to generated bindings (redirection, in-place sed, tee/mv/cp onto them).
if printf '%s' "$scan" | grep -Eq '(>>?|\btee\b|\bsed\b[^|;]*-i|\bmv\b|\bcp\b)[^|;]*(native\.(js|d\.ts)|packages/[^[:space:]]+/index\.(js|d\.ts))'; then
  deny "Blocked: that would hand-edit generated NAPI bindings. Change the Rust source and rebuild (npm run build:native, or 'npm run build' inside the package)."
fi

exit 0
