import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { audit, extractUnits, parseLeanFacts, leanScript, sentences, buildClaims } from "../src/audit.js";
import { PassThrough, Writable } from "node:stream";
import { execFileSync } from "node:child_process";
import {
  parseLean,
  normalizeMath,
  lowerBounds,
  setLiterals,
  compare,
  compareClaim,
  mismatchId,
  parseMarkdownAnchor,
  renderMarkdownClarifications,
  extractLatex,
  extractPdf,
  loadAnchor,
  saveClarifications,
  record,
  parseVerdict,
  askInteractive,
  handle,
  toMarkdown,
  toAnnotations,
  hypotheses,
  run,
  parseMap,
  applyMap,
  discoverMap,
  MAP_FILE,
  type ClaimMap,
  type Anchor,
  odeShape,
} from "../src/index.js";

const LEAN = `import Mathlib
namespace Demo

/-- \`gap n\` is the n-th prime gap. -/
noncomputable def gap (n : ℕ) : ℕ := n

/-- **Theorem 1.** Every gap after the first is at least two. -/
theorem two_le_gap {n : ℕ} (hn : 1 ≤ n) : 2 ≤ gap n := by
  sorry

-- a comment mentioning theorem fake_decl : False
axiom magic : ∀ n : ℕ, gap n = n

/-- Uses the axiom. -/
theorem gap_eq (n : ℕ) : gap n = n := magic n

theorem main_bound (h : Foo 3 2) : Bar 6 := by
  exact trivial

theorem sets_ok : Adm ({0, 4, 6} : Finset ℕ) := by decide

lemma premise_form : Foo 3 2 → Bar 6 := fun _ => trivial

end Demo
`;

const io = () => {
  const chunks: string[] = [];
  const out = new Writable({
    write(c, _e, cb) {
      chunks.push(String(c));
      cb();
    },
  });
  return { out, text: () => chunks.join("") };
};

describe("lean parser", () => {
  test("recognises Lean module-system `public` declarations", () => {
    const d = parseLean("public theorem pub_thm (n : Nat) : n = n := rfl\n@[simp] public lemma pub_lem : True := trivial\n", "Pub.lean");
    assert.deepEqual(d.map((x) => x.name), ["pub_thm", "pub_lem"]);
  });
  const decls = parseLean(LEAN, "Demo.lean");
  const get = (n: string) => decls.find((d) => d.name === n)!;
  test("finds declarations, namespaces and lines, ignores comments", () => {
    assert.deepEqual(
      decls.map((d) => d.name),
      [
        "gap",
        "two_le_gap",
        "magic",
        "gap_eq",
        "main_bound",
        "sets_ok",
        "premise_form",
      ],
    );
    assert.equal(get("two_le_gap").fullName, "Demo.two_le_gap");
    assert.equal(get("two_le_gap").line, 8);
    assert.ok(!decls.some((d) => d.name === "fake_decl"));
  });
  test("binders, type, docstring", () => {
    const d = get("two_le_gap");
    assert.deepEqual(
      d.binders.map((b) => [b.bracket, b.names, b.type]),
      [
        ["{", ["n"], "ℕ"],
        ["(", ["hn"], "1 ≤ n"],
      ],
    );
    assert.equal(d.type, "2 ≤ gap n");
    assert.match(d.doc!, /Theorem 1/);
  });
  test("sorry and axiom usage", () => {
    assert.equal(get("two_le_gap").usesSorry, true);
    assert.equal(get("main_bound").usesSorry, false);
    assert.deepEqual(get("gap_eq").usesAxioms, ["magic"]);
  });
  test("hypotheses include named binders and premises", () => {
    assert.deepEqual(
      hypotheses(get("main_bound")).map((h) => h.text),
      ["Foo 3 2"],
    );
    assert.deepEqual(
      hypotheses(get("premise_form")).map((h) => h.text),
      ["Foo 3 2"],
    );
    assert.deepEqual(
      hypotheses(get("two_le_gap")).map((h) => h.text),
      ["1 ≤ n"],
    );
  });
});

describe("text helpers", () => {
  test("normalizeMath", () => {
    assert.equal(
      normalizeMath("$n\\ge2$ and $\\{0,2\\}$, $H_1\\le6$"),
      "n≥2 and {0,2} , H1≤6",
    );
  });
  test("bounds and sets", () => {
    assert.deepEqual(
      [...lowerBounds("n ≥2, 1 ≤ m, k > 3")],
      [
        ["n", 2],
        ["k", 4],
        ["m", 1],
      ],
    );
    assert.deepEqual(setLiterals("{6, 0, 4} and {0,2}"), ["0,4,6", "0,2"]);
  });
});

