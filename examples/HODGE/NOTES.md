# HODGE: manual reviewer notes (PipelineHalt run 2026-11-03)

- Claims source: docs/CYCLE_CLASS_AND_CONSTRUCTOR.tex (the README's "Primary Manuscript"); 3 claims about the Klein quadric.
- Aligned on surface text, but there is a manual finding the harness cannot see: the Klein quadric is modelled with cycles := ℚ×ℚ, Hodge classes := ℚ×ℚ, `cl := LinearMap.id`, `construct γ := γ` (Hodge/Classical.lean:74-88). `construct_recovers` and `expansion` are `rfl`. So the geometric content (Hdg²(Q) = ℚ[Π] ⊕ ℚ[Π'], cl[Π], cl[Π'] being the basis, the intersection-number formulas a = γ·[Π], b = γ·[Π']) is built into the model, not proved. This is a modelling/definitional gap. It stays open as a reviewer finding.
