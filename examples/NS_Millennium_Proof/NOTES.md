# NS_Millennium_Proof: manual reviewer notes (PipelineHalt run 2026-11-03)

- thm:main is conditional, and the paper says so (K, C, R, U). Two extra Lean hypotheses are kept open: `hTlb` (a uniform lower bound τ on the Kato existence time, which the paper doesn't state) and `hInt` (BKM integrability assumed separately; the paper says it is supplied by (R)).
- prop:degen cites `tetherKernel_C2`, which doesn't exist (only `_of_no_gateaux` / `_of_identifications` variants exist). Kept open.
- lem:transport: Lean assumes NS_PDE (the paper says a solution of the vorticity equation), VorticityTransportRegularity, and t ≥ 0. Kept open; equivalence not verified.

## Strict pass (2026-11-03)
- Reopened 5f8484fca91e (`hu : DifferentiableAt ℝ u x` in lem:localmax). The paper never states differentiability; the earlier closure called it presupposed, which is an implicit-domain judgment.
