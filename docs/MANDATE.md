# Truth Gate mandate

**Issued by:** Benjamin Stanley Frohman (author), 2026-11-16.
**Applies to:** every bot, Grok chat, CI job and collaborator that works on, or writes about, any of his Lean
formalizations and the papers or Zenodo records that describe them.

## Mandate
1. **Load [TRUTH_GATE.md](../TRUTH_GATE.md) first.** Before any Lean obligation or public claim, run the observation
   pass (`#check intended_correspondence`, `#print paper_claim`, `#print formal_claim`) and change nothing in it.
2. **One fixed lock per formalization.** Each repo has `Semantics.lean` with a fixed `intended_correspondence :
   formal_claim ↔ paper_claim` and an approved `truth-gate.lock.json`. Public work must transport across it;
   anything that does not is rejected.
3. **`paper_claim` is an independent transcription** of the paper's or official statement, carrying the verbatim
   quote, paper path, sha256 and section. It never references or aliases `formal_claim`. The author approves every
   transcription and every change to it.
4. **Rejected outright:** `rfl` / `Iff.rfl` correspondences, `sorry`, `admit`, `native_decide`, axioms other than
   `propext`, `Classical.choice`, `Quot.sound`, a missing quote or sha256, a missing `Semantics.lean` or
   correspondence, a failed `lake build`.
5. **A mismatch keeps the gate red and is reported, never patched.** No weakening, no redefinition of `paper_claim`,
   no lock edits without the author's approval.
6. **Nothing is published or claimed unless the gate passes.** Zenodo drafts for papers with past drift
   ([truth-gate/drift-inventory.md](../truth-gate/drift-inventory.md)) cite the locked commit and state exactly the
   verified claim; they stay drafts until the author confirms.
7. **Honest scope.** Conditional results keep their hypotheses. Never claim an open or Millennium problem is solved.
   Never describe math as probable, likely or expected: only proved, disproved or unsettled.
8. **Reproducibility.** Every repo and paper gives the exact commit, toolchain, `#print axioms` output and one rebuild
   command. Mathlib is never rebuilt (oleans come from `lake exe cache get`).

## Enforcement
- `scripts/verify-lock.sh` (local and CI) and the reusable `.github/workflows/truth-gate.yml`, called from each
  formalization repo on push and pull request to `main`.
- The in-build `#eval` audit (`scripts/SemanticsLock.lean`) makes `lake build` itself fail when the lock is broken.
- PipelineHalt's own CI runs one negative test per rejection plus a passing demo.
