# PipelineHalt report: Enstrophy and Weighted-Enstrophy Balance Identities on $\mathbb{T

Status: **HALT** · overall drift **0.649** · 22 claims · 117 Lean declarations scanned · 49 open question(s)

Mapping file: none (heuristic pairing only).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Definition 1 | `PeriodicSetting` (0.32), `setting` (0.266), `setting` (0.225), `multiplier` (0.222) | 0.300 | 1 | 0 |
| Definition 2 | — | 1.000 | 2 | 0 |
| Lemma 3 | `integral_dt` (0.218) | 0.300 | 1 | 0 |
| Lemma 4 | `integral_dx` (0.378) | 0.300 | 1 | 0 |
| Lemma 5 | `int_adv_eq_zero` (0.5), `adv_eq` (0.307) | 0.000 | 0 | 0 |
| Lemma 6 | `wLapW_eq` (0.218) | 0.300 | 1 | 0 |
| Lemma 7 | `two_w_adv` (0.357), `two_toReal` (0.218) | 0.300 | 1 | 0 |
| Lemma 8 | `stretch_eq` (0.242) | 0.300 | 1 | 0 |
| Lemma 9 | `dt_vsq_div` (0.214) | 0.650 | 2 | 0 |
| Theorem 10 | `enstrophy_identity` (0.339) | 0.825 | 3 | 0 |
| Lemma 11 | — | 1.000 | 2 | 0 |
| Lemma 12 | `dt_weighted_div` (0.238) | 0.650 | 2 | 0 |
| Theorem 13 | `weighted_identity` (0.367), `dt_weighted` (0.246), `weighted_identity_T3` (0.23) | 0.989 | 7 | 0 |
| Definition 14 | — | 1.000 | 2 | 0 |
| Lemma 15 | `hasDerivAt_integral01` (0.436), `torusIntegral_deriv_b` (0.353), `torusIntegral_deriv_a` (0.353) | 0.825 | 3 | 0 |
| Lemma 16 | `hasDerivAt_torusIntegral` (0.419) | 0.300 | 1 | 0 |
| Lemma 17 | `torusIntegral_deriv_c` (0.438), `integral01_deriv_periodic` (0.406) | 0.825 | 3 | 0 |
| Theorem 18 | `enstrophy_identity_smooth` (0.386), `weighted_identity_smooth` (0.336), `dS_identity_smooth` (0.324), `enstrophy_identity_T3` (0.236) | 0.956 | 5 | 0 |
| Theorem 19 | `L2_strain_eq` (0.383), `strain_sq_eq_half_curl_sq` (0.256) | 0.938 | 4 | 0 |
| Theorem 20 | — | 1.000 | 2 | 0 |
| Theorem 21 | `le_integral_sq_of_deriv` (0.514) | 0.860 | 3 | 0 |
| Theorem 22 | `ode_bounded` (0.508) | 0.650 | 2 | 0 |

## Definition 1 — Periodic setting, \texttt{PeriodicSetting}

- `9492e08adf3e` AMBIGUOUS: Title “Periodic setting, \texttt{PeriodicSetting}” shares almost no terms with the statement. — **OPEN**

## Definition 2 — Trigonometric model, \texttt{Trig.setting}

- `9368701f607b` SILENT: No Lean declaration matches this claim. Closest candidate: `setting` (score 0.17, below threshold 0.2). — **OPEN**
- `c6fc7db3b999` AMBIGUOUS: Title “Trigonometric model, \texttt{Trig.setting}” shares almost no terms with the statement. — **OPEN**

## Lemma 3 — \texttt{dx}, \texttt{dt}

- `7ea0f1767f07` AMBIGUOUS: Title “\texttt{dx}, \texttt{dt}” shares almost no terms with the statement. — **OPEN**

## Lemma 4 — Torus divergence lemma, \texttt{integral\_dx}, \texttt{integral\_dt}

