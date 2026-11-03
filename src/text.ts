/** Light suffix stemmer (same rules as @recurring-alignment/core). */
export function stem(w: string): string {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("es") && !w.endsWith("ses")) return w.slice(0, -1);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

const STOP = new Set(
  "a an the and or but if of to in on for with at by is are be it this that as so all every any some there then let such its we one has have holds hold no not".split(
    " ",
  ),
);

/** Normalise LaTeX math into a Lean-ish plain form: \le→≤, \{0,2\}→{0,2}, H_1→H1, \cref{x:y}→x y. */
export function normalizeMath(s: string): string {
  return s
    .replace(
      /\\cref\{([^}]*)\}|\\ref\{([^}]*)\}/g,
      (_m, a: string | undefined, b: string | undefined) => ` ${(a ?? b ?? "").replace(/[:_-]/g, " ")} `,
    )
    .replace(/\\leq?(?![a-zA-Z])/g, "≤")
    .replace(/\\geq?(?![a-zA-Z])/g, "≥")
    .replace(/\\neq?(?![a-zA-Z])/g, "≠")
    .replace(/\\wedge(?![a-zA-Z])/g, "∧")
    .replace(/\\vee(?![a-zA-Z])/g, "∨")
    .replace(/\\bmod(?![a-zA-Z])/g, "%")
    .replace(/\\in(?![a-zA-Z])/g, "∈")
    .replace(/\\\{/g, "⟪")
    .replace(/\\\}/g, "⟫")
    .replace(/\\[a-zA-Z]+\*?/g, (m) => ` ${m.slice(1)} `)
    .replace(/[{}$]/g, " ")
    .replace(/_/g, "")
    .replace(/⟪/g, "{")
    .replace(/⟫/g, "}")
    .replace(/\[(\d+),(\d+)\]/g, " $1 $2 ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Identifier-aware tokens: splits camelCase, snake_case and digit runs; keeps digits. */
export function tokens(s: string): string[] {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !STOP.has(w) && (w.length > 1 || /\d/.test(w)))
    .map(stem);
}

export const tokenSet = (s: string) => new Set(tokens(s));

export function dice(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return (2 * n) / (a.size + b.size);
}

/** Normalised finite set literals such as {0,2,6}, sorted, as "0,2,6". */
export function setLiterals(s: string): string[] {
  return [...s.matchAll(/\{\s*(\d+(?:\s*,\s*\d+)+)\s*\}/g)].map((m) =>
    m[1]!
      .split(",")
      .map((x) => Number(x.trim()))
      .sort((a, b) => a - b)
      .join(","),
  );
}

/** Lower bounds on single-letter variables: "n ≥ 2", "1 ≤ n", "n > 1". */
export function lowerBounds(s: string): Map<string, number> {
  const out = new Map<string, number>();
  const put = (v: string, n: number) => out.set(v, Math.max(out.get(v) ?? -Infinity, n));
  for (const m of s.matchAll(/(?<![\w.])([a-z])\s*(≥|>)\s*(\d+)/g))
    put(m[1]!, Number(m[3]) + (m[2] === ">" ? 1 : 0));
  for (const m of s.matchAll(/(\d+)\s*(≤|<)\s*([a-z])(?![\w.])/g))
    put(m[3]!, Number(m[1]) + (m[2] === "<" ? 1 : 0));
  return out;
}

export function clip(s: string, n = 200): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