describe("comparison", () => {
  const decls = parseLean(LEAN, "Demo.lean");
  test("silent: explicit mapping to a missing name, and no heuristic match", () => {
    const r = compareClaim(
      {
        id: "c1",
        statement: "Zeta zeros lie on the critical line.",
        lean: ["riemann"],
      },
      decls,
    );
    assert.equal(r.mismatches[0]!.kind, "silent");
    assert.match(r.mismatches[0]!.question, /`riemann`/);
    const h = compareClaim(
      { id: "c2", statement: "Quantum chromodynamics confines quarks." },
      decls,
    );
    assert.equal(h.mismatches[0]!.kind, "silent");
    assert.equal(h.drift, 1);
  });
  test("narrower: different lower bound, and omitted set", () => {
    const r = compareClaim(
      {
        id: "3.1",
        number: "Theorem 3.1",
        statement: "For all $n\\ge2$, $2\\le gap(n)$.",
        lean: ["two_le_gap"],
      },
      decls,
    );
    const kinds = r.mismatches.map((m) => `${m.kind}:${m.key}`);
    assert.ok(kinds.includes("narrower:bound:n>=1vs2"), kinds.join());
    assert.ok(kinds.includes("conditional:sorry"));
    assert.ok(kinds.some((k) => k.startsWith("ambiguous:label:")));
    const s = compareClaim(
      {
        id: "L",
        statement: "The sets $\\{0,4,6\\}$ and $\\{0,2,6\\}$ are Adm.",
        lean: ["sets_ok"],
      },
      decls,
    );
    assert.deepEqual(
      s.mismatches.map((m) => m.key),
      ["omits-set:0,2,6"],
    );
  });
  test("conditional: unstated hypothesis and axiom; stated hypothesis is fine", () => {
    const r = compareClaim(
      { id: "2", statement: "Bar holds at 6.", lean: ["main_bound"] },
      decls,
    );
    assert.equal(r.mismatches[0]!.kind, "conditional");
    assert.match(r.mismatches[0]!.question, /assumes `h : Foo 3 2`/);
    const ok = compareClaim(
      { id: "2", statement: "Foo[3,2] implies Bar 6.", lean: ["main_bound"] },
      decls,
    );
    assert.deepEqual(ok.mismatches, []);
    const ax = compareClaim(
      { id: "3", statement: "gap n equals n", lean: ["gap_eq"] },
      decls,
    );
    assert.ok(ax.mismatches.some((m) => m.key === "axiom:magic"));
  });
  test("ambiguous: hedged wording, misworded title, duplicate ids", () => {
    const r = compareClaim(
      {
        id: "4",
        title: "Riemann zeta zero distribution",
        statement: "Roughly, Foo 3 2 gives Bar 6.",
        lean: ["main_bound"],
      },
      decls,
    );
    const keys = r.mismatches.map((m) => m.key);
    assert.ok(keys.includes("hedge:roughly"));
    assert.ok(keys.includes("title-vs-statement"));
    const rep = compare(
      {
        claims: [
          { id: "x", statement: "Foo 3 2 implies Bar 6", lean: ["main_bound"] },
          { id: "x", statement: "Bar 6", lean: ["main_bound"] },
        ],
        clarifications: {},
      },
      decls,
    );
    assert.ok(rep.claims[0]!.mismatches.some((m) => m.key === "duplicate-id"));
  });
  test("heuristic matching finds the right theorem", () => {
    const r = compareClaim(
      { id: "t", statement: "Every gap after the first is at least two" },
      decls,
    );
    assert.equal(r.matched[0]!.name, "two_le_gap");
  });
  test("ids are stable and answered questions are not re-asked", () => {
    const anchor: Anchor = {
      claims: [{ id: "2", statement: "Bar holds at 6.", lean: ["main_bound"] }],
      clarifications: {},
    };
    const a = compare(anchor, decls);
    assert.equal(a.status, "halt");
    const b = compare(anchor, decls);
    assert.equal(a.pending[0]!.id, b.pending[0]!.id);
    assert.equal(
      a.pending[0]!.id,
      mismatchId("2", "conditional", "main_bound", "hyp:Foo 3 2"),
    );
    record(
      anchor,
      a.pending[0]!,
      "yes, Foo is the standing hypothesis of section 2",
    );
    const c = compare(anchor, decls);
    assert.equal(c.pending.length, 0);
    assert.equal(c.status, "aligned");
    assert.equal(
      c.claims[0]!.mismatches[0]!.clarification!.verdict,
      "intentional",
    );
    // claims are never modified
    assert.equal(anchor.claims[0]!.statement, "Bar holds at 6.");
    record(anchor, a.pending[0]!, "no, that is a bug");
    const d = compare(anchor, decls, { maxDrift: 0.1 });
    assert.equal(d.status, "drift");
    assert.match(toMarkdown(d), /does not auto-correct/);
  });
  test("verdict parsing", () => {
    assert.equal(parseVerdict("Yes."), "intentional");
    assert.equal(parseVerdict("no - bug"), "unintended");
    assert.equal(parseVerdict("it depends"), "other");
  });
});

