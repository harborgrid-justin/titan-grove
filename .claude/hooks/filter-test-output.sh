#!/usr/bin/env bash
# PreToolUse (matcher: Bash). Token-efficiency hook: rewrites bare full-suite
# test commands so only failures and the summary enter the model's context.
# The full log is kept on disk and its path is printed; the original exit code
# is preserved. Scoped runs (single file/spec), pipes, and redirections are
# left untouched. Fail open if jq is unavailable.
set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0
input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty') || exit 0
[ -z "$cmd" ] && exit 0

# Leave anything already piped, redirected, or chained alone.
case "$cmd" in
  *'|'* | *'>'* | *'&&'* | *';'*) exit 0 ;;
esac

pattern=''
case "$cmd" in
  'npm test' | 'npm run test' | 'npx jest')
    pattern='(FAIL |✕ |● |Tests:|Test Suites:|Snapshots:|Time:|Cannot find|error TS)'
    ;;
  'cargo test')
    pattern='(FAILED|panicked at|error\[|^error(:|s)|test result:)'
    ;;
  *) exit 0 ;;
esac

log=$(mktemp "${TMPDIR:-/tmp}/titan-test-XXXXXX.log") || exit 0
rewritten="$cmd >$log 2>&1; s=\$?; grep -E -A 4 -- '$pattern' $log | head -150; echo \"[filtered by .claude/hooks/filter-test-output.sh — full log: $log]\"; exit \$s"

jq -n --arg c "$rewritten" \
  '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"allow",updatedInput:{command:$c}}}'
