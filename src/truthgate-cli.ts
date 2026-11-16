import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { loadAnchor } from "./anchor.js";
import {
  BADGE_PASS,
  DEFAULT_NAMES,
  LOCK_FILE,
  OBSERVATION_FILE,
  approveLock,
  evaluateTruthGate,
  lockDigest,
  observationScript,
  paperCites,
  parseObservation,
  parseTgFacts,
  proposeLock,
  readLock,
  runLeanFile,
  runTruthGateLean,
  scriptOptionsFor,
  semanticsLockLean,
  truthGateAnnotations,
  truthGateExit,
  truthGateMarkdown,
  truthGateScript,
  type Observation,
  type TgScriptOptions,
} from "./truthgate.js";

export const TRUTH_GATE_HELP = `pipelinehalt truth-gate — bind the formal certificate to a locked, author-approved paper_claim.

  observe  --project <dir> [--lock f] [--goal-decl <thm> | --goal "<Lean Prop>"] [--out ${OBSERVATION_FILE}]
           MANDATORY FIRST STEP on every obligation: #check intended_correspondence, #print paper_claim,
           and (with --goal/--goal-decl) a defeq test of the goal against paper_claim. Changes nothing.
           Writes a receipt. Exit 2 if the goal does not match paper_claim (halt: do not edit).
  lock     --project <dir> --root <Module[,Module]> [--prefix <Name[,Name]>] [--semantics Semantics.lean]
           [--paper-claim ${DEFAULT_NAMES.paper}] [--formal ${DEFAULT_NAMES.formal}] [--correspondence ${DEFAULT_NAMES.correspondence}]
           --headline <thm>... [--auxiliary <thm>=<reason>]... [--auxiliary-cited "<reason>"]
           [--paper <paper.tex> --claim <id>...] [--out ${LOCK_FILE}] [--facts f] [--save-facts f]
           proposes an UNAPPROVED lock (approval: null). Every gate fails until it is approved.
  approve  --lock <file> --by "<name>" [--at <ISO time>] [--note "<text>"]
           records the author's approval of the transcription and lock contents (digest-bound).
  emit-lean --lock <file> [--out scripts/SemanticsLock.lean]
           writes the in-build #eval audit (fails lake build if the lock is not respected).
  check    --project <dir> [--lock f] [--facts f | --save-facts f] [--require-observation [receipt]]
           [--report-md f] [--report-json f] [--badge f] [--ci]
  script   --lock <file>         print the Lean meta script used by check

Exit codes: 0 pass · 1 fail · 2 halt (paper-side question or observation mismatch) · 3 usage error.
On pass the badge says "${BADGE_PASS}". It never says more than that.`;

const one = (f: Record<string, string[]>, k: string) => f[k]?.[0];
const many = (f: Record<string, string[]>, k: string) => (f[k] ?? []).flatMap((x) => x.split(",")).filter(Boolean);

function git(project: string): string {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: project, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "(no git)";
  }
}
const toolchain = (project: string) =>
  existsSync(join(project, "lean-toolchain")) ? readFileSync(join(project, "lean-toolchain"), "utf8").trim() : "(no lean-toolchain)";
const write = (p: string, s: string) => (mkdirSync(dirname(p), { recursive: true }), writeFileSync(p, s));

