# PipelineHalt report

Status: **HALT** · overall drift **0.760** · 10 claims · 1180 Lean declarations scanned · 31 open question(s)

Mapping file: none (heuristic pairing only).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 1 | `periodicLocalExistence_of_nonneg` (0.468), `periodicLocalExistence_of_galerkin` (0.427), `not_periodicStrainLinfBound_of_static` (0.323) | 0.750 | 2 | 0 |
| Theorem 2 | `periodicEnergyDifferenceEstimate` (0.336), `periodicVelocityUniqueness_of_energy` (0.274), `isPeriodicMaximalSolution_glue` (0.248), `integrability_of_smallH1` (0.234) | 0.875 | 3 | 0 |
| Theorem 3 | `periodicFourierHsEnergyIdentity_of_coeff` (0.305) | 0.000 | 0 | 0 |
| Theorem 4 | `hasSum_prod_cubeCoeff` (0.333), `hasSum_re_cubeCoeff` (0.252), `exists_bound_cubeCoeff` (0.232), `norm_multiplier_le` (0.223) | 0.978 | 6 | 0 |
| Theorem 5 | `hasSum_rate_three` (0.331), `integral_rpow_weight_le` (0.225), `strain00_origin` (0.201), `enn_trilinear` (0.201) | 0.965 | 5 | 0 |
| Theorem 6 | `lower_term_bound` (0.229) | 0.912 | 4 | 0 |
| Theorem 7 | `periodicBKMCriterion_of_hsControl` (0.565), `periodicHsBlowupAlternative` (0.437), `periodicGalerkinLimit_of_nonneg` (0.339) | 0.936 | 3 | 0 |
| Proposition 8 | `periodicBKMHsControl_of_physical_lowFreq` (0.555), `periodicBKMHsControl_three_of_lowFreq` (0.428), `periodicBKMHsControl_of_fourier_lowFreq` (0.408), `periodicBKMHsControl_of_commutator_lowFreq` (0.399) | 0.920 | 3 | 0 |
| Theorem 9 | `periodicBKMHsControl_three` (0.337), `periodicBKMCriterion` (0.226) | 0.300 | 1 | 0 |
| Proposition 10 | `clay_B_exact_of_hsControl` (0.449), `clay_B_exact_of_bounds` (0.284), `clay_B_exact_of_integrability` (0.284) | 0.960 | 4 | 0 |

## Theorem 1 — Local existence

- `1863a59314d2` CONDITIONAL: `not_periodicStrainLinfBound_of_static` assumes `hmax : PeriodicMaximalSolution ν`, not stated in the claim. — **OPEN**
- `51448a5b231a` CONDITIONAL: `not_periodicStrainLinfBound_of_static` assumes `hstat : ¬ StrainLinfFamily.StaticStrainLinfBound`, not stated in the claim. — **OPEN**

## Theorem 2 — Energy difference / uniqueness

- `7bd64c706f02` CONDITIONAL: `integrability_of_smallH1` assumes `hR : PeriodicEnstrophyRiccati ν α β`, not stated in the claim. — **OPEN**
- `c8058c1d4ec0` CONDITIONAL: `integrability_of_smallH1` assumes `hL : PeriodicH1BlowupCriterion ν`, not stated in the claim. — **OPEN**
- `1e9942f73e2e` CONDITIONAL: `integrability_of_smallH1` assumes `hsmall : β * h1Sq u₀ ^ 2 < α`, not stated in the claim. — **OPEN**

## Theorem 4 — Parseval on the unit cube

- `82a054ead188` AMBIGUOUS: Title “Parseval on the unit cube” shares almost no terms with the statement. — **OPEN**
- `0765d86470cf` CONDITIONAL: `hasSum_prod_cubeCoeff` assumes `hfp : ∀ y (n : Fin 3 → ℤ), f (y + fun j => (n j : ℝ)) = f y`, not stated in the claim. — **OPEN**
- `9b09accb4bc1` CONDITIONAL: `hasSum_prod_cubeCoeff` assumes `hgp : ∀ y (n : Fin 3 → ℤ), g (y + fun j => (n j : ℝ)) = g y`, not stated in the claim. — **OPEN**
- `eac38c432976` CONDITIONAL: `hasSum_re_cubeCoeff` assumes `hφ : PerR φ`, not stated in the claim. — **OPEN**
- `a29ebc7fbdf3` CONDITIONAL: `hasSum_re_cubeCoeff` assumes `hψ : PerR ψ`, not stated in the claim. — **OPEN**
- `37956977b2ec` CONDITIONAL: `norm_multiplier_le` assumes `hB : ∀ y ∈ Icc (0 : Fin 3 → ℝ) 1, ‖g y‖ ≤ B`, not stated in the claim. — **OPEN**

