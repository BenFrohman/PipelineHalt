/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Benjamin Stanley Frohman
-/

-- expect-fail: b.nontrivial a.no-alias
-- expect-build: vacuous

/-!
# Truth Gate negative fixture

Locked and approved by `run-negatives.sh`; the gate and `lake build` must still reject it.
-/

namespace Fixture

def formal_claim : Prop := ∀ n : Nat, n = 0 + n
theorem formal_holds : formal_claim := fun n => (Nat.zero_add n).symm
/-- Fixture paper sentence.
@paper: paper.tex
@sha256: 199a862b6d93846d2d7634d4ab41a02d54cf29089cbd8fc6a4bbaba2284ab934
@section: Theorem 1 (thm:main)
@quote: "For every natural number $n$, $0 + n = n$"
-/
def paper_claim : Prop := ∀ m : Nat, m = 0 + m
theorem intended_correspondence : formal_claim ↔ paper_claim := Iff.rfl

theorem headline : paper_claim := intended_correspondence.mp formal_holds

end Fixture
