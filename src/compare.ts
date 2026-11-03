import { createHash } from "node:crypto";
import type { Anchor, Claim, ClaimResult, LeanDecl, Mismatch, MismatchKind, Report } from "./types.js";
import { clip, dice, lowerBounds, normalizeMath, setLiterals, tokenSet, tokens } from "./text.js";
import { splitTop } from "./lean.js";

export const VERSION = "0.3.0";

export const WEIGHTS: Record<MismatchKind, number> = {
  silent: 1,
  narrower: 0.6,
  conditional: 0.5,
  ambiguous: 0.3,
};

const HEDGE =
  /\b(roughly|essentially|morally|basically|in some sense|should|might|probably|approximately|sort of|TODO|TBD|FIXME)\b|\?\?/i;
const PROVABLE = new Set(["theorem", "lemma", "example"]);

export interface CompareOptions {
  /** Minimum heuristic match score (0..1). Default 0.2. */
  minScore?: number;
  /** Drift above which a fully-answered run still fails in CI. Default 0.25. */
  maxDrift?: number;
}

const inPool = (c: Claim, d: LeanDecl) =>
  c.kind === "definition" || c.kind === "hypothesis" ? !PROVABLE.has(d.kind) : PROVABLE.has(d.kind);

export function mismatchId(claimId: string, kind: string, lean: string | undefined, key: string): string {
  return createHash("sha256")
    .update(`${claimId}\u0000${kind}\u0000${lean ?? ""}\u0000${key}`)
    .digest("hex")
    .slice(0, 12);
}

const label = (c: Claim) => (c.number ? `${c.number} (${c.id})` : c.id);
const declWord = (d: LeanDecl) => `Lean ${d.kind}`;

const citedNumber = (doc?: string) =>
  /\b(Theorem|Lemma|Proposition|Corollary)\s+(\d+(?:\.\d+)?)/.exec(doc ?? "");
const claimDigits = (c: Claim) => /(\d+(?:\.\d+)?)/.exec(c.number ?? "")?.[1];

/** Score a declaration against a claim. Heuristic: 0.6 x term overlap with the signature (name, binders,
 *  type) + 0.4 x overlap with the docstring, plus 0.3 if the docstring cites exactly the claim's number. */
export function score(c: Claim, d: LeanDecl): number {
  const ct = tokenSet(normalizeMath([c.title ?? "", c.statement].join(" ")));
  const sig = tokenSet([d.name, d.type, ...d.binders.map((b) => b.type)].join(" "));
  let s = 0.6 * dice(ct, sig) + 0.4 * dice(ct, tokenSet(d.doc ?? ""));
  const cited = citedNumber(d.doc);
  if (cited && c.number && cited[2] === claimDigits(c)) s += 0.3;
  return s;
}

/** Small, explicit synonym table used when checking whether a Lean hypothesis is stated in the claim. */
export const SYNONYMS: Record<string, string[]> = {
  card: ["element", "size", "cardinality", "number"],
  prime: ["primality"],
  finset: ["finite", "set"],
  admissible: ["admissibility"],
};

/** Hypotheses: explicit/implicit binders that are propositions, plus top-level premises of the type. */
export function hypotheses(d: LeanDecl): { text: string; name?: string }[] {
  const hyps: { text: string; name?: string }[] = [];
  for (const b of d.binders) {
    if (b.bracket === "[") continue; // instance arguments are not mathematical hypotheses
    const named = b.names.some((n) => /^_?h/.test(n));
    if (named || /[≤≥<>=≠∈∉∧∨¬↔]/.test(b.type)) hyps.push({ text: b.type, name: b.names.join(" ") });
  }
  let t = d.type;
  while (/^∀/.test(t) && t.includes(",")) t = t.slice(t.indexOf(",") + 1).trim();
  if (!/^[∃¬]/.test(t)) for (const p of splitTop(t, "→").slice(0, -1)) hyps.push({ text: p });
  return hyps;
}

function mk(
  c: Claim,
  kind: MismatchKind,
  lean: string | undefined,
  key: string,
  detail: string,
  question: string,
  weight = WEIGHTS[kind],
): Mismatch {
  return { id: mismatchId(c.id, kind, lean, key), claimId: c.id, kind, lean, key, detail, question, weight };
}

