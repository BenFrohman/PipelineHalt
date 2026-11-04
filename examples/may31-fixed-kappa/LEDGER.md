# May 31 fixed-κ (κ = C_CZ(3)), T³ — claim ledger

Anchor: May 31 2026 `Tether.lean` snapshot (commit `3582a57` of the may-form repo) plus `main3` (May 2).
Lean: `MayForm31/{Statement,Proofs}.lean`, local branch `may31-fixed-kappa` (commit `4e64989`, on top of `e79073b`; **not pushed**).
Toolchain: Lean v4.30.0-rc1, Mathlib `0c154d6`. There is no `sorry` and no `axiom`. Each theorem depends only on `propext, Classical.choice, Quot.sound` (see `axioms.txt`).
Mathlib has no Calderón–Zygmund theory, so C_CZ(3) is carried as `structure CZConstant3D` (C, C > 0). Its value is never used.

| May claim (snapshot line) | Lean | Status |
|---|---|---|
| Π_u u = 0 (L128, was `sorry`) | `projection` | PROVED |
| C2 degeneracy B(F,H)=0 at κ=C_CZ (L82–85, L102–119) | `degeneracy` | PROVED |
| κ := C_CZ(3) > 0 (L50–53, axiom `czc_3d_pos`) | `CZConstant3D`, `kappa` | CONDITIONAL on the named structure (value OPEN) |
| Step 4: κ=C_CZ is the least strength absorbing +C_CZ M² (L195) | `step4` | PROVED (elementary; needs the stretching bound, which is OPEN) |
| Existence: the tether satisfies symmetry, C1, C2, C3 (L56–93) | `existence` | PROVED, given a unit e ⟂ u. The kernel is collapsed to the weight ‖ω‖² (Q2) |
| **Thm 2.3 (primary): symmetric "metric correction" reading, per the author's answer to Q4** | `thm23` (alias `thm23_symmetric`) | CONDITIONAL on `StabilizerTransitive act u` |
| Note only, not Thm 2.3: literal May 31 "antisymmetric" wording (L222) | `thm23_literal_vacuous` | VACUOUS: no antisymmetric B satisfies C3 when ω ≠ 0 |
| Thm 2.3 with full L² isometry group as C1 | `thm23_symmetric_isometries` | PROVED (transitivity is proved via reflection) |
| Thm 2.3 with C1 = SDiff(T³) coadjoint action | — | OPEN (transitivity for SDiff is not shown) |
| Thm 2.3 over the abstract orbit layer (tether commit `c8ebcb3`, local) | `thm23_orbit` | CONDITIONAL on `CasimirLevelTransitive`, `MayC3` |
| main3: y' ≤ C − κy² ⇒ y ≤ max(y₀, √(C/κ)) | `main3_bound` | PROVED (pure ODE comparison) |
| TetherKernel = pointwise Biot–Savart double integral (L56–64) | — | OPEN (PipelineHalt SILENT) |
| u–ω Biot–Savart relation | — | OPEN (u and ω are independent in Lean) |
| NS vorticity obeys the bounding inequality (L87–93, L152–217) | — | OPEN. PipelineHalt heuristically matched `main3_bound`, which is wrong: the Lean does not formalize NS |
| Mollifier / estimates layer | — | OPEN |

**No global Navier–Stokes regularity or Clay result is claimed.** The fixed-κ specialization adds nothing beyond κ > 0.

## Halt questions for the author (answers recorded in `anchor.json` → `clarifications`)
- Q1 Space `34af9b6bbc39`, Q2 Weight `7fe71d41e6e0`, Q3 u–ω `50f49bd11469`, Q5 C1 `de3f437ea50e`: ANSWERED, recorded by hand via `record()` + `mismatchId` (verdict "other").
- Q4 `306cd9f98c70`: "Symmetric, the metric correction reading".
- Kernel `096a0a1135f6`: INTENTIONALLY ABSTRACT (verdict intentional).
- Q6 transitivity `151ff9ad4153`, verbatim: "transitivity = transitive_on_casimir_levels: ∀ ω₁ ω₂, (∀ f, ∫ f‖ω₁‖ = ∫ f‖ω₂‖) → ∃ g, g•ω₁=ω₂; stays an open named assumption."
- Q7 δH `596312f4abdb`, verbatim: "δH = u = velocity_from_vorticity ω, not BS*BS." Encoded in NS repo as the named OPEN hypothesis `PlanSteps.KineticEnergyDerivIsVelocity` (not proved: `FunctionalDerivative` is a `Classical.choose`; the Gâteaux representative of ½∫|BSω|² is BS*BSω).
- Q8 `968579d3e360`, verbatim: "Blueprint 'antisymmetric' for the tether term was a slip; correct it to symmetric in the excerpts." Applied to `blueprint.anchor.json` claim b-antisym (marked as an author correction; `blueprint-2026-06-02.md` unchanged).

