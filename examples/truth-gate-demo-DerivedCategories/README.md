# Truth Gate demo: DerivedCategories (scratch copy, 2026-11-16)

This demo ran on a **scratch clone** of `BenFrohman/DerivedCategories` at `226d3e5` (core Lean
`leanprover/lean4:v4.34.0`, no Mathlib). Nothing was pushed to that repository. The scratch commits
(`4d05600` and later) exist only on the box, and the approval in `truth-gate.lock.json` is a **demo approval,
not an author approval**.

`paper_claim` (in `Semantics.lean`) transcribes Proposition 4.1 ("recorded values") of
`paper/Frohman_Locked_Sextic_Numerical_Ledger_Lean_2026.tex`. It is arithmetic on recorded values, with the
recorded inputs as explicit hypotheses. It is not a statement about the geometry of the surface `S`.

Commands (from the scratch repo root; `PH=node <PipelineHalt>/dist/src/bin.js`):

```sh
$PH truth-gate lock --project . --root Semantics,BHK,Equations,ResidualIdentity,WrittenPartner,FmPartnerConjecture \
  --prefix Semantics,Intersections,BHK,Equations,ResidualIdentity,WrittenPartner,FmPartnerConjecture \
  --semantics lean/Semantics.lean --headline ledger_certificate \
  --paper paper/Frohman_Locked_Sextic_Numerical_Ledger_Lean_2026.tex --claim proposition-4.1 \
  --auxiliary-cited "recorded-value lemma cited by the paper; outside the locked statement"
$PH truth-gate approve --by "DEMO scratch approval (not an author approval)"
$PH truth-gate emit-lean            # scripts/SemanticsLock.lean, added to the default lake target
lake build                          # info: truth gate: formal certificate inhabits the locked statement …
$PH truth-gate observe --goal-decl Frohman.Residual.TruthGate.ledger_certificate
$PH truth-gate check --require-observation --ci
```

| scenario | `lake build` (in-build lock) | `truth-gate check` | file |
|---|---|---|---|
| locked state | pass | **pass** (exit 0): "formal certificate inhabits the locked statement" | `check-pass.md` |
| N1: drop `∧ rank = 2` from `paper_claim` (the headline still compiles) | **fails**: "paper_claim changed since the approved lock" | **fail**: a.paper-claim-source, a.paper-claim-expr | `n1.report.json` |
| N2a: whitelist `S_self` by editing the lock, no re-approval | n/a | **fail**: a.approval; c.transport (does not transport) | `n2a.report.json` |
| N2b: same, re-approved and re-emitted | **fails**: "S_self does not transport" | **fail**: c.transport | `n2b.report.json` |
| N3: `sorry` in `intended_correspondence` | **fails**: "depends on non-standard axiom sorryAx" | **fail**: a.semantics-clean, b.axioms, c.transport (unsound), c.certificate | `n3.report.json` |
| N4: a narrower transcription (only `S·h²`, `S·Π`, `S²`) locked and approved | pass | **halt** (exit 2): Proposition 4.1 asserts 4 and 55, which `paper_claim` never mentions | `n4.report.json`, `n4-narrow-transcription.md` |
| N5: `observe --goal "Frohman.Residual.S2 = 25"` | n/a | **HALT** (exit 2): the goal is not `paper_claim` | — |

**Re-run after the independent-transcription rule (2026-11-16, ~3:05 PM CST).** `paper_claim` now carries the provenance doc
comment (`@paper`, the file's SHA-256 `4f9786ed…`, `@section`, and the verbatim `@quote` of the proposition). The lock was re-proposed,
re-approved (demo approval) and re-emitted. `lake build` passes the in-build audit, `observe` matches, and
`check --require-observation` **passes** (exit 0). The new checks a.provenance, a.paper-sha256, a.quote-verbatim, a.no-alias and
b.nontrivial all pass: `paper_claim` uses only `Int` arithmetic and none of `formal_claim`'s constants (`S_h2`, `S2`, …).
`Semantics.lean`, `truth-gate.lock.json`, `SemanticsLock.lean` and `check-pass.md` here are from this re-run. The N1–N5 reports are from
the earlier run; the new rejections (alias, vacuous proof, native_decide, provenance) are exercised by the fixture negatives in CI.

Note: in this demo the correspondence's `formal_claim → paper_claim` direction does not need `formal_claim`, because
`paper_claim` takes the recorded values as hypotheses and is provable by `decide`. The gate certifies only that the locked
`paper_claim` is inhabited. That is the README's stated limit, and it is why the transcription is the author's sign-off.

The 33 other theorems the paper cites are listed as `auxiliary` in the lock (proposed by `--auxiliary-cited`;
the approval decides). They are reported and never presented as certified. `lean/SMore.lean` cannot be imported
next to `lean/Intersections.lean` (both declare `Frohman.Residual.h4`), so its three cited theorems are not seen.
That limit is listed in the README.
