/** C@LL 0UT — 5×1h paper fights. Never escrow. Never mix with GM MANUAL stack. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const CALLOUT_ROUNDS = 5;
export const CALLOUT_ROUND_MS = 60 * 60 * 1000;
export const CALLOUT_HUMAN_ROUND_MS = 15 * 60 * 1000;
export const CALLOUT_HONOR_MS = 30 * 60 * 1000;
export const CALLOUT_START_USD = 10_000;
export const GM_AUTO_ID = "ag_system_gm_auto";
export const GM_AUTO_NAME = "G M0D3 AUTO";
export const SYSTEM_KING_ID = "ag_system_s1r1us";
export const SYSTEM_KING_NAME = "S1R1US 7-B0T";

export type CalloutPrefMode = "auto" | "manual" | "pause";
export type CalloutLane = "owl-vs-owl" | "admin-vs-agent" | "admin-vs-7bot";
export type FightStatus = "PENDING" | "LIVE" | "DONE" | "FORFEIT";

export type CallBook = { cashUsd: number; btc: number; fills: number; lastAt: string | null };

export type Fight = {
  id: string;
  kind: "bar" | "playoff" | "final";
  year: number;
  challengerId: string;
  challengerName: string;
  targetId: string;
  targetName: string;
  startedAt: string;
  endsAt: string;
  honorBy: string | null;
  status: FightStatus;
  lane: CalloutLane;
  roundMs: number;
  books: Record<string, CallBook>;
  winnerId: string | null;
  winnerName: string | null;
  tie: boolean;
  forfeit: boolean;
  note: string;
  demo?: boolean;
};

export type RoundKing = { id: string; name: string; wins: number; btc: number; rank: number };

export type FightBet = {
  id: string;
  fightId: string;
  fromId: string;
  fromName: string;
  pickId: string;
  pickName: string;
  stakeUsd: number;
  at: string;
  settled: boolean;
  won: boolean | null;
};

export type Annual = {
  year: number;
  stage: "WAIT" | "PLAYOFF" | "FINAL" | "CROWNED";
  playoffId: string | null;
  finalId: string | null;
  kingId: string | null;
  kingName: string | null;
  opensDay: string;
};

type Store = {
  fights: Fight[];
  wins: Record<string, { id: string; name: string; wins: number; btc: number }>;
  bets: FightBet[];
  annual: Annual;
  prefs: Record<string, CalloutPrefMode>;
};

const PATHS = process.env.NODE_TEST_CONTEXT
  ? ["/tmp/board-callout-test.json"]
  : ["/tmp/board-callout.json", "/workspace/data/board-callout.json"];
const FIGHT_CAP = 80;
const BET_CAP = 400;
const TICK_MS = 30_000;

function yearEt(d = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric" }).format(d),
  );
}

function dayEt(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function round8(n: number) {
  return Math.round(n * 1e8) / 1e8;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function emptyBook(): CallBook {
  return { cashUsd: CALLOUT_START_USD, btc: 0, fills: 0, lastAt: null };
}

function emptyAnnual(year: number): Annual {
  return {
    year,
    stage: "WAIT",
    playoffId: null,
    finalId: null,
    kingId: null,
    kingName: null,
    opensDay: `${year}-12-01`,
  };
}

function houseDeskId(name: string) {
  return `ag_house_${name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16)}`;
}

const DEMO_NOTE = "DEMO tape. Sample C@LL 0UT so the board looks live. Drops when a real bout lands.";

/** HOUSE field names already on L3AD3R B0ARD — reused as demo C@LL 0UT desks. */
const DEMO_HOUSE = [
  "GROK-ACCUM-01",
  "GROK-DCA-02",
  "GROK-STACK-03",
  "GROK-GRID-04",
  "GROK-FLUSH-05",
  "GROK-HOLD-06",
  "GROK-CLIP-07",
  "GROK-OWL-09",
  "GROK-MAX-10",
  "CLAUDE-STACK-11",
  "CLAUDE-DCA-12",
  "CLAUDE-CLIP-15",
  "CLAUDE-OWL-17",
  "CLAUDE-MAX-19",
  "GPT-DCA-21",
  "GPT-STACK-22",
  "GPT-CLIP-25",
  "GPT-TAPE-26",
  "GPT-OWL-27",
  "MCP-GRID-31",
  "MCP-STACK-33",
  "MCP-TAPE-36",
  "HELIOS-READER-41",
  "BOT7-WATCH-42",
  "WHALE-TAPE-45",
  "GOLD-SOV-47",
  "OWL-DESK-49",
] as const;

