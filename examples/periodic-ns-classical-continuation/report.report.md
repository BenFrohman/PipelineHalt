# PipelineHalt report

Status: **HALT** · overall drift **0.505** · 10 claims · 1180 Lean declarations scanned · 26 open question(s)

Mapping file: `../../PipelineHalt/examples/periodic-ns-classical-continuation/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 1 | `periodicLocalExistence_of_nonneg` | 0.000 | 0 | 0 |
| Theorem 2 | `periodicEnergyDifferenceEstimate`, `eq_zero_of_deriv_le_mul`, `periodicVelocityUniqueness_of_energy` | 0.875 | 3 | 0 |
| Theorem 3 | `periodicFourierCoeffODE`, `periodicFourierCoeffDecay`, `periodicFourierHsEnergyIdentity`, `PeriodicFourierCoeffODE`, `PeriodicFourierCoeffDecay`, `PeriodicFourierHsEnergyIdentity`, `periodicFourierHsEnergyIdentity_of_coeff` | 0.000 | 0 | 0 |
| Theorem 4 | `hasSum_prod_cubeCoeff`, `torusLift` | 0.825 | 3 | 0 |
| Theorem 5 | `hasSum_rate_three` | 0.650 | 2 | 0 |
| Theorem 6 | `cellI_ibp`, `cellI_ibp'`, `DL_mul`, `gagliardoNirenberg_cell`, `cellI_sq_mul_abs_le`, `lower_term_bound`, `physQ`, `top_term_zero` | 1.000 | 14 | 0 |
| Theorem 7 | `periodicBKMCriterion_of_hsControl`, `PeriodicBKMHsControl` | 0.600 | 1 | 0 |
| Proposition 8 | `periodicFourierCommutatorBound_of_physical`, `PeriodicPhysicalCommutatorBound`, `PeriodicFourierCommutatorBound`, `periodicBKMHsControl_of_physical_lowFreq`, `PeriodicLowFreqVorticityBound`, `PeriodicBKMHsControl`, `periodicBKMHsControl_three_of_lowFreq` | 0.000 | 0 | 0 |
| Theorem 9 | `periodicBKMHsControl_three`, `PeriodicBKMHsControl`, `periodicBKMCriterion` | 0.300 | 1 | 0 |
| Proposition 10 | `clay_B_exact_of_hsControl`, `PeriodicBKMHsControl`, `clay_B_exact_of_corrected_route'`, `clay_B_exact_of_bkm`, `clay_B_exact_of_integrability` | 0.800 | 2 | 0 |

## Theorem 2 — Energy difference / uniqueness

- `b75fedb00af9` CONDITIONAL: `eq_zero_of_deriv_le_mul` assumes `hc : ContinuousOn E (Icc 0 T)`, not stated in the claim. — **OPEN**
- `9eef8de7475d` CONDITIONAL: `eq_zero_of_deriv_le_mul` assumes `hd : ∀ t ∈ Ico (0 : ℝ) T, HasDerivWithinAt E (E' t) (Ici t) t`, not stated in the claim. — **OPEN**
- `a26051a8dbf8` CONDITIONAL: `eq_zero_of_deriv_le_mul` assumes `hb : ∀ t ∈ Ico (0 : ℝ) T, E' t ≤ L * E t`, not stated in the claim. — **OPEN**

## Theorem 4 — Parseval on the unit cube

- `82a054ead188` AMBIGUOUS: Title “Parseval on the unit cube” shares almost no terms with the statement. — **OPEN**
- `0765d86470cf` CONDITIONAL: `hasSum_prod_cubeCoeff` assumes `hfp : ∀ y (n : Fin 3 → ℤ), f (y + fun j => (n j : ℝ)) = f y`, not stated in the claim. — **OPEN**
- `9b09accb4bc1` CONDITIONAL: `hasSum_prod_cubeCoeff` assumes `hgp : ∀ y (n : Fin 3 → ℤ), g (y + fun j => (n j : ℝ)) = g y`, not stated in the claim. — **OPEN**

## Theorem 5 — Physical form of the $H^3$ rate

- `55cf13bac57c` AMBIGUOUS: Title “Physical form of the $H^3$ rate” shares almost no terms with the statement. — **OPEN**
- `42847c4d31e2` CONDITIONAL: `hasSum_rate_three` assumes `hv : IsPeriodicSmoothInitialData v`, not stated in the claim. — **OPEN**

## Theorem 6 — Kato--Ponce toolkit, $s=3$; \file{KatoPonce.lean}

