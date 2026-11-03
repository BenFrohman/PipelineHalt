# collatz-teaming-lemma: manual reviewer notes (PipelineHalt run 2026-11-03)

- No theorem environments. Anchor hand-built verbatim from the abstract (tex:24): 3 claims.
- `RemainingLemma` := ∀ n>0, ∃ k, iter k n = 1 (ReverseTree.lean:20). So `remaining_lemma_iff_collatz` is close to a restatement of the Collatz conjecture, and the conjecture itself stays open (the paper says so).
- model-mean-observation (3n-1 cycles at 1, 5, 17): no Lean declaration, and the paper says it lives in companion notes. It is mapped to `[]`, but PipelineHalt treats an empty list as "no mapping" and falls back to the heuristic, which picks unrelated decls (harness quirk). The open flag is kept; the honest status is SILENT/unformalized.