## New OPEN questions (flagged, NOT adopted)
Author's original tether description (2026-11-03; sign and weight later corrected, see below): "T(ω)(F,G)=κ∫|ω(x)|²⟨Π_uδF,Π_uδG⟩dx (pointwise weight, positive sign), and {F,G}_T = {F,G}_cl + T." Added as claim `b-tether-user` (PipelineHalt SILENT `ea03cab5efda`: no `TetherKernel` in this example's Lean).
- (a) Sign: RESOLVED (2026-11-03). Author, verbatim: "A: −κ (damping, matches the Lean). That is the intended canonical version. The tether exists to supply negative feedback that can absorb the vortex-stretching term; only the minus sign produces the cubic damping. The +κ that appeared in the earlier prose description was the slip." `b-tether-user` now reads −κ.
- (b) Weight: RESOLVED (2026-11-03). Author, verbatim: "Weight: overall ‖ω‖² (the global enstrophy factor), matching the Lean. That is the canonical version. The pointwise density |ω(x)|² inside the integral is a different, stronger correction; the object that was formalized and that supplies the cubic damping in the existing analytic estimates multiplies the projected pairing by the single scalar ‖ω‖_{L²}²." Note: this matches the example Lean (`MayForm31`, collapsed ‖ω‖²); the NS-repo `TetherKernel` still uses the pointwise ‖ω(x)‖² integrand, so the NS repo does NOT yet match the chosen object.
- (c) Bracket: RESOLVED (2026-11-03). Author, verbatim: "Agreed. The honest description is that the tethered bracket is the sum of the antisymmetric Lie–Poisson bracket and a negative-semidefinite symmetric term (metriplectic-type). The claim that the sum “remains antisymmetric” stays out of the paper and the Lean excerpts."
- Closed summary: sign = −κ; weight = overall ‖ω‖²; bracket = metriplectic (antisymmetric + negative-semidefinite symmetric). `b-tether-user` now reads T(ω)(F,G) = −κ‖ω‖²∫⟨Π_uδF,Π_uδG⟩.
- **NEW OPEN inconsistency (damping derivation, claim `b-damping`)**: the derivation computes T(M,H) = −κ‖ω‖²∫|Π_u ω|², but C2 states T(H,·) = 0, which by symmetry forces T(M,H) = 0, so the bracket flow d/dt M = {M,H}_T receives no tether contribution. Also ∫|Π_uω|² ≤ ‖ω‖² is an upper bound, not the lower bound the claimed ≤ −κ'M² needs (it vanishes when ω ∥ u). The analytic rate stays OPEN.
- Blueprint majorant (L594) y' = Cy² − κ''y³ vs Lean `main3_bound` y' ≤ C − κy²: now a real harness flag, `8810eaeacc8a` AMBIGUOUS ("Paper ODE has y-powers {2, 3}; `main3_bound` has {0, 2}"), from the new `odeShape` check (v0.4.1).

## Honest status (analytic layer)
- `GlobalRegularity.lean`'s top-level theorems are conditional on `hDI : FrohmanianTetherRate` and `hRiccati : FrohmanianTetherBound`. Both are OPEN.
- `HWEIGHT_OBSTRUCTION.md` and `SCALE_INVARIANT_TETHER.md` show that the pointwise form ⟨ω,(ω·∇)u⟩ ≤ C M³ − κ M⁴ is dimensionally inconsistent under NS scaling (u_λ = λu(λx,λ²t), ω_λ = λ²ω). Consistent variants fail on the Burgers vortex or reduce to M' ≲ M², which does not prevent blow-up. Checked: `PlanSteps.tether_bound_not_scale_invariant` (for any S, M ≠ 0, κ > 0, λ⁶S ≤ C(λ²M)³ − κ(λ²M)⁴ fails for some λ > 0).
- Proved tools: `holder_I4`, `young_inequality_eps`, `stretching_bound_of_holder`, `youngs_absorption_elimination`, `comparison_ode_stability`, `vorticity_sup_norm_riccati_bound`, `bkm_regularity_pipeline`.
- Analytic closure is equivalent in difficulty to the Clay problem and is NOT close. The geometric/tether layer is close. No attempt is made to discharge the rate hypothesis. **No NS regularity is claimed.**

