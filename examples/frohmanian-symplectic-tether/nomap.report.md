# PipelineHalt report: The Frohmanian Symplectic Tether $\T$:\\ Written Proofs Companion to the Lean~4 Formalization

Status: **HALT** · overall drift **0.386** · 30 claims · 428 Lean declarations scanned · 52 open question(s)

Mapping file: none (heuristic pairing only).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Definition 2.1 | `frohmanianTether` (0.244) | 0.000 | 0 | 0 |
| Lemma 2.2 | `degeneracy_verification` (0.236) | 0.000 | 0 | 0 |
| Theorem 2.3 | `admissible_eq_smul_frohmanianTether` (0.279) | 0.825 | 3 | 0 |
| Theorem 2.4 | `uniqueness_routeA_iff` (0.387), `kappa_eq_stretching_of_admissible` (0.341), `frohmanian_symplectic_tether_theorem` (0.328), `routeA_determines_kappa` (0.305) | 0.900 | 3 | 0 |
| Theorem 2.5 | `jacobi_iff_mixed_cancel` (0.47), `mixedTerm_eq_zero` (0.326), `jacT_eq_mixedSum` (0.315), `jacobiator_eq_mixed` (0.289) | 0.500 | 1 | 0 |
| Theorem 2.6 | `metriplectic_energy_conserved` (0.395), `metriplecticBracket_split` (0.376), `split_unique` (0.253) | 0.000 | 0 | 0 |
| Proposition 2.7 | `symPart_not_cochain` (0.407), `d2_d1` (0.279) | 0.500 | 1 | 0 |
| Proposition 2.8 | `div_mode` (0.352), `shearX_mixed_coeff` (0.317), `shearBad_div` (0.313), `shearBad_not_divFree` (0.309) | 0.000 | 0 | 0 |
| Theorem 2.9 | `shearY_mixed_cancel` (0.274), `shearY_transverse_coeff` (0.268), `shearY_jacobi_fails_transverse` (0.232), `mixedF_eq_zero_of_shear` (0.23) | 0.995 | 8 | 0 |
| Theorem 3.1 | `curlOfForcedNS` (0.297), `classicalSolutionOn_zero` (0.281), `classicalSolutionOn_of_nonpos` (0.26) | 0.300 | 1 | 0 |
| Theorem 3.2 | `div_bsMode` (0.244), `curlRightInverse_trig` (0.217) | 0.300 | 1 | 0 |
| Corollary 3.3 | `tetheredVorticity_of_velocity` (0.414) | 0.650 | 2 | 0 |
| Lemma 3.4 | `young_kappa_quarter` (0.295), `young_lam` (0.244) | 0.000 | 0 | 0 |
| Theorem 3.5 | `tethered_L2_vorticity_bounded` (0.305), `tethered_enstrophy_uniform` (0.3), `young_absorption` (0.24), `routeA_layer2_bound` (0.231) | 1.000 | 11 | 0 |
| Lemma 3.6 | `tether_H1_density_nonneg'` (0.296), `lp_absorb` (0.263), `tether_H1_density_nonneg` (0.254), `frohmanianTether_feedback` (0.248) | 0.860 | 3 | 0 |
| Theorem 3.7 | `tethered_palinstrophy_gronwall` (0.304), `palin_deriv_le` (0.302), `young_43` (0.281), `l4l2Holder_torus` (0.257) | 1.000 | 10 | 0 |
| Theorem 3.8 | `global_regularity_logloss` (0.5), `higherNormControl_tethered` (0.353) | 0.860 | 3 | 0 |
| Hypothesis 3.9 | `TetheredEnstrophyIdentity` (0.325) | 0.000 | 0 | 0 |
| Hypothesis 3.10 | `StrainL2Bound` (0.452) | 0.300 | 1 | 0 |
| Hypothesis 3.11 | `L4L2Holder` (0.208) | 0.000 | 0 | 0 |
| Hypothesis 3.12 | `TetheredH1Identity` (0.405) | 0.000 | 0 | 0 |
| Hypothesis 3.13 | `NonlinH1Bound` (0.41) | 0.000 | 0 | 0 |
| Hypothesis 3.14 | `H1ToHsBootstrap` (0.262) | 0.300 | 1 | 0 |
| Hypothesis 3.15 | — | 1.000 | 1 | 0 |
| Hypothesis 3.16 | `BKMLogInequality` (0.363) | 0.300 | 1 | 0 |
| Hypothesis 3.17 | `CrossControlled` (0.305) | 0.000 | 0 | 0 |
| Hypothesis 3.18 | `NSTetherLogInequality` (0.473), `NSTetherEnstrophyInequality` (0.349) | 0.000 | 0 | 0 |
| Hypothesis 3.19 | — | 1.000 | 1 | 0 |
| Hypothesis 3.20 | `LocalContinuation` (0.269) | 0.000 | 0 | 0 |
| Hypothesis 3.21 | `CurlRightInverse` (0.248) | 0.000 | 0 | 0 |

