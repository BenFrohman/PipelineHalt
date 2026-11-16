/-!
# Truth Gate test fixture (not a paper)

`paper_claim` transcribes the fixture "paper" sentence: "for every natural number n, 0 + n = n".
-/

namespace Fixture

/-- Fixture paper sentence, transcribed literally. -/
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
