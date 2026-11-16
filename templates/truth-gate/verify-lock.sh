#!/usr/bin/env bash
# Truth Gate local/CI verification for a formalization repo. Exit 0 only if the formal certificate inhabits the
# locked statement. Never edit Semantics.lean or the lock to make this pass: a mismatch stays red and is reported.
set -euo pipefail
cd "$(dirname "$0")/.."
PH="${PIPELINEHALT:-npx pipelinehalt} truth-gate"
lake build                                   # includes the in-build #eval audit (scripts/SemanticsLock.lean)
lake env lean scripts/SemanticsLock.lean     # the same audit, run directly
$PH observe --project . ${GOAL_DECL:+--goal-decl "$GOAL_DECL"}
$PH check --project . --require-observation ${CI:+--ci} --report-md truth-gate-report.md --badge truth-gate-badge.json
