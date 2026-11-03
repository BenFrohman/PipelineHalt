/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license.
Author: Benjamin Stanley Frohman.

# May 31 2026 statements, fixed κ = C_CZ(3), on T³ (vorticity level)

Statements only; proofs are in `MayForm31/Proofs.lean`.
Line numbers `L..` refer to the May 31 `Tether.lean` snapshot
(commit 3582a57, `history/2026-05-31_Tether_lean/Tether_May31.lean.txt`).
`vFinal` = May 21 2026 vFinal excerpt (commit f2fd3ed), `main3` = May 2 2026
excerpt (commit 67f0df4), `roadmap` = May 18 2026 excerpt (commit 03a314d).

Ambiguities in the May text are NOT resolved here; they are recorded as
PipelineHalt clarification questions (`examples/may31-fixed-kappa/` in PipelineHalt).

## Modelling choices (each one is a recorded halt question)
* Q1: the space. `T³ = UnitAddTorus (Fin 3)` (Mathlib), fields in `L²(T³; ℝ³)`.
* Q2: the weight. L59–60 and vFinal (4) weight pointwise by `|ω(x)|²` (and in L59–63 /
  vFinal (4) also by the Biot–Savart kernel `K_BS(x-y)`). Here the weight is collapsed
  to `w = ∫|ω|² = ‖ω‖²_{L²}` and the kernel is the local one of the 2-form (L71,
  vFinal (6) second term). The pointwise/nonlocal kernel is NOT formalized.
* Q3: u and ω are independent L² fields; the Biot–Savart relation u = BS ω (L122) is
  not modelled.
* Q4: symmetry. L168/L222 and vFinal Thm 8.1 say "bilinear antisymmetric"; the kernel
  `-κ∫|ω|² δu·δv` (L71) is symmetric. Both readings are stated below.
* Q5: C1. L76–80 asks invariance under the SDiff(T³) coadjoint action. That action is
  taken as an abstract set `act` of L²-isometries; the step "only |ω|² is invariant"
  (L155–157, L159–161) is the named hypothesis `StabilizerTransitive`.
-/
import TetherMayForm.Basic
import Mathlib.Analysis.Fourier.AddCircleMulti
import Mathlib.MeasureTheory.Function.L2Space
import Mathlib.Analysis.Calculus.MeanValue

namespace Frohman.MayForm31
noncomputable section

open MeasureTheory Frohman.Tether
open scoped InnerProductSpace RealInnerProductSpace

/-- L31 "We work on the 3-torus": Mathlib's `UnitAddTorus (Fin 3)`. -/
abbrev T3 := UnitAddTorus (Fin 3)
/-- ℝ³ with the Euclidean inner product. -/
abbrev R3 := EuclideanSpace ℝ (Fin 3)
/-- L33–34 velocity / vorticity fields, in `L²(T³; ℝ³)` (L45–46 integrate `v·u`, `|u|²`). -/
abbrev L2Field := Lp R3 2 (volume : Measure T3)

/-- **L49–53**: `κ := C_CZ(3)`, "the universal 3D Calderón–Zygmund constant"
(vFinal §5). Mathlib (pinned rev) has no Calderón–Zygmund or Riesz-transform theory, so
the constant is carried as data: a real `C` with the positivity of L51 (`czc_3d_pos`,
an `axiom` in May; here a structure field). The *value* of C_CZ(3) is not determined
here. -/
structure CZConstant3D where
  C : ℝ
  pos : 0 < C

/-- L53 `def κ : ℝ := CalderonZygmundConstant3D` — fixed, not a free parameter. -/
def kappa (cz : CZConstant3D) : ℝ := cz.C

/-- **L67–71 / vFinal (6), metric part, fixed κ**: `B(δu,δv) = -κ ∫|ω|² (δu·δv)` with the
L43–47 projection `Π_u` applied to both slots (L62–63), weight collapsed (Q2). -/
noncomputable def mayTether (cz : CZConstant3D) (ω u : L2Field) :
    LinearMap.BilinForm ℝ L2Field :=
  𝔗_F[kappa cz, ‖ω‖ ^ 2, u]

/-- **L76–80 C1** relative to an abstract set `act` of L²-isometries (Q5). -/
def InvariantUnder {H : Type*} [NormedAddCommGroup H] [InnerProductSpace ℝ H]
    (act : Set (H ≃ₗᵢ[ℝ] H)) (u : H) (B : LinearMap.BilinForm ℝ H) : Prop :=
  ∀ g ∈ act, g u = u → ∀ F G, B (g F) (g G) = B F G

/-- **Named hypothesis for L155–162 (Step 1, "only |ω|² is invariant")**: the
stabilizer of `u` in `act` moves any unit vector of `uᗮ` to any other. True for the
full isometry group (proved); OPEN for the actual SDiff(T³) coadjoint action. -/
def StabilizerTransitive {H : Type*} [NormedAddCommGroup H] [InnerProductSpace ℝ H]
    (act : Set (H ≃ₗᵢ[ℝ] H)) (u : H) : Prop :=
  ∀ e e' : H, ⟪u, e⟫ = 0 → ⟪u, e'⟫ = 0 → ‖e‖ = 1 → ‖e'‖ = 1 →
    ∃ g ∈ act, g u = u ∧ g e = e'