## NS repo, local branch `sdiff-abstract-action` (commits `2a2cfc4`, `b018678`, `e47c5ab`, `4289040`; NOT pushed)
| Item | Lean | Status |
|---|---|---|
| Abstract SDiff action replacing the identity stub | `CoadjointAction g ω := g • ω`, `_one/_mul/_inv/_div` | PROVED |
| Casimir invariance (C1 integral form) | `SDiffActionHyp.casimir_invariant` | OPEN named assumption |
| Transitivity on Casimir levels | `SDiffActionHyp.transitive_on_casimir_levels` | OPEN named assumption |
| Enstrophy invariance, orbits = Casimir levels | `enstrophy_invariant`, `casimir_const_on_orbit`, `orbit_eq_casimir_level` | PROVED from `SDiffActionHyp` |
| Tether C1 | `tether_coadjoint_invariance`, `tether_satisfies_C1` | PROVED from `TetherIntegralPreserved` (OPEN) |
| SymplecticConstraint 2a | `VolumePreservingCoadjointAction SDiff` → `TetherIntegralPreserved` | PROVED; the old structure (∀ g : T3→T3 preserves ∫) was UNINHABITABLE, so prior results about it were vacuous |
| Steps 1+2 (route 2, adopted) | `step2_quadratic_and_locality` | PROVED from `h_sym` + named `h_proj` |
| Step 3 / 4 / 5 | `step3_scalar` / `step4_scalar_eq_kappa` / `step5_eq_tether` | PROVED from named `h_density`, `h_weight` / `h_sat`, `h_nondeg` / — |
| Public symmetric Thm 2.3 | `uniqueness_of_minimal_tether` | PROVED by polarization; **does not use hC1, hC2, hC3** (or `SDiffActionHyp`) |
| Antisymmetric version | `antisym_sat_forces_zero_diag` | VACUOUS (proved) |
| BS Fourier symbol: div û = 0, curl∘BS = id | `PlanSteps.bsSymbol_div`, `bsSymbol_curl` | PROVED mode-wise only; NOT connected to the real-space `BiotSavart` integral |
| Euler as coadjoint motion; Casimir conservation | `IsCoadjointMotion` (OPEN), `casimir_conserved` | PROVED conditional on `SDiffActionHyp` + `IsCoadjointMotion` |
| δH = u | `KineticEnergyDerivIsVelocity` | OPEN named hypothesis |
| `FrohmanianTetherRate`, `FrohmanianTetherClosingBound` | — | OPEN, unchanged |
Build: `lake build NS_Millennium_Proof` OK (2714 jobs), no `sorry`, no `axiom`; `#print axioms` = propext, Classical.choice, Quot.sound for every item above.

## Step 1 notes (author, verbatim)
- (A) "Route 1 (C1+C2 + realizing assumption) reduced to a pairing-to-zero statement of essentially the same strength as locality itself, and the abstract-group formulation of the one-parameter subgroup was undefined. Route 2 is therefore adopted: locality is recorded as a one-line corollary of the quadratic representation established in Step 2. The earlier route-1 lemmas remain in the file under an explicit “fallback / superseded” label for audit purposes."
- (B) "`PairsToZeroIfDerivativeVanishes` is a one-sided form of the locality statement. Step 1 is conditional on an assumption of essentially the same strength as its conclusion."
- Earlier note: "Step 1 is conditional on an assumption of nearly the same strength as its conclusion; C1 and C2 are unused here."

## Reruns (PipelineHalt 0.4.1, 2026-11-03)
- Main (`anchor.json` + map): HALT (exit 2) · drift 0.354 · 11 open. The Stmt_ unfolding fix now surfaces CONDITIONAL hypotheses: `thm23` (StabilizerTransitive, MayC3), `thm23_orbit` (CasimirLevelTransitive, MayC3). The earlier "drift 0.000" harness limitation is fixed.
- Blueprint (`blueprint.anchor.json`, `--no-map`): HALT (exit 2) · drift 0.990 · 22 open. b-goal, b-step1, b-step2, b-kappa SILENT; b-antisym, b-metric, b-majorant CONDITIONAL; majorant ODE-shape flag `8810eaeacc8a`; b-tether-user SILENT.