describe("anchors", () => {
  const dir = mkdtempSync(join(tmpdir(), "ph-"));
  test("markdown anchor parse and clarification round trip", () => {
    const md =
      "# Paper\n\n## Claim 3.2 (Theorem 3.2): Main bound\nFoo implies Bar.\n- lean: `main_bound`\n- assumes: Foo\n";
    const a = parseMarkdownAnchor(md);
    assert.equal(a.title, "Paper");
    assert.deepEqual(a.claims[0], {
      id: "3.2",
      number: "Theorem 3.2",
      title: "Main bound",
      statement: "Foo implies Bar.",
      lean: ["main_bound"],
      assumptions: ["Foo"],
    });
    const clar = {
      abc: {
        claimId: "3.2",
        kind: "conditional" as const,
        question: "q",
        answer: "yes",
        verdict: "intentional" as const,
        answeredAt: "t",
      },
    };
    const md2 = renderMarkdownClarifications(md, clar);
    assert.deepEqual(parseMarkdownAnchor(md2).clarifications, clar);
    assert.equal(renderMarkdownClarifications(md2, clar), md2);
  });
  test("latex extraction with section numbering, titles, explicit lean comments", () => {
    const tex =
      "\\title{T}\\newtheorem{theorem}{Theorem}[section]\\newtheorem{lemma}[theorem]{Lemma}\n\\section{A}\n\\begin{lemma}[Small]\\label{lem:a}\n% lean: foo, bar\nIt holds.\\end{lemma}\n\\section{B}\\begin{remark}x\\end{remark}\\begin{theorem}\\label{thm:b}\\begin{enumerate}\\item P.\\end{enumerate}\\end{theorem}";
    const a = extractLatex(tex, "x.tex");
    assert.equal(a.title, "T");
    assert.deepEqual(
      a.claims.map((c) => [c.id, c.number, c.title, c.lean]),
      [
        ["lem:a", "Lemma 1.1", "Small", ["foo", "bar"]],
        ["thm:b", "Theorem 2.2", undefined, undefined],
      ],
    );
    assert.equal(a.claims[1]!.statement, "• P.");
  });
  test("load/save for json, md, tex sidecar", () => {
    const j = join(dir, "a.json");
    writeFileSync(j, JSON.stringify({ claims: [{ id: "1", statement: "s" }] }));
    assert.deepEqual(loadAnchor(j).clarifications, {});
    const clar = {
      k: {
        claimId: "1",
        kind: "silent" as const,
        question: "q",
        answer: "a",
        verdict: "other" as const,
        answeredAt: "t",
      },
    };
    saveClarifications(j, clar);
    assert.deepEqual(loadAnchor(j).clarifications, clar);
    const t = join(dir, "p.tex");
    writeFileSync(t, "\\begin{theorem}S\\end{theorem}");
    assert.equal(saveClarifications(t, clar), `${t}.pipelinehalt.json`);
    assert.deepEqual(loadAnchor(t).clarifications, clar);
    assert.equal(readFileSync(t, "utf8"), "\\begin{theorem}S\\end{theorem}");
    writeFileSync(join(dir, "e.json"), JSON.stringify({ claims: [] }));
    assert.throws(() => loadAnchor(join(dir, "e.json")), /no claims/);
    assert.throws(() => loadAnchor(join(dir, "x.txt")), /unsupported/);
  });
  test("pdf extraction from committed fixture (needs pdftotext)", () => {
    // test/fixtures/doc.pdf is built from test/fixtures/doc.tex (tectonic); no TeX needed at test time.
    const pdf = join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "test",
      "fixtures",
      "doc.pdf",
    );
    const a = extractPdf(pdf);
    assert.equal(a.claims[0]!.id, "theorem-1");
    assert.match(a.claims[0]!.statement, /Every gap is at least two/);
  });
});

