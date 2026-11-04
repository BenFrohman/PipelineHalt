/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license.
Author: Benjamin Stanley Frohman.

# Orbit layer: abstract SDiff coadjoint action, Euler as coadjoint motion, kinetic energy

This layer follows the author's 2026-11-03 answers to Q1, Q2, Q3 and Q5:
* Q1: the coadjoint orbit is a subtype of the divergence-free fields inside the ambient
  L² space `L2Field`.
* Q2: the weight is the integrated enstrophy `‖ω‖²`. The Hamiltonian is `½‖u‖²` with
  `u = BS ω`.
* Q3: `u` is tied to `ω` by an abstract Biot–Savart operator `BS` (the role of
  `velocity_from_vorticity` in ArnoldGeometric.lean; the singular kernel stays abstract).
* Q5: C1 is the SDiff pushforward action. "Only |ω|² is invariant" is the transitivity
  hypothesis `CasimirLevelTransitive` below.

Everything the classical theory supplies but this file does not prove is a FIELD of
the structure `EulerGeometry` (a named hypothesis). There is no `axiom` and no `sorry`.
Nothing here asserts existence of Euler or Navier–Stokes solutions, or any regularity.

Reuse note: ArnoldGeometric.lean (NS_Millennium_Proof) defines `CoadjointAction g ω := ω`
(an identity stub) and `velocity_from_vorticity ω := BiotSavart ω.val`. The stub is NOT
reused here, because it would make C1 trivially true. The action is abstract data instead.
-/
import MayForm31.Proofs

namespace Frohman.MayForm31
noncomputable section

open Frohman.Tether
open scoped InnerProductSpace RealInnerProductSpace

/-- Abstract hydrodynamic geometry on `L2Field`. Each `Prop` field is a named
hypothesis: classical facts that are NOT proved here. -/
structure EulerGeometry where
  /-- Divergence-free fields (the ambient phase space of the orbit). -/
  divFree : Submodule ℝ L2Field
  /-- The volume-preserving diffeomorphism group SDiff(T³) (C¹ or Sobolev, abstract). -/
  G : Type
  [grp : Group G]
  /-- Pushforward action of SDiff on vorticity, as L² isometries.
  HYPOTHESIS (Q5): pushforward preserves the L² norm (enstrophy Casimir). -/
  act : G →* (L2Field ≃ₗᵢ[ℝ] L2Field)
  /-- HYPOTHESIS: pushforward preserves divergence-freeness. -/
  act_divFree : ∀ g ω, ω ∈ divFree → act g ω ∈ divFree
  /-- Abstract Biot–Savart operator `u = BS ω` (Q3). -/
  BS : L2Field →L[ℝ] L2Field
  /-- Abstract curl. -/
  curl : L2Field →ₗ[ℝ] L2Field
  /-- HYPOTHESIS (open mapping property): BS lands in divergence-free fields. -/
  bs_divFree : ∀ ω ∈ divFree, BS ω ∈ divFree
  /-- HYPOTHESIS (open mapping property): `curl ∘ BS = id` on divergence-free fields. -/
  curl_bs : ∀ ω ∈ divFree, curl (BS ω) = ω

attribute [instance] EulerGeometry.grp

namespace EulerGeometry
variable (E : EulerGeometry)

