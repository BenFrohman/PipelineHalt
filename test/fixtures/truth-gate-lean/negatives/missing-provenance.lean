-- expect-fail: lock
-- expect-build: -
namespace Fixture

def formal_claim : Prop := ∀ n : Nat, n = 0 + n
theorem formal_holds : formal_claim := fun n => (Nat.zero_add n).symm
/-- Fixture paper sentence, with no provenance fields. -/
def paper_claim : Prop := ∀ n : Nat, 0 + n = n
theorem intended_correspondence : formal_claim ↔ paper_claim :=
  ⟨fun h n => (h n).symm, fun h n => (h n).symm⟩

theorem headline : paper_claim := intended_correspondence.mp formal_holds

end Fixture
