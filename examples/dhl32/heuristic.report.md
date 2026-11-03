# PipelineHalt report

Status: **HALT** · overall drift **0.267** · 9 claims · 34 Lean declarations scanned · 5 open question(s)

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim          | Matched Lean                                                                                                     | Drift | Open | Answered |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | ----- | ---- | -------- |
| Definition 2.1 | `Admissible` (0.304)                                                                                             | 0.000 | 0    | 0        |
| Definition 2.2 | `DHL` (0.252)                                                                                                    | 0.000 | 0    | 0        |
| Definition 2.3 | `H1Le` (0.272)                                                                                                   | 0.000 | 0    | 0        |
| Lemma 2.4      | `admissible_046` (0.756), `admissible_026` (0.756), `admissible_02` (0.627), `min_diam_admissible_three` (0.518) | 0.500 | 1    | 0        |
| Theorem 3.1    | `H1Le_three_iff_twin` (0.386), `not_H1Le_one` (0.297)                                                            | 0.300 | 1    | 0        |
| Theorem 3.2    | `dhl32_H1Le_six` (0.762), `H1Le_three_iff_two` (0.495)                                                           | 0.300 | 1    | 0        |
| Theorem 3.3    | —                                                                                                                | 1.000 | 1    | 0        |
| Hypothesis 3.5 | `ParityBarrier` (0.346)                                                                                          | 0.000 | 0    | 0        |
| Theorem 3.6    | `admissible_three_diam_ge_six` (0.289)                                                                           | 0.300 | 1    | 0        |

## Lemma 2.4

- `ac788105673c` CONDITIONAL: `min_diam_admissible_three` assumes `H.card = 3`, not stated in the claim. — **OPEN**

## Theorem 3.1

- `f0d3f21b845c` AMBIGUOUS: `H1Le_three_iff_twin`'s docstring calls itself “Theorem 1”, but the paper prints Theorem 3.1. — **OPEN**

## Theorem 3.2

- `914b1b84bfe9` AMBIGUOUS: `dhl32_H1Le_six`'s docstring calls itself “Theorem 2”, but the paper prints Theorem 3.2. — **OPEN**

## Theorem 3.3

- `091d89359f15` SILENT: No Lean declaration matches this claim. Closest candidate: `Ptoy_DHL32` (score 0.42, but it matches claim thm:main better). — **OPEN**

## Theorem 3.6

- `17f36fcad029` AMBIGUOUS: `admissible_three_diam_ge_six`'s docstring calls itself “Theorem 4”, but the paper prints Theorem 3.6. — **OPEN**

## Realignment notes

- Lemma 2.4: answer `ac788105673c` — Paper claim Lemma 2.4 (lem:adm) states: “The sets $\{0,2\}$, $\{0,2,6\}$ and $\{0,4,6\}$ are admissible.”. Lean theorem `min_diam_admissible_three` assumes `H.card = 3`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3.1: answer `f0d3f21b845c` — Paper claim Theorem 3.1 (thm:gaps) states: “For all $n\ge2$, $p_{n+1}-p_n\ge2$ and $p_{n+1}-p_n$ is even. Consequently $H_1\ge2$, and $H_1\le3$ if and only if $p_{n+1}-p_n=2$ for infinitely many $n$.”. Lean theorem `H1Le_three_iff_twin` is documented as “Theorem 1”, while the paper numbers this claim Theorem 3.1. Which numbering should readers and tools use?
- Theorem 3.2: answer `914b1b84bfe9` — Paper claim Theorem 3.2 (thm:main) states: “$\DHL[3,2]$ implies $H_1\le6$.”. Lean theorem `dhl32_H1Le_six` is documented as “Theorem 2”, while the paper numbers this claim Theorem 3.2. Which numbering should readers and tools use?
- Theorem 3.3: answer `091d89359f15` — Paper claim Theorem 3.3 (thm:model) states: “Let $P(n)$ hold if and only if $n\bmod4\in\{0,1\}$. Then $\DHL_P[3,2]$ holds (indeed for every $3$-element set), but $P(n)\wedge P(n+2)$ holds for no $n$; in particular $\DHL_P[2,2]$ fails.”. No Lean declaration matching it was found among 25 candidates. Closest candidate: `Ptoy_DHL32` (score 0.42, but it matches claim thm:main better). Is this claim intentionally not formalized, or which declaration should it map to?
- Theorem 3.6: answer `17f36fcad029` — Paper claim Theorem 3.6 (thm:parity) states: “\begin{enumerate} \item Under \cref{hyp:parity}, a sieve method establishing $\DHL[k,2]$ has $k\ge3$. \item (Unconditional.) No admissible $3$-element set is contained in an interval $[a,a+5]$. Toget…”. Lean theorem `admissible_three_diam_ge_six` is documented as “Theorem 4”, while the paper numbers this claim Theorem 3.6. Which numbering should readers and tools use?
- Lean `two_le_gap` cites “Theorem 1” in its docstring but is not matched to any anchor claim (informational).
- Lean `dhl32_not_implies_dhl22_combinatorially` cites “Theorem 3” in its docstring but is not matched to any anchor claim (informational).
- Lean `parity_two_needs_three` cites “Theorem 4” in its docstring but is not matched to any anchor claim (informational).
