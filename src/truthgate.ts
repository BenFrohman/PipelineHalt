/**
 * Truth Gate: bind a Lean formal certificate to a fixed, author-approved Lean transcription of the
 * paper's (or official) statement.
 *
 * A repository's `Semantics.lean` holds `paper_claim : Prop` (literal transcription, approved by the author),
 * `formal_claim : Prop` (the statement in the development's own definitions) and
 * `theorem intended_correspondence : formal_claim ↔ paper_claim` (or `formal_claim → paper_claim` for a one-way
 * result). Their statements are hashed into `truth-gate.lock.json`, which the author approves. CI and the
 * default `lake build` (via a generated `#eval` audit) then reject any edit to the locked statements, any
 * non-standard axiom or `sorryAx`, any public theorem (or paper-cited theorem) that does not transport across
 * the correspondence, and any listed paper claim that says more than `paper_claim`.
 *
 * What it cannot check: that `paper_claim` matches unwritten intent. The transcription is the author's sign-off.
 * The gate only keeps the certificate on that approved proposition. It makes no claim about any open problem.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { compareClaim, mismatchId } from "./compare.js";
import { parseLean, stripComments } from "./lean.js";
import { extractUnits, leanHeads } from "./audit.js";
import type { Anchor, Claim, Clarification, LeanDecl, Mismatch } from "./types.js";

export const LOCK_SCHEMA = "pipelinehalt/truth-gate-lock/v1";
export const LOCK_FILE = "truth-gate.lock.json";
export const OBSERVATION_FILE = ".pipelinehalt/observation.json";
export const STD_AXIOMS = ["propext", "Classical.choice", "Quot.sound"];
export const BADGE_PASS = "formal certificate inhabits the locked statement";
export const BADGE_FAIL = "formal certificate not bound to the locked statement";
export const BADGE_HALT = "paper claims exceed the locked statement: answer required";
export const DEFAULT_NAMES = { paper: "paper_claim", formal: "formal_claim", correspondence: "intended_correspondence" };

/** `iff`: `formal_claim ↔ paper_claim`. `formal_implies_paper`: `formal_claim → paper_claim` (one-way). */
export type Direction = "iff" | "formal_implies_paper";

export interface TruthLock {
  schema: typeof LOCK_SCHEMA;
  /** Path of Semantics.lean, relative to the Lake project root. */
  semantics: string;
  /** Modules to import when elaborating. */
  roots: string[];
  /** Module-name prefixes that count as "the project" (defaults to roots). */
  prefixes: string[];
  /** paper_claim: SHA-256 of normalized source, SHA-256 of the elaborated type+value, and Lean's 64-bit
   *  structural hash (decimal) used by the in-build `#eval` audit. */
  paperClaim: { name: string; sourceSha256: string; exprSha256: string; hash64: string; provenance: Provenance };
  correspondence: {
    name: string;
    formal: string;
    direction: Direction;
    sourceSha256: string;
    typeSha256: string;
    hash64: string;
  };
  /** Project-local constants paper_claim unfolds to (name → SHA-256 of elaborated type+value). */
  dependencies: Record<string, string>;
  /** `#print axioms intended_correspondence` at lock time. */
  axioms: string[];
  /** Public whitelist: theorems presented as results. At least one must have type paper_claim. */
  headlines: string[];
  /** Theorems deliberately outside the gate (name → reason). Reported, never presented as certified. */
  auxiliary: Record<string, string>;
  paperSource?: {
    source: string;
    /** Claim ids (LaTeX labels or `proposition-4.1`-style ids) that state the paper's results. */
    claims: string[];
    /** Extra Lean names the paper cites that the TeX scan cannot see. */
    cites?: string[];
    /** Answers to paper-side questions. Not part of the approved digest; each records who answered. */
    clarifications?: Record<string, Clarification & { answeredBy?: string }>;
  };
  commit: string;
  toolchain: string;
  /** Author approval. Null until the author approves the transcription and lock contents. */
  approval: null | { approvedBy: string; approvedAt: string; digest: string; note?: string };
}

/** Where paper_claim comes from. Carried in paper_claim's doc comment as
 *  `@paper: <path> @sha256: <hex of the file> @section: <section/page> @quote: "<verbatim claim>"` and recorded in the lock. */
export interface Provenance { paper: string; sha256: string; section: string; quote: string }

/** Lean constants that make a proof rely on compiled code rather than the kernel (from native_decide etc.). */
export const NATIVE_AXIOMS = ["Lean.ofReduceBool", "Lean.trustCompiler", "Lean.ofReduceNat"];
/** True for native_decide's trust axioms: `Lean.ofReduceBool` / `Lean.trustCompiler` (older Lean) or the per-use
 *  auxiliary axiom `<decl>._native.native_decide.ax_…` that newer Lean (e.g. v4.34) adds instead. */
export const isNativeAxiom = (a: string) => NATIVE_AXIOMS.includes(a) || /(^|\.)_native(\.|$)|native_decide/.test(a);

const collapse = (x: string) => x.replace(/\s+/g, " ").trim();

/** Parse the provenance fields from a (whitespace-collapsed) doc comment. */
export function parseProvenance(doc?: string): Provenance | undefined {
  if (!doc) return undefined;
  const m = /@paper:\s*(\S+)\s+@sha256:\s*([0-9a-fA-F]{64})\s+@section:\s*(.+?)\s+@quote:\s*(.+)$/s.exec(collapse(doc));
  if (!m) return undefined;
  const q = m[4]!.trim().replace(/^["“«]\s*/, "").replace(/\s*["”»]$/, "");
  return { paper: m[1]!, sha256: m[2]!.toLowerCase(), section: m[3]!.trim(), quote: q };
}

// ---------------------------------------------------------------- hashing

export const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