## Theorem 2.3 — Uniqueness up to scale

- `cd7541d5e2fb` AMBIGUOUS: Title “Uniqueness up to scale” shares almost no terms with the statement. — **OPEN**
- `d1da3cc1e119` CONDITIONAL: `admissible_eq_smul_frohmanianTether` assumes `hdim : 3 ≤ Module.finrank ℝ H`, not stated in the claim. — **OPEN**
- `afbf776c6966` CONDITIONAL: `admissible_eq_smul_frohmanianTether` assumes `hC2 : DegenerateWRTKineticEnergy u B`, not stated in the claim. — **OPEN**

## Theorem 2.4 — Route A determines $\kappa$

- `0351ad80e81e` CONDITIONAL: `uniqueness_routeA_iff` assumes `hdim : 3 ≤ Module.finrank ℝ H`, not stated in the claim. — **OPEN**
- `f1d97b1153ef` NARROWER: `uniqueness_routeA_iff` uses w ≥ 0 where the claim says w ≥ 1 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `ffbeabec45dd` CONDITIONAL: `frohmanian_symplectic_tether_theorem` assumes `hdim : 3 ≤ Module.finrank ℝ H`, not stated in the claim. — **OPEN**

## Theorem 2.5 — Nine-term Jacobi

- `b8c9e3d7247a` CONDITIONAL: `jacT_eq_mixedSum` assumes `hu : pr u u ≠ 0`, not stated in the claim. — **OPEN**

## Proposition 2.7 — Chevalley--Eilenberg

- `676b9bd04e2a` CONDITIONAL: `symPart_not_cochain` assumes `h : IsAlt (symPart β)`, not stated in the claim. — **OPEN**

## Theorem 2.9 — Field-level Jacobi

- `d566201c7924` AMBIGUOUS: Title “Field-level Jacobi” shares almost no terms with the statement. — **OPEN**
- `a8c4bd46600f` CONDITIONAL: `shearY_mixed_cancel` assumes `ha : XOnly a`, not stated in the claim. — **OPEN**
- `82b752d3fd43` CONDITIONAL: `shearY_mixed_cancel` assumes `hb : XOnly b`, not stated in the claim. — **OPEN**
- `c0774d45de21` CONDITIONAL: `shearY_mixed_cancel` assumes `hc : XOnly c`, not stated in the claim. — **OPEN**
- `9cec6a6765ae` CONDITIONAL: `mixedF_eq_zero_of_shear` assumes `hu : XOnly u`, not stated in the claim. — **OPEN**
- `0443b401b86e` CONDITIONAL: `mixedF_eq_zero_of_shear` assumes `ha : XOnly a`, not stated in the claim. — **OPEN**
- `1e60cb20ac26` CONDITIONAL: `mixedF_eq_zero_of_shear` assumes `hb : XOnly b`, not stated in the claim. — **OPEN**
- `42969de792c8` CONDITIONAL: `mixedF_eq_zero_of_shear` assumes `hc : XOnly c`, not stated in the claim. — **OPEN**

## Theorem 3.1 — Curl of forced NS

- `92afe540c9d8` AMBIGUOUS: Title “Curl of forced NS” shares almost no terms with the statement. — **OPEN**

## Theorem 3.2 — Biot--Savart on trigonometric polynomials

- `9fc421062aad` AMBIGUOUS: Title “Biot--Savart on trigonometric polynomials” shares almost no terms with the statement. — **OPEN**

## Corollary 3.3 — Velocity form $\Rightarrow$ vorticity form

