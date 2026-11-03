import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Binder, LeanDecl } from "./types.js";

const DECL_RE =
  /^[ \t]*(?:@\[[^\]]*\][ \t\n]*)?(?:(?:private|protected|noncomputable|nonrec|partial|unsafe)\s+)*(theorem|lemma|def|abbrev|axiom|structure|class|instance|example|opaque|inductive)\b[ \t]*([^\s:({[⦃]*)/gm;
const SCOPE_RE = /^(namespace|section|end)\b[ \t]*([^\s]*)/gm;

/** Replace comments by spaces (preserving offsets) and collect docstrings by end offset. */
export function stripComments(src: string): { code: string; docs: { end: number; text: string }[] } {
  const out = src.split("");
  const docs: { end: number; text: string }[] = [];
  let i = 0;
  while (i < src.length) {
    if (src.startsWith("--", i)) {
      while (i < src.length && src[i] !== "\n") out[i++] = " ";
    } else if (src.startsWith("/-", i)) {
      const start = i;
      const isDoc = src.startsWith("/--", i) || src.startsWith("/-!", i);
      let depth = 0;
      do {
        if (src.startsWith("/-", i)) {
          depth++;
          i += 2;
        } else if (src.startsWith("-/", i)) {
          depth--;
          i += 2;
        } else i++;
      } while (depth > 0 && i < src.length);
      if (isDoc && src[start + 2] === "-") docs.push({ end: i, text: src.slice(start + 3, i - 2).trim() });
      for (let k = start; k < i; k++) if (out[k] !== "\n") out[k] = " ";
    } else if (src[i] === '"') {
      i++;
      while (i < src.length && src[i] !== '"') i += src[i] === "\\" ? 2 : 1;
      i++;
    } else i++;
  }
  return { code: out.join(""), docs };
}

const OPEN: Record<string, string> = { "(": ")", "{": "}", "[": "]", "⦃": "⦄" };

/** Find index of the first top-level occurrence of any token in `toks`, skipping bracketed text. */
export function topLevelIndex(s: string, toks: string[], from = 0): number {
  let depth = 0;
  for (let i = from; i < s.length; i++) {
    const c = s[i]!;
    if (c in OPEN || c === "⟨") depth++;
    else if (")}]⦄⟩".includes(c)) depth--;
    else if (depth === 0) for (const t of toks) if (s.startsWith(t, i)) return i;
  }
  return -1;
}

/** Split `s` at top-level occurrences of `sep`. */
export function splitTop(s: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let last = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    if (c in OPEN || c === "⟨") depth++;
    else if (")}]⦄⟩".includes(c)) depth--;
    else if (depth === 0 && s.startsWith(sep, i)) {
      parts.push(s.slice(last, i));
      last = i + sep.length;
    }
  }
  parts.push(s.slice(last));
  return parts.map((p) => p.trim()).filter(Boolean);
}

function parseBinders(header: string): { binders: Binder[]; rest: string } {
  const binders: Binder[] = [];
  let s = header.trimStart();
  while (s[0] && s[0] in OPEN) {
    const open = s[0] as Binder["bracket"];
    const close = OPEN[open]!;
    let depth = 0;
    let j = 0;
    for (; j < s.length; j++) {
      if (s[j] === open) depth++;
      else if (s[j] === close && --depth === 0) break;
    }
    const inner = s.slice(1, j);
    const colon = topLevelIndex(inner, [" : "]);
    if (colon >= 0) {
      binders.push({
        names: inner.slice(0, colon).trim().split(/\s+/),
        type: norm(inner.slice(colon + 3)),
        bracket: open,
      });
    } else binders.push({ names: [], type: norm(inner), bracket: open });
    s = s.slice(j + 1).trimStart();
  }
  return { binders, rest: s };
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

export function parseLean(src: string, file = "<memory>"): LeanDecl[] {
  const { code, docs } = stripComments(src);
  const starts: { idx: number; kind: string; name: string; nameEnd: number }[] = [];
  for (const m of code.matchAll(DECL_RE)) {
    starts.push({ idx: m.index!, kind: m[1]!, name: m[2] ?? "", nameEnd: m.index! + m[0].length });
  }
  const scopes = [...code.matchAll(SCOPE_RE)].map((m) => ({ idx: m.index!, kind: m[1]!, name: m[2] ?? "" }));
  const axiomNames = starts.filter((s) => s.kind === "axiom").map((s) => s.name);
  const decls: LeanDecl[] = [];
  starts.forEach((st, k) => {
    const nextDecl = starts[k + 1]?.idx ?? code.length;
    const nextScope = scopes.find((s) => s.idx > st.idx)?.idx ?? code.length;
    const end = Math.min(nextDecl, nextScope);
    const text = code.slice(st.nameEnd, end);
    // namespace prefix
    const stack: string[] = [];
    for (const s of scopes) {
      if (s.idx > st.idx) break;
      if (s.kind === "namespace") stack.push(s.name);
      else if (s.kind === "section") stack.push("");
      else stack.pop();
    }
    const assign = topLevelIndex(text, [":=", " where", "\n  |"]);
    const header = assign >= 0 ? text.slice(0, assign) : text;
    const body = assign >= 0 ? text.slice(assign) : "";
    const { binders, rest } = parseBinders(header);
    const type = rest.startsWith(":") ? norm(rest.slice(1)) : "";
    const doc = docs.find((d) => d.end <= st.idx && src.slice(d.end, st.idx).trim() === "")?.text;
    const prefix = stack.filter(Boolean).join(".");
    decls.push({
      kind: st.kind,
      name: st.name,
      fullName: prefix && st.name ? `${prefix}.${st.name}` : st.name,
      file,
      line: src.slice(0, st.idx).split("\n").length,
      doc: doc ? norm(doc) : undefined,
      binders,
      type,
      usesSorry: /\b(sorry|admit)\b/.test(body) || /\bsorry\b/.test(type),
      usesAxioms: axiomNames.filter(
        (a) => a !== st.name && new RegExp(`(^|[^\\w.])${escape(a)}([^\\w]|$)`).test(text),
      ),
    });
  });
  return decls;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Recursively collect .lean files, skipping build/vendor directories. */
export function findLeanFiles(root: string): string[] {
  if (statSync(root).isFile()) return root.endsWith(".lean") ? [root] : [];
  const out: string[] = [];
  for (const e of readdirSync(root)) {
    if (e.startsWith(".") || e === "lake-packages" || e === "build") continue;
    out.push(...findLeanFiles(join(root, e)));
  }
  return out.sort();
}

export function loadLean(paths: string[]): LeanDecl[] {
  const files = paths.flatMap(findLeanFiles);
  const decls = files.flatMap((f) => parseLean(readFileSync(f, "utf8"), f));
  // Re-resolve axiom usage project-wide (axioms may live in another file).
  const axioms = decls.filter((d) => d.kind === "axiom").map((d) => d.name);
  if (axioms.length) {
    for (const f of files) {
      const { code } = stripComments(readFileSync(f, "utf8"));
      for (const d of decls.filter((x) => x.file === f && x.kind !== "axiom")) {
        const seg = code
          .split("\n")
          .slice(d.line - 1)
          .join("\n");
        const stop = seg.slice(1).search(DECL_START_LINE);
        const text = stop >= 0 ? seg.slice(0, stop + 1) : seg;
        d.usesAxioms = axioms.filter(
          (a) => a !== d.name && new RegExp(`(^|[^\\w.])${escape(a)}([^\\w]|$)`).test(text),
        );
      }
    }
  }
  return decls;
}
const DECL_START_LINE =
  /\n[ \t]*(?:@\[|private |protected |noncomputable |theorem |lemma |def |axiom |structure |end |namespace )/;
