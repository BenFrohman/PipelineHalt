import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import type { Anchor, Claim, Clarification } from "./types.js";

const CLAR_FENCE = "```json pipelinehalt-clarifications";

/** Parse a Markdown anchor. Format:
 *  # Title
 *  ## Claim <id>[ (<number>)]: <title>
 *  statement paragraphs...
 *  - lean: a, b
 *  - assumes: free text
 *  - kind: theorem
 *  Optional trailing ```json pipelinehalt-clarifications block. */
export function parseMarkdownAnchor(md: string): Anchor {
  const anchor: Anchor = { claims: [], clarifications: {} };
  const fence = md.indexOf(CLAR_FENCE);
  if (fence >= 0) {
    const end = md.indexOf("```", fence + CLAR_FENCE.length);
    anchor.clarifications = JSON.parse(md.slice(fence + CLAR_FENCE.length, end)) as Record<
      string,
      Clarification
    >;
    md = md.slice(0, fence);
  }
  const title = /^#\s+(.+)$/m.exec(md);
  if (title) anchor.title = title[1]!.trim();
  const parts = md.split(/^##\s+/m).slice(1);
  for (const p of parts) {
    const [head, ...lines] = p.split("\n");
    const h = /^Claim\s+(\S+?)(?:\s+\(([^)]+)\))?\s*(?::\s*(.*))?$/.exec(head!.trim());
    if (!h) continue;
    const claim: Claim = { id: h[1]!, statement: "" };
    if (h[2]) claim.number = h[2];
    if (h[3]) claim.title = h[3].trim();
    const body: string[] = [];
    for (const l of lines) {
      const m = /^-\s*(lean|assumes|kind|source)\s*:\s*(.*)$/i.exec(l.trim());
      if (!m) {
        body.push(l);
        continue;
      }
      const key = m[1]!.toLowerCase();
      const val = m[2]!.trim();
      if (key === "lean")
        claim.lean = val
          .split(/[,\s]+/)
          .map((x) => x.replace(/`/g, ""))
          .filter(Boolean);
      else if (key === "assumes") (claim.assumptions ??= []).push(val);
      else if (key === "kind") claim.kind = val as Claim["kind"];
      else claim.source = val;
    }
    claim.statement = body.join("\n").trim().replace(/\s+/g, " ");
    anchor.claims.push(claim);
  }
  return anchor;
}

export function renderMarkdownClarifications(md: string, clar: Record<string, Clarification>): string {
  const fence = md.indexOf(CLAR_FENCE);
  const base = (fence >= 0 ? md.slice(0, fence) : md).trimEnd();
  return `${base}\n\n${CLAR_FENCE}\n${JSON.stringify(clar, null, 2)}\n\`\`\`\n`;
}

const ENV = "theorem|lemma|proposition|corollary|definition|conjecture|claim|hypothesis";

/** Extract claims from LaTeX theorem-like environments. Best effort; numbering follows a shared counter.
 *  A comment `% lean: a, b` inside the environment gives an explicit mapping. */
export function extractLatex(tex: string, source = "<tex>"): Anchor {
  const title = /\\title\{([^}]*)\}/.exec(tex)?.[1];
  const re = new RegExp(
    `\\\\begin\\{(${ENV})\\*?\\}(?:\\[([^\\]]*)\\])?([\\s\\S]*?)\\\\end\\{\\1\\*?\\}`,
    "g",
  );
  const claims: Claim[] = [];
  // Shared amsthm-style counter, reset per \section when any \newtheorem uses [section].
  const perSection = /\\newtheorem\{[^}]+\}\{[^}]+\}\[section\]/.test(tex);
  const counted = new RegExp(`\\\\begin\\{(${ENV}|remark|example)\\}|\\\\section\\*?\\{`, "g");
  const numberAt = new Map<number, string>();
  let sec = 0;
  let n = 0;
  for (const m of tex.matchAll(counted)) {
    if (m[0].startsWith("\\section")) {
      if (!m[0].includes("*")) sec++;
      if (perSection) n = 0;
      continue;
    }
    n++;
    numberAt.set(m.index!, perSection ? `${sec}.${n}` : `${n}`);
  }
  for (const m of tex.matchAll(re)) {
    let body = m[3]!;
    const label = /\\label\{([^}]*)\}/.exec(body)?.[1];
    const lean = /%\s*lean:\s*(.*)/.exec(body)?.[1];
    body = body
      .replace(/%.*$/gm, "")
      .replace(/\\label\{[^}]*\}/g, "")
      .replace(/\\leavevmode/g, "")
      .replace(/\\(begin|end)\{(enumerate|itemize)\}/g, " ")
      .replace(/\\item\b/g, " •");
    const kind = m[1] as NonNullable<Claim["kind"]>;
    const num = numberAt.get(m.index!) ?? "?";
    const c: Claim = {
      id: label ?? `${kind}-${num}`,
      number: `${kind[0]!.toUpperCase()}${kind.slice(1)} ${num}`,
      statement: body.replace(/\s+/g, " ").trim(),
      kind,
      source: `${source}:${tex.slice(0, m.index).split("\n").length}`,
    };
    if (m[2]) c.title = m[2];
    if (lean) c.lean = lean.split(/[,\s]+/).filter(Boolean);
    claims.push(c);
  }
  return { title, source, claims, clarifications: {} };
}