/-- **L87–93 C3, faithful replacement of the `True` placeholder**: "at a spatial maximum
of |ω_ε|² the correction contributes a term whose leading-order coefficient is exactly
-κ M_ε²": negativity plus calibration `B(e,e) = -κ w` on one unit direction `e ⟂ u`
(Basic.lean `ProducesControllableNegativeFeedback`, with κ fixed). -/
def MayC3 (cz : CZConstant3D) (ω u : L2Field) (B : LinearMap.BilinForm ℝ L2Field) : Prop :=
  ProducesControllableNegativeFeedback (kappa cz) (‖ω‖ ^ 2) u B

/-- **L194–197 (Step 4)**: "the correction must supply exactly -κ M² … so that
absorption leaves no positive remainder": the net leading coefficient `C − κ` at the
maximum is non-positive for every value of `M`. -/
def NoPositiveRemainder (C κ : ℝ) : Prop := ∀ M : ℝ, C * M ^ 2 - κ * M ^ 2 ≤ 0

/-! ## The May statements -/

/-- **L102–103 / L114 / vFinal §5 "Degeneracy"**: `B(F, H) ≡ 0` (δH = u), for every `F`
(in particular the mollified sup-norm proxy). -/
def Stmt_degeneracy : Prop :=
  ∀ (cz : CZConstant3D) (ω u F : L2Field), mayTether cz ω u F u = 0

/-- **L128 `projectionOrthogonalToU`**: `Π_u u = 0` (a `sorry` on May 31). -/
def Stmt_projection : Prop := ∀ u : L2Field, piU u u = 0

/-- **L190–201 Step 4 with κ = C_CZ(3)**: κ = C_CZ is the least strength with no
positive remainder. -/
def Stmt_step4 : Prop :=
  ∀ cz : CZConstant3D, IsLeast {κ : ℝ | NoPositiveRemainder cz.C κ} (kappa cz)

/-- **L219–226 Theorem 2.3, LITERAL reading (antisymmetric, Q4).** -/
def Stmt_thm23_literal : Prop :=
  ∀ (cz : CZConstant3D) (act : Set (L2Field ≃ₗᵢ[ℝ] L2Field)) (ω u : L2Field)
    (B : LinearMap.BilinForm ℝ L2Field),
    (∀ F G, B F G = -B G F) → InvariantUnder act u B →
    DegenerateWRTKineticEnergy u B → MayC3 cz ω u B → B = mayTether cz ω u

/-- **L219–226 Theorem 2.3, SYMMETRIC (metric) reading (Q4), fixed κ, with the
Step-1 hypothesis made explicit (Q5).** -/
def Stmt_thm23_symmetric : Prop :=
  ∀ (cz : CZConstant3D) (act : Set (L2Field ≃ₗᵢ[ℝ] L2Field)) (ω u : L2Field),
    StabilizerTransitive act u →
    ∀ B : LinearMap.BilinForm ℝ L2Field,
    (∀ F G, B F G = B G F) → InvariantUnder act u B →
    DegenerateWRTKineticEnergy u B → MayC3 cz ω u B → B = mayTether cz ω u

/-- Existence half: the fixed-κ tether is itself admissible (given a unit e ⟂ u). -/
def Stmt_existence : Prop :=
  ∀ (cz : CZConstant3D) (act : Set (L2Field ≃ₗᵢ[ℝ] L2Field)) (ω u : L2Field),
    (∃ e : L2Field, ⟪u, e⟫ = 0 ∧ ‖e‖ = 1) →
    (∀ F G, mayTether cz ω u F G = mayTether cz ω u G F) ∧
    InvariantUnder act u (mayTether cz ω u) ∧
    DegenerateWRTKineticEnergy u (mayTether cz ω u) ∧ MayC3 cz ω u (mayTether cz ω u)

/-- **main3 (May 2) Tether Bounding Inequality consequence**: any `y` with
`y' ≤ C − κ y²` stays below `max(y 0, √(C/κ))`, κ = C_CZ. (That NS vorticity obeys the
inequality is NOT stated here; it is OPEN.) -/
def Stmt_main3_bound : Prop :=
  ∀ (cz : CZConstant3D) (C T : ℝ) (y y' : ℝ → ℝ),
    ContinuousOn y (Set.Icc 0 T) →
    (∀ x ∈ Set.Ico 0 T, HasDerivWithinAt y (y' x) (Set.Ici x) x) →
    (∀ x ∈ Set.Ico 0 T, y' x ≤ C - kappa cz * y x ^ 2) →
    ∀ t ∈ Set.Icc 0 T, y t ≤ max (y 0) (Real.sqrt (C / kappa cz))

end
end Frohman.MayForm31
