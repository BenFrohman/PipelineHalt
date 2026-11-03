# StandardConjectures: manual reviewer notes (PipelineHalt run 2026-11-03)

- Manual finding (the harness cannot see it): `IsHodge` and `IsAlgebraic` are defined as `True` (StandardConjectures.lean:24,27), so `hodge_on_product_implies_lefschetz_B` is vacuous relative to the paper's meaning. Aligned on surface text only; the definitional gap stays open.
