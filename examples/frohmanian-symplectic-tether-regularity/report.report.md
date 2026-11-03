# PipelineHalt report: \textbf{The Frohmanian Symplectic Tether: Canonical Uniqueness on Coadjoint Orbits of $\mathrm{SDiff

Status: **HALT** · overall drift **0.688** · 5 claims · 723 Lean declarations scanned · 8 open question(s)

Mapping file: `../../PipelineHalt/examples/frohmanian-symplectic-tether-regularity/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 1.1 | `frohmanian_metriplectic_system_canonical_uniqueness_and_global_regularity_product_theorem` | 0.000 | 0 | 1 |
| Definition 2.1 | — | 1.000 | 1 | 1 |
| Theorem 2.2 | `tetherPointwiseDensity_nonpos`, `tetherKernel_diagonal_nonpos`, `tetherPointwiseDensity_strict_neg_of_noncasimir`, `tetherKernel_strict_neg_of_orthogonal_component`, `tetherKernel_nondegenerate_on_casimir_defect` | 1.000 | 2 | 1 |
| Theorem 3.1 | `uniqueness_of_minimal_tether`, `uniqueness_of_kernel_density` | 0.938 | 4 | 0 |
| Theorem 4.1 | `youngs_absorption_elimination` | 0.500 | 1 | 1 |

## Theorem 1.1 — Master Product Theorem: \texttt{frohmanian\_metriplectic\_system\_canonical\_uniqueness\_and\_global\_regularity\_product\_theorem}

- `e7f5ad81c345` AMBIGUOUS: Title “Master Product Theorem: \texttt{frohmanian\_metriplectic\_system\_canonical\_uniqueness\_and\_global\_regularity\_product\_theorem}” shares almost no terms with the statement. — answered (intentional): “harmless wording: the title is the Lean name frohmanian_metriplectic_system_canonical_uniqueness_and_global_regularity_product_theorem, which exists and is the mapped declaration.”

## Definition 2.1 — Frohmanian Symplectic Tether Bracket and Kernel

- `4328d2dc605b` SILENT: No Lean declaration matches this claim. Closest candidate: `kksSymplecticForm` (score 0.17, below threshold 0.2). — **OPEN**
- `8f22c96a8cb9` AMBIGUOUS: Title “Frohmanian Symplectic Tether Bracket and Kernel” shares almost no terms with the statement. — answered (intentional): “harmless wording: a definition's title ('Bracket and Kernel') naming the objects it defines (κ(ν) and K_FT); no assertion is made by the title.”

## Theorem 2.2 — Unconditional Casimir Non-Degeneracy of $\mathcal{K}_{\mathrm{FT}}$

- `d5dc6333da80` SILENT: Anchor maps this claim to `tether_preserves_casimirs`, but no such declaration exists. — **OPEN**
- `77453ba2c6fe` CONDITIONAL: `tetherPointwiseDensity_strict_neg_of_noncasimir` assumes `hω : ω.val x ≠ 0`, not stated in the claim. — answered (intentional): “stated in the claim: the paper says 'Whenever ω(x) ≠ 0 …' (theorem-2.2, third bullet); hω : ω.val x ≠ 0 is that hypothesis.”
- `9b109eb0f9d5` CONDITIONAL: `tetherPointwiseDensity_strict_neg_of_noncasimir` assumes `hPi : Pi_u (velocity_from_vorticity ω) (FunctionalDerivative F ω) x ≠ 0`, not stated in the claim. — **OPEN**

## Theorem 3.1 — Canonical Uniqueness: \texttt{uniqueness\_of\_minimal\_tether} and \texttt{uniqueness\_of\_kernel\_density}

- `11f927ba5751` CONDITIONAL: `uniqueness_of_minimal_tether` assumes `hC1 : InvariantUnderCoadjointAction B`, not stated in the claim. — **OPEN**
- `a62c3f5904be` CONDITIONAL: `uniqueness_of_minimal_tether` assumes `hC2 : DegenerateWRTKineticEnergy B`, not stated in the claim. — **OPEN**
- `de917572943a` CONDITIONAL: `uniqueness_of_minimal_tether` assumes `hC3 : ProducesControllableNegativeFeedback kappa B`, not stated in the claim. — **OPEN**
- `9a0b0e86b9a5` CONDITIONAL: `uniqueness_of_minimal_tether` assumes `h_polarB : Polarizes B`, not stated in the claim. — **OPEN**

## Theorem 4.1 — Quartic $4 = 4$ Young Absorption, \texttt{youngs\_absorption\_elimination}

- `51164beb1353` AMBIGUOUS: Title “Quartic $4 = 4$ Young Absorption, \texttt{youngs\_absorption\_elimination}” shares almost no terms with the statement. — answered (intentional): “harmless wording: the title cites the Lean name youngs_absorption_elimination (exists, AnalyticPipeline.lean:69); '4 = 4' names the quartic exponent balance, not a separate assertion.”
- `cc7f26795e36` CONDITIONAL: `youngs_absorption_elimination` assumes `h_young : 4 * CalderonZygmundConstant3D * M * I₄ ≤ (kappa / 4) * I₆ + C_abs * (M ^ 3 * phi_norm ^ ((3 : ℝ) / 2))`, not stated in the claim. — **OPEN**

## Realignment notes

- Definition 2.1: answer `4328d2dc605b` — Paper claim Definition 2.1 (eq:kappa-def) states: “For $\nu > 0$ and $C_{\mathrm{CZ}} = 3/2$, define the canonical coupling constant and symmetric bilinear kernel: \begin{align} \kappa(\nu) &= \frac{27 C_{\mathrm{CZ}}^4}{4 \nu^3} = \frac{2187}{64 \nu…”. No Lean declaration matching it was found among 192 candidates. Closest candidate: `kksSymplecticForm` (score 0.17, below threshold 0.2). Is this claim intentionally not formalized, or which declaration should it map to?
- Theorem 2.2: answer `d5dc6333da80` — Paper claim Theorem 2.2 (theorem-2.2) states: “Let $\kappa > 0$, $\omega \in \mathfrak{g}^*$, and $v : \mathbb{T}^3 \to \mathbb{R}^3$. Define the pointwise tether density $d_{\mathrm{FT}}(\kappa, \omega, v, x) = -\kappa \|\omega(x)\|^2 \|P_{\delt…”. The anchor maps it to Lean declaration `tether_preserves_casimirs`, which was not found in the scanned files. Was it renamed or removed, or is the claim intentionally unformalized?
- Theorem 2.2: difference `77453ba2c6fe` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem 2.2: answer `9b109eb0f9d5` — Paper claim Theorem 2.2 (theorem-2.2) states: “Let $\kappa > 0$, $\omega \in \mathfrak{g}^*$, and $v : \mathbb{T}^3 \to \mathbb{R}^3$. Define the pointwise tether density $d_{\mathrm{FT}}(\kappa, \omega, v, x) = -\kappa \|\omega(x)\|^2 \|P_{\delt…”. Lean theorem `tetherPointwiseDensity_strict_neg_of_noncasimir` assumes `hPi : Pi_u (velocity_from_vorticity ω) (FunctionalDerivative F ω) x ≠ 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.1: answer `11f927ba5751` — Paper claim Theorem 3.1 (theorem-3.1) states: “Let $\mathcal{K}(v, w; \omega) = \int_{\mathbb{T}^3} k(\omega(x), v(x), w(x))\,dx$ be any local bilinear symmetric form on $\mathfrak{g}^*$ whose pointwise density $k(\omega, v, w)$ satisfies C1 (Cas…”. Lean theorem `uniqueness_of_minimal_tether` assumes `hC1 : InvariantUnderCoadjointAction B`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.1: answer `a62c3f5904be` — Paper claim Theorem 3.1 (theorem-3.1) states: “Let $\mathcal{K}(v, w; \omega) = \int_{\mathbb{T}^3} k(\omega(x), v(x), w(x))\,dx$ be any local bilinear symmetric form on $\mathfrak{g}^*$ whose pointwise density $k(\omega, v, w)$ satisfies C1 (Cas…”. Lean theorem `uniqueness_of_minimal_tether` assumes `hC2 : DegenerateWRTKineticEnergy B`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.1: answer `de917572943a` — Paper claim Theorem 3.1 (theorem-3.1) states: “Let $\mathcal{K}(v, w; \omega) = \int_{\mathbb{T}^3} k(\omega(x), v(x), w(x))\,dx$ be any local bilinear symmetric form on $\mathfrak{g}^*$ whose pointwise density $k(\omega, v, w)$ satisfies C1 (Cas…”. Lean theorem `uniqueness_of_minimal_tether` assumes `hC3 : ProducesControllableNegativeFeedback kappa B`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.1: answer `9a0b0e86b9a5` — Paper claim Theorem 3.1 (theorem-3.1) states: “Let $\mathcal{K}(v, w; \omega) = \int_{\mathbb{T}^3} k(\omega(x), v(x), w(x))\,dx$ be any local bilinear symmetric form on $\mathfrak{g}^*$ whose pointwise density $k(\omega, v, w)$ satisfies C1 (Cas…”. Lean theorem `uniqueness_of_minimal_tether` assumes `h_polarB : Polarizes B`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 4.1: answer `cc7f26795e36` — Paper claim Theorem 4.1 (eq:young-4-eq-4) states: “For every $\nu > 0$, $C_{\mathrm{CZ}} > 0$, and $x = |\omega| \ge 0$, with $\kappa = \frac{27 C_{\mathrm{CZ}}^4}{4\nu^3}$, \begin{equation} C_{\mathrm{CZ}} x^3 - \frac{\nu}{3} x^2 - \frac{\kappa}{4} …”. Lean theorem `youngs_absorption_elimination` assumes `h_young : 4 * CalderonZygmundConstant3D * M * I₄ ≤ (kappa / 4) * I₆ + C_abs * (M ^ 3 * phi_norm ^ ((3 : ℝ) / 2))`, which the claim does not state. Is this extra hypothesis intentional?
- Lean `tetherKernel_degenerates_on_kinetic_energy` cites “Lemma 2.3” in its docstring but is not matched to any anchor claim (informational).
