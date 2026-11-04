# May 31 fixed-κ (κ = C_CZ(3)), T³ — claim ledger

Anchor: May 31 2026 `Tether.lean` snapshot (commit `3582a57` of the may-form repo) plus `main3` (May 2).
Lean: `MayForm31/{Statement,Proofs}.lean`, local branch `may31-fixed-kappa` (commit `4e64989`, on top of `e79073b`; **not pushed**).
Toolchain: Lean v4.30.0-rc1, Mathlib `0c154d6`. There is no `sorry` and no `axiom`. Each theorem depends only on `propext, Classical.choice, Quot.sound` (see `axioms.txt`).
Mathlib has no Calderón–Zygmund theory, so C_CZ(3) is carried as `structure CZConstant3D` (C, C > 0). Its value is never used.

| May claim (snapshot line) | Lean | Status |
|---|---|---|
| Π_u u = 0 (L128, was `sorry`) | `projection` | PROVED |
| C2 degeneracy B(F,H)=0 at κ=C_CZ (L82–85, L102–119) | `degeneracy` | PROVED |
| κ := C_CZ(3) > 0 (L50–53, axiom `czc_3d_pos`) | `CZConstant3D`, `kappa` | CONDITIONAL on the named structure (value OPEN) |
| Step 4: κ=C_CZ is the least strength absorbing +C_CZ M² (L195) | `step4` | PROVED (elementary; needs the stretching bound, which is OPEN) |
| Existence: the tether satisfies symmetry, C1, C2, C3 (L56–93) | `existence` | PROVED, given a unit e ⟂ u. The kernel is collapsed to the weight ‖ω‖² (Q2) |
| **Thm 2.3 (primary): symmetric "metric correction" reading, per the author's answer to Q4** | `thm23` (alias `thm23_symmetric`) | CONDITIONAL on `StabilizerTransitive act u` |
| Note only, not Thm 2.3: literal May 31 "antisymmetric" wording (L222) | `thm23_literal_vacuous` | VACUOUS: no antisymmetric B satisfies C3 when ω ≠ 0 |
| Thm 2.3 with full L² isometry group as C1 | `thm23_symmetric_isometries` | PROVED (transitivity is proved via reflection) |
| Thm 2.3 with C1 = SDiff(T³) coadjoint action | — | OPEN (transitivity for SDiff is not shown) |
| main3: y' ≤ C − κy² ⇒ y ≤ max(y₀, √(C/κ)) | `main3_bound` | PROVED (pure ODE comparison) |
| TetherKernel = pointwise Biot–Savart double integral (L56–64) | — | OPEN (PipelineHalt SILENT) |
| u–ω Biot–Savart relation | — | OPEN (u and ω are independent in Lean) |
| NS vorticity obeys the bounding inequality (L87–93, L152–217) | — | OPEN. PipelineHalt heuristically matched `main3_bound`, which is wrong: the Lean does not formalize NS |
| Mollifier / estimates layer | — | OPEN |

**No global Navier–Stokes regularity or Clay result is claimed.** The fixed-κ specialization adds nothing beyond κ > 0.

## Halt questions for the author
- Q1 Space: L²(T³;ℝ³) vorticity fields, or the coadjoint orbit?
- Q2 Weight: pointwise |ω(x)|² inside the Biot–Savart kernel, or the collapsed ‖ω‖²?
- Q3 Should u be tied to ω by Biot–Savart?
- Q4 **ANSWERED by the author (2026-11-03), verbatim: "Symmetric, the metric correction reading".** Recorded in `anchor.json` → `clarifications` as `306cd9f98c70`. The heuristic matcher never generated this question, so it was recorded through the harness store with `record()` and a stable `mismatchId`.
- Q5 C1 = SDiff action vs abstract isometries; is "only |ω|² is invariant" meant as transitivity?
- Q1, Q2, Q3, Q5: still unanswered. The agent did not answer them.
- PipelineHalt `096a0a1135f6` (SILENT kernel): still OPEN, see `report.pending.json`. `17ee7eea9e88` (hC3 on `thm23_symmetric_isometries`) no longer fires because the map now pairs Thm 2.3 with `thm23` only. It was not answered.
- Harness limitation: `thm23` has drift 0.000 because its hypotheses (`StabilizerTransitive`, C1–C3) sit inside the `Stmt_thm23` Prop and not in binders, so the CONDITIONAL check does not see them. The status above is the ledger's call. The harness did not check it.

## Rerun (after Q4)
HALT (exit 2) · drift 0.111 (was 0.167) · 1 open question (`096a0a1135f6`) · 1 recorded answer.