/-- Q1: the vorticity phase space: divergence-free fields (subtype). -/
abbrev Vort := {ω : L2Field // ω ∈ E.divFree}

/-- The coadjoint action on the subtype. -/
def coad (g : E.G) (ω : E.Vort) : E.Vort := ⟨E.act g ω.1, E.act_divFree g ω.1 ω.2⟩

/-- The coadjoint orbit through `ω₀`, as a subtype of divergence-free fields. -/
def Orbit (ω₀ : E.Vort) : Set E.Vort := Set.range fun g => E.coad g ω₀

/-- Velocity recovered from vorticity (role of `velocity_from_vorticity`). -/
def velocity (ω : E.Vort) : L2Field := E.BS ω.1

/-- Q2: integrated enstrophy Casimir `‖ω‖²`. -/
def enstrophy (ω : E.Vort) : ℝ := ‖ω.1‖ ^ 2

/-- Kinetic-energy Hamiltonian `½‖u‖²`, `u = BS ω`. -/
def kineticEnergy (ω : L2Field) : ℝ := ‖E.BS ω‖ ^ 2 / 2

/-- Euler as coadjoint motion (Arnold): the trajectory stays in one coadjoint orbit,
moved by a curve `g t` in SDiff. -/
def IsCoadjointMotion (ω : ℝ → E.Vort) : Prop :=
  ∃ g : ℝ → E.G, ∀ t, ω t = E.coad (g t) (ω 0)

/-- Q5, "only |ω|² is invariant", made explicit: the stabilizer of the velocity
`u = BS ω` inside the SDiff action moves any unit vector of `uᗮ` to any other.
OPEN for the real SDiff(T³) action. -/
def CasimirLevelTransitive (ω : E.Vort) : Prop :=
  StabilizerTransitive (Set.range E.act) (E.velocity ω)

/-- C1 relative to the SDiff action. -/
def C1 (ω : E.Vort) (B : LinearMap.BilinForm ℝ L2Field) : Prop :=
  InvariantUnder (Set.range E.act) (E.velocity ω) B

/-- **Theorem 2.3, orbit form.** Symmetric `B`, C1 = SDiff action, C2, C3 with the
integrated weight `‖ω‖²` and `κ = C_CZ(3)` ⇒ `B` is the tether at `u = BS ω`. -/
def Stmt_thm23_orbit : Prop :=
  ∀ (cz : CZConstant3D) (ω : E.Vort), E.CasimirLevelTransitive ω →
    ∀ B : LinearMap.BilinForm ℝ L2Field, (∀ F G, B F G = B G F) → E.C1 ω B →
    DegenerateWRTKineticEnergy (E.velocity ω) B → MayC3 cz ω.1 (E.velocity ω) B →
    B = mayTether cz ω.1 (E.velocity ω)

/-! ## Proofs -/

/-- Proved: the action preserves enstrophy (from the isometry field). -/
theorem enstrophy_coad (g : E.G) (ω : E.Vort) : E.enstrophy (E.coad g ω) = E.enstrophy ω := by
  simp [enstrophy, coad, LinearIsometryEquiv.norm_map]

/-- Proved: the orbit is closed under the action. -/
theorem coad_mem_orbit {ω₀ ω : E.Vort} (h : ω ∈ E.Orbit ω₀) (g : E.G) :
    E.coad g ω ∈ E.Orbit ω₀ := by
  obtain ⟨g₀, rfl⟩ := h
  refine ⟨g * g₀, ?_⟩
  ext1; simp [coad, map_mul, LinearIsometryEquiv.mul_def]

/-- Proved: coadjoint motion stays on the orbit of its initial point. -/
theorem coadjointMotion_mem_orbit {ω : ℝ → E.Vort} (h : E.IsCoadjointMotion ω) (t : ℝ) :
    ω t ∈ E.Orbit (ω 0) := by
  obtain ⟨g, hg⟩ := h
  exact ⟨g t, (hg t).symm⟩

/-- Proved: coadjoint motion conserves the enstrophy Casimir. -/
theorem coadjointMotion_enstrophy {ω : ℝ → E.Vort} (h : E.IsCoadjointMotion ω) (t : ℝ) :
    E.enstrophy (ω t) = E.enstrophy (ω 0) := by
  obtain ⟨g, hg⟩ := h
  rw [hg t, enstrophy_coad]

/-- Proved: the directional derivative of the kinetic energy is `⟪BS ω, BS h⟫`,
i.e. `δH` pairs through the velocity `u = BS ω`. -/
theorem kineticEnergy_hasDerivAt (ω h : L2Field) :
    HasDerivAt (fun t : ℝ => E.kineticEnergy (ω + t • h)) ⟪E.BS ω, E.BS h⟫ 0 := by
  have key : (fun t : ℝ => E.kineticEnergy (ω + t • h)) = fun t =>
      ‖E.BS ω‖ ^ 2 / 2 + t * ⟪E.BS ω, E.BS h⟫ + t ^ 2 * (‖E.BS h‖ ^ 2 / 2) := by
    funext t
    simp only [kineticEnergy, map_add, map_smul]
    rw [← real_inner_self_eq_norm_sq, ← real_inner_self_eq_norm_sq,
      ← real_inner_self_eq_norm_sq]
    simp only [inner_add_left, inner_add_right, real_inner_smul_left, real_inner_smul_right,
      real_inner_comm (E.BS ω) (E.BS h)]
    ring
  rw [key]
  have h1 := ((hasDerivAt_id (0 : ℝ)).mul_const ⟪E.BS ω, E.BS h⟫).const_add (‖E.BS ω‖ ^ 2 / 2)
  have h2 := (((hasDerivAt_id (0 : ℝ)).mul (hasDerivAt_id (0 : ℝ))).mul_const (‖E.BS h‖ ^ 2 / 2))
  convert h1.add h2 using 1
  · funext t; simp [pow_two]
  · simp

/-- Proved: the kinetic energy vanishes on divergence-free `ω` only if `ω = 0`
(using the hypothesis field `curl_bs`). -/
theorem kineticEnergy_eq_zero_iff (ω : E.Vort) : E.kineticEnergy ω.1 = 0 ↔ ω.1 = 0 := by
  constructor
  · intro h
    have : E.BS ω.1 = 0 := by
      have : ‖E.BS ω.1‖ ^ 2 = 0 := by unfold kineticEnergy at h; linarith
      simpa using this
    rw [← E.curl_bs ω.1 ω.2, this, map_zero]
  · intro h; simp [kineticEnergy, h]

/-- **Theorem 2.3, orbit form: CONDITIONAL on `CasimirLevelTransitive`.** -/
theorem thm23_orbit : E.Stmt_thm23_orbit := by
  intro cz ω hT B hs hC1 hC2 hC3
  exact thm23 cz (Set.range E.act) ω.1 (E.velocity ω) hT B hs hC1 hC2 hC3

/-- Proved: the tether at `u = BS ω` satisfies C1 for the SDiff action, C2 and C3
(given a unit direction orthogonal to the velocity). -/
theorem tether_admissible_orbit (cz : CZConstant3D) (ω : E.Vort)
    (he : ∃ e : L2Field, ⟪E.velocity ω, e⟫ = 0 ∧ ‖e‖ = 1) :
    E.C1 ω (mayTether cz ω.1 (E.velocity ω)) ∧
    DegenerateWRTKineticEnergy (E.velocity ω) (mayTether cz ω.1 (E.velocity ω)) ∧
    MayC3 cz ω.1 (E.velocity ω) (mayTether cz ω.1 (E.velocity ω)) :=
  let h := existence cz (Set.range E.act) ω.1 (E.velocity ω) he
  ⟨h.2.1, h.2.2.1, h.2.2.2⟩

end EulerGeometry
end
end Frohman.MayForm31
