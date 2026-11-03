/** A single claim taken from the paper. The paper is the anchor: PipelineHalt never edits it. */
export interface Claim {
  /** Stable identifier, e.g. "3.2" or a LaTeX label such as "thm:main". */
  id: string;
  /** Human-facing number as printed in the paper, e.g. "Theorem 2". Optional. */
  number?: string;
  title?: string;
  statement: string;
  kind?:
    | "theorem"
    | "lemma"
    | "proposition"
    | "corollary"
    | "definition"
    | "conjecture"
    | "claim"
    | "hypothesis";
  /** Explicit Lean declaration names this claim maps to. When absent, matching is heuristic. */
  lean?: string[];
  /** Assumptions the paper states explicitly (free text). Used when checking Lean hypotheses. */
  assumptions?: string[];
  /** Other numberings that mean this claim, e.g. "Theorem 1" in Lean docstrings for paper Theorem 3.1. Usually set by the mapping file. */
  aliases?: string[];
  /** Source location, e.g. "paper/note.tex:86". */
  source?: string;
}

export type Verdict = "intentional" | "unintended" | "other";

export interface Clarification {
  claimId: string;
  kind: MismatchKind;
  question: string;
  answer: string;
  verdict: Verdict;
  answeredAt: string;
}

export interface Anchor {
  title?: string;
  source?: string;
  claims: Claim[];
  /** Recorded user answers keyed by stable mismatch id. Never rewritten automatically. */
  clarifications: Record<string, Clarification>;
  /** Lean names deliberately not mapped to any claim (name → reason). Usually from the mapping file. */
  unclaimed?: Record<string, string>;
}

export interface Binder {
  names: string[];
  type: string;
  bracket: "(" | "{" | "[" | "⦃";
}

export interface LeanDecl {
  kind: string;
  name: string;
  fullName: string;
  file: string;
  line: number;
  doc?: string;
  binders: Binder[];
  /** Type after the top-level colon (empty for structures without one). */
  type: string;
  usesSorry: boolean;
  /** Names of project-declared axioms referenced in the body or type. */
  usesAxioms: string[];
}

export type MismatchKind = "silent" | "narrower" | "conditional" | "ambiguous";

export interface Mismatch {
  /** Stable 12-hex id: sha256 of claim id, kind, lean name and detail key. */
  id: string;
  claimId: string;
  kind: MismatchKind;
  lean?: string;
  /** Short machine-readable key for what differs (part of the hash). */
  key: string;
  detail: string;
  question: string;
  weight: number;
  clarification?: Clarification;
}

export interface ClaimResult {
  claim: Claim;
  matched: { name: string; score: number; explicit: boolean }[];
  mismatches: Mismatch[];
  drift: number;
}

export interface Report {
  tool: "pipelinehalt";
  /** Mapping file used, if any. */
  mapFile?: string;
  /** Problems with the mapping file (e.g. unknown claim ids). */
  mapWarnings?: string[];
  version: string;
  anchorTitle?: string;
  generatedAt: string;
  declarationsScanned: number;
  claims: ClaimResult[];
  /** Lean theorems whose docstring cites a paper number no claim carries. Informational. */
  unanchored: { name: string; cites: string }[];
  drift: number;
  pending: Mismatch[];
  status: "aligned" | "halt" | "drift";
}
