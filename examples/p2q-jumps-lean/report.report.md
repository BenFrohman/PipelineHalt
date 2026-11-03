# PipelineHalt report: p2q-jumps-lean: Frohman, Theorem 28 (former Hypothesis R1)

Status: **HALT** · overall drift **0.250** · 2 claims · 8 Lean declarations scanned · 1 open question(s)

Mapping file: `../../PipelineHalt/examples/p2q-jumps-lean/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 28 | `theorem28_from_paper` | 0.500 | 1 | 0 |
| Leading-form lemma | `g_ge_six` | 0.000 | 0 | 0 |

## Theorem 28

- `f6ad53c0e186` CONDITIONAL: `theorem28_from_paper` assumes `h : Theorem28`, not stated in the claim. — **OPEN**

## Realignment notes

- Theorem 28: answer `f6ad53c0e186` — Paper claim Theorem 28 (theorem-28) states: “If both jumps hold and `n = p^2 q`, then `N = n + 12` is not a product of three distinct primes.”. Lean theorem `theorem28_from_paper` assumes `h : Theorem28`, which the claim does not state. Is this extra hypothesis intentional?
- Lean `g_sub_six_eq` cites “Theorem 28” in its docstring but is not matched to any anchor claim (informational).
