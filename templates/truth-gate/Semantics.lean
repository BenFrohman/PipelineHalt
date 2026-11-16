/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Benjamin Stanley Frohman
-/
-- import the modules that define the objects `formal_claim` talks about
-- import MyProject.Main

/-!
# Semantics lock

`paper_claim` is a literal Lean transcription of the paper's (or the official) statement. The author
reviews and approves it; `pipelinehalt truth-gate lock` / `approve` then fix it by hash. The kernel
cannot check that this transcription says what the author meant: that is the author's sign-off.

Rules:
* Conditional results keep every hypothesis explicit inside `paper_claim` (`H₁ → H₂ → Conclusion`).
  A conditional result is never stated as its bare conclusion.
* `paper_claim` is an independent transcription. It must never be defined as, reference, unfold to or alias
  `formal_claim`, must not use any project constant that `formal_claim` depends on, and must not be
  definitionally equal to it. Write it from the paper's words, with core/Mathlib vocabulary.
* `paper_claim`'s doc comment carries the provenance, in this exact format (checked against the paper file):
  `@paper: <repo-relative path> @sha256: <sha256 of that file> @section: <section/page> @quote: "<verbatim claim>"`
* `intended_correspondence` must not be proved by `rfl`, `Iff.rfl`, `id`, `⟨id, id⟩` or `Iff.of_eq rfl`.
* No `sorry`, `admit`, `axiom`, `native_decide` (`Lean.ofReduceBool` / `Lean.trustCompiler`) or `opaque`.
* Public (whitelisted) theorems have type `paper_claim` and are obtained as
  `intended_correspondence.mp …`. Intermediate lemmas can stay local.
-/

namespace MyProject.Semantics

/-- Literal, independent transcription of the paper's claim.
@paper: paper/main.tex
@sha256: 0000000000000000000000000000000000000000000000000000000000000000
@section: Theorem 1.2 (p. 3)
@quote: "REPLACE with the paper's claim, copied verbatim"
-/
def paper_claim : Prop :=
  sorry -- REPLACE: the transcription (the gate rejects this file while `sorry` is present)

/-- The statement in the development's own definitions. -/
def formal_claim : Prop :=
  sorry -- REPLACE

/-- Fixed once. Proved with only propext, Classical.choice, Quot.sound. For a one-way result use
`formal_claim → paper_claim` and lock with direction `formal_implies_paper`. -/
theorem intended_correspondence : formal_claim ↔ paper_claim := by
  sorry -- REPLACE

/-- Public headline: the locked statement, obtained only by transport across the lock. -/
theorem main_result : paper_claim :=
  intended_correspondence.mp (sorry /- REPLACE: the formal proof -/)

end MyProject.Semantics
