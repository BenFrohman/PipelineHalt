# Drift inventory: Zenodo records whose Lean statement differs from the paper's claim

Compiled 2026-11-16 (America/Chicago) for the Truth Gate rollout. **No Zenodo record was created, edited or published.**
This file lists records whose drift an earlier audit confirmed, or which the repository's own Lean proves: the Lean statement is narrower, conditional,
vacuous or different from the paper's claim; the title misstates the claim; or the statement is disproved as written. Open PipelineHalt
flags that nobody triaged are **not** listed (see "Not listed" below).

Sources: `/workspace/zaudit/all.json` (Zenodo API dump of 296 records: DOIs, concept DOIs, versions, related identifiers, descriptions),
`/workspace/gh_and_zenodo_inventory.json`, `PipelineHalt/examples/*/NOTES.md` and `LEDGER.md` (PipelineHalt runs of 2026-11-03),
`/workspace/doi-23717084-alignment-20261109/REPORT.md`, `/workspace/drift_review.md`. "Lean today" quotes the default branch of a fresh
shallow clone taken 2026-11-16 ~14:50 CST, at the commit shown. I read these declarations; I did not rebuild these repos, so
"Lean today" means "what the source states", not "what I re-checked with the kernel".

Every record below is published (`state: done`, `submitted: true`). No unsubmitted draft in the dump matched these repos.

## Summary

| # | Concept DOI | Version DOIs | Repo | Drift |
|---|---|---|---|---|
| 1 | 10.5281/zenodo.23627609 | 23627610, 23717084, 23749850, 24126051 | NS_Millennium_Proof | Title says global regularity, but the Lean result is a conditional reduction. The hypothesis named "direction curvature" is a uniform envelope. Extra Lean hypotheses; a cited name is missing |
| 2 | 10.5281/zenodo.23652840 | 23652841, 23717083, 23749846, 24125518, 24125937 | fefferman-clay-navier-stokes | Before v1.5.0 the reduction's hypothesis was unsatisfiable (proved in Lean), so the archived reduction is vacuous |
| 3 | 10.5281/zenodo.23867489 | 23867490, 23905163, 23905347 | fefferman-clay-navier-stokes | Same as 2 (an earlier concept with the same title) |
| 4 | 10.5281/zenodo.23749844 | 23749845 | fefferman-clay-navier-stokes, NS_Millennium_Proof | Title and abstract call the hypothesis a "direction-curvature bound" and the theorem "unconditional". The hypothesis is a uniform envelope (NS) or was unsatisfiable (fefferman, pre-v1.5.0) |
| 5 | 10.5281/zenodo.23747591 | 23747592, 23782560, 23794113, 23845207 | eth-conflict-clause-lattice | Titles of 23747592 and 23782560: "Sub-Exponential Refutation of the Exponential Time Hypothesis". The Lean bounds a step counter whose cost is defined to be the bound; it is not an algorithm deciding 3-SAT |
| 6 | 10.5281/zenodo.23629479; 10.5281/zenodo.23867495 | 23629480; 23867496, 23905167, 23905320, 23932503, 23932718, 23932883, 23932891 | HODGE | Klein quadric modelled with `cl := LinearMap.id` and `construct γ := γ`, so the geometric statements are true by `rfl` |
| 7 | 10.5281/zenodo.23629481; 10.5281/zenodo.23867581 | 23629482; 23867582, 23903914, 23905243 | StandardConjectures | `IsHodge` and `IsAlgebraic` are defined as `True`, so "Hodge on X×X ⇒ Lefschetz B" is vacuous relative to the title |
| 8 | 10.5281/zenodo.24079622; 10.5281/zenodo.24080309 | 24079623; 24080310 | frohmanian-tether-conditional-regularity | The legacy solution object did not encode Navier–Stokes, the legacy BKM hypothesis was uninhabited (four conditional theorems vacuous), and the analytic-bridge target statement was false as written (all proved in Lean; reported in 10.5281/zenodo.24102969) |
| 9 | 10.5281/zenodo.21856429 | 21856430 | NS_Millennium_Proof (manuscript repo frohmanian-tether-manuscript-2026-06-01) | The PDF calls B "antisymmetric" (Eq. 3). B is symmetric. The record's description now carries a clarification; the PDF is unchanged |
| 10 | 10.5281/zenodo.23629466; 10.5281/zenodo.23867595 | 23629467; 23867596 | triadic-homogenization-lean | Name drift: none of the seven cited Lean names exist. The stated volume theorem `measure_cube = (3^m)^d` has no declaration |
| 11 | 10.5281/zenodo.23867497 | 23867498, 23903919, 23905258 | p2q-jumps-lean | Theorem 28 is only a named `Prop`, taken as a hypothesis (`theorem28_from_paper`); the only unconditional result was `g_ge_six` |
| 12 | 10.5281/zenodo.22153741; 10.5281/zenodo.23867603 | 22153742, 22240545; 23867604, 23905168, 23905332 | OmegaZero34 | prop:kernel states "if and only if"; the archived Lean proves the forward direction only. Fixed in v1.2.0 (23931657, 23931801, not listed) |

