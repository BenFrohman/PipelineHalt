# TRUTH_GATE.md — load this first

Every agent (bot, Grok chat, CI job or person) loads this file before it touches a Lean obligation or writes any
public claim (title, abstract, README, Zenodo record, chat answer) about a Lean result. The Truth Gate is the
highest and final gate: nothing is published or claimed unless it passes. The mandate is in
[docs/MANDATE.md](docs/MANDATE.md); the full procedure is the shared skill `lean-semantics-lock`
([copy](templates/truth-gate/observation-pass.md)).

## The vacuity trap
A paper's claim is English. Lean can check `formal_claim ↔ paper_claim` only once `paper_claim` is written in Lean.
If `paper_claim` is defined as `formal_claim`, unfolds to it, or shares its constants, then `intended_correspondence`
is `Iff.rfl`: it proves nothing and a gate built on it passes anything. That is forbidden.

## The rule
1. Each formalization repo has `Semantics.lean` with `formal_claim : Prop` (what the development proves),
   `paper_claim : Prop` and `theorem intended_correspondence : formal_claim ↔ paper_claim`.
2. `paper_claim` is an independent, literal transcription of the paper's (or official) statement, approved by the
   author. Its doc comment carries `@paper` (path), `@sha256` (of that file), `@section` and `@quote` (verbatim).
   It never references or aliases `formal_claim`.
3. `intended_correspondence` is proved by real reasoning: not `rfl`, `Iff.rfl`, `⟨id, id⟩`, `Iff.of_eq rfl`;
   no `sorry`, `admit`, `native_decide`; axioms only `propext`, `Classical.choice`, `Quot.sound`.
4. Conditional results keep every hypothesis inside both sides (`H₁ → … → Conclusion`).
5. Public theorems are obtained as `intended_correspondence.mp …` (or have type `paper_claim`).
6. `truth-gate.lock.json` fixes both statements, the paper sha256, commit, toolchain and approver. Changing a locked
   statement needs the author's explicit approval and a new lock.

## What the gate rejects (scripts/verify-lock.sh, .github/workflows/truth-gate.yml)
| Rejection | Where it is caught | Negative test |
|---|---|---|
| missing `Semantics.lean` | preflight (`missing-semantics`), check `a.semantics` | `tamper/missing-semantics` |
| missing correspondence | preflight (`missing-correspondence`), check `a.correspondence-source` | `tamper/missing-correspondence` |
| `paper_claim` references/aliases `formal_claim` | in-build audit, check `a.no-alias` | `negatives/alias`, `unfold-alias`, `shared-constant` |
| correspondence by `rfl` / `Iff.rfl` | in-build audit ("vacuous"), check `b.nontrivial` | `negatives/iff-rfl`, `by-rfl`, `id-intro`, `iff-of-eq`, `lambda-id` |
| `sorry` / `admit` / `native_decide` | in-build audit, checks `b.axioms`, `b.native`, `a.semantics-clean` | `negatives/sorry`, `admit`, `native-decide` |
| nonstandard axioms | in-build audit, check `b.axioms` | `negatives/axiom` |
| missing `@quote` / `@sha256` | `lock` refuses; check `a.provenance` on an approved lock | `negatives/missing-provenance`, `tamper/missing-quote`, `tamper/missing-sha256` |
| quote not in paper / wrong sha256 | checks `a.quote-verbatim`, `a.paper-sha256` | `negatives/bad-quote`, `bad-sha` |
| failed `lake build` | stage 1/3 (`lake-build-failed`) | `tamper/lake-build-failed` |

`negatives/*` are locked **and approved** from the bad file (`run-negatives.sh`); `tamper/*` edit a repo after its lock
was approved (`run-tamper.sh`). Both run in this repo's CI; the unmodified fixture is the passing demo.

## Harness order (scripts/verify-lock.sh)
0. preflight · 1. compile the Semantics module only · **2. observation pass, the first Lean step:**
`#check intended_correspondence`, `#print paper_claim`, `#print formal_claim`, `#print axioms` — it changes nothing ·
3. full `lake build` with the in-build `#eval` audit · 4. `lake env lean scripts/SemanticsLock.lean` · 5. `truth-gate check`.

## When it is red
Halt. Report the exact mismatch (narrower, conditional, silent, different). Never weaken a statement, redefine
`paper_claim`, edit the lock, or add a workaround to turn it green. A pass certifies only that the kernel accepted a
proof of the locked proposition; whether the transcription is faithful to the English quote needs the author's or an
independent reviewer's sign-off. Never claim an open or Millennium problem is solved. Report math only as proved,
disproved or unsettled.

## Public text
States exactly the locked `paper_claim`, plus the locked commit SHA, toolchain, `#print axioms` output and one
rebuild command (`scripts/verify-lock.sh`).