- `05b77a1e3714` AMBIGUOUS: Title “Torus divergence lemma, \texttt{integral\_dx}, \texttt{integral\_dt}” shares almost no terms with the statement. — **OPEN**

## Lemma 6 — \texttt{wLapW\_eq}

- `ca6497ef1904` AMBIGUOUS: Title “\texttt{wLapW\_eq}” shares almost no terms with the statement. — **OPEN**

## Lemma 7 — \texttt{two\_w\_adv}

- `2a4bdd4d1d83` AMBIGUOUS: Title “\texttt{two\_w\_adv}” shares almost no terms with the statement. — **OPEN**

## Lemma 8 — \texttt{stretch\_eq}

- `72d3156e36e8` AMBIGUOUS: Title “\texttt{stretch\_eq}” shares almost no terms with the statement. — **OPEN**

## Lemma 9 — \texttt{dt\_half\_sq}, \texttt{dt\_vsq\_div}

- `202a6b8050c1` AMBIGUOUS: Title “\texttt{dt\_half\_sq}, \texttt{dt\_vsq\_div}” shares almost no terms with the statement. — **OPEN**
- `3938922e37e4` CONDITIONAL: `dt_vsq_div` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**

## Theorem 10 — Identity (1), \texttt{enstrophy\_identity}, \texttt{enstrophy\_identity\_T3}

- `f47b9509bc27` AMBIGUOUS: Title “Identity (1), \texttt{enstrophy\_identity}, \texttt{enstrophy\_identity\_T3}” shares almost no terms with the statement. — **OPEN**
- `cdd70bd9e9d3` CONDITIONAL: `enstrophy_identity` assumes `hu : div S u = 0`, not stated in the claim. — **OPEN**
- `6825fce7bb9f` CONDITIONAL: `enstrophy_identity` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**

## Lemma 11 — \texttt{dt\_weighted}

- `6a6134367f98` SILENT: No Lean declaration matches this claim. Closest candidate: `weighted_identity` (score 0.27, but it matches claim theorem-13 better). — **OPEN**
- `f103508f9e6c` AMBIGUOUS: Title “\texttt{dt\_weighted}” shares almost no terms with the statement. — **OPEN**

## Lemma 12 — \texttt{dt\_weighted\_div}

- `efe456ccb420` AMBIGUOUS: Title “\texttt{dt\_weighted\_div}” shares almost no terms with the statement. — **OPEN**
- `140a6bd7bdcf` CONDITIONAL: `dt_weighted_div` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**

## Theorem 13 — Identity (2), \texttt{weighted\_identity}, \texttt{weighted\_identity\_T3}

- `0c5e2d0f1c0e` AMBIGUOUS: Title “Identity (2), \texttt{weighted\_identity}, \texttt{weighted\_identity\_T3}” shares almost no terms with the statement. — **OPEN**
- `be8c2a20f0db` CONDITIONAL: `weighted_identity` assumes `hu : div S u = 0`, not stated in the claim. — **OPEN**
- `5816da43c624` CONDITIONAL: `weighted_identity` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**
- `6f4fcc61ed5f` CONDITIONAL: `dt_weighted` assumes `hw : VorticityEq S ν u w`, not stated in the claim. — **OPEN**
- `6c04df4a15f6` CONDITIONAL: `weighted_identity_T3` assumes `hu : div (setting D) u = 0`, not stated in the claim. — **OPEN**
- `886b474c7a6d` CONDITIONAL: `weighted_identity_T3` assumes `hw : VorticityEq (setting D) ν u w`, not stated in the claim. — **OPEN**
- `5cd66503f29f` CONDITIONAL: `weighted_identity_T3` assumes `hφ : WeightEq (setting D) u w φ`, not stated in the claim. — **OPEN**

## Definition 14 — \texttt{Smooth.A}, \texttt{Smooth.setting}

- `9ebb7c401a2e` SILENT: No Lean declaration matches this claim. Closest candidate: `multiplier` (score 0.15, below threshold 0.2). — **OPEN**
- `335418dfd19a` AMBIGUOUS: Title “\texttt{Smooth.A}, \texttt{Smooth.setting}” shares almost no terms with the statement. — **OPEN**

