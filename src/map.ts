import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import type { Anchor } from "./types.js";

/** Conventional file name, looked up beside the anchor and then in each parent up to the repo root. */
export const MAP_FILE = "pipelinehalt.map.json";

/**
 * Hand-written claim → Lean mapping, kept separate from the anchor's claims.
 * It is human-authored. It tells the matcher where to look; it does not validate meaning.
 */
export interface ClaimMap {
  version?: 1;
  claims: Record<string, { lean: string[]; aliases?: string[]; note?: string }>;
  /** Lean declarations deliberately left unmapped (name → reason). Suppresses the informational "cites X but is not matched" line. */
  unclaimed?: Record<string, string>;
  note?: string;
}

export function parseMap(text: string, path = MAP_FILE): ClaimMap {
  const m = JSON.parse(text) as ClaimMap;
  if (!m || typeof m.claims !== "object")
    throw new Error(`${path}: mapping file needs a "claims" object`);
  for (const [id, e] of Object.entries(m.claims))
    if (!Array.isArray(e?.lean) || !e.lean.every((x) => typeof x === "string"))
      throw new Error(
        `${path}: claims["${id}"].lean must be an array of Lean declaration names`,
      );
  return m;
}

export function loadMap(path: string): ClaimMap {
  return parseMap(readFileSync(path, "utf8"), path);
}

/** Beside the anchor, then parent directories up to (and including) the first one containing .git. */
export function discoverMap(anchorPath: string): string | undefined {
  let dir = dirname(resolve(anchorPath));
  for (;;) {
    const p = join(dir, MAP_FILE);
    if (existsSync(p)) return p;
    if (existsSync(join(dir, ".git"))) return undefined;
    const up = dirname(dir);
    if (up === dir) return undefined;
    dir = up;
  }
}

/** Apply a map to an anchor (returns a copy). Map entries override any `lean` list in the anchor. Returns warnings for ids the anchor does not have. */
export function applyMap(
  anchor: Anchor,
  map: ClaimMap,
): { anchor: Anchor; warnings: string[] } {
  const ids = new Set(anchor.claims.map((c) => c.id));
  const warnings = Object.keys(map.claims)
    .filter((id) => !ids.has(id))
    .map(
      (id) => `mapping file names claim "${id}", which is not in the anchor`,
    );
  return {
    anchor: {
      ...anchor,
      claims: anchor.claims.map((c) => {
        const e = map.claims[c.id];
        return e
          ? {
              ...c,
              lean: [...e.lean],
              aliases: e.aliases ? [...e.aliases] : c.aliases,
            }
          : c;
      }),
      unclaimed: { ...(anchor.unclaimed ?? {}), ...(map.unclaimed ?? {}) },
    },
    warnings,
  };
}

/** Resolve which mapping file to use: explicit path, false to disable, or auto-discovery. */
export function resolveMap(
  anchor: Anchor,
  anchorPath: string | undefined,
  map: string | ClaimMap | false | undefined,
): { anchor: Anchor; mapFile?: string; warnings: string[] } {
  if (map === false) return { anchor, warnings: [] };
  if (typeof map === "object")
    return { ...applyMap(anchor, map), mapFile: "(inline)" };
  const path = map ?? (anchorPath ? discoverMap(anchorPath) : undefined);
  if (!path) return { anchor, warnings: [] };
  if (!existsSync(path)) throw new Error(`mapping file not found: ${path}`);
  return {
    ...applyMap(anchor, loadMap(path)),
    mapFile: relative(process.cwd(), path) || path,
  };
}
