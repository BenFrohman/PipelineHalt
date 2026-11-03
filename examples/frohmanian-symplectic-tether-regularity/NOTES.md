# frohmanian-symplectic-tether-regularity: manual reviewer notes (PipelineHalt run 2026-11-03)

- theorem-2.2 cites `tether_preserves_casimirs`, which exists nowhere in the repo's .lean files. Kept open (silent).
- eq:kappa-def: no Lean definition of κ(ν) = 27 C_CZ⁴/(4ν³) = 2187/(64ν³) was found. Kept open (silent).
- theorem-3.1: Lean hypotheses hC1 `InvariantUnderCoadjointAction`, hC2 `DegenerateWRTKineticEnergy`, hC3 `ProducesControllableNegativeFeedback`, `Polarizes` don't visibly match the paper's C1 (Casimir kernel annihilation), C2 (minimal degree & parabolic scaling), C3. Kept open: equivalence not clear.
- eq:young-4-eq-4: Lean `youngs_absorption_elimination` assumes the Young-type bound `h_young` as a hypothesis, i.e. the key inequality is assumed. Kept open (true conditional gap). There are also two declarations with this name (AnalyticPipeline.lean:69, TetheredLyapunov.lean:744) with different hypotheses (the latter has `h_kappa : kappa = CalderonZygmundConstant3D`).
- theorem-1.1: Lean statement is the conjunction P1 ∧ … ∧ P4 (FinalProductTheorem.lean:523). The paper itself states that global regularity for general data is conditional on FrohmanianTetherBound, KatoLocalWitness, PhysicalBKMContinuationCriterionFor, KatoUniquenessOnExistenceTimes. Consistent; not a proof of NS global regularity.
