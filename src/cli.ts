import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Readable, Writable } from "node:stream";
import {
  extractLatex,
  extractPdf,
  loadAnchor,
  saveClarifications,
} from "./anchor.js";
import { compare, VERSION } from "./compare.js";
import {
  askInteractive,
  pendingFile,
  record,
  type PendingFile,
} from "./halt.js";
import { loadLean } from "./lean.js";
import { audit, auditMarkdown, extractUnits, parseLeanFacts, runLean, type AuditMap } from "./audit.js";
import { resolveMap } from "./map.js";
import { exitCodeFor, handle, type AgentRequest } from "./protocol.js";
import { toAnnotations, toJson, toMarkdown } from "./report.js";
import type { Verdict } from "./types.js";

export const HELP = `pipelinehalt ${VERSION} — compare paper claims (anchor) with Lean statements; halt and ask on mismatch.

Usage:
  pipelinehalt check   --anchor <claims.json|.md|.tex|.pdf> --lean <path>... [options]
  pipelinehalt answer  --anchor <file> (--id <id> --text "<answer>" [--verdict intentional|unintended|other] | --from <pending.json>)
  pipelinehalt extract --from <paper.tex|paper.pdf> [--out anchor.json]
  pipelinehalt audit   --tex <paper.tex> (--project <lake dir> [--root <Module>] [--prefix <Name>] | --facts <lean-output.txt>)
                       [--build-log <lake build log>] [--map <audit-map.json>] [--report-md f] [--report-json f] [--save-facts f]
                       full coverage: every sentence, display, table row, caption and environment is classified
  pipelinehalt agent   < request.json > response.json      (JSON protocol, see README)
  pipelinehalt prompt                                       (print the chat protocol template)

check options:
  --interactive         ask open questions on the terminal and record answers in the anchor
  --pending <file>      where to write open questions (default .pipelinehalt/pending.json)
  --report-md <file>    write Markdown report      --report-json <file>  write JSON report
  --ci                  print GitHub annotations and a one-line summary; never prompt
  --max-drift <x>       drift threshold for exit 1 once all questions are answered (default 0.25)
  --min-score <x>       heuristic match threshold (default 0.2)
  --map <file>          claim→Lean mapping file (default: pipelinehalt.map.json beside the anchor or up to the repo root)
  --no-map              ignore any mapping file (pure heuristic pairing)

Exit codes: 0 aligned · 1 drift above threshold (all answered) · 2 halted with open questions · 3 usage error.
PipelineHalt surfaces differences and forces clarification. It does not recover unwritten intent and never edits claims or Lean code.`;

export interface Io {
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
}

export function parseArgs(argv: string[]): {
  cmd: string;
  flags: Record<string, string[]>;
} {
  const [cmd = "help", ...rest] = argv;
  const flags: Record<string, string[]> = {};
  let key = "_";
  for (const a of rest) {
    if (a.startsWith("--")) {
      key = a.slice(2);
      flags[key] ??= [];
    } else (flags[key] ??= []).push(a);
  }
  return { cmd, flags };
}

const one = (f: Record<string, string[]>, k: string) => f[k]?.[0];

export function templatePath(): string {
  return join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "templates",
    "chat-protocol.md",
  );
}

async function readAll(s: Readable): Promise<string> {
  let out = "";
  for await (const ch of s) out += String(ch);
  return out;
}

