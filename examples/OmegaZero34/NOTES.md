# OmegaZero34: manual reviewer notes (PipelineHalt run 2026-11-03)

- The paper has no \lean{} references. The map was hand-built by reading OmegaZero34/*.lean.
- Numbering: the Lean docstrings number by section ("Theorem 7.1", "Corollary 7.2"), while the tex prints Theorem 9 and Corollary 10. Closed with map aliases.
- Manual finding, not flagged: prop:kernel says "vanish **if and only if** a=b=e=f=0, c=d/6". `invariant_params` proves only the forward direction. The converse (c•Ω0 is invariant) follows from T1_preserves_Ω0/T2_preserves_Ω0 by linearity but is not stated as a theorem. This is a small narrower gap; an `_iff` lemma would close it (not done, see roll-up).
- Manual finding, not flagged: thm:C is conditional on H1–H3 (the paper says so). Lean takes the lattice-level content of H1–H3 as the structure `InvariantFormQ` (an argument, not a Prop hypothesis, so the harness doesn't see it). H1–H3 and the lattice identification are not formalized (TetherInterface.lean:23-27).

## Strict pass (2026-11-03)
- Kept all closures. For thm:A, skew-symmetry plus ofParams is a proved equivalence (`skew_eq_ofParams`, Uniqueness.lean:99). For prop:kernel, the hypotheses h1/h2 are literally the residual equations, computed by `T1_conj_ofParams`/`T2_conj_ofParams`.
- Converse of prop:kernel: PROVED on local branch `pipelinehalt/iff-converse` (commit 4ee0dce, not pushed). It adds `invariant_params_converse` and `invariant_params_iff`, which is the paper's statement with both directions over ℚ, with no weakening. A full `lake build` passed (3297 jobs) with no sorry. `#print axioms invariant_params_iff` gives propext, Classical.choice, Quot.sound. The harness on that branch reports aligned, 0 open (branch-iff.*). The map still points prop:kernel at `invariant_params`, because the iff only exists on the unpushed branch.
