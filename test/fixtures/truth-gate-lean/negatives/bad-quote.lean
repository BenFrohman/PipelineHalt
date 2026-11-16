-- expect-fail: a.quote-verbatim
-- expect-build: -
namespace Fixture

def formal_claim : Prop := ∀ n : Nat, n = 0 + n
theorem formal_holds : formal_claim := fun n => (Nat.zero_add n).symm
/-- @paper: paper.tex @sha256: 199a862b6d93846d2d7634d4ab41a02d54cf29089cbd8fc6a4bbaba2284ab934 @section: Theorem 1 @quote: "For every natural number $n$, $n + 0 = n$" -/
def paper_claim : Prop := ∀ n : Nat, 0 + n = n
theorem intended_correspondence : formal_claim ↔ paper_claim :=
  ⟨fun h n => (h n).symm, fun h n => (h n).symm⟩

theorem headline : paper_claim := intended_correspondence.mp formal_holds

end Fixture
