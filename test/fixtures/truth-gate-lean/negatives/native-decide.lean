/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Benjamin Stanley Frohman
-/

-- expect-fail: b.native b.axioms a.semantics-clean
-- expect-build: native_decide

/-!
# Truth Gate negative fixture

Locked and approved by `run-negatives.sh`; the gate and `lake build` must still reject it.
-/

namespace Fixture

def formal_claim : Prop := (12345 * 6789 : Nat) = 83810205
theorem formal_holds : formal_claim := by unfold formal_claim; decide
/-- Fixture paper sentence (native_decide negative; quote deliberately the fixture's).
@paper: paper.tex
@sha256: 199a862b6d93846d2d7634d4ab41a02d54cf29089cbd8fc6a4bbaba2284ab934
@section: Theorem 1 (thm:main)
@quote: "For every natural number $n$, $0 + n = n$"
-/
def paper_claim : Prop := (12345 * 6789 : Nat) ≠ 83810206
theorem intended_correspondence : formal_claim ↔ paper_claim :=
  ⟨fun _ => by unfold paper_claim; native_decide, fun _ => by unfold formal_claim; decide⟩

theorem headline : paper_claim := intended_correspondence.mp formal_holds

end Fixture
