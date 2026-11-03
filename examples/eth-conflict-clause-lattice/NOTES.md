# eth-conflict-clause-lattice: manual reviewer notes (PipelineHalt run 2026-11-03)

- Hand-added claim eq:subexp_bound (paper/main.tex:161, displayed equation, not a theorem env).
- Open (true gap): Lean bounds the step counter of the cost model `simulateBlockHomologicalTraversal`, whose cost is *defined* by `tick ((n+m)^2); tick (2^(n / max k 1))` and which returns `true` without inspecting any formula. It does not bound the runtime of an algorithm that decides 3-SAT. The `hrun` flags stay open.
- Not flagged by the harness: paper writes o(1); Lean takes an arbitrary fixed real ε.

## Strict pass (2026-11-03)
- Reopened d6ae4141e14d and 27b751af9317 (the Lean `n ≥ 2` restriction on the runtime bound). The earlier closure depended on the implicit domain of the paper's (log n) expression, not on wording or a proved equivalence. Both are open halt questions again.
