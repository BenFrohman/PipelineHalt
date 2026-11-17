/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Benjamin Stanley Frohman
-/

-- expect-reject: gate
-- expect-check: a.provenance

/-!
# Truth Gate test fixture (not a paper)

`paper_claim` transcribes the fixture "paper" sentence: "for every natural number n, 0 + n = n".
-/

namespace Fixture

/-- Fixture paper sentence, transcribed literally and independently of `formal_claim`.
@paper: paper.tex
@section: Theorem 1 (thm:main)
@quote: "For every natural number $n$, $0 + n = n$"
-/
def paper_claim : Prop := ∀ n : Nat, 0 + n = n

/-- The fixture's formal statement, in its own form. -/
def formal_claim : Prop := ∀ n : Nat, n = 0 + n

theorem formal_holds : formal_claim := fun n => (Nat.zero_add n).symm

/-- Fixed once. -/
theorem intended_correspondence : formal_claim ↔ paper_claim :=
  ⟨fun h n => (h n).symm, fun h n => (h n).symm⟩

/-- Public headline, obtained by transport across the lock. -/
theorem headline : paper_claim := intended_correspondence.mp formal_holds

/-- Not transported: states the formal side only. -/
theorem formal_only : formal_claim := formal_holds

end Fixture
