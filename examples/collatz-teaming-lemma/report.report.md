# PipelineHalt report: Frohman, Collatz Teaming Lemma and Eliahou Windows (2026)

Status: **HALT** · overall drift **0.200** · 3 claims · 209 Lean declarations scanned · 1 open question(s)

Mapping file: `../../PipelineHalt/examples/collatz-teaming-lemma/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Abstract claim 1 | `remaining_lemma_iff_collatz` | 0.000 | 0 | 0 |
| Abstract claim 2 | `trivial_cycle` | 0.000 | 0 | 0 |
| Abstract claim 3 (Frohman Model Mean observation) | `syracuse_not_injective` (0.267), `residue_count_for_terras` (0.266), `syracuse_not_injective` (0.256) | 0.600 | 1 | 0 |

## Abstract claim 3 (Frohman Model Mean observation)

- `6e04d3febb43` NARROWER: `residue_count_for_terras` restricts c ≥ 1; the claim states no such restriction. — **OPEN**

## Realignment notes

- Abstract claim 3 (Frohman Model Mean observation): answer `6e04d3febb43` — Paper claim Abstract claim 3 (Frohman Model Mean observation) (model-mean-observation) states: “the Syracuse logarithmic drift $\mu_F = \log(3/4) < 0$ is identical for $3n+1$ and $3n-1$, yet $3n-1$ possesses three distinct positive cycles ($1$, $5$, and $17$)”. Lean theorem `residue_count_for_terras` assumes `0 < c` (restricting c ≥ 1), which the claim does not state. Is the restricted domain intentional?
