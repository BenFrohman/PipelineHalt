/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Benjamin Stanley Frohman
-/

-- expect-reject: missing-correspondence

/-!
# Truth Gate test fixture (not a paper)

`paper_claim` transcribes the fixture "paper" sentence: "for every natural number n, 0 + n = n".
-/

namespace Fixture

/-- Fixture paper sentence, transcribed literally and independently of `formal_claim`.
@paper: paper.tex
@sha256: 199a862b6d93846d2d7634d4ab41a02d54cf29089cbd8fc6a4bbaba2284ab934
@section: Theorem 1 (thm:main)
@quote: "For every natural number $n$, $0 + n = n$"
-/
def paper_claim : Prop := ∀ n : Nat, 0 + n = n

/-- The fixture's formal statement, in its own form. -/
def formal_claim : Prop := ∀ n : Nat, n = 0 + n

theorem formal_holds : formal_claim := fun n => (Nat.zero_add n).symm

/-- Public headline, obtained by transport across the lock. -/
theorem headline : paper_claim := fun n => (formal_holds n).symm

/-- Not transported: states the formal side only. -/
theorem formal_only : formal_claim := formal_holds

end Fixture
