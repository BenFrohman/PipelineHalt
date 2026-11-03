# PipelineHalt report: \textbf{Formalizing Fefferman's Official Periodic Navier--Stokes Problem (B) in Lean 4:\\
Global Linear Strain Exclusion on $\mathbb{T

Status: **HALT** · overall drift **0.300** · 1 claims · 320 Lean declarations scanned · 1 open question(s)

Mapping file: none (heuristic pairing only).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 1.1 | `fefferman_periodic_ns_exact_reduction_product_theorem` (0.309), `scale_invariant_cubic_rate_of_direction_coercivity` (0.206), `near_field_stretching_absorbed_by_viscous_direction_damping` (0.204) | 0.300 | 1 | 0 |

## Theorem 1.1 — Master Product Theorem: \texttt{fefferman\_periodic\_ns\_exact\_reduction\_product\_theorem}

- `e7f5ad81c345` AMBIGUOUS: Title “Master Product Theorem: \texttt{fefferman\_periodic\_ns\_exact\_reduction\_product\_theorem}” shares almost no terms with the statement. — **OPEN**

## Realignment notes

- Theorem 1.1: answer `e7f5ad81c345` — Paper claim Theorem 1.1 (theorem-1.1) states: “For every viscosity $\nu \in \mathbb{R}$ on the 3-torus $\mathbb{T}^3 = \mathbb{R}^3/\mathbb{Z}^3$, \textbf{(Q$_1$)} spatial $\mathbb{Z}^3$-periodicity is equivalent to invariance under the three uni…”. Its title is “Master Product Theorem: \texttt{fefferman\_periodic\_ns\_exact\_reduction\_product\_theorem}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lean `clay_B_exact_of_periodic_tether_bound` cites “Theorem 1” in its docstring but is not matched to any anchor claim (informational).
- Lean `clay_B_exact_of_torus_direction_depletion` cites “Theorem 2” in its docstring but is not matched to any anchor claim (informational).
- Lean `clay_B_exact_of_periodic_bkm` cites “Theorem 3” in its docstring but is not matched to any anchor claim (informational).
