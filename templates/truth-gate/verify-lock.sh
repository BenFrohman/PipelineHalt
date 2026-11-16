#!/usr/bin/env bash
# Truth Gate local/CI verification for a formalization repo (copy to scripts/verify-lock.sh). Exit 0 only if the
# formal certificate inhabits the locked statement. Never edit Semantics.lean or the lock to make this pass: a
# mismatch stays red and is reported. Delegates to PipelineHalt's checker, which runs preflight, compiles the
# Semantics module, runs the observation pass FIRST (#check intended_correspondence, #print paper_claim,
# #print formal_claim), then lake build (in-build #eval audit), scripts/SemanticsLock.lean and truth-gate check.
# Set PIPELINEHALT_DIR to a PipelineHalt checkout (built with `npm install && npx tsc -b`).
set -euo pipefail
cd "$(dirname "$0")/.."
: "${PIPELINEHALT_DIR:?set PIPELINEHALT_DIR to a built BenFrohman/PipelineHalt checkout}"
exec "$PIPELINEHALT_DIR/scripts/verify-lock.sh" .
