#!/usr/bin/env bash
# Regenerate the fixture's lock, in-build audit and recorded facts (test fixture only; the approval is not an author approval).
set -euo pipefail
cd "$(dirname "$0")"
PH="node ../../../dist/src/bin.js truth-gate"
lake build Fixture
$PH lock --project . --root Fixture.Semantics --prefix Fixture --semantics Fixture/Semantics.lean --headline Fixture.headline \
  --paper paper.tex --claim thm:main --out truth-gate.lock.json --save-facts facts.txt
$PH approve --lock truth-gate.lock.json --by "${APPROVER:-fixture (test only; not an author approval)}" --at "${APPROVED_AT:-2026-11-16T20:30:00Z}"
$PH emit-lean --lock truth-gate.lock.json --out scripts/SemanticsLock.lean