## Lemma 15 — \texttt{Torus.hasDerivAt\_integral01}

- `ec2624b11cbe` AMBIGUOUS: Title “\texttt{Torus.hasDerivAt\_integral01}” shares almost no terms with the statement. — **OPEN**
- `80312e1f9c73` CONDITIONAL: `hasDerivAt_integral01` assumes `hF : Continuous (Function.uncurry F)`, not stated in the claim. — **OPEN**
- `eb30fdb8bdc1` CONDITIONAL: `hasDerivAt_integral01` assumes `hF' : Continuous (Function.uncurry F')`, not stated in the claim. — **OPEN**

## Lemma 16 — \texttt{Torus.hasDerivAt\_torusIntegral}; (b)

- `8cbf18684e05` AMBIGUOUS: Title “\texttt{Torus.hasDerivAt\_torusIntegral}; (b)” shares almost no terms with the statement. — **OPEN**

## Lemma 17 — \texttt{Torus.torusIntegral\_deriv\_a/b/c}; (a)

- `68c3f3bb5fa1` AMBIGUOUS: Title “\texttt{Torus.torusIntegral\_deriv\_a/b/c}; (a)” shares almost no terms with the statement. — **OPEN**
- `4b3039a89d6b` CONDITIONAL: `torusIntegral_deriv_c` assumes `hf' : Continuous f'`, not stated in the claim. — **OPEN**
- `5c4df1b1887a` CONDITIONAL: `integral01_deriv_periodic` assumes `hg' : Continuous g'`, not stated in the claim. — **OPEN**

## Theorem 18 — \texttt{Smooth.int\_d}, \texttt{Smooth.int\_dt}, \texttt{Smooth.enstrophy\_identity\_smooth}, \texttt{Smooth.weighted\_identity\_smooth}

- `fb29d25ec321` AMBIGUOUS: Title “\texttt{Smooth.int\_d}, \texttt{Smooth.int\_dt}, \texttt{Smooth.enstrophy\_identity\_smooth}, \texttt{Smooth.weighted\_identity\_smooth}” shares almost no terms with the statement. — **OPEN**
- `397d75dd4151` CONDITIONAL: `enstrophy_identity_smooth` assumes `hw : VorticityEq setting ν u w`, not stated in the claim. — **OPEN**
- `7aa7d6bef3f5` CONDITIONAL: `weighted_identity_smooth` assumes `hw : VorticityEq setting ν u w`, not stated in the claim. — **OPEN**
- `0ac392545861` CONDITIONAL: `dS_identity_smooth` assumes `hw : VorticityEq setting ν u w`, not stated in the claim. — **OPEN**
- `54009a9e8318` CONDITIONAL: `enstrophy_identity_T3` assumes `hw : VorticityEq (setting D) ν u w`, not stated in the claim. — **OPEN**

## Theorem 19 — \texttt{Fourier.L2\_strain\_eq}, \texttt{Fourier.L2\_strain\_le}

- `32588a1c4fca` CONDITIONAL: `L2_strain_eq` assumes `hdiv : ∀ n, dot (kvec n) (fun j => coeff (u j) n) = 0`, not stated in the claim. — **OPEN**
- `ec962bb66cc7` CONDITIONAL: `L2_strain_eq` assumes `hω : ∀ n i, coeff (ω i) n = curlSym (kvec n) (fun j => coeff (u j) n) i`, not stated in the claim. — **OPEN**
- `cbceafcefc1e` CONDITIONAL: `L2_strain_eq` assumes `hS : ∀ n i j, coeff (S i j) n = strainSym (kvec n) (fun j => coeff (u j) n) i j`, not stated in the claim. — **OPEN**
- `d4b87f81cb58` CONDITIONAL: `strain_sq_eq_half_curl_sq` assumes `hdiv : dot k u = 0`, not stated in the claim. — **OPEN**