describe("halt protocol", () => {
  const decls = parseLean(LEAN, "Demo.lean");
  test("interactive prompt records answers, blank skips", async () => {
    const anchor: Anchor = {
      claims: [
        {
          id: "2",
          statement: "Bar holds at 6.",
          lean: ["main_bound", "gap_eq"],
        },
      ],
      clarifications: {},
    };
    const r = compare(anchor, decls);
    assert.equal(r.pending.length, 2);
    const input = new PassThrough();
    const o = io();
    const p = askInteractive(anchor, r.pending, input, o.out);
    input.write("yes intentional\n\n");
    input.end();
    assert.equal(await p, 1);
    assert.match(o.text(), /\[1\/2\] CONDITIONAL/);
    assert.equal(compare(anchor, decls).pending.length, 1);
  });
  test("agent JSON protocol: halt, then answers recorded and aligned", () => {
    const req = {
      anchor: {
        claims: [{ id: "2", statement: "Bar holds at 6." }],
        clarifications: {},
      },
      leanSources: { "Demo.lean": LEAN },
    };
    const r1 = handle(req);
    assert.equal(r1.status, "halt");
    assert.equal(r1.exitCode, 2);
    assert.ok(r1.questions.length >= 1);
    const answers = Object.fromEntries(r1.questions.map((q) => [q.id, "yes"]));
    const r2 = handle({
      ...req,
      answers: { ...answers, deadbeef0000: "ignored" },
    });
    assert.equal(r2.status, "aligned");
    assert.equal(r2.exitCode, 0);
    assert.deepEqual(r2.recorded.sort(), Object.keys(answers).sort());
    assert.equal(
      Object.keys(r2.anchor!.clarifications).length,
      r1.questions.length,
    );
  });
  test("annotations", () => {
    const r = compare(
      {
        claims: [
          { id: "2", statement: "Bar holds at 6.", lean: ["main_bound"] },
        ],
        clarifications: {},
      },
      decls,
    );
    assert.match(
      toAnnotations(r),
      /^::warning title=PipelineHalt conditional \(2\)::/,
    );
  });
});