- `2f0c78c673b8` AMBIGUOUS: Title “Velocity form $\Rightarrow$ vorticity form” shares almost no terms with the statement. — **OPEN**
- `57dd9f3f7724` CONDITIONAL: `tetheredVorticity_of_velocity` assumes `hadm : ∀ t, Adm (fun y => -κ • P (cubic (vorticity u t)) y)`, not stated in the claim. — **OPEN**

## Theorem 3.5

- `d758bf272889` CONDITIONAL: `tethered_L2_vorticity_bounded` assumes `hD : ∀ x ∈ Ico 0 T, 0 ≤ D x`, not stated in the claim. — **OPEN**
- `b3dd16401dfc` CONDITIONAL: `tethered_L2_vorticity_bounded` assumes `hE : ∀ x ∈ Ico 0 T, 0 ≤ E x`, not stated in the claim. — **OPEN**
- `ca7aa5d3cd78` CONDITIONAL: `tethered_L2_vorticity_bounded` assumes `hQ : ∀ x ∈ Ico 0 T, 0 ≤ Q x`, not stated in the claim. — **OPEN**
- `d0d649ab7d98` CONDITIONAL: `tethered_enstrophy_uniform` assumes `hD : ∀ x ∈ Ico 0 T, 0 ≤ D x`, not stated in the claim. — **OPEN**
- `1750ae7470d2` CONDITIONAL: `tethered_enstrophy_uniform` assumes `hE : ∀ x ∈ Ico 0 T, 0 ≤ E x`, not stated in the claim. — **OPEN**
- `fd6fb15983d6` CONDITIONAL: `tethered_enstrophy_uniform` assumes `hQ : ∀ x ∈ Ico 0 T, 0 ≤ Q x`, not stated in the claim. — **OPEN**
- `744fedfd6502` CONDITIONAL: `routeA_layer2_bound` assumes `hA : RouteAFeedback S w u ω 𝔗_F[κ, w, u]`, not stated in the claim. — **OPEN**
- `270d6d8d843e` NARROWER: `routeA_layer2_bound` restricts y ≥ 0; the claim states no such restriction. — **OPEN**
- `c3644725c9b0` CONDITIONAL: `routeA_layer2_bound` assumes `hc : ContinuousOn y (Set.Icc 0 T)`, not stated in the claim. — **OPEN**
- `aaaad56ba215` CONDITIONAL: `routeA_layer2_bound` assumes `hd : ∀ x ∈ Set.Ico 0 T, HasDerivWithinAt y (y' x) (Set.Ici x) x`, not stated in the claim. — **OPEN**
- `bba57c330fb5` CONDITIONAL: `routeA_layer2_bound` assumes `hineq : ∀ x ∈ Set.Ico 0 T, y' x ≤ C * y x ^ 2 - kappaDD κ Cabs * y x ^ 3`, not stated in the claim. — **OPEN**

## Lemma 3.6 — Tether is sign-definite at $H^1$

- `52d0f336b86b` AMBIGUOUS: Title “Tether is sign-definite at $H^1$” shares almost no terms with the statement. — **OPEN**
- `c7d019645598` CONDITIONAL: `frohmanianTether_feedback` assumes `hdim : 2 ≤ Module.finrank ℝ H`, not stated in the claim. — **OPEN**
- `efff76fbf218` NARROWER: `frohmanianTether_feedback` restricts w ≥ 0; the claim states no such restriction. — **OPEN**

## Theorem 3.7

- `92d5dd28110a` CONDITIONAL: `tethered_palinstrophy_gronwall` assumes `hP : ∀ x ∈ Ico 0 T, 0 ≤ P x`, not stated in the claim. — **OPEN**
- `b069093d036f` CONDITIONAL: `tethered_palinstrophy_gronwall` assumes `hL : ∀ x ∈ Ico 0 T, 0 ≤ L x`, not stated in the claim. — **OPEN**
- `556052bf156f` CONDITIONAL: `tethered_palinstrophy_gronwall` assumes `hJ : ∀ x ∈ Ico 0 T, 0 ≤ J x`, not stated in the claim. — **OPEN**
- `cb7220e3b75a` NARROWER: `palin_deriv_le` restricts p ≥ 0; the claim states no such restriction. — **OPEN**
- `0df7d6a021a4` NARROWER: `palin_deriv_le` restricts l ≥ 0; the claim states no such restriction. — **OPEN**
- `43d84ce4e585` NARROWER: `palin_deriv_le` restricts j ≥ 0; the claim states no such restriction. — **OPEN**
- `0d7b17f0390f` CONDITIONAL: `palin_deriv_le` assumes `hn : n ≤ A * Real.sqrt (Real.sqrt p) * Real.sqrt l ^ 3`, not stated in the claim. — **OPEN**
- `df87c98c97c9` NARROWER: `young_43` restricts x ≥ 0; the claim states no such restriction. — **OPEN**
- `43c2fc74fe60` NARROWER: `young_43` restricts w ≥ 0; the claim states no such restriction. — **OPEN**
- `6fd223daa211` CONDITIONAL: `l4l2Holder_torus` assumes `hg : ∀ x, MemLp (g x) 2 torusMeasure`, not stated in the claim. — **OPEN**

