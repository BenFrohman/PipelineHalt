import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BADGE_PASS,
  parseProvenance,
  proposeLock,
  approveLock,
  assertedValues,
  evaluateTruthGate,
  extractLatex,
  lockDigest,
  observationScript,
  parseObservation,
  parseTgFacts,
  readLock,
  semanticsLockLean,
  sourceHash,
  findSourceDecl,
  truthGateMarkdown,
  truthGateScript,
  type TgFacts,
  type TruthLock,
} from "../src/index.js";

const here = dirname(fileURLToPath(import.meta.url));
// tests run from dist/test; fixtures live in the source tree
const FX = join(here, "..", "..", "test", "fixtures", "truth-gate-lean");
const lock = () => readLock(join(FX, "truth-gate.lock.json"));
const sem = () => readFileSync(join(FX, "Fixture", "Semantics.lean"), "utf8");
const facts = () => parseTgFacts(readFileSync(join(FX, "facts.txt"), "utf8"));
const tex = () => readFileSync(join(FX, "paper.tex"), "utf8");
const inputs = (over: Partial<Parameters<typeof evaluateTruthGate>[1]> = {}) => ({
  semanticsSource: sem(),
  facts: facts(),
  toolchain: "leanprover/lean4:v4.34.0",
  paper: { anchor: extractLatex(tex(), "paper.tex"), tex: tex() },
  readFile: (rel: string) => (existsSync(join(FX, rel)) ? readFileSync(join(FX, rel), "utf8") : undefined),
  ...over,
});
const failed = (r: ReturnType<typeof evaluateTruthGate>) => r.checks.filter((c) => c.status !== "pass").map((c) => c.id);

