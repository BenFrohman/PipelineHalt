# PipelineHalt report: \textbf{Homological Certificate Topologies on Conflict-Clause Poset Lattices: A Lean 4--Verified Step-Counting Framework for Sub-Exponential 3-SAT Cost Bounds

Status: **HALT** · overall drift **0.375** · 2 claims · 94 Lean declarations scanned · 2 open question(s)

Mapping file: `../../PipelineHalt/examples/eth-conflict-clause-lattice/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 3.1 | `boundary1_comp_boundary2_eq_zero`, `boundary2_comp_boundary3_eq_zero`, `euler_poincare_L3` | 0.000 | 0 | 2 |
| Equation (eq:subexp_bound), Section 4 | `simulateBlockHomologicalTraversal_at_logBlockSize_bound`, `block_homological_traversal_real_log_bound` | 0.750 | 2 | 2 |

## Theorem 3.1 — Chain Complex Fundamental Identity

- `92afe540c9d8` AMBIGUOUS: Title “Chain Complex Fundamental Identity” shares almost no terms with the statement. — answered (intentional): “harmless wording: 'Chain Complex Fundamental Identity' is the name of the identity ∂∘∂ = 0 that the statement asserts (paper/main.tex:150).”
- `ee253b0d8278` NARROWER: Claim mentions {2,3}; no matched Lean statement mentions it. — answered (intentional): “equivalent, intentional: k ∈ {2,3} is proved case by case — k = 2 is boundary1_comp_boundary2_eq_zero (HomologicalCertificate.lean:38), k = 3 is boundary2_comp_boundary3_eq_zero (:53).”

## Equation (eq:subexp_bound), Section 4

- `d6ae4141e14d` NARROWER: `simulateBlockHomologicalTraversal_at_logBlockSize_bound` restricts n ≥ 2; the claim states no such restriction. — answered (intentional): “harmless: the paper's expression divides by (log n)^{1/2+o(1)}, which is 0 or undefined for n ≤ 1, so the asymptotic bound is only meaningful for n ≥ 2; the Lean n ≥ 2 restriction matches that domain.”
- `3ab5e3de2475` CONDITIONAL: `simulateBlockHomologicalTraversal_at_logBlockSize_bound` assumes `hrun : (simulateBlockHomologicalTraversal n m (logBlockSize n ε)).run { steps := 0 } = (res, finalState)`, not stated in the claim. — **OPEN**
- `27b751af9317` NARROWER: `block_homological_traversal_real_log_bound` restricts n ≥ 2; the claim states no such restriction. — answered (intentional): “harmless: the paper's expression divides by (log n)^{1/2+o(1)}, which is 0 or undefined for n ≤ 1, so the asymptotic bound is only meaningful for n ≥ 2; the Lean n ≥ 2 restriction matches that domain.”
- `e3f2e53cb248` CONDITIONAL: `block_homological_traversal_real_log_bound` assumes `hrun : (simulateBlockHomologicalTraversal n m blockK).run { steps := 0 } = (res, finalState)`, not stated in the claim. — **OPEN**

## Realignment notes

- Theorem 3.1: difference `ee253b0d8278` is intentional per the author; consider stating it in the paper text so readers see it too.
- Equation (eq:subexp_bound), Section 4: difference `d6ae4141e14d` is intentional per the author; consider stating it in the paper text so readers see it too.
- Equation (eq:subexp_bound), Section 4: answer `3ab5e3de2475` — Paper claim Equation (eq:subexp_bound), Section 4 (eq:subexp_bound) states: “Applying the block-triangularization theorem and spectral gap bounds over the decomposed sub-complexes yields a strict reduction in the depth of required branching steps. The runtime complexity $T(n,…”. Lean theorem `simulateBlockHomologicalTraversal_at_logBlockSize_bound` assumes `hrun : (simulateBlockHomologicalTraversal n m (logBlockSize n ε)).run { steps := 0 } = (res, finalState)`, which the claim does not state. Is this extra hypothesis intentional?
- Equation (eq:subexp_bound), Section 4: difference `27b751af9317` is intentional per the author; consider stating it in the paper text so readers see it too.
- Equation (eq:subexp_bound), Section 4: answer `e3f2e53cb248` — Paper claim Equation (eq:subexp_bound), Section 4 (eq:subexp_bound) states: “Applying the block-triangularization theorem and spectral gap bounds over the decomposed sub-complexes yields a strict reduction in the depth of required branching steps. The runtime complexity $T(n,…”. Lean theorem `block_homological_traversal_real_log_bound` assumes `hrun : (simulateBlockHomologicalTraversal n m blockK).run { steps := 0 } = (res, finalState)`, which the claim does not state. Is this extra hypothesis intentional?
- Lean `modelCount3_eq_unobstructedAtomCount3` cites “Theorem 1” in its docstring but is not matched to any anchor claim (informational).