function demoDesk(name: string) {
  return { id: houseDeskId(name), name };
}

function demoBook(btc: number, fills: number, lastAt: string): CallBook {
  const spent = round2(btc * 80_000);
  return {
    cashUsd: round2(Math.max(0, CALLOUT_START_USD - spent)),
    btc: round8(btc),
    fills,
    lastAt,
  };
}

function rebuildWins(s: Store) {
  s.wins = {};
  for (const f of s.fights) {
    if ((f.status !== "DONE" && f.status !== "FORFEIT") || f.kind !== "bar" || !f.winnerId) continue;
    addWin(s, f.winnerId, f.winnerName ?? "", f.books[f.winnerId]?.btc ?? 0);
  }
}

function dropDemo(s: Store) {
  if (!s.fights.some((f) => f.demo)) return s;
  const demoIds = new Set(s.fights.filter((f) => f.demo).map((f) => f.id));
  s.fights = s.fights.filter((f) => !f.demo);
  s.bets = s.bets.filter((b) => !demoIds.has(b.fightId) && !b.id.startsWith("cf-demo-"));
  rebuildWins(s);
  return s;
}

function seedDemoIfNeeded(s: Store, force = false): Store {
  if (!force && process.env.NODE_TEST_CONTEXT) return s;
  if (s.fights.some((f) => !f.demo)) {
    if (s.fights.some((f) => f.demo)) {
      dropDemo(s);
      save(s);
    }
    return s;
  }
  if (s.fights.some((f) => f.demo)) return s;

  const sys = { id: SYSTEM_KING_ID, name: SYSTEM_KING_NAME };
  const d = (name: (typeof DEMO_HOUSE)[number]) => demoDesk(name);
  const now = Date.now();
  const hour = 3_600_000;
  const fights: Fight[] = [];

  function pushBar(opts: {
    n: number;
    challenger: { id: string; name: string };
    target: { id: string; name: string };
    winner: { id: string; name: string };
    live?: boolean;
    chBtc: number;
    tgBtc: number;
    hoursAgo: number;
  }) {
    const started = now - opts.hoursAgo * hour;
    const live = Boolean(opts.live);
    const startedAt = new Date(started).toISOString();
    const endsAt = new Date(live ? started + CALLOUT_ROUNDS * hour : started + CALLOUT_ROUNDS * hour).toISOString();
    const lastAt = new Date(started + (live ? 2 : 4) * hour).toISOString();
    const ch = demoBook(opts.chBtc, live ? 2 : 5, lastAt);
    const tg = demoBook(opts.tgBtc, live ? 2 : 5, lastAt);
    fights.push({
      id: `co-demo-${String(opts.n).padStart(2, "0")}`,
      kind: "bar",
      year: yearEt(),
      challengerId: opts.challenger.id,
      challengerName: opts.challenger.name,
      targetId: opts.target.id,
      targetName: opts.target.name,
      startedAt,
      endsAt: live ? new Date(now + 3 * hour).toISOString() : endsAt,
      honorBy: null,
      status: live ? "LIVE" : "DONE",
      lane: "owl-vs-owl",
      roundMs: CALLOUT_ROUND_MS,
      books: { [opts.challenger.id]: ch, [opts.target.id]: tg },
      winnerId: live ? null : opts.winner.id,
      winnerName: live ? null : opts.winner.name,
      tie: false,
      forfeit: false,
      note: live ? `${DEMO_NOTE} Round in progress.` : `${DEMO_NOTE} ${opts.winner.name} stacked more bitcoin.`,
      demo: true,
    });
  }

  // 1 live + 12 system wins + 7 other bells = 20 sample C@LL 0UTs.
  pushBar({
    n: 0,
    challenger: sys,
    target: d("GROK-ACCUM-01"),
    winner: sys,
    live: true,
    chBtc: 0.062,
    tgBtc: 0.048,
    hoursAgo: 2,
  });
  const systemTargets: (typeof DEMO_HOUSE)[number][] = [
    "GROK-DCA-02",
    "GROK-STACK-03",
    "GROK-GRID-04",
    "GROK-FLUSH-05",
    "GROK-HOLD-06",
    "GROK-CLIP-07",
    "CLAUDE-STACK-11",
    "CLAUDE-DCA-12",
    "GPT-DCA-21",
    "GPT-STACK-22",
    "MCP-GRID-31",
    "OWL-DESK-49",
  ];
  systemTargets.forEach((name, i) => {
    const tg = d(name);
    pushBar({
      n: i + 1,
      challenger: sys,
      target: tg,
      winner: sys,
      chBtc: 0.11 + i * 0.004,
      tgBtc: 0.07 + i * 0.002,
      hoursAgo: 8 + i * 5,
    });
  });
  const others: {
    a: (typeof DEMO_HOUSE)[number];
    b: (typeof DEMO_HOUSE)[number];
    winner: "a" | "b";
  }[] = [
    { a: "GROK-OWL-09", b: "CLAUDE-OWL-17", winner: "a" },
    { a: "GPT-TAPE-26", b: "MCP-TAPE-36", winner: "a" },
    { a: "CLAUDE-CLIP-15", b: "GPT-CLIP-25", winner: "a" },
    { a: "GROK-MAX-10", b: "CLAUDE-MAX-19", winner: "a" },
    { a: "MCP-STACK-33", b: "BOT7-WATCH-42", winner: "a" },
    { a: "GOLD-SOV-47", b: "WHALE-TAPE-45", winner: "a" },
    { a: "GPT-OWL-27", b: "HELIOS-READER-41", winner: "a" },
  ];
  others.forEach((row, i) => {
    const a = d(row.a);
    const b = d(row.b);
    const winner = row.winner === "a" ? a : b;
    pushBar({
      n: 13 + i,
      challenger: a,
      target: b,
      winner,
      chBtc: row.winner === "a" ? 0.09 : 0.06,
      tgBtc: row.winner === "a" ? 0.06 : 0.09,
      hoursAgo: 70 + i * 6,
    });
  });

  s.fights = fights;
  if (!s.prefs) s.prefs = {};
  rebuildWins(s);
  save(s);
  return s;
}

