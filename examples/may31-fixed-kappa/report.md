# PipelineHalt report: Frohmanian symplectic tether, May 31 fixed-kappa T3 form

Status: **HALT** · overall drift **0.354** · 9 claims · 49 Lean declarations scanned · 11 open question(s)

Mapping file: `pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Lemma | `projection` | 0.000 | 0 | 0 |
| Lemma | `degeneracy` | 0.000 | 0 | 0 |
| Definition | `CZConstant3D`, `kappa` | 0.000 | 0 | 0 |
| Lemma | `step4` | 0.000 | 0 | 0 |
| Theorem | `thm23`, `thm23_orbit` | 0.938 | 4 | 0 |
| Proposition | `existence` | 0.500 | 1 | 0 |
| Theorem | `main3_bound` | 0.875 | 3 | 0 |
| Definition | — | 0.000 | 0 | 1 |
| Theorem | `main3_bound` (0.26) | 0.875 | 3 | 0 |

## Theorem

- `858ad372d771` CONDITIONAL: `thm23` assumes `StabilizerTransitive act u`, not stated in the claim. — **OPEN**
- `a272731d6977` CONDITIONAL: `thm23` assumes `MayC3 cz ω u B`, not stated in the claim. — **OPEN**
- `022885b6dde3` CONDITIONAL: `thm23_orbit` assumes `E.CasimirLevelTransitive ω`, not stated in the claim. — **OPEN**
- `c6ba3f00d1ed` CONDITIONAL: `thm23_orbit` assumes `MayC3 cz ω.1 (E.velocity ω) B`, not stated in the claim. — **OPEN**

## Proposition

- `cc64c3078c55` CONDITIONAL: `existence` assumes `(∃ e : L2Field, ⟪u, e⟫ = 0 ∧ ‖e‖ = 1)`, not stated in the claim. — **OPEN**

## Theorem

- `8dac4f39a594` CONDITIONAL: `main3_bound` assumes `ContinuousOn y (Set.Icc 0 T)`, not stated in the claim. — **OPEN**
- `6f08f9e6114e` CONDITIONAL: `main3_bound` assumes `(∀ x ∈ Set.Ico 0 T, HasDerivWithinAt y (y' x) (Set.Ici x) x)`, not stated in the claim. — **OPEN**
- `c127608f99a2` CONDITIONAL: `main3_bound` assumes `(∀ x ∈ Set.Ico 0 T, y' x ≤ C - kappa cz * y x ^ 2)`, not stated in the claim. — **OPEN**

## Definition

- `096a0a1135f6` SILENT: No Lean declaration matches this claim. Closest candidate: `mayTether` (score 0.18, below threshold 0.2). — answered (intentional): “Biot–Savart kernel: deliberately left partially unformalized; mapping properties (div-free, curl∘BS = id on the orbit, torus Green's function) are future theorems / black boxes.”

## Theorem

- `d8de27b4dea8` CONDITIONAL: `main3_bound` assumes `ContinuousOn y (Set.Icc 0 T)`, not stated in the claim. — **OPEN**
- `3a32a243f876` CONDITIONAL: `main3_bound` assumes `(∀ x ∈ Set.Ico 0 T, HasDerivWithinAt y (y' x) (Set.Ici x) x)`, not stated in the claim. — **OPEN**
- `d5ec01ceedb1` CONDITIONAL: `main3_bound` assumes `(∀ x ∈ Set.Ico 0 T, y' x ≤ C - kappa cz * y x ^ 2)`, not stated in the claim. — **OPEN**

## Realignment notes

- Theorem: answer `858ad372d771` — Paper claim Theorem (c-thm23) states: “Theorem 2.3: any antisymmetric B that is invariant under the coadjoint action of volume-preserving diffeomorphisms of T3 (C1), degenerate w.r.t. kinetic energy (C2), and produces controllable negativ…”. Lean theorem `thm23` assumes `StabilizerTransitive act u`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem: answer `a272731d6977` — Paper claim Theorem (c-thm23) states: “Theorem 2.3: any antisymmetric B that is invariant under the coadjoint action of volume-preserving diffeomorphisms of T3 (C1), degenerate w.r.t. kinetic energy (C2), and produces controllable negativ…”. Lean theorem `thm23` assumes `MayC3 cz ω u B`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem: answer `022885b6dde3` — Paper claim Theorem (c-thm23) states: “Theorem 2.3: any antisymmetric B that is invariant under the coadjoint action of volume-preserving diffeomorphisms of T3 (C1), degenerate w.r.t. kinetic energy (C2), and produces controllable negativ…”. Lean theorem `thm23_orbit` assumes `E.CasimirLevelTransitive ω`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem: answer `c6ba3f00d1ed` — Paper claim Theorem (c-thm23) states: “Theorem 2.3: any antisymmetric B that is invariant under the coadjoint action of volume-preserving diffeomorphisms of T3 (C1), degenerate w.r.t. kinetic energy (C2), and produces controllable negativ…”. Lean theorem `thm23_orbit` assumes `MayC3 cz ω.1 (E.velocity ω) B`, which the claim does not state. Is this extra hypothesis intentional?
- Proposition: answer `cc64c3078c55` — Paper claim Proposition (c-exist) states: “The TetherKernel with kappa = C_CZ(3) satisfies C1, C2, C3.”. Lean theorem `existence` assumes `(∃ e : L2Field, ⟪u, e⟫ = 0 ∧ ‖e‖ = 1)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem: answer `8dac4f39a594` — Paper claim Theorem (c-main3) states: “Tether bounding inequality: d/dt ||omega||_inf <= C - kappa ||omega||_inf^2 with kappa > 0, hence ||omega||_inf stays bounded.”. Lean theorem `main3_bound` assumes `ContinuousOn y (Set.Icc 0 T)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem: answer `6f08f9e6114e` — Paper claim Theorem (c-main3) states: “Tether bounding inequality: d/dt ||omega||_inf <= C - kappa ||omega||_inf^2 with kappa > 0, hence ||omega||_inf stays bounded.”. Lean theorem `main3_bound` assumes `(∀ x ∈ Set.Ico 0 T, HasDerivWithinAt y (y' x) (Set.Ici x) x)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem: answer `c127608f99a2` — Paper claim Theorem (c-main3) states: “Tether bounding inequality: d/dt ||omega||_inf <= C - kappa ||omega||_inf^2 with kappa > 0, hence ||omega||_inf stays bounded.”. Lean theorem `main3_bound` assumes `(∀ x ∈ Set.Ico 0 T, y' x ≤ C - kappa cz * y x ^ 2)`, which the claim does not state. Is this extra hypothesis intentional?
- Definition: difference `096a0a1135f6` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem: answer `d8de27b4dea8` — Paper claim Theorem (c-ns) states: “Navier-Stokes vorticity on T3 obeys the tether bounding inequality (estimates layer).”. Lean theorem `main3_bound` assumes `ContinuousOn y (Set.Icc 0 T)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem: answer `3a32a243f876` — Paper claim Theorem (c-ns) states: “Navier-Stokes vorticity on T3 obeys the tether bounding inequality (estimates layer).”. Lean theorem `main3_bound` assumes `(∀ x ∈ Set.Ico 0 T, HasDerivWithinAt y (y' x) (Set.Ici x) x)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem: answer `d5ec01ceedb1` — Paper claim Theorem (c-ns) states: “Navier-Stokes vorticity on T3 obeys the tether bounding inequality (estimates layer).”. Lean theorem `main3_bound` assumes `(∀ x ∈ Set.Ico 0 T, y' x ≤ C - kappa cz * y x ^ 2)`, which the claim does not state. Is this extra hypothesis intentional?
- Lean `thm23_literal_vacuous` cites “Theorem 2.3” in its docstring but is not matched to any anchor claim (informational).
