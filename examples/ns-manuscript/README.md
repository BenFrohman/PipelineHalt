# NS manuscript (revised, local NS commit 36df018) vs NS Lean (b5815e0 + extracts)

- `main.tex`: copy of NS_Millennium_Proof/manuscript/main.tex at 36df018 (NS repo not pushed).
- `anchor.json`: `pipelinehalt extract --from main.tex` (8 theorem-environment claims).
- `pipelinehalt.map.json`: hand-written claim→Lean map from the declarations each environment cites.
- `report.*`, `REPORT.md`, `pending.json`: `check --lean <NS>/NS_Millennium_Proof`.

Result: HALT, drift 0.637, 26 open questions, all unanswered (answers belong to the author).
Extract only picks up theorem/lemma/proposition/definition environments, so the rewritten prose
sections (metriplectic bracket, zero-damping caveat) are not checked as claims.
