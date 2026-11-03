# DHL-3-2-implies-liminf-prime-gap-le-6 (kept as examples/dhl32 so existing README/paper references keep working)
- 3 flags, all closed: 2 index shifts (0-indexed Lean `p`, 1-indexed paper) and 1 n%4<2 ↔ n%4∈{0,1}.
- Local branch pipelinehalt/align-wording (commit bad1a3f, NOT pushed): adds `Ptoy_iff_mod_four_mem`; `lake build` passed (8267 jobs); axioms: propext, Classical.choice, Quot.sound.

## Strict pass (2026-11-03)
- Kept the two index-shift closures. The equivalence follows directly from the definitions: Lean `p n := Nat.nth Nat.Prime n` (Basic.lean:10, so p 0 = 2) and paper p_1 = 2 (tex:48) give Lean `gap n` = paper p_{n+2} − p_{n+1}, so Lean n ≥ 1 ⇔ paper n ≥ 2. Kept the {0,1} closure, which is proved by `Ptoy_iff_mod_four_mem` (local branch, build-verified).

## Branches pushed (2026-11-03)
- pipelinehalt/align-wording pushed (bad1a3f). Map thm:model now includes Ptoy_iff_mod_four_mem; the {0,1} flag no longer fires (2 flags, both closed).
