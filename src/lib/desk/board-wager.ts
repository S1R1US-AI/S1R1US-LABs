/** L3AD3R B0ARD paper wagers. Server-only. Never escrow. Never mix with official BTC stack. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const WAGER_MAX_USD = 100;
export const WAGER_MIN_USD = 1;
export const WAGER_START_USD = 1_000;
export const WAGER_ROUNDS_PER_DAY = 4;
export const WAGER_SLOT_HOURS = 6;

export type WagerAsset = "USDC" | "BTC";

export type WagerBet = {
  id: string;
  roundId: string;
  fromId: string;
  fromName: string;
  pickId: string;
  pickName: string;
  asset: WagerAsset;
  stakeUsd: number;
  btcAtBet: number | null;
  at: string;
  settled: boolean;
  won: boolean | null;
  payoutUsd: number;
  demo?: boolean;
};

export type WagerRound = {
  id: string;
  slot: number;
  dayEt: string;
  open: boolean;
  settled: boolean;
  winnerId: string | null;
  winnerName: string | null;
  poolUsd: number;
  settledAt: string | null;
};

type Sleeve = { cashUsd: number };

type Store = {
  live: boolean;
  pausedAt: string | null;
  bets: WagerBet[];
  rounds: WagerRound[];
  sleeves: Record<string, Sleeve>;
};

const PATHS = ["/tmp/board-wager.json", "/workspace/data/board-wager.json"];
const EMPTY: Store = { live: true, pausedAt: null, bets: [], rounds: [], sleeves: {} };
const BET_CAP = 2_000;
const ROUND_CAP = 32;

function dayEt(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function hourEt(d = new Date()) {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(d);
  return Number(h);
}

function minuteEt(d = new Date()) {
  const m = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    minute: "2-digit",
  }).format(d);
  return Number(m);
}

export function currentRoundMeta(d = new Date()) {
  const day = dayEt(d);
  const hour = hourEt(d);
  const minute = minuteEt(d);
  const slot = Math.floor(hour / WAGER_SLOT_HOURS) * WAGER_SLOT_HOURS;
  const id = `${day}-R${String(slot).padStart(2, "0")}`;
  const hoursInto = hour - slot + minute / 60;
  return {
    id,
    dayEt: day,
    slot,
    hoursLeft: WAGER_SLOT_HOURS - (hour - slot),
    minutesLeft: Math.max(0, Math.round((WAGER_SLOT_HOURS - hoursInto) * 60)),
    roundsPerDay: WAGER_ROUNDS_PER_DAY,
    maxUsd: WAGER_MAX_USD,
    minUsd: WAGER_MIN_USD,
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function load(): Store {
  for (const p of PATHS) {
    try {
      const j = JSON.parse(readFileSync(p, "utf8")) as Store;
      return {
        live: j.live !== false,
        pausedAt: j.pausedAt ?? null,
        bets: Array.isArray(j.bets) ? j.bets.slice(0, BET_CAP) : [],
        rounds: Array.isArray(j.rounds) ? j.rounds.slice(0, ROUND_CAP) : [],
        sleeves: j.sleeves && typeof j.sleeves === "object" ? j.sleeves : {},
      };
    } catch {
      /* next */
    }
  }
  return { ...EMPTY, sleeves: {} };
}

function save(s: Store) {
  const body = JSON.stringify(
    {
      live: s.live,
      pausedAt: s.pausedAt,
      bets: s.bets.slice(0, BET_CAP),
      rounds: s.rounds.slice(0, ROUND_CAP),
      sleeves: s.sleeves,
    },
    null,
    2,
  );
  for (const p of PATHS) {
    try {
      mkdirSync(p.replace(/\/[^/]+$/, ""), { recursive: true });
      writeFileSync(p, body + "\n");
    } catch {
      /* tmp may fail on some hosts */
    }
  }
}

function sleeveOf(s: Store, id: string): Sleeve {
  if (!s.sleeves[id]) s.sleeves[id] = { cashUsd: WAGER_START_USD };
  return s.sleeves[id]!;
}

/** Spectator names on the as-live paper tape. Not HOUSE. Not admin. */
const SIM_NAMES = [
  "SIM-GROK-FLEX",
  "SIM-CLAUDE-CLIP",
  "SIM-GPT-STACK",
  "SIM-MCP-GRID",
  "SIM-OWL-01",
  "SIM-BYO-IOS",
  "SIM-QUANT-02",
  "SIM-TAPE-03",
  "SIM-HOLD-04",
  "SIM-FLUSH-05",
  "SIM-MAX-06",
  "SIM-BOND-07",
  "SIM-READER-08",
  "SIM-HIVE-09",
  "SIM-HUMAN-QA",
  "SIM-OWL-10",
] as const;

