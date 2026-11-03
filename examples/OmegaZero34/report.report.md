# PipelineHalt report: The unique monodromy-invariant alternating form of type $(1,6)$\\
on a $(3,4,\infty)$ lattice representation,\\
and the restriction of a functorial symplectic structure

Status: **ALIGNED** · overall drift **0.000** · 11 claims · 173 Lean declarations scanned · 0 open question(s)

Mapping file: `../../PipelineHalt/examples/OmegaZero34/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Proposition 1 | `T1_det`, `T2_det`, `T0_det` | 0.000 | 0 | 0 |
| Proposition 2 | `T1_pow_three`, `T1_ne_one`, `T1_pow_two_ne_one`, `T2_pow_four`, `T2_ne_one`, `T2_pow_two_ne_one`, `T2_pow_three_ne_one` | 0.000 | 0 | 0 |
| Proposition 3 | `T0_mul_T1T2`, `T1T2_mul_T0`, `N_sq`, `N_ne_zero` | 0.000 | 0 | 0 |
| Theorem 4 | `T1_preserves_Ω0`, `T2_preserves_Ω0`, `uniqueness_over_Q`, `invariant_ofParams_eq_smul` | 0.000 | 0 | 5 |
| Lemma 5 | `T1_conj_ofParams` | 0.000 | 0 | 0 |
| Lemma 6 | `T2_conj_ofParams` | 0.000 | 0 | 0 |
| Proposition 7 | `invariant_params`, `invariant_params_iff` | 0.000 | 0 | 2 |
| Theorem 8 | `N_sp`, `im_N_eq_ker_N`, `vanishing_plane_isotropic` | 0.000 | 0 | 0 |
| Theorem 9 | `restriction_lemma`, `restriction_scalar_unique` | 0.000 | 0 | 0 |
| Corollary 10 | `generators_preserve_Ω0` | 0.000 | 0 | 0 |
| Corollary 11 | `N_sp`, `vanishing_plane_isotropic` | 0.000 | 0 | 0 |

## Theorem 4 — Existence and uniqueness

- `ef489ed7b249` CONDITIONAL: `uniqueness_over_Q` assumes `hsk : transpose Ψ = -Ψ`, not stated in the claim. — answered (intentional): “equivalent formulation: the paper's space is 'alternating forms on V_Q invariant under T1 and T2'; the hypotheses hsk (Ψᵀ = -Ψ), h1, h2 (TᵢᵀΨTᵢ = Ψ) are exactly membership in that space (ofParams is the general alternating 4×4 form, Form.lean/ForMathlib skewFour), and the conclusion Ψ = Ψ 0 3 • Ω0R is 'spanned by ω0' (Uniqueness.lean:106).”
- `07c6e57cedd3` CONDITIONAL: `uniqueness_over_Q` assumes `h1 : transpose T1R * Ψ * T1R = Ψ`, not stated in the claim. — answered (intentional): “equivalent formulation: the paper's space is 'alternating forms on V_Q invariant under T1 and T2'; the hypotheses hsk (Ψᵀ = -Ψ), h1, h2 (TᵢᵀΨTᵢ = Ψ) are exactly membership in that space (ofParams is the general alternating 4×4 form, Form.lean/ForMathlib skewFour), and the conclusion Ψ = Ψ 0 3 • Ω0R is 'spanned by ω0' (Uniqueness.lean:106).”
- `a13d06cce759` CONDITIONAL: `uniqueness_over_Q` assumes `h2 : transpose T2R * Ψ * T2R = Ψ`, not stated in the claim. — answered (intentional): “equivalent formulation: the paper's space is 'alternating forms on V_Q invariant under T1 and T2'; the hypotheses hsk (Ψᵀ = -Ψ), h1, h2 (TᵢᵀΨTᵢ = Ψ) are exactly membership in that space (ofParams is the general alternating 4×4 form, Form.lean/ForMathlib skewFour), and the conclusion Ψ = Ψ 0 3 • Ω0R is 'spanned by ω0' (Uniqueness.lean:106).”
- `78ffcf43fbdb` CONDITIONAL: `invariant_ofParams_eq_smul` assumes `h1 : transpose T1R * ofParams a b c d e f * T1R = ofParams a b c d e f`, not stated in the claim. — answered (intentional): “equivalent formulation: the paper's space is 'alternating forms on V_Q invariant under T1 and T2'; the hypotheses hsk (Ψᵀ = -Ψ), h1, h2 (TᵢᵀΨTᵢ = Ψ) are exactly membership in that space (ofParams is the general alternating 4×4 form, Form.lean/ForMathlib skewFour), and the conclusion Ψ = Ψ 0 3 • Ω0R is 'spanned by ω0' (Uniqueness.lean:106).”
- `5cd9419efa8a` CONDITIONAL: `invariant_ofParams_eq_smul` assumes `h2 : transpose T2R * ofParams a b c d e f * T2R = ofParams a b c d e f`, not stated in the claim. — answered (intentional): “equivalent formulation: the paper's space is 'alternating forms on V_Q invariant under T1 and T2'; the hypotheses hsk (Ψᵀ = -Ψ), h1, h2 (TᵢᵀΨTᵢ = Ψ) are exactly membership in that space (ofParams is the general alternating 4×4 form, Form.lean/ForMathlib skewFour), and the conclusion Ψ = Ψ 0 3 • Ω0R is 'spanned by ω0' (Uniqueness.lean:106).”

## Proposition 7

- `a99e94d97673` CONDITIONAL: `invariant_params` assumes `h1 : transpose T1R * ofParams a b c d e f * T1R = ofParams a b c d e f`, not stated in the claim. — answered (intentional): “equivalent formulation: 'the residual entries of TᵢᵀΩTᵢ - Ω vanish' is TᵢᵀΩTᵢ = Ω, i.e. h1/h2 (Uniqueness.lean:49); conclusion d = 6*c is c = d/6 over ℚ. (Only the forward direction of the paper's iff is this theorem; see NOTES.md.)”
- `b08f9da1ad04` CONDITIONAL: `invariant_params` assumes `h2 : transpose T2R * ofParams a b c d e f * T2R = ofParams a b c d e f`, not stated in the claim. — answered (intentional): “equivalent formulation: 'the residual entries of TᵢᵀΩTᵢ - Ω vanish' is TᵢᵀΩTᵢ = Ω, i.e. h1/h2 (Uniqueness.lean:49); conclusion d = 6*c is c = d/6 over ℚ. (Only the forward direction of the paper's iff is this theorem; see NOTES.md.)”

## Realignment notes

- Theorem 4: difference `ef489ed7b249` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem 4: difference `07c6e57cedd3` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem 4: difference `a13d06cce759` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem 4: difference `78ffcf43fbdb` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem 4: difference `5cd9419efa8a` is intentional per the author; consider stating it in the paper text so readers see it too.
- Proposition 7: difference `a99e94d97673` is intentional per the author; consider stating it in the paper text so readers see it too.
- Proposition 7: difference `b08f9da1ad04` is intentional per the author; consider stating it in the paper text so readers see it too.