describe("cli", () => {
  const dir = mkdtempSync(join(tmpdir(), "ph-cli-"));
  const lean = join(dir, "Demo.lean");
  writeFileSync(lean, LEAN);
  const anchor = join(dir, "claims.md");
  writeFileSync(
    anchor,
    "# Demo\n\n## Claim 2: Bar\nBar holds at 6.\n- lean: main_bound\n",
  );
  const cli = async (argv: string[], stdin = "") => {
    const o = io();
    const e = io();
    const input = new PassThrough();
    input.end(stdin);
    const code = await run(argv, {
      stdin: input,
      stdout: o.out,
      stderr: e.out,
    });
    return { code, out: o.text(), err: e.text() };
  };
  test("help, prompt, usage errors", async () => {
    assert.match((await cli(["help"])).out, /Exit codes/);
    assert.match(
      (await cli(["prompt"])).out,
      /Never answer a question yourself/,
    );
    assert.equal((await cli(["check"])).code, 3);
    assert.equal((await cli(["check", "--anchor", anchor])).code, 3);
    assert.equal((await cli(["bogus", "--anchor", anchor])).code, 3);
    assert.equal((await cli(["answer", "--anchor", anchor])).code, 3);
    assert.equal((await cli(["extract"])).code, 3);
  });
  test("check halts (exit 2) and writes pending; answer --from; re-check aligned (exit 0)", async () => {
    const pending = join(dir, "pending.json");
    const md = join(dir, "r.md");
    const js = join(dir, "r.json");
    const r = await cli([
      "check",
      "--anchor",
      anchor,
      "--lean",
      lean,
      "--pending",
      pending,
      "--report-md",
      md,
      "--report-json",
      js,
    ]);
    assert.equal(r.code, 2);
    assert.match(r.out, /HALT: 1 open question/);
    assert.ok(existsSync(md) && existsSync(js));
    const pf = JSON.parse(readFileSync(pending, "utf8"));
    pf.questions[0].answer = "yes, standing hypothesis";
    writeFileSync(pending, JSON.stringify(pf));
    const a = await cli([
      "answer",
      "--anchor",
      anchor,
      "--lean",
      lean,
      "--from",
      pending,
    ]);
    assert.match(a.out, /recorded 1 answer/);
    assert.match(readFileSync(anchor, "utf8"), /pipelinehalt-clarifications/);
    const c = await cli(["check", "--anchor", anchor, "--lean", lean, "--ci"]);
    assert.equal(c.code, 0);
    assert.match(c.out, /pipelinehalt: aligned/);
  });
  test("answer --id with verdict, unknown id skipped; ci drift exit 1", async () => {
    const j = join(dir, "c.json");
    writeFileSync(
      j,
      JSON.stringify({
        claims: [
          { id: "2", statement: "Bar holds at 6.", lean: ["main_bound"] },
        ],
      }),
    );
    const r = await cli([
      "check",
      "--anchor",
      j,
      "--lean",
      lean,
      "--ci",
      "--pending",
      join(dir, "p2.json"),
    ]);
    assert.equal(r.code, 2);
    assert.match(r.out, /::warning/);
    const id = JSON.parse(readFileSync(join(dir, "p2.json"), "utf8"))
      .questions[0].id;
    const u = await cli([
      "answer",
      "--anchor",
      j,
      "--lean",
      lean,
      "--id",
      "nope",
      "--text",
      "x",
    ]);
    assert.match(u.err, /unknown or stale/);
    await cli([
      "answer",
      "--anchor",
      j,
      "--lean",
      lean,
      "--id",
      id,
      "--text",
      "it",
      "is",
      "a",
      "bug",
      "--verdict",
      "unintended",
    ]);
    const c = await cli([
      "check",
      "--anchor",
      j,
      "--lean",
      lean,
      "--ci",
      "--max-drift",
      "0.1",
    ]);
    assert.equal(c.code, 1);
    assert.equal(
      JSON.parse(readFileSync(j, "utf8")).clarifications[id].answer,
      "it is a bug",
    );
  });
  test("interactive check records into the anchor", async () => {
    const j = join(dir, "i.json");
    writeFileSync(
      j,
      JSON.stringify({
        claims: [
          { id: "2", statement: "Bar holds at 6.", lean: ["main_bound"] },
        ],
      }),
    );
    const r = await cli(
      [
        "check",
        "--anchor",
        j,
        "--lean",
        lean,
        "--interactive",
        "--pending",
        join(dir, "p3.json"),
      ],
      "yes\n",
    );
    assert.equal(r.code, 0);
    assert.match(r.out, /recorded 1 answer/);
  });
  test("agent and extract commands", async () => {
    const r = await cli(["agent"], JSON.stringify({ anchor, lean: [lean] }));
    assert.equal(JSON.parse(r.out).protocol, "pipelinehalt/1");
    const tex = join(dir, "p.tex");
    writeFileSync(tex, "\\begin{theorem}\\label{t}Bar 6\\end{theorem}");
    assert.match((await cli(["extract", "--from", tex])).out, /"id": "t"/);
    const out = join(dir, "x.json");
    assert.match(
      (await cli(["extract", "--from", tex, "--out", out])).out,
      /wrote 1 claims/,
    );
  });
});