describe("truth gate", () => {
  test("fixture passes and the badge says only what the gate checks", () => {
    const r = evaluateTruthGate(lock(), inputs());
    assert.deepEqual(failed(r), []);
    assert.equal(r.status, "pass");
    assert.equal(r.badge.message, BADGE_PASS);
    const md = truthGateMarkdown(r);
    for (const s of [r.badge.message, md]) assert.doesNotMatch(s, /\b(solved|solves|settled|resolved|problem solved|millennium|unconditional)\b/i);
    assert.match(md, /def paper_claim : Prop := ∀ n : Nat, 0 \+ n = n/);
  });

  test("(a) any edit to paper_claim fails until a new lock is approved", () => {
    const edited = sem().replace("def paper_claim : Prop := ∀ n : Nat, 0 + n = n", "def paper_claim : Prop := ∀ n : Nat, n + 0 = n");
    const r = evaluateTruthGate(lock(), inputs({ semanticsSource: edited }));
    assert.ok(failed(r).includes("a.paper-claim-source"));
    assert.equal(r.status, "fail");
    // comments and whitespace do not change the hash
    const cosmetic = sem().replace("def paper_claim : Prop := ∀ n : Nat, 0 + n = n", "def paper_claim : Prop :=\n    ∀ n : Nat, 0 + n = n -- note");
    assert.equal(sourceHash(findSourceDecl(cosmetic, "paper_claim")!), lock().paperClaim.sourceSha256);
  });

  test("(a) elaborated hash and dependency drift are caught", () => {
    const f = facts();
    f.decls.paper!.value = f.decls.paper!.value.replace("0", "1");
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ facts: f }))).includes("a.paper-claim-expr"));
    const g = facts();
    g.deps.push({ name: "Fixture.helper", kind: "def", sha256: "x" });
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ facts: g }))).includes("a.dependencies"));
    const h = facts();
    h.deps.push({ name: "Fixture.formal_claim", kind: "def", sha256: "x" });
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ facts: h }))).includes("a.independent"));
  });

  test("(a) an unapproved lock or a lock edited after approval fails", () => {
    const l = { ...lock(), approval: null };
    assert.ok(failed(evaluateTruthGate(l, inputs())).includes("a.approval"));
    const m: TruthLock = { ...lock(), headlines: [...lock().headlines, "Fixture.formal_only"] };
    assert.ok(failed(evaluateTruthGate(m, inputs())).includes("a.approval"));
    assert.equal(approveLock(m, "x", "t").approval!.digest, lockDigest(m));
    assert.throws(() => semanticsLockLean(l), /unapproved/);
  });

  test("(b) sorryAx or a non-standard axiom in the correspondence fails; so does the wrong shape", () => {
    const f = facts();
    f.axioms["Fixture.intended_correspondence"] = ["sorryAx"];
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ facts: f }))).includes("b.axioms"));
    const g = facts();
    g.shape = { form: "formal_implies_paper", paperSide: true, formalSide: true };
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ facts: g }))).includes("b.shape"));
    const bad = sem().replace("theorem formal_holds", "axiom ax : True\ntheorem formal_holds");
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ semanticsSource: bad }))).includes("a.semantics-clean"));
  });

  test("(c) a headline that does not transport is rejected; auxiliary is reported, not certified", () => {
    const out = readFileSync(join(FX, "facts.txt"), "utf8").replace(
      "TG_END",
      "TG_HEAD\tFixture.formal_only\tFixture.formal_only\ttheorem\tfalse\tfalse\tfalse\tfalse\t\thead\nTG_END",
    );
    const f: TgFacts = parseTgFacts(out);
    const l = approveLock({ ...lock(), headlines: [...lock().headlines, "Fixture.formal_only"] }, "t", "t");
    const r = evaluateTruthGate(l, inputs({ facts: f }));
    assert.ok(failed(r).includes("c.transport"));
    assert.equal(r.transport.find((t) => t.name === "Fixture.formal_only")!.verdict, "does-not-transport");
    const aux = approveLock({ ...lock(), auxiliary: { "Fixture.formal_only": "formal side only" } }, "t", "t");
    const cite = parseTgFacts(out.replace("\t\thead\nTG_END", "\t\tcite\nTG_END"));
    const r2 = evaluateTruthGate(aux, inputs({ facts: cite }));
    assert.equal(r2.status, "pass");
    assert.equal(r2.transport.find((t) => t.name === "Fixture.formal_only")!.verdict, "auxiliary");
  });

  test("(c) with no certificate headline the gate fails", () => {
    const f = facts();
    for (const h of f.heads) Object.assign(h, { syntactic: false, defeq: false });
    const r = evaluateTruthGate(lock(), inputs({ facts: f }));
    assert.ok(failed(r).includes("c.certificate"));
  });

  test("(d) a paper claim stronger than paper_claim halts until answered", () => {
    const strong = tex().replace("$0 + n = n$", "$0 + n = n$, and $2+2=5$, which solves the conjecture");
    const r = evaluateTruthGate(lock(), inputs({ paper: { anchor: extractLatex(strong, "paper.tex"), tex: strong } }));
    assert.equal(r.status, "halt");
    const keys = r.paper.map((p) => p.key);
    assert.ok(keys.some((k) => k.startsWith("omits-values:")));
    assert.ok(keys.some((k) => k.startsWith("overclaim:")));
    const l = lock();
    l.paperSource!.clarifications = Object.fromEntries(
      r.paper.map((p) => [p.id, { claimId: p.claimId, kind: p.kind, question: p.question, answer: "paper is wrong", verdict: "unintended" as const, answeredAt: "t" }]),
    );
    assert.equal(evaluateTruthGate(l, inputs({ paper: { anchor: extractLatex(strong, "paper.tex"), tex: strong } })).status, "fail");
    assert.deepEqual(assertedValues(String.raw`$S^2=6-2+21=25$, $p_g=4$, $x\neq 7$, \texttt{a=3}`), ["6", "25", "4"]);
  });

  test("(o) observation receipt is required when asked, and a mismatching goal blocks", () => {
    const l = lock();
    assert.ok(failed(evaluateTruthGate(l, inputs({ requireObservation: true, observation: null }))).includes("o.observed"));
    const ok = parseObservation("Fixture.intended_correspondence : ...\nTG_OBS_GOAL\ttrue\t∀ n, 0 + n = n", l, "c", "Fixture.headline");
    assert.equal(ok.verdict, "goal-matches-paper-claim");
    assert.equal(evaluateTruthGate(l, inputs({ requireObservation: true, observation: ok })).status, "pass");
    const bad = parseObservation("TG_OBS_GOAL\tfalse\tS2 = 25", l, "c", "S2 = 25");
    assert.equal(bad.verdict, "goal-does-not-match");
    assert.ok(failed(evaluateTruthGate(l, inputs({ requireObservation: true, observation: bad }))).includes("o.observed"));
    const s = observationScript({ lock: l, goalTerm: "0 = 0" });
    assert.match(s, /#check @Fixture\.intended_correspondence/);
    assert.match(s, /#print Fixture\.paper_claim/);
  });

  test("generated Lean: meta script and in-build lock name the locked constants", () => {
    const s = truthGateScript({ roots: ["Fixture.Semantics"], paperClaim: "paper_claim", correspondence: "intended_correspondence", formal: "formal_claim", heads: ["headline"] });
    assert.match(s, /^import Lean\nimport Fixture\.Semantics/);
    const b = semanticsLockLean(lock());
    assert.match(b, /throwError "truth gate: \{h\} does not transport/);
    assert.match(b, new RegExp(lock().paperClaim.hash64));
    assert.equal(b, readFileSync(join(FX, "scripts", "SemanticsLock.lean"), "utf8"));
  });
  // ---- standing rule: independent transcription, non-vacuous correspondence, no sorry/admit/native_decide/axioms.
  // Each rejection also has a real-Lean negative in test/fixtures/truth-gate-lean/negatives (run by run-negatives.sh in CI).
  const docOf = (src: string) => findSourceDecl(src, "paper_claim")!;
  const withDoc = (doc: string) =>
    sem().replace(/\/--[\s\S]*?-\/\s*\ndef paper_claim/, `/-- ${doc} -/\ndef paper_claim`);
  const okDoc = () => {
    const p = lock().paperClaim.provenance;
    return `@paper: ${p.paper} @sha256: ${p.sha256} @section: ${p.section} @quote: "${p.quote}"`;
  };

  test("provenance is parsed from paper_claim's doc comment and recorded in the lock", () => {
    const p = parseProvenance(docOf(sem()).doc)!;
    assert.equal(p.paper, "paper.tex");
    assert.equal(p.quote, "For every natural number $n$, $0 + n = n$");
    assert.deepEqual(lock().paperClaim.provenance, p);
  });

  test("reject: missing provenance (lock refuses; gate fails)", () => {
    const src = withDoc("no provenance here");
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ semanticsSource: src }))).includes("a.provenance"));
    assert.throws(() => proposeLock(facts(), { roots: ["Fixture.Semantics"], semantics: "Fixture/Semantics.lean", headlines: ["Fixture.headline"],
      semanticsSource: src, toolchain: "t", commit: "c" }), /cannot lock: paper_claim needs a doc comment/);
  });

  test("reject: quote not verbatim in the paper, wrong sha256, missing paper file", () => {
    const q = okDoc().replace("$0 + n = n$", "$n + 0 = n$");
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ semanticsSource: withDoc(q) }))).includes("a.quote-verbatim"));
    const h = okDoc().replace(/@sha256: (\w)/, (_m, c: string) => `@sha256: ${c === "0" ? "1" : "0"}`);
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ semanticsSource: withDoc(h) }))).includes("a.paper-sha256"));
    const m = okDoc().replace("@paper: paper.tex", "@paper: missing.tex");
    const r = failed(evaluateTruthGate(lock(), inputs({ semanticsSource: withDoc(m) })));
    assert.ok(r.includes("a.paper-sha256") && r.includes("a.provenance-locked"));
    // the lock's provenance is binding even when the doc comment is self-consistent
    const l = approveLock({ ...lock(), paperClaim: { ...lock().paperClaim, provenance: { ...lock().paperClaim.provenance, section: "other" } } }, "t", "t");
    assert.ok(failed(evaluateTruthGate(l, inputs())).includes("a.provenance-locked"));
  });

  test("reject: paper_claim aliasing formal_claim (reference, defeq, shared constant, reverse reference)", () => {
    for (const al of [
      { paperRefsFormal: true, formalRefsPaper: false, defeq: true, shared: [] },
      { paperRefsFormal: false, formalRefsPaper: false, defeq: true, shared: [] },
      { paperRefsFormal: false, formalRefsPaper: false, defeq: false, shared: ["Fixture.lhs"] },
      { paperRefsFormal: false, formalRefsPaper: true, defeq: false, shared: [] },
    ]) {
      const f = facts();
      f.alias = al;
      const r = evaluateTruthGate(lock(), inputs({ facts: f }));
      assert.ok(failed(r).includes("a.no-alias"), JSON.stringify(al));
      assert.equal(r.status, "fail");
    }
    const f = facts();
    delete f.alias;
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ facts: f }))).includes("a.no-alias"), "missing alias facts fail closed");
  });

  test("reject: intended_correspondence proved by rfl / Iff.rfl / id", () => {
    for (const why of ["proof term is Iff.rfl", "proof term is Iff.refl", "proof term is Iff.of_eq rfl", "proof term is Iff.intro of two identity functions", "proof term is id"]) {
      const f = facts();
      f.trivial = why;
      assert.ok(failed(evaluateTruthGate(lock(), inputs({ facts: f }))).includes("b.nontrivial"), why);
    }
    const f = facts();
    delete f.trivial;
    assert.ok(failed(evaluateTruthGate(lock(), inputs({ facts: f }))).includes("b.nontrivial"), "missing proof-term facts fail closed");
    const s = truthGateScript({ roots: ["Fixture.Semantics"], paperClaim: "paper_claim", correspondence: "intended_correspondence", formal: "formal_claim", heads: [] });
    assert.match(s, /``Iff\.rfl, ``Iff\.refl, ``rfl, ``Eq\.refl, ``HEq\.refl/);
    assert.match(s, /isConstOf ``id && v\.getAppNumArgs == 2 then tgTrivial/, "id x is a type ascription, not a vacuous proof");
    assert.match(semanticsLockLean(lock()), /is vacuous/);
  });

  test("reject: sorry, admit, native_decide and non-standard axioms", () => {
    for (const [ax, id] of [["sorryAx", "b.axioms"], ["Lean.ofReduceBool", "b.native"], ["Lean.trustCompiler", "b.native"], ["Fixture.intended_correspondence._native.native_decide.ax_1_1", "b.native"], ["Fixture.my_axiom", "b.axioms"]] as const) {
      const f = facts();
      f.axioms["Fixture.intended_correspondence"] = ["propext", ax];
      const r = evaluateTruthGate(lock(), inputs({ facts: f }));
      assert.ok(failed(r).includes(id), ax);
      assert.equal(r.status, "fail");
    }
    for (const word of ["sorry", "admit", "native_decide"]) {
      const src = sem().replace("fun n => (Nat.zero_add n).symm", `by ${word}`);
      assert.ok(failed(evaluateTruthGate(lock(), inputs({ semanticsSource: src }))).includes("a.semantics-clean"), word);
    }
    assert.match(semanticsLockLean(lock()), /native_decide \/ compiler trust/);
  });
});
