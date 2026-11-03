# PipelineHalt report: \textbf{Homological Certificate Topologies on Conflict-Clause Poset Lattices: A Lean 4--Verified Step-Counting Framework for Sub-Exponential 3-SAT Cost Bounds

Status: **HALT** · overall drift **0.720** · 1 claims · 94 Lean declarations scanned · 2 open question(s)

Mapping file: none (heuristic pairing only).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 3.1 | `boundary1_comp_boundary2_eq_zero` (0.345), `non_empty_euler_characteristic_L3` (0.329), `euler_poincare_L3` (0.329), `layer_partition_sum_three` (0.317) | 0.720 | 2 | 0 |

## Theorem 3.1 — Chain Complex Fundamental Identity

- `92afe540c9d8` AMBIGUOUS: Title “Chain Complex Fundamental Identity” shares almost no terms with the statement. — **OPEN**
- `e01e8c8614e7` NARROWER: Claim mentions {2,3}; no matched Lean statement mentions it. — **OPEN**

## Realignment notes

- Theorem 3.1: answer `92afe540c9d8` — Paper claim Theorem 3.1 (theorem-3.1) states: “For every $k \in \{2, 3\}$, the boundary operators satisfy $\partial_{k-1} \circ \partial_k = 0$. Moreover, for $n=3$, the Euler characteristic of the conflict clause complex is \[ \chi(\mathcal{L}_3…”. Its title is “Chain Complex Fundamental Identity”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 3.1: answer `e01e8c8614e7` — Paper claim Theorem 3.1 (theorem-3.1) states: “For every $k \in \{2, 3\}$, the boundary operators satisfy $\partial_{k-1} \circ \partial_k = 0$. Moreover, for $n=3$, the Euler characteristic of the conflict clause complex is \[ \chi(\mathcal{L}_3…”. The matched Lean statement(s) `boundary1_comp_boundary2_eq_zero`, `non_empty_euler_characteristic_L3`, `euler_poincare_L3`, `layer_partition_sum_three` do not mention the set {2,3}. Is the omission intentional, or is it covered by a declaration the matcher missed?
- Lean `modelCount3_eq_unobstructedAtomCount3` cites “Theorem 1” in its docstring but is not matched to any anchor claim (informational).
