# p2q-jumps-lean: manual reviewer notes (PipelineHalt run 2026-11-03)

- No theorem environments in the repo paper (paper/verification_certificate.tex is an axiom table). Anchor hand-built verbatim from README.md:9 and :19.
- Open (true gap, as the README itself says): Theorem 28 is only a Prop `Theorem28`; `theorem28_from_paper` assumes it. Only `g_ge_six` is unconditional.