**Count: 12 entries (17 concept DOIs, 42 version DOIs).**

## Details

### 1. NS_Millennium_Proof: "Global Regularity … via the Frohmanian Symplectic Tether"
- **DOIs:** 10.5281/zenodo.23627610 (v2.1.0), 10.5281/zenodo.23717084 (v2.2.0), 10.5281/zenodo.23749850 (2.3.0), 10.5281/zenodo.24126051 (2.4.0). **Concept:** 10.5281/zenodo.23627609.
- **Repo:** BenFrohman/NS_Millennium_Proof. 23717084, 23749850 and 24126051 archive tag v2.2.0, commit 8a5ec50; 24126051's own note says its source zip is byte-identical to 23717084's.
- **Drift:**
  - (a) The title asserts global regularity for 3D NS. The Lean headline is a conditional reduction; the subtitle and README say "conditional".
  - (b) `DirectionCurvatureBound ν` abbreviates `PeriodicDirectionDepletionBound ν`. Its body is a uniform vorticity envelope, `M(t) ≤ max(M(0), C/κ)`, with no differential or curvature content. Source: `docs/VORTICITY_ENVELOPE_CORRECTION.md` in the repo. The README says the archived PDFs "must be read with that addendum".
  - (c) The PipelineHalt NOTES (2026-11-03) found:
    - thm:main's Lean carries `hTlb` (a uniform lower bound on the Kato time) and `hInt` (BKM integrability), which the paper does not state;
    - prop:degen cites `tetherKernel_C2`, which does not exist;
    - lem:transport's Lean assumes NS_PDE, VorticityTransportRegularity and t ≥ 0;
    - lem:localmax's Lean assumes `DifferentiableAt`.
  - (d) 24126051's description: its companion PDF cites 470 theorems and `clay_reduces_to_direction_curvature_bound` in `MainTheorem.lean`, but neither that declaration nor that file is in the archived source (437 theorems).
- **Lean today** (`main` aa04c4f, `Modules/MainTheorem.lean:38`):
  ```lean
  theorem clay_reduces_to_uniform_vorticity_envelope
      (hBKM : ∀ ν > (0 : ℝ), PeriodicBKMContinuation ν) :
      (∀ ν > (0 : ℝ), UniformVorticityEnvelopeBound ν) → Clay_B_exact
  ```
  Both hypotheses are open. `Clay_B_exact` is not proved.

### 2–3. Fefferman (B) on T³: "Formalizing Fefferman's Official Periodic Navier-Stokes Problem (B) in Lean 4 … Conditional Reductions via Beale-Kato-Majda"
- **DOIs:**
  - concept 10.5281/zenodo.23652840: 23652841 (1.0.0), 23717083 (1.1.0), 23749846 (1.2.0), 24125518 (1.3.0, commit 4927d28), 24125937 (1.4.0, commit 17fda5d);
  - concept 10.5281/zenodo.23867489: 23867490 (1.1.0), 23905163 (1.1.0), 23905347 (v1.2.0.1).