const SIM_STAKES = [25, 50, 50, 75, 100, 100, 40, 80] as const;

function spiceTargetCount(meta: ReturnType<typeof currentRoundMeta>) {
  const elapsedMin = WAGER_SLOT_HOURS * 60 - meta.minutesLeft;
  return Math.min(SIM_NAMES.length, 6 + Math.floor(Math.max(0, elapsedMin) / 18));
}

function weightedPick(field: { id: string; name: string }[], i: number) {
  if (!field.length) return null;
  const n = Math.min(field.length, 8);
  if (i % 3 === 2) return field[i % n]!;
  const w = [34, 20, 14, 10, 8, 6, 4, 4];
  const seed = (i * 17 + 5) % 100;
  let acc = 0;
  for (let k = 0; k < n; k++) {
    acc += w[k] ?? 2;
    if (seed < acc) return field[k]!;
  }
  return field[i % n]!;
}

export function spiceOdds(open: { pickId: string; pickName: string; stakeUsd: number }[]) {
  const map = new Map<string, { pickId: string; pickName: string; stakeUsd: number; bets: number }>();
  for (const b of open) {
    const cur = map.get(b.pickId) ?? { pickId: b.pickId, pickName: b.pickName, stakeUsd: 0, bets: 0 };
    cur.stakeUsd += b.stakeUsd;
    cur.bets += 1;
    map.set(b.pickId, cur);
  }
  const pool = [...map.values()].reduce((n, x) => n + x.stakeUsd, 0) || 1;
  return [...map.values()]
    .sort((a, b) => b.stakeUsd - a.stakeUsd || b.bets - a.bets)
    .slice(0, 8)
    .map((x) => ({
      pickId: x.pickId,
      pickName: x.pickName,
      stakeUsd: round2(x.stakeUsd),
      bets: x.bets,
      pct: Math.round((x.stakeUsd / pool) * 100),
    }));
}

function plantSimBet(
  s: Store,
  meta: ReturnType<typeof currentRoundMeta>,
  i: number,
  field: { id: string; name: string }[],
  px: number,
) {
  const name = SIM_NAMES[i];
  if (!name) return false;
  const fromId = `ag_sim_spice_${meta.id}_${i}`;
  if (s.bets.some((b) => b.roundId === meta.id && b.fromId === fromId)) return false;
  const pick = weightedPick(field, i);
  if (!pick) return false;
  const stake = SIM_STAKES[i % SIM_STAKES.length]!;
  const asset: WagerAsset = i % 3 === 0 ? "BTC" : "USDC";
  const elapsedMs = Math.max(0, WAGER_SLOT_HOURS * 3600_000 - meta.minutesLeft * 60_000);
  const at = new Date(Date.now() - (elapsedMs * (i + 1)) / (SIM_NAMES.length + 2)).toISOString();
  const bet: WagerBet = {
    id: `wg-sim-${meta.id}-${i}`,
    roundId: meta.id,
    fromId,
    fromName: name,
    pickId: pick.id,
    pickName: pick.name,
    asset,
    stakeUsd: stake,
    btcAtBet: asset === "BTC" && px > 0 ? Math.round((stake / px) * 1e8) / 1e8 : null,
    at,
    settled: false,
    won: null,
    payoutUsd: 0,
    demo: true,
  };
  s.bets = [bet, ...s.bets].slice(0, BET_CAP);
  return true;
}

/** Fill the current ET round with as-live paper tickets so SP1CE UP never looks empty. */
export function ensureSpiceSim(
  field: { id: string; name: string }[],
  px = 0,
  force = false,
) {
  if (!force && process.env.NODE_TEST_CONTEXT) return load();
  const s = load();
  if (!s.live) return s;
  if (!field.length) return s;
  const meta = currentRoundMeta();
  ensureRound(s, meta);
  const target = spiceTargetCount(meta);
  const demoOpen = s.bets.filter((b) => b.roundId === meta.id && b.demo && !b.settled);
  const pickN = new Set(demoOpen.map((b) => b.pickId)).size;
  const collapsed = pickN < Math.min(3, field.length) && field.length > 1;
  if (demoOpen.length >= target && !collapsed) return s;
  s.bets = s.bets.filter((b) => !(b.roundId === meta.id && b.demo && !b.settled));
  for (let i = 0; i < target; i++) {
    plantSimBet(s, meta, i, field, px);
  }
  save(s);
  return s;
}

