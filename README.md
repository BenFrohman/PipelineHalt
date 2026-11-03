# PipelineHalt

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

It does not recover intent the author never wrote down. Matching is token-based and heuristic, with no semantic or proof-level checking. A clean report means "no differences found by these checks", not "the formalization is faithful". Explicit `lean:` mappings in the anchor make results much more reliable than heuristic matching (see the example below).

## Usage

```sh
pipelinehalt extract --from paper.tex --out claims.json          # build an anchor from LaTeX/PDF
pipelinehalt check --anchor claims.json --lean src/ \
  --report-md report.md --report-json report.json                # non-interactive: writes .pipelinehalt/pending.json, exits 2 on HALT
pipelinehalt check --anchor claims.json --lean src/ --interactive  # ask on the terminal
pipelinehalt answer --anchor claims.json --from .pipelinehalt/pending.json
pipelinehalt answer --anchor claims.json --lean src/ --id 56d42291f91e --text "yes, 0-indexed primes"
pipelinehalt check ... --ci --max-drift 0.25                     # GitHub ::warning annotations
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

## Worked example: DHL[3,2] ⇒ liminf gap ≤ 6

`examples/dhl32/` runs PipelineHalt on [BenFrohman/DHL-3-2-implies-liminf-prime-gap-le-6](https://github.com/BenFrohman/DHL-3-2-implies-liminf-prime-gap-le-6) at commit `69a13d3`. Inputs are the paper `paper/DHL32_note.tex` (9 claims) and `DHL32/*.lean` (34 declarations).

**With explicit mappings** (`anchor.json`), the result is HALT with drift 0.245 and 7 open questions. The output is in `report.md` and `pending.json`.

- Theorem 3.1: `two_le_gap` and `gap_even` assume `1 ≤ n`, but the paper says n ≥ 2. This may be an indexing shift; the tool cannot tell, so it asks.
- Docstrings say "Theorem 1/2/3/4", but the paper prints 3.1, 3.2, 3.3 and 3.6.
- Theorem 3.3: the paper defines P via n mod 4 ∈ {0,1}, and no matched Lean statement mentions `{0,1}`. The Lean may phrase this as `n % 4 < 2`, which the syntactic check cannot equate.

**Heuristic only** (`anchor.extracted.json`, the `heuristic.*` files), the result is HALT with 5 questions, and it includes a **false SILENT** for Theorem 3.3: `Ptoy_DHL32` was assigned to Theorem 3.2 instead. The run also misses the n ≥ 1 vs n ≥ 2 finding. This is the main limitation: use explicit mappings.

The open questions above have **not** been answered. Only the author can answer them.

To reproduce: `node dist/src/bin.js check --anchor examples/dhl32/anchor.json --lean <clone>/DHL32`.

## Development

`npm install && npm test`. Paper: `paper/pipelinehalt.tex` (CC BY 4.0). Author: Benjamin Stanley Frohman.
