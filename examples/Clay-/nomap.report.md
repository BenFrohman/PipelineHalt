# PipelineHalt report: \textbf{Fefferman Statement (B) on $\mathbb{T

Status: **HALT** · overall drift **0.500** · 2 claims · 84 Lean declarations scanned · 2 open question(s)

Mapping file: none (heuristic pairing only).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 1 | `feffermanStatementB_of_bkm` (0.565), `statementB_of_bkmIntegralFinite` (0.417) | 0.500 | 1 | 0 |
| Theorem 2 | `bkmIntegralFinite_of_holographic` (0.367), `bkmIntegralFinite_of_vortSup_le` (0.283) | 0.500 | 1 | 0 |

## Theorem 1 — \texttt{feffermanStatementB\_of\_bkm}, kernel-checked

- `26bac8740c61` CONDITIONAL: `statementB_of_bkmIntegralFinite` assumes `h : bkmIntegralFinite`, not stated in the claim. — **OPEN**

## Theorem 2 — \texttt{bkmIntegralFinite\_of\_holographic}, kernel-checked

- `d77f3a7e4950` CONDITIONAL: `bkmIntegralFinite_of_vortSup_le` assumes `hb : ∀ t ∈ lifespanSet T, vortSup u t ≤ C`, not stated in the claim. — **OPEN**

## Realignment notes

- Theorem 1: answer `26bac8740c61` — Paper claim Theorem 1 (theorem-1) states: “\texttt{PeriodicMaximalSolutionWithBKM} and \texttt{PeriodicBKMIntegrability} together imply Statement~(B).”. Lean theorem `statementB_of_bkmIntegralFinite` assumes `h : bkmIntegralFinite`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 2: answer `d77f3a7e4950` — Paper claim Theorem 2 (theorem-2) states: “If $\|\omega(t)\|_{L^\infty}$ is bounded on every finite interval of existence, then \texttt{PeriodicBKMIntegrability} holds.”. Lean theorem `bkmIntegralFinite_of_vortSup_le` assumes `hb : ∀ t ∈ lifespanSet T, vortSup u t ≤ C`, which the claim does not state. Is this extra hypothesis intentional?