describe("mapping file", () => {
  const decls = parseLean(LEAN, "Demo.lean");
  const claim = {
    id: "t1",
    number: "Theorem 3.1",
    statement: "For all $n\\ge1$, $2\\le gap(n)$.",
  };
  test("parse validates shape", () => {
    assert.throws(() => parseMap("{}"), /"claims"/);
    assert.throws(() => parseMap('{"claims":{"a":{"lean":"x"}}}'), /array/);
  });
  test("mapped claims skip heuristics; aliases suppress numbering; unclaimed suppresses info; unknown ids warn", () => {
    const anchor: Anchor = { claims: [claim], clarifications: {} };
    const bare = compare(anchor, decls);
    assert.ok(
      bare.claims[0]!.mismatches.some((m) => m.key.startsWith("label:")),
    );
    const map: ClaimMap = {
      claims: {
        t1: { lean: ["two_le_gap"], aliases: ["theorem 1"] },
        ghost: { lean: ["x"] },
      },
      unclaimed: { main_bound: "not in the paper" },
    };
    const { anchor: a, warnings } = applyMap(anchor, map);
    assert.deepEqual(warnings, [
      'mapping file names claim "ghost", which is not in the anchor',
    ]);
    assert.equal(
      anchor.claims[0]!.lean,
      undefined,
      "original anchor is not modified",
    );
    assert.equal(
      a.clarifications,
      anchor.clarifications,
      "answers still land in the same anchor",
    );
    const r = compare(a, decls);
    assert.deepEqual(
      r.claims[0]!.matched.map((m) => [m.name, m.explicit]),
      [["two_le_gap", true]],
    );
    assert.ok(!r.claims[0]!.mismatches.some((m) => m.key.startsWith("label:")));
    assert.ok(
      r.claims[0]!.mismatches.some((m) => m.key === "sorry"),
      "real differences still reported",
    );
  });
  test("discovery beside the anchor or up to the repo root; --map and --no-map", async () => {
    const root = mkdtempSync(join(tmpdir(), "ph-map-"));
    mkdirSync(join(root, ".git"));
    mkdirSync(join(root, "paper"));
    const anchorPath = join(root, "paper", "claims.json");
    writeFileSync(anchorPath, JSON.stringify({ claims: [claim] }));
    assert.equal(discoverMap(anchorPath), undefined);
    writeFileSync(
      join(root, MAP_FILE),
      JSON.stringify({
        claims: { t1: { lean: ["two_le_gap"], aliases: ["Theorem 1"] } },
      }),
    );
    assert.equal(discoverMap(anchorPath), join(root, MAP_FILE));
    writeFileSync(
      join(root, "paper", MAP_FILE),
      JSON.stringify({ claims: { t1: { lean: ["gap_eq"] } } }),
    );
    assert.equal(
      discoverMap(anchorPath),
      join(root, "paper", MAP_FILE),
      "beside the anchor wins",
    );
    const lean = join(root, "Demo.lean");
    writeFileSync(lean, LEAN);
    const json = async (extra: string[]) => {
      const js = join(root, "r.json");
      const o = new Writable({
        write(_c, _e, cb) {
          cb();
        },
      });
      await run(
        [
          "check",
          "--anchor",
          anchorPath,
          "--lean",
          lean,
          "--pending",
          join(root, "p.json"),
          "--report-json",
          js,
          ...extra,
        ],
        { stdin: new PassThrough(), stdout: o, stderr: o },
      );
      return JSON.parse(readFileSync(js, "utf8"));
    };
    assert.deepEqual(
      (await json([])).claims[0].matched.map((m: { name: string }) => m.name),
      ["gap_eq"],
    );
    const viaFlag = await json(["--map", join(root, MAP_FILE)]);
    assert.deepEqual(
      viaFlag.claims[0].matched.map((m: { name: string }) => m.name),
      ["two_le_gap"],
    );
    assert.ok(viaFlag.mapFile.endsWith(MAP_FILE));
    const none = await json(["--no-map"]);
    assert.equal(none.mapFile, undefined);
    assert.ok(
      none.claims[0].matched.every((m: { explicit: boolean }) => !m.explicit),
    );
    const agent = handle({ anchor: anchorPath, lean: [lean], map: false });
    assert.equal(agent.report.mapFile, undefined);
    assert.equal(
      handle({ anchor: anchorPath, lean: [lean] }).report.claims[0]!.matched[0]!
        .name,
      "gap_eq",
    );
  });
});

describe("Prop statement defs", () => {
  test("hypotheses inside a Stmt_ def unfolded by the theorem count as CONDITIONAL", () => {
    const decls = parseLean(`
namespace N
def Stmt_main : Prop :=
  ∀ (a : Nat) (u : Nat), StabilizerTransitive a u → ∀ b : Nat, Positive b → b = a
abbrev Stmt_alias : Prop := Stmt_main
theorem main : Stmt_main := by sorry_free
theorem viaAlias : E.Stmt_alias := main
end N
`);
    for (const name of ["main", "viaAlias"]) {
      const r = compareClaim(
        { id: "t", statement: "Every b equals a.", lean: [name] },
        decls,
      );
      const hyps = r.mismatches
        .filter((m) => m.kind === "conditional")
        .map((m) => m.key);
      assert.ok(hyps.includes("hyp:StabilizerTransitive a u"), `${name}: ${hyps}`);
      assert.ok(hyps.includes("hyp:Positive b"), `${name}: ${hyps}`);
    }
  });
});