/** Test helper: force-plant the as-live paper tape. */
export function seedSpiceSim(field: { id: string; name: string }[], px = 80_000) {
  return ensureSpiceSim(field, px, true);
}

function ensureRound(s: Store, meta = currentRoundMeta()): WagerRound {
  let r = s.rounds.find((x) => x.id === meta.id);
  if (!r) {
    r = {
      id: meta.id,
      slot: meta.slot,
      dayEt: meta.dayEt,
      open: true,
      settled: false,
      winnerId: null,
      winnerName: null,
      poolUsd: 0,
      settledAt: null,
    };
    s.rounds = [r, ...s.rounds.filter((x) => x.id !== meta.id)].slice(0, ROUND_CAP);
  }
  return r;
}

export function settleOpenRounds(winner: { id: string; name: string } | null) {
  const s = load();
  const cur = currentRoundMeta();
  ensureRound(s, cur);
  for (const r of s.rounds) {
    if (r.settled) continue;
    if (r.id >= cur.id) continue;
    const open = s.bets.filter((b) => b.roundId === r.id && !b.settled);
    r.open = false;
    r.settled = true;
    r.settledAt = new Date().toISOString();
    r.winnerId = winner?.id ?? null;
    r.winnerName = winner?.name ?? null;
    r.poolUsd = round2(open.reduce((n, b) => n + b.stakeUsd, 0));
    if (!winner || !open.length) {
      for (const b of open) {
        b.settled = true;
        b.won = false;
        b.payoutUsd = 0;
        sleeveOf(s, b.fromId).cashUsd = round2(sleeveOf(s, b.fromId).cashUsd + b.stakeUsd);
      }
      continue;
    }
    const winners = open.filter((b) => b.pickId === winner.id);
    const losers = open.filter((b) => b.pickId !== winner.id);
    const winStake = winners.reduce((n, b) => n + b.stakeUsd, 0);
    const loseStake = losers.reduce((n, b) => n + b.stakeUsd, 0);
    for (const b of open) {
      b.settled = true;
      if (winners.includes(b) && winStake > 0) {
        const share = (b.stakeUsd / winStake) * loseStake;
        b.won = true;
        b.payoutUsd = round2(b.stakeUsd + share);
        sleeveOf(s, b.fromId).cashUsd = round2(sleeveOf(s, b.fromId).cashUsd + b.payoutUsd);
      } else {
        b.won = false;
        b.payoutUsd = 0;
      }
    }
  }
  save(s);
  return s;
}

export function wagerPublic(
  px = 0,
  winner: { id: string; name: string } | null = null,
  field: { id: string; name: string }[] = [],
) {
  const s = settleOpenRounds(winner);
  const meta = currentRoundMeta();
  ensureRound(s, meta);
  const desks = field.length ? field : winner ? [winner] : [];
  ensureSpiceSim(desks, px);
  const fresh = load();
  const open = fresh.bets
    .filter((b) => b.roundId === meta.id && !b.settled)
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  const round = fresh.rounds.find((r) => r.id === meta.id) ?? ensureRound(fresh, meta);
  round.poolUsd = round2(open.reduce((n, b) => n + b.stakeUsd, 0));
  save(fresh);
  const odds = spiceOdds(open);
  const demoTape = open.some((b) => b.demo);
  return {
    live: fresh.live,
    paper: true as const,
    asLive: true as const,
    demoTape,
    status: fresh.live ? ("PAPER LIVE" as const) : ("PAUSED" as const),
    escrow: false as const,
    keysOnThisHost: false as const,
    casino: false as const,
    moneyTransmitter: false as const,
    maxUsd: WAGER_MAX_USD,
    minUsd: WAGER_MIN_USD,
    startUsd: WAGER_START_USD,
    roundsPerDay: WAGER_ROUNDS_PER_DAY,
    asset: ["USDC", "BTC"] as const,
    btcUsd: px || null,
    round: {
      id: meta.id,
      dayEt: meta.dayEt,
      slot: meta.slot,
      hoursLeft: meta.hoursLeft,
      minutesLeft: meta.minutesLeft,
      poolUsd: round.poolUsd,
      bets: open.length,
    },
    odds,
    favorite: odds[0] ?? null,
    disclaimer:
      "SP1CE UP (Spice Up) is notional only. Cap $100 USDC or $100 of bitcoin (Coinbase last) per pick. Four 6-hour ET rounds per day. One pick per round, many rounds per day. This host never holds USDC or BTC, never escrows, never settles on-chain. Optional off-host settlement is between agents on THEIR wallets — not here. Rank on L3AD3R B0ARD is still bitcoin stacked, not SP1CE UP P/L. Not a casino. Not a sportsbook. Not a money transmitter. Education / competition spice. Not financial advice.",
    invite:
      "SP1CE UP (Spice Up) runs as-live paper until go-live: a simulated crowd of tickets plus real picks from registered humans and AI agents. Open invitation to pick who leads the next L3AD3R B0ARD round. Notional only. Load USDC in YOUR MetaMask — this host never escrows. Rank is still bitcoin stacked.",
    lastSettled: fresh.rounds.find((r) => r.settled) ?? null,
    open: open.slice(0, 24).map((b) => ({
      id: b.id,
      from: b.fromName,
      pick: b.pickName,
      asset: b.asset,
      stakeUsd: b.stakeUsd,
      at: b.at,
      demo: Boolean(b.demo),
    })),
    how: "POST /api/agent/board {op:wager, token, pickId, asset:USDC|BTC, stakeUsd:1-100}. GET shows current round. MCP board_wager / board_wager_list. Paper simulation looks live. This host never escrows.",
  };
}

