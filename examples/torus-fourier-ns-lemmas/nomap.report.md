# PipelineHalt report: Fourier Lemmas on the Three-Torus: Heat Smoothing, the $L^2$ Strain Identity,\\ and the Curl of the Energy Derivative, Formalised in Lean~4

Status: **HALT** · overall drift **0.747** · 9 claims · 276 Lean declarations scanned · 20 open question(s)

Mapping file: none (heuristic pairing only).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Lemma 1 | `parseval_norm_sq` (0.529) | 0.300 | 1 | 0 |
| Lemma 2 | `norm_multiplier_le` (0.306), `l1_le` (0.247), `memℓp_mul` (0.22), `clampC_norm_le` (0.212) | 0.650 | 2 | 0 |
| Theorem 3 | `heat_zero` (0.32), `galerkinTameEnergyInequality_of_gt` (0.275), `inHs_zero` (0.246), `ennCS` (0.246) | 0.840 | 2 | 0 |
| Lemma 4 | `one_add_pow_mul_exp_le` (0.349), `rpow_sub_rpow_le_of_le` (0.313), `one_le_sobW` (0.24), `young_l2_l1` (0.24) | 0.968 | 4 | 0 |
| Theorem 5 | `heat_smoothing` (0.425), `heat_smoothing_real` (0.39) | 0.930 | 4 | 0 |
| Theorem 6 | `rpow_le_factorial_ceil_mul_exp` (0.279) | 0.600 | 1 | 0 |
| Lemma 7 | `curl_sq_eq` (0.225) | 0.500 | 1 | 0 |
| Theorem 8 | `L2_strain_eq` (0.266), `strain_sq_eq_half_curl_sq` (0.208) | 0.938 | 4 | 0 |
| Theorem 9 | — | 1.000 | 1 | 0 |

## Lemma 1 — Parseval, \texttt{parseval\_norm\_sq}

- `6b895c5da671` AMBIGUOUS: Title “Parseval, \texttt{parseval\_norm\_sq}” shares almost no terms with the statement. — **OPEN**

## Lemma 2 — \texttt{norm\_multiplier\_le}

- `76d4a6a87f7e` AMBIGUOUS: Title “\texttt{norm\_multiplier\_le}” shares almost no terms with the statement. — **OPEN**
- `bf6529c937ee` CONDITIONAL: `memℓp_mul` assumes `a : lp (fun _ : Mode => ℂ) 2`, not stated in the claim. — **OPEN**

## Theorem 3

- `6b8198593c17` NARROWER: `galerkinTameEnergyInequality_of_gt` restricts s ≥ 3; the claim states no such restriction. — **OPEN**
- `993daebb9399` NARROWER: `galerkinTameEnergyInequality_of_gt` restricts s ≥ 2; the claim states no such restriction. — **OPEN**

## Lemma 4

- `ef4fe9efd048` NARROWER: `rpow_sub_rpow_le_of_le` restricts p ≥ 1; the claim states no such restriction. — **OPEN**
- `03016963038d` NARROWER: `rpow_sub_rpow_le_of_le` uses x ≥ 1 where the claim says x ≥ 0 (Lean is narrower). — **OPEN**
- `3299d8c43637` NARROWER: `one_le_sobW` restricts s ≥ 0; the claim states no such restriction. — **OPEN**
- `d0576e323355` CONDITIONAL: `young_l2_l1` assumes `F G : Mode → ℝ≥0∞`, not stated in the claim. — **OPEN**

## Theorem 5 — \texttt{heat\_smoothing}

- `55cf13bac57c` AMBIGUOUS: Title “\texttt{heat\_smoothing}” shares almost no terms with the statement. — **OPEN**
- `25140358fd60` CONDITIONAL: `heat_smoothing` assumes `hf : InHs s f`, not stated in the claim. — **OPEN**
- `7e6e9fa6debd` NARROWER: `heat_smoothing_real` uses k ≥ 0 where the claim says k ≥ 2 (could be an indexing shift; direction not decidable syntactically). — **OPEN**
- `4d0330521990` CONDITIONAL: `heat_smoothing_real` assumes `hf : InHs s f`, not stated in the claim. — **OPEN**

## Theorem 6 — \texttt{heat\_smoothing\_real}

- `ad0dfabfd216` NARROWER: `rpow_le_factorial_ceil_mul_exp` restricts y ≥ 0; the claim states no such restriction. — **OPEN**

## Lemma 7

- `f16200262bf9` CONDITIONAL: `curl_sq_eq` assumes `hdiv : dot k u = 0`, not stated in the claim. — **OPEN**

## Theorem 8 — \texttt{L2\_strain\_eq}