- `96c8a792a778` AMBIGUOUS: Title “Kato--Ponce toolkit, $s=3$; \file{KatoPonce.lean}” shares almost no terms with the statement. — **OPEN**
- `e39827538721` CONDITIONAL: `cellI_ibp` assumes `h : PerR φ`, not stated in the claim. — **OPEN**
- `55deea7148e4` CONDITIONAL: `cellI_ibp` assumes `h' : PerR ψ`, not stated in the claim. — **OPEN**
- `0328a621fd36` CONDITIONAL: `cellI_ibp'` assumes `h : PerR φ`, not stated in the claim. — **OPEN**
- `bdd1897f0b50` CONDITIONAL: `cellI_ibp'` assumes `h' : PerR ψ`, not stated in the claim. — **OPEN**
- `587dc559b9ad` CONDITIONAL: `DL_mul` assumes `hf : PerR f`, not stated in the claim. — **OPEN**
- `71c2468601bd` CONDITIONAL: `DL_mul` assumes `hg : PerR g`, not stated in the claim. — **OPEN**
- `a5407db2d716` CONDITIONAL: `gagliardoNirenberg_cell` assumes `hg : PerR g`, not stated in the claim. — **OPEN**
- `0c13eb054673` CONDITIONAL: `cellI_sq_mul_abs_le` assumes `hg : PerR g`, not stated in the claim. — **OPEN**
- `0924c12998b0` CONDITIONAL: `cellI_sq_mul_abs_le` assumes `hR : PerR R`, not stated in the claim. — **OPEN**
- `5b0ddbffef18` CONDITIONAL: `lower_term_bound` assumes `hv : IsPeriodicSmoothInitialData v`, not stated in the claim. — **OPEN**
- `8025e4c49ace` CONDITIONAL: `lower_term_bound` assumes `hL : L.length ≤ 3`, not stated in the claim. — **OPEN**
- `2e5188d562b6` CONDITIONAL: `lower_term_bound` assumes `hp : p.1.length + p.2.length = L.length`, not stated in the claim. — **OPEN**
- `60dba2a5060d` CONDITIONAL: `top_term_zero` assumes `hv : IsPeriodicSmoothInitialData v`, not stated in the claim. — **OPEN**

## Theorem 7 — Continuation alternative

- `c71cdcffbcfe` NARROWER: `periodicBKMCriterion_of_hsControl` uses s ≥ 3 where the claim says s ≥ 6 (could be an indexing shift; direction not decidable syntactically). — **OPEN**

## Theorem 9 — Unconditional corollaries, \file{BKMFinal.lean}

- `ed241820404d` AMBIGUOUS: Title “Unconditional corollaries, \file{BKMFinal.lean}” shares almost no terms with the statement. — **OPEN**

## Proposition 10 — Statement (B), conditional

- `ea86e5089690` NARROWER: `clay_B_exact_of_hsControl` uses s ≥ 3 where the claim says s ≥ 6 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `63b1dbdbcbcc` CONDITIONAL: `clay_B_exact_of_corrected_route'` assumes `hloc : PeriodicLocalExistence ν`, not stated in the claim. — **OPEN**

## Realignment notes

