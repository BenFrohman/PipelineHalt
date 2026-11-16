---
name: lean-semantics-lock
description: >-
  Use this before any Lean formalization work, or any paper, abstract, title or
  Zenodo text describing a Lean result: sample the repo's locked
  intended_correspondence in Semantics.lean first, check that paper_claim is an
  honest independent transcription (never an alias of formal_claim), and reject
  any step or claim that doesn't transport across it.
---
# Semantics lock (Truth Gate)

The Truth Gate is the highest and final gate. Only true, honestly proved theorems pass it. This is a mandatory first step for every agent before it touches a Lean obligation or writes any public claim about one.

## The vacuity trap, and why it matters
A paper's claim is written in English, so Lean can only check `formal_claim ↔ paper_claim` once `paper_claim` is itself written in Lean.

If `paper_claim` is defined to be `formal_claim`, or merely unfolds to it or aliases it, then `intended_correspondence` is just `Iff.rfl`. The theorem proves nothing, and the gate would pass anything. That is forbidden.

## What the lock is
- Every formalization repo has `Semantics.lean`. It holds `formal_claim : Prop` (what the Lean development proves) and `paper_claim : Prop`.
- `paper_claim` is an independent, literal Lean transcription of the paper's or official statement, approved by the author. Its doc comment carries:
  - the verbatim English quote;
  - the paper file path and its sha256;
  - the page or section.
  It is written directly from the quote and never references `formal_claim`.
- It also holds `theorem intended_correspondence : formal_claim ↔ paper_claim`, proved with real reasoning (not `Iff.rfl` or `rfl`), using only propext, Classical.choice and Quot.sound, and zero sorry, admit or native_decide.
- Conditional results keep their hypotheses explicit inside both sides, as in `H₁ → … → Conclusion`. A conditional result is never stated as its bare conclusion.
- `truth-gate.lock.json` stores hashes of both statements, the paper sha256, the commit, the toolchain and the approver. Changing a locked statement needs the author's explicit approval and a new lock.
- `scripts/verify-lock.sh` and `.github/workflows/truth-gate.yml` (on push and PR to main) fail on any of these:
  - sorry or admit;
  - nonstandard axioms (`#print axioms intended_correspondence` and every public theorem);
  - a missing `Semantics.lean` or correspondence;
  - `paper_claim` referencing or aliasing `formal_claim`;
  - a correspondence proved by `Iff.rfl` or `rfl`;
  - a missing quote or sha256;
  - a failed `lake build`.
- `TRUTH_GATE.md` is the root instruction file every agent loads first. It explains this trap, the rule, and why nothing is published or claimed unless the gate passes.
- Every public, whitelisted theorem is obtained as `intended_correspondence.mp …`, or has a type proved equivalent to `paper_claim`.

## Steps
1. **Observe first, change nothing.** Run `#check intended_correspondence`, `#print paper_claim` and `#print formal_claim`.
   - Confirm that `paper_claim` matches the quoted English claim in meaning and is not an alias of `formal_claim`.
   - Confirm that the goal or claim you're about to state is the paper side.
2. Treat `simp`, instance resolution and automation as carrying only the locked interpretation. If a step changes the proposition, for example by narrowing, adding a hypothesis, or changing the function space, norm or domain, reject it.
3. If no lock exists, or `paper_claim` is vacuous or aliased, halt. Ask the author to approve an honest `paper_claim` transcription.
4. If the goal can't be shown to respect the equivalence, or the English claim is not what Lean proves, the gate stays red. Halt and report the exact mismatch: narrower, conditional, silent or different. Never invent a workaround, weaken the statement, or redefine `paper_claim` to match.
5. Public text such as titles, abstracts, READMEs and Zenodo records states exactly `paper_claim` as locked, plus the locked commit SHA, toolchain, `#print axioms` output and one rebuild command.
6. Never claim an open or Millennium problem is solved. The kernel only certifies that a proof inhabits the locked proposition. Whether the transcription is faithful to the English quote needs the author's or an independent reviewer's sign-off.
7. Never report math as 'probably' or 'likely'. Say only proved, disproved, or unsettled.