test("ODE shape mismatch (majorant y' = Cy² − κy³ vs y' ≤ C − κy²)", () => {
  assert.deepEqual(odeShape("majorant ODE y' = C y² − κ'' y³ (decoupled)"), [2, 3]);
  assert.deepEqual(odeShape("(∀ x ∈ Set.Ico 0 T, y' x ≤ C - kappa cz * y x ^ 2) →"), [0, 2]);
});

describe("full-coverage audit", () => {
  const TEX = String.raw`\title{On gaps}
\begin{document}
We define $g$ in \lean{gap}. The bound \[ g \ge 2 \] holds.
Every gap satisfies $g\ge 2$ (\lean{gap_ge_two}). The rate $M'\le CM^2$ is an open assumption.
This repository has 3 theorems across 2 modules and builds in 9 jobs. Zero \lean{sorry} remain.
Nothing mathematical here. A broken ref \lean{nope} is reported.
% lean: gap_ge_two
A mapped claim $x=y$ via comment.
\begin{tabular}{ll} a & $b$ \\ c & d \end{tabular}
\caption{Gap $g$.}
\begin{theorem}Gaps exist.\end{theorem}
\end{document}`;
  const OUT = [
    "PH_MOD\tDemo.A\t2\t5",
    "PH_MOD\tDemo.B\t1\t2",
    "PH_REF\tgap\tDemo.gap\tdef\t",
    "PH_REF\tgap_ge_two\tDemo.gap_ge_two\ttheorem\tpropext,Quot.sound",
    "PH_MISSING\tnope",
  ].join("\n");
  const facts = parseLeanFacts(OUT, "Build completed successfully (9 jobs).");
  test("sentences keep displays and skip abbreviations", () => {
    assert.deepEqual(sentences("A, e.g. B. C \\[x.\\] D. E"), ["A, e.g. B.", "C \\[x.\\] D.", "E"]);
  });
  test("build claims parsed", () => {
    assert.deepEqual(buildClaims("\\textbf{437 theorems across 17 modules}, 2704 jobs"), [
      { what: "theorems", claimed: 437 }, { what: "modules", claimed: 17 }, { what: "jobs", claimed: 2704 }]);
  });
  test("every unit classified, nothing silent passes", () => {
    const r = audit(TEX, facts);
    assert.equal(r.coverage, 1);
    const by = (re: RegExp) => r.units.find((u) => re.test(u.text))!;
    assert.equal(by(/We define/).status, "verified");
    assert.equal(by(/^\\\[/).status, "silent"); // display inherits no refs from its sentence
    assert.equal(by(/Every gap satisfies/).status, "verified");
    assert.equal(by(/open assumption/).status, "open");
    assert.equal(by(/3 theorems/).status, "build-ok");
    assert.equal(by(/Zero/).status, "verified-audit");
    assert.equal(by(/Nothing mathematical/).status, "non-claim");
    assert.equal(by(/nope/).status, "broken");
    assert.equal(by(/mapped claim/).status, "verified");
    assert.equal(by(/a & \$b\$/).status, "silent");
    assert.equal(by(/^Gap/).kind, "caption");
    assert.equal(by(/Gaps exist/).status, "silent");
    assert.equal(r.verdict, "FAIL");
  });
  test("build mismatch and non-standard axioms fail", () => {
    const f2 = parseLeanFacts(OUT.replace("Quot.sound", "sorryAx"), "Build completed successfully (8 jobs).");
    const r = audit(TEX, f2);
    assert.equal(r.units.find((u) => /3 theorems/.test(u.text))!.status, "build-mismatch");
    assert.equal(r.units.find((u) => /Every gap/.test(u.text))!.status, "broken");
  });
  test("map entries can mark open or attach Lean names", () => {
    const u = extractUnits(TEX).units.find((x) => /Gaps exist/.test(x.text))!;
    assert.equal(audit(TEX, facts, { [u.id]: { lean: ["gap_ge_two"] } }).units.find((x) => x.id === u.id)!.status, "verified");
    assert.equal(audit(TEX, facts, { [u.id]: { open: "conjecture" } }).units.find((x) => x.id === u.id)!.status, "open");
  });
  test("lean script resolves refs and counts", () => {
    const s = leanScript("Demo", "Demo", ["gap", "x.lean"]);
    assert.match(s, /^import Demo/);
    assert.match(s, /\["gap"\]/);
    assert.match(s, /collectAxioms/);
  });
});