export function compareClaim(
  c: Claim,
  decls: LeanDecl[],
  opts: CompareOptions = {},
  titles: Map<string, string> = new Map(),
  owner?: Map<string, string>,
): ClaimResult {
  const minScore = opts.minScore ?? 0.2;
  const stmt = normalizeMath(c.statement);
  const said = `Paper claim ${label(c)} states: “${clip(c.statement)}”.`;
  const mismatches: Mismatch[] = [];
  const pool = decls.filter((d) => inPool(c, d));

  // ---- matching
  let matched: ClaimResult["matched"] = [];
  if (c.lean?.length) {
    for (const n of c.lean) {
      const d = decls.find((x) => x.name === n || x.fullName === n || x.fullName.endsWith(`.${n}`));
      if (d) matched.push({ name: d.name, score: Number(score(c, d).toFixed(3)), explicit: true });
      else
        mismatches.push(
          mk(
            c,
            "silent",
            n,
            `missing:${n}`,
            `Anchor maps this claim to \`${n}\`, but no such declaration exists.`,
            `${said} The anchor maps it to Lean declaration \`${n}\`, which was not found in the scanned files. Was it renamed or removed, or is the claim intentionally unformalized?`,
          ),
        );
    }
  } else {
    const ranked = pool.map((d) => ({ d, s: score(c, d) })).sort((a, b) => b.s - a.s);
    // a declaration is offered only to the claim it scores highest against (heuristic exclusivity)
    const mine = ranked.filter((r) => !owner || (owner.get(r.d.fullName) ?? c.id) === c.id);
    const best = ranked[0]?.s ?? 0;
    matched = mine
      .filter((r) => r.s >= minScore && r.s >= 0.6 * best)
      .slice(0, 4)
      .map((r) => ({ name: r.d.name, score: Number(r.s.toFixed(3)), explicit: false }));
    if (!matched.length) {
      const top = ranked[0];
      const cand = top
        ? ` Closest candidate: \`${top.d.name}\` (score ${top.s.toFixed(2)}${top.s < minScore ? `, below threshold ${minScore}` : `, but it matches claim ${owner?.get(top.d.fullName)} better`}).`
        : "";
      mismatches.push(
        mk(
          c,
          "silent",
          undefined,
          "no-match",
          `No Lean declaration matches this claim.${cand}`,
          `${said} No Lean declaration matching it was found among ${pool.length} candidates.${cand} Is this claim intentionally not formalized, or which declaration should it map to?`,
        ),
      );
    }
  }
  const md = matched.map((m) => decls.find((d) => d.name === m.name)!);

  // ---- paper-side ambiguity
  if (!stmt)
    mismatches.push(
      mk(
        c,
        "ambiguous",
        undefined,
        "empty",
        "Claim statement is empty.",
        `${said} The statement is empty. What exactly does the paper claim here?`,
      ),
    );
  const hedge = HEDGE.exec(c.statement);
  if (hedge)
    mismatches.push(
      mk(
        c,
        "ambiguous",
        undefined,
        `hedge:${hedge[0].toLowerCase()}`,
        `Statement contains hedged wording “${hedge[0]}”.`,
        `${said} The wording “${hedge[0]}” leaves the precise claim open. What exact statement should the Lean side be checked against?`,
      ),
    );
  if (c.title) {
    const tt = tokenSet(normalizeMath(c.title));
    const st = tokenSet(stmt);
    if (tt.size >= 3 && dice(tt, st) < 0.15)
      mismatches.push(
        mk(
          c,
          "ambiguous",
          undefined,
          "title-vs-statement",
          `Title “${c.title}” shares almost no terms with the statement.`,
          `${said} Its title is “${c.title}”, which does not appear to describe that statement. Is the title or the statement misworded?`,
        ),
      );
  }

  // ---- Lean-side checks per matched declaration
  const claimSets = setLiterals(stmt);
  const claimBounds = lowerBounds(stmt);
  const claimTok = new Set([
    ...tokens(stmt),
    ...tokens(c.title ?? ""),
    ...(c.assumptions ?? []).flatMap((a) => tokens(normalizeMath(a))),
    // titles of claims this statement cross-references (\\cref{hyp:parity} -> "Parity barrier")
    ...[...c.statement.matchAll(/\\c?ref\{([^}]*)\}/gi)].flatMap((m) => tokens(titles.get(m[1]!) ?? "")),
  ]);
  const leanSets = new Set(
    md.flatMap((d) => setLiterals(`${d.type} ${d.binders.map((b) => b.type).join(" ")}`)),
  );
  for (const s of claimSets)
    if (md.length && !leanSets.has(s))
      mismatches.push(
        mk(
          c,
          "narrower",
          md.map((d) => d.name).join(","),
          `omits-set:${s}`,
          `Claim mentions {${s}}; no matched Lean statement mentions it.`,
          `${said} The matched Lean statement(s) ${md.map((d) => `\`${d.name}\``).join(", ")} do not mention the set {${s}}. Is the omission intentional, or is it covered by a declaration the matcher missed?`,
        ),
      );

  for (const d of md) {
    const varTok = new Set(
      d.binders
        .filter((b) => !b.names.some((n) => /^_?h/.test(n)))
        .flatMap((b) => b.names.flatMap((n) => tokens(n))),
    );
    if (d.usesSorry)
      mismatches.push(
        mk(
          c,
          "conditional",
          d.name,
          "sorry",
          `\`${d.name}\` is proved with sorry/admit.`,
          `${said} ${declWord(d)} \`${d.name}\` (${d.file}:${d.line}) contains \`sorry\`, so it is not actually proved. Is the paper claim meant to be stated as established?`,
          0.8,
        ),
      );
    for (const ax of d.usesAxioms)
      mismatches.push(
        mk(
          c,
          "conditional",
          d.name,
          `axiom:${ax}`,
          `\`${d.name}\` depends on project axiom \`${ax}\`.`,
          `${said} ${declWord(d)} \`${d.name}\` depends on the project axiom \`${ax}\`, which the claim does not state. Is this extra assumption intentional?`,
          0.7,
        ),
      );
    if (/\bsorry\b/.test(d.type) || d.kind === "axiom")
      mismatches.push(
        mk(
          c,
          "conditional",
          d.name,
          "is-axiom",
          `\`${d.name}\` is postulated, not proved.`,
          `${said} \`${d.name}\` is declared as an axiom rather than proved. Is the claim meant as an assumption?`,
          0.8,
        ),
      );
    for (const h of hypotheses(d)) {
      const hb = lowerBounds(h.text);
      if (hb.size) {
        for (const [v, lo] of hb) {
          const cl = claimBounds.get(v);
          if (cl === undefined)
            mismatches.push(
              mk(
                c,
                "narrower",
                d.name,
                `bound:${v}>=${lo}`,
                `\`${d.name}\` restricts ${v} ≥ ${lo}; the claim states no such restriction.`,
                `${said} ${declWord(d)} \`${d.name}\` assumes \`${h.text}\` (restricting ${v} ≥ ${lo}), which the claim does not state. Is the restricted domain intentional?`,
              ),
            );
          else if (cl !== lo)
            mismatches.push(
              mk(
                c,
                "narrower",
                d.name,
                `bound:${v}>=${lo}vs${cl}`,
                `\`${d.name}\` uses ${v} ≥ ${lo} where the claim says ${v} ≥ ${cl}${lo > cl ? " (Lean is narrower)" : " (could be an indexing shift; direction not decidable syntactically)"}.`,
                `${said} ${declWord(d)} \`${d.name}\` assumes \`${h.text}\` (${v} ≥ ${lo}), but the claim says ${v} ≥ ${cl}. Is this an intentional indexing convention or a genuine change of domain?`,
              ),
            );
        }
        continue;
      }
      const ht = tokens(h.text).filter((t) => !/^\d+$/.test(t) && t.length > 1 && !varTok.has(t));
      if (!ht.length) continue; // a relation among the declaration's own quantified variables
      const has = (t: string) => claimTok.has(t) || (SYNONYMS[t] ?? []).some((x) => claimTok.has(x));
      const covered = ht.filter(has).length / ht.length;
      if (covered < 0.5) {
        const shown = h.name ? `${h.name} : ${h.text}` : h.text;
        mismatches.push(
          mk(
            c,
            "conditional",
            d.name,
            `hyp:${h.text}`,
            `\`${d.name}\` assumes \`${shown}\`, not stated in the claim.`,
            `${said} ${declWord(d)} \`${d.name}\` assumes \`${shown}\`, which the claim does not state. Is this extra hypothesis intentional?`,
          ),
        );
      }
    }
  }

  // numbering: a matched declaration's docstring cites a different number than the paper prints
  const num = claimDigits(c);
  const other = md
    .map((d) => ({ d, cited: citedNumber(d.doc) }))
    .find((x) => x.cited && num && x.cited[2] !== num);
  if (other)
    mismatches.push(
      mk(
        c,
        "ambiguous",
        other.d.name,
        `label:${other.cited![0]}`,
        `\`${other.d.name}\`'s docstring calls itself “${other.cited![0]}”, but the paper prints ${c.number}.`,
        `${said} ${declWord(other.d)} \`${other.d.name}\` is documented as “${other.cited![0]}”, while the paper numbers this claim ${c.number}. Which numbering should readers and tools use?`,
      ),
    );

  const drift = 1 - mismatches.reduce((p, m) => p * (1 - m.weight), 1);
  return { claim: c, matched, mismatches, drift: Number(drift.toFixed(3)) };
}