export async function run(argv: string[], io: Io): Promise<number> {
  const { cmd, flags } = parseArgs(argv);
  const say = (s: string) => io.stdout.write(s.endsWith("\n") ? s : s + "\n");
  try {
    if (cmd === "help" || cmd === "--help" || cmd === "-h")
      return (say(HELP), 0);
    if (cmd === "prompt") return (say(readFileSync(templatePath(), "utf8")), 0);
    if (cmd === "agent") {
      const req = JSON.parse(await readAll(io.stdin)) as AgentRequest;
      const res = handle(req);
      say(JSON.stringify(res, null, 2));
      return res.exitCode;
    }
    if (cmd === "extract") {
      const from = one(flags, "from");
      if (!from) throw new Usage("extract needs --from");
      const a = from.endsWith(".pdf")
        ? extractPdf(from)
        : extractLatex(readFileSync(from, "utf8"), from);
      const out = JSON.stringify(a, null, 2) + "\n";
      const o = one(flags, "out");
      if (o) {
        writeFileSync(o, out);
        say(`wrote ${a.claims.length} claims to ${o}`);
      } else say(out);
      return 0;
    }
    if (cmd === "audit") {
      const texPath = one(flags, "tex");
      if (!texPath) throw new Usage("audit needs --tex");
      const tex = readFileSync(texPath, "utf8");
      let out: string;
      const factsPath = one(flags, "facts");
      if (factsPath) out = readFileSync(factsPath, "utf8");
      else {
        const project = one(flags, "project");
        if (!project) throw new Usage("audit needs --project or --facts");
        const root = one(flags, "root") ?? "NS_Millennium_Proof";
        const refs = [...new Set(extractUnits(tex).units.flatMap((u) => u.refs))];
        if (one(flags, "prefix") === undefined && root.includes(",")) flags.prefix = [root];
        out = runLean(project, root, one(flags, "prefix") ?? root, refs, one(flags, "lake") ?? "lake");
        const sf = one(flags, "save-facts");
        if (sf) writeFileSync(sf, out);
      }
      const bl = one(flags, "build-log");
      const facts = parseLeanFacts(out, bl ? readFileSync(bl, "utf8") : undefined);
      const mp = one(flags, "map");
      const map: AuditMap = mp ? JSON.parse(readFileSync(mp, "utf8")) : {};
      const r = audit(tex, facts, map, texPath);
      const md = one(flags, "report-md");
      if (md) writeFileSync(md, auditMarkdown(r));
      const js = one(flags, "report-json");
      if (js) writeFileSync(js, JSON.stringify(r, null, 2) + "\n");
      say(`audit ${r.verdict}: ${r.total} units, ${r.classified} classified (${(r.coverage * 100).toFixed(1)}%) — ` + Object.entries(r.counts).map(([k, v]) => `${k} ${v}`).join(", "));
      say(`real build: ${r.real.theorems} theorems, ${r.real.modules} modules, ${r.real.jobs ?? "?"} jobs`);
      return r.verdict === "PASS" ? 0 : r.verdict === "HALT" ? 2 : 1;
    }
    const anchorPath = one(flags, "anchor");
    if (!anchorPath) throw new Usage(`${cmd} needs --anchor`);
    const mapped = () => {
      const r = resolveMap(
        loadAnchor(anchorPath),
        anchorPath,
        "no-map" in flags ? false : one(flags, "map"),
      );
      for (const w of r.warnings) io.stderr.write(`pipelinehalt: ${w}\n`);
      return r;
    };
    if (cmd === "answer") {
      const { anchor } = mapped();
      const lean = flags.lean ?? [];
      const report = compare(anchor, lean.length ? loadLean(lean) : []);
      const known = new Map(
        report.claims.flatMap((c) => c.mismatches).map((m) => [m.id, m]),
      );
      const items: { id: string; answer: string; verdict?: Verdict }[] = [];
      const from = one(flags, "from");
      if (from)
        items.push(
          ...(
            JSON.parse(readFileSync(from, "utf8")) as PendingFile
          ).questions.filter((q) => q.answer.trim()),
        );
      else if (one(flags, "id"))
        items.push({
          id: one(flags, "id")!,
          answer: (flags.text ?? []).join(" "),
          verdict: one(flags, "verdict") as Verdict | undefined,
        });
      else throw new Usage("answer needs --id/--text or --from");
      let n = 0;
      for (const it of items) {
        if (!it.answer.trim()) continue;
        const m = known.get(it.id);
        if (!m) {
          io.stderr.write(
            `skipped unknown or stale question id ${it.id}${lean.length ? "" : " (pass --lean so ids can be validated)"}\n`,
          );
          continue;
        }
        record(anchor, m, it.answer, it.verdict);
        n++;
      }
      const to = saveClarifications(anchorPath, anchor.clarifications);
      say(`recorded ${n} answer(s) in ${to}`);
      return 0;
    }
    if (cmd !== "check") throw new Usage(`unknown command ${cmd}`);
    const lean = flags.lean ?? [];
    if (!lean.length) throw new Usage("check needs --lean <path>");
    const opts = {
      maxDrift: one(flags, "max-drift")
        ? Number(one(flags, "max-drift"))
        : undefined,
      minScore: one(flags, "min-score")
        ? Number(one(flags, "min-score"))
        : undefined,
    };
    const { anchor, mapFile, warnings } = mapped();
    const decls = loadLean(lean);
    const withMap = (r: ReturnType<typeof compare>) => ({
      ...r,
      mapFile,
      mapWarnings: warnings.length ? warnings : undefined,
    });
    let report = withMap(compare(anchor, decls, opts));
    if ("interactive" in flags && report.pending.length) {
      const n = await askInteractive(
        anchor,
        report.pending,
        io.stdin,
        io.stdout,
      );
      if (n)
        say(
          `recorded ${n} answer(s) in ${saveClarifications(anchorPath, anchor.clarifications)}`,
        );
      report = withMap(compare(anchor, decls, opts));
    }
    if (one(flags, "report-md"))
      writeFileSync(one(flags, "report-md")!, toMarkdown(report));
    if (one(flags, "report-json"))
      writeFileSync(one(flags, "report-json")!, toJson(report));
    const pendingPath = one(flags, "pending") ?? ".pipelinehalt/pending.json";
    if (report.pending.length) {
      mkdirSync(dirname(pendingPath), { recursive: true });
      writeFileSync(
        pendingPath,
        JSON.stringify(pendingFile(anchorPath, report.pending), null, 2) + "\n",
      );
    }
    if ("ci" in flags) {
      const ann = toAnnotations(report);
      if (ann) say(ann);
      say(
        `pipelinehalt: ${report.status} drift=${report.drift} open=${report.pending.length} claims=${report.claims.length}`,
      );
    } else {
      say(toMarkdown(report));
      if (report.pending.length)
        say(
          `HALT: ${report.pending.length} open question(s) written to ${pendingPath}. Answer them (pipelinehalt answer ...) before continuing; nothing was auto-corrected.`,
        );
    }
    return exitCodeFor(report.status);
  } catch (e) {
    io.stderr.write(
      `pipelinehalt: ${(e as Error).message}\n${e instanceof Usage ? "\n" + HELP + "\n" : ""}`,
    );
    return 3;
  }
}

class Usage extends Error {}