- Theorem 2: answer `b75fedb00af9` — Paper claim Theorem 2 (theorem-2) states: “\lean{periodicEnergyDifferenceEstimate}\coined: for $\nu\ge0$ and two classical solutions $u,v$ with equal data, \[ E(t)=\int_{[0,1]^3}\abs{u-v}^2\dd x \quad\text{satisfies}\quad E'(t)\le 2C\,E(t). \…”. Lean theorem `eq_zero_of_deriv_le_mul` assumes `hc : ContinuousOn E (Icc 0 T)`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2: answer `9eef8de7475d` — Paper claim Theorem 2 (theorem-2) states: “\lean{periodicEnergyDifferenceEstimate}\coined: for $\nu\ge0$ and two classical solutions $u,v$ with equal data, \[ E(t)=\int_{[0,1]^3}\abs{u-v}^2\dd x \quad\text{satisfies}\quad E'(t)\le 2C\,E(t). \…”. Lean theorem `eq_zero_of_deriv_le_mul` assumes `hd : ∀ t ∈ Ico (0 : ℝ) T, HasDerivWithinAt E (E' t) (Ici t) t`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2: answer `a26051a8dbf8` — Paper claim Theorem 2 (theorem-2) states: “\lean{periodicEnergyDifferenceEstimate}\coined: for $\nu\ge0$ and two classical solutions $u,v$ with equal data, \[ E(t)=\int_{[0,1]^3}\abs{u-v}^2\dd x \quad\text{satisfies}\quad E'(t)\le 2C\,E(t). \…”. Lean theorem `eq_zero_of_deriv_le_mul` assumes `hb : ∀ t ∈ Ico (0 : ℝ) T, E' t ≤ L * E t`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 4: answer `82a054ead188` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Its title is “Parseval on the unit cube”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 4: answer `0765d86470cf` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Lean theorem `hasSum_prod_cubeCoeff` assumes `hfp : ∀ y (n : Fin 3 → ℤ), f (y + fun j => (n j : ℝ)) = f y`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 4: answer `9b09accb4bc1` — Paper claim Theorem 4 (theorem-4) states: “\lean{hasSum_prod_cubeCoeff}\coined{} (\file{Parseval.lean}): for continuous periodic $f,g$, \[ \sum_{k\in\Z^3}\overline{\hat f_k}\,\hat g_k = \int_{[0,1]^3}\bar f\,g\dd x, \] via \lean{torusLift}\co…”. Lean theorem `hasSum_prod_cubeCoeff` assumes `hgp : ∀ y (n : Fin 3 → ℤ), g (y + fun j => (n j : ℝ)) = g y`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 5: answer `55cf13bac57c` — Paper claim Theorem 5 (theorem-5) states: “\lean{hasSum_rate_three}\coined: the Fourier-side $H^3$ nonlinear rate is summable and equals \[ -2\sum_i\int \Bigl(1-\frac{\Delta}{4\pi^2}\Bigr)^{3} v_i\,\bigl((v\cdot\nabla)v\bigr)_i\dd x . \]”. Its title is “Physical form of the $H^3$ rate”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 5: answer `42847c4d31e2` — Paper claim Theorem 5 (theorem-5) states: “\lean{hasSum_rate_three}\coined: the Fourier-side $H^3$ nonlinear rate is summable and equals \[ -2\sum_i\int \Bigl(1-\frac{\Delta}{4\pi^2}\Bigr)^{3} v_i\,\bigl((v\cdot\nabla)v\bigr)_i\dd x . \]”. Lean theorem `hasSum_rate_three` assumes `hv : IsPeriodicSmoothInitialData v`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `96c8a792a778` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Its title is “Kato--Ponce toolkit, $s=3$; \file{KatoPonce.lean}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 6: answer `e39827538721` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean lemma `cellI_ibp` assumes `h : PerR φ`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `55deea7148e4` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean lemma `cellI_ibp` assumes `h' : PerR ψ`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `0328a621fd36` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean lemma `cellI_ibp'` assumes `h : PerR φ`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `bdd1897f0b50` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean lemma `cellI_ibp'` assumes `h' : PerR ψ`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `587dc559b9ad` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean lemma `DL_mul` assumes `hf : PerR f`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `71c2468601bd` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean lemma `DL_mul` assumes `hg : PerR g`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `a5407db2d716` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `gagliardoNirenberg_cell` assumes `hg : PerR g`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `0c13eb054673` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `cellI_sq_mul_abs_le` assumes `hg : PerR g`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `0924c12998b0` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `cellI_sq_mul_abs_le` assumes `hR : PerR R`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `5b0ddbffef18` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `lower_term_bound` assumes `hv : IsPeriodicSmoothInitialData v`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `8025e4c49ace` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `lower_term_bound` assumes `hL : L.length ≤ 3`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `2e5188d562b6` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `lower_term_bound` assumes `hp : p.1.length + p.2.length = L.length`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `60dba2a5060d` — Paper claim Theorem 6 (theorem-6) states: “Proved: unit-cell integration by parts \lean{cellI_ibp}\coined, \lean{cellI_ibp'}\coined; Leibniz rule \lean{DL_mul}\coined; Gagliardo--Nirenberg on the cell \lean{gagliardoNirenberg_cell}\coined{} a…”. Lean theorem `top_term_zero` assumes `hv : IsPeriodicSmoothInitialData v`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 7: answer `c71cdcffbcfe` — Paper claim Theorem 7 (theorem-7) states: “\lean{periodicBKMCriterion_of_hsControl}\coined: for $\nu\ge0$, $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ implies \lean{PeriodicBKMCriterion}~$\nu$ (the $H^s$ blow-up alternative is proved).”. Lean theorem `periodicBKMCriterion_of_hsControl` assumes `5 / 2 < s` (s ≥ 3), but the claim says s ≥ 6. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 9: answer `ed241820404d` — Paper claim Theorem 9 (theorem-9) states: “\lean{periodicBKMHsControl_three}\coined: \lean{PeriodicBKMHsControl}~$\nu$~3 for every $\nu$, with no hypotheses. \lean{periodicBKMCriterion}\coined: \lean{PeriodicBKMCriterion}~$\nu$ for every $\nu…”. Its title is “Unconditional corollaries, \file{BKMFinal.lean}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Proposition 10: answer `ea86e5089690` — Paper claim Proposition 10 (proposition-10) states: “\lean{clay_B_exact_of_hsControl}\coined: for $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ and \lean{PeriodicBKMIntegrability}~$\nu$ give \lean{Clay_B_exact}~$\nu$. Also \lean{clay_B_exact_of_correct…”. Lean theorem `clay_B_exact_of_hsControl` assumes `5 / 2 < s` (s ≥ 3), but the claim says s ≥ 6. Is this an intentional indexing convention or a genuine change of domain?
- Proposition 10: answer `63b1dbdbcbcc` — Paper claim Proposition 10 (proposition-10) states: “\lean{clay_B_exact_of_hsControl}\coined: for $s>5/2$, \lean{PeriodicBKMHsControl}~$\nu\ s$ and \lean{PeriodicBKMIntegrability}~$\nu$ give \lean{Clay_B_exact}~$\nu$. Also \lean{clay_B_exact_of_correct…”. Lean theorem `clay_B_exact_of_corrected_route'` assumes `hloc : PeriodicLocalExistence ν`, which the claim does not state. Is this extra hypothesis intentional?
- Lean `periodicNonlinearEnergyCancellation` cites “Lemma 1.3” in its docstring but is not matched to any anchor claim (informational).