/** Compare every claim; attach recorded clarifications; compute pending questions and status. */
export function compare(anchor: Anchor, decls: LeanDecl[], opts: CompareOptions = {}): Report {
  const maxDrift = opts.maxDrift ?? 0.25;
  const titles = new Map(anchor.claims.filter((c) => c.title).map((c) => [c.id, c.title!]));
  const owner = new Map<string, string>();
  for (const d of decls) {
    let best = -1;
    for (const c of anchor.claims) {
      if (c.lean?.length || inPool(c, d) === false) continue;
      const s = score(c, d);
      if (s > best) {
        best = s;
        owner.set(d.fullName, c.id);
      }
    }
  }
  const claims = anchor.claims.map((c) => compareClaim(c, decls, opts, titles, owner));
  const ids = new Map<string, number>();
  for (const c of anchor.claims) ids.set(c.id, (ids.get(c.id) ?? 0) + 1);
  for (const [id, n] of ids)
    if (n > 1) {
      const r = claims.find((x) => x.claim.id === id)!;
      r.mismatches.push(
        mk(
          r.claim,
          "ambiguous",
          undefined,
          "duplicate-id",
          `Claim id ${id} occurs ${n} times in the anchor.`,
          `The anchor contains ${n} claims with id ${id}. Which statement is authoritative?`,
        ),
      );
    }
  const pending: Mismatch[] = [];
  for (const r of claims) {
    let keep = 1;
    for (const m of r.mismatches) {
      const cl = anchor.clarifications[m.id];
      if (cl) {
        m.clarification = cl;
        const w = cl.verdict === "intentional" ? 0 : cl.verdict === "other" ? m.weight / 2 : m.weight;
        keep *= 1 - w;
      } else {
        pending.push(m);
        keep *= 1 - m.weight;
      }
    }
    r.drift = Number((1 - keep).toFixed(3));
  }
  const unanchored = decls
    .filter((d) => PROVABLE.has(d.kind))
    .map((d) => ({ d, cited: citedNumber(d.doc) }))
    .filter((x) => x.cited && !claims.some((r) => r.matched.some((m) => m.name === x.d.name)))
    .map((x) => ({ name: x.d.name, cites: x.cited![0] }));
  const drift = claims.length
    ? Number((claims.reduce((s, r) => s + r.drift, 0) / claims.length).toFixed(3))
    : 0;
  const status = pending.length ? "halt" : drift > maxDrift ? "drift" : "aligned";
  return {
    tool: "pipelinehalt",
    version: VERSION,
    anchorTitle: anchor.title,
    generatedAt: new Date().toISOString(),
    declarationsScanned: decls.length,
    claims,
    unanchored,
    drift,
    pending,
    status,
  };
}
