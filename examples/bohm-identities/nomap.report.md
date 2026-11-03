# PipelineHalt report: \textbf{Exact Madelung and Bohm Quantum Potential Identities in Core Lean 4 (Zero Mathlib Dependencies)

Status: **HALT** · overall drift **0.300** · 2 claims · 5 Lean declarations scanned · 2 open question(s)

Mapping file: none (heuristic pairing only).

> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.

| Claim | Matched Lean | Drift | Open | Answered |
|---|---|---|---|---|
| Theorem 1 | `guidance_cleared` (0.28) | 0.300 | 1 | 0 |
| Theorem 2 | `quantumPotential_cleared` (0.45) | 0.300 | 1 | 0 |

## Theorem 1 — \texttt{Bohm.guidance\_cleared}

- `23ecb9fc2fd5` AMBIGUOUS: Title “\texttt{Bohm.guidance\_cleared}” shares almost no terms with the statement. — **OPEN**

## Theorem 2 — \texttt{Bohm.quantumPotential\_cleared}

- `fdae7eda3cb7` AMBIGUOUS: Title “\texttt{Bohm.quantumPotential\_cleared}” shares almost no terms with the statement. — **OPEN**

## Realignment notes

- Theorem 1: answer `23ecb9fc2fd5` — Paper claim Theorem 1 (theorem-1) states: “For all $R, dR, c, s, dS \in \mathbb{Z}$: \[ (dR \cdot s + R \cdot c \cdot dS)(R \cdot c) - (dR \cdot c - R \cdot s \cdot dS)(R \cdot s) = dS \cdot \bigl((R \cdot c)^2 + (R \cdot s)^2\bigr). \]”. Its title is “\texttt{Bohm.guidance\_cleared}”, which does not appear to describe that statement. Is the title or the statement misworded?
- Theorem 2: answer `fdae7eda3cb7` — Paper claim Theorem 2 (theorem-2) states: “For all $\Delta R, R \in \mathbb{Z}$: \[ (-\Delta R) \cdot (2R) = 2 \cdot ((-\Delta R) \cdot R). \]”. Its title is “\texttt{Bohm.quantumPotential\_cleared}”, which does not appear to describe that statement. Is the title or the statement misworded?
