# PipelineHalt report: Global Regularity for the 3D Incompressible Navier--Stokes Equations via the Frohmanian Symplectic Tether\\[4pt]
\large Complete Original Conjectured Framework and Kernel-Verified Non-Vacuous Conditional Formalization in Lean~4

Status: **HALT** · overall drift **0.394** · 8 claims · 622 Lean declarations scanned · 7 open question(s)

Mapping file: `../../PipelineHalt/examples/NS_Millennium_Proof/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 1.1 | `frohmanian_tether_theorem`, `global_regularity_for_NS` | 0.750 | 2 | 3 |
| Definition 3.1 | `TetherKernel`, `Pi_u` | 0.000 | 0 | 0 |
| Proposition 3.2 | `tetherKernel_degenerates_on_kinetic_energy` | 1.000 | 1 | 3 |
| Lemma 4.1 | `stretching_inner_le_at_max` | 0.500 | 1 | 3 |
| Lemma 4.2 | `time_pairing_le_stretching_at_max` | 0.900 | 3 | 2 |
| Lemma 4.3 | `comparison_ode_stability` | 0.000 | 0 | 2 |
| Lemma 4.4 | `comparison_majorant_global_bound` | 0.000 | 0 | 1 |
| Proposition 4.5 | `riccati_ceiling_of_vorticity_di` | 0.000 | 0 | 1 |

## Theorem 1.1 — Conditional Global Regularity; \lean{frohmanian_tether_theorem}, \lean{global_regularity_for_NS}

- `9415a2e4de2c` AMBIGUOUS: Title “Conditional Global Regularity; \lean{frohmanian_tether_theorem}, \lean{global_regularity_for_NS}” shares almost no terms with the statement. — answered (intentional): “harmless wording: the title is a short description plus \lean{} names that exist and are the mapped declarations.”
- `8ebcefda1a1c` CONDITIONAL: `frohmanian_tether_theorem` assumes `hTlb : ∀ u₁ ν (hsm : ContDiff ℝ (⊤ : ℕ∞) u₁) (hdiv : ∀ x, div u₁ x = 0) (hE : Integrable (fun x : T3 => ‖u₁ x‖ ^ 2)) (hν : 0 < ν), τ ≤ (hKato u₁ ν hsm hdiv hE hν).T`, not stated in the claim. — **OPEN**
- `80734625660e` CONDITIONAL: `frohmanian_tether_theorem` assumes `hInt : ∀ u₀ ν (_hν : 0 < ν) (T : ℝ) (v : TimeDependentVelocity) (q : TimeDependentPressure), T ∈ existenceTimes u₀ ν → v 0 = u₀ → NS_PDE v q ν → (∀ t ∈ Set.Icc (0 : ℝ) T, ContDiff ℝ (⊤ : ℕ∞) (v t)) → IsPhysicalNSSolution v → ∀ t ∈ Set.Icc (0 : ℝ) T, Integrable (fun x : T3 => ‖v t x‖ ^ 2)`, not stated in the claim. — **OPEN**
- `6e803a6b0715` CONDITIONAL: `global_regularity_for_NS` assumes `h_divfree : ∀ x, div u₀ x = 0`, not stated in the claim. — answered (intentional): “stated in the claim: 'u_0 … divergence-free' (thm:main); h_divfree : ∀ x, div u₀ x = 0.”
- `de150fad9c22` CONDITIONAL: `global_regularity_for_NS` assumes `h_finite_energy : Integrable (fun x : T3 => ‖u₀ x‖ ^ 2)`, not stated in the claim. — answered (intentional): “stated in the claim: 'of finite L^2 energy'; h_finite_energy : Integrable ‖u₀‖².”

## Proposition 3.2 — Strict Degeneracy on Kinetic Energy; proved, \lean{tetherKernel_degenerates_on_kinetic_energy}, \lean{tetherKernel_C2}

- `7410a6a3d05c` SILENT: Anchor maps this claim to `tetherKernel_C2`, but no such declaration exists. — **OPEN**
- `18f967d287c5` CONDITIONAL: `tetherKernel_degenerates_on_kinetic_energy` assumes `hδH : FunctionalDerivative KineticEnergyHamiltonian ω = velocity_from_vorticity ω`, not stated in the claim. — answered (intentional): “stated in the claim: 'Whenever δH/δω = u' (prop:degen); hδH is that hypothesis.”
- `21ee103563e5` CONDITIONAL: `tetherKernel_degenerates_on_kinetic_energy` assumes `hdiv : ∀ x, div (velocity_from_vorticity ω) x = 0`, not stated in the claim. — answered (intentional): “stated in the claim: '∇·u = 0'; hdiv is that hypothesis.”
- `cb75c079e949` CONDITIONAL: `tetherKernel_degenerates_on_kinetic_energy` assumes `hInt : Integrable (fun y => ‖velocity_from_vorticity ω y‖ ^ 2)`, not stated in the claim. — answered (intentional): “stated in the claim: 'u ∈ L^2'; hInt : Integrable ‖u‖² is that hypothesis.”

## Lemma 4.1 — Stretching at a spatial maximum; proved, \lean{stretching_inner_le_at_max}

- `5e5d552b0287` AMBIGUOUS: Title “Stretching at a spatial maximum; proved, \lean{stretching_inner_le_at_max}” shares almost no terms with the statement. — answered (intentional): “harmless wording: the title is a short description plus \lean{} names that exist and are the mapped declarations.”
- `5f8484fca91e` CONDITIONAL: `stretching_inner_le_at_max` assumes `hu : DifferentiableAt ℝ u x`, not stated in the claim. — **OPEN**
- `f1ab07f604ab` CONDITIONAL: `stretching_inner_le_at_max` assumes `hCZ : PointwiseStrainSupBound u ω C_CZ x`, not stated in the claim. — answered (intentional): “stated in the claim: 'suppose ‖∇u(x)‖ ≤ C_CZ‖ω‖_{L^∞} (\lean{hCZ})'; PointwiseStrainSupBound u ω C x := ‖fderiv ℝ u x‖ ≤ C * vorticity_sup_norm ω (NS_Equations.lean:2826).”
- `41b6ca9092d3` CONDITIONAL: `stretching_inner_le_at_max` assumes `hmax : ‖ω x‖ = vorticity_sup_norm ω`, not stated in the claim. — answered (intentional): “stated in the claim: 'Let x satisfy ‖ω(x)‖ = ‖ω‖_{L^∞}'; hmax is that hypothesis.”

## Lemma 4.2 — Transport and viscosity at a spatial maximum; proved, \lean{time_pairing_le_stretching_at_max}

- `09213ae4a264` NARROWER: `time_pairing_le_stretching_at_max` restricts t ≥ 0; the claim states no such restriction. — **OPEN**
- `cb6fd1289359` CONDITIONAL: `time_pairing_le_stretching_at_max` assumes `hNS : NS_PDE u p ν`, not stated in the claim. — **OPEN**
- `351738efb54a` CONDITIONAL: `time_pairing_le_stretching_at_max` assumes `hreg : VorticityTransportRegularity u p t x`, not stated in the claim. — **OPEN**
- `0f8e0f448864` CONDITIONAL: `time_pairing_le_stretching_at_max` assumes `htransp : inner ℝ (vorticity (u t) x) (convective (u t) (vorticity (u t)) x) = 0`, not stated in the claim. — answered (intentional): “stated in the claim: 'where the convective transport pairing ⟨ω,(u·∇)ω⟩(x) vanishes'; htransp is that hypothesis.”
- `e672cec34b34` CONDITIONAL: `time_pairing_le_stretching_at_max` assumes `hvisc : inner ℝ (vorticity (u t) x) (laplacian (vorticity (u t)) x) ≤ 0`, not stated in the claim. — answered (intentional): “stated in the claim: '⟨ω,Δω⟩(x) ≤ 0'; hvisc is that hypothesis.”

## Lemma 4.3 — Cubic comparison stability; proved, \lean{comparison_ode_stability}

- `5604cd92a6b0` AMBIGUOUS: Title “Cubic comparison stability; proved, \lean{comparison_ode_stability}” shares almost no terms with the statement. — answered (intentional): “harmless wording: the title is a short description plus \lean{} names that exist and are the mapped declarations.”
- `7a7b7a56310d` CONDITIONAL: `comparison_ode_stability` assumes `hy_dot : ∀ s ≥ (0 : ℝ), deriv y s ≤ C * (y s) ^ 2 - κ'' * (y s) ^ 3`, not stated in the claim. — answered (intentional): “stated in the claim: 'y'(s) ≤ C y(s)^2 − κ'' y(s)^3 (s ≥ 0)'; hy_dot is that hypothesis.”

## Lemma 4.4 — Explicit majorant global bound; proved, \lean{comparison_majorant_global_bound}

- `66e0c28378de` AMBIGUOUS: Title “Explicit majorant global bound; proved, \lean{comparison_majorant_global_bound}” shares almost no terms with the statement. — answered (intentional): “harmless wording: the title is a short description plus \lean{} names that exist and are the mapped declarations.”

## Proposition 4.5 — Cubic rate $\Rightarrow$ uniform vorticity ceiling; proved, \lean{riccati_ceiling_of_vorticity_di}

- `e96b01a5c691` AMBIGUOUS: Title “Cubic rate $\Rightarrow$ uniform vorticity ceiling; proved, \lean{riccati_ceiling_of_vorticity_di}” shares almost no terms with the statement. — answered (intentional): “harmless wording: the title is a short description plus \lean{} names that exist and are the mapped declarations.”

## Realignment notes

- Theorem 1.1: answer `8ebcefda1a1c` — Paper claim Theorem 1.1 (thm:main) states: “Let $\nu>0$ and let $u_0$ be smooth (\lean{ContDiff ℝ ⊤}), divergence-free, and of finite $L^2$ energy. Assume within the class of physical solutions (\lean{IsPhysicalNSSolution}): •[(K)] \emph{Kato …”. Lean theorem `frohmanian_tether_theorem` assumes `hTlb : ∀ u₁ ν (hsm : ContDiff ℝ (⊤ : ℕ∞) u₁) (hdiv : ∀ x, div u₁ x = 0) (hE : Integrable (fun x : T3 => ‖u₁ x‖ ^ 2)) (hν : 0 < ν), τ ≤ (hKato u₁ ν hsm hdiv hE hν).T`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 1.1: answer `80734625660e` — Paper claim Theorem 1.1 (thm:main) states: “Let $\nu>0$ and let $u_0$ be smooth (\lean{ContDiff ℝ ⊤}), divergence-free, and of finite $L^2$ energy. Assume within the class of physical solutions (\lean{IsPhysicalNSSolution}): •[(K)] \emph{Kato …”. Lean theorem `frohmanian_tether_theorem` assumes `hInt : ∀ u₀ ν (_hν : 0 < ν) (T : ℝ) (v : TimeDependentVelocity) (q : TimeDependentPressure), T ∈ existenceTimes u₀ ν → v 0 = u₀ → NS_PDE v q ν → (∀ t ∈ Set.Icc (0 : ℝ) T, ContDiff ℝ (⊤ : ℕ∞) (v t)) → IsPhysicalNSSolution v → ∀ t ∈ Set.Icc (0 : ℝ) T, Integrable (fun x : T3 => ‖v t x‖ ^ 2)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 1.1: difference `6e803a6b0715` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem 1.1: difference `de150fad9c22` is intentional per the author; consider stating it in the paper text so readers see it too.
- Proposition 3.2: answer `7410a6a3d05c` — Paper claim Proposition 3.2 (prop:degen) states: “Whenever $\delta H/\delta\omega=u$, $\nabla\cdot u=0$, and $u\in L^2$, one has $\Pi_u u=0$ (\lean{projection_orthogonal_to_u}) and hence \[ B(F,H)(\omega)=0\qquad\text{for every functional }F. \]”. The anchor maps it to Lean declaration `tetherKernel_C2`, which was not found in the scanned files. Was it renamed or removed, or is the claim intentionally unformalized?
- Proposition 3.2: difference `18f967d287c5` is intentional per the author; consider stating it in the paper text so readers see it too.
- Proposition 3.2: difference `21ee103563e5` is intentional per the author; consider stating it in the paper text so readers see it too.
- Proposition 3.2: difference `cb75c079e949` is intentional per the author; consider stating it in the paper text so readers see it too.
- Lemma 4.1: answer `5f8484fca91e` — Paper claim Lemma 4.1 (lem:localmax) states: “Let $x$ satisfy $\|\omega(x)\|=\|\omega\|_{L^\infty}$ and suppose $\|\nabla u(x)\|\le\CZ\|\omega\|_{L^\infty}$ (\lean{hCZ}). Then \[ \langle\omega(x),(\omega\cdot\nabla)u(x)\rangle\le\CZ\,\|\omega\|_…”. Lean theorem `stretching_inner_le_at_max` assumes `hu : DifferentiableAt ℝ u x`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 4.1: difference `f1ab07f604ab` is intentional per the author; consider stating it in the paper text so readers see it too.
- Lemma 4.1: difference `41b6ca9092d3` is intentional per the author; consider stating it in the paper text so readers see it too.
- Lemma 4.2: answer `09213ae4a264` — Paper claim Lemma 4.2 (lem:transport) states: “At a spatial maximum where the convective transport pairing $\langle\omega,(u\cdot\nabla)\omega\rangle(x)$ vanishes and $\langle\omega,\Delta\omega\rangle(x)\le0$, along any solution of \eqref{eq:vor…”. Lean theorem `time_pairing_le_stretching_at_max` assumes `0 ≤ t` (restricting t ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Lemma 4.2: answer `cb6fd1289359` — Paper claim Lemma 4.2 (lem:transport) states: “At a spatial maximum where the convective transport pairing $\langle\omega,(u\cdot\nabla)\omega\rangle(x)$ vanishes and $\langle\omega,\Delta\omega\rangle(x)\le0$, along any solution of \eqref{eq:vor…”. Lean theorem `time_pairing_le_stretching_at_max` assumes `hNS : NS_PDE u p ν`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 4.2: answer `351738efb54a` — Paper claim Lemma 4.2 (lem:transport) states: “At a spatial maximum where the convective transport pairing $\langle\omega,(u\cdot\nabla)\omega\rangle(x)$ vanishes and $\langle\omega,\Delta\omega\rangle(x)\le0$, along any solution of \eqref{eq:vor…”. Lean theorem `time_pairing_le_stretching_at_max` assumes `hreg : VorticityTransportRegularity u p t x`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 4.2: difference `0f8e0f448864` is intentional per the author; consider stating it in the paper text so readers see it too.
- Lemma 4.2: difference `e672cec34b34` is intentional per the author; consider stating it in the paper text so readers see it too.
- Lemma 4.3: difference `7a7b7a56310d` is intentional per the author; consider stating it in the paper text so readers see it too.
- Lean `unmodified_envelope_yields_classical_quadratic_rate` cites “Theorem 1” in its docstring but is not matched to any anchor claim (informational).
- Lean `symplectic_constraint_yields_cubic_damping_and_ceiling` cites “Theorem 2” in its docstring but is not matched to any anchor claim (informational).