- **Repo:** BenFrohman/fefferman-clay-navier-stokes.
- **Drift:**
  - The v1.0–v1.4 hypothesis `PeriodicDirectionDepletionBound` required a two-sided derivative of `M` on the closed interval `[0, T]`. That is unsatisfiable, and the repo proves it:
    ```lean
    theorem old_periodicDirectionDepletionBound_unsatisfiable (ν : ℝ) :
        ¬ PeriodicDirectionDepletionBoundOriginal ν
    ```
    (`FeffermanClayNS/HighSetDepletionAndBKM.lean:741`).
  - So every reduction archived in these records holds vacuously.
  - Its name ("direction curvature / depletion") also does not describe the body, which is a cubic differential bound `M' ≤ C M² − κ M³`.
- **Lean today** (`main` febd036, `FeffermanClayNS/MainTheorem.lean:36`):
  ```lean
  theorem clay_reduces_to_direction_curvature_bound :
      ∀ ν : ℝ, 0 < ν → PeriodicBKMContinuation ν →
        (DirectionCurvatureBound ν → Clay_B_exact ν)
  ```
  Since v1.5.0, `DirectionCurvatureBound ν := PeriodicDirectionDepletionBound ν` uses a right derivative on `[0, T)` with `M` continuous on `[0, T]`, and `d ≤ C_CZ·M² − κ''·M³`. Both hypotheses are open.

### 4. "Reduction of Periodic 3D Navier-Stokes Regularity to a Single High-Set Direction-Curvature Bound in Lean 4"
- **DOI:** 10.5281/zenodo.23749845. **Concept:** 10.5281/zenodo.23749844.
- **Repos:** fefferman-clay-navier-stokes, NS_Millennium_Proof and frohmanian-symplectic-tether-regularity (related identifiers).
- **Drift:**
  - The title and abstract present `clay_reduces_to_direction_curvature_bound` as an "unconditional Lean 4 reduction theorem" to a "high-set direction-curvature / cubic depletion bound".
  - In NS_Millennium_Proof the hypothesis is a uniform envelope (item 1b).
  - In fefferman-clay-navier-stokes it was unsatisfiable before v1.5.0 (item 2).
  - "Unconditional" applies to the implication only. The reduction assumes BKM continuation and the bound.
- **Lean today:** as in items 1 and 2.

### 5. ConflictClauseLattice: "Sub-Exponential Refutation of the Exponential Time Hypothesis via Homological Certificate Topologies …"
- **DOIs:**
  - 10.5281/zenodo.23747592 (1.0.0) and 10.5281/zenodo.23782560 (1.1.0) carry the ETH-refutation title;
  - 10.5281/zenodo.23794113 (1.1.1) and 10.5281/zenodo.23845207 are retitled "… Step-Counting Framework for Sub-Exponential 3-SAT Cost Bounds".
  - **Concept:** 10.5281/zenodo.23747591.
- **Repo:** BenFrohman/eth-conflict-clause-lattice.
- **Drift:**
  - The PipelineHalt NOTES record this as a true gap, not just a flag. Lean bounds the step counter of the cost model `simulateBlockHomologicalTraversal`, whose cost is defined as `tick ((n+m)^2); tick (2^(n / max k 1))` and which returns `true` without reading any formula.
  - That is not a bound on an algorithm that decides 3-SAT, and so not an ETH refutation.
  - Also: Lean restricts to `n ≥ 2` where the paper does not, and Lean takes a fixed real ε where the paper writes o(1).
