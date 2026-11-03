import type { Report } from "./types.js";

const KIND: Record<string, string> = {
  silent: "SILENT",
  narrower: "NARROWER",
  conditional: "CONDITIONAL",
  ambiguous: "AMBIGUOUS",
};

export function toJson(r: Report): string {
  return JSON.stringify(r, null, 2) + "\n";
}

/** Markdown report: drift scores per claim, each difference with its status, and realignment notes. */
export function toMarkdown(r: Report): string {
  const L: string[] = [];
  L.push(`# PipelineHalt report${r.anchorTitle ? `: ${r.anchorTitle}` : ""}`, "");
  L.push(
    `Status: **${r.status.toUpperCase()}** · overall drift **${r.drift.toFixed(3)}** · ${r.claims.length} claims · ${r.declarationsScanned} Lean declarations scanned · ${r.pending.length} open question(s)`,
    "",
  );
  L.push(
    "> PipelineHalt surfaces syntactic differences between paper claims and Lean statements and asks about them. Matching is heuristic. It does not decide what the author meant; recorded answers are the author's.",
    "",
  );
  L.push("| Claim | Matched Lean | Drift | Open | Answered |", "|---|---|---|---|---|");
  for (const c of r.claims) {
    const open = c.mismatches.filter((m) => !m.clarification).length;
    const ans = c.mismatches.length - open;
    const lean = c.matched.map((m) => `\`${m.name}\`${m.explicit ? "" : ` (${m.score})`}`).join(", ") || "—";
    L.push(`| ${c.claim.number ?? c.claim.id} | ${lean} | ${c.drift.toFixed(3)} | ${open} | ${ans} |`);
  }
  L.push("");
  for (const c of r.claims) {
    if (!c.mismatches.length) continue;
    L.push(`## ${c.claim.number ?? c.claim.id}${c.claim.title ? ` — ${c.claim.title}` : ""}`, "");
    for (const m of c.mismatches) {
      const st = m.clarification
        ? `answered (${m.clarification.verdict}): “${m.clarification.answer}”`
        : "**OPEN**";
      L.push(`- \`${m.id}\` ${KIND[m.kind]}: ${m.detail} — ${st}`);
    }
    L.push("");
  }
  L.push("## Realignment notes", "");
  const notes: string[] = [];
  for (const c of r.claims)
    for (const m of c.mismatches) {
      const who = `${c.claim.number ?? c.claim.id}`;
      if (!m.clarification) notes.push(`- ${who}: answer \`${m.id}\` — ${m.question}`);
      else if (m.clarification.verdict === "unintended")
        notes.push(
          `- ${who}: author marked \`${m.id}\` as unintended. Fix the Lean statement or the paper by hand (PipelineHalt does not auto-correct).`,
        );
      else if (m.clarification.verdict === "intentional" && m.kind !== "ambiguous")
        notes.push(
          `- ${who}: difference \`${m.id}\` is intentional per the author; consider stating it in the paper text so readers see it too.`,
        );
    }
  if (r.unanchored.length)
    notes.push(
      ...r.unanchored.map(
        (u) =>
          `- Lean \`${u.name}\` cites “${u.cites}” in its docstring but is not matched to any anchor claim (informational).`,
      ),
    );
  L.push(...(notes.length ? notes : ["- None. All recorded differences are answered as intentional."]), "");
  return L.join("\n");
}

/** One line per open question in GitHub Actions annotation format. */
export function toAnnotations(r: Report): string {
  return r.pending
    .map(
      (m) =>
        `::warning title=PipelineHalt ${m.kind} (${m.claimId})::${m.question.replace(/\n/g, " ")} [id ${m.id}]`,
    )
    .join("\n");
}