/** Canonical JSON (sorted keys, undefined dropped) so the digest does not depend on key order. */
export function canonical(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  if (v && typeof v === "object")
    return `{${Object.keys(v as object)
      .sort()
      .filter((k) => (v as Record<string, unknown>)[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonical((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  return JSON.stringify(v);
}

/** Digest of everything the approval covers: all fields except `approval` and `paperSource.clarifications`. */
export function lockDigest(lock: TruthLock): string {
  const { approval: _a, paperSource, ...rest } = lock;
  const p = paperSource ? { ...paperSource, clarifications: undefined } : undefined;
  return sha256(canonical({ ...rest, paperSource: p }));
}

const short = (n: string) => n.split(".").pop()!;

/** Find a declaration of Semantics.lean by (full or short) name. */
export function findSourceDecl(src: string, name: string, file = "Semantics.lean"): LeanDecl | undefined {
  const ds = parseLean(src, file);
  return ds.find((d) => d.fullName === name) ?? ds.find((d) => d.name === short(name));
}

/** Normalized statement text: comments stripped, whitespace collapsed (parseLean does both).
 *  For a `def`/`abbrev` the body is the statement and is included; for a theorem only binders and type. */
export function statementText(d: LeanDecl): string {
  const bs = d.binders.map((b) => `${b.bracket}${b.names.join(" ")} : ${b.type}`).join(" ");
  const head = `${d.kind} ${short(d.name)}${bs ? " " + bs : ""} : ${d.type}`;
  return d.kind === "def" || d.kind === "abbrev" ? `${head} := ${d.body ?? ""}` : head;
}

export const sourceHash = (d: LeanDecl) => sha256(statementText(d));

// ---------------------------------------------------------------- Lean meta script (CI / lock)

export interface TgScriptOptions {
  roots: string[];
  prefixes?: string[];
  paperClaim: string;
  correspondence: string;
  formal: string;
  /** Names to classify (headlines). Missing names are reported. */
  heads: string[];
  /** Names classified only if they resolve to a project constant (e.g. \texttt{...} candidates). */
  maybe?: string[];
}

const lit = (xs: string[]) => `[${xs.map((x) => JSON.stringify(x)).join(", ")}]`;
const pre = (o: { roots: string[]; prefixes?: string[] }) =>
  (o.prefixes?.length ? o.prefixes : o.roots).map((p) => "`" + p).join(", ");

/** Shared Lean helpers (prefixed so they cannot clash with project names). */
function leanHelpers(prefixes: string, tag: string): string {
  return `def ${tag}Pre : List Name := [${prefixes}]
def ${tag}Proj (env : Environment) (n : Name) : Bool :=
  match env.getModuleIdxFor? n with
  | some idx => ${tag}Pre.any (·.isPrefixOf env.header.moduleNames[idx.toNat]!)
  | none => false
def ${tag}Mod (env : Environment) (n : Name) : String :=
  match env.getModuleIdxFor? n with
  | some idx => (env.header.moduleNames[idx.toNat]!).toString
  | none => "?"
def ${tag}Hash (ci : ConstantInfo) : UInt64 :=
  mixHash ci.type.hash (match ci.value? (allowOpaque := true) with | some v => v.hash | none => 0)
/-- Project-local constants reachable from \`roots\` through values (and types if \`withTypes\`). -/
def ${tag}Closure (env : Environment) (roots : List Name) (withTypes : Bool) : NameSet := Id.run do
  let mut seen : NameSet := {}
  let mut todo := roots
  for _ in [0:4000000] do
    match todo with
    | [] => break
    | n :: rest =>
      todo := rest
      if seen.contains n then continue
      seen := seen.insert n
      if let some ci := env.find? n then
        let vs := match ci.value? (allowOpaque := true) with | some v => v.getUsedConstants | none => #[]
        let ts := if withTypes then ci.type.getUsedConstants else #[]
        for c in vs ++ ts do
          if ${tag}Proj env c && !seen.contains c then todo := c :: todo
  return seen`;
}

/** Lean recognizer for a vacuous correspondence proof: `Iff.rfl`, `Iff.refl _`, `rfl`, `Eq.refl _`, `id`,
 *  `Iff.of_eq rfl`, `fun h => h`, or `Iff.intro` of two such identities. Returns the reason, or none. */
function leanTrivial(tag: string): string {
  const b = "\`\`";
  return `/-- \`fun h => h\`, \`fun h => id h\`, or \`@id α\` (not \`id x\`, which is a type ascription). -/
def ${tag}IsId (e : Expr) : Bool :=
  match e.consumeMData with
  | .lam _ _ body _ =>
    let body := body.consumeMData
    body == .bvar 0 ||
      (body.getAppFn.consumeMData.isConstOf ${b}id && body.getAppNumArgs == 2 && (body.getArg! 1).consumeMData == .bvar 0)
  | e => e.getAppFn.consumeMData.isConstOf ${b}id && e.getAppNumArgs ≤ 1
partial def ${tag}Trivial (v : Expr) : Option String :=
  let v := v.consumeMData
  let f := v.getAppFn.consumeMData
  if f.isConstOf ${b}id && v.getAppNumArgs == 2 then ${tag}Trivial (v.getArg! 1)
  else if [${b}Iff.rfl, ${b}Iff.refl, ${b}rfl, ${b}Eq.refl, ${b}HEq.refl].any f.isConstOf then some s!"proof term is {f}"
  else if f.isConstOf ${b}Iff.of_eq && v.getAppNumArgs ≥ 3 &&
      [${b}rfl, ${b}Eq.refl].any (v.getArg! 2).getAppFn.consumeMData.isConstOf then some "proof term is Iff.of_eq rfl"
  else if f.isConstOf ${b}Iff.intro && v.getAppNumArgs == 4 && ${tag}IsId (v.getArg! 2) && ${tag}IsId (v.getArg! 3) then
    some "proof term is Iff.intro of two identity functions"
  else if ${tag}IsId v then some "proof term is an identity function"
  else none`;
}

/** Lean 4 meta script (run with `lake env lean`). Prints TG_* lines parsed by `parseTgFacts`. */
export function truthGateScript(o: TgScriptOptions): string {
  return `import Lean
${o.roots.map((r) => "import " + r).join("\n")}
open Lean Meta Elab Command

${leanHelpers(pre(o), "tg")}
def tgClean (s : String) : String := (s.replace "\\n" " ").replace "\\t" " "
def tgKind : ConstantInfo → String
  | .thmInfo _ => "theorem" | .defnInfo _ => "def" | .axiomInfo _ => "axiom"
  | .opaqueInfo _ => "opaque" | .inductInfo _ => "inductive" | .ctorInfo _ => "ctor"
  | _ => "other"
${leanTrivial("tg")}
def tgVal (ci : ConstantInfo) : String :=
  match ci.value? (allowOpaque := true) with | some v => tgClean (toString v) | none => ""
/-- Project-local, non-internal constant names (computed once). -/
def tgProjNames (env : Environment) : Array Name := Id.run do
  let mut out := #[]
  for (n, _) in env.constants.map₁.toList do
    if !n.isInternal && tgProj env n then out := out.push n
  for (n, _) in env.constants.map₂.toList do
    if !n.isInternal && tgProj env n then out := out.push n
  return out
def tgResolve (env : Environment) (proj : Array Name) (r : String) : Array Name :=
  if env.contains r.toName && tgProj env r.toName then #[r.toName]
  else proj.filter fun n => n.toString == r || n.toString.endsWith ("." ++ r)

#eval show CommandElabM Unit from liftTermElabM do
  let env ← getEnv
  let proj := tgProjNames env
  let roles : List (String × String) := [("paper", ${JSON.stringify(o.paperClaim)}), ("correspondence", ${JSON.stringify(o.correspondence)}), ("formal", ${JSON.stringify(o.formal)})]
  let mut found : Std.HashMap String Name := {}
  for (role, r) in roles do
    let hits := tgResolve env proj r
    if hits.size != 1 then
      IO.println s!"TG_RESOLVE\\t{role}\\t{r}\\t!{hits.size}"
      continue
    let n := hits[0]!
    found := found.insert role n
    let ci := (env.find? n).get!
    IO.println s!"TG_RESOLVE\\t{role}\\t{r}\\t{n}"
    let v := if role == "correspondence" then "" else tgVal ci
    let h := if role == "correspondence" then ci.type.hash else tgHash ci
    IO.println s!"TG_DECL\\t{role}\\t{n}\\t{tgKind ci}\\t{tgMod env n}\\t{ci.levelParams.length}\\t{h}\\t{tgClean (toString ci.type)}\\t{v}"
  let some P := found.get? "paper" | IO.println "TG_END"
  let some C := found.get? "correspondence" | IO.println "TG_END"
  let F? := found.get? "formal"
  let cty := ((env.find? C).get!).type.consumeMData
  let isF (e : Expr) : Bool := match F? with | some F => e.consumeMData.isConstOf F | none => false
  let shape := match cty.iff? with
    | some (a, b) => s!"iff\\t{b.consumeMData.isConstOf P}\\t{isF a}"
    | none =>
      if cty.isArrow then
        s!"formal_implies_paper\\t{cty.bindingBody!.consumeMData.isConstOf P}\\t{isF cty.bindingDomain!}"
      else "other\\tfalse\\tfalse"
  IO.println s!"TG_SHAPE\\t{shape}"
  let pClosure := tgClosure env [P] true
  let fClosure : NameSet := match F? with | some F => tgClosure env [F] true | none => {}
  let shared := pClosure.toList.filter fun n => n != P && fClosure.contains n
  let pRefsF := match F? with | some F => pClosure.contains F | none => false
  let fRefsP := fClosure.contains P
  let aliasDefeq ← match F? with
    | some F => withoutModifyingState <| try isDefEq (mkConst P) (mkConst F) catch _ => pure false
    | none => pure false
  IO.println s!"TG_ALIAS\\t{pRefsF}\\t{fRefsP}\\t{aliasDefeq}\\t{",".intercalate (shared.map toString)}"
  IO.println s!"TG_TRIVIAL\\t{(tgTrivial ((env.find? C).get!.value? (allowOpaque := true) |>.getD (mkConst \`\`True))).getD ""}"
  for d in pClosure.toList do
    if d == P then continue
    let ci := (env.find? d).get!
    IO.println s!"TG_DEP\\t{d}\\t{tgKind ci}\\t{tgClean (toString ci.type)}\\t{tgVal ci}"
  let axs ← collectAxioms C
  IO.println s!"TG_AXIOMS\\t{C}\\t{",".intercalate (axs.toList.map toString)}"
  let heads : List (String × Bool) := (${lit(o.heads)} : List String).map (·, true) ++ (${lit(o.maybe ?? [])} : List String).map (·, false)
  for (r, must) in heads do
    let hits := tgResolve env proj r
    if hits.isEmpty then
      if must then IO.println s!"TG_HEAD\\t{r}\\t?\\tmissing"
      continue
    for h in hits do
      let ci := (env.find? h).get!
      let syn := ci.type.consumeMData.isConstOf P
      let de ← withoutModifyingState <| try isDefEq ci.type (mkConst P) catch _ => pure false
      let direct := match ci.value? (allowOpaque := true) with | some v => v.getUsedConstants.contains C | none => false
      let trans := (tgClosure env [h] false).contains C
      let axs ← collectAxioms h
      IO.println s!"TG_HEAD\\t{r}\\t{h}\\t{tgKind ci}\\t{syn}\\t{de}\\t{direct}\\t{trans}\\t{",".intercalate (axs.toList.map toString)}\\t{if must then "head" else "cite"}"
  IO.println "TG_END"
`;
}

export interface TgDecl { full: string; kind: string; module: string; levels: number; hash64: string; type: string; value: string }
export interface TgHead {
  query: string;
  full?: string;
  kind?: string;
  syntactic: boolean;
  defeq: boolean;
  direct: boolean;
  transitive: boolean;
  axioms: string[];
  origin: "head" | "cite";
  missing?: boolean;
}
export interface TgFacts {
  resolve: Record<string, { query: string; full?: string; count?: number }>;
  decls: Record<string, TgDecl>;
  shape?: { form: Direction | "other"; paperSide: boolean; formalSide: boolean };
  deps: { name: string; kind: string; sha256: string }[];
  axioms: Record<string, string[]>;
  heads: TgHead[];
  /** paper_claim's closure contains formal_claim; formal_claim's contains paper_claim; they are defeq;
   *  project-local constants in both closures. */
  alias?: { paperRefsFormal: boolean; formalRefsPaper: boolean; defeq: boolean; shared: string[] };
  /** Non-empty when intended_correspondence's proof term is vacuous (Iff.rfl, rfl, id, …). */
  trivial?: string;
  complete: boolean;
}

export function parseTgFacts(out: string): TgFacts {
  const f: TgFacts = { resolve: {}, decls: {}, deps: [], axioms: {}, heads: [], complete: false };
  const b = (s?: string) => s === "true";
  for (const line of out.split("\n")) {
    const p = line.split("\t");
    switch (p[0]) {
      case "TG_RESOLVE":
        f.resolve[p[1]!] = p[3]!.startsWith("!") ? { query: p[2]!, count: Number(p[3]!.slice(1)) } : { query: p[2]!, full: p[3]! };
        break;
      case "TG_DECL":
        f.decls[p[1]!] = { full: p[2]!, kind: p[3]!, module: p[4]!, levels: Number(p[5]), hash64: p[6]!, type: p[7] ?? "", value: p[8] ?? "" };
        break;
      case "TG_SHAPE":
        f.shape = { form: p[1] as Direction | "other", paperSide: b(p[2]), formalSide: b(p[3]) };
        break;
      case "TG_DEP":
        f.deps.push({ name: p[1]!, kind: p[2]!, sha256: sha256(`${p[3] ?? ""}\u0000${p[4] ?? ""}`) });
        break;
      case "TG_AXIOMS":
        f.axioms[p[1]!] = p[2] ? p[2].split(",") : [];
        break;
      case "TG_HEAD":
        if (p[2] === "?") f.heads.push({ query: p[1]!, syntactic: false, defeq: false, direct: false, transitive: false, axioms: [], origin: "head", missing: true });
        else
          f.heads.push({
            query: p[1]!, full: p[2]!, kind: p[3]!, syntactic: b(p[4]), defeq: b(p[5]), direct: b(p[6]), transitive: b(p[7]),
            axioms: p[8] ? p[8].split(",") : [], origin: p[9] === "cite" ? "cite" : "head",
          });
        break;
      case "TG_ALIAS":
        f.alias = { paperRefsFormal: b(p[1]), formalRefsPaper: b(p[2]), defeq: b(p[3]), shared: p[4] ? p[4].split(",") : [] };
        break;
      case "TG_TRIVIAL":
        f.trivial = p[1] ?? "";
        break;
      case "TG_END":
        f.complete = true;
        break;
    }
  }
  return f;
}

export const exprHash = (d?: TgDecl) => (d ? sha256(`${d.type}\u0000${d.value}`) : "");

export function runLeanFile(project: string, name: string, text: string, lake = "lake"): string {
  const dir = mkdtempSync(join(tmpdir(), "truthgate-"));
  const file = join(dir, name);
  writeFileSync(file, text);
  try {
    return execFileSync(lake, ["env", "lean", file], { cwd: project, encoding: "utf8", maxBuffer: 1 << 28 });
  } catch (e: any) {
    const out = String(e?.stdout ?? "") + String(e?.stderr ?? "");
    const errs = out.split("\n").filter((l) => /error/.test(l)).slice(0, 20).join("\n");
    throw new Error(`truth-gate Lean script failed (${file}):\n${errs || out.slice(-2000)}`);
  }
}

export const runTruthGateLean = (project: string, o: TgScriptOptions, lake = "lake") =>
  runLeanFile(project, "TruthGate.lean", truthGateScript(o), lake);

// ---------------------------------------------------------------- in-build enforcement (scripts/SemanticsLock.lean)

/** Lean source of the in-build lock audit, generated from an approved lock. Put it in the default `lake build`
 *  target (e.g. `lean_lib SemanticsLock where srcDir := "scripts"` marked `@[default_target]`) and also run it
 *  in CI with `lake env lean scripts/SemanticsLock.lean`. The build fails (`throwError`) unless Semantics is
 *  imported, the locked statements are unchanged (Lean structural hash), the correspondence has the locked
 *  form and standard axioms, and every whitelisted theorem has type defeq to paper_claim or is obtained
 *  through intended_correspondence, with standard axioms only. */
export function semanticsLockLean(lock: TruthLock): string {
  if (!lock.approval) throw new Error("refusing to emit SemanticsLock.lean from an unapproved lock");
  const dir = lock.correspondence.direction;
  return `/-
Copyright (c) 2026 Benjamin Stanley Frohman. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Benjamin Stanley Frohman
-/

import Lean
${lock.roots.map((r) => "import " + r).join("\n")}

/-!
# Semantics lock (generated)

Generated by \`pipelinehalt truth-gate emit-lean\` from \`truth-gate.lock.json\`
(digest \`${lockDigest(lock)}\`, approved by ${lock.approval.approvedBy} at ${lock.approval.approvedAt}).
Do not edit by hand: regenerate from an approved lock.

This file fails \`lake build\` unless:
* \`${lock.paperClaim.name}\` is an independent transcription: its dependency closure contains neither
  \`${lock.correspondence.formal}\` nor any constant of its closure, and the two are not definitionally equal;
* \`${lock.correspondence.name}\` is not proved by \`rfl\` / \`Iff.rfl\` / \`id\`;
* \`${lock.paperClaim.name}\` and \`${lock.correspondence.name}\` exist, live in a \`Semantics\` module, and are unchanged
  (Lean structural hash ${lock.paperClaim.hash64} / ${lock.correspondence.hash64});
* \`${lock.correspondence.name}\` has type \`${dir === "iff" ? `${lock.correspondence.formal} ↔ ${lock.paperClaim.name}` : `${lock.correspondence.formal} → ${lock.paperClaim.name}`}\` and uses only
  propext, Classical.choice, Quot.sound;
* every whitelisted theorem has type defeq to \`${lock.paperClaim.name}\` (or is proved through
  \`${lock.correspondence.name}\`) and uses only those axioms.

It checks that the certificate inhabits the locked statement. It does not check that the locked statement
matches the author's intent; that is the author's approval.
-/

open Lean Meta Elab Command

namespace SemanticsLock

${leanHelpers(pre(lock), "sl")}

${leanTrivial("sl")}

def slWhitelist : List Name := [${lock.headlines.map((h) => "`" + h).join(", ")}]

#eval show CommandElabM Unit from liftTermElabM do
  let env ← getEnv
  let std := [\`\`propext, \`\`Classical.choice, \`\`Quot.sound]
  let P := \`${lock.paperClaim.name}
  let C := \`${lock.correspondence.name}
  let F := \`${lock.correspondence.formal}
  let some pci := env.find? P | throwError "truth gate: {P} not found (Semantics is not imported)"
  let some cci := env.find? C | throwError "truth gate: {C} not found (Semantics is not imported)"
  unless (env.find? F).isSome do throwError "truth gate: {F} not found"
  unless (slMod env P).endsWith "Semantics" && (slMod env C).endsWith "Semantics" do
    throwError "truth gate: {P} / {C} must live in a Semantics module, found {slMod env P} / {slMod env C}"
  unless (slHash pci).toNat == ${lock.paperClaim.hash64} do
    throwError "truth gate: {P} changed since the approved lock (hash {slHash pci}); a new author-approved lock is required"
  unless cci.type.hash.toNat == ${lock.correspondence.hash64} do
    throwError "truth gate: the statement of {C} changed since the approved lock; a new author-approved lock is required"
  let cty := cci.type.consumeMData
  let okShape := ${dir === "iff"
    ? `match cty.iff? with | some (a, b) => a.consumeMData.isConstOf F && b.consumeMData.isConstOf P | none => false`
    : `cty.isArrow && cty.bindingDomain!.consumeMData.isConstOf F && cty.bindingBody!.consumeMData.isConstOf P`}
  unless okShape do throwError "truth gate: {C} does not have the locked form"
  if let some r := slTrivial (cci.value? (allowOpaque := true) |>.getD (mkConst \`\`True)) then
    throwError "truth gate: {C} is vacuous: {r}"
  let pCl := slClosure env [P] true
  let fCl := slClosure env [F] true
  if pCl.contains F then throwError "truth gate: {P} references or unfolds to {F}: an alias, so {C} would be vacuous"
  if fCl.contains P then throwError "truth gate: {F} references {P}: an alias, so {C} would be vacuous"
  for n in pCl.toList do
    if n != P && fCl.contains n then
      throwError "truth gate: {P} uses {n}, a constant of {F}'s closure; paper_claim must be an independent transcription"
  if (← withoutModifyingState <| try isDefEq (mkConst P) (mkConst F) catch _ => pure false) then
    throwError "truth gate: {P} is definitionally equal to {F}; {C} would be Iff.rfl"
  for a in (← collectAxioms C) do
    unless std.contains a do throwError "truth gate: {C} depends on non-standard axiom {a}{if a == \`Lean.ofReduceBool || a == \`Lean.trustCompiler || (a.toString.splitOn "_native").length > 1 then " (native_decide / compiler trust)" else ""}"
  let mut certs := 0
  for h in slWhitelist do
    let some ci := env.find? h | throwError "truth gate: whitelisted theorem {h} not found"
    unless ci matches .thmInfo _ do throwError "truth gate: whitelisted {h} is not a theorem"
    for a in (← collectAxioms h) do
      unless std.contains a do throwError "truth gate: {h} depends on non-standard axiom {a}{if a == \`Lean.ofReduceBool || a == \`Lean.trustCompiler || (a.toString.splitOn "_native").length > 1 then " (native_decide / compiler trust)" else ""}"
    let de ← withoutModifyingState <| try isDefEq ci.type (mkConst P) catch _ => pure false
    if de then certs := certs + 1
    else unless (slClosure env [h] false).contains C do
      throwError "truth gate: {h} does not transport: its type is not {P} and its proof does not use {C}"
  if certs == 0 then throwError "truth gate: no whitelisted theorem has type {P}"
  logInfo m!"truth gate: formal certificate inhabits the locked statement {P} ({certs} certificate theorem(s))"

end SemanticsLock
`;
}

// ---------------------------------------------------------------- observation pass

export interface ObservationOptions {
  lock: TruthLock;
  /** A declaration name whose type is the obligation about to be worked on (may still contain sorry). */
  goalDecl?: string;
  /** A Lean term (a Prop) stating the goal or the claim about to be written. */
  goalTerm?: string;
}

/** Observation script: `#check intended_correspondence`, `#print paper_claim`, and a defeq test of the goal. */
export function observationScript(o: ObservationOptions): string {
  const L = o.lock;
  const goal = o.goalDecl
    ? `  let some gci := env.find? \`${o.goalDecl} | IO.println "TG_OBS_GOAL\\tmissing"
  let g := gci.type`
    : o.goalTerm
      ? `  let stx ← match Parser.runParserCategory env \`term ${JSON.stringify(o.goalTerm)} with
    | .ok s => pure s | .error e => throwError e
  let g ← Term.elabTerm stx (some (mkSort .zero))
  Term.synthesizeSyntheticMVarsNoPostponing
  let g ← instantiateMVars g`
      : "";
  return `import Lean
${L.roots.map((r) => "import " + r).join("\n")}
open Lean Meta Elab Command

#check @${L.correspondence.name}
#print ${L.paperClaim.name}
#print ${L.correspondence.formal}
#print axioms ${L.correspondence.name}
${goal ? `#eval show CommandElabM Unit from liftTermElabM do
  let env ← getEnv
${goal}
  let P := mkConst \`${L.paperClaim.name}
  let de ← withoutModifyingState <| try isDefEq g P catch _ => pure false
  IO.println s!"TG_OBS_GOAL\\t{de}\\t{(← ppExpr g).pretty.replace "\\n" " "}"` : ""}
`;
}

export interface Observation {
  tool: "pipelinehalt/truth-gate/observe";
  lockDigest: string;
  commit: string;
  observedAt: string;
  output: string;
  goal?: { source: string; matchesPaperClaim: boolean | "missing"; pretty?: string };
  verdict: "observed" | "goal-matches-paper-claim" | "goal-does-not-match";
}

export function parseObservation(out: string, lock: TruthLock, commit: string, source?: string, at = new Date().toISOString()): Observation {
  const g = out.split("\n").find((l) => l.startsWith("TG_OBS_GOAL"));
  let goal: Observation["goal"];
  if (g && source) {
    const p = g.split("\t");
    goal = p[1] === "missing" ? { source, matchesPaperClaim: "missing" } : { source, matchesPaperClaim: p[1] === "true", pretty: p[2] };
  }
  return {
    tool: "pipelinehalt/truth-gate/observe",
    lockDigest: lockDigest(lock),
    commit,
    observedAt: at,
    output: out.split("\n").filter((l) => !l.startsWith("TG_OBS_GOAL")).join("\n").trim(),
    goal,
    verdict: !goal ? "observed" : goal.matchesPaperClaim === true ? "goal-matches-paper-claim" : "goal-does-not-match",
  };
}

// ---------------------------------------------------------------- paper side

/** Lean-identifier-like names in \texttt{..} / \path{..}, plus \lean{..} and `% lean:` refs. */
export function paperCites(tex: string): { strict: string[]; maybe: string[] } {
  const strict = leanHeads([...new Set(extractUnits(tex).units.flatMap((u) => u.refs))]);
  const maybe = new Set<string>();
  for (const m of tex.matchAll(/\\(?:texttt|path)\{([^{}]*)\}/g)) {
    const n = m[1]!.replace(/\\_/g, "_").trim();
    if (/^[A-Za-z_][\w'.]*$/.test(n) && !/\.lean$/.test(n)) maybe.add(n);
  }
  return { strict, maybe: [...maybe].filter((n) => !strict.includes(n)) };
}

const OVERCLAIM =
  /\b(solv(?:e|es|ed|ing)|settl(?:e|es|ed|ing)|resolv(?:e|es|ed|ing)|resolution of|unconditional(?:ly)?|complete proof|full proof|proves? the [\w\s-]{0,40}conjecture|millennium prize)\b/i;

export type PaperFinding = Mismatch;

/** Integer literals in a Lean string (identifiers such as `h4` are skipped). */
export function numerals(s: string): string[] {
  return [...s.matchAll(/(?<![\w'.])(\d+)(?![\w'])/g)].map((m) => m[1]!);
}

/** Values a LaTeX claim asserts with `= N` (or `= -N`), outside \texttt/\path/\lean names. */
export function assertedValues(tex: string): string[] {
  const t = tex.replace(/\\(?:texttt|path|lean)\{[^{}]*\}/g, " ").replace(/\\neq?(?![a-zA-Z])/g, "≠");
  return [...new Set([...t.matchAll(/(?<![<>≤≥!])=\s*(-?\s*\d+)(?![\d.^_])/g)].map((m) => m[1]!.replace(/\s+/g, "")))];
}

/** (d) Each listed paper claim against paper_claim, with the existing narrower/conditional/silent classifier,
 *  plus asserted-value coverage and an overclaim scan of the listed claims and the title. */
export function paperCheck(
  anchor: Anchor,
  claimIds: string[],
  paperSrc: LeanDecl,
  clar: Record<string, Clarification> = {},
): { findings: PaperFinding[]; missing: string[] } {
  // paper_claim as a pseudo-theorem whose type is its body, so hypotheses inside it are seen.
  const pseudo: LeanDecl = { ...paperSrc, kind: "theorem", type: paperSrc.body ?? paperSrc.type, usesSorry: false, usesAxioms: [] };
  const findings: PaperFinding[] = [];
  const missing: string[] = [];
  const mk = (c: Claim, key: string, detail: string, question: string): PaperFinding => ({
    id: mismatchId(c.id, "narrower", pseudo.name, key),
    claimId: c.id, kind: "narrower", lean: pseudo.name, key, detail, question, weight: 0.6,
  });
  for (const id of claimIds) {
    const c = anchor.claims.find((x) => x.id === id || x.number === id);
    if (!c) {
      missing.push(id);
      continue;
    }
    const r = compareClaim({ ...c, lean: [pseudo.name] }, [pseudo]);
    for (const m of r.mismatches) if (m.kind !== "ambiguous" || m.key.startsWith("hedge")) findings.push(m);
    const have = new Set(numerals(pseudo.type));
    const absent = assertedValues(c.statement).filter((v) => !have.has(v.replace(/^-/, "")));
    if (absent.length)
      findings.push(mk(c, `omits-values:${absent.join(",")}`,
        `Claim asserts value(s) ${absent.join(", ")}; paper_claim never mentions them.`,
        `Paper claim ${c.number ?? c.id} asserts ${absent.map((v) => `= ${v}`).join(", ")}, but paper_claim contains no such numeral. Is the paper claim stronger than the locked statement, or is the value expressed another way?`));
    const o = OVERCLAIM.exec(c.statement);
    if (o)
      findings.push(mk(c, `overclaim:${o[0].toLowerCase()}`, `Claim uses “${o[0]}”.`,
        `Paper claim ${c.number ?? c.id} uses “${o[0]}”. paper_claim is the locked proposition and nothing more. Does the claim say more than paper_claim?`));
  }
  if (anchor.title) {
    const o = OVERCLAIM.exec(anchor.title);
    const c: Claim = { id: "title", statement: anchor.title };
    if (o)
      findings.push(mk(c, `overclaim:${o[0].toLowerCase()}`, `Title uses “${o[0]}”.`,
        `The paper title “${anchor.title}” uses “${o[0]}”. Does the title claim more than paper_claim?`));
  }
  for (const f of findings) if (clar[f.id]) f.clarification = clar[f.id];
  return { findings, missing };
}

// ---------------------------------------------------------------- the gate

export type CheckStatus = "pass" | "fail" | "halt";
export interface GateCheck { id: string; group: "a" | "b" | "c" | "d" | "o"; title: string; status: CheckStatus; detail: string[] }
export interface Transport {
  name: string;
  query: string;
  origin: "head" | "cite";
  verdict: "certificate" | "derived" | "auxiliary" | "does-not-transport" | "missing" | "unsound";
  note: string;
}
export interface TruthGateReport {
  tool: "pipelinehalt/truth-gate";
  status: CheckStatus;
  badge: { schemaVersion: 1; label: string; message: string; color: string };
  paperClaim?: string;
  paperClaimSource?: string;
  correspondence?: string;
  direction?: Direction;
  conditional: boolean;
  checks: GateCheck[];
  transport: Transport[];
  paper: PaperFinding[];
  lockDigest: string;
  commit: { locked: string; current?: string };
  toolchain: { locked: string; current?: string };
}

export interface GateInputs {
  /** Contents of Semantics.lean, or undefined if the file does not exist. */
  semanticsSource?: string;
  facts: TgFacts;
  toolchain?: string;
  commit?: string;
  paper?: { anchor: Anchor; tex?: string };
  /** Reads a project-relative file (for the provenance check). Returns undefined if absent. */
  readFile?: (path: string) => string | undefined;
  /** When set, an observation receipt for the current lock digest is required (mandatory first step). */
  observation?: Observation | null;
  requireObservation?: boolean;
}

export function evaluateTruthGate(lock: TruthLock, inp: GateInputs): TruthGateReport {
  const checks: GateCheck[] = [];
  const add = (group: GateCheck["group"], id: string, title: string, ok: boolean | CheckStatus, ...detail: string[]) =>
    checks.push({ id, group, title, status: ok === true ? "pass" : ok === false ? "fail" : ok, detail });
  const f = inp.facts;
  const digest = lockDigest(lock);

  // (o) observation pass first
  if (inp.requireObservation) {
    const ob = inp.observation;
    add("o", "o.observed", "observation pass (#check intended_correspondence, #print paper_claim) recorded for this lock",
      !!ob && ob.lockDigest === digest && ob.verdict !== "goal-does-not-match",
      ob ? `observed ${ob.observedAt} at ${ob.commit}; verdict ${ob.verdict}${ob.lockDigest !== digest ? "; receipt is for a different lock digest" : ""}` : `no receipt at ${OBSERVATION_FILE}; run \`pipelinehalt truth-gate observe\` first`);
  }

  // (a) lock integrity
  add("a", "a.schema", "lock schema", lock.schema === LOCK_SCHEMA, `schema ${lock.schema}`);
  add("a", "a.approval", "lock approved by the author, digest matches",
    !!lock.approval && lock.approval.digest === digest,
    lock.approval
      ? lock.approval.digest === digest
        ? `approved by ${lock.approval.approvedBy} at ${lock.approval.approvedAt}`
        : `lock fields changed after approval (approved digest ${lock.approval.digest.slice(0, 12)}, now ${digest.slice(0, 12)}); a new approval is required`
      : "lock has no approval; the transcription must be reviewed and approved before the gate can pass");
  const src = inp.semanticsSource;
  add("a", "a.semantics", `${lock.semantics} exists`, src !== undefined);
  const pSrc = src !== undefined ? findSourceDecl(src, lock.paperClaim.name, lock.semantics) : undefined;
  const cSrc = src !== undefined ? findSourceDecl(src, lock.correspondence.name, lock.semantics) : undefined;
  add("a", "a.paper-claim-source", "paper_claim source hash", !!pSrc && sourceHash(pSrc) === lock.paperClaim.sourceSha256,
    pSrc ? `sha256 ${sourceHash(pSrc)} (locked ${lock.paperClaim.sourceSha256})` : `${short(lock.paperClaim.name)} not found in ${lock.semantics}`);
  add("a", "a.correspondence-source", "intended_correspondence statement hash",
    !!cSrc && sourceHash(cSrc) === lock.correspondence.sourceSha256,
    cSrc ? `sha256 ${sourceHash(cSrc)} (locked ${lock.correspondence.sourceSha256})` : `${short(lock.correspondence.name)} not found in ${lock.semantics}`);
  {
    const pv = parseProvenance(pSrc?.doc);
    add("a", "a.provenance", "paper_claim's doc comment carries @paper, @sha256, @section and @quote",
      !!pv, pv ? `${pv.paper} §${pv.section}` : "missing or malformed provenance doc comment on paper_claim");
    const lp = lock.paperClaim.provenance;
    add("a", "a.provenance-locked", "provenance equals the approved lock", !!pv && !!lp && canonical(pv) === canonical(lp),
      lp ? "" : "lock has no provenance");
    if (pv) {
      const text = inp.readFile?.(pv.paper);
      add("a", "a.paper-sha256", "paper file exists and its sha256 matches @sha256", text !== undefined && sha256(text) === pv.sha256,
        text === undefined ? `${pv.paper} not found` : `sha256 ${sha256(text)} (doc says ${pv.sha256})`);
      add("a", "a.quote-verbatim", "the @quote occurs verbatim in the paper (whitespace-insensitive)",
        text !== undefined && pv.quote.length > 0 && collapse(text).includes(collapse(pv.quote)),
        `quote: “${pv.quote.length > 160 ? pv.quote.slice(0, 157) + "..." : pv.quote}”`);
    }
  }
  {
    const al = f.alias;
    const reasons = !al ? ["no alias facts reported"] : [
      ...(al.paperRefsFormal ? ["paper_claim references or unfolds to formal_claim"] : []),
      ...(al.formalRefsPaper ? ["formal_claim references paper_claim"] : []),
      ...(al.defeq ? ["paper_claim is definitionally equal to formal_claim (the correspondence would be Iff.rfl)"] : []),
      ...(al.shared.length ? [`paper_claim uses formal_claim's project constants: ${al.shared.join(", ")}`] : []),
    ];
    add("a", "a.no-alias", "paper_claim is an independent transcription: its dependency closure contains none of formal_claim's constants, and it is not defeq to formal_claim",
      !!al && reasons.length === 0, ...reasons);
  }
  if (src !== undefined) {
    const { code } = stripComments(src);
    const bad = [...code.matchAll(/\b(sorry|admit|axiom|native_decide|opaque|implemented_by|extern)\b/g)].map((m) => m[1]!);
    add("a", "a.semantics-clean", "Semantics.lean has no sorry/admit/axiom/native_decide/opaque", bad.length === 0,
      ...(bad.length ? [`found: ${[...new Set(bad)].join(", ")}`] : []));
  }
  add("a", "a.lean-run", "Lean meta script completed", f.complete);
  const P = f.decls.paper, C = f.decls.correspondence, F = f.decls.formal;
  for (const role of ["paper", "correspondence", "formal"] as const) {
    const r = f.resolve[role];
    const want = role === "paper" ? lock.paperClaim.name : role === "correspondence" ? lock.correspondence.name : lock.correspondence.formal;
    add("a", `a.resolve-${role}`, `${short(want)} is the locked constant`, !!r?.full && r.full === want,
      r?.full ? `found ${r.full}` : `${r?.count ?? 0} candidates`);
  }
  add("a", "a.paper-claim-kind", "paper_claim is a universe-monomorphic def of type Prop",
    !!P && P.kind === "def" && P.type === "Prop" && P.levels === 0, P ? `${P.kind} : ${P.type}, ${P.levels} universe params` : "missing");
  add("a", "a.module", "locked declarations live in a Semantics module",
    !!P && !!C && /(^|\.)Semantics$/.test(P.module) && /(^|\.)Semantics$/.test(C.module), `${P?.module ?? "?"} / ${C?.module ?? "?"}`);
  add("a", "a.paper-claim-expr", "paper_claim elaborated hash", !!P && exprHash(P) === lock.paperClaim.exprSha256 && P.hash64 === lock.paperClaim.hash64,
    `sha256 ${exprHash(P)} (locked ${lock.paperClaim.exprSha256}); hash64 ${P?.hash64} (locked ${lock.paperClaim.hash64})`);
  add("a", "a.correspondence-type", "intended_correspondence elaborated type hash",
    !!C && sha256(C.type) === lock.correspondence.typeSha256 && C.hash64 === lock.correspondence.hash64,
    `sha256 ${C ? sha256(C.type) : ""} (locked ${lock.correspondence.typeSha256})`);
  {
    const now = Object.fromEntries(f.deps.map((d) => [d.name, d.sha256]));
    const changed = Object.keys({ ...now, ...lock.dependencies }).filter((k) => now[k] !== lock.dependencies[k]);
    add("a", "a.dependencies", "definitions paper_claim unfolds to are unchanged", changed.length === 0,
      `${Object.keys(now).length} project-local dependencies`, ...changed.map((k) => `changed/added/removed: ${k}`));
    const leak = f.deps.filter((d) => d.name === lock.correspondence.formal || d.name === lock.correspondence.name || d.kind === "theorem" || d.kind === "axiom");
    add("a", "a.independent", "paper_claim is not defined through formal_claim, the correspondence, theorems or axioms",
      leak.length === 0, ...leak.map((d) => `paper_claim depends on ${d.kind} ${d.name}`));
  }
  add("a", "a.toolchain", "toolchain matches the lock", !inp.toolchain || inp.toolchain === lock.toolchain,
    `locked ${lock.toolchain}, current ${inp.toolchain ?? "(not read)"}`);

  // (b) correspondence soundness and shape
  const cAx = f.axioms[lock.correspondence.name] ?? [];
  const nonstd = cAx.filter((a) => !STD_AXIOMS.includes(a));
  add("b", "b.kind", "intended_correspondence is a theorem", C?.kind === "theorem", C ? C.kind : "missing");
  add("b", "b.axioms", "intended_correspondence uses only propext, Classical.choice, Quot.sound (no sorryAx)",
    !!C && f.axioms[lock.correspondence.name] !== undefined && nonstd.length === 0, `axioms: ${cAx.join(", ") || "(none)"}`);
  add("b", "b.nontrivial", "intended_correspondence is not proved by rfl / Iff.rfl / id",
    f.trivial !== undefined && f.trivial === "", f.trivial ? f.trivial : f.trivial === undefined ? "no proof-term facts reported" : "");
  const nat = cAx.filter(isNativeAxiom);
  if (nat.length) add("b", "b.native", "no native_decide / compiler trust (Lean.ofReduceBool, Lean.trustCompiler)", false, `axioms: ${nat.join(", ")}`);
  add("b", "b.shape", `intended_correspondence has the locked form (${lock.correspondence.direction === "iff" ? "formal_claim ↔ paper_claim" : "formal_claim → paper_claim"})`,
    !!f.shape && f.shape.form === lock.correspondence.direction && f.shape.paperSide && f.shape.formalSide,
    f.shape ? `form ${f.shape.form}; paper_claim side ${f.shape.paperSide}; formal_claim side ${f.shape.formalSide}` : "no shape reported");
  add("b", "b.formal", "formal_claim is a def of type Prop", !!F && F.kind === "def" && F.type === "Prop", F ? `${F.kind} : ${F.type}` : "missing");

  // (c) transport
  const transport: Transport[] = [];
  const seen = new Set<string>();
  for (const h of f.heads) {
    const key = `${h.full ?? h.query}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (h.missing) {
      transport.push({ name: h.query, query: h.query, origin: h.origin, verdict: "missing", note: "not found in the project" });
      continue;
    }
    if (h.origin === "cite" && h.kind !== "theorem") continue; // cited defs/structures are vocabulary, not results
    const aux = lock.auxiliary[h.full!] ?? lock.auxiliary[h.query];
    const bad = h.axioms.filter((a) => !STD_AXIOMS.includes(a));
    let verdict: Transport["verdict"];
    let note: string;
    if (bad.length) { verdict = "unsound"; note = `uses ${bad.join(", ")}${bad.some(isNativeAxiom) ? " (native_decide / compiler trust)" : ""}${bad.includes("sorryAx") ? " (sorry)" : ""}`; }
    else if (h.kind !== "theorem") { verdict = "does-not-transport"; note = `${h.kind}, not a theorem`; }
    else if (h.syntactic || h.defeq) {
      verdict = "certificate";
      note = `type ${h.syntactic ? "is" : "is defeq to"} paper_claim${h.transitive ? "; proof goes through intended_correspondence" : ""}`;
    } else if (h.direct || h.transitive) { verdict = "derived"; note = `proof ${h.direct ? "directly" : "transitively"} uses intended_correspondence`; }
    else if (aux !== undefined) { verdict = "auxiliary"; note = `auxiliary: ${aux}`; }
    else { verdict = "does-not-transport"; note = "type is not paper_claim and the proof does not use intended_correspondence"; }
    transport.push({ name: h.full!, query: h.query, origin: h.origin, verdict, note });
  }
  for (const n of lock.headlines)
    if (!f.heads.some((h) => h.origin === "head" && (h.query === n || h.full === n)))
      transport.push({ name: n, query: n, origin: "head", verdict: "missing", note: "headline was not classified by the Lean script" });
  const rejected = transport.filter((t) => t.verdict === "does-not-transport" || t.verdict === "missing" || t.verdict === "unsound");
  add("c", "c.transport", "every headline and paper-cited theorem transports across intended_correspondence or is marked auxiliary",
    rejected.length === 0, ...rejected.map((t) => `${t.verdict}: ${t.name} (${t.origin}) — ${t.note}`));
  const certs = transport.filter((t) => t.verdict === "certificate" && t.origin === "head");
  add("c", "c.certificate", "at least one headline theorem has type paper_claim", certs.length > 0,
    ...(certs.length ? certs.map((t) => `${t.name}: ${t.note}`) : ["no headline inhabits paper_claim"]));
  const auxHeads = transport.filter((t) => t.verdict === "auxiliary" && t.origin === "head");
  if (auxHeads.length)
    add("c", "c.aux-headline", "no headline is auxiliary", false, ...auxHeads.map((t) => `${t.name} is a headline but marked auxiliary`));

  // (d) paper side
  let paper: PaperFinding[] = [];
  if (lock.paperSource) {
    if (!inp.paper) add("d", "d.paper", `paper ${lock.paperSource.source} readable`, false, "paper source not found");
    else if (!pSrc) add("d", "d.paper", "paper vs paper_claim", false, "paper_claim source not found");
    else {
      const r = paperCheck(inp.paper.anchor, lock.paperSource.claims, pSrc, lock.paperSource.clarifications ?? {});
      paper = r.findings;
      add("d", "d.claims", "listed result claims exist in the paper", r.missing.length === 0, ...r.missing.map((m) => `missing claim id ${m}`));
      const open = paper.filter((p) => !p.clarification);
      const unintended = paper.filter((p) => p.clarification && p.clarification.verdict !== "intentional");
      add("d", "d.stronger", "no listed paper claim is stronger than paper_claim",
        unintended.length ? false : open.length ? "halt" : true,
        ...paper.map((p) => `${p.clarification ? `answered (${p.clarification.verdict})` : "OPEN"} [${p.id}] ${p.claimId}: ${p.detail}`));
    }
  }

  const status: CheckStatus = checks.some((c) => c.status === "fail") ? "fail" : checks.some((c) => c.status === "halt") ? "halt" : "pass";
  const badge = {
    schemaVersion: 1 as const,
    label: "truth gate",
    message: status === "pass" ? BADGE_PASS : status === "halt" ? BADGE_HALT : BADGE_FAIL,
    color: status === "pass" ? "brightgreen" : status === "halt" ? "orange" : "red",
  };
  const body = pSrc?.body ?? "";
  return {
    tool: "pipelinehalt/truth-gate",
    status,
    badge,
    paperClaim: lock.paperClaim.name,
    paperClaimSource: pSrc ? statementText(pSrc) : undefined,
    correspondence: lock.correspondence.name,
    direction: lock.correspondence.direction,
    conditional: lock.correspondence.direction === "formal_implies_paper" || /→/.test(body),
    checks,
    transport,
    paper,
    lockDigest: digest,
    commit: { locked: lock.commit, current: inp.commit },
    toolchain: { locked: lock.toolchain, current: inp.toolchain },
  };
}

// ---------------------------------------------------------------- lock creation

export interface ProposeOptions {
  semantics: string;
  semanticsSource: string;
  roots: string[];
  prefixes?: string[];
  headlines: string[];
  auxiliary?: Record<string, string>;
  /** Propose every paper-cited theorem that does not transport as auxiliary with this reason (approval decides). */
  auxiliaryCited?: string;
  paperSource?: { source: string; claims: string[]; cites?: string[] };
  commit: string;
  toolchain: string;
}

/** Build an UNAPPROVED lock from Lean facts. Never sets `approval`. */
export function proposeLock(facts: TgFacts, o: ProposeOptions): TruthLock {
  const P = facts.decls.paper, C = facts.decls.correspondence, F = facts.decls.formal;
  if (!P || !C || !F) {
    const miss = (["paper", "correspondence", "formal"] as const).filter((r) => !facts.decls[r]);
    throw new Error(`cannot lock: ${miss.map((r) => `${r} (${facts.resolve[r]?.count ?? 0} candidates for ${facts.resolve[r]?.query})`).join(", ")} not resolved to exactly one constant`);
  }
  if (!facts.shape || facts.shape.form === "other" || !facts.shape.paperSide || !facts.shape.formalSide)
    throw new Error("cannot lock: intended_correspondence must be `formal_claim ↔ paper_claim` or `formal_claim → paper_claim`");
  const pSrc = findSourceDecl(o.semanticsSource, P.full, o.semantics);
  const cSrc = findSourceDecl(o.semanticsSource, C.full, o.semantics);
  if (!pSrc || !cSrc) throw new Error(`cannot lock: ${o.semantics} does not contain both declarations`);
  const provenance = parseProvenance(pSrc.doc);
  if (!provenance)
    throw new Error("cannot lock: paper_claim needs a doc comment with `@paper: <path> @sha256: <hex> @section: <section> @quote: \"<verbatim claim>\"`");
  const auxiliary = { ...(o.auxiliary ?? {}) };
  if (o.auxiliaryCited !== undefined)
    for (const h of facts.heads)
      if (h.origin === "cite" && h.kind === "theorem" && !h.syntactic && !h.defeq && !h.transitive && h.full && !o.headlines.includes(h.query) && !o.headlines.includes(h.full))
        auxiliary[h.full] = o.auxiliaryCited;
  const headlines = o.headlines.map((q) => facts.heads.find((h) => h.origin === "head" && h.query === q)?.full ?? q);
  return {
    schema: LOCK_SCHEMA,
    semantics: o.semantics,
    roots: o.roots,
    prefixes: o.prefixes?.length ? o.prefixes : o.roots,
    paperClaim: { name: P.full, sourceSha256: sourceHash(pSrc), exprSha256: exprHash(P), hash64: P.hash64, provenance },
    correspondence: { name: C.full, formal: F.full, direction: facts.shape.form, sourceSha256: sourceHash(cSrc), typeSha256: sha256(C.type), hash64: C.hash64 },
    dependencies: Object.fromEntries(facts.deps.map((d) => [d.name, d.sha256]).sort()),
    axioms: facts.axioms[C.full] ?? [],
    headlines,
    auxiliary: Object.fromEntries(Object.entries(auxiliary).sort()),
    paperSource: o.paperSource ? { ...o.paperSource, clarifications: {} } : undefined,
    commit: o.commit,
    toolchain: o.toolchain,
    approval: null,
  };
}

