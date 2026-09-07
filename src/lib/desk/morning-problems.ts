/** Last-24h ops problems for the morning report. Client-safe. Relative imports only. */

export type MorningProblem = {
  id: string;
  severity: "OPEN" | "WATCH";
  title: string;
  detail: string;
};

export type MorningProblems = {
  asOf: string;
  headline: string;
  none: boolean;
  open: MorningProblem[];
  watch: MorningProblem[];
};

const CLIENT_RACE_MS = 2800;
const HUNG_MS = CLIENT_RACE_MS + 4000;

export function morningProblems(input: {
  snap?: { errors?: string[]; pullMs?: number | null; fetchedAt?: string | null } | null;
  errors?: { id?: string; at: string; msg: string; resolved: boolean; attention: boolean; verdict: string }[];
  alignment?: { fail: number; checks: { id: string; pass: boolean; label: string }[] } | null;
  sim?: { status?: string; paused?: boolean; practiceKilled?: boolean };
  now?: number;
} = {}): MorningProblems {
  const now = input.now ?? Date.now();
  const day = 86_400_000;
  const open: MorningProblem[] = [];
  const watch: MorningProblem[] = [];
  const seen = new Set<string>();
  const push = (row: MorningProblem, into: MorningProblem[]) => {
    if (seen.has(row.id)) return;
    seen.add(row.id);
    into.push(row);
  };
  const snap = input.snap ?? null;
  const pullMs = snap?.pullMs ?? null;
  const ageMs = snap?.fetchedAt ? now - Date.parse(snap.fetchedAt) : null;
  const snapErrors = snap?.errors ?? [];
  if (pullMs != null && pullMs > HUNG_MS) {
    push(
      {
        id: "pull-slow",
        severity: "OPEN",
        title: "Data pull slow",
        detail: `Last pull ${pullMs}ms (client race ${CLIENT_RACE_MS}ms). Core Coinbase must stay first.`,
      },
      open,
    );
  }
  if (ageMs != null && ageMs > 180_000 && input.sim?.status === "LIVE" && !input.sim?.paused) {
    push(
      {
        id: "tape-stale",
        severity: "OPEN",
        title: "Live tape stale while sim is LIVE",
        detail: `Snapshot age ${Math.round(ageMs / 1000)}s. Pulls must follow sim.`,
      },
      open,
    );
  }
  for (const e of snapErrors) {
    if (/coinbase/i.test(e) && !/slot timeout/i.test(e)) {
      push({ id: "coinbase-core", severity: "OPEN", title: "Coinbase last miss", detail: e }, open);
    }
  }
  for (const e of input.errors ?? []) {
    const t = Date.parse(e.at);
    if (!Number.isFinite(t) || now - t > day) continue;
    if (!e.resolved && e.attention) {
      push({ id: `open-${e.msg.slice(0, 40)}`, severity: "OPEN", title: e.msg.slice(0, 88), detail: e.verdict }, open);
    } else if (e.attention && e.resolved) {
      push({ id: `watch-${e.msg.slice(0, 40)}`, severity: "WATCH", title: e.msg.slice(0, 88), detail: e.verdict }, watch);
    }
  }
  if (input.alignment && input.alignment.fail > 0) {
    for (const c of input.alignment.checks.filter((x) => !x.pass)) {
      push({ id: c.id, severity: "OPEN", title: c.label, detail: "Alignment check failed vs mandate / legal / security." }, open);
    }
  }
  if (input.sim?.practiceKilled === false) {
    push(
      {
        id: "practice-armed",
        severity: "OPEN",
        title: "Stray practice still armed",
        detail: "Kill practice. Live-sim is the only as-live cycle. This host never places Coinbase orders.",
      },
      open,
    );
  }
  if (input.sim?.status === "LIVE" && input.sim?.paused) {
    push(
      {
        id: "sim-pull-desync",
        severity: "OPEN",
        title: "Sim LIVE but data pulls paused",
        detail: "Heal: unfreeze tape so pulls follow sim.",
      },
      open,
    );
  }
  const headline =
    open.length === 0
      ? "PROBLEMS LAST 24h — none. Sim, pulls, practice kill, and mandate rails hold."
      : `PROBLEMS LAST 24h — ${open.length} OPEN`;
  return { asOf: new Date(now).toISOString(), headline, none: open.length === 0, open, watch: watch.slice(0, 8) };
}
