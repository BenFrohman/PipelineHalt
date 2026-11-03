# PipelineHalt report: Resolving a category error: DHL[3,2] yields H1 <= 6, not H1 = 2 (B. S. Frohman, 2026)

Status: **ALIGNED** · overall drift **0.000** · 9 claims · 35 Lean declarations scanned · 0 open question(s)

Mapping file: `../../PipelineHalt/examples/dhl32/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Definition 2.1 | `Admissible` | 0.000 | 0 | 0 |
| Definition 2.2 | `DHL`, `DHLfor` | 0.000 | 0 | 0 |
| Definition 2.3 | `H1Le` | 0.000 | 0 | 0 |
| Lemma 2.4 | `admissible_02`, `admissible_026`, `admissible_046` | 0.000 | 0 | 0 |
| Theorem 3.1 | `two_le_gap`, `gap_even`, `not_H1Le_one`, `H1Le_three_iff_two`, `H1Le_three_iff_twin` | 0.000 | 0 | 2 |
| Theorem 3.2 | `dhl32_H1Le_six` | 0.000 | 0 | 0 |
| Theorem 3.3 | `Ptoy_DHL32`, `Ptoy_no_twin`, `dhl32_not_implies_dhl22_combinatorially` | 0.000 | 0 | 1 |
| Hypothesis 3.5 | `ParityBarrier` | 0.000 | 0 | 0 |
| Theorem 3.6 | `parity_two_needs_three`, `admissible_three_diam_ge_six`, `min_diam_admissible_three` | 0.000 | 0 | 0 |

## Theorem 3.1

- `56d42291f91e` NARROWER: `two_le_gap` uses n ≥ 1 where the claim says n ≥ 2 (could be an indexing shift; direction not decidable syntactically). — answered (intentional): “equivalent, intentional: index shift only. Lean `p` is 0-indexed (DHL32/Basic.lean:9, p 0 = 2) while the paper is 1-indexed (DHL32_note.tex:48, p_1 = 2), so Lean n >= 1 is exactly paper n >= 2. (two_le_gap)”
- `cc5e051f3e37` NARROWER: `gap_even` uses n ≥ 1 where the claim says n ≥ 2 (could be an indexing shift; direction not decidable syntactically). — answered (intentional): “equivalent, intentional: index shift only. Lean `p` is 0-indexed (DHL32/Basic.lean:9, p 0 = 2) while the paper is 1-indexed (DHL32_note.tex:48, p_1 = 2), so Lean n >= 1 is exactly paper n >= 2. (gap_even)”

## Theorem 3.3

- `382682972d36` NARROWER: Claim mentions {0,1}; no matched Lean statement mentions it. — answered (intentional): “equivalent, intentional: for n : ℕ, n % 4 ∈ {0,1,2,3}, so n % 4 < 2 ↔ n % 4 ∈ {0,1}; the paper's P(n) :⇔ n mod 4 ∈ {0,1} (DHL32_note.tex:94) is Lean's Ptoy (Theorems34.lean:25). Local branch pipelinehalt/align-wording adds Ptoy_iff_mod_four_mem stating this equivalence.”

## Realignment notes

- Theorem 3.1: difference `56d42291f91e` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem 3.1: difference `cc5e051f3e37` is intentional per the author; consider stating it in the paper text so readers see it too.
- Theorem 3.3: difference `382682972d36` is intentional per the author; consider stating it in the paper text so readers see it too.
- Lean `Ptoy_iff_mod_four_mem` cites “Theorem 3.3” in its docstring but is not matched to any anchor claim (informational).
