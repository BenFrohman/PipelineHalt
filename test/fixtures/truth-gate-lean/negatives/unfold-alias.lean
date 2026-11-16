-- expect-fail: a.no-alias
-- expect-build: definitionally equal
namespace Fixture

def formal_claim : Prop := ∀ n : Nat, n = 0 + n
theorem formal_holds : formal_claim := fun n => (Nat.zero_add n).symm
/-- Fixture paper sentence.
@paper: paper.tex
@sha256: 199a862b6d93846d2d7634d4ab41a02d54cf29089cbd8fc6a4bbaba2284ab934
@section: Theorem 1 (thm:main)
@quote: "For every natural number $n$, $0 + n = n$"
-/
def paper_claim : Prop := ∀ n : Nat, n = 0 + n
theorem intended_correspondence : formal_claim ↔ paper_claim :=
  ⟨fun h n => h n, fun h n => h n⟩

theorem headline : paper_claim := intended_correspondence.mp formal_holds

end Fixture