export function approveLock(lock: TruthLock, approvedBy: string, approvedAt = new Date().toISOString(), note?: string): TruthLock {
  if (!approvedBy.trim()) throw new Error("approval needs a name");
  return { ...lock, approval: { approvedBy, approvedAt, digest: lockDigest(lock), ...(note ? { note } : {}) } };
}

export function readLock(path: string): TruthLock {
  if (!existsSync(path)) throw new Error(`lock file ${path} not found`);
  const l = JSON.parse(readFileSync(path, "utf8")) as TruthLock;
  if (l.schema !== LOCK_SCHEMA) throw new Error(`${path}: schema must be ${LOCK_SCHEMA}`);
  l.auxiliary ??= {};
  l.dependencies ??= {};
  return l;
}

/** Script options for checking an existing lock. */
export function scriptOptionsFor(lock: TruthLock, tex?: string): TgScriptOptions {
  const cites = tex ? paperCites(tex) : { strict: [], maybe: [] };
  return {
    roots: lock.roots,
    prefixes: lock.prefixes,
    paperClaim: lock.paperClaim.name,
    correspondence: lock.correspondence.name,
    formal: lock.correspondence.formal,
    heads: [...new Set([...lock.headlines, ...cites.strict, ...(lock.paperSource?.cites ?? [])])],
    maybe: cites.maybe,
  };
}