## Theorem 5 — Physical form of the $H^3$ rate

- `55cf13bac57c` AMBIGUOUS: Title “Physical form of the $H^3$ rate” shares almost no terms with the statement. — **OPEN**
- `42847c4d31e2` CONDITIONAL: `hasSum_rate_three` assumes `hv : IsPeriodicSmoothInitialData v`, not stated in the claim. — **OPEN**
- `1681c23d8c28` NARROWER: `integral_rpow_weight_le` restricts b ≥ 16; the claim states no such restriction. — **OPEN**
- `926d1a78ebe7` CONDITIONAL: `enn_trilinear` assumes `hE : (∑' k, ENNReal.ofReal (jsq k) * alph a k ^ 2) ≠ ⊤`, not stated in the claim. — **OPEN**
- `6a18bf08c3b9` CONDITIONAL: `enn_trilinear` assumes `hX : (∑' k, ENNReal.ofReal (jsq k ^ 2) * alph a k ^ 2) ≠ ⊤`, not stated in the claim. — **OPEN**

## Theorem 6 — Kato--Ponce toolkit, $s=3$; \file{KatoPonce.lean}

- `96c8a792a778` AMBIGUOUS: Title “Kato--Ponce toolkit, $s=3$; \file{KatoPonce.lean}” shares almost no terms with the statement. — **OPEN**
- `5b0ddbffef18` CONDITIONAL: `lower_term_bound` assumes `hv : IsPeriodicSmoothInitialData v`, not stated in the claim. — **OPEN**
- `8025e4c49ace` CONDITIONAL: `lower_term_bound` assumes `hL : L.length ≤ 3`, not stated in the claim. — **OPEN**
- `2e5188d562b6` CONDITIONAL: `lower_term_bound` assumes `hp : p.1.length + p.2.length = L.length`, not stated in the claim. — **OPEN**

## Theorem 7 — Continuation alternative

- `c71cdcffbcfe` NARROWER: `periodicBKMCriterion_of_hsControl` uses s ≥ 3 where the claim says s ≥ 6 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `c80bd919f97f` NARROWER: `periodicHsBlowupAlternative` uses s ≥ 3 where the claim says s ≥ 6 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `ea2c7cb8b9ea` NARROWER: `periodicGalerkinLimit_of_nonneg` uses s ≥ 3 where the claim says s ≥ 6 (could be an indexing shift; direction not decidable syntactically). — **OPEN**

## Proposition 8

- `4dcf2a7cbf9a` NARROWER: `periodicBKMHsControl_of_fourier_lowFreq` restricts s ≥ 3; the claim states no such restriction. — **OPEN**
- `c4522c828405` CONDITIONAL: `periodicBKMHsControl_of_fourier_lowFreq` assumes `hE : ∀ ν, PeriodicFourierHsEnergyIdentity ν s`, not stated in the claim. — **OPEN**
- `f6a7ef91edf3` NARROWER: `periodicBKMHsControl_of_commutator_lowFreq` restricts s ≥ 3; the claim states no such restriction. — **OPEN**

## Theorem 9 — Unconditional corollaries, \file{BKMFinal.lean}

- `ed241820404d` AMBIGUOUS: Title “Unconditional corollaries, \file{BKMFinal.lean}” shares almost no terms with the statement. — **OPEN**

## Proposition 10 — Statement (B), conditional

- `ea86e5089690` NARROWER: `clay_B_exact_of_hsControl` uses s ≥ 3 where the claim says s ≥ 6 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `e837ab05b37f` NARROWER: `clay_B_exact_of_bounds` uses s ≥ 3 where the claim says s ≥ 6 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `b76a34aff74b` CONDITIONAL: `clay_B_exact_of_bounds` assumes `htame : PeriodicTameHsBound s`, not stated in the claim. — **OPEN**
- `14460eff97bc` CONDITIONAL: `clay_B_exact_of_bounds` assumes `hlog : PeriodicLogSobolevBKMBound s`, not stated in the claim. — **OPEN**

