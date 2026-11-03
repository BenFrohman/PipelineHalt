# PipelineHalt report: \textbf{Formalizing Fefferman's Official Periodic Navier--Stokes Problem (B) in Lean 4:\\
Global Linear Strain Exclusion on $\mathbb{T

Status: **ALIGNED** · overall drift **0.000** · 1 claims · 320 Lean declarations scanned · 0 open question(s)

Mapping file: `../../PipelineHalt/examples/fefferman-clay-navier-stokes/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 1.1 | `fefferman_periodic_ns_exact_reduction_product_theorem` | 0.000 | 0 | 1 |

## Theorem 1.1 — Master Product Theorem: \texttt{fefferman\_periodic\_ns\_exact\_reduction\_product\_theorem}

- `e7f5ad81c345` AMBIGUOUS: Title “Master Product Theorem: \texttt{fefferman\_periodic\_ns\_exact\_reduction\_product\_theorem}” shares almost no terms with the statement. — answered (intentional): “harmless wording: the title is the Lean declaration name fefferman_periodic_ns_exact_reduction_product_theorem, which exists (FeffermanClayNS/FinalProductTheorem.lean:447) and whose statement is the conjunction Q1 ∧ … ∧ Q5 that the paper lists.”

## Realignment notes

- Lean `clay_B_exact_of_periodic_tether_bound` cites “Theorem 1” in its docstring but is not matched to any anchor claim (informational).
- Lean `clay_B_exact_of_torus_direction_depletion` cites “Theorem 2” in its docstring but is not matched to any anchor claim (informational).
- Lean `clay_B_exact_of_periodic_bkm` cites “Theorem 3” in its docstring but is not matched to any anchor claim (informational).