- `2408b2d1ad5a` CONDITIONAL: `L2_strain_eq` assumes `hdiv : ∀ n, dot (kvec n) (fun j => coeff (u j) n) = 0`, not stated in the claim. — **OPEN**
- `0fb92af2a8d6` CONDITIONAL: `L2_strain_eq` assumes `hω : ∀ n i, coeff (ω i) n = curlSym (kvec n) (fun j => coeff (u j) n) i`, not stated in the claim. — **OPEN**
- `b4307a42321b` CONDITIONAL: `L2_strain_eq` assumes `hS : ∀ n i j, coeff (S i j) n = strainSym (kvec n) (fun j => coeff (u j) n) i j`, not stated in the claim. — **OPEN**
- `82c2e70e73eb` CONDITIONAL: `strain_sq_eq_half_curl_sq` assumes `hdiv : dot k u = 0`, not stated in the claim. — **OPEN**

## Theorem 9

- `df440186114b` SILENT: No Lean declaration matches this claim. Closest candidate: `modeEnergy_curl` (score 0.19, below threshold 0.2). — **OPEN**

## Realignment notes

- Lemma 1: answer `6b895c5da671` — Paper claim Lemma 1 (lemma-1) states: “$\|f\|_2^2=\sum_n|\hat f(n)|^2$.”. Its title is “Parseval, \texttt{parseval\_norm\_sq}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 2: answer `76d4a6a87f7e` — Paper claim Lemma 2 (lemma-2) states: “If $|m(n)|\le1$ for all $n$, then $T_m f=\sum m(n)\hat f(n)e_n$ defines $T_m:L^2\to L^2$ with $\|T_mf\|_2\le\|f\|_2$.”. Its title is “\texttt{norm\_multiplier\_le}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 2: answer `bf6529c937ee` — Paper claim Lemma 2 (lemma-2) states: “If $|m(n)|\le1$ for all $n$, then $T_m f=\sum m(n)\hat f(n)e_n$ defines $T_m:L^2\to L^2$ with $\|T_mf\|_2\le\|f\|_2$.”. Lean lemma `memℓp_mul` assumes `a : lp (fun _ : Mode => ℂ) 2`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 3: answer `6b8198593c17` — Paper claim Theorem 3 (theorem-3) states: “For $\nu,s,t\ge0$: $\widehat{e^{t\nu\Delta}f}(n)=e^{-\nu|n|^2t}\hat f(n)$, $e^{0}=\mathrm{id}$, $e^{s\nu\Delta}e^{t\nu\Delta}=e^{(s+t)\nu\Delta}$, $\|e^{t\nu\Delta}f\|_2\le\|f\|_2$.”. Lean theorem `galerkinTameEnergyInequality_of_gt` assumes `5 / 2 < s₀` (restricting s ≥ 3), which the claim does not state. Is the restricted domain intentional?
- Theorem 3: answer `993daebb9399` — Paper claim Theorem 3 (theorem-3) states: “For $\nu,s,t\ge0$: $\widehat{e^{t\nu\Delta}f}(n)=e^{-\nu|n|^2t}\hat f(n)$, $e^{0}=\mathrm{id}$, $e^{s\nu\Delta}e^{t\nu\Delta}=e^{(s+t)\nu\Delta}$, $\|e^{t\nu\Delta}f\|_2\le\|f\|_2$.”. Lean theorem `galerkinTameEnergyInequality_of_gt` assumes `2 ≤ s` (restricting s ≥ 2), which the claim does not state. Is the restricted domain intentional?
- Lemma 4: answer `ef4fe9efd048` — Paper claim Lemma 4 (lemma-4) states: “For $k\in\mathbb N$, $a>0$, $x\ge0$: $(1+x)^ke^{-ax}\le k!\,e^a a^{-k}$.”. Lean lemma `rpow_sub_rpow_le_of_le` assumes `1 ≤ p` (restricting p ≥ 1), which the claim does not state. Is the restricted domain intentional?
- Lemma 4: answer `03016963038d` — Paper claim Lemma 4 (lemma-4) states: “For $k\in\mathbb N$, $a>0$, $x\ge0$: $(1+x)^ke^{-ax}\le k!\,e^a a^{-k}$.”. Lean lemma `rpow_sub_rpow_le_of_le` assumes `0 < x` (x ≥ 1), but the claim says x ≥ 0. Is this an intentional indexing convention or a genuine change of domain?
- Lemma 4: answer `3299d8c43637` — Paper claim Lemma 4 (lemma-4) states: “For $k\in\mathbb N$, $a>0$, $x\ge0$: $(1+x)^ke^{-ax}\le k!\,e^a a^{-k}$.”. Lean lemma `one_le_sobW` assumes `0 ≤ s` (restricting s ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Lemma 4: answer `d0576e323355` — Paper claim Lemma 4 (lemma-4) states: “For $k\in\mathbb N$, $a>0$, $x\ge0$: $(1+x)^ke^{-ax}\le k!\,e^a a^{-k}$.”. Lean theorem `young_l2_l1` assumes `F G : Mode → ℝ≥0∞`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 5: answer `55cf13bac57c` — Paper claim Theorem 5 (theorem-5) states: “For $\nu,t>0$, $s\in\mathbb R$, $k\in\mathbb N$, $f\in H^s$: $e^{t\nu\Delta}f\in H^{s+k}$ and $\|e^{t\nu\Delta}f\|_{H^{s+k}}^2\le k!\,e^{2\nu t}(2\nu t)^{-k}\|f\|_{H^s}^2$.”. Its title is “\texttt{heat\_smoothing}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 5: answer `25140358fd60` — Paper claim Theorem 5 (theorem-5) states: “For $\nu,t>0$, $s\in\mathbb R$, $k\in\mathbb N$, $f\in H^s$: $e^{t\nu\Delta}f\in H^{s+k}$ and $\|e^{t\nu\Delta}f\|_{H^{s+k}}^2\le k!\,e^{2\nu t}(2\nu t)^{-k}\|f\|_{H^s}^2$.”. Lean theorem `heat_smoothing` assumes `hf : InHs s f`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 5: answer `7e6e9fa6debd` — Paper claim Theorem 5 (theorem-5) states: “For $\nu,t>0$, $s\in\mathbb R$, $k\in\mathbb N$, $f\in H^s$: $e^{t\nu\Delta}f\in H^{s+k}$ and $\|e^{t\nu\Delta}f\|_{H^{s+k}}^2\le k!\,e^{2\nu t}(2\nu t)^{-k}\|f\|_{H^s}^2$.”. Lean theorem `heat_smoothing_real` assumes `0 ≤ k` (k ≥ 0), but the claim says k ≥ 2. Is this an intentional indexing convention or a genuine change of domain?
- Theorem 5: answer `4d0330521990` — Paper claim Theorem 5 (theorem-5) states: “For $\nu,t>0$, $s\in\mathbb R$, $k\in\mathbb N$, $f\in H^s$: $e^{t\nu\Delta}f\in H^{s+k}$ and $\|e^{t\nu\Delta}f\|_{H^{s+k}}^2\le k!\,e^{2\nu t}(2\nu t)^{-k}\|f\|_{H^s}^2$.”. Lean theorem `heat_smoothing_real` assumes `hf : InHs s f`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 6: answer `ad0dfabfd216` — Paper claim Theorem 6 (theorem-6) states: “The same holds for every real $k\ge0$ with $k!$ replaced by $\lceil k\rceil!$.”. Lean lemma `rpow_le_factorial_ceil_mul_exp` assumes `0 ≤ y` (restricting y ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Lemma 7: answer `f16200262bf9` — Paper claim Lemma 7 (lemma-7) states: “$\sum_{ij}|\hat S_{ij}|^2=\tfrac12|\hat\omega|^2$ and $|\hat\omega|^2=4\pi^2|k|^2|\hat u|^2$.”. Lean theorem `curl_sq_eq` assumes `hdiv : dot k u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 8: answer `2408b2d1ad5a` — Paper claim Theorem 8 (theorem-8) states: “For $L^2$ fields with these coefficients, $\|S\|_2^2=\tfrac12\|\omega\|_2^2\le\|\omega\|_2^2$.”. Lean theorem `L2_strain_eq` assumes `hdiv : ∀ n, dot (kvec n) (fun j => coeff (u j) n) = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 8: answer `0fb92af2a8d6` — Paper claim Theorem 8 (theorem-8) states: “For $L^2$ fields with these coefficients, $\|S\|_2^2=\tfrac12\|\omega\|_2^2\le\|\omega\|_2^2$.”. Lean theorem `L2_strain_eq` assumes `hω : ∀ n i, coeff (ω i) n = curlSym (kvec n) (fun j => coeff (u j) n) i`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 8: answer `b4307a42321b` — Paper claim Theorem 8 (theorem-8) states: “For $L^2$ fields with these coefficients, $\|S\|_2^2=\tfrac12\|\omega\|_2^2\le\|\omega\|_2^2$.”. Lean theorem `L2_strain_eq` assumes `hS : ∀ n i j, coeff (S i j) n = strainSym (kvec n) (fun j => coeff (u j) n) i j`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 8: answer `82c2e70e73eb` — Paper claim Theorem 8 (theorem-8) states: “For $L^2$ fields with these coefficients, $\|S\|_2^2=\tfrac12\|\omega\|_2^2\le\|\omega\|_2^2$.”. Lean theorem `strain_sq_eq_half_curl_sq` assumes `hdiv : dot k u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 9: answer `df440186114b` — Paper claim Theorem 9 (theorem-9) states: “For $k\ne0$, $k\cdot\hat u=0$: $H(\mathrm{curl}\,\hat u)=\tfrac12|\hat u|^2$; $H(\omega+\varepsilon\eta)=H(\omega)+\varepsilon\,\mathrm{Re}\langle\hat\psi,\eta\rangle+\varepsilon^2H(\eta)$, so $\delt…”. No Lean declaration matching it was found among 199 candidates. Closest candidate: `modeEnergy_curl` (score 0.19, below threshold 0.2). Is this claim intentionally not formalized, or which declaration should it map to?