## Theorem 20 — \texttt{Lyapunov.dS\_identity\_smooth}

- `997b6d1631a1` SILENT: No Lean declaration matches this claim. Closest candidate: `dS_identity_smooth` (score 0.27, but it matches claim theorem-18 better). — **OPEN**
- `021a04368c50` AMBIGUOUS: Title “\texttt{Lyapunov.dS\_identity\_smooth}” shares almost no terms with the statement. — **OPEN**

## Theorem 21 — \texttt{Lyapunov.le\_integral\_sq\_of\_deriv}

- `6bc505068064` AMBIGUOUS: Title “\texttt{Lyapunov.le\_integral\_sq\_of\_deriv}” shares almost no terms with the statement. — **OPEN**
- `29191cf16453` NARROWER: `le_integral_sq_of_deriv` restricts t ≥ 0; the claim states no such restriction. — **OPEN**
- `2bb5308c02f1` CONDITIONAL: `le_integral_sq_of_deriv` assumes `hle : ∀ s ∈ Icc 0 t, h s ≤ M s ^ 2`, not stated in the claim. — **OPEN**

## Theorem 22 — \texttt{Lyapunov.ode\_bounded}

- `417eec335892` AMBIGUOUS: Title “\texttt{Lyapunov.ode\_bounded}” shares almost no terms with the statement. — **OPEN**
- `596249bfd365` CONDITIONAL: `ode_bounded` assumes `hy : ∀ t ∈ Icc 0 T, HasDerivAt y (y t ^ 2 * (C - κ * y t)) t`, not stated in the claim. — **OPEN**

## Realignment notes

