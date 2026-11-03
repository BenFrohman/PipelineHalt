# frohmanian-symplectic-tether: strict pass (2026-11-03, batch 2)

- Claims source: `paper/companion.tex` (30 claims, extracted by `pipelinehalt extract`).
- Map: auto-generated. Each claim maps to the \\lean/\\texttt names it cites that exist as declarations (grep of `git ls-files '*.lean'`). Claims that cite no existing names fall back to heuristic pairing.
- Flags: 51. Closed: 3. Open: 48.
- Closures are mechanical only:
  - A title flag is closed when the title's cited Lean names are all existing mapped declarations.
  - A hypothesis flag is closed when the paper's statement literally cites that hypothesis name via \\lean{} or \\texttt{}.
  - Nothing else was closed. In particular, no implicit-domain judgments and no semantic equivalence calls.
- The open flags have not been triaged by hand. Each is a halt question for the author, not a confirmed gap.
- No Lean changes.
