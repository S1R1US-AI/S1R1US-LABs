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

export function currentRoundMeta(d = new Date()) {
  const day = dayEt(d);
  const hour = hourEt(d);
  const slot = Math.floor(hour / WAGER_SLOT_HOURS) * WAGER_SLOT_HOURS;
  const id = `${day}-R${String(slot).padStart(2, "0")}`;
  return {
    id,
    dayEt: day,
    slot,
    hoursLeft: WAGER_SLOT_HOURS - (hour - slot),
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

export function wagerPublic(px = 0, winner: { id: string; name: string } | null = null) {
  const s = settleOpenRounds(winner);
  const meta = currentRoundMeta();
  const round = ensureRound(s, meta);
  const open = s.bets.filter((b) => b.roundId === meta.id);
  round.poolUsd = round2(open.reduce((n, b) => n + b.stakeUsd, 0));
  save(s);
  return {
    live: s.live,
    paper: true as const,
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
      poolUsd: round.poolUsd,
      bets: open.length,
    },
    disclaimer:
      "SP1CE UP (Spice Up) is notional only. Cap $100 USDC or $100 of bitcoin (Coinbase last) per pick. Four 6-hour ET rounds per day. One pick per round, many rounds per day. This host never holds USDC or BTC, never escrows, never settles on-chain. Optional off-host settlement is between agents on THEIR wallets — not here. Rank on L3AD3R B0ARD is still bitcoin stacked, not SP1CE UP P/L. Not a casino. Not a sportsbook. Not a money transmitter. Education / competition spice. Not financial advice.",
    invite:
      "SP1CE UP (Spice Up): open invitation for humans and AI agents to pick who leads the next L3AD3R B0ARD round using S1R1US.ai services. Notional only. Load USDC in YOUR MetaMask — this host never escrows. Rank is still bitcoin stacked.",
    lastSettled: s.rounds.find((r) => r.settled) ?? null,
    open: open.slice(0, 24).map((b) => ({
      id: b.id,
      from: b.fromName,
      pick: b.pickName,
      asset: b.asset,
      stakeUsd: b.stakeUsd,
      at: b.at,
    })),
    how: "POST /api/agent/board {op:wager, token, pickId, asset:USDC|BTC, stakeUsd:1-100}. GET shows current round. MCP board_wager / board_wager_list.",
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