## Theorem 3.8 — Global smoothness of the tethered system, conditional

- `421e6c7db723` AMBIGUOUS: Title “Global smoothness of the tethered system, conditional” shares almost no terms with the statement. — **OPEN**
- `4598b6f5584c` NARROWER: `higherNormControl_tethered` restricts x ≥ 0; the claim states no such restriction. — **OPEN**
- `eb9651e361a1` CONDITIONAL: `higherNormControl_tethered` assumes `hH1 : ∀ T, 0 < T → (∀ T' < T, SmoothOn T') → ∃ Gb, ∀ x ∈ Ico 0 T, G x ≤ Gb`, not stated in the claim. — **OPEN**

## Hypothesis 3.10 — \lean{StrainL2Bound}

- `cd0bdcad3c76` AMBIGUOUS: Title “\lean{StrainL2Bound}” shares almost no terms with the statement. — **OPEN**

## Hypothesis 3.14 — \lean{H1ToHsBootstrap}

- `46d843337285` AMBIGUOUS: Title “\lean{H1ToHsBootstrap}” shares almost no terms with the statement. — **OPEN**

## Hypothesis 3.15 — \lean{EnergyIdentity}, \lean{StretchingByStrain}

- `31218b0141e8` SILENT: No Lean declaration matches this claim. Closest candidate: `StrainL2Bound` (score 0.22, but it matches claim cp:CZ better). — **OPEN**

## Hypothesis 3.16 — \lean{BKMLogInequality}

- `a01c12ef4309` AMBIGUOUS: Title “\lean{BKMLogInequality}” shares almost no terms with the statement. — **OPEN**

## Hypothesis 3.19 — \lean{BKMContinuation}

- `7189e4ca56f3` SILENT: No Lean declaration matches this claim. Closest candidate: `BKMContinuation` (score 0.14, below threshold 0.2). — **OPEN**

## Realignment notes