- **Lean today** (`main` 4fcac17, `ConflictClauseLattice/StepCountingMonad.lean:79,123`):
  ```lean
  theorem simulateBlockHomologicalTraversal_run (n m blockK s : Nat) :
      (simulateBlockHomologicalTraversal n m blockK).run { steps := s } =
        (true, { steps := s + (n + m) ^ 2 + 2 ^ (n / Nat.max blockK 1) }) := by rfl
  theorem block_homological_traversal_bound (n m blockK : Nat) (res : Bool) (finalState : CountingState)
      (h : (simulateBlockHomologicalTraversal n m blockK).run { steps := 0 } = (res, finalState)) :
      finalState.steps ≤ (n + m) ^ 2 + 2 ^ (n / Nat.max blockK 1)
  ```

### 6. HODGE: "The Cycle Class Map, the Reverse Arrow, and a Classical Constructor on Three Fourfolds"
- **DOIs:**
  - concept 10.5281/zenodo.23629479: 23629480;
  - concept 10.5281/zenodo.23867495: 23867496, 23905167, 23905320, 23932503, 23932718, 23932883, 23932891.
- **Repo:** BenFrohman/HODGE.
- **Drift:** this is a manual PipelineHalt finding (2026-11-03), a definitional modelling gap.
  - The Klein quadric's cycles and Hodge classes are both `ℚ × ℚ`, with `cl := LinearMap.id` and `construct γ := γ`.
  - So `construct_recovers` and `expansion` are `rfl`.
  - The paper's geometric content is built into the model, not proved: Hdg²(Q) = ℚ[Π] ⊕ ℚ[Π'], cl[Π] and cl[Π'] forming a basis, and a = γ·[Π], b = γ·[Π'].
- **Lean today** (`main` 5fadd32, `Hodge/Classical.lean:74-85`):
  ```lean
  def kleinQuadric : Datum (Rat × Rat) (Rat × Rat) Rat where
    codim := 2; obstruction := 0; cl := LinearMap.id; cl_isHodge := by intro z; simp
  def construct (γ : Rat × Rat) : Rat × Rat := γ
  theorem construct_recovers (γ : Rat × Rat) : kleinQuadric.cl (construct γ) = γ := rfl
  ```

### 7. StandardConjectures: "Hodge on X x X Implies Grothendieck's Lefschetz Standard Conjecture B: Lean 4 Formalization"
- **DOIs:**
  - concept 10.5281/zenodo.23629481: 23629482;
  - concept 10.5281/zenodo.23867581: 23867582, 23903914, 23905243.
- **Repo:** BenFrohman/StandardConjectures.
- **Drift:**
  - This is a manual PipelineHalt finding: `IsHodge` and `IsAlgebraic` are defined as `True`.
  - The implication `hodge_on_product_implies_lefschetz_B` is therefore vacuous relative to the paper's meaning.
  - The title states a theorem about Grothendieck's conjecture B that the Lean does not express.
- **Lean today** (`main` e92d87d, `StandardConjectures.lean:24,27,41`):
  ```lean
  def IsHodge (_γ : Class) : Prop := True
  def IsAlgebraic (_γ : Class) : Prop := True
  theorem hodge_on_product_implies_lefschetz_B
      (Λ : Class) (hΛ : IsHodge Λ) (hHC : HodgeOnProduct) : LefschetzB Λ := hHC Λ hΛ
  ```

### 8. frohmanian-tether-conditional-regularity: "Geometric Phase-Space Completion and Conditional Global Regularity …" and "Three Pillars of 3D Incompressible Navier–Stokes Theory …"
- **DOIs:** 10.5281/zenodo.24079623 (concept 10.5281/zenodo.24079622) and 10.5281/zenodo.24080310 (concept 10.5281/zenodo.24080309).
  - 10.5281/zenodo.24083331 (v1.1, same concept as 24079623) is not listed. I did not determine whether its archive predates the fix.