/** Best-effort PDF extraction via `pdftotext` (poppler). Splits on "Theorem N." style headings. */
export function extractPdf(path: string): Anchor {
  const txt = execFileSync("pdftotext", ["-layout", path, "-"], { encoding: "utf8" });
  const re =
    /^\s*(Theorem|Lemma|Proposition|Corollary|Definition|Conjecture|Hypothesis)\s+(\d+(?:\.\d+)*)\.?\s*(?:\(([^)]*)\))?\s*([\s\S]*?)(?=^\s*(?:Proof|Theorem|Lemma|Proposition|Corollary|Definition|Conjecture|Hypothesis)\b|^\s*\d+\s+[A-Z][a-z]+|$(?![\s\S]))/gm;
  const claims: Claim[] = [];
  for (const m of txt.matchAll(re)) {
    const kind = m[1]!.toLowerCase() as Claim["kind"];
    claims.push({
      id: `${kind}-${m[2]}`,
      number: `${m[1]} ${m[2]}`,
      ...(m[3] ? { title: m[3] } : {}),
      statement: m[4]!.replace(/\s+/g, " ").trim(),
      kind,
      source: path,
    });
  }
  return { source: path, claims, clarifications: {} };
}

const sidecar = (p: string) => `${p}.pipelinehalt.json`;

export function loadAnchor(path: string): Anchor {
  let a: Anchor;
  if (path.endsWith(".json")) {
    a = JSON.parse(readFileSync(path, "utf8")) as Anchor;
    a.clarifications ??= {};
  } else if (path.endsWith(".md")) a = parseMarkdownAnchor(readFileSync(path, "utf8"));
  else if (path.endsWith(".tex")) a = extractLatex(readFileSync(path, "utf8"), path);
  else if (path.endsWith(".pdf")) a = extractPdf(path);
  else throw new Error(`unsupported anchor format: ${path}`);
  if (!a.claims?.length) throw new Error(`anchor ${path} contains no claims`);
  if ((path.endsWith(".tex") || path.endsWith(".pdf")) && existsSync(sidecar(path))) {
    a.clarifications = (JSON.parse(readFileSync(sidecar(path), "utf8")) as Anchor).clarifications ?? {};
  }
  return a;
}

/** Persist clarifications into the anchor (inline for JSON/Markdown, sidecar for LaTeX/PDF).
 *  Only the clarifications block is written; claim text is never modified. */
export function saveClarifications(path: string, clar: Record<string, Clarification>): string {
  if (path.endsWith(".json")) {
    const a = JSON.parse(readFileSync(path, "utf8")) as Anchor;
    a.clarifications = clar;
    writeFileSync(path, JSON.stringify(a, null, 2) + "\n");
    return path;
  }
  if (path.endsWith(".md")) {
    writeFileSync(path, renderMarkdownClarifications(readFileSync(path, "utf8"), clar));
    return path;
  }
  writeFileSync(sidecar(path), JSON.stringify({ clarifications: clar }, null, 2) + "\n");
  return sidecar(path);
}
