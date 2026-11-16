# PipelineHalt

[![ci.yml](https://github.com/BenFrohman/PipelineHalt/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/BenFrohman/PipelineHalt/actions/workflows/ci.yml) [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23927311.svg)](https://doi.org/10.5281/zenodo.23927311)

PipelineHalt is a standalone companion to [RecurringAlignment](https://github.com/BenFrohman/RecurringAlignment). It compares the claims a paper makes with the Lean statements that are supposed to formalize them. When the two differ, it **halts and asks a precise clarification question** instead of guessing.

- **Anchor**: the paper's claims, in JSON, Markdown, or LaTeX (`\begin{theorem}...`). PDF is supported on a best-effort basis through `pdftotext`.
- **Live artifact**: the `theorem`/`lemma`/`def`/`structure`/`axiom` declarations in `.lean` files.
- **Flags**:
  - SILENT: no Lean statement corresponds to the claim.
  - NARROWER: the Lean has a stronger lower bound or drops a set the claim mentions.
  - CONDITIONAL: the Lean relies on an unstated hypothesis, `sorry`, or a project axiom.
  - AMBIGUOUS: the paper wording is hedged or empty, the title doesn't match the statement, ids are duplicated, or the docstring numbering disagrees with the paper.
- **Never auto-corrects.** Answers are stored verbatim in the anchor under stable ids, so the same question is never asked twice. Claims themselves are never edited.

## What it does not do

It does not recover intent the author never wrote down. Matching is token-based and heuristic, with no semantic or proof-level checking. A clean report means "no differences found by these checks", not "the formalization is faithful". A hand-written [mapping file](#the-mapping-file-pipelinehaltmapjson) makes results much more reliable than heuristic matching. It is still human-authored and does not validate meaning.

## Truth Gate (semantics lock)

The Truth Gate binds the formal certificate to one fixed, author-approved proposition. Every formalization repo carries a `Semantics.lean` with:

```lean
/-- @paper: paper/main.tex @sha256: <sha256 of that file> @section: Theorem 1.2 @quote: "<the paper's claim, verbatim>" -/
def paper_claim : Prop := …    -- independent, literal Lean transcription of the quoted claim, approved by the author
def formal_claim : Prop := …   -- the same statement in the development's own definitions
theorem intended_correspondence : formal_claim ↔ paper_claim := …   -- or `formal_claim → paper_claim` for a one-way result
theorem main_result : paper_claim := intended_correspondence.mp …   -- public results are obtained only by transport
```

`paper_claim` is written independently of the development: it must never be defined as, reference, unfold to or alias `formal_claim`, and it shares no project constant with `formal_claim`'s dependency closure. Its doc comment carries the provenance (paper path, the file's SHA-256, section or page, and the verbatim quote), which the lock records and the gate re-verifies against the paper file.

Conditional results keep every hypothesis inside `paper_claim` (`H₁ → H₂ → Conclusion`); they are never stated as their bare conclusion. A template is in [`templates/truth-gate/Semantics.lean`](templates/truth-gate/Semantics.lean).

**What it guarantees, and what it does not.** A Lean equivalence relates two Lean propositions, so the gate can only check that the certificate inhabits the locked `paper_claim`. Whether `paper_claim` says what the paper means is the author's sign-off, recorded in the lock. The kernel does not check that. Once both sides are proved, `formal_claim ↔ paper_claim` holds trivially, so what the certificate establishes is that `paper_claim` is inhabited. The `↔` documents the link, and the lock freezes `paper_claim`. The gate makes no claim about any open problem beyond the locked statement.

### Workflow

```sh
pipelinehalt truth-gate observe --project . --goal-decl My.thm   # MANDATORY FIRST STEP; changes nothing (see below)
pipelinehalt truth-gate lock    --project . --root My.Semantics,My.Main --prefix My --semantics My/Semantics.lean \
  --headline main_result --paper paper/main.tex --claim thm:main  # proposes an UNAPPROVED lock (approval: null)
pipelinehalt truth-gate approve --lock truth-gate.lock.json --by "Frohman, Benjamin Stanley"   # the author approves
pipelinehalt truth-gate emit-lean --lock truth-gate.lock.json   # writes scripts/SemanticsLock.lean (in-build #eval audit)
pipelinehalt truth-gate check   --project . --require-observation --ci --report-md report.md --badge badge.json
```

`truth-gate.lock.json` ([schema](templates/truth-gate/truth-gate.lock.schema.json)) records the SHA-256 of the normalized source of `paper_claim` and of the statement of `intended_correspondence`, the SHA-256 of their elaborated terms, Lean's 64-bit structural hashes (for the in-build audit), fingerprints of every project definition `paper_claim` unfolds to, `#print axioms intended_correspondence`, the public whitelist (`headlines`), the theorems deliberately left outside the gate (`auxiliary`, each with a reason), the paper source and the result claims, the commit, the toolchain, and the approval (who, when, digest). The approval digest covers every field except the approval itself and the paper-side answers, so any edit to the lock invalidates the approval.

### Checks

| group | check | rejects |
|---|---|---|
| o | observation pass | `check --require-observation` without a receipt for the current lock digest, or a receipt whose goal is not `paper_claim` |
| a | provenance | no `@paper / @sha256 / @section / @quote` doc comment on `paper_claim` (`lock` refuses too); a paper file that is missing or whose SHA-256 differs; a quote that does not occur verbatim (whitespace-insensitive) in the paper; provenance that differs from the approved lock |
| a | independence (no alias) | `paper_claim`'s dependency closure (values and types, project-local constants) contains `formal_claim`, or `formal_claim`'s contains `paper_claim`; the two closures share any project constant; or `paper_claim` and `formal_claim` are definitionally equal. Strict, no exception list |
| a | lock integrity | missing `Semantics.lean`; unapproved lock, or a lock edited after approval; any change to the normalized source or the elaborated term of `paper_claim`, to the statement of `intended_correspondence`, or to a definition `paper_claim` unfolds to; `paper_claim` defined through `formal_claim`, the correspondence, a theorem or an axiom; `sorry`/`admit`/`axiom`/`native_decide`/`opaque` in `Semantics.lean`; declarations outside a `Semantics` module; a toolchain change |
| b | correspondence | a vacuous proof term: `Iff.rfl`, `Iff.refl _`, `rfl`, `Eq.refl _`, `id`, `Iff.of_eq rfl`, `fun h => h`, or `Iff.intro` of two identities (including what `by rfl` elaborates to); `native_decide` / compiler trust (`Lean.ofReduceBool`, `Lean.trustCompiler`), named explicitly; `intended_correspondence` not a theorem; not of the locked form (`formal_claim ↔ paper_claim`, or `formal_claim → paper_claim`); any axiom beyond propext, Classical.choice, Quot.sound (including `sorryAx`) |
| c | transport | any headline or paper-cited theorem (from `\lean{}`, `% lean:`, `\texttt{}`, `\path{}`) whose type is not definitionally `paper_claim` and whose proof does not use `intended_correspondence` (transitively), unless the lock marks it auxiliary: "does not transport". Also rejects missing headlines, non-standard axioms, an auxiliary headline, and a whitelist where no theorem has type `paper_claim` |
| d | paper side | each listed result claim against `paper_claim`, using the existing narrower/conditional/silent classifier, plus values the claim asserts (`= N`) that `paper_claim` never mentions and wording such as "solves", "settles", "unconditional" in the claims or title. Open findings HALT (exit 2) until answered; an answer with verdict other than intentional fails |

On pass the badge (`--badge`, shields endpoint JSON) and the summary say **"formal certificate inhabits the locked statement"**. They never say more than that.

### Enforcement inside `lake build`

`truth-gate emit-lean` generates `scripts/SemanticsLock.lean` from an approved lock. Add it to the default target ([snippet](templates/truth-gate/lakefile-snippet.lean)). The default `lake build` then fails (`throwError` in an `#eval`) unless `Semantics` is imported, `paper_claim` and `intended_correspondence` are unchanged (Lean structural hash), the correspondence has the locked form, a non-vacuous proof term and standard axioms (no `sorryAx`, no `Lean.ofReduceBool` / `Lean.trustCompiler`), `paper_claim` is independent of `formal_claim` (closure walk and defeq test, as in check a), and every whitelisted theorem has type `paper_claim` (by defeq) or is proved through `intended_correspondence`, with standard axioms only. CI also runs it directly with `lake env lean scripts/SemanticsLock.lean`.

### Observation pass (mandatory first step)

`truth-gate observe` runs `#check @intended_correspondence`, `#print paper_claim`, `#print formal_claim` and `#print axioms intended_correspondence`, changes nothing, and with `--goal-decl <thm>` or `--goal "<Prop>"` tests the obligation against `paper_claim` by definitional equality. On a mismatch it prints HALT and exits 2: no tactic, rewrite or text edit is allowed, and the agent reports the mismatch. The template for this step is the shared skill `lean-semantics-lock` ([copy](templates/truth-gate/observation-pass.md)). The [chat protocol](templates/chat-protocol.md) makes it step 0.

### CI

Formalization repos call the reusable workflow:

```yaml
jobs:
  truth-gate:
    uses: BenFrohman/PipelineHalt/.github/workflows/truth-gate.yml@main
```

It installs elan and fetches the Mathlib cache (`lake exe cache get`) without rebuilding Mathlib. It then runs `lake build` (with the in-build lock), `lake env lean scripts/SemanticsLock.lean`, the observation pass and `truth-gate check --require-observation`, and uploads the report, badge, build log and observation receipt. This repository's own CI runs the whole path end to end on a core-Lean fixture (`test/fixtures/truth-gate-lean`), including a tampered `paper_claim` that still compiles but must fail both `lake build` and the gate, and [`run-negatives.sh`](test/fixtures/truth-gate-lean/run-negatives.sh): one real-Lean negative per rejection (alias, defeq alias, shared constant, `Iff.rfl`, `by rfl`, `⟨id, id⟩`, `Iff.of_eq rfl`, `fun h => h`, `sorry`, `admit`, `native_decide`, a non-standard axiom, a missing provenance, a quote not in the paper, a wrong SHA-256). Each negative is locked **and approved**, and must still fail the gate (and, except the provenance file checks, `lake build`). A mismatch keeps the gate red and is reported; it is never patched around.

### Limits

- The provenance checks prove the quote is in the paper file and the file is the hashed one; they do not prove the Lean transcription matches the quote. The in-build audit does not read the paper file (no SHA-256 in core Lean); the provenance file checks run in `truth-gate check`.
- The vacuity check recognizes the listed trivial proof terms. A correspondence can still be short when both sides are close; independence of `paper_claim` is what prevents the correspondence from being true by construction.
- The transcription is the author's responsibility. The gate cannot tell whether `paper_claim` captures the paper's intent.
- Theorems the paper cites from modules that the lock's `roots` do not import are not seen. Two modules that cannot be imported together (duplicate declarations) cannot both be roots.
- The paper-side check is heuristic. It catches extra hypotheses, restricted domains, omitted sets, asserted values missing from `paper_claim`, and overclaiming words. It does not prove that the prose and the Lean say the same thing.
- The in-build audit compares Lean's 64-bit structural hash, which detects edits but is not a cryptographic commitment. The CI check compares SHA-256 of the source and of the elaborated terms.
- The elaborated hashes depend on the toolchain, so a toolchain bump needs a new, re-approved lock.

## Usage

```sh
pipelinehalt extract --from paper.tex --out claims.json          # build an anchor from LaTeX/PDF
pipelinehalt check --anchor claims.json --lean src/ \
  --report-md report.md --report-json report.json                # non-interactive: writes .pipelinehalt/pending.json, exits 2 on HALT
pipelinehalt check --anchor claims.json --lean src/ --interactive  # ask on the terminal
pipelinehalt answer --anchor claims.json --from .pipelinehalt/pending.json
pipelinehalt answer --anchor claims.json --lean src/ --id 56d42291f91e --text "yes, 0-indexed primes"
pipelinehalt check ... --ci --max-drift 0.25                     # GitHub ::warning annotations
pipelinehalt check ... --map other.map.json   # or --no-map  (default: auto-discover pipelinehalt.map.json)
pipelinehalt agent < request.json                                # JSON protocol pipelinehalt/1
pipelinehalt prompt                                              # chat/agent prompt template
```

Exit codes: `0` aligned, `1` drift above `--max-drift`, `2` HALT (open questions), `3` usage error.

Drift weights per mismatch: silent 1.0, narrower 0.6, conditional 0.5 (sorry 0.8, axiom 0.7), ambiguous 0.3. Claim drift is capped at 1. An answer marked intentional sets the weight to 0, a free-text answer halves it, and an unintended answer keeps the full weight.

### Grok chats and agents

- `pipelinehalt agent` reads `{anchor, lean | leanSources, answers?, options?}` on stdin and returns `{protocol, status, exitCode, drift, questions[], recorded[], anchor, report}`.
- An agent must pass `questions[]` to the human unchanged, then resend the human's answers in `answers`. It must never answer them itself.
- `templates/chat-protocol.md` holds the same rules for pasting into a chat.

### CI

`templates/pipelinehalt.yml` is a sample GitHub Actions workflow.

### Anchor formats

- **JSON**: `{title, claims:[{id, number?, title?, statement, kind?, lean?:[names], assumptions?:[text]}], clarifications:{}}`.
- **Markdown**: one `## Claim <id> (<number>): <title>` section per claim, followed by the statement and optional `- lean:`, `- assumes:` and `- kind:` lines. Answers go into a fenced `json pipelinehalt-clarifications` block.
- **LaTeX/PDF**: claims are extracted, and a `% lean: name1, name2` comment inside an environment maps it explicitly. Answers go to the `<file>.pipelinehalt.json` sidecar; the source file is never edited.

## The mapping file (`pipelinehalt.map.json`)

On a first run, most of the noise comes from **pairing**: the heuristic attaches a Lean declaration to the wrong claim, or it flags Lean docstrings that use their own numbering ("Theorem 1") while the paper prints "Theorem 3.1". The mapping file fixes that. It is a small hand-written JSON file kept **separate from the paper claims**, so re-extracting the anchor from LaTeX never loses it.

**Where it lives.** PipelineHalt looks for `pipelinehalt.map.json` first beside the anchor file, then in each parent directory up to the repository root (the first directory containing `.git`). The first file found is used **by default**.
- `--map <file>` uses a specific file.
- `--no-map` disables mapping entirely (pure heuristic pairing).
- In the agent protocol, pass `"map": "<path>"`, an inline map object, or `false`.

The report names the mapping file it used, if any.

**Format:**

```json
{
  "version": 1,
  "note": "optional free text",
  "claims": {
    "<claim id>": {
      "lean": ["LeanDeclName", "..."],
      "aliases": ["Theorem 1"],
      "note": "optional"
    }
  },
  "unclaimed": { "SomeLeanDecl": "why it is deliberately not mapped" }
}
```

- `claims.<id>.lean` (required): the Lean declarations for that claim. The id must match an anchor claim id, for example the LaTeX `\label`. Unknown ids produce a warning. A map entry overrides any `lean` list in the anchor. Mapped claims **skip heuristic pairing**; a mapped name that doesn't exist is reported as SILENT.
- `aliases`: other labels that mean this claim, matched case-insensitively. A docstring citing an alias does not raise the "docstring calls itself Theorem N" question.
- `unclaimed`: Lean declarations deliberately not tied to any claim. They suppress the informational "cites X but is not matched" line.

**What it does not do.** The mapping is the author's assertion of *where to look*. PipelineHalt still runs all of its bound, set, hypothesis, `sorry` and axiom checks on the mapped declarations, and it never checks that a mapping is semantically right. A wrong mapping gives wrong results.

**Concrete example:** `examples/dhl32/pipelinehalt.map.json` (excerpt).

```json
"thm:gaps": {
  "lean": ["two_le_gap", "gap_even", "not_H1Le_one", "H1Le_three_iff_two", "H1Le_three_iff_twin"],
  "aliases": ["Theorem 1"],
  "note": "Lean docstrings number the main results 1-4; the paper prints 3.1, 3.2, 3.3, 3.6."
},
"thm:main": { "lean": ["dhl32_H1Le_six"], "aliases": ["Theorem 2"] },
```

## Worked example: DHL[3,2] ⇒ liminf gap ≤ 6

`examples/dhl32/` runs PipelineHalt on [BenFrohman/DHL-3-2-implies-liminf-prime-gap-le-6](https://github.com/BenFrohman/DHL-3-2-implies-liminf-prime-gap-le-6) at commit `69a13d3`. The inputs are the paper `paper/DHL32_note.tex` (9 claims, extracted verbatim into `anchor.json`, with no Lean names) and `DHL32/*.lean` (34 declarations).

| Run | Files | Status | Drift | Open questions | Unmatched-citation notes |
|---|---|---|---|---|---|
| No mapping (`--no-map`) | `nomap.*` | HALT | 0.267 | 5 (1 false SILENT, 3 numbering, 1 spurious hypothesis) | 3 |
| Mapping file (default) | `report.*`, `pending.json` | HALT | 0.160 | 3 | 0 |

Without the mapping, the heuristic gets several things wrong, and the results are kept as-is:
- `Ptoy_DHL32` is paired with Theorem 3.2, giving a **false SILENT** for Theorem 3.3.
- It asks about an `H.card = 3` hypothesis that comes from pairing the wrong declaration.
- It misses the n ≥ 1 vs n ≥ 2 difference entirely.

With the mapping file, three questions remain. They are real syntactic differences that **still need the author's answer**, and the tool does not decide them:
- Theorem 3.1: `two_le_gap` and `gap_even` assume `1 ≤ n`, but the paper says n ≥ 2. This may be the 0- vs 1-indexing of primes, but that is the author's call.
- Theorem 3.3: the paper defines P by n mod 4 ∈ {0,1}, and no mapped Lean statement mentions `{0,1}`. `Ptoy` is defined as `n % 4 < 2`, which is equivalent over ℕ, so this is probably a false positive that the syntactic check cannot rule out.

None of these questions has been answered here. To reproduce, from `examples/dhl32/`: `node ../../dist/src/bin.js check --anchor anchor.json --lean <clone>/DHL32`; add `--no-map` for the baseline.

## Development

`npm install && npm test`. Paper: `paper/pipelinehalt.tex` (CC BY 4.0). Author: Benjamin Stanley Frohman.

## Zenodo archive

- Version 0.4.0: [10.5281/zenodo.23927311](https://doi.org/10.5281/zenodo.23927311)
- All versions (concept DOI): [10.5281/zenodo.23927310](https://doi.org/10.5281/zenodo.23927310)

## License and copyright

Licensed under the MIT License. See [`LICENSE`](LICENSE).

© 2026 Benjamin Stanley Frohman.
