# PipelineHalt report: Resolving a category error: DHL[3,2] yields H1 <= 6, not H1 = 2 (B. S. Frohman, 2026)

Status: **HALT** · overall drift **0.160** · 9 claims · 34 Lean declarations scanned · 3 open question(s)

Mapping file: `pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Definition 2.1 | `Admissible` | 0.000 | 0 | 0 |
| Definition 2.2 | `DHL`, `DHLfor` | 0.000 | 0 | 0 |
| Definition 2.3 | `H1Le` | 0.000 | 0 | 0 |
| Lemma 2.4 | `admissible_02`, `admissible_026`, `admissible_046` | 0.000 | 0 | 0 |
| Theorem 3.1 | `two_le_gap`, `gap_even`, `not_H1Le_one`, `H1Le_three_iff_two`, `H1Le_three_iff_twin` | 0.840 | 2 | 0 |
| Theorem 3.2 | `dhl32_H1Le_six` | 0.000 | 0 | 0 |
| Theorem 3.3 | `Ptoy_DHL32`, `Ptoy_no_twin`, `dhl32_not_implies_dhl22_combinatorially` | 0.600 | 1 | 0 |
| Hypothesis 3.5 | `ParityBarrier` | 0.000 | 0 | 0 |
| Theorem 3.6 | `parity_two_needs_three`, `admissible_three_diam_ge_six`, `min_diam_admissible_three` | 0.000 | 0 | 0 |

## Theorem 3.1

- `56d42291f91e` NARROWER: `two_le_gap` uses n ≥ 1 where the claim says n ≥ 2 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `cc5e051f3e37` NARROWER: `gap_even` uses n ≥ 1 where the claim says n ≥ 2 (could be an indexing shift; direction not decidable syntactically). — **OPEN**

## Theorem 3.3

- `382682972d36` NARROWER: Claim mentions {0,1}; no matched Lean statement mentions it. — **OPEN**

## Realignment notes

- Theorem 3.1: answer `56d42291f91e` — Paper claim Theorem 3.1 (thm:gaps) states: “For all $n\ge2$, $p_{n+1}-p_n\ge2$ and $p_{n+1}-p_n$ is even. Consequently $H_1\ge2$, and $H_1\le3$ if and only if $p_{n+1}-p_n=2$ for infinitely many $n$.”. Lean theorem `two_le_gap` assumes `1 ≤ n` (n ≥ 1), but the claim says n ≥ 2. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 3.1: answer `cc5e051f3e37` — Paper claim Theorem 3.1 (thm:gaps) states: “For all $n\ge2$, $p_{n+1}-p_n\ge2$ and $p_{n+1}-p_n$ is even. Consequently $H_1\ge2$, and $H_1\le3$ if and only if $p_{n+1}-p_n=2$ for infinitely many $n$.”. Lean lemma `gap_even` assumes `1 ≤ n` (n ≥ 1), but the claim says n ≥ 2. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 3.3: answer `382682972d36` — Paper claim Theorem 3.3 (thm:model) states: “Let $P(n)$ hold if and only if $n\bmod4\in\{0,1\}$. Then $\DHL_P[3,2]$ holds (indeed for every $3$-element set), but $P(n)\wedge P(n+2)$ holds for no $n$; in particular $\DHL_P[2,2]$ fails.”. The matched Lean statement(s) `Ptoy_DHL32`, `Ptoy_no_twin`, `dhl32_not_implies_dhl22_combinatorially` do not mention the set {0,1}. Is the omission intentional, or is it covered by a declaration the matcher missed?
