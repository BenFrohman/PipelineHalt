/**
 * Full-coverage audit: every mathematical unit of a LaTeX paper (theorem-like
 * environments, prose sentences with math, displayed equations, table rows,
 * captions, the title) is extracted and classified. Nothing passes silently:
 * a unit is VERIFIED only when every Lean reference it carries resolves to a
 * declaration whose `#print axioms`-equivalent (collectAxioms) is standard.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export type UnitKind =
  | "title" | "environment" | "sentence" | "display" | "table-row"
  | "caption" | "heading" | "listing";

export type UnitStatus =
  | "verified"        // all Lean refs resolve, axiom-clean
  | "verified-audit"  // meta claim (zero sorry / standard axioms) checked by the global audit
  | "build-ok"        // numeric build claim matches the real build
  | "build-mismatch"  // numeric build claim disagrees with the real build
  | "broken"          // a Lean ref is missing or uses non-standard axioms
  | "open"            // explicitly flagged open/conjectural in the text or map
  | "silent"          // mathematical content with no Lean mapping
  | "non-claim";      // prose / heading / listing without mathematical content

export const FAILING: UnitStatus[] = ["build-mismatch", "broken"];
export const FLAGGED: UnitStatus[] = ["open", "silent"];

export interface Unit {
  id: string;
  kind: UnitKind;
  line: number;
  env?: string;
  text: string;
  refs: string[];
  status: UnitStatus;
  notes: string[];
}

export interface LeanFacts {
  modules: Record<string, { theorems: number; decls: number }>;
  refs: Record<string, { full: string; kind: string; axioms: string[]; binders?: string[] }[]>;
  /** Module-name prefix whose modules are counted for build-number claims. */
  primary?: string;
  nonstandard: string[];
  jobs?: number;
}

export interface AuditMapEntry { lean?: string[]; open?: string }
export type AuditMap = Record<string, AuditMapEntry>;

const STD = ["propext", "Classical.choice", "Quot.sound"];
const META = new Set(["sorry", "sorryAx", ...STD]);
const THM_ENVS =
  "theorem|lemma|proposition|corollary|definition|conjecture|assumption|hypothesis|remark|claim|example|notation|axiom|problem|question";
const DISPLAY_ENVS = "equation|align|gather|multline|eqnarray|displaymath|flalign";
const OPEN_RE =
  /\b(open assumption|open problem|open hypothesis|remains? open|is open|are open|left open|not (?:yet )?(?:proved|proven|derived|established|formali[sz]ed|claimed|discharged)|unproved|unproven|conjectur\w*|we do not claim|does not (?:prove|establish|close)|is not closed|projection lower[- ]bound gap|assumed\b|undischarged|\(open\))/i;