// ---------------------------------------------------------------- reporting

export function truthGateMarkdown(r: TruthGateReport): string {
  const L: string[] = [];
  const icon = (s: CheckStatus) => (s === "pass" ? "PASS" : s === "halt" ? "HALT" : "FAIL");
  L.push(`# Truth Gate: ${r.badge.message}`, "");
  L.push(`Status: **${r.status.toUpperCase()}** · lock digest \`${r.lockDigest.slice(0, 16)}\` · locked commit \`${r.commit.locked}\`${r.commit.current ? ` · current commit \`${r.commit.current}\`` : ""} · toolchain \`${r.toolchain.locked}\``, "");
  if (r.paperClaimSource)
    L.push(`Locked statement (\`${r.paperClaim}\`${r.conditional ? ", conditional: its hypotheses are part of the statement" : ""}):`, "", "```lean", r.paperClaimSource, "```", "");
  L.push(
    "> The Truth Gate checks that the kernel-checked certificate has the type of the locked, author-approved Lean transcription `paper_claim`, through `intended_correspondence`, with only propext / Classical.choice / Quot.sound. It does not check that the transcription matches unwritten intent, and it makes no claim beyond the locked statement.",
    "",
  );
  L.push("| check | group | status | detail |", "|---|---|---|---|");
  const esc = (s: string) => s.replace(/\|/g, "\\|");
  for (const c of r.checks) L.push(`| ${c.id} | ${c.group} | ${icon(c.status)} | ${esc(c.title)}${c.detail.length ? ": " + esc(c.detail.join("; ")) : ""} |`);
  L.push("");
  if (r.transport.length) {
    L.push("## Transport", "", "| theorem | origin | verdict | note |", "|---|---|---|---|");
    for (const t of r.transport) L.push(`| \`${t.name}\` | ${t.origin} | ${t.verdict} | ${esc(t.note)} |`);
    L.push("");
  }
  if (r.paper.length) {
    L.push("## Paper vs paper_claim", "");
    for (const p of r.paper) L.push(`- [${p.id}] ${p.clarification ? `answered (${p.clarification.verdict})` : "OPEN"} — ${p.question}`);
    L.push("");
  }
  return L.join("\n") + "\n";
}

export function truthGateAnnotations(r: TruthGateReport): string {
  return r.checks
    .filter((c) => c.status !== "pass")
    .map((c) => `::${c.status === "fail" ? "error" : "warning"} title=truth-gate ${c.id}::${c.title}${c.detail.length ? ": " + c.detail.join("; ") : ""}`.replace(/\n/g, " "))
    .join("\n");
}

export const truthGateExit = (s: CheckStatus) => (s === "pass" ? 0 : s === "halt" ? 2 : 1);
