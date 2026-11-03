import { createInterface } from "node:readline";
import type { Readable, Writable } from "node:stream";
import type { Anchor, Clarification, Mismatch, Verdict } from "./types.js";

export function parseVerdict(answer: string): Verdict {
  const a = answer.trim().toLowerCase();
  if (/^(y|yes|intentional|intended|ok)\b/.test(a)) return "intentional";
  if (/^(n|no|unintended|bug|mistake|wrong)\b/.test(a)) return "unintended";
  return "other";
}

/** Record an answer. The answer text is stored verbatim; claims are never edited. */
export function record(
  anchor: Anchor,
  m: Pick<Mismatch, "id" | "claimId" | "kind" | "question">,
  answer: string,
  verdict?: Verdict,
): Clarification {
  const c: Clarification = {
    claimId: m.claimId,
    kind: m.kind,
    question: m.question,
    answer: answer.trim(),
    verdict: verdict ?? parseVerdict(answer),
    answeredAt: new Date().toISOString(),
  };
  anchor.clarifications[m.id] = c;
  return c;
}

/** Ask each pending question on a terminal. Blank answer leaves it open. Returns number answered. */
export async function askInteractive(
  anchor: Anchor,
  pending: Mismatch[],
  input: Readable,
  output: Writable,
): Promise<number> {
  const rl = createInterface({ input, terminal: false });
  const lines = rl[Symbol.asyncIterator]();
  let n = 0;
  try {
    for (const [i, m] of pending.entries()) {
      output.write(
        `\n[${i + 1}/${pending.length}] ${m.kind.toUpperCase()} · ${m.id}\n${m.question}\n`,
      );
      output.write(
        "answer (yes=intentional / no=unintended / free text; blank=skip): ",
      );
      const next = await lines.next();
      if (next.done) break;
      const a: string = next.value;
      if (!a.trim()) continue;
      record(anchor, m, a);
      n++;
    }
  } finally {
    rl.close();
  }
  return n;
}

export interface PendingFile {
  tool: "pipelinehalt";
  anchor: string;
  instructions: string;
  questions: {
    id: string;
    claimId: string;
    kind: string;
    question: string;
    answer: string;
  }[];
}

export function pendingFile(
  anchorPath: string,
  pending: Mismatch[],
): PendingFile {
  return {
    tool: "pipelinehalt",
    anchor: anchorPath,
    instructions:
      "Fill in `answer` for each question (start with yes/intentional or no/unintended, optionally followed by an explanation), then run `pipelinehalt answer --anchor <anchor> --from <this file>`. Blank answers stay open.",
    questions: pending.map((m) => ({
      id: m.id,
      claimId: m.claimId,
      kind: m.kind,
      question: m.question,
      answer: "",
    })),
  };
}
