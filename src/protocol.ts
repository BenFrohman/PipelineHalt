import { loadAnchor, saveClarifications } from "./anchor.js";
import { resolveMap, type ClaimMap } from "./map.js";
import { compare, type CompareOptions } from "./compare.js";
import { record } from "./halt.js";
import { loadLean, parseLean } from "./lean.js";
import type { Anchor, LeanDecl, Report, Verdict } from "./types.js";

/** JSON request an agent (Grok chat tool call, Grokbot, CI script) sends on stdin. */
export interface AgentRequest {
  /** Path to an anchor (.json/.md/.tex/.pdf) or an inline anchor object. */
  anchor: string | Anchor;
  /** Mapping file path, inline map, or false to disable. Default: auto-discover beside a file anchor. */
  map?: string | ClaimMap | false;
  /** Paths to .lean files or directories. */
  lean?: string[];
  /** Inline Lean sources, as an alternative to paths: {"File.lean": "theorem ..."}. */
  leanSources?: Record<string, string>;
  /** Answers to previously issued questions, keyed by question id. */
  answers?: Record<string, string | { answer: string; verdict?: Verdict }>;
  options?: CompareOptions;
}

export interface AgentResponse {
  protocol: "pipelinehalt/1";
  status: Report["status"];
  /** 0 aligned, 1 drift over threshold, 2 halted on open questions. */
  exitCode: 0 | 1 | 2;
  drift: number;
  /** The agent MUST relay these to the human verbatim and stop until they are answered. */
  questions: { id: string; claimId: string; kind: string; question: string }[];
  recorded: string[];
  savedTo?: string;
  /** Inline anchor with clarifications, returned when the request anchor was inline. */
  anchor?: Anchor;
  report: Report;
}

export function exitCodeFor(status: Report["status"]): 0 | 1 | 2 {
  return status === "halt" ? 2 : status === "drift" ? 1 : 0;
}

export function handle(req: AgentRequest): AgentResponse {
  const base =
    typeof req.anchor === "string"
      ? loadAnchor(req.anchor)
      : {
          ...req.anchor,
          clarifications: { ...(req.anchor.clarifications ?? {}) },
        };
  const { anchor, mapFile, warnings } = resolveMap(
    base,
    typeof req.anchor === "string" ? req.anchor : undefined,
    req.map,
  );
  const tag = (r: Report): Report => ({
    ...r,
    mapFile,
    mapWarnings: warnings.length ? warnings : undefined,
  });
  const decls: LeanDecl[] = [
    ...(req.lean?.length ? loadLean(req.lean) : []),
    ...Object.entries(req.leanSources ?? {}).flatMap(([f, s]) =>
      parseLean(s, f),
    ),
  ];
  let report = tag(compare(anchor, decls, req.options));
  const recorded: string[] = [];
  if (req.answers && Object.keys(req.answers).length) {
    const all = report.claims.flatMap((c) => c.mismatches);
    for (const [id, a] of Object.entries(req.answers)) {
      const m = all.find((x) => x.id === id);
      if (!m) continue; // unknown or stale id: ignored, never guessed
      const text = typeof a === "string" ? a : a.answer;
      if (!text.trim()) continue;
      record(anchor, m, text, typeof a === "string" ? undefined : a.verdict);
      recorded.push(id);
    }
    report = tag(compare(anchor, decls, req.options));
  }
  let savedTo: string | undefined;
  if (recorded.length && typeof req.anchor === "string")
    savedTo = saveClarifications(req.anchor, anchor.clarifications);
  return {
    protocol: "pipelinehalt/1",
    status: report.status,
    exitCode: exitCodeFor(report.status),
    drift: report.drift,
    questions: report.pending.map((m) => ({
      id: m.id,
      claimId: m.claimId,
      kind: m.kind,
      question: m.question,
    })),
    recorded,
    ...(savedTo ? { savedTo } : {}),
    ...(typeof req.anchor === "string"
      ? {}
      : { anchor: { ...base, clarifications: anchor.clarifications } }),
    report,
  };
}