const MATH_RE = /\$|\\\(|\\\[|\\lean\{|\\begin\{(?:equation|align|gather)/;

export function unitId(kind: string, text: string): string {
  return createHash("sha256").update(kind + "\0" + text.replace(/\s+/g, " ").trim()).digest("hex").slice(0, 10);
}

function lineAt(src: string, i: number) { return src.slice(0, i).split("\n").length; }

function refsOf(s: string, extra: string[] = []): string[] {
  const out = new Set<string>(extra);
  for (const m of s.matchAll(/\\lean\{([^}]*)\}/g)) out.add(m[1]!.replace(/\\_/g, "_").trim());
  return [...out].filter(Boolean);
}

/** Split text into sentences; displayed math stays inside its sentence. */
export function sentences(s: string): string[] {
  const out: string[] = [];
  let depth = 0, start = 0, inMath = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    if (c === "\\" ) { i++; continue; }
    if (c === "{") depth++;
    else if (c === "}") depth = Math.max(0, depth - 1);
    else if (c === "$") inMath = !inMath;
    else if ((c === "." || c === "?" || c === "!") && depth === 0 && !inMath) {
      const before = s.slice(Math.max(0, i - 6), i);
      if (/(?:e\.g|i\.e|cf|Fig|Eq|Thm|Sec|resp|vs|etc|al|Prop|Lem|Def|Rem|No)$/.test(before)) continue;
      const nxt = s.slice(i + 1, i + 3);
      if (/^\s+[A-Z\\(]|^\s*$/.test(nxt) || i === s.length - 1) {
        out.push(s.slice(start, i + 1));
        start = i + 1;
      }
    }
  }
  if (s.slice(start).trim()) out.push(s.slice(start));
  return out.map((x) => x.trim()).filter((x) => x.replace(/\\[a-zA-Z]+|[{}\s~]/g, "").length > 0);
}

function isMath(s: string) { return MATH_RE.test(s); }

/** Extract every unit from a LaTeX document body. */
export function extractUnits(tex: string): { title?: Unit; units: Omit<Unit, "status" | "notes">[] } {
  const units: Omit<Unit, "status" | "notes">[] = [];
  // mask comments but keep "% lean:" annotations as explicit refs at that position
  const src = tex.replace(/(^|[^\\])%(.*)$/gm, (_m, p, c: string) => {
    const l = /^\s*lean:\s*(.*)/.exec(c);
    return p + (l ? ` \\leanannot{${l[1]!.trim()}} ` : "");
  });
  const annot = (s: string) => [...s.matchAll(/\\leanannot\{([^}]*)\}/g)].flatMap((m) => m[1]!.split(/[,\s]+/).filter(Boolean));
  const push = (kind: UnitKind, raw: string, idx: number, env?: string, inherit: string[] = []) => {
    const text = raw.replace(/\\leanannot\{[^}]*\}/g, "").replace(/\s+/g, " ").trim();
    if (!text) return;
    const u: Omit<Unit, "status" | "notes"> = { id: unitId(kind, text), kind, line: lineAt(src, idx), text, refs: refsOf(text, [...annot(raw), ...inherit]) };
    if (env) u.env = env;
    units.push(u);
  };
  const t = /\\title\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/.exec(src);
  if (t) push("title", t[1]!, t.index);
  const b = src.indexOf("\\begin{document}");
  const e = src.lastIndexOf("\\end{document}");
  let body = src.slice(b < 0 ? 0 : b + 16, e < 0 ? src.length : e);
  const off = b < 0 ? 0 : b + 16;
  // Work on a same-length mask so line numbers stay correct.
  const blank = (s: string) => s.replace(/[^\n]/g, " ");
  const consume = (re: RegExp, f: (m: RegExpMatchArray, at: number) => void) => {
    body = body.replace(re, (...args) => {
      const m = args.slice(0, -2) as unknown as RegExpMatchArray;
      const at = args[args.length - 2] as number;
      f(m, off + at);
      return blank(m[0]);
    });
  };
  consume(/\\begin\{(verbatim|Verbatim|lstlisting|minted)\}[\s\S]*?\\end\{\1\}|\\leanfile\{[^}]*\}|\\VerbatimInput(?:\[[^\]]*\])?\{[^}]*\}/g,
    (m, at) => push("listing", m[0], at));
  consume(new RegExp(`\\\\begin\\{(${THM_ENVS})\\*?\\}([\\s\\S]*?)\\\\end\\{\\1\\*?\\}`, "g"),
    (m, at) => push("environment", m[2]!, at, m[1]));
  consume(/\\caption\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g, (m, at) => push("caption", m[1]!, at));
  consume(/\\begin\{(tabular\*?|longtable|tabularx)\}([\s\S]*?)\\end\{\1\}/g, (m, at) => {
    let pos = 0;
    for (const row of m[2]!.split(/\\\\/)) {
      const r = row.replace(/\\(?:hline|toprule|midrule|bottomrule|cline\{[^}]*\})/g, "").replace(/^\{[^}]*\}/, "");
      if (r.replace(/[&\s]/g, "")) push("table-row", r, at + pos);
      pos += row.length + 2;
    }
  });
  consume(/\\(?:part|chapter|section|subsection|subsubsection|paragraph)\*?\{((?:[^{}]|\{[^{}]*\})*)\}/g,
    (m, at) => push(isMath(m[1]!) ? "sentence" : "heading", m[1]!, at));
  // Prose: split remaining body into paragraphs then sentences; displays become extra units.
  const dispRe = new RegExp(`\\\\\\[[\\s\\S]*?\\\\\\]|\\$\\$[\\s\\S]*?\\$\\$|\\\\begin\\{(${DISPLAY_ENVS})\\*?\\}[\\s\\S]*?\\\\end\\{\\1\\*?\\}`, "g");
  let cursor = 0;
  for (const para of body.split(/\n\s*\n/)) {
    const at = body.indexOf(para, cursor);
    cursor = at + para.length;
    const p = para.replace(/\\(?:begin|end)\{(?:itemize|enumerate|description|center|abstract|proof|table|figure|quote|small|footnotesize)\*?\}(?:\[[^\]]*\])?/g, " ").replace(/\\item(?:\[[^\]]*\])?/g, "\n\n");
    for (const chunk of p.split(/\n\s*\n/)) {
      for (const s of sentences(chunk)) {
        const sAt = off + at + Math.max(0, para.indexOf(s.slice(0, 20)));
        const refs = refsOf(s, annot(s));
        push("sentence", s, sAt);
        for (const d of s.matchAll(dispRe)) push("display", d[0], sAt, d[1], refs);
      }
    }
  }
  const title = units.find((u) => u.kind === "title");
  return { title: title as Unit | undefined, units: units.sort((x, y) => x.line - y.line) };
}

