/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license.
Author: Benjamin Stanley Frohman.

# Proofs of the May 31 statements (fixed κ = C_CZ(3), T³)

No `sorry`, no `axiom`. Hypotheses that the May text leaves open appear as explicit
arguments (`StabilizerTransitive`, the unit direction `e ⟂ u`, the differential
inequality). Nothing here asserts global Navier–Stokes regularity.
-/
import MayForm31.Statement

namespace Frohman.MayForm31

open MeasureTheory Frohman.Tether Submodule
open scoped InnerProductSpace RealInnerProductSpace

section General
variable {H : Type*} [NormedAddCommGroup H] [InnerProductSpace ℝ H]

/-- Full isometry group: the stabilizer of `u` is transitive on unit vectors of `uᗮ`
(reflection in `(e - e')ᗮ`). -/
theorem stabilizerTransitive_univ (u : H) : StabilizerTransitive Set.univ u := by
  intro e e' he he' hn hn'
  refine ⟨(ℝ ∙ (e - e'))ᗮ.reflection, Set.mem_univ _, ?_, ?_⟩
  · apply reflection_mem_subspace_eq_self
    rw [mem_orthogonal_singleton_iff_inner_right, inner_sub_left, real_inner_comm,
      he, real_inner_comm, he', sub_zero]
  · exact reflection_sub (hn.trans hn'.symm)

/-- Schur step under a transitive stabilizer, no dimension hypothesis: a symmetric,
C1, C2 form is `𝔗_F[c,1,u]` once one unit `e₀ ⟂ u` exists. -/
theorem eq_smul_tether_of_transitive (act : Set (H ≃ₗᵢ[ℝ] H)) (u : H)
    (hT : StabilizerTransitive act u) (B : LinearMap.BilinForm ℝ H)
    (hsymm : ∀ F G, B F G = B G F) (hC1 : InvariantUnder act u B)
    (hC2 : DegenerateWRTKineticEnergy u B) {e₀ : H} (he₀ : ⟪u, e₀⟫ = 0)
    (hn₀ : ‖e₀‖ = 1) : ∃ c : ℝ, B = 𝔗_F[c, 1, u] := by
  have hq : ∀ x, B x x = B e₀ e₀ * ⟪piU u x, piU u x⟫ := by
    intro x
    rw [degeneracy_forces_projection u B hsymm hC2 x x]
    set p := piU u x with hp
    by_cases hp0 : p = 0
    · simp [hp0]
    have hnp : ‖p‖ ≠ 0 := norm_ne_zero_iff.mpr hp0
    set e := ‖p‖⁻¹ • p
    have hpe : p = ‖p‖ • e := by simp [e, smul_smul, mul_inv_cancel₀ hnp]
    have he : ⟪u, e⟫ = 0 := by simp [e, inner_smul_right, hp, inner_u_piU]
    have hne : ‖e‖ = 1 := by simp [e, norm_smul, inv_mul_cancel₀ hnp]
    obtain ⟨g, hg, hgu, hge⟩ := hT e e₀ he he₀ hne hn₀
    have hB : B e e = B e₀ e₀ := by rw [← hge]; exact (hC1 g hg hgu e e).symm
    rw [hpe]
    simp only [map_smul, LinearMap.smul_apply, smul_eq_mul, real_inner_self_eq_norm_sq, hB]
    rw [← hpe]; ring
  refine ⟨-B e₀ e₀, LinearMap.ext₂ fun x y => ?_⟩
  rw [frohmanianTether_apply]
  have h1 := hq (x + y)
  have h2 := hq x
  have h3 := hq y
  simp only [map_add, LinearMap.add_apply, inner_add_left, inner_add_right] at h1
  rw [hsymm y x, real_inner_comm (piU u x) (piU u y)] at h1
  linear_combination (h1 - h2 - h3) / 2

/-- An antisymmetric form cannot satisfy C3's calibration unless `κ w = 0`. -/
theorem no_antisymmetric_C3 {κ w : ℝ} (hκw : κ * w ≠ 0) (u : H)
    (B : LinearMap.BilinForm ℝ H) (hanti : ∀ F G, B F G = -B G F)
    (h3 : ProducesControllableNegativeFeedback κ w u B) : False := by
  obtain ⟨e, -, -, hB⟩ := h3.calibrated
  have := hanti e e
  exact hκw (by linarith)

end General

/-- `Π_u u = 0` (May 31 L128, was `sorry`). -/
theorem projection : Stmt_projection := fun u => projectionOrthogonalToU u

/-- Degeneracy `B(F,H) ≡ 0` at fixed κ (May 31 L102–119, was `sorry`). -/
theorem degeneracy : Stmt_degeneracy := fun cz ω u F => by
  simpa using degeneracy_verification_smul (kappa cz) (‖ω‖ ^ 2) u F 1

/-- Step 4: κ = C_CZ(3) is the least strength with no positive remainder. -/
theorem step4 : Stmt_step4 := by
  intro cz
  refine ⟨fun M => by simp [kappa], fun κ hκ => ?_⟩
  have := hκ 1
  simp [kappa] at this ⊢
  linarith

/-- NOTE on the literal May 31 wording ("antisymmetric"), not Theorem 2.3: when `ω ≠ 0`
no antisymmetric `B` meets C3, so the literal statement is only VACUOUSLY true. -/
theorem thm23_literal_vacuous (cz : CZConstant3D)
    (ω u : L2Field) (hω : ω ≠ 0) (B : LinearMap.BilinForm ℝ L2Field)
    (hanti : ∀ F G, B F G = -B G F) : ¬ MayC3 cz ω u B := by
  intro h3
  refine no_antisymmetric_C3 ?_ u B hanti h3
  have : 0 < ‖ω‖ := norm_pos_iff.mpr hω
  exact mul_ne_zero cz.pos.ne' (by positivity)

/-- **Theorem 2.3 (primary, symmetric metric-correction reading)**, fixed κ = C_CZ(3).
CONDITIONAL on the hypothesis `StabilizerTransitive act u`, which is OPEN for SDiff(T³). -/
theorem thm23 : Stmt_thm23 := by
  intro cz act ω u hT B hsymm hC1 hC2 hC3
  obtain ⟨e₀, he₀, hn₀, -⟩ := hC3.calibrated
  obtain ⟨c, rfl⟩ := eq_smul_tether_of_transitive act u hT B hsymm hC1 hC2 he₀ hn₀
  have hc := feedback_fixes_coefficient c hC3
  subst hc
  ext x y
  simp [mayTether, frohmanianTether_apply]

/-- Former name of `thm23`, kept for compatibility. -/
theorem thm23_symmetric : Stmt_thm23_symmetric := thm23

/-- Unconditional on the full isometry group (the Step-1 hypothesis is then proved). -/
theorem thm23_symmetric_isometries (cz : CZConstant3D) (ω u : L2Field)
    (B : LinearMap.BilinForm ℝ L2Field) (hsymm : ∀ F G, B F G = B G F)
    (hC1 : InvariantUnder Set.univ u B) (hC2 : DegenerateWRTKineticEnergy u B)
    (hC3 : MayC3 cz ω u B) : B = mayTether cz ω u :=
  thm23 cz Set.univ ω u (stabilizerTransitive_univ u) B hsymm hC1 hC2 hC3

/-- Existence: the fixed-κ tether is symmetric, C1 (any isometry set), C2, C3. -/
theorem existence : Stmt_existence := by
  intro cz act ω u ⟨e, he, hn⟩
  refine ⟨frohmanianTether_symm _ _ u, fun g _ hg F G =>
    frohmanianTether_invariant _ _ u g hg F G, frohmanianTether_degenerate _ _ u, ?_⟩
  refine ⟨frohmanianTether_self_nonpos (le_of_lt cz.pos) (by positivity) u, e, he, hn, ?_⟩
  rw [mayTether, frohmanianTether_apply, piU_eq_self_of_inner_eq_zero he, real_inner_self_eq_norm_sq,
    hn]
  ring

/-- May 2 `main3` bound: `y' ≤ C − κ y²` ⇒ `y ≤ max(y 0, √(C/κ))`, κ = C_CZ(3). -/
theorem main3_bound : Stmt_main3_bound := by
  intro cz C T y y' hc hd hineq t ht
  have hκ : 0 < kappa cz := cz.pos
  by_contra hlt
  push Not at hlt
  set M := (max (y 0) (Real.sqrt (C / kappa cz)) + y t) / 2 with hMdef
  have hM : max (y 0) (Real.sqrt (C / kappa cz)) < M := by rw [hMdef]; linarith
  have hMt : M < y t := by rw [hMdef]; linarith
  have hM0 : 0 < M := lt_of_le_of_lt (Real.sqrt_nonneg _) (lt_of_le_of_lt (le_max_right _ _) hM)
  have hMs : Real.sqrt (C / kappa cz) < M := lt_of_le_of_lt (le_max_right _ _) hM
  have hneg : C - kappa cz * M ^ 2 < 0 := by
    have h1 : C / kappa cz < M ^ 2 := by
      rcases le_or_gt (C / kappa cz) 0 with h | h
      · nlinarith
      · calc C / kappa cz = Real.sqrt (C / kappa cz) ^ 2 := (Real.sq_sqrt h.le).symm
            _ < M ^ 2 := by gcongr
    rw [div_lt_iff₀ hκ] at h1; nlinarith
  have := image_le_of_deriv_right_lt_deriv_boundary' (f := y) (f' := y')
    (a := 0) (b := T) (B := fun _ => M) (B' := fun _ => 0) hc hd
    (le_of_lt (lt_of_le_of_lt (le_max_left _ _) hM)) continuousOn_const
    (fun x _ => hasDerivWithinAt_const _ _ _)
    (fun x hx hyx => lt_of_le_of_lt (hineq x hx) (by rw [hyx]; exact hneg)) ht
  simp only at this
  linarith

end Frohman.MayForm31
