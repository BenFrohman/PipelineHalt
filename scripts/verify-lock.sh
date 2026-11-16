#!/usr/bin/env bash
# Truth Gate checker: scripts/verify-lock.sh [project-dir]
#
# Exit 0 only if the formal certificate inhabits the locked, author-approved paper_claim. Any rejection exits 1
# and prints "TRUTH GATE: REJECT <reason>". A mismatch stays red and is reported; never edit Semantics.lean or the
# lock to make this pass (see TRUTH_GATE.md).
#
# Stages, in order:
#   0 preflight     lock, Semantics.lean and intended_correspondence exist      -> missing-lock | missing-semantics | missing-correspondence
#   1 compile       lake build of the locked Semantics module(s) only           -> lake-build-failed
#   2 observation   MANDATORY FIRST STEP: #check intended_correspondence,
#                   #print paper_claim, #print formal_claim, #print axioms      -> observation
#   3 lake build    full build, including the in-build #eval lock audit         -> lake-build-failed
#   4 lock script   lake env lean scripts/SemanticsLock.lean                     -> lock-script
#   5 gate          pipelinehalt truth-gate check --require-observation:
#                   alias/independence, rfl/Iff.rfl, sorry/admit/native_decide,
#                   nonstandard axioms, provenance (@quote, @sha256), hashes     -> gate:<failed check ids>
#
# Environment:
#   LOCK          lock file relative to the project     (default truth-gate.lock.json)
#   LOCK_SCRIPT   in-build audit relative to project    (default scripts/SemanticsLock.lean)
#   GOAL_DECL     optional theorem whose type must be defeq to paper_claim in the observation pass
#   PIPELINEHALT  command prefix for the CLI            (default: this checkout's dist/src/bin.js, else npx pipelinehalt)
#   REPORT_DIR    where reports go                      (default <project>/.pipelinehalt)
#   MATHLIB_CACHE set to 0 to skip `lake exe cache get` (Mathlib is never rebuilt: its oleans are fetched)
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
project="$(cd "${1:-.}" && pwd)" || { echo "TRUTH GATE: REJECT missing-project ${1:-.}"; exit 1; }
cd "$project"
LOCK="${LOCK:-truth-gate.lock.json}"
LOCK_SCRIPT="${LOCK_SCRIPT:-scripts/SemanticsLock.lean}"
REPORT_DIR="${REPORT_DIR:-$project/.pipelinehalt}"
if [ -z "${PIPELINEHALT:-}" ]; then
  if [ -f "$here/../dist/src/bin.js" ]; then PIPELINEHALT="node $here/../dist/src/bin.js"; else PIPELINEHALT="npx pipelinehalt"; fi
fi
PH="$PIPELINEHALT truth-gate"
mkdir -p "$REPORT_DIR"
reject() { echo "TRUTH GATE: REJECT $1"; [ $# -gt 1 ] && echo "  $2"; exit 1; }
stage() { echo "== [$1] $2"; }

stage 0 preflight
[ -f "$LOCK" ] || reject missing-lock "$LOCK not found; propose one with \`pipelinehalt truth-gate lock\` and have the author approve it"
lockval() { node -e 'const l=require(process.argv[1]);const v=process.argv[2].split(".").reduce((o,k)=>o==null?o:o[k],l);console.log(Array.isArray(v)?v.join(" "):(v??""))' "$project/$LOCK" "$1"; }
sem="$(lockval semantics)"; roots="$(lockval roots)"; corr="$(lockval correspondence.name)"
[ -n "$sem" ] && [ -f "$sem" ] || reject missing-semantics "${sem:-Semantics.lean} not found"
corr_short="${corr##*.}"
grep -Eq "^[[:space:]]*(@\[[^]]*\][[:space:]]*)?(private[[:space:]]+|protected[[:space:]]+)?theorem[[:space:]]+${corr_short}([[:space:]]|:|$)" "$sem" \
  || reject missing-correspondence "theorem ${corr_short} not found in $sem"
[ -f "$LOCK_SCRIPT" ] || reject missing-lock-script "$LOCK_SCRIPT not found; generate it with \`pipelinehalt truth-gate emit-lean\`"
if [ "${MATHLIB_CACHE:-1}" != 0 ] && [ -f lake-manifest.json ] && grep -q '"mathlib"' lake-manifest.json; then
  lake exe cache get >/dev/null || reject lake-build-failed "lake exe cache get failed (Mathlib is never rebuilt)"
fi

stage 1 "compile the locked Semantics module(s): $roots"
targets=(); for r in $roots; do targets+=("+$r"); done
lake build "${targets[@]}" 2>&1 | tee "$REPORT_DIR/lake-build-semantics.log"; [ "${PIPESTATUS[0]}" -eq 0 ] || reject lake-build-failed "lake build ${targets[*]}"

stage 2 "observation pass (#check intended_correspondence, #print paper_claim, #print formal_claim)"
$PH observe --project . --lock "$LOCK" ${GOAL_DECL:+--goal-decl "$GOAL_DECL"} --out "$REPORT_DIR/observation.json"; o=$?
[ $o -eq 0 ] || reject observation "observe exit $o (2 = the goal is not paper_claim: halt, do not edit)"

stage 3 "lake build (includes the in-build #eval semantics lock)"
lake build 2>&1 | tee "$REPORT_DIR/lake-build.log"; [ "${PIPESTATUS[0]}" -eq 0 ] || reject lake-build-failed "lake build"

stage 4 "semantics lock script: $LOCK_SCRIPT"
lake env lean "$LOCK_SCRIPT" || reject lock-script "lake env lean $LOCK_SCRIPT"

stage 5 "truth gate check"
$PH check --project . --lock "$LOCK" --require-observation "$REPORT_DIR/observation.json" ${CI:+--ci} \
  --report-md "$REPORT_DIR/truth-gate-report.md" --report-json "$REPORT_DIR/truth-gate-report.json" --badge "$REPORT_DIR/truth-gate-badge.json"; g=$?
if [ $g -ne 0 ]; then
  failed=$(node -e 'const r=require(process.argv[1]);console.log(r.checks.filter(c=>c.status!=="pass"&&c.status!=="skip").map(c=>c.id+"="+c.status).join(" "))' "$REPORT_DIR/truth-gate-report.json" 2>/dev/null)
  reject "gate:${failed:-exit-$g}" "see $REPORT_DIR/truth-gate-report.md"
fi
echo "TRUTH GATE: PASS (the formal certificate inhabits the locked paper_claim; this says nothing more)"