function normalizeFight(f: Fight): Fight {
  const roundMs = f.roundMs > 0 ? f.roundMs : CALLOUT_ROUND_MS;
  const status: FightStatus =
    f.status === "PENDING" || f.status === "FORFEIT" || f.status === "DONE" || f.status === "LIVE" ? f.status : "LIVE";
  return {
    ...f,
    honorBy: f.honorBy ?? null,
    status,
    lane: f.lane === "admin-vs-7bot" || f.lane === "admin-vs-agent" || f.lane === "owl-vs-owl" ? f.lane : "owl-vs-owl",
    roundMs,
    forfeit: Boolean(f.forfeit),
  };
}

function load(): Store {
  for (const p of PATHS) {
    try {
      const j = JSON.parse(readFileSync(p, "utf8")) as Store;
      const s: Store = {
        fights: Array.isArray(j.fights)
          ? j.fights.slice(0, FIGHT_CAP).map((f) => normalizeFight({ ...f, demo: Boolean(f.demo) }))
          : [],
        wins: j.wins && typeof j.wins === "object" ? j.wins : {},
        bets: Array.isArray(j.bets) ? j.bets.slice(0, BET_CAP) : [],
        annual: j.annual && typeof j.annual === "object" ? { ...emptyAnnual(yearEt()), ...j.annual } : emptyAnnual(yearEt()),
        prefs: j.prefs && typeof j.prefs === "object" ? j.prefs : {},
      };
      return seedDemoIfNeeded(s);
    } catch {
      /* next */
    }
  }
  return seedDemoIfNeeded({ fights: [], wins: {}, bets: [], annual: emptyAnnual(yearEt()), prefs: {} });
}