## Realignment notes

- Theorem 1: answer `1863a59314d2` — Paper claim Theorem 1 (theorem-1) states: “\lean{periodicLocalExistence_of_nonneg}\coined: for $\nu\ge0$, \lean{PeriodicLocalExistence}~$\nu$ holds (Galerkin method at $s=3$).”. Lean theorem `not_periodicStrainLinfBound_of_static` assumes `hmax : PeriodicMaximalSolution ν`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 1: answer `51448a5b231a` — Paper claim Theorem 1 (theorem-1) states: “\lean{periodicLocalExistence_of_nonneg}\coined: for $\nu\ge0$, \lean{PeriodicLocalExistence}~$\nu$ holds (Galerkin method at $s=3$).”. Lean theorem `not_periodicStrainLinfBound_of_static` assumes `hstat : ¬ StrainLinfFamily.StaticStrainLinfBound`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2: answer `7bd64c706f02` — Paper claim Theorem 2 (theorem-2) states: “\lean{periodicEnergyDifferenceEstimate}\coined: for $\nu\ge0$ and two classical solutions $u,v$ with equal data, \[ E(t)=\int_{[0,1]^3}\abs{u-v}^2\dd x \quad\text{satisfies}\quad E'(t)\le 2C\,E(t). \…”. Lean theorem `integrability_of_smallH1` assumes `hR : PeriodicEnstrophyRiccati ν α β`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2: answer `c8058c1d4ec0` — Paper claim Theorem 2 (theorem-2) states: “\lean{periodicEnergyDifferenceEstimate}\coined: for $\nu\ge0$ and two classical solutions $u,v$ with equal data, \[ E(t)=\int_{[0,1]^3}\abs{u-v}^2\dd x \quad\text{satisfies}\quad E'(t)\le 2C\,E(t). \…”. Lean theorem `integrability_of_smallH1` assumes `hL : PeriodicH1BlowupCriterion ν`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2: answer `1e9942f73e2e` — Paper claim Theorem 2 (theorem-2) states: “\lean{periodicEnergyDifferenceEstimate}\coined: for $\nu\ge0$ and two classical solutions $u,v$ with equal data, \[ E(t)=\int_{[0,1]^3}\abs{u-v}^2\dd x \quad\text{satisfies}\quad E'(t)\le 2C\,E(t). \…”. Lean theorem `integrability_of_smallH1` assumes `hsmall : β * h1Sq u₀ ^ 2 < α`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 4: answer `82a054ead188` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Its title is “Parseval on the unit cube”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 4: answer `0765d86470cf` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Lean theorem `hasSum_prod_cubeCoeff` assumes `hfp : ∀ y (n : Fin 3 → ℤ), f (y + fun j => (n j : ℝ)) = f y`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 4: answer `9b09accb4bc1` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Lean theorem `hasSum_prod_cubeCoeff` assumes `hgp : ∀ y (n : Fin 3 → ℤ), g (y + fun j => (n j : ℝ)) = g y`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 4: answer `eac38c432976` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Lean lemma `hasSum_re_cubeCoeff` assumes `hφ : PerR φ`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 4: answer `a29ebc7fbdf3` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Lean lemma `hasSum_re_cubeCoeff` assumes `hψ : PerR ψ`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 4: answer `37956977b2ec` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Lean theorem `norm_multiplier_le` assumes `hB : ∀ y ∈ Icc (0 : Fin 3 → ℝ) 1, ‖g y‖ ≤ B`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 5: answer `55cf13bac57c` — Paper claim Theorem 5 (theorem-5) states: “\lean{hasSum_rate_three}\coined: the Fourier-side $H^3$ nonlinear rate is summable and equals \[ -2\sum_i\int \Bigl(1-\frac{\Delta}{4\pi^2}\Bigr)^{3} v_i\,\bigl((v\cdot\nabla)v\bigr)_i\dd x . \]”. Its title is “Physical form of the $H^3$ rate”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 5: answer `42847c4d31e2` — Paper claim Theorem 5 (theorem-5) states: “\lean{hasSum_rate_three}\coined: the Fourier-side $H^3$ nonlinear rate is summable and equals \[ -2\sum_i\int \Bigl(1-\frac{\Delta}{4\pi^2}\Bigr)^{3} v_i\,\bigl((v\cdot\nabla)v\bigr)_i\dd x . \]”. Lean theorem `hasSum_rate_three` assumes `hv : IsPeriodicSmoothInitialData v`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 5: answer `1681c23d8c28` — Paper claim Theorem 5 (theorem-5) states: “\lean{hasSum_rate_three}\coined: the Fourier-side $H^3$ nonlinear rate is summable and equals \[ -2\sum_i\int \Bigl(1-\frac{\Delta}{4\pi^2}\Bigr)^{3} v_i\,\bigl((v\cdot\nabla)v\bigr)_i\dd x . \]”. Lean theorem `integral_rpow_weight_le` assumes `16 ≤ b` (restricting b ≥ 16), which the claim does not state. Is the restricted domain intentional?
- Theorem 5: answer `926d1a78ebe7` — Paper claim Theorem 5 (theorem-5) states: “\lean{hasSum_rate_three}\coined: the Fourier-side $H^3$ nonlinear rate is summable and equals \[ -2\sum_i\int \Bigl(1-\frac{\Delta}{4\pi^2}\Bigr)^{3} v_i\,\bigl((v\cdot\nabla)v\bigr)_i\dd x . \]”. Lean theorem `enn_trilinear` assumes `hE : (∑' k, ENNReal.ofReal (jsq k) * alph a k ^ 2) ≠ ⊤`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 5: answer `6a18bf08c3b9` — Paper claim Theorem 5 (theorem-5) states: “\lean{hasSum_rate_three}\coined: the Fourier-side $H^3$ nonlinear rate is summable and equals \[ -2\sum_i\int \Bigl(1-\frac{\Delta}{4\pi^2}\Bigr)^{3} v_i\,\bigl((v\cdot\nabla)v\bigr)_i\dd x . \]”. Lean theorem `enn_trilinear` assumes `hX : (∑' k, ENNReal.ofReal (jsq k ^ 2) * alph a k ^ 2) ≠ ⊤`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `96c8a792a778` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Its title is “Kato--Ponce toolkit, $s=3$; \file{KatoPonce.lean}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 6: answer `5b0ddbffef18` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `lower_term_bound` assumes `hv : IsPeriodicSmoothInitialData v`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `8025e4c49ace` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `lower_term_bound` assumes `hL : L.length ≤ 3`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `2e5188d562b6` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `lower_term_bound` assumes `hp : p.1.length + p.2.length = L.length`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 7: answer `c71cdcffbcfe` — Paper claim Theorem 7 (theorem-7) states: “\lean{periodicBKMCriterion_of_hsControl}\coined: for $\nu\ge0$, $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ implies \lean{PeriodicBKMCriterion}~$\nu$ (the $H^s$ blow-up alternative is proved).”. Lean theorem `periodicBKMCriterion_of_hsControl` assumes `5 / 2 < s` (s ≥ 3), but the claim says s ≥ 6. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 7: answer `c80bd919f97f` — Paper claim Theorem 7 (theorem-7) states: “\lean{periodicBKMCriterion_of_hsControl}\coined: for $\nu\ge0$, $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ implies \lean{PeriodicBKMCriterion}~$\nu$ (the $H^s$ blow-up alternative is proved).”. Lean theorem `periodicHsBlowupAlternative` assumes `5 / 2 < s` (s ≥ 3), but the claim says s ≥ 6. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 7: answer `ea2c7cb8b9ea` — Paper claim Theorem 7 (theorem-7) states: “\lean{periodicBKMCriterion_of_hsControl}\coined: for $\nu\ge0$, $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ implies \lean{PeriodicBKMCriterion}~$\nu$ (the $H^s$ blow-up alternative is proved).”. Lean theorem `periodicGalerkinLimit_of_nonneg` assumes `5 / 2 < s` (s ≥ 3), but the claim says s ≥ 6. Is this an intentional indexing convention or a genuine change of domain?
- Proposition 8: answer `4dcf2a7cbf9a` — Paper claim Proposition 8 (proposition-8) states: “\lean{periodicFourierCommutatorBound_of_physical}\coined: \lean{PeriodicPhysicalCommutatorBound}~$C$ $\Rightarrow$ \lean{PeriodicFourierCommutatorBound}~$3$~$C$. \lean{periodicBKMHsControl_of_physica…”. Lean theorem `periodicBKMHsControl_of_fourier_lowFreq` assumes `5 / 2 < s` (restricting s ≥ 3), which the claim does not state. Is the restricted domain intentional?
- Proposition 8: answer `c4522c828405` — Paper claim Proposition 8 (proposition-8) states: “\lean{periodicFourierCommutatorBound_of_physical}\coined: \lean{PeriodicPhysicalCommutatorBound}~$C$ $\Rightarrow$ \lean{PeriodicFourierCommutatorBound}~$3$~$C$. \lean{periodicBKMHsControl_of_physica…”. Lean theorem `periodicBKMHsControl_of_fourier_lowFreq` assumes `hE : ∀ ν, PeriodicFourierHsEnergyIdentity ν s`, which the claim does not state. Is this extra hypothesis intentional?
- Proposition 8: answer `f6a7ef91edf3` — Paper claim Proposition 8 (proposition-8) states: “\lean{periodicFourierCommutatorBound_of_physical}\coined: \lean{PeriodicPhysicalCommutatorBound}~$C$ $\Rightarrow$ \lean{PeriodicFourierCommutatorBound}~$3$~$C$. \lean{periodicBKMHsControl_of_physica…”. Lean theorem `periodicBKMHsControl_of_commutator_lowFreq` assumes `5 / 2 < s` (restricting s ≥ 3), which the claim does not state. Is the restricted domain intentional?
- Theorem 9: answer `ed241820404d` — Paper claim Theorem 9 (theorem-9) states: “\lean{periodicBKMHsControl_three}\coined: \lean{PeriodicBKMHsControl}~$\nu$~3 for every $\nu$, with no hypotheses. \lean{periodicBKMCriterion}\coined: \lean{PeriodicBKMCriterion}~$\nu$ for every $\nu…”. Its title is “Unconditional corollaries, \file{BKMFinal.lean}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Proposition 10: answer `ea86e5089690` — Paper claim Proposition 10 (proposition-10) states: “\lean{clay_B_exact_of_hsControl}\coined: for $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ and \lean{PeriodicBKMIntegrability}~$\nu$ give \lean{Clay_B_exact}~$\nu$. Also \lean{clay_B_exact_of_correct…”. Lean theorem `clay_B_exact_of_hsControl` assumes `5 / 2 < s` (s ≥ 3), but the claim says s ≥ 6. Is this an intentional indexing convention or a genuine change of domain?
- Proposition 10: answer `e837ab05b37f` — Paper claim Proposition 10 (proposition-10) states: “\lean{clay_B_exact_of_hsControl}\coined: for $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ and \lean{PeriodicBKMIntegrability}~$\nu$ give \lean{Clay_B_exact}~$\nu$. Also \lean{clay_B_exact_of_correct…”. Lean theorem `clay_B_exact_of_bounds` assumes `5 / 2 < s` (s ≥ 3), but the claim says s ≥ 6. Is this an intentional indexing convention or a genuine change of domain?
- Proposition 10: answer `b76a34aff74b` — Paper claim Proposition 10 (proposition-10) states: “\lean{clay_B_exact_of_hsControl}\coined: for $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ and \lean{PeriodicBKMIntegrability}~$\nu$ give \lean{Clay_B_exact}~$\nu$. Also \lean{clay_B_exact_of_correct…”. Lean theorem `clay_B_exact_of_bounds` assumes `htame : PeriodicTameHsBound s`, which the claim does not state. Is this extra hypothesis intentional?
- Proposition 10: answer `14460eff97bc` — Paper claim Proposition 10 (proposition-10) states: “\lean{clay_B_exact_of_hsControl}\coined: for $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ and \lean{PeriodicBKMIntegrability}~$\nu$ give \lean{Clay_B_exact}~$\nu$. Also \lean{clay_B_exact_of_correct…”. Lean theorem `clay_B_exact_of_bounds` assumes `hlog : PeriodicLogSobolevBKMBound s`, which the claim does not state. Is this extra hypothesis intentional?
- Lean `periodicNonlinearEnergyCancellation` cites “Lemma 1.3” in its docstring but is not matched to any anchor claim (informational).
