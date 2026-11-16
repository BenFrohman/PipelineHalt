# Observation pass (mandatory first step)

Template source: the shared skill `lean-semantics-lock` (copied verbatim below, 2026-11-16). If the two ever differ, the shared skill wins; update this copy.

Run it with `pipelinehalt truth-gate observe --project . --goal-decl <thm>` (or `--goal "<Prop>"`). It runs `#check @intended_correspondence`, `#print paper_claim`, `#print formal_claim` and `#print axioms intended_correspondence`, tests the goal against `paper_claim` by definitional equality, writes `.pipelinehalt/observation.json`, and exits 2 (HALT) on a mismatch. `truth-gate check --require-observation` fails without a receipt for the current lock.

---

# Semantics lock (Truth Gate)
This is a mandatory first step for every agent before it touches a Lean obligation or writes any public claim about one.

## What the lock is
- Every formalization repo has `Semantics.lean`. It holds `paper_claim : Prop`, a literal Lean transcription of the paper's or official statement that the author approved, and the formal statement `formal_claim : Prop`.
- It also holds `theorem intended_correspondence : formal_claim ↔ paper_claim`, proved with only propext, Classical.choice and Quot.sound, and zero sorry.
- Conditional results keep their hypotheses explicit inside both sides, as in `H₁ → … → Conclusion`. A conditional result is never stated as its bare conclusion.
- A lock file `truth-gate.lock.json` stores hashes of those statements plus the commit, toolchain and approver. Changing a locked statement needs the author's explicit approval and a new lock.
- Every public, whitelisted theorem is obtained as `intended_correspondence.mp …`, or has a type proved equivalent to `paper_claim`. Intermediate lemmas can stay local.
- The default `lake build` fails if Semantics isn't imported, if a whitelisted theorem doesn't transport, or if a nonstandard axiom or sorry appears.

## Steps
1. **Observe first, change nothing.** Run `#check intended_correspondence` and `#print paper_claim`. Confirm the current goal or the claim you're about to state is the paper side, word for word in meaning. Only then are tactics, `simp`, rewrites or text edits allowed.
2. Treat `simp`, instance resolution and automation as carrying only the locked interpretation. If a step changes the proposition, for example by narrowing, adding a hypothesis, or changing the function space, norm or domain, reject it.
3. If no lock exists in the repo, halt. Ask the author to approve a `paper_claim` transcription before doing any public-interface work.
4. If the goal can't be shown to respect the equivalence, halt and report the exact mismatch: narrower, conditional, silent or different. Never invent a workaround or weaken the statement.
5. Public text such as titles, abstracts, READMEs and Zenodo records states exactly `paper_claim` as locked, plus the locked commit SHA, toolchain, `#print axioms` output and one rebuild command.
6. Never claim an open problem is solved. The lock only guarantees the certificate inhabits the locked proposition. Whether the transcription matches the author's intent is the author's sign-off, not something the kernel checks.
7. Never report math as 'probably' or 'likely'. Say only proved, disproved, or unsettled.