export async function runTruthGate(flags: Record<string, string[]>, say: (s: string) => void): Promise<number> {
  const sub = flags._?.[0] ?? "help";
  if (sub === "help") return (say(TRUTH_GATE_HELP), 0);
  const project = resolve(one(flags, "project") ?? ".");
  const lake = one(flags, "lake") ?? "lake";
  const lockPath = one(flags, "lock") ?? join(project, LOCK_FILE);
  const facts = (o: TgScriptOptions) => {
    const fp = one(flags, "facts");
    const out = fp ? readFileSync(fp, "utf8") : runTruthGateLean(project, o, lake);
    const sf = one(flags, "save-facts");
    if (sf) write(sf, out);
    return parseTgFacts(out);
  };
  if (sub === "lock") {
    const roots = many(flags, "root");
    if (!roots.length) throw new Error("truth-gate lock needs --root");
    const headlines = many(flags, "headline");
    if (!headlines.length) throw new Error("truth-gate lock needs at least one --headline");
    const semantics = one(flags, "semantics") ?? "Semantics.lean";
    const semPath = join(project, semantics);
    if (!existsSync(semPath)) throw new Error(`${semPath} not found`);
    const paperSrc = one(flags, "paper");
    const tex = paperSrc && paperSrc.endsWith(".tex") ? readFileSync(join(project, paperSrc), "utf8") : undefined;
    const cites = tex ? paperCites(tex) : { strict: [], maybe: [] };
    const o: TgScriptOptions = {
      roots,
      prefixes: many(flags, "prefix"),
      paperClaim: one(flags, "paper-claim") ?? DEFAULT_NAMES.paper,
      correspondence: one(flags, "correspondence") ?? DEFAULT_NAMES.correspondence,
      formal: one(flags, "formal") ?? DEFAULT_NAMES.formal,
      heads: [...new Set([...headlines, ...cites.strict])],
      maybe: cites.maybe,
    };
    const aux: Record<string, string> = {};
    for (const a of flags.auxiliary ?? []) {
      const i = a.indexOf("=");
      if (i < 1) throw new Error(`--auxiliary needs <thm>=<reason>, got ${a}`);
      aux[a.slice(0, i)] = a.slice(i + 1);
    }
    const lock = proposeLock(facts(o), {
      semantics,
      semanticsSource: readFileSync(semPath, "utf8"),
      roots,
      prefixes: o.prefixes,
      headlines,
      auxiliary: aux,
      auxiliaryCited: one(flags, "auxiliary-cited"),
      paperSource: paperSrc ? { source: paperSrc, claims: flags.claim ?? [] } : undefined,
      commit: git(project),
      toolchain: toolchain(project),
    });
    const out = one(flags, "out") ?? join(project, LOCK_FILE);
    write(out, JSON.stringify(lock, null, 2) + "\n");
    say(`wrote UNAPPROVED lock ${out} (digest ${lockDigest(lock)}). The author reviews ${semantics} and the lock, then runs: pipelinehalt truth-gate approve --lock ${out} --by "<name>"`);
    return 0;
  }
  if (sub === "approve") {
    const by = one(flags, "by");
    if (!by) throw new Error("truth-gate approve needs --by");
    const lock = approveLock(readLock(lockPath), by, one(flags, "at"), one(flags, "note"));
    write(lockPath, JSON.stringify(lock, null, 2) + "\n");
    say(`approval recorded in ${lockPath}: ${by} at ${lock.approval!.approvedAt}, digest ${lock.approval!.digest}`);
    return 0;
  }
  const lock = readLock(lockPath);
  if (sub === "emit-lean") {
    const out = one(flags, "out") ?? join(project, "scripts", "SemanticsLock.lean");
    write(out, semanticsLockLean(lock));
    say(`wrote ${out}`);
    return 0;
  }
  if (sub === "observe") {
    const goalDecl = one(flags, "goal-decl");
    const goalTerm = one(flags, "goal");
    const out = runLeanFile(project, "Observe.lean", observationScript({ lock, goalDecl, goalTerm }), lake);
    const ob = parseObservation(out, lock, git(project), goalDecl ?? goalTerm);
    write(one(flags, "out") ?? join(project, OBSERVATION_FILE), JSON.stringify(ob, null, 2) + "\n");
    say(ob.output);
    if (ob.goal)
      say(ob.verdict === "goal-matches-paper-claim"
        ? `observation: goal is definitionally ${lock.paperClaim.name}. Edits may proceed; they must keep transporting across ${lock.correspondence.name}.`
        : `HALT: goal ${ob.goal.pretty ?? ob.goal.source} is not definitionally ${lock.paperClaim.name}. Do not apply tactics, rewrites or text edits; report the mismatch (narrower / conditional / silent / different).`);
    else say(`observation recorded for lock ${ob.lockDigest.slice(0, 16)} at ${ob.commit}.`);
    return ob.verdict === "goal-does-not-match" ? 2 : 0;
  }
  const paperPath = lock.paperSource ? join(project, lock.paperSource.source) : undefined;
  const tex = paperPath && paperPath.endsWith(".tex") && existsSync(paperPath) ? readFileSync(paperPath, "utf8") : undefined;
  const o = scriptOptionsFor(lock, tex);
  if (sub === "script") return (say(truthGateScript(o)), 0);
  if (sub !== "check") throw new Error(`unknown truth-gate subcommand ${sub}`);
  const semPath = join(project, lock.semantics);
  const reqObs = "require-observation" in flags;
  const obsPath = one(flags, "require-observation") ?? join(project, OBSERVATION_FILE);
  const observation: Observation | null = reqObs && existsSync(obsPath) ? JSON.parse(readFileSync(obsPath, "utf8")) : null;
  let tgFacts;
  try {
    tgFacts = facts(o);
  } catch (e) {
    say(`truth-gate: Lean elaboration failed, so nothing is certified: ${(e as Error).message.split("\n").slice(0, 6).join(" | ")}`);
    tgFacts = parseTgFacts("");
  }
  const report = evaluateTruthGate(lock, {
    semanticsSource: existsSync(semPath) ? readFileSync(semPath, "utf8") : undefined,
    facts: tgFacts,
    toolchain: toolchain(project),
    commit: git(project),
    paper: paperPath && existsSync(paperPath) ? { anchor: loadAnchor(paperPath), tex } : undefined,
    readFile: (rel) => (existsSync(join(project, rel)) ? readFileSync(join(project, rel), "utf8") : undefined),
    requireObservation: reqObs,
    observation,
  });
  const md = truthGateMarkdown(report);
  if (one(flags, "report-md")) write(one(flags, "report-md")!, md);
  if (one(flags, "report-json")) write(one(flags, "report-json")!, JSON.stringify(report, null, 2) + "\n");
  if (one(flags, "badge")) write(one(flags, "badge")!, JSON.stringify(report.badge, null, 2) + "\n");
  if ("ci" in flags) {
    const ann = truthGateAnnotations(report);
    if (ann) say(ann);
    say(`truth-gate: ${report.status} — ${report.badge.message}`);
  } else say(md);
  return truthGateExit(report.status);
}
