/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Benjamin Stanley Frohman
-/
import Intersections

/-!
# Truth Gate semantics (DEMO, scratch copy only; not pushed anywhere)

`paper_claim` is a literal transcription of Proposition 4.1 ("recorded values") in
`paper/Frohman_Locked_Sextic_Numerical_Ledger_Lean_2026.tex`. It is arithmetic on recorded values
only and says nothing about the geometry of `S`.
-/

namespace Frohman.Residual.TruthGate

/-- Literal transcription of Proposition 4.1 ("recorded values"). The recorded inputs
`h^4 = 6`, `h^2·Π = 1`, `Π^2 = 21`, `χ(O_S) = 5`, `p_g = 4` and span rank `2` are hypotheses,
exactly as the paper says ("from these values"); the conclusions are the paper's equalities. -/
def paper_claim : Prop :=
  ∀ h4 hPi Pi2 chi pg rank : Int,
    h4 = 6 → hPi = 1 → Pi2 = 21 → chi = 5 → pg = 4 → rank = 2 →
      h4 - hPi = 5 ∧ hPi - Pi2 = -20 ∧ h4 - 2 * hPi + Pi2 = 25 ∧
      (5 - 1) * (5 - 2) / 2 = (6 : Int) ∧ chi = 5 ∧ pg = 4 ∧ 12 * chi - 5 = 55 ∧ rank = 2

/-- What the repository's Lean code states, in its own definitions (`lean/Intersections.lean`). -/
def formal_claim : Prop :=
  S_h2 = 5 ∧ S_Pi = -20 ∧ S2 = 25 ∧ C_genus = 6 ∧ chi_O_S = 5 ∧ p_g = 4 ∧ e_S = 55 ∧
    spanRank = 2

/-- Fixed once (approved lock). All public results compose with this. -/
theorem intended_correspondence : formal_claim ↔ paper_claim := by
  constructor
  · intro _ h4 hPi Pi2 chi pg rank h1 h2 h3 h4' h5 h6
    subst h1; subst h2; subst h3; subst h4'; subst h5; subst h6; decide
  · intro _
    exact ⟨S_degree, S_meets_Pi, S_self, curve_genus, chi_S, geometric_genus, topological_euler,
      no_new_independent_class⟩

/-- Public headline: the locked statement, obtained only by transport across the lock. -/
theorem ledger_certificate : paper_claim :=
  intended_correspondence.mp
    ⟨S_degree, S_meets_Pi, S_self, curve_genus, chi_S, geometric_genus, topological_euler,
      no_new_independent_class⟩

end Frohman.Residual.TruthGate
