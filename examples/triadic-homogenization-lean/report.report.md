# PipelineHalt report: \textbf{Homogenization: Triadic Partition, Cube Measure, Cube Average, and Telescoping Increment Lemmas in Lean 4

Status: **HALT** · overall drift **0.750** · 4 claims · 20 Lean declarations scanned · 4 open question(s)

Mapping file: `../../PipelineHalt/examples/triadic-homogenization-lean/pipelinehalt.map.json` (human-authored claim → Lean pairing; mapped claims skip heuristic matching).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Definition 1 | — | 1.000 | 1 | 0 |
| Lemma 2 | `cubeProjection_eq_zero_of_not_mem_cubeSet` (0.214), `cubeIncrement_eq_zero_of_not_mem_cubeSet` (0.214) | 0.000 | 0 | 0 |
| Lemma 3 | — | 1.000 | 1 | 0 |
| Theorem 4 | — | 1.000 | 2 | 0 |

## Definition 1 — Half-Open Triadic Cube

- `97f9dda3f0d1` SILENT: No Lean declaration matches this claim. — **OPEN**

## Lemma 3 — Normalized Cube Average Properties -- \texttt{cubeAvg\_add}, \texttt{cubeAvg\_smul}, \texttt{cubeAvg\_const}

- `a39f434f7495` SILENT: No Lean declaration matches this claim. Closest candidate: `cubeAverage_const` (score 0.15, below threshold 0.2). — **OPEN**

## Theorem 4 — Multi-Scale Telescoping Increment Identity and Norm Bound -- \texttt{telescoping\_increments} \& \texttt{norm\_Increment\_le\_sum}

- `5c95292644f4` SILENT: No Lean declaration matches this claim. Closest candidate: `cubeIncrement_succ_const` (score 0.17, below threshold 0.2). — **OPEN**
- `82a054ead188` AMBIGUOUS: Title “Multi-Scale Telescoping Increment Identity and Norm Bound -- \texttt{telescoping\_increments} \& \texttt{norm\_Increment\_le\_sum}” shares almost no terms with the statement. — **OPEN**

## Realignment notes

- Definition 1: answer `97f9dda3f0d1` — Paper claim Definition 1 (definition-1) states: “For $d \in \mathbb{N}$, scale exponent $m \in \mathbb{N}$, and center $z \in \mathbb{R}^d$, the triadic cube $\mathrm{cube}(m,z) \subset \mathbb{R}^d$ is defined coordinatewise by \[ \mathrm{cube}(m,…”. No Lean declaration matching it was found among 0 candidates. Is this claim intentionally not formalized, or which declaration should it map to?
- Lemma 3: answer `a39f434f7495` — Paper claim Lemma 3 (lemma-3) states: “Let $\mathrm{cubeAvg}(m,z,g) := \mu_{\mathbb{R}}(\mathrm{cube}(m,z))^{-1} \int_{x \in \mathrm{cube}(m,z)} g(x)\,d\mu(x)$. Then: • For $g_1, g_2$ integrable on $\mathrm{cube}(m,z)$, $\mathrm{cubeAvg}(…”. No Lean declaration matching it was found among 20 candidates. Closest candidate: `cubeAverage_const` (score 0.15, below threshold 0.2). Is this claim intentionally not formalized, or which declaration should it map to?
- Theorem 4: answer `5c95292644f4` — Paper claim Theorem 4 (theorem-4) states: “For every $m, K \in \mathbb{N}$, $z \in \mathbb{R}^d$, and field $g : \mathbb{R}^d \to E$: \[ \mathrm{cubeAvg}(m+K,z,g) - \mathrm{cubeAvg}(m,z,g) = \sum_{k=0}^{K-1} \bigl(\mathrm{cubeAvg}(m+k+1,z,g) …”. No Lean declaration matching it was found among 20 candidates. Closest candidate: `cubeIncrement_succ_const` (score 0.17, below threshold 0.2). Is this claim intentionally not formalized, or which declaration should it map to?
- Theorem 4: answer `82a054ead188` — Paper claim Theorem 4 (theorem-4) states: “For every $m, K \in \mathbb{N}$, $z \in \mathbb{R}^d$, and field $g : \mathbb{R}^d \to E$: \[ \mathrm{cubeAvg}(m+K,z,g) - \mathrm{cubeAvg}(m,z,g) = \sum_{k=0}^{K-1} \bigl(\mathrm{cubeAvg}(m+k+1,z,g) …”. Its title is “Multi-Scale Telescoping Increment Identity and Norm Bound -- \texttt{telescoping\_increments} \& \texttt{norm\_Increment\_le\_sum}”, which does not appear to describe that statement. Is the title or the statement misworded?