function plain(s: string) {
  return s.replace(/\\(?:textbf|emph|texttt|textit|mathrm|lean)\{([^}]*)\}/g, "$1").replace(/\\_/g, "_").replace(/~/g, " ");
}

export interface BuildClaim { what: "theorems" | "modules" | "jobs"; claimed: number }
export function buildClaims(s: string): BuildClaim[] {
  const p = plain(s);
  const out: BuildClaim[] = [];
  for (const m of p.matchAll(/(\d[\d,]*)\s*(?:total\s+)?(theorems|modules|jobs)\b/g))
    out.push({ what: m[2] as BuildClaim["what"], claimed: Number(m[1]!.replace(/,/g, "")) });
  return out;
}

/**
 * A \\lean{...} argument may be a declaration name, a module file, or a Lean
 * expression such as "NS_PDE u p ν" or "phys : IsPhysicalNSSolution u". The
 * declaration that must resolve is the head identifier (of the type, after a colon).
 */
export function refHead(r: string): { head: string; binder?: string; expr: boolean } {
  if (r.endsWith(".lean") || META.has(r)) return { head: r, expr: false };
  const colon = /^([^\s:]+)\s*:\s*(.+)$/.exec(r);
  const body = colon ? colon[2]! : r;
  const head = /^[^\s()]+/.exec(body.replace(/^[(¬\s]+/, ""))?.[0] ?? body;
  const out: { head: string; binder?: string; expr: boolean } = { head, expr: head !== r };
  if (colon) out.binder = colon[1]!;
  return out;
}

export function leanHeads(refs: string[]): string[] {
  return [...new Set(refs.filter((r) => !r.endsWith(".lean") && !META.has(r)).map((r) => refHead(r).head))];
}

function resolveModuleRef(r: string, facts: LeanFacts): string | undefined {
  const stem = r.replace(/\.lean$/, "").replace(/\//g, ".");
  return Object.keys(facts.modules).find((m) => m === stem || m.endsWith("." + stem));
}

export function realCounts(f: LeanFacts) {
  const mods = Object.entries(f.modules).filter(([k]) => !f.primary || k === f.primary || k.startsWith(f.primary + ".")).map(([, v]) => v);
  return {
    theorems: mods.reduce((a, m) => a + m.theorems, 0),
    modules: mods.length,
    jobs: f.jobs,
  };
}

export function classify(u: Omit<Unit, "status" | "notes">, facts: LeanFacts, map: AuditMap = {}): Unit {
  const notes: string[] = [];
  const mapped = map[u.id];
  const refs = [...new Set([...u.refs, ...(mapped?.lean ?? [])])];
  const out = (status: UnitStatus): Unit => ({ ...u, refs, status, notes });
  if (u.kind === "listing") return (notes.push("verbatim Lean listing (code, not a claim)"), out("non-claim"));
  const real = realCounts(facts);
  const bc = buildClaims(u.text);
  if (bc.length) {
    let bad = false;
    for (const c of bc) {
      const r = real[c.what];
      if (r === undefined) { notes.push(`${c.what}: no real value available`); bad = true; }
      else if (r !== c.claimed) { notes.push(`${c.what}: paper says ${c.claimed}, real ${r}`); bad = true; }
      else notes.push(`${c.what}: ${c.claimed} matches`);
    }
    if (bad) return out("build-mismatch");
  }
  const math = isMath(u.text) || u.kind === "environment" || u.kind === "display" || refs.length > 0;
  if (!math && !bc.length) return out("non-claim");
  let resolved = 0, metaOnly = true;
  let broken = false;
  for (const r of refs) {
    if (META.has(r)) continue;
    metaOnly = false;
    if (r.endsWith(".lean")) {
      const m = resolveModuleRef(r, facts);
      if (!m) { notes.push(`module ${r} not in build`); broken = true; continue; }
      const nonstd = facts.nonstandard.filter((n) => n.startsWith(m + "\t"));
      if (nonstd.length) { notes.push(`module ${m} has non-standard axioms`); broken = true; }
      else { notes.push(`module ${m}: ${facts.modules[m]!.theorems} theorems, all standard`); resolved++; }
      continue;
    }
    const { head, binder, expr } = refHead(r);
    let hits = facts.refs[head];
    if (!hits?.length) {
      // a hypothesis name: must be a binder of some other declaration cited by this unit
      const owners = refs.filter((x) => x !== r).flatMap((x) => facts.refs[refHead(x).head] ?? []).filter((h) => h.binders?.includes(head));
      if (owners.length) { notes.push(`${head} is a hypothesis of ${owners.map((o) => o.full).join(", ")}`); continue; }
      notes.push(`\\lean{${r}} not found`); broken = true; continue;
    }
    if (expr) notes.push(`expression \\lean{${r}}: head ${head}${binder ? ` (binder ${binder})` : ""}`);
    if (hits.length > 1) notes.push(`\\lean{${head}} ambiguous: ${hits.map((h) => h.full).join(", ")}`);
    let bad = false;
    for (const h of hits) {
      const ns = h.axioms.filter((a) => !STD.includes(a));
      if (ns.length) { notes.push(`${h.full} uses ${ns.join(", ")}`); bad = true; }
    }
    if (bad) { broken = true; continue; }
    resolved++;
    notes.push(`${hits.map((h) => h.full).join(" | ")} [${hits[0]!.kind}] axioms: ${hits[0]!.axioms.join(", ") || "none"}`);
  }
  if (broken) return out("broken");
  const open = mapped?.open ?? (OPEN_RE.exec(plain(u.text))?.[0]);
  if (open) { notes.push(`open: ${open}`); return out("open"); }
  if (resolved > 0) return out("verified");
  if (bc.length) return out("build-ok");
  if (refs.length && metaOnly) {
    if (facts.nonstandard.length === 0) { notes.push("zero sorry / standard-axioms claim checked against the global audit"); return out("verified-audit"); }
    notes.push("global audit found non-standard axioms"); return out("broken");
  }
  notes.push("mathematical content with no Lean mapping");
  return out("silent");
}

export interface AuditReport {
  source: string;
  title?: string;
  counts: Record<UnitStatus, number>;
  total: number;
  classified: number;
  coverage: number;
  real: ReturnType<typeof realCounts>;
  verdict: "PASS" | "HALT" | "FAIL";
  units: Unit[];
}

export function audit(tex: string, facts: LeanFacts, map: AuditMap = {}, source = "<tex>"): AuditReport {
  const { units } = extractUnits(tex);
  const cl = units.map((u) => classify(u, facts, map));
  const counts = Object.fromEntries((["verified", "verified-audit", "build-ok", "build-mismatch", "broken", "open", "silent", "non-claim"] as UnitStatus[]).map((s) => [s, 0])) as Record<UnitStatus, number>;
  for (const u of cl) counts[u.status]++;
  const classified = cl.filter((u) => u.status in counts).length;
  const verdict = cl.some((u) => FAILING.includes(u.status)) ? "FAIL" : cl.some((u) => FLAGGED.includes(u.status)) ? "HALT" : "PASS";
  const r: AuditReport = { source, counts, total: cl.length, classified, coverage: cl.length ? classified / cl.length : 1, real: realCounts(facts), verdict, units: cl };
  const t = cl.find((u) => u.kind === "title");
  if (t) r.title = t.text;
  return r;
}

/** Lean script that resolves every ref and counts the build; parsed by parseLeanFacts. */
export function leanScript(root: string, prefix: string, refs: string[]): string {
  const lit = leanHeads(refs).map((r) => JSON.stringify(r)).join(", ");
  const roots = root.split(",");
  const prefixes = prefix.split(",").map((p) => "\`" + p).join(", ");
  return `${roots.map((r) => "import " + r).join("\n")}
open Lean Elab Command
def phBinders : Expr → List String
  | .forallE n _ b _ => n.toString :: phBinders b
  | _ => []
#eval show CommandElabM Unit from do
  let env ← getEnv
  let std := [\`\`propext, \`\`Classical.choice, \`\`Quot.sound]
  let mut mods : Std.HashMap Name (Nat × Nat) := {}
  let mut proj : Array Name := #[]
  for (n, ci) in env.constants.toList do
    if n.isInternal then continue
    let some idx := env.getModuleIdxFor? n | continue
    let mod := env.header.moduleNames[idx.toNat]!
    unless ([${prefixes}] : List Name).any (·.isPrefixOf mod) do continue
    proj := proj.push n
    let (t, d) := mods.getD mod (0, 0)
    let isThm := ci matches .thmInfo _
    mods := mods.insert mod (if isThm then t + 1 else t, d + 1)
    if isThm then
      let axs ← liftCoreM <| Lean.collectAxioms n
      for a in axs do
        unless std.contains a do IO.println s!"PH_NONSTD\\t{mod}\\t{n}\\t{a}"
  IO.println "PH_PRIMARY\\t${prefix.split(",")[0]}"
  for (m, (t, d)) in mods.toList do IO.println s!"PH_MOD\\t{m}\\t{t}\\t{d}"
  for r in ([${lit}] : List String) do
    let mut hits := proj.filter fun n => n.toString == r || n.toString.endsWith ("." ++ r)
    if hits.isEmpty && env.contains r.toName then hits := #[r.toName]
    if hits.isEmpty then IO.println s!"PH_MISSING\\t{r}"
    for h in hits do
      let kind := match env.find? h with
        | some (.thmInfo _) => "theorem" | some (.defnInfo _) => "def" | some (.axiomInfo _) => "axiom"
        | some (.inductInfo _) => "inductive" | some (.ctorInfo _) => "ctor" | some (.opaqueInfo _) => "opaque"
        | some _ => "other" | none => "?"
      let axs ← liftCoreM <| Lean.collectAxioms h
      let bs := match env.find? h with | some ci => phBinders ci.type | none => []
      IO.println s!"PH_REF\\t{r}\\t{h}\\t{kind}\\t{",".intercalate (axs.toList.map toString)}\\t{",".intercalate bs}"
`;
}

export function parseLeanFacts(out: string, buildLog?: string): LeanFacts {
  const f: LeanFacts = { modules: {}, refs: {}, nonstandard: [] };
  for (const line of out.split("\n")) {
    const p = line.split("\t");
    if (p[0] === "PH_MOD") f.modules[p[1]!] = { theorems: Number(p[2]), decls: Number(p[3]) };
    else if (p[0] === "PH_NONSTD") f.nonstandard.push(`${p[1]}\t${p[2]}\t${p[3]}`);
    else if (p[0] === "PH_MISSING") f.refs[p[1]!] ??= [];
    else if (p[0] === "PH_REF") (f.refs[p[1]!] ??= []).push({ full: p[2]!, kind: p[3]!, axioms: p[4] ? p[4].split(",") : [], binders: p[5] ? p[5].split(",") : [] });
    else if (p[0] === "PH_PRIMARY") f.primary = p[1]!;
  }
  const jobs = buildLog && /Build completed successfully \((\d+) jobs\)/.exec(buildLog);
  if (jobs) f.jobs = Number(jobs[1]);
  return f;
}

export function runLean(project: string, root: string, prefix: string, refs: string[], lake = "lake"): string {
  const dir = mkdtempSync(join(tmpdir(), "phaudit-"));
  const file = join(dir, "Audit.lean");
  writeFileSync(file, leanScript(root, prefix, refs));
  try {
    return execFileSync(lake, ["env", "lean", file], { cwd: project, encoding: "utf8", maxBuffer: 1 << 28 });
  } catch (e: any) {
    const out = String(e?.stdout ?? "") + String(e?.stderr ?? "");
    const errs = out.split("\n").filter((l) => /error/.test(l)).slice(0, 20).join("\n");
    throw new Error(`lean audit script failed (${file}):\n${errs || out.slice(-2000)}`);
  }
}

export function auditMarkdown(r: AuditReport): string {
  const L: string[] = [];
  L.push(`# PipelineHalt full-coverage audit — ${r.source}`, "");
  if (r.title) L.push(`Title: ${r.title}`, "");
  L.push(`Verdict: **${r.verdict}** · units ${r.total} · classified ${r.classified}/${r.total} (${(r.coverage * 100).toFixed(1)}%)`, "");
  L.push(`Real build: ${r.real.theorems} theorems across ${r.real.modules} modules, ${r.real.jobs ?? "?"} lake jobs`, "");
  L.push("| status | count |", "|---|---|");
  for (const [k, v] of Object.entries(r.counts)) L.push(`| ${k} | ${v} |`);
  L.push("", "VERIFIED means every Lean reference resolves and depends only on propext / Classical.choice / Quot.sound. It does not mean the Lean statement says the same thing as the prose; OPEN and SILENT units are flags that need a human answer.", "");
  L.push("| id | line | kind | status | refs | notes | text |", "|---|---|---|---|---|---|---|");
  const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
  for (const u of r.units)
    L.push(`| ${u.id} | ${u.line} | ${u.kind}${u.env ? ":" + u.env : ""} | ${u.status} | ${esc(u.refs.join(", "))} | ${esc(u.notes.join("; "))} | ${esc(u.text.length > 160 ? u.text.slice(0, 157) + "..." : u.text)} |`);
  return L.join("\n") + "\n";
}