- **Repo:** BenFrohman/frohmanian-tether-conditional-regularity.
- **Drift:** reported in 10.5281/zenodo.24102969 and proved in `FrohmanianTetherConditional/AnalyticBridgeRefutation.lean`.
  - `analytic_bridge_target_statement_false`: the legacy target statement is false as written, because the legacy `NSSolution` does not encode Navier–Stokes (the zero field with `Tstar = 1`).
  - `not_nonempty_BKMCriterion`: the legacy BKM hypothesis is uninhabited, so `clayB_iff_bkm_integrable`, `formB_implies_clayB`, `hypothesisB_implies_clayB` and `formB_Hs_bound` were vacuous.
  - `hypothesisB_holds` / `clayStatementB_holds`: the legacy `NavierStokesUnifiedData` presupposes Clay (B), so `three_way_equivalence` carried no information.
- **Lean today** (`main` 8848b89):
  - `ClassicalNS` requires the equations. `formB_implies_clayB` and `clayB_iff_gradIntegral_finite` are conditional on the cited, unproved `BKMCriterion` and `KatoPonceEnergy`.
  - `ClassicalNS.analytic_bridge_unconditional : AnalyticBridgeStatement` (Clay (B), modulo local theory) is OPEN. It has one intentional `sorry`, is excluded from the audits, and is not claimed.

### 9. "The Frohmanian Symplectic Tether: A Canonical Minimal Metric Correction to the Arnold Lie–Poisson Bracket on the Coadjoint Orbit"
- **DOI:** 10.5281/zenodo.21856430. **Concept:** 10.5281/zenodo.21856429.
- **Repos:** NS_Millennium_Proof and frohmanian-tether-manuscript-2026-06-01 (commit 6c6cac9).
- **Drift:**
  - Section 2, Eq. 3 of the archived PDF calls `B(F,G) = −κ∫|ω|²(Π_u δF·Π_u δG)` "antisymmetric". It is symmetric, so the "2-form" is not symplectic.
  - `drift_review.md` rates the antisymmetry wording false and "κ = 1 / κ = C_CZ(3)" as drift.
  - The record's description now carries a "Technical Clarification". The PDF is unchanged.
- **Lean today** (NS_Millennium_Proof `main` aa04c4f, `Modules/Uniqueness.lean:424`):
  ```lean
  theorem tetherKernel_symmetric (ω : CoadjointOrbit) (F G : Functional) :
      TetherKernel ω F G = TetherKernel ω G F
  ```

### 10. triadic-homogenization-lean: "Homogenization: Triadic Partition, Cube Measure, Cube Average, and Telescoping Increment Lemmas in Lean 4"
- **DOIs:** 10.5281/zenodo.23629467 (concept 10.5281/zenodo.23629466) and 10.5281/zenodo.23867596 (concept 10.5281/zenodo.23867595).
- **Repo:** BenFrohman/triadic-homogenization-lean.
- **Drift:**
  - The paper and README cite `measure_cube`, `measureReal_cube_eq`, `cubeAvg_add`, `cubeAvg_smul`, `cubeAvg_const`, `telescoping_increments` and `norm_Increment_le_sum`. None is a declaration (PipelineHalt NOTES, re-checked today).
  - The stated exact volume `measure_cube = (3^m)^d` has no Lean counterpart at all.
- **Lean today** (`main` 3cae715, `TriadicHomogenization.lean`):
  - The declarations are `cubeAverage_*`, `cubeProjection_*` and `cubeIncrement_*`, e.g. `cubeIncrement_telescope` (l. 158) and `cubeAverage_const` (l. 106).
  - There is no measure-of-cube theorem.

### 11. p2q-jumps-lean: "Formal Verification of 2-Adic Valuation Shifts and p^2 q Jump Dynamics in Generalized Collatz Extensions (Lean 4)"
- **DOIs:** 10.5281/zenodo.23867498 (v1.0.1), 10.5281/zenodo.23903919 (v1.1.0), 10.5281/zenodo.23905258 (v1.1.0.1). **Concept:** 10.5281/zenodo.23867497.
- **Repo:** BenFrohman/p2q-jumps-lean.
- **Drift:**
  - This is a true gap (PipelineHalt NOTES; the README says so too). Theorem 28 of 10.5281/zenodo.22727814 is the named `Prop` `Theorem28`.
  - `theorem28_from_paper` takes it as a hypothesis, and the only unconditional result is `g_ge_six`.
