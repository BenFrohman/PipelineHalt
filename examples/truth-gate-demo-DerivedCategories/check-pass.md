# Truth Gate: formal certificate inhabits the locked statement

Status: **PASS** · lock digest `1705cc0937aafb93` · locked commit `4d056001933b2e2340221f226d36bec04e7452bd` · current commit `4e003167378bb5f2a410401c1e4185b6a1d48003` · toolchain `leanprover/lean4:v4.34.0`

Locked statement (`Frohman.Residual.TruthGate.paper_claim`, conditional: its hypotheses are part of the statement):

```lean
def paper_claim : Prop := ∀ h4 hPi Pi2 chi pg rank : Int, h4 = 6 → hPi = 1 → Pi2 = 21 → chi = 5 → pg = 4 → rank = 2 → h4 - hPi = 5 ∧ hPi - Pi2 = -20 ∧ h4 - 2 * hPi + Pi2 = 25 ∧ (5 - 1) * (5 - 2) / 2 = (6 : Int) ∧ chi = 5 ∧ pg = 4 ∧ 12 * chi - 5 = 55 ∧ rank = 2
```

> The Truth Gate checks that the kernel-checked certificate has the type of the locked, author-approved Lean transcription `paper_claim`, through `intended_correspondence`, with only propext / Classical.choice / Quot.sound. It does not check that the transcription matches unwritten intent, and it makes no claim beyond the locked statement.

| check | group | status | detail |
|---|---|---|---|
| o.observed | o | PASS | observation pass (#check intended_correspondence, #print paper_claim) recorded for this lock: observed 2026-11-16T20:19:52.520Z at 4e003167378bb5f2a410401c1e4185b6a1d48003; verdict goal-matches-paper-claim |
| a.schema | a | PASS | lock schema: schema pipelinehalt/truth-gate-lock/v1 |
| a.approval | a | PASS | lock approved by the author, digest matches: approved by DEMO scratch approval (not an author approval) at 2026-11-16T20:19:40.046Z |
| a.semantics | a | PASS | lean/Semantics.lean exists |
| a.paper-claim-source | a | PASS | paper_claim source hash: sha256 3b68eec7d53c58521ebaf8cadac64773efd60bbf75d08c50b631d6d12abcb55d (locked 3b68eec7d53c58521ebaf8cadac64773efd60bbf75d08c50b631d6d12abcb55d) |
| a.correspondence-source | a | PASS | intended_correspondence statement hash: sha256 d8af500c140b408d53610c2e603d7897181268bb921bb8acb46631a4225c0dbd (locked d8af500c140b408d53610c2e603d7897181268bb921bb8acb46631a4225c0dbd) |
| a.semantics-clean | a | PASS | Semantics.lean has no sorry/admit/axiom/native_decide/opaque |
| a.lean-run | a | PASS | Lean meta script completed |
| a.resolve-paper | a | PASS | paper_claim resolves to the locked constant: resolved Frohman.Residual.TruthGate.paper_claim |
| a.resolve-correspondence | a | PASS | intended_correspondence resolves to the locked constant: resolved Frohman.Residual.TruthGate.intended_correspondence |
| a.resolve-formal | a | PASS | formal_claim resolves to the locked constant: resolved Frohman.Residual.TruthGate.formal_claim |
| a.paper-claim-kind | a | PASS | paper_claim is a universe-monomorphic def of type Prop: def : Prop, 0 universe params |
| a.module | a | PASS | locked declarations live in a Semantics module: Semantics / Semantics |
| a.paper-claim-expr | a | PASS | paper_claim elaborated hash: sha256 7f5ed82daba8c5e15e38a7e383f97dec966afc04933e26b4c6fa41c1cf1820b2 (locked 7f5ed82daba8c5e15e38a7e383f97dec966afc04933e26b4c6fa41c1cf1820b2); hash64 17629050349138358009 (locked 17629050349138358009) |
| a.correspondence-type | a | PASS | intended_correspondence elaborated type hash: sha256 b5ce656eda1de9c1892d2b2e434fe152ddc0578aac879a03cce2bb9df5e30e54 (locked b5ce656eda1de9c1892d2b2e434fe152ddc0578aac879a03cce2bb9df5e30e54) |
| a.dependencies | a | PASS | definitions paper_claim unfolds to are unchanged: 0 project-local dependencies |
| a.independent | a | PASS | paper_claim is not defined through formal_claim, the correspondence, theorems or axioms |
| a.toolchain | a | PASS | toolchain matches the lock: locked leanprover/lean4:v4.34.0, current leanprover/lean4:v4.34.0 |
| b.kind | b | PASS | intended_correspondence is a theorem: theorem |
| b.axioms | b | PASS | intended_correspondence uses only propext, Classical.choice, Quot.sound (no sorryAx): axioms: (none) |
| b.shape | b | PASS | intended_correspondence has the locked form (formal_claim ↔ paper_claim): form iff; paper_claim side true; formal_claim side true |
| b.formal | b | PASS | formal_claim is a def of type Prop: def : Prop |
| c.transport | c | PASS | every headline and paper-cited theorem transports across intended_correspondence or is marked auxiliary |
| c.certificate | c | PASS | at least one headline theorem has type paper_claim: Frohman.Residual.TruthGate.ledger_certificate: type is paper_claim; proof goes through intended_correspondence |
| d.claims | d | PASS | listed result claims exist in the paper |
| d.stronger | d | PASS | no listed paper claim is stronger than paper_claim |

## Transport

| theorem | origin | verdict | note |
|---|---|---|---|
| `Frohman.Residual.TruthGate.ledger_certificate` | head | certificate | type is paper_claim; proof goes through intended_correspondence |
| `Frohman.BHK.det_block` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.transpose_block` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.block_degree_u5` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.block_degree_u_v6` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.dual_cy` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.F_homogeneous` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.F_cy_weights` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.invertible` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.detA_ne_zero` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.BHK.FT_not_unweighted_deg6` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.F_ne_FT` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.F_has_three_chain_blocks` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.deg_X` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.plane_meets_P3` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.self_intersection_Pi` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.S_degree` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.S_meets_Pi` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.S_self` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.curve_genus` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.chi_S` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.geometric_genus` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.topological_euler` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.no_new_independent_class` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Residual.samples_hold` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.partner_must_be_fourfold` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.partner_must_not_be_X` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.partner_equations_unwritten` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.kernel_unwritten` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.residual_fails_dim` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.residual_fails_canonical` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.hmf_is_same_host` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.identity_is_X` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |
| `Frohman.Sextic.not_vacuous_true` | cite | auxiliary | auxiliary: recorded-value lemma cited by the paper; outside the locked statement |

