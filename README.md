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