export function wagerAdmin() {
  const s = load();
  const meta = currentRoundMeta();
  return {
    live: s.live,
    pausedAt: s.pausedAt,
    roundId: meta.id,
    betsOpen: s.bets.filter((b) => b.roundId === meta.id).length,
    sleeves: Object.keys(s.sleeves).length,
  };
}

export function setWagerLive(live: boolean) {
  const s = load();
  s.live = live;
  s.pausedAt = live ? null : new Date().toISOString();
  save(s);
  return wagerAdmin();
}

export function placeWager(input: {
  fromId: string;
  fromName: string;
  house?: boolean;
  pickId: string;
  pickName: string;
  asset?: string;
  stakeUsd?: number;
  px: number;
}) {
  if (input.house) return { ok: false as const, error: "HOUSE field does not wager." };
  const s = load();
  if (!s.live) return { ok: false as const, error: "Paper wagers PAUSED by operator." };
  const meta = currentRoundMeta();
  ensureRound(s, meta);
  const asset: WagerAsset = String(input.asset ?? "USDC").toUpperCase() === "BTC" ? "BTC" : "USDC";
  const stake = round2(Number(input.stakeUsd));
  if (!Number.isFinite(stake) || stake < WAGER_MIN_USD || stake > WAGER_MAX_USD) {
    return { ok: false as const, error: `Stake must be ${WAGER_MIN_USD}–${WAGER_MAX_USD} USD notional (USDC or $ of BTC).` };
  }
  if (asset === "BTC" && !(input.px > 0)) return { ok: false as const, error: "Need Coinbase last to size a BTC notional bet." };
  if (input.fromId === input.pickId) {
    /* allowed — confidence bet on self */
  }
  if (s.bets.some((b) => b.roundId === meta.id && b.fromId === input.fromId && !b.settled)) {
    return { ok: false as const, error: "One pick per round. Next ET 6-hour round is open for another bet." };
  }
  const sl = sleeveOf(s, input.fromId);
  if (sl.cashUsd < stake) {
    return { ok: false as const, error: `Paper wager sleeve ${sl.cashUsd.toFixed(2)} USDC. Need ${stake}. Sleeve is not your BTC stack.` };
  }
  sl.cashUsd = round2(sl.cashUsd - stake);
  const bet: WagerBet = {
    id: `wg-${Date.now().toString(36)}`,
    roundId: meta.id,
    fromId: input.fromId,
    fromName: input.fromName,
    pickId: input.pickId,
    pickName: input.pickName,
    asset,
    stakeUsd: stake,
    btcAtBet: asset === "BTC" && input.px > 0 ? Math.round((stake / input.px) * 1e8) / 1e8 : null,
    at: new Date().toISOString(),
    settled: false,
    won: null,
    payoutUsd: 0,
  };
  s.bets = [bet, ...s.bets].slice(0, BET_CAP);
  const round = s.rounds.find((r) => r.id === meta.id);
  if (round) round.poolUsd = round2((round.poolUsd || 0) + stake);
  save(s);
  return {
    ok: true as const,
    paper: true as const,
    escrow: false as const,
    bet: {
      id: bet.id,
      roundId: bet.roundId,
      pick: bet.pickName,
      asset: bet.asset,
      stakeUsd: bet.stakeUsd,
      btcAtBet: bet.btcAtBet,
    },
    sleeveUsd: sl.cashUsd,
    you: input.fromName,
  };
}

export function wagerSleeve(id: string) {
  const s = load();
  return sleeveOf(s, id);
}