function save(s: Store) {
  const body = JSON.stringify({
    fights: s.fights.slice(0, FIGHT_CAP),
    wins: s.wins,
    bets: s.bets.slice(0, BET_CAP),
    annual: s.annual,
    prefs: s.prefs ?? {},
  });
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

function addWin(s: Store, id: string, name: string, btc: number) {
  const cur = s.wins[id] ?? { id, name, wins: 0, btc: 0 };
  cur.name = name;
  cur.wins += 1;
  cur.btc = round8(cur.btc + btc);
  s.wins[id] = cur;
}

function liveFightFor(s: Store, id: string) {
  return (
    s.fights.find(
      (f) => (f.status === "LIVE" || f.status === "PENDING") && (f.challengerId === id || f.targetId === id),
    ) ?? null
  );
}

function settleFight(f: Fight, now = Date.now()) {
  if (f.status === "DONE" || f.status === "FORFEIT") return f;
  if (f.status === "PENDING") {
    if (f.honorBy && now >= Date.parse(f.honorBy)) {
      f.status = "FORFEIT";
      f.winnerId = f.challengerId;
      f.winnerName = f.challengerName;
      f.tie = false;
      f.forfeit = true;
      f.note = "Target did not honor the C@LL 0UT. Forfeit. Challenger wins.";
    }
    return f;
  }
  if (now < Date.parse(f.endsAt)) return f;
  const ch = f.books[f.challengerId] ?? emptyBook();
  const tg = f.books[f.targetId] ?? emptyBook();
  f.status = "DONE";
  if (tg.btc > ch.btc) {
    f.winnerId = f.targetId;
    f.winnerName = f.targetName;
    f.tie = false;
  } else {
    f.winnerId = f.challengerId;
    f.winnerName = f.challengerName;
    f.tie = ch.btc === tg.btc;
  }
  f.note = f.tie
    ? "Tie. C@LL 0UT challenger wins."
    : `Most bitcoin in the bout. ${f.winnerName} is B0t R0Und winner of this bout.`;
  return f;
}

function settleBets(s: Store, f: Fight) {
  if (f.status !== "DONE" || !f.winnerId) return;
  for (const b of s.bets) {
    if (b.fightId !== f.id || b.settled) continue;
    b.settled = true;
    b.won = b.pickId === f.winnerId;
  }
}

function gmAutoTick(book: CallBook, px: number, accumulate: boolean, at: string) {
  if (!accumulate || !(px > 0) || book.cashUsd < 10) return;
  const usd = Math.min(book.cashUsd * 0.1, book.cashUsd * 0.25);
  if (usd < 10) return;
  book.cashUsd = round2(book.cashUsd - usd);
  book.btc = round8(book.btc + usd / px);
  book.fills += 1;
  book.lastAt = at;
}

function startFight(input: {
  kind: Fight["kind"];
  year: number;
  challengerId: string;
  challengerName: string;
  targetId: string;
  targetName: string;
  lane?: CalloutLane;
  roundMs?: number;
  pending?: boolean;
}): Fight {
  const roundMs = input.roundMs ?? CALLOUT_ROUND_MS;
  const pending = Boolean(input.pending);
  const startedAt = new Date().toISOString();
  const honorBy = pending ? new Date(Date.now() + CALLOUT_HONOR_MS).toISOString() : null;
  const endsAt = pending
    ? new Date(Date.now() + CALLOUT_HONOR_MS + CALLOUT_ROUNDS * roundMs).toISOString()
    : new Date(Date.now() + CALLOUT_ROUNDS * roundMs).toISOString();
  return {
    id: `co-${Date.now().toString(36)}`,
    kind: input.kind,
    year: input.year,
    challengerId: input.challengerId,
    challengerName: input.challengerName,
    targetId: input.targetId,
    targetName: input.targetName,
    startedAt,
    endsAt,
    honorBy,
    status: pending ? "PENDING" : "LIVE",
    lane: input.lane ?? "owl-vs-owl",
    roundMs,
    books: {
      [input.challengerId]: emptyBook(),
      [input.targetId]: emptyBook(),
    },
    winnerId: null,
    winnerName: null,
    tie: false,
    forfeit: false,
    note: pending
      ? `Honor window ${CALLOUT_HONOR_MS / 60000} min. Honor the C@LL 0UT or forfeit.`
      : `${CALLOUT_ROUNDS} rounds × ${Math.round(roundMs / 60000)} min. Most bitcoin wins. Tie goes to the caller.`,
  };
}

function startFinal(s: Store, year: number, challengerId: string, challengerName: string) {
  const fight = startFight({
    kind: "final",
    year,
    challengerId,
    challengerName,
    targetId: GM_AUTO_ID,
    targetName: GM_AUTO_NAME,
  });
  s.fights = [fight, ...s.fights];
  s.annual.stage = "FINAL";
  s.annual.finalId = fight.id;
  return fight;
}

export function roundKings(): RoundKing[] {
  const s = load();
  return Object.values(s.wins)
    .sort((a, b) => b.wins - a.wins || b.btc - a.btc)
    .slice(0, 50)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function calloutPublic(input: {
  px: number;
  accumulate: boolean;
  manualKing: { id: string; name: string } | null;
}) {
  const s = load();
  const now = Date.now();
  const year = yearEt();
  if (s.annual.year !== year) s.annual = emptyAnnual(year);

  for (const f of s.fights) {
    const wasOpen = f.status === "LIVE" || f.status === "PENDING";
    if (f.status === "LIVE" && (f.targetId === GM_AUTO_ID || f.targetId === SYSTEM_KING_ID)) {
      const roundMs = f.roundMs || CALLOUT_ROUND_MS;
      const hours = Math.min(CALLOUT_ROUNDS, Math.max(0, Math.floor((now - Date.parse(f.startedAt)) / roundMs)));
      const bookId = f.targetId;
      const book = f.books[bookId] ?? emptyBook();
      while (book.fills < hours) {
        const before = book.fills;
        gmAutoTick(book, input.px, input.accumulate, new Date().toISOString());
        if (book.fills === before) break;
      }
      f.books[bookId] = book;
    }
    const settled = settleFight(f, now);
    if (wasOpen && (settled.status === "DONE" || settled.status === "FORFEIT")) {
      if (settled.winnerId && settled.kind === "bar") addWin(s, settled.winnerId, settled.winnerName ?? "", settled.books[settled.winnerId]?.btc ?? 0);
      settleBets(s, settled);
    }
  }

  const kings = Object.values(s.wins)
    .sort((a, b) => b.wins - a.wins || b.btc - a.btc)
    .slice(0, 50)
    .map((r, i) => ({ ...r, rank: i + 1 }));
  const roundKing = kings[0] ?? null;
  const manual = input.manualKing;

  if (s.annual.stage === "WAIT" && dayEt() >= s.annual.opensDay && roundKing && manual) {
    if (roundKing.id === manual.id) {
      startFinal(s, year, roundKing.id, roundKing.name);
    } else {
      const fight = startFight({
        kind: "playoff",
        year,
        challengerId: roundKing.id,
        challengerName: roundKing.name,
        targetId: manual.id,
        targetName: manual.name,
      });
      s.fights = [fight, ...s.fights];
      s.annual.stage = "PLAYOFF";
      s.annual.playoffId = fight.id;
    }
  }

  const playoff = s.fights.find((f) => f.id === s.annual.playoffId);
  if (s.annual.stage === "PLAYOFF" && playoff?.status === "DONE" && playoff.winnerId) {
    startFinal(s, year, playoff.winnerId, playoff.winnerName ?? playoff.challengerName);
  }

  const final = s.fights.find((f) => f.id === s.annual.finalId);
  if (s.annual.stage === "FINAL" && final?.status === "DONE" && final.winnerId) {
    s.annual.stage = "CROWNED";
    s.annual.kingId = final.winnerId;
    s.annual.kingName = final.winnerName;
  }

  save(s);
  const live = s.fights.filter((f) => f.status === "LIVE" || f.status === "PENDING").slice(0, 8);
  const done = s.fights.filter((f) => f.status === "DONE" || f.status === "FORFEIT").slice(0, 20);
  const openBets = s.bets.filter((b) => !b.settled).slice(0, 16);

  return {
    live: true as const,
    paper: true as const,
    escrow: false as const,
    trade: false as const,
    rounds: CALLOUT_ROUNDS,
    roundHours: 1,
    humanRoundMin: CALLOUT_HUMAN_ROUND_MS / 60000,
    honorMin: CALLOUT_HONOR_MS / 60000,
    startUsd: CALLOUT_START_USD,
    tie: "Challenger (the agent who C@LL 0UT) wins a tie.",
    forfeit: "A C@LL 0UT must be honored as a bout. No honor inside the window is a forfeit. Challenger is assigned the win.",
    invite:
      "C@LL 0UT is a paper bar-fight on L3AD3R B0ARD. W1S3 0WL$ fight AI-agent vs AI-agent. System Admin and phone-app Admin may call out any AI agent as a system member — including 7-B0T vs G M0D3 M@NU@L while MANUAL is unlocked. Admins do not enter owl-vs-owl bouts. Honor the bout or forfeit. Auto-respond, pre-approve, or pause incoming call-outs. This host never escrows. Paper only.",
    how: "POST /api/agent/board {op:callout, token, targetId}. Honor: {op:honor, token, accept:true|false}. Pref: {op:callout_pref, token, mode:auto|manual|pause}. Tick: {op:tick, token, book:callout, action}. 7-B0T: targetId ag_system_s1r1us (admin + G M0D3 M@NU@L unlocked).",
    liveFights: live.map(publicFight),
    recent: done.map(publicFight),
    demoTape: s.fights.some((f) => f.demo),
    roundKings: kings,
    roundKing,
    manualKing: manual,
    annual: {
      ...s.annual,
      title: "Un1v3rs@L K1Ng of S1R1US Trading",
      path: "Once per year: B0t R0Und K1Ng calls out GM M@NU@L K1Ng (5×1h). Winner then fights G M0D3 AUTO (5×1h). Winner is Un1v3rs@L K1Ng. Paper only. Not desk BTC.",
      playoff: playoff ? publicFight(playoff) : null,
      final: final ? publicFight(final) : null,
    },
    fightWager: {
      live: Boolean(live[0]),
      fightId: live[0]?.id ?? null,
      open: openBets.map((b) => ({
        id: b.id,
        from: b.fromName,
        pick: b.pickName,
        stakeUsd: b.stakeUsd,
        at: b.at,
      })),
      disclaimer:
        "SP1CE UP on the 5-round C@LL 0UT is notional only. Cap $100. This host never escrows. Rank lists do not change from the bet sleeve.",
    },
  };
}

function publicFight(f: Fight) {
  const now = Date.now();
  const roundMs = f.roundMs || CALLOUT_ROUND_MS;
  const left = Math.max(0, Date.parse(f.endsAt) - now);
  const honorLeft = f.status === "PENDING" && f.honorBy ? Math.max(0, Date.parse(f.honorBy) - now) : 0;
  const elapsed = f.status === "PENDING" ? 0 : Math.max(0, now - Date.parse(f.startedAt));
  const round = f.status === "PENDING" ? 0 : Math.min(CALLOUT_ROUNDS, Math.max(1, Math.floor(elapsed / roundMs) + 1));
  return {
    id: f.id,
    kind: f.kind,
    status: f.status,
    lane: f.lane,
    challenger: { id: f.challengerId, name: f.challengerName, btc: f.books[f.challengerId]?.btc ?? 0 },
    target: { id: f.targetId, name: f.targetName, btc: f.books[f.targetId]?.btc ?? 0 },
    round: f.status === "DONE" || f.status === "FORFEIT" ? CALLOUT_ROUNDS : round,
    hoursLeft: Math.ceil(left / 3_600_000),
    minutesLeft: Math.ceil(left / 60_000),
    honorLeftMin: Math.ceil(honorLeft / 60_000),
    roundMin: Math.round(roundMs / 60_000),
    winnerId: f.winnerId,
    winnerName: f.winnerName,
    tie: f.tie,
    forfeit: Boolean(f.forfeit),
    note: f.note,
    startedAt: f.startedAt,
    endsAt: f.endsAt,
    honorBy: f.honorBy,
    demo: Boolean(f.demo),
  };
}

export type CalloutDesk = {
  id: string;
  name: string;
  house?: boolean;
  purpose?: string;
  admin?: boolean;
  system?: boolean;
  kind?: string;
};

function isAiKind(kind?: string) {
  return kind === "grok" || kind === "claude" || kind === "gpt" || kind === "mcp" || kind === "other";
}

function defaultPref(desk: CalloutDesk): CalloutPrefMode {
  if (desk.system || desk.id === SYSTEM_KING_ID) return "auto";
  if (desk.admin || desk.kind === "human") return "manual";
  return "auto";
}

export function issueCallout(input: {
  from: CalloutDesk;
  target: CalloutDesk | null;
  gmManualUnlocked?: boolean;
}) {
  if (input.from.house) return { ok: false as const, error: "HOUSE field does not C@LL 0UT." };
  if (!input.from.purpose?.trim()) {
    return { ok: false as const, error: "Set a profile purpose first. C@LL 0UT is for members with a profile." };
  }
  if (!input.target) {
    return { ok: false as const, error: "Pick another W1S3 0WL$ with a profile. HOUSE cannot be called out." };
  }
  const targetIs7 = input.target.id === SYSTEM_KING_ID || input.target.system;
  if (input.target.house && !targetIs7) {
    return { ok: false as const, error: "Pick another W1S3 0WL$ with a profile. HOUSE cannot be called out." };
  }
  if (input.target.id === GM_AUTO_ID) {
    return { ok: false as const, error: "G M0D3 AUTO is the annual final only. Win B0t R0Und K1Ng and GM M@NU@L K1Ng first." };
  }
  if (!input.target.purpose?.trim() && !targetIs7) {
    return { ok: false as const, error: "Target needs a public profile purpose." };
  }
  if (input.from.id === input.target.id) return { ok: false as const, error: "You cannot C@LL 0UT yourself." };

  const fromAdmin = Boolean(input.from.admin);
  const targetAdmin = Boolean(input.target.admin);
  const fromOwl = !fromAdmin && isAiKind(input.from.kind);
  const targetOwl = !targetAdmin && !targetIs7 && isAiKind(input.target.kind);

  if (targetIs7 && !fromAdmin) {
    return { ok: false as const, error: "Only system Admin and phone-app Admin may C@LL 0UT 7-B0T vs G M0D3 M@NU@L." };
  }
  if (targetIs7 && fromAdmin && input.gmManualUnlocked === false) {
    return { ok: false as const, error: "G M0D3 M@NU@L must be UNLOCKED to C@LL 0UT 7-B0T." };
  }

  let lane: CalloutLane = "owl-vs-owl";
  if (targetIs7 && fromAdmin) lane = "admin-vs-7bot";
  else if (fromAdmin || targetAdmin) lane = "admin-vs-agent";
  else if (fromOwl && targetOwl) lane = "owl-vs-owl";
  else if (fromAdmin) lane = "admin-vs-agent";

  if (fromAdmin && lane === "owl-vs-owl") {
    return { ok: false as const, error: "Admins do not enter W1S3 0WL$ AI-agent vs AI-agent bouts. Call out an agent as a system member instead." };
  }

  const s = load();
  if (!s.prefs) s.prefs = {};
  dropDemo(s);
  const fromPref = s.prefs[input.from.id] ?? defaultPref(input.from);
  const targetPref = s.prefs[input.target.id] ?? defaultPref(input.target);
  if (fromPref === "pause") {
    return { ok: false as const, error: "Your C@LL 0UT rail is paused. Set pref auto or manual first." };
  }
  if (targetPref === "pause") {
    return { ok: false as const, error: "Target paused C@LL 0UTs. They must resume before a bout." };
  }
  if (liveFightFor(s, input.from.id) || liveFightFor(s, input.target.id)) {
    return { ok: false as const, error: "One of you is already in a bout. Wait for the bell or honor window." };
  }
  const humanClock = lane !== "owl-vs-owl";
  const autoStart = targetPref === "auto" || targetIs7;
  const fight = startFight({
    kind: "bar",
    year: yearEt(),
    challengerId: input.from.id,
    challengerName: input.from.name,
    targetId: input.target.id,
    targetName: input.target.name,
    lane,
    roundMs: humanClock ? CALLOUT_HUMAN_ROUND_MS : CALLOUT_ROUND_MS,
    pending: !autoStart,
  });
  s.fights = [fight, ...s.fights].slice(0, FIGHT_CAP);
  save(s);
  return { ok: true as const, fight: publicFight(fight), trade: false as const, escrow: false as const, lane };
}

export function tickCallout(input: { id: string; name: string; action: string; sizeUsd?: number; px: number; admin?: boolean }) {
  const s = load();
  const f = liveFightFor(s, input.id);
  if (!f) return { ok: false as const, error: "No live C@LL 0UT. Issue one first." };
  settleFight(f);
  if (f.status === "PENDING") {
    return { ok: false as const, error: "Bout is in the honor window. Target must honor or auto-respond first." };
  }
  if (f.status === "DONE" || f.status === "FORFEIT") {
    save(s);
    return { ok: false as const, error: f.forfeit ? "Forfeit. Challenger wins." : "Bout is over. Most bitcoin won (tie → caller)." };
  }
  if (f.lane === "owl-vs-owl" && input.admin) {
    return { ok: false as const, error: "Admins do not tick W1S3 0WL$ AI-agent vs AI-agent bouts." };
  }
  if (!(input.px > 0)) return { ok: false as const, error: "No Coinbase last yet. Retry." };
  const action = String(input.action ?? "HOLD").toUpperCase();
  if (action === "HOLD" || action === "WAIT") {
    return { ok: true as const, executed: false as const, action, fight: publicFight(f), trade: false as const };
  }
  if (action === "TRIM") return { ok: false as const, error: "No TRIM in C@LL 0UT. Stack bitcoin. Never sell. Never short." };
  if (action !== "BUY" && action !== "ACCUMULATE") {
    return { ok: false as const, error: "C@LL 0UT actions: BUY, ACCUMULATE, HOLD, WAIT." };
  }
  const book = f.books[input.id] ?? emptyBook();
  if (book.lastAt && Date.now() - Date.parse(book.lastAt) < TICK_MS) {
    return { ok: false as const, error: `Slow down. Min ${TICK_MS / 1000}s between ticks.`, retryAfterSec: TICK_MS / 1000 };
  }
  const cap = Math.min(book.cashUsd * 0.25, book.cashUsd);
  const want = Number(input.sizeUsd);
  const usd = Math.min(Number.isFinite(want) && want > 0 ? want : book.cashUsd * 0.1, cap);
  if (usd < 10) return { ok: false as const, error: "Need at least $10 cash on the bout sleeve." };
  book.cashUsd = round2(book.cashUsd - usd);
  book.btc = round8(book.btc + usd / input.px);
  book.fills += 1;
  book.lastAt = new Date().toISOString();
  f.books[input.id] = book;
  save(s);
  return { ok: true as const, executed: true as const, action, btc: book.btc, fight: publicFight(f), trade: false as const };
}

export function honorCallout(input: { id: string; accept: boolean }) {
  const s = load();
  const f = s.fights.find((x) => x.id && (x.challengerId === input.id || x.targetId === input.id) && x.status === "PENDING") ?? null;
  if (!f) return { ok: false as const, error: "No pending C@LL 0UT to honor." };
  if (f.targetId !== input.id && input.accept) {
    return { ok: false as const, error: "Only the target honors a C@LL 0UT." };
  }
  if (!input.accept) {
    f.status = "FORFEIT";
    f.winnerId = f.challengerId;
    f.winnerName = f.challengerName;
    f.tie = false;
    f.forfeit = true;
    f.note = "Target declined. Forfeit. Challenger wins.";
    if (f.kind === "bar") addWin(s, f.winnerId, f.winnerName ?? "", 0);
    save(s);
    return { ok: true as const, fight: publicFight(f), trade: false as const, escrow: false as const };
  }
  const now = Date.now();
  f.status = "LIVE";
  f.startedAt = new Date(now).toISOString();
  f.endsAt = new Date(now + CALLOUT_ROUNDS * (f.roundMs || CALLOUT_ROUND_MS)).toISOString();
  f.honorBy = null;
  f.note = `${CALLOUT_ROUNDS} rounds × ${Math.round((f.roundMs || CALLOUT_ROUND_MS) / 60000)} min. Honored. Most bitcoin wins.`;
  save(s);
  return { ok: true as const, fight: publicFight(f), trade: false as const, escrow: false as const };
}

export function setCalloutPref(input: { id: string; mode: CalloutPrefMode }) {
  const mode: CalloutPrefMode = input.mode === "auto" || input.mode === "pause" ? input.mode : "manual";
  const s = load();
  if (!s.prefs) s.prefs = {};
  s.prefs[input.id] = mode;
  save(s);
  return { ok: true as const, id: input.id, mode, trade: false as const };
}

export function calloutPrefOf(id: string, desk?: CalloutDesk): CalloutPrefMode {
  const s = load();
  return (s.prefs ?? {})[id] ?? (desk ? defaultPref(desk) : "auto");
}

export function placeFightWager(input: {
  fromId: string;
  fromName: string;
  house?: boolean;
  pickId: string;
  pickName: string;
  stakeUsd?: number;
}) {
  if (input.house) return { ok: false as const, error: "HOUSE field does not wager." };
  const s = load();
  const fight = s.fights.find((f) => f.status === "LIVE") ?? null;
  if (!fight) return { ok: false as const, error: "No live 5-round C@LL 0UT to SP1CE UP. Wait for a bout." };
  const stake = round2(Number(input.stakeUsd));
  if (!Number.isFinite(stake) || stake < 1 || stake > 100) {
    return { ok: false as const, error: "Stake must be 1–100 USD notional." };
  }
  if (input.pickId !== fight.challengerId && input.pickId !== fight.targetId) {
    return { ok: false as const, error: "Pick a fighter in the live 5-round bout." };
  }
  if (s.bets.some((b) => b.fightId === fight.id && b.fromId === input.fromId && !b.settled)) {
    return { ok: false as const, error: "One SP1CE UP pick per bout." };
  }
  s.bets = [
    {
      id: `cf-${Date.now().toString(36)}`,
      fightId: fight.id,
      fromId: input.fromId,
      fromName: input.fromName,
      pickId: input.pickId,
      pickName: input.pickName,
      stakeUsd: stake,
      at: new Date().toISOString(),
      settled: false,
      won: null,
    },
    ...s.bets,
  ].slice(0, BET_CAP);
  save(s);
  return { ok: true as const, fight: publicFight(fight), paper: true as const, escrow: false as const };
}

/** Test helper: expire one bout so most-bitcoin / tie rules can be asserted. */
export function expireFight(id: string, now = Date.now()) {
  const s = load();
  const f = s.fights.find((x) => x.id === id);
  if (!f) return null;
  f.endsAt = new Date(now - 1000).toISOString();
  settleFight(f, now);
  if (f.status === "DONE" || f.status === "FORFEIT") {
    if (f.winnerId && f.kind === "bar") addWin(s, f.winnerId, f.winnerName ?? "", f.books[f.winnerId]?.btc ?? 0);
    settleBets(s, f);
  }
  save(s);
  return publicFight(f);
}

/** Test helper: plant the 20-bout demo tape (system king). */
export function seedDemoTape() {
  const s = load();
  s.fights = [];
  s.wins = {};
  s.bets = [];
  return seedDemoIfNeeded(s, true);
}

export function fightCount() {
  const s = load();
  return {
    total: s.fights.length,
    demo: s.fights.filter((f) => f.demo).length,
    live: s.fights.filter((f) => f.status === "LIVE").length,
  };
}
