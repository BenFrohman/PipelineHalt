# PipelineHalt report: Resolving a category error: DHL[3,2] yields H1 <= 6, not H1 = 2 (B. S. Frohman, 2026)

Status: **HALT** · overall drift **0.245** · 9 claims · 34 Lean declarations scanned · 7 open question(s)

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim          | Matched Lean                                                                          | Drift | Open | Answered |
| -------------- | ------------------------------------------------------------------------------------- | ----- | ---- | -------- |
| Definition 2.1 | `Admissible`                                                                          | 0.000 | 0    | 0        |
| Definition 2.2 | `DHL`, `DHLfor`                                                                       | 0.000 | 0    | 0        |
| Definition 2.3 | `H1Le`                                                                                | 0.000 | 0    | 0        |
| Lemma 2.4      | `admissible_02`, `admissible_026`, `admissible_046`                                   | 0.000 | 0    | 0        |
| Theorem 3.1    | `two_le_gap`, `gap_even`, `not_H1Le_one`, `H1Le_three_iff_twin`                       | 0.888 | 3    | 0        |
| Theorem 3.2    | `dhl32_H1Le_six`                                                                      | 0.300 | 1    | 0        |
| Theorem 3.3    | `Ptoy_DHL32`, `Ptoy_no_twin`, `dhl32_not_implies_dhl22_combinatorially`               | 0.720 | 2    | 0        |
| Hypothesis 3.5 | `ParityBarrier`                                                                       | 0.000 | 0    | 0        |
| Theorem 3.6    | `parity_two_needs_three`, `admissible_three_diam_ge_six`, `min_diam_admissible_three` | 0.300 | 1    | 0        |

## Theorem 3.1

- `56d42291f91e` NARROWER: `two_le_gap` uses n ≥ 1 where the claim says n ≥ 2 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `cc5e051f3e37` NARROWER: `gap_even` uses n ≥ 1 where the claim says n ≥ 2 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `d954590373a1` AMBIGUOUS: `two_le_gap`'s docstring calls itself “Theorem 1”, but the paper prints Theorem 3.1. — **OPEN**

## Theorem 3.2

- `914b1b84bfe9` AMBIGUOUS: `dhl32_H1Le_six`'s docstring calls itself “Theorem 2”, but the paper prints Theorem 3.2. — **OPEN**

## Theorem 3.3

- `382682972d36` NARROWER: Claim mentions {0,1}; no matched Lean statement mentions it. — **OPEN**
- `25cb35ac0d5b` AMBIGUOUS: `dhl32_not_implies_dhl22_combinatorially`'s docstring calls itself “Theorem 3”, but the paper prints Theorem 3.3. — **OPEN**

## Theorem 3.6

- `8c42a0eae510` AMBIGUOUS: `parity_two_needs_three`'s docstring calls itself “Theorem 4”, but the paper prints Theorem 3.6. — **OPEN**

## Realignment notes

- Theorem 3.1: answer `56d42291f91e` — Paper claim Theorem 3.1 (thm:gaps) states: “For all $n\ge2$, $p_{n+1}-p_n\ge2$ and $p_{n+1}-p_n$ is even. Consequently $H_1\ge2$, and $H_1\le3$ if and only if $p_{n+1}-p_n=2$ for infinitely many $n$.”. Lean theorem `two_le_gap` assumes `1 ≤ n` (n ≥ 1), but the claim says n ≥ 2. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 3.1: answer `cc5e051f3e37` — Paper claim Theorem 3.1 (thm:gaps) states: “For all $n\ge2$, $p_{n+1}-p_n\ge2$ and $p_{n+1}-p_n$ is even. Consequently $H_1\ge2$, and $H_1\le3$ if and only if $p_{n+1}-p_n=2$ for infinitely many $n$.”. Lean lemma `gap_even` assumes `1 ≤ n` (n ≥ 1), but the claim says n ≥ 2. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 3.1: answer `d954590373a1` — Paper claim Theorem 3.1 (thm:gaps) states: “For all $n\ge2$, $p_{n+1}-p_n\ge2$ and $p_{n+1}-p_n$ is even. Consequently $H_1\ge2$, and $H_1\le3$ if and only if $p_{n+1}-p_n=2$ for infinitely many $n$.”. Lean theorem `two_le_gap` is documented as “Theorem 1”, while the paper numbers this claim Theorem 3.1. Which numbering should readers and tools use?
- Theorem 3.2: answer `914b1b84bfe9` — Paper claim Theorem 3.2 (thm:main) states: “$\DHL[3,2]$ implies $H_1\le6$.”. Lean theorem `dhl32_H1Le_six` is documented as “Theorem 2”, while the paper numbers this claim Theorem 3.2. Which numbering should readers and tools use?
- Theorem 3.3: answer `382682972d36` — Paper claim Theorem 3.3 (thm:model) states: “Let $P(n)$ hold if and only if $n\bmod4\in\{0,1\}$. Then $\DHL_P[3,2]$ holds (indeed for every $3$-element set), but $P(n)\wedge P(n+2)$ holds for no $n$; in particular $\DHL_P[2,2]$ fails.”. The matched Lean statement(s) `Ptoy_DHL32`, `Ptoy_no_twin`, `dhl32_not_implies_dhl22_combinatorially` do not mention the set {0,1}. Is the omission intentional, or is it covered by a declaration the matcher missed?
- Theorem 3.3: answer `25cb35ac0d5b` — Paper claim Theorem 3.3 (thm:model) states: “Let $P(n)$ hold if and only if $n\bmod4\in\{0,1\}$. Then $\DHL_P[3,2]$ holds (indeed for every $3$-element set), but $P(n)\wedge P(n+2)$ holds for no $n$; in particular $\DHL_P[2,2]$ fails.”. Lean theorem `dhl32_not_implies_dhl22_combinatorially` is documented as “Theorem 3”, while the paper numbers this claim Theorem 3.3. Which numbering should readers and tools use?
- Theorem 3.6: answer `8c42a0eae510` — Paper claim Theorem 3.6 (thm:parity) states: “\begin{enumerate} \item Under \cref{hyp:parity}, a sieve method establishing $\DHL[k,2]$ has $k\ge3$. \item (Unconditional.) No admissible $3$-element set is contained in an interval $[a,a+5]$. Toget…”. Lean theorem `parity_two_needs_three` is documented as “Theorem 4”, while the paper numbers this claim Theorem 3.6. Which numbering should readers and tools use?
- Lean `H1Le_three_iff_two` cites “Theorem 1” in its docstring but is not matched to any anchor claim (informational).