- **Lean today** (`main` f6ba397, after PR #2 "fix/close-sorries"):
  ```lean
  theorem theorem28_holds : Theorem28 := theorem28_discriminant   -- P2qJumps/ClosedShapes.lean:139
  ```
  - The README still says Theorem 28 "is not proved here".
  - I did not rebuild it or run `#print axioms`, so the unconditional status today is what the source states, not something I re-checked.
  - The archived records contain the conditional version.

### 12. OmegaZero34: "The unique monodromy-invariant alternating form of type (1,6) on a (3,4,∞) lattice representation …"
- **DOIs:**
  - 10.5281/zenodo.22153742 and 10.5281/zenodo.22240545 (concept 10.5281/zenodo.22153741);
  - 10.5281/zenodo.23867604 (v1.0.1), 10.5281/zenodo.23905168 and 10.5281/zenodo.23905332 (v1.1.0) (concept 10.5281/zenodo.23867603).
- **Repo:** BenFrohman/OmegaZero34.
- **Drift:**
  - This is a manual PipelineHalt finding. prop:kernel says the residuals vanish "if and only if a=b=e=f=0, c=d/6", but `invariant_params` proves only the forward direction (a narrower statement).
  - Tags v1.0.1 and v1.1.0 have no `invariant_params_iff`; v1.2.0 does (checked through the GitHub contents API). So 23931657 and 23931801 (v1.2.0) are not drifted and are not listed.
- **Lean today** (`main` f94c50c, `OmegaZero34/Uniqueness.lean:78`):
  ```lean
  theorem invariant_params_iff (a b c d e f : ℚ) :
      (transpose T1R * ofParams a b c d e f * T1R = ofParams a b c d e f ∧
        transpose T2R * ofParams a b c d e f * T2R = ofParams a b c d e f) ↔
      (a = 0 ∧ b = 0 ∧ e = 0 ∧ f = 0 ∧ d = 6 * c)
  ```

## Not listed

- **Riccati counterexample** (10.5281/zenodo.24102221, 24102417, 24121364; concept 24102220): these records disprove the estimate `M′ ≤ C − kM²` of an **unpublished** draft. The disproved draft is not a Zenodo record, and the counterexample records themselves are not drifted.
- **`drift_review.md`**: its antisymmetry and κ drift concerns Drive editions (ArXiv9, main_0707, Preprint_v1, GotItNavier, …), which are not Zenodo records. Item 9 is the one Zenodo record whose archived text carries the same "antisymmetric" wording.
- **May 31 literal "antisymmetric" Thm 2.3** (`thm23_literal_vacuous`, may31-fixed-kappa ledger): it is not a Zenodo record. 10.5281/zenodo.23965512 ("metriplectic, not Poisson") is itself a correction.
- **`PeriodicStrainLinfBound`** (10.5281/zenodo.23905235): `StaticStrainLinfBound` is refuted in Lean, and the solution-level bound is false as stated modulo local existence. I did not confirm which records assume it, so none is listed.
- **frohmanian-tether-sdiff** (concept 24081999: 24082000, 24102345, 24102715, 24120781, 24122596): the 2026-11-09 alignment report found metadata mismatches (email, relation direction, commit pin) but no statement drift. Not listed.
- **SingularityLab, Clay-, frohmanian-symplectic-tether, metriplectic-world-model, collatz-\*, eth n ≥ 2 flags, and others**: these are open PipelineHalt flags, which are halt questions and not confirmed drift. The no-anchor repos (CubicFourfold, Fermat\*, HODGE-DISPROOF, HodgeDisproof, global-from-local-restart, …) were never compared.
