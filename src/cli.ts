import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Readable, Writable } from "node:stream";
import { extractLatex, extractPdf, loadAnchor, saveClarifications } from "./anchor.js";
import { compare, VERSION } from "./compare.js";
import { askInteractive, pendingFile, record, type PendingFile } from "./halt.js";
import { loadLean } from "./lean.js";
import { exitCodeFor, handle, type AgentRequest } from "./protocol.js";
import { toAnnotations, toJson, toMarkdown } from "./report.js";
import type { Verdict } from "./types.js";

export const HELP = `pipelinehalt ${VERSION} — compare paper claims (anchor) with Lean statements; halt and ask on mismatch.

Usage:
  pipelinehalt check   --anchor <claims.json|.md|.tex|.pdf> --lean <path>... [options]
  pipelinehalt answer  --anchor <file> (--id <id> --text "<answer>" [--verdict intentional|unintended|other] | --from <pending.json>)
  pipelinehalt extract --from <paper.tex|paper.pdf> [--out anchor.json]
  pipelinehalt agent   < request.json > response.json      (JSON protocol, see README)
  pipelinehalt prompt                                       (print the chat protocol template)

check options:
  --interactive         ask open questions on the terminal and record answers in the anchor
  --pending <file>      where to write open questions (default .pipelinehalt/pending.json)
  --report-md <file>    write Markdown report      --report-json <file>  write JSON report
  --ci                  print GitHub annotations and a one-line summary; never prompt
  --max-drift <x>       drift threshold for exit 1 once all questions are answered (default 0.25)
  --min-score <x>       heuristic match threshold (default 0.2)

Exit codes: 0 aligned · 1 drift above threshold (all answered) · 2 halted with open questions · 3 usage error.
PipelineHalt surfaces differences and forces clarification. It does not recover unwritten intent and never edits claims or Lean code.`;

export interface Io {
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
}

export function parseArgs(argv: string[]): { cmd: string; flags: Record<string, string[]> } {
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
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..", "templates", "chat-protocol.md");
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
    if (cmd === "help" || cmd === "--help" || cmd === "-h") return (say(HELP), 0);
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
      const a = from.endsWith(".pdf") ? extractPdf(from) : extractLatex(readFileSync(from, "utf8"), from);
      const out = JSON.stringify(a, null, 2) + "\n";
      const o = one(flags, "out");
      if (o) {
        writeFileSync(o, out);
        say(`wrote ${a.claims.length} claims to ${o}`);
      } else say(out);
      return 0;
    }
    const anchorPath = one(flags, "anchor");
    if (!anchorPath) throw new Usage(`${cmd} needs --anchor`);
    if (cmd === "answer") {
      const anchor = loadAnchor(anchorPath);
      const lean = flags.lean ?? [];
      const report = compare(anchor, lean.length ? loadLean(lean) : []);
      const known = new Map(report.claims.flatMap((c) => c.mismatches).map((m) => [m.id, m]));
      const items: { id: string; answer: string; verdict?: Verdict }[] = [];
      const from = one(flags, "from");
      if (from)
        items.push(
          ...(JSON.parse(readFileSync(from, "utf8")) as PendingFile).questions.filter((q) => q.answer.trim()),
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
      maxDrift: one(flags, "max-drift") ? Number(one(flags, "max-drift")) : undefined,
      minScore: one(flags, "min-score") ? Number(one(flags, "min-score")) : undefined,
    };
    const anchor = loadAnchor(anchorPath);
    const decls = loadLean(lean);
    let report = compare(anchor, decls, opts);
    if ("interactive" in flags && report.pending.length) {
      const n = await askInteractive(anchor, report.pending, io.stdin, io.stdout);
      if (n) say(`recorded ${n} answer(s) in ${saveClarifications(anchorPath, anchor.clarifications)}`);
      report = compare(anchor, decls, opts);
    }
    if (one(flags, "report-md")) writeFileSync(one(flags, "report-md")!, toMarkdown(report));
    if (one(flags, "report-json")) writeFileSync(one(flags, "report-json")!, toJson(report));
    const pendingPath = one(flags, "pending") ?? ".pipelinehalt/pending.json";
    if (report.pending.length) {
      mkdirSync(dirname(pendingPath), { recursive: true });
      writeFileSync(pendingPath, JSON.stringify(pendingFile(anchorPath, report.pending), null, 2) + "\n");
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
    io.stderr.write(`pipelinehalt: ${(e as Error).message}\n${e instanceof Usage ? "\n" + HELP + "\n" : ""}`);
    return 3;
  }
}

class Usage extends Error {}
