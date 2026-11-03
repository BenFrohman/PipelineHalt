# PipelineHalt report: Enstrophy and Weighted-Enstrophy Balance Identities on $\mathbb{T

Status: **HALT** · overall drift **0.417** · 22 claims · 117 Lean declarations scanned · 35 open question(s)

Mapping file: `../../PipelineHalt/examples/weighted-enstrophy-identities/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Definition 1 | `PeriodicSetting` | 0.000 | 0 | 1 |
| Definition 2 | `setting` | 0.000 | 0 | 1 |
| Lemma 3 | `dx`, `dt` | 0.000 | 0 | 1 |
| Lemma 4 | `integral_dx`, `integral_dt` | 0.000 | 0 | 1 |
| Lemma 5 | `adv_eq`, `int_adv_eq_zero` | 0.000 | 0 | 0 |
| Lemma 6 | `wLapW_eq` | 0.000 | 0 | 1 |
| Lemma 7 | `two_w_adv` | 0.000 | 0 | 1 |
| Lemma 8 | `stretch_eq` | 0.000 | 0 | 1 |
| Lemma 9 | `dt_half_sq`, `dt_vsq_div` | 0.750 | 2 | 1 |
| Theorem 10 | `enstrophy_identity`, `enstrophy_identity_T3` | 0.938 | 4 | 1 |
| Lemma 11 | `dt_weighted` | 0.500 | 1 | 1 |
| Lemma 12 | `dt_weighted_div` | 0.500 | 1 | 1 |
| Theorem 13 | `weighted_identity`, `weighted_identity_T3` | 0.969 | 5 | 1 |
| Definition 14 | `A`, `setting` | 0.000 | 0 | 1 |
| Lemma 15 | `hasDerivAt_integral01` | 0.750 | 2 | 1 |
| Lemma 16 | `hasDerivAt_torusIntegral` | 0.000 | 0 | 1 |
| Lemma 17 | `torusIntegral_deriv_c` (0.438), `integral01_deriv_periodic` (0.406), `torusIntegral_deriv_b` (0.33), `torusIntegral_deriv_a` (0.33) | 0.989 | 7 | 0 |
| Theorem 18 | `int_d`, `int_dt`, `enstrophy_identity_smooth`, `weighted_identity_smooth` | 0.750 | 2 | 1 |
| Theorem 19 | `L2_strain_eq`, `L2_strain_le` | 0.984 | 6 | 0 |
| Theorem 20 | `dS_identity_smooth` | 0.750 | 2 | 1 |
| Theorem 21 | `le_integral_sq_of_deriv` | 0.800 | 2 | 1 |
| Theorem 22 | `ode_bounded` | 0.500 | 1 | 1 |

## Definition 1 — Periodic setting, \texttt{PeriodicSetting}

- `9492e08adf3e` AMBIGUOUS: Title “Periodic setting, \texttt{PeriodicSetting}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) PeriodicSetting, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Definition 2 — Trigonometric model, \texttt{Trig.setting}

- `c6fc7db3b999` AMBIGUOUS: Title “Trigonometric model, \texttt{Trig.setting}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) setting, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Lemma 3 — \texttt{dx}, \texttt{dt}

- `7ea0f1767f07` AMBIGUOUS: Title “\texttt{dx}, \texttt{dt}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) dx, dt, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Lemma 4 — Torus divergence lemma, \texttt{integral\_dx}, \texttt{integral\_dt}

- `05b77a1e3714` AMBIGUOUS: Title “Torus divergence lemma, \texttt{integral\_dx}, \texttt{integral\_dt}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) integral_dx, integral_dt, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Lemma 6 — \texttt{wLapW\_eq}

- `ca6497ef1904` AMBIGUOUS: Title “\texttt{wLapW\_eq}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) wLapW_eq, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Lemma 7 — \texttt{two\_w\_adv}

- `2a4bdd4d1d83` AMBIGUOUS: Title “\texttt{two\_w\_adv}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) two_w_adv, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Lemma 8 — \texttt{stretch\_eq}

- `72d3156e36e8` AMBIGUOUS: Title “\texttt{stretch\_eq}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) stretch_eq, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Lemma 9 — \texttt{dt\_half\_sq}, \texttt{dt\_vsq\_div}

- `202a6b8050c1` AMBIGUOUS: Title “\texttt{dt\_half\_sq}, \texttt{dt\_vsq\_div}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) dt_half_sq, dt_vsq_div, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `ec4fe234645e` CONDITIONAL: `dt_half_sq` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**
- `3938922e37e4` CONDITIONAL: `dt_vsq_div` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**

## Theorem 10 — Identity (1), \texttt{enstrophy\_identity}, \texttt{enstrophy\_identity\_T3}

- `f47b9509bc27` AMBIGUOUS: Title “Identity (1), \texttt{enstrophy\_identity}, \texttt{enstrophy\_identity\_T3}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) enstrophy_identity, enstrophy_identity_T3, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `cdd70bd9e9d3` CONDITIONAL: `enstrophy_identity` assumes `hu : div S u = 0`, not stated in the claim. — **OPEN**
- `6825fce7bb9f` CONDITIONAL: `enstrophy_identity` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**
- `34da75125ddb` CONDITIONAL: `enstrophy_identity_T3` assumes `hu : div (setting D) u = 0`, not stated in the claim. — **OPEN**
- `c800f3355d34` CONDITIONAL: `enstrophy_identity_T3` assumes `hw : VorticityEq (setting D) ν u w`, not stated in the claim. — **OPEN**

## Lemma 11 — \texttt{dt\_weighted}

- `f103508f9e6c` AMBIGUOUS: Title “\texttt{dt\_weighted}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) dt_weighted, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `548ed5118e6b` CONDITIONAL: `dt_weighted` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**

## Lemma 12 — \texttt{dt\_weighted\_div}

- `efe456ccb420` AMBIGUOUS: Title “\texttt{dt\_weighted\_div}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) dt_weighted_div, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `140a6bd7bdcf` CONDITIONAL: `dt_weighted_div` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**

## Theorem 13 — Identity (2), \texttt{weighted\_identity}, \texttt{weighted\_identity\_T3}

- `0c5e2d0f1c0e` AMBIGUOUS: Title “Identity (2), \texttt{weighted\_identity}, \texttt{weighted\_identity\_T3}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) weighted_identity, weighted_identity_T3, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `be8c2a20f0db` CONDITIONAL: `weighted_identity` assumes `hu : div S u = 0`, not stated in the claim. — **OPEN**
- `5816da43c624` CONDITIONAL: `weighted_identity` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**
- `6c04df4a15f6` CONDITIONAL: `weighted_identity_T3` assumes `hu : div (setting D) u = 0`, not stated in the claim. — **OPEN**
- `886b474c7a6d` CONDITIONAL: `weighted_identity_T3` assumes `hw : VorticityEq (setting D) ν u w`, not stated in the claim. — **OPEN**
- `5cd66503f29f` CONDITIONAL: `weighted_identity_T3` assumes `hφ : WeightEq (setting D) u w φ`, not stated in the claim. — **OPEN**

## Definition 14 — \texttt{Smooth.A}, \texttt{Smooth.setting}

- `335418dfd19a` AMBIGUOUS: Title “\texttt{Smooth.A}, \texttt{Smooth.setting}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) A, setting, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Lemma 15 — \texttt{Torus.hasDerivAt\_integral01}

- `ec2624b11cbe` AMBIGUOUS: Title “\texttt{Torus.hasDerivAt\_integral01}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) hasDerivAt_integral01, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `80312e1f9c73` CONDITIONAL: `hasDerivAt_integral01` assumes `hF : Continuous (Function.uncurry F)`, not stated in the claim. — **OPEN**
- `eb30fdb8bdc1` CONDITIONAL: `hasDerivAt_integral01` assumes `hF' : Continuous (Function.uncurry F')`, not stated in the claim. — **OPEN**

## Lemma 16 — \texttt{Torus.hasDerivAt\_torusIntegral}; (b)

- `8cbf18684e05` AMBIGUOUS: Title “\texttt{Torus.hasDerivAt\_torusIntegral}; (b)” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) hasDerivAt_torusIntegral, each an existing declaration mapped to this claim; the title makes no further assertion.”

## Lemma 17 — \texttt{Torus.torusIntegral\_deriv\_a/b/c}; (a)

- `68c3f3bb5fa1` AMBIGUOUS: Title “\texttt{Torus.torusIntegral\_deriv\_a/b/c}; (a)” shares almost no terms with the statement. — **OPEN**
- `4b3039a89d6b` CONDITIONAL: `torusIntegral_deriv_c` assumes `hf' : Continuous f'`, not stated in the claim. — **OPEN**
- `5c4df1b1887a` CONDITIONAL: `integral01_deriv_periodic` assumes `hg' : Continuous g'`, not stated in the claim. — **OPEN**
- `4cdbda5586e4` CONDITIONAL: `torusIntegral_deriv_b` assumes `hf : Continuous f`, not stated in the claim. — **OPEN**
- `8e599c9a704e` CONDITIONAL: `torusIntegral_deriv_b` assumes `hf' : Continuous f'`, not stated in the claim. — **OPEN**
- `52a6decf6c7e` CONDITIONAL: `torusIntegral_deriv_a` assumes `hf : Continuous f`, not stated in the claim. — **OPEN**
- `37b493288330` CONDITIONAL: `torusIntegral_deriv_a` assumes `hf' : Continuous f'`, not stated in the claim. — **OPEN**

## Theorem 18 — \texttt{Smooth.int\_d}, \texttt{Smooth.int\_dt}, \texttt{Smooth.enstrophy\_identity\_smooth}, \texttt{Smooth.weighted\_identity\_smooth}

- `fb29d25ec321` AMBIGUOUS: Title “\texttt{Smooth.int\_d}, \texttt{Smooth.int\_dt}, \texttt{Smooth.enstrophy\_identity\_smooth}, \texttt{Smooth.weighted\_identity\_smooth}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) int_d, int_dt, enstrophy_identity_smooth, weighted_identity_smooth, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `397d75dd4151` CONDITIONAL: `enstrophy_identity_smooth` assumes `hw : VorticityEq setting ν u w`, not stated in the claim. — **OPEN**
- `7aa7d6bef3f5` CONDITIONAL: `weighted_identity_smooth` assumes `hw : VorticityEq setting ν u w`, not stated in the claim. — **OPEN**

## Theorem 19 — \texttt{Fourier.L2\_strain\_eq}, \texttt{Fourier.L2\_strain\_le}

- `32588a1c4fca` CONDITIONAL: `L2_strain_eq` assumes `hdiv : ∀ n, dot (kvec n) (fun j => coeff (u j) n) = 0`, not stated in the claim. — **OPEN**
- `ec962bb66cc7` CONDITIONAL: `L2_strain_eq` assumes `hω : ∀ n i, coeff (ω i) n = curlSym (kvec n) (fun j => coeff (u j) n) i`, not stated in the claim. — **OPEN**
- `cbceafcefc1e` CONDITIONAL: `L2_strain_eq` assumes `hS : ∀ n i j, coeff (S i j) n = strainSym (kvec n) (fun j => coeff (u j) n) i j`, not stated in the claim. — **OPEN**
- `73d03ad35e96` CONDITIONAL: `L2_strain_le` assumes `hdiv : ∀ n, dot (kvec n) (fun j => coeff (u j) n) = 0`, not stated in the claim. — **OPEN**
- `219c2aef5466` CONDITIONAL: `L2_strain_le` assumes `hω : ∀ n i, coeff (ω i) n = curlSym (kvec n) (fun j => coeff (u j) n) i`, not stated in the claim. — **OPEN**
- `cd55fa7a2c0b` CONDITIONAL: `L2_strain_le` assumes `hS : ∀ n i j, coeff (S i j) n = strainSym (kvec n) (fun j => coeff (u j) n) i j`, not stated in the claim. — **OPEN**

## Theorem 20 — \texttt{Lyapunov.dS\_identity\_smooth}

- `021a04368c50` AMBIGUOUS: Title “\texttt{Lyapunov.dS\_identity\_smooth}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) dS_identity_smooth, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `be0ae03c88ef` CONDITIONAL: `dS_identity_smooth` assumes `hw : VorticityEq setting ν u w`, not stated in the claim. — **OPEN**
- `c2da3a6e2637` CONDITIONAL: `dS_identity_smooth` assumes `hφ : WeightEq setting u w φ`, not stated in the claim. — **OPEN**

## Theorem 21 — \texttt{Lyapunov.le\_integral\_sq\_of\_deriv}

- `6bc505068064` AMBIGUOUS: Title “\texttt{Lyapunov.le\_integral\_sq\_of\_deriv}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) le_integral_sq_of_deriv, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `29191cf16453` NARROWER: `le_integral_sq_of_deriv` restricts t ≥ 0; the claim states no such restriction. — **OPEN**
- `2bb5308c02f1` CONDITIONAL: `le_integral_sq_of_deriv` assumes `hle : ∀ s ∈ Icc 0 t, h s ≤ M s ^ 2`, not stated in the claim. — **OPEN**

## Theorem 22 — \texttt{Lyapunov.ode\_bounded}

- `417eec335892` AMBIGUOUS: Title “\texttt{Lyapunov.ode\_bounded}” shares almost no terms with the statement. — answered (intentional): “harmless wording (strict, mechanical): the title cites Lean name(s) ode_bounded, each an existing declaration mapped to this claim; the title makes no further assertion.”
- `596249bfd365` CONDITIONAL: `ode_bounded` assumes `hy : ∀ t ∈ Icc 0 T, HasDerivAt y (y t ^ 2 * (C - κ * y t)) t`, not stated in the claim. — **OPEN**

## Realignment notes

- Lemma 9: answer `ec4fe234645e` — Paper claim Lemma 9 (lemma-9) states: “Under (\ref{div}), (\ref{vort}): \[\partial_t|\omega|^2=2\,\omega_i\omega_j\partial_ju_i-2\nu\,|\nabla\omega|^2 +\partial_k\big(2\nu\,\omega_i\partial_k\omega_i-u_k|\omega|^2\big).\]”. Lean lemma `dt_half_sq` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 9: answer `3938922e37e4` — Paper claim Lemma 9 (lemma-9) states: “Under (\ref{div}), (\ref{vort}): \[\partial_t|\omega|^2=2\,\omega_i\omega_j\partial_ju_i-2\nu\,|\nabla\omega|^2 +\partial_k\big(2\nu\,\omega_i\partial_k\omega_i-u_k|\omega|^2\big).\]”. Lean lemma `dt_vsq_div` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 10: answer `cdd70bd9e9d3` — Paper claim Theorem 10 (theorem-10) states: “With $E=\frac12\int|\omega|^2$ and $P=\int\omega_i\omega_j\partial_ju_i$, \[\frac{dE}{dt}=P-\nu\int_{\mathbb{T}^3}|\nabla\omega|^2 .\] (Formalized as $D_t\,I(|\omega|^2)=2\,I(\omega_i\omega_j\partial…”. Lean theorem `enstrophy_identity` assumes `hu : div S u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 10: answer `6825fce7bb9f` — Paper claim Theorem 10 (theorem-10) states: “With $E=\frac12\int|\omega|^2$ and $P=\int\omega_i\omega_j\partial_ju_i$, \[\frac{dE}{dt}=P-\nu\int_{\mathbb{T}^3}|\nabla\omega|^2 .\] (Formalized as $D_t\,I(|\omega|^2)=2\,I(\omega_i\omega_j\partial…”. Lean theorem `enstrophy_identity` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 10: answer `34da75125ddb` — Paper claim Theorem 10 (theorem-10) states: “With $E=\frac12\int|\omega|^2$ and $P=\int\omega_i\omega_j\partial_ju_i$, \[\frac{dE}{dt}=P-\nu\int_{\mathbb{T}^3}|\nabla\omega|^2 .\] (Formalized as $D_t\,I(|\omega|^2)=2\,I(\omega_i\omega_j\partial…”. Lean theorem `enstrophy_identity_T3` assumes `hu : div (setting D) u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 10: answer `c800f3355d34` — Paper claim Theorem 10 (theorem-10) states: “With $E=\frac12\int|\omega|^2$ and $P=\int\omega_i\omega_j\partial_ju_i$, \[\frac{dE}{dt}=P-\nu\int_{\mathbb{T}^3}|\nabla\omega|^2 .\] (Formalized as $D_t\,I(|\omega|^2)=2\,I(\omega_i\omega_j\partial…”. Lean theorem `enstrophy_identity_T3` assumes `hw : VorticityEq (setting D) ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 11: answer `548ed5118e6b` — Paper claim Lemma 11 (lemma-11) states: “Under (\ref{vort}), (\ref{wt}): \[\partial_t(s^2\phi)=4s\phi\,\omega_i\omega_j\partial_ju_i+4\nu\,s\phi\,\omega\cdot\Delta\omega+s^3-u_k\partial_k(s^2\phi).\]”. Lean lemma `dt_weighted` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 12: answer `140a6bd7bdcf` — Paper claim Lemma 12 (lemma-12) states: “Under (\ref{div}) as well, $\partial_t(s^2\phi)=4s\phi\,\omega_i\omega_j\partial_ju_i+4\nu s\phi\,\omega\cdot\Delta\omega+s^3-\partial_k(u_ks^2\phi)$.”. Lean lemma `dt_weighted_div` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `be8c2a20f0db` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity` assumes `hu : div S u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `5816da43c624` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `6c04df4a15f6` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity_T3` assumes `hu : div (setting D) u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `886b474c7a6d` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity_T3` assumes `hw : VorticityEq (setting D) ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `5cd66503f29f` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity_T3` assumes `hφ : WeightEq (setting D) u w φ`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 15: answer `80312e1f9c73` — Paper claim Lemma 15 (lemma-15) states: “If $F,\partial_sF$ are jointly continuous on $\mathbb{R}\times\mathbb{R}$, then $\frac{d}{ds}\int_0^1F(s,x)\,dx=\int_0^1\partial_sF(s,x)\,dx$.”. Lean theorem `hasDerivAt_integral01` assumes `hF : Continuous (Function.uncurry F)`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 15: answer `eb30fdb8bdc1` — Paper claim Lemma 15 (lemma-15) states: “If $F,\partial_sF$ are jointly continuous on $\mathbb{R}\times\mathbb{R}$, then $\frac{d}{ds}\int_0^1F(s,x)\,dx=\int_0^1\partial_sF(s,x)\,dx$.”. Lean theorem `hasDerivAt_integral01` assumes `hF' : Continuous (Function.uncurry F')`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 17: answer `68c3f3bb5fa1` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Its title is “\texttt{Torus.torusIntegral\_deriv\_a/b/c}; (a)”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 17: answer `4b3039a89d6b` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Lean theorem `torusIntegral_deriv_c` assumes `hf' : Continuous f'`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 17: answer `5c4df1b1887a` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Lean theorem `integral01_deriv_periodic` assumes `hg' : Continuous g'`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 17: answer `4cdbda5586e4` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Lean theorem `torusIntegral_deriv_b` assumes `hf : Continuous f`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 17: answer `8e599c9a704e` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Lean theorem `torusIntegral_deriv_b` assumes `hf' : Continuous f'`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 17: answer `52a6decf6c7e` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Lean theorem `torusIntegral_deriv_a` assumes `hf : Continuous f`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 17: answer `37b493288330` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Lean theorem `torusIntegral_deriv_a` assumes `hf' : Continuous f'`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 18: answer `397d75dd4151` — Paper claim Theorem 18 (theorem-18) states: “The smooth model is a periodic setting. Hence identities (1) and (2) hold for all $u,\omega,\phi\in A$ satisfying (\ref{div})--(\ref{wt}).”. Lean theorem `enstrophy_identity_smooth` assumes `hw : VorticityEq setting ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 18: answer `7aa7d6bef3f5` — Paper claim Theorem 18 (theorem-18) states: “The smooth model is a periodic setting. Hence identities (1) and (2) hold for all $u,\omega,\phi\in A$ satisfying (\ref{div})--(\ref{wt}).”. Lean theorem `weighted_identity_smooth` assumes `hw : VorticityEq setting ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `32588a1c4fca` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_eq` assumes `hdiv : ∀ n, dot (kvec n) (fun j => coeff (u j) n) = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `ec962bb66cc7` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_eq` assumes `hω : ∀ n i, coeff (ω i) n = curlSym (kvec n) (fun j => coeff (u j) n) i`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `cbceafcefc1e` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_eq` assumes `hS : ∀ n i j, coeff (S i j) n = strainSym (kvec n) (fun j => coeff (u j) n) i j`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `73d03ad35e96` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_le` assumes `hdiv : ∀ n, dot (kvec n) (fun j => coeff (u j) n) = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `219c2aef5466` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_le` assumes `hω : ∀ n i, coeff (ω i) n = curlSym (kvec n) (fun j => coeff (u j) n) i`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `cd55fa7a2c0b` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_le` assumes `hS : ∀ n i j, coeff (S i j) n = strainSym (kvec n) (fun j => coeff (u j) n) i j`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 20: answer `be0ae03c88ef` — Paper claim Theorem 20 (theorem-20) states: “Let $S=\frac12\int|\omega|^2-\frac{\kappa}{2}\int|\omega|^4\phi$. For smooth periodic solutions of (\ref{div})--(\ref{wt}), \[S'=\int\omega_i\omega_j\partial_ju_i-\nu\int|\nabla\omega|^2-\tfrac{\kapp…”. Lean theorem `dS_identity_smooth` assumes `hw : VorticityEq setting ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 20: answer `c2da3a6e2637` — Paper claim Theorem 20 (theorem-20) states: “Let $S=\frac12\int|\omega|^2-\frac{\kappa}{2}\int|\omega|^4\phi$. For smooth periodic solutions of (\ref{div})--(\ref{wt}), \[S'=\int\omega_i\omega_j\partial_ju_i-\nu\int|\nabla\omega|^2-\tfrac{\kapp…”. Lean theorem `dS_identity_smooth` assumes `hφ : WeightEq setting u w φ`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 21: answer `29191cf16453` — Paper claim Theorem 21 (theorem-21) states: “Let $h,M$ be continuous, $g(0)=0$, and $g'=h\le M^2$ on $[0,t]$. Then $g(t)\le\int_0^tM^2$.”. Lean theorem `le_integral_sq_of_deriv` assumes `0 ≤ t` (restricting t ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 21: answer `2bb5308c02f1` — Paper claim Theorem 21 (theorem-21) states: “Let $h,M$ be continuous, $g(0)=0$, and $g'=h\le M^2$ on $[0,t]$. Then $g(t)\le\int_0^tM^2$.”. Lean theorem `le_integral_sq_of_deriv` assumes `hle : ∀ s ∈ Icc 0 t, h s ≤ M s ^ 2`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 22: answer `596249bfd365` — Paper claim Theorem 22 (theorem-22) states: “Let $\kappa>0$, and let $y'=y^2(C-\kappa y)$ on $[0,T]$. Then $\min(y_0,C/\kappa,0)\le y(t)\le\max(y_0,C/\kappa,0)$.”. Lean theorem `ode_bounded` assumes `hy : ∀ t ∈ Icc 0 T, HasDerivAt y (y t ^ 2 * (C - κ * y t)) t`, which the claim does not state. Is this extra hypothesis intentional?