- Definition 1: answer `9492e08adf3e` — Paper claim Definition 1 (definition-1) states: “A commutative $K$-algebra $A$ with $K$-derivations $\partial_1,\partial_2,\partial_3,\partial_t$, a $K$-module $B$, a $K$-linear map $I:A\to B$ and a map $D_t:B\to B$ such that $I(\partial_k f)=0$ fo…”. Its title is “Periodic setting, \texttt{PeriodicSetting}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Definition 2: answer `9368701f607b` — Paper claim Definition 2 (definition-2) states: “$A=R[\mathbb{Z}^3]$ (finite sums $\sum_n f_n e^{2\pi i n\cdot x}$, $f_n\in R$), where $R$ is a commutative $\mathbb{C}$-algebra with a derivation $D$. Set $\partial_k(\sum f_n e_n)=\sum 2\pi i n_k f_…”. No Lean declaration matching it was found among 47 candidates. Closest candidate: `setting` (score 0.17, below threshold 0.2). Is this claim intentionally not formalized, or which declaration should it map to?
- Definition 2: answer `c6fc7db3b999` — Paper claim Definition 2 (definition-2) states: “$A=R[\mathbb{Z}^3]$ (finite sums $\sum_n f_n e^{2\pi i n\cdot x}$, $f_n\in R$), where $R$ is a commutative $\mathbb{C}$-algebra with a derivation $D$. Set $\partial_k(\sum f_n e_n)=\sum 2\pi i n_k f_…”. Its title is “Trigonometric model, \texttt{Trig.setting}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 3: answer `7ea0f1767f07` — Paper claim Lemma 3 (lemma-3) states: “$\partial_k$ and $\partial_t$ are derivations of $R[\mathbb{Z}^3]$.”. Its title is “\texttt{dx}, \texttt{dt}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 4: answer `05b77a1e3714` — Paper claim Lemma 4 (lemma-4) states: “$I(\partial_k f)=2\pi i\cdot 0\cdot f_0=0$ and $I(\partial_t f)=D(f_0)=D(If)$.”. Its title is “Torus divergence lemma, \texttt{integral\_dx}, \texttt{integral\_dt}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 6: answer `ca6497ef1904` — Paper claim Lemma 6 (lemma-6) states: “$\omega_i\partial_k\partial_k\omega_i=\partial_k(\omega_i\partial_k\omega_i)-\partial_k\omega_i\,\partial_k\omega_i$.”. Its title is “\texttt{wLapW\_eq}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 7: answer `2a4bdd4d1d83` — Paper claim Lemma 7 (lemma-7) states: “$2\,\omega_i\,u_k\partial_k\omega_i=u_k\partial_k|\omega|^2$.”. Its title is “\texttt{two\_w\_adv}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 8: answer `72d3156e36e8` — Paper claim Lemma 8 (lemma-8) states: “$\omega_i\omega_j\partial_ju_i=\omega\cdot(\omega\cdot\nabla)u$.”. Its title is “\texttt{stretch\_eq}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 9: answer `202a6b8050c1` — Paper claim Lemma 9 (lemma-9) states: “Under (\ref{div}), (\ref{vort}): \[\partial_t|\omega|^2=2\,\omega_i\omega_j\partial_ju_i-2\nu\,|\nabla\omega|^2 +\partial_k\big(2\nu\,\omega_i\partial_k\omega_i-u_k|\omega|^2\big).\]”. Its title is “\texttt{dt\_half\_sq}, \texttt{dt\_vsq\_div}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 9: answer `3938922e37e4` — Paper claim Lemma 9 (lemma-9) states: “Under (\ref{div}), (\ref{vort}): \[\partial_t|\omega|^2=2\,\omega_i\omega_j\partial_ju_i-2\nu\,|\nabla\omega|^2 +\partial_k\big(2\nu\,\omega_i\partial_k\omega_i-u_k|\omega|^2\big).\]”. Lean lemma `dt_vsq_div` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 10: answer `f47b9509bc27` — Paper claim Theorem 10 (theorem-10) states: “With $E=\frac12\int|\omega|^2$ and $P=\int\omega_i\omega_j\partial_ju_i$, \[\frac{dE}{dt}=P-\nu\int_{\mathbb{T}^3}|\nabla\omega|^2 .\] (Formalized as $D_t\,I(|\omega|^2)=2\,I(\omega_i\omega_j\partial…”. Its title is “Identity (1), \texttt{enstrophy\_identity}, \texttt{enstrophy\_identity\_T3}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 10: answer `cdd70bd9e9d3` — Paper claim Theorem 10 (theorem-10) states: “With $E=\frac12\int|\omega|^2$ and $P=\int\omega_i\omega_j\partial_ju_i$, \[\frac{dE}{dt}=P-\nu\int_{\mathbb{T}^3}|\nabla\omega|^2 .\] (Formalized as $D_t\,I(|\omega|^2)=2\,I(\omega_i\omega_j\partial…”. Lean theorem `enstrophy_identity` assumes `hu : div S u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 10: answer `6825fce7bb9f` — Paper claim Theorem 10 (theorem-10) states: “With $E=\frac12\int|\omega|^2$ and $P=\int\omega_i\omega_j\partial_ju_i$, \[\frac{dE}{dt}=P-\nu\int_{\mathbb{T}^3}|\nabla\omega|^2 .\] (Formalized as $D_t\,I(|\omega|^2)=2\,I(\omega_i\omega_j\partial…”. Lean theorem `enstrophy_identity` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 11: answer `6a6134367f98` — Paper claim Lemma 11 (lemma-11) states: “Under (\ref{vort}), (\ref{wt}): \[\partial_t(s^2\phi)=4s\phi\,\omega_i\omega_j\partial_ju_i+4\nu\,s\phi\,\omega\cdot\Delta\omega+s^3-u_k\partial_k(s^2\phi).\]”. No Lean declaration matching it was found among 70 candidates. Closest candidate: `weighted_identity` (score 0.27, but it matches claim theorem-13 better). Is this claim intentionally not formalized, or which declaration should it map to?
- Lemma 11: answer `f103508f9e6c` — Paper claim Lemma 11 (lemma-11) states: “Under (\ref{vort}), (\ref{wt}): \[\partial_t(s^2\phi)=4s\phi\,\omega_i\omega_j\partial_ju_i+4\nu\,s\phi\,\omega\cdot\Delta\omega+s^3-u_k\partial_k(s^2\phi).\]”. Its title is “\texttt{dt\_weighted}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 12: answer `efe456ccb420` — Paper claim Lemma 12 (lemma-12) states: “Under (\ref{div}) as well, $\partial_t(s^2\phi)=4s\phi\,\omega_i\omega_j\partial_ju_i+4\nu s\phi\,\omega\cdot\Delta\omega+s^3-\partial_k(u_ks^2\phi)$.”. Its title is “\texttt{dt\_weighted\_div}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 12: answer `140a6bd7bdcf` — Paper claim Lemma 12 (lemma-12) states: “Under (\ref{div}) as well, $\partial_t(s^2\phi)=4s\phi\,\omega_i\omega_j\partial_ju_i+4\nu s\phi\,\omega\cdot\Delta\omega+s^3-\partial_k(u_ks^2\phi)$.”. Lean lemma `dt_weighted_div` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `0c5e2d0f1c0e` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Its title is “Identity (2), \texttt{weighted\_identity}, \texttt{weighted\_identity\_T3}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 13: answer `be8c2a20f0db` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity` assumes `hu : div S u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `5816da43c624` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `6f4fcc61ed5f` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean lemma `dt_weighted` assumes `hw : VorticityEq S ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `6c04df4a15f6` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity_T3` assumes `hu : div (setting D) u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `886b474c7a6d` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity_T3` assumes `hw : VorticityEq (setting D) ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 13: answer `5cd66503f29f` — Paper claim Theorem 13 (theorem-13) states: “With $Q=\int|\omega|^4\phi$, \[\frac{dQ}{dt}=4\int|\omega|^2\phi\,\omega\cdot(\omega\cdot\nabla)u+4\nu\int|\omega|^2\phi\,\omega\cdot\Delta\omega+\int|\omega|^6 .\]”. Lean theorem `weighted_identity_T3` assumes `hφ : WeightEq (setting D) u w φ`, which the claim does not state. Is this extra hypothesis intentional?
- Definition 14: answer `9ebb7c401a2e` — Paper claim Definition 14 (definition-14) states: “$A$ is the algebra of $f\in C^\infty(\mathbb{R}\times\mathbb{R}^3,\mathbb{R})$, $f=f(t,a,b,c)$, with $f(p+e_k)=f(p)$ for the unit spatial vectors $e_1,e_2,e_3$. $\partial_k f(p)=Df(p)e_k$, $\partial_…”. No Lean declaration matching it was found among 47 candidates. Closest candidate: `multiplier` (score 0.15, below threshold 0.2). Is this claim intentionally not formalized, or which declaration should it map to?
- Definition 14: answer `335418dfd19a` — Paper claim Definition 14 (definition-14) states: “$A$ is the algebra of $f\in C^\infty(\mathbb{R}\times\mathbb{R}^3,\mathbb{R})$, $f=f(t,a,b,c)$, with $f(p+e_k)=f(p)$ for the unit spatial vectors $e_1,e_2,e_3$. $\partial_k f(p)=Df(p)e_k$, $\partial_…”. Its title is “\texttt{Smooth.A}, \texttt{Smooth.setting}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 15: answer `ec2624b11cbe` — Paper claim Lemma 15 (lemma-15) states: “If $F,\partial_sF$ are jointly continuous on $\mathbb{R}\times\mathbb{R}$, then $\frac{d}{ds}\int_0^1F(s,x)\,dx=\int_0^1\partial_sF(s,x)\,dx$.”. Its title is “\texttt{Torus.hasDerivAt\_integral01}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 15: answer `80312e1f9c73` — Paper claim Lemma 15 (lemma-15) states: “If $F,\partial_sF$ are jointly continuous on $\mathbb{R}\times\mathbb{R}$, then $\frac{d}{ds}\int_0^1F(s,x)\,dx=\int_0^1\partial_sF(s,x)\,dx$.”. Lean theorem `hasDerivAt_integral01` assumes `hF : Continuous (Function.uncurry F)`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 15: answer `eb30fdb8bdc1` — Paper claim Lemma 15 (lemma-15) states: “If $F,\partial_sF$ are jointly continuous on $\mathbb{R}\times\mathbb{R}$, then $\frac{d}{ds}\int_0^1F(s,x)\,dx=\int_0^1\partial_sF(s,x)\,dx$.”. Lean theorem `hasDerivAt_integral01` assumes `hF' : Continuous (Function.uncurry F')`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 16: answer `8cbf18684e05` — Paper claim Lemma 16 (lemma-16) states: “If $f,\partial_tf$ are jointly continuous, then $\frac{d}{dt}\int_{\mathbb{T}^3}f=\int_{\mathbb{T}^3}\partial_tf$.”. Its title is “\texttt{Torus.hasDerivAt\_torusIntegral}; (b)”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 17: answer `68c3f3bb5fa1` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Its title is “\texttt{Torus.torusIntegral\_deriv\_a/b/c}; (a)”, which does not appear to describe that statement. Is the title or the statement misworded?
- Lemma 17: answer `4b3039a89d6b` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Lean theorem `torusIntegral_deriv_c` assumes `hf' : Continuous f'`, which the claim does not state. Is this extra hypothesis intentional?
- Lemma 17: answer `5c4df1b1887a` — Paper claim Lemma 17 (lemma-17) states: “If $f$ is $C^1$ and $1$-periodic in the differentiated variable, then $\int_{\mathbb{T}^3}\partial_kf=0$.”. Lean theorem `integral01_deriv_periodic` assumes `hg' : Continuous g'`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 18: answer `fb29d25ec321` — Paper claim Theorem 18 (theorem-18) states: “The smooth model is a periodic setting. Hence identities (1) and (2) hold for all $u,\omega,\phi\in A$ satisfying (\ref{div})--(\ref{wt}).”. Its title is “\texttt{Smooth.int\_d}, \texttt{Smooth.int\_dt}, \texttt{Smooth.enstrophy\_identity\_smooth}, \texttt{Smooth.weighted\_identity\_smooth}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 18: answer `397d75dd4151` — Paper claim Theorem 18 (theorem-18) states: “The smooth model is a periodic setting. Hence identities (1) and (2) hold for all $u,\omega,\phi\in A$ satisfying (\ref{div})--(\ref{wt}).”. Lean theorem `enstrophy_identity_smooth` assumes `hw : VorticityEq setting ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 18: answer `7aa7d6bef3f5` — Paper claim Theorem 18 (theorem-18) states: “The smooth model is a periodic setting. Hence identities (1) and (2) hold for all $u,\omega,\phi\in A$ satisfying (\ref{div})--(\ref{wt}).”. Lean theorem `weighted_identity_smooth` assumes `hw : VorticityEq setting ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 18: answer `0ac392545861` — Paper claim Theorem 18 (theorem-18) states: “The smooth model is a periodic setting. Hence identities (1) and (2) hold for all $u,\omega,\phi\in A$ satisfying (\ref{div})--(\ref{wt}).”. Lean theorem `dS_identity_smooth` assumes `hw : VorticityEq setting ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 18: answer `54009a9e8318` — Paper claim Theorem 18 (theorem-18) states: “The smooth model is a periodic setting. Hence identities (1) and (2) hold for all $u,\omega,\phi\in A$ satisfying (\ref{div})--(\ref{wt}).”. Lean theorem `enstrophy_identity_T3` assumes `hw : VorticityEq (setting D) ν u w`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `32588a1c4fca` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_eq` assumes `hdiv : ∀ n, dot (kvec n) (fun j => coeff (u j) n) = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `ec962bb66cc7` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_eq` assumes `hω : ∀ n i, coeff (ω i) n = curlSym (kvec n) (fun j => coeff (u j) n) i`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `cbceafcefc1e` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `L2_strain_eq` assumes `hS : ∀ n i j, coeff (S i j) n = strainSym (kvec n) (fun j => coeff (u j) n) i j`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 19: answer `d4b87f81cb58` — Paper claim Theorem 19 (theorem-19) states: “Take $u,\omega,S\in L^2(\mathbb{T}^3)$ whose Fourier coefficients are those of a divergence-free velocity, its curl, and $S=\frac12(\nabla u+\nabla u^T)$. Then $\sum_{ij}\|S_{ij}\|_2^2=\frac12\sum_i\…”. Lean theorem `strain_sq_eq_half_curl_sq` assumes `hdiv : dot k u = 0`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 20: answer `997b6d1631a1` — Paper claim Theorem 20 (theorem-20) states: “Let $S=\frac12\int|\omega|^2-\frac{\kappa}{2}\int|\omega|^4\phi$. For smooth periodic solutions of (\ref{div})--(\ref{wt}), \[S'=\int\omega_i\omega_j\partial_ju_i-\nu\int|\nabla\omega|^2-\tfrac{\kapp…”. No Lean declaration matching it was found among 70 candidates. Closest candidate: `dS_identity_smooth` (score 0.27, but it matches claim theorem-18 better). Is this claim intentionally not formalized, or which declaration should it map to?
- Theorem 20: answer `021a04368c50` — Paper claim Theorem 20 (theorem-20) states: “Let $S=\frac12\int|\omega|^2-\frac{\kappa}{2}\int|\omega|^4\phi$. For smooth periodic solutions of (\ref{div})--(\ref{wt}), \[S'=\int\omega_i\omega_j\partial_ju_i-\nu\int|\nabla\omega|^2-\tfrac{\kapp…”. Its title is “\texttt{Lyapunov.dS\_identity\_smooth}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 21: answer `6bc505068064` — Paper claim Theorem 21 (theorem-21) states: “Let $h,M$ be continuous, $g(0)=0$, and $g'=h\le M^2$ on $[0,t]$. Then $g(t)\le\int_0^tM^2$.”. Its title is “\texttt{Lyapunov.le\_integral\_sq\_of\_deriv}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 21: answer `29191cf16453` — Paper claim Theorem 21 (theorem-21) states: “Let $h,M$ be continuous, $g(0)=0$, and $g'=h\le M^2$ on $[0,t]$. Then $g(t)\le\int_0^tM^2$.”. Lean theorem `le_integral_sq_of_deriv` assumes `0 ≤ t` (restricting t ≥ 0), which the claim does not state. Is the restricted domain intentional?
- Theorem 21: answer `2bb5308c02f1` — Paper claim Theorem 21 (theorem-21) states: “Let $h,M$ be continuous, $g(0)=0$, and $g'=h\le M^2$ on $[0,t]$. Then $g(t)\le\int_0^tM^2$.”. Lean theorem `le_integral_sq_of_deriv` assumes `hle : ∀ s ∈ Icc 0 t, h s ≤ M s ^ 2`, which the claim does not state. Is this extra hypothesis intentional?
- Theorem 22: answer `417eec335892` — Paper claim Theorem 22 (theorem-22) states: “Let $\kappa>0$, and let $y'=y^2(C-\kappa y)$ on $[0,T]$. Then $\min(y_0,C/\kappa,0)\le y(t)\le\max(y_0,C/\kappa,0)$.”. Its title is “\texttt{Lyapunov.ode\_bounded}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 22: answer `596249bfd365` — Paper claim Theorem 22 (theorem-22) states: “Let $\kappa>0$, and let $y'=y^2(C-\kappa y)$ on $[0,T]$. Then $\min(y_0,C/\kappa,0)\le y(t)\le\max(y_0,C/\kappa,0)$.”. Lean theorem `ode_bounded` assumes `hy : ∀ t ∈ Icc 0 T, HasDerivAt y (y t ^ 2 * (C - κ * y t)) t`, which the claim does not state. Is this extra hypothesis intentional?