- Theorem 2.3: answer `cd7541d5e2fb` — Paper claim Theorem 2.3 (thm:unique) states: “Let $B$ be a symmetric bilinear form that is (C1) invariant under the coadjoint isometries fixing $u$ and (C2) degenerate with respect to $u$. Then $B=\T[c,1,u]$ for some $c\in\mathbb R$. If, in addi…”. Its title is “Uniqueness up to scale”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 2.3: answer `d1da3cc1e119` — Paper claim Theorem 2.3 (thm:unique) states: “Let $B$ be a symmetric bilinear form that is (C1) invariant under the coadjoint isometries fixing $u$ and (C2) degenerate with respect to $u$. Then $B=\T[c,1,u]$ for some $c\in\mathbb R$. If, in addi…”. Lean theorem `admissible_eq_smul_frohmanianTether` assumes `hdim : 3 ≤ Module.finrank ℝ H`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.3: answer `afbf776c6966` — Paper claim Theorem 2.3 (thm:unique) states: “Let $B$ be a symmetric bilinear form that is (C1) invariant under the coadjoint isometries fixing $u$ and (C2) degenerate with respect to $u$. Then $B=\T[c,1,u]$ for some $c\in\mathbb R$. If, in addi…”. Lean theorem `admissible_eq_smul_frohmanianTether` assumes `hC2 : DegenerateWRTKineticEnergy u B`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.4: answer `0351ad80e81e` — Paper claim Theorem 2.4 (thm:routeA) states: “Let $\omega\perp u$, $\|\omega\|=1$, $w\neq0$. Suppose $\T[\kappa,w,u]$ matches the stretching coefficient $S$ in the sense $\T[\kappa,w,u](\omega,\omega)+S w=0$. Then $\kappa=S$. Consequently, in $\…”. Lean theorem `uniqueness_routeA_iff` assumes `hdim : 3 ≤ Module.finrank ℝ H`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.4: answer `f1d97b1153ef` — Paper claim Theorem 2.4 (thm:routeA) states: “Let $\omega\perp u$, $\|\omega\|=1$, $w\neq0$. Suppose $\T[\kappa,w,u]$ matches the stretching coefficient $S$ in the sense $\T[\kappa,w,u](\omega,\omega)+S w=0$. Then $\kappa=S$. Consequently, in $\…”. Lean theorem `uniqueness_routeA_iff` assumes `0 ≤ w` (w ≥ 0), but the claim says w ≥ 1. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 2.4: answer `ffbeabec45dd` — Paper claim Theorem 2.4 (thm:routeA) states: “Let $\omega\perp u$, $\|\omega\|=1$, $w\neq0$. Suppose $\T[\kappa,w,u]$ matches the stretching coefficient $S$ in the sense $\T[\kappa,w,u](\omega,\omega)+S w=0$. Then $\kappa=S$. Consequently, in $\…”. Lean theorem `frohmanian_symplectic_tether_theorem` assumes `hdim : 3 ≤ Module.finrank ℝ H`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.5: answer `b8c9e3d7247a` — Paper claim Theorem 2.5 (thm:jacobi) states: “For a classical (Jacobi) bracket $P$ and the tethered bracket $P+\T$, the Jacobiator expands into nine terms. The three purely classical ones cancel by Jacobi of $P$, and the three purely tether term…”. Lean theorem `jacT_eq_mixedSum` assumes `hu : pr u u ≠ 0`, which the claim does not state. Is this extra hypothesis intentional?
- Proposition 2.7: answer `676b9bd04e2a` — Paper claim Proposition 2.7 (prop:ce) states: “(a) $d_2\circ d_1=0$ on 1-cochains of any Lie algebra. (b) Coboundaries are cocycles. (c) If $2$ is invertible and the symmetric part of $\beta$ is alternating, it is zero. So a nonzero symmetric cor…”. Lean theorem `symPart_not_cochain` assumes `h : IsAlt (symPart β)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.9: answer `d566201c7924` — Paper claim Theorem 2.9 (thm:fieldjacobi) states: “•[(a)] The field bracket satisfies Jacobi. So the Arnold (Lie--Poisson) bracket on linear functionals is classical. •[(b)] If $\langle u,u\rangle\neq0$, the Jacobiator of the tethered bracket equals …”. Its title is “Field-level Jacobi”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 2.9: answer `a8c4bd46600f` — Paper claim Theorem 2.9 (thm:fieldjacobi) states: “•[(a)] The field bracket satisfies Jacobi. So the Arnold (Lie--Poisson) bracket on linear functionals is classical. •[(b)] If $\langle u,u\rangle\neq0$, the Jacobiator of the tethered bracket equals …”. Lean theorem `shearY_mixed_cancel` assumes `ha : XOnly a`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.9: answer `82b752d3fd43` — Paper claim Theorem 2.9 (thm:fieldjacobi) states: “•[(a)] The field bracket satisfies Jacobi. So the Arnold (Lie--Poisson) bracket on linear functionals is classical. •[(b)] If $\langle u,u\rangle\neq0$, the Jacobiator of the tethered bracket equals …”. Lean theorem `shearY_mixed_cancel` assumes `hb : XOnly b`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.9: answer `c0774d45de21` — Paper claim Theorem 2.9 (thm:fieldjacobi) states: “•[(a)] The field bracket satisfies Jacobi. So the Arnold (Lie--Poisson) bracket on linear functionals is classical. •[(b)] If $\langle u,u\rangle\neq0$, the Jacobiator of the tethered bracket equals …”. Lean theorem `shearY_mixed_cancel` assumes `hc : XOnly c`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.9: answer `9cec6a6765ae` — Paper claim Theorem 2.9 (thm:fieldjacobi) states: “•[(a)] The field bracket satisfies Jacobi. So the Arnold (Lie--Poisson) bracket on linear functionals is classical. •[(b)] If $\langle u,u\rangle\neq0$, the Jacobiator of the tethered bracket equals …”. Lean theorem `mixedF_eq_zero_of_shear` assumes `hu : XOnly u`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.9: answer `0443b401b86e` — Paper claim Theorem 2.9 (thm:fieldjacobi) states: “•[(a)] The field bracket satisfies Jacobi. So the Arnold (Lie--Poisson) bracket on linear functionals is classical. •[(b)] If $\langle u,u\rangle\neq0$, the Jacobiator of the tethered bracket equals …”. Lean theorem `mixedF_eq_zero_of_shear` assumes `ha : XOnly a`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.9: answer `1e60cb20ac26` — Paper claim Theorem 2.9 (thm:fieldjacobi) states: “•[(a)] The field bracket satisfies Jacobi. So the Arnold (Lie--Poisson) bracket on linear functionals is classical. •[(b)] If $\langle u,u\rangle\neq0$, the Jacobiator of the tethered bracket equals …”. Lean theorem `mixedF_eq_zero_of_shear` assumes `hb : XOnly b`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2.9: answer `42969de792c8` — Paper claim Theorem 2.9 (thm:fieldjacobi) states: “•[(a)] The field bracket satisfies Jacobi. So the Arnold (Lie--Poisson) bracket on linear functionals is classical. •[(b)] If $\langle u,u\rangle\neq0$, the Jacobiator of the tethered bracket equals …”. Lean theorem `mixedF_eq_zero_of_shear` assumes `hc : XOnly c`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.1: answer `92afe540c9d8` — Paper claim Theorem 3.1 (theorem-3.1) states: “If $(u,p)$ is a classical smooth solution of $\partial_tu+(u\cdot\nabla)u=-\nabla p+\nu\Delta u+F$ with $\mathrm{div}\,u=0$, then $\omega=\mathrm{curl}\,u$ satisfies $\partial_t\omega+(u\cdot\nabla)\…”. Its title is “Curl of forced NS”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 3.2: answer `9fc421062aad` — Paper claim Theorem 3.2 (theorem-3.2) states: “For each nonzero wavevector $k$ and amplitude $a\perp k$, the mode $b=\frac{ik\times a}{|k|^2}e^{ik\cdot x}$ satisfies $\mathrm{curl}\,b=a\,e^{ik\cdot x}$ and $\mathrm{div}\,b=0$, and it is the uniqu…”. Its title is “Biot--Savart on trigonometric polynomials”, which does not appear to describe that statement. Is the title or the statement misworded?
- Corollary 3.3: answer `2f0c78c673b8` — Paper claim Corollary 3.3 (corollary-3.3) states: “If $\mathrm{curl}^{-1}$ is a right inverse of curl on the admissible class containing $-\kappa P(|\omega|^2\omega)$, then every velocity solution of the tethered NS solves \eqref{eq:tv}.”. Its title is “Velocity form $\Rightarrow$ vorticity form”, which does not appear to describe that statement. Is the title or the statement misworded?
- Corollary 3.3: answer `57dd9f3f7724` — Paper claim Corollary 3.3 (corollary-3.3) states: “If $\mathrm{curl}^{-1}$ is a right inverse of curl on the admissible class containing $-\kappa P(|\omega|^2\omega)$, then every velocity solution of the tethered NS solves \eqref{eq:tv}.”. Lean theorem `tetheredVorticity_of_velocity` assumes `hadm : ∀ t, Adm (fun y => -κ • P (cubic (vorticity u t)) y)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `d758bf272889` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `tethered_L2_vorticity_bounded` assumes `hD : ∀ x ∈ Ico 0 T, 0 ≤ D x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `b3dd16401dfc` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `tethered_L2_vorticity_bounded` assumes `hE : ∀ x ∈ Ico 0 T, 0 ≤ E x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `ca7aa5d3cd78` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `tethered_L2_vorticity_bounded` assumes `hQ : ∀ x ∈ Ico 0 T, 0 ≤ Q x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `d0d649ab7d98` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `tethered_enstrophy_uniform` assumes `hD : ∀ x ∈ Ico 0 T, 0 ≤ D x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `1750ae7470d2` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `tethered_enstrophy_uniform` assumes `hE : ∀ x ∈ Ico 0 T, 0 ≤ E x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `fd6fb15983d6` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `tethered_enstrophy_uniform` assumes `hQ : ∀ x ∈ Ico 0 T, 0 ≤ Q x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `744fedfd6502` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `routeA_layer2_bound` assumes `hA : RouteAFeedback S w u ω 𝔗_F[κ, w, u]`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `270d6d8d843e` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `routeA_layer2_bound` assumes `0 ≤ y 0` (restricting y ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 3.5: answer `c3644725c9b0` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `routeA_layer2_bound` assumes `hc : ContinuousOn y (Set.Icc 0 T)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `aaaad56ba215` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `routeA_layer2_bound` assumes `hd : ∀ x ∈ Set.Ico 0 T, HasDerivWithinAt y (y' x) (Set.Ici x) x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.5: answer `bba57c330fb5` — Paper claim Theorem 3.5 (thm:L2) states: “Let $E=\tfrac12\|\omega\|_2^2$ and $Q=\|\omega\|_4^4$. Assume $E'=S-\nu D-\kappa Q$ (Cited Prop.~\ref{cp:EI}), $S\le C\sqrt{2E}\sqrt Q$ (Cited Prop.~\ref{cp:CZ}), and $(2E)^2\le Q$ (Cited Prop.~\ref{…”. Lean theorem `routeA_layer2_bound` assumes `hineq : ∀ x ∈ Set.Ico 0 T, y' x ≤ C * y x ^ 2 - kappaDD κ Cabs * y x ^ 3`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 3.6: answer `52d0f336b86b` — Paper claim Lemma 3.6 (lemma-3.6) states: “For $\omega\in\mathbb R^3$ and $D=\nabla\omega$, $\sum_{ij}D_{ij}\,\partial_j(|\omega|^2\omega_i)=|\omega|^2|D|^2+\tfrac12\sum_j(2\sum_k\omega_kD_{kj})^2\ge0$, with no alignment assumption.”. Its title is “Tether is sign-definite at $H^1$”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 3.6: answer `c7d019645598` — Paper claim Lemma 3.6 (lemma-3.6) states: “For $\omega\in\mathbb R^3$ and $D=\nabla\omega$, $\sum_{ij}D_{ij}\,\partial_j(|\omega|^2\omega_i)=|\omega|^2|D|^2+\tfrac12\sum_j(2\sum_k\omega_kD_{kj})^2\ge0$, with no alignment assumption.”. Lean theorem `frohmanianTether_feedback` assumes `hdim : 2 ≤ Module.finrank ℝ H`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 3.6: answer `efff76fbf218` — Paper claim Lemma 3.6 (lemma-3.6) states: “For $\omega\in\mathbb R^3$ and $D=\nabla\omega$, $\sum_{ij}D_{ij}\,\partial_j(|\omega|^2\omega_i)=|\omega|^2|D|^2+\tfrac12\sum_j(2\sum_k\omega_kD_{kj})^2\ge0$, with no alignment assumption.”. Lean theorem `frohmanianTether_feedback` assumes `0 ≤ w` (restricting w ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 3.7: answer `92d5dd28110a` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `tethered_palinstrophy_gronwall` assumes `hP : ∀ x ∈ Ico 0 T, 0 ≤ P x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.7: answer `b069093d036f` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `tethered_palinstrophy_gronwall` assumes `hL : ∀ x ∈ Ico 0 T, 0 ≤ L x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.7: answer `556052bf156f` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `tethered_palinstrophy_gronwall` assumes `hJ : ∀ x ∈ Ico 0 T, 0 ≤ J x`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.7: answer `cb7220e3b75a` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `palin_deriv_le` assumes `0 ≤ p` (restricting p ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 3.7: answer `0df7d6a021a4` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `palin_deriv_le` assumes `0 ≤ l` (restricting l ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 3.7: answer `43d84ce4e585` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `palin_deriv_le` assumes `0 ≤ j` (restricting j ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 3.7: answer `0d7b17f0390f` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `palin_deriv_le` assumes `hn : n ≤ A * Real.sqrt (Real.sqrt p) * Real.sqrt l ^ 3`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.7: answer `df87c98c97c9` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `young_43` assumes `0 ≤ x` (restricting x ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 3.7: answer `43c2fc74fe60` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `young_43` assumes `0 ≤ w` (restricting w ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 3.7: answer `6fd223daa211` — Paper claim Theorem 3.7 (thm:H1) states: “Let $G=\|\nabla\omega\|_2^2$, $L=\|\Delta\omega\|_2$. Assume $G'=2(-\nu L^2-\kappa J+N)$ with $J\ge0$ (Cited Prop.~\ref{cp:H1I}) and $N\le A\,G^{1/4}L^{3/2}$ (Cited Prop.~\ref{cp:NL}). Then $G(t)\le …”. Lean theorem `l4l2Holder_torus` assumes `hg : ∀ x, MemLp (g x) 2 torusMeasure`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.8: answer `421e6c7db723` — Paper claim Theorem 3.8 (theorem-3.8) states: “Assume the tethered log inequality (Cited Prop.~\ref{cp:NSlog}), higher-norm control, BKM continuation (Cited Prop.~\ref{cp:BKM}) and local continuation (Cited Prop.~\ref{cp:LC}). Then the solution i…”. Its title is “Global smoothness of the tethered system, conditional”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 3.8: answer `4598b6f5584c` — Paper claim Theorem 3.8 (theorem-3.8) states: “Assume the tethered log inequality (Cited Prop.~\ref{cp:NSlog}), higher-norm control, BKM continuation (Cited Prop.~\ref{cp:BKM}) and local continuation (Cited Prop.~\ref{cp:LC}). Then the solution i…”. Lean theorem `higherNormControl_tethered` assumes `∃ Z0b, 0 ≤ Z0b ∧ ∀ x, 0 ≤ x → Z0 x ≤ Z0b` (restricting x ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 3.8: answer `eb9651e361a1` — Paper claim Theorem 3.8 (theorem-3.8) states: “Assume the tethered log inequality (Cited Prop.~\ref{cp:NSlog}), higher-norm control, BKM continuation (Cited Prop.~\ref{cp:BKM}) and local continuation (Cited Prop.~\ref{cp:LC}). Then the solution i…”. Lean theorem `higherNormControl_tethered` assumes `hH1 : ∀ T, 0 < T → (∀ T' < T, SmoothOn T') → ∃ Gb, ∀ x ∈ Ico 0 T, G x ≤ Gb`, which the claim does not state. Is this extra hypothesis intentional?
- Hypothesis 3.10: answer `cd0bdcad3c76` — Paper claim Hypothesis 3.10 (cp:CZ) states: “$\int\omega\cdot S\omega\le C\|\omega\|_2\|\omega\|_4^2$: Calder\'on--Zygmund / Biot--Savart, classical.”. Its title is “\lean{StrainL2Bound}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Hypothesis 3.14: answer `46d843337285` — Paper claim Hypothesis 3.14 (cp:boot) states: “$H^1$ bounds on $[0,T)$ imply $H^s$ bounds for all $s$. For plain NS this is classical parabolic regularity~\cite{Temam,CF,MB}. \textbf{The tether-specific step (controlling $\kappa P(|\omega|^2\omeg…”. Its title is “\lean{H1ToHsBootstrap}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Hypothesis 3.15: answer `31218b0141e8` — Paper claim Hypothesis 3.15 (cp:SbS) states: “Pointwise evolution at the maximum, and stretching $\le\|S\|_\infty y^2$.”. No Lean declaration matching it was found among 138 candidates. Closest candidate: `StrainL2Bound` (score 0.22, but it matches claim cp:CZ better). Is this claim intentionally not formalized, or which declaration should it map to?
- Hypothesis 3.16: answer `a01c12ef4309` — Paper claim Hypothesis 3.16 (cp:BKMlog) states: “$\|S\|_\infty\le C(1+\|\omega\|_2+\|\omega\|_\infty\log(e+\|\omega\|_{H^s}))$~\cite{BKM}; see also Brezis--Gallou\"et and Kozono--Taniuchi~\cite{KT}.”. Its title is “\lean{BKMLogInequality}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Hypothesis 3.19: answer `7189e4ca56f3` — Paper claim Hypothesis 3.19 (cp:BKM) states: “Beale--Kato--Majda~\cite{BKM}: bounded $\|\omega\|_\infty$ on $[0,T)$ implies continuation. Stated for plain NS; its extension to \eqref{eq:tv} is assumed.”. No Lean declaration matching it was found among 138 candidates. Closest candidate: `BKMContinuation` (score 0.14, below threshold 0.2). Is this claim intentionally not formalized, or which declaration should it map to?
