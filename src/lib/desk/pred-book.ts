/** PR3D1CT10N$ paper book. Education experiment. Never bets. Never Coinbase create. */
import { mkdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { CHECKPOINT_BUILD_N, checkpointLabel } from "../launch/checkpoint.ts";

export const PRED_PATH = "/pr3d";
export const PRED_API = "/api/agent/pred";
export const PRED_NAME = "PR3D1CT10N$";
export const PRED_SEO = "AI Agent Prediction Market";
export const PRED_TOKEN = "S1R1U$";
export const PRED_GRANT = 4200;
export const PRED_TITLE = "AI AG3NT T0P D0G";
export const PRED_TICK_MS = process.env.NODE_TEST_CONTEXT ? 0 : 8_000;
export const PRED_FALLBACK_PX = 108_000;

export type PredSim = "LIVE" | "PAUSED";
export type PredSide = "YES" | "NO";

export type PredMarketDef = {
  id: string;
  kind: "ath" | "monthly" | "other";
  title: string;
  strike: string;
};

export const PRED_MARKETS: PredMarketDef[] = [
  { id: "ath-2026", kind: "ath", title: "BTC all-time high before 2027", strike: "ATH" },
  { id: "m-120k", kind: "monthly", title: "BTC prints $120,000 this month", strike: "$120k" },
  { id: "w-green", kind: "other", title: "BTC weekly close green", strike: "Wk close" },
  { id: "bot7-acc", kind: "other", title: "7-B0T prints ACCUMULATE this cycle", strike: "7-B0T" },
];

type DeskSeed = {
  id: string;
  name: string;
  kind: string;
  system: boolean;
  bias: number;
};

const SEEDS: DeskSeed[] = [
  { id: "gm-auto", name: "G M0D3 AUTO", kind: "gm", system: true, bias: 0.62 },
  { id: "app-admin", name: "Phone Admin", kind: "admin", system: true, bias: 0.48 },
  { id: "grok-test", name: "Grok · TEST", kind: "grok", system: false, bias: 0.55 },
  { id: "claude-test", name: "Claude · TEST", kind: "claude", system: false, bias: 0.44 },
  { id: "gpt-test", name: "GPT · TEST", kind: "gpt", system: false, bias: 0.51 },
  { id: "mcp-test", name: "MCP · TEST", kind: "mcp", system: false, bias: 0.4 },
];

export type PredPos = { marketId: string; yes: number; no: number };

export type PredDesk = {
  id: string;
  name: string;
  kind: string;
  system: boolean;
  bias: number;
  cash: number;
  pos: PredPos[];
  lastAt: string | null;
};

export type PredFill = {
  id: string;
  at: string;
  deskId: string;
  desk: string;
  marketId: string;
  market: string;
  side: PredSide;
  stake: number;
  yesPct: number;
};

export type PredMarketState = PredMarketDef & {
  yesPct: number;
  volume: number;
};

type Store = {
  sim: PredSim;
  lastPx: number;
  weeklyOpen: number;
  ticks: number;
  fills: PredFill[];
  desks: PredDesk[];
  markets: PredMarketState[];
  lastTickAt: string | null;
};

const PATHS = process.env.NODE_TEST_CONTEXT
  ? ["/tmp/pred-book-test.json"]
  : ["/tmp/pred-book.json", "/workspace/data/pred-book.json"];

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export function impliedYesPct(marketId: string, px: number, weeklyOpen: number): number {
  const p = px > 0 ? px : PRED_FALLBACK_PX;
  const open = weeklyOpen > 0 ? weeklyOpen : p;
  if (marketId === "ath-2026") return round1(clamp(18 + (p - 70_000) / 1_400, 8, 92));
  if (marketId === "m-120k") return round1(clamp((p / 120_000) * 72, 5, 94));
  if (marketId === "w-green") return round1(clamp(50 + ((p - open) / open) * 380, 8, 92));
  if (marketId === "bot7-acc") return round1(clamp(82 - (p - 90_000) / 1_800, 14, 88));
  return 50;
}

export function markDesk(d: PredDesk, markets: PredMarketState[]): number {
  let n = d.cash;
  for (const pos of d.pos) {
    const m = markets.find((x) => x.id === pos.marketId);
    const yes = m ? m.yesPct / 100 : 0.5;
    n += pos.yes * yes + pos.no * (1 - yes);
  }
  return round2(n);
}

function emptyDesk(seed: DeskSeed): PredDesk {
  return { ...seed, cash: PRED_GRANT, pos: [], lastAt: null };
}

function fresh(): Store {
  const px = PRED_FALLBACK_PX;
  return {
    sim: "LIVE",
    lastPx: px,
    weeklyOpen: px,
    ticks: 0,
    fills: [],
    desks: SEEDS.map(emptyDesk),
    markets: PRED_MARKETS.map((m) => ({ ...m, yesPct: impliedYesPct(m.id, px, px), volume: 0 })),
    lastTickAt: null,
  };
}

function readJson(p: string): Store | null {
  try {
    const j = JSON.parse(readFileSync(p, "utf8")) as Store;
    if (!j || !Array.isArray(j.desks) || !Array.isArray(j.markets)) return null;
    return j;
  } catch {
    return null;
  }
}

let mem: Store | null = null;

function load(): Store {
  if (mem) return ensureSeeds(mem);
  if (typeof window === "undefined") {
    for (const p of PATHS) {
      const j = readJson(p);
      if (j) {
        mem = ensureSeeds(j);
        return mem;
      }
    }
  }
  mem = fresh();
  return mem;
}

function ensureSeeds(s: Store): Store {
  for (const seed of SEEDS) {
    if (!s.desks.some((d) => d.id === seed.id)) s.desks.push(emptyDesk(seed));
  }
  if (!s.desks.some((d) => d.id === "gm-auto")) s.desks.push(emptyDesk(SEEDS[0]));
  return s;
}

function save(s: Store) {
  mem = s;
  if (typeof window !== "undefined") return;
  const body = JSON.stringify(s);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

export function resetPredBookForTest() {
  mem = null;
  if (!process.env.NODE_TEST_CONTEXT) return;
  try {
    unlinkSync("/tmp/pred-book-test.json");
  } catch {
    /* ok */
  }
}

function adminSim(): PredSim {
  if (typeof window !== "undefined") return "LIVE";
  for (const p of ["/tmp/live-sim.json", "/workspace/data/live-sim.json"]) {
    try {
      const j = JSON.parse(readFileSync(p, "utf8")) as { status?: string };
      if (j.status === "PAUSED") return "PAUSED";
      if (j.status === "LIVE") return "LIVE";
    } catch {
      /* next */
    }
  }
  return "LIVE";
}

function tapePx(fallback: number): number {
  if (typeof window !== "undefined") return fallback;
  try {
    const j = JSON.parse(readFileSync("/tmp/desk-last-good.json", "utf8")) as { snap?: { btc?: { price?: number | null } } };
    const px = j?.snap?.btc?.price;
    if (typeof px === "number" && px > 0) return px;
  } catch {
    /* fallback */
  }
  return fallback;
}

function posOf(d: PredDesk, marketId: string): PredPos {
  let p = d.pos.find((x) => x.marketId === marketId);
  if (!p) {
    p = { marketId, yes: 0, no: 0 };
    d.pos.push(p);
  }
  return p;
}

function play(s: Store, desk: PredDesk, market: PredMarketState, side: PredSide, stake: number, at: string) {
  if (desk.cash < 80) desk.cash = PRED_GRANT;
  const amt = round2(Math.min(desk.cash, Math.max(20, stake)));
  if (amt < 20 || desk.cash < 20) return;
  desk.cash = round2(desk.cash - amt);
  const row = posOf(desk, market.id);
  if (side === "YES") row.yes = round2(row.yes + amt);
  else row.no = round2(row.no + amt);
  market.volume = round2(market.volume + amt);
  desk.lastAt = at;
  s.fills.unshift({
    id: `pf_${s.ticks}_${desk.id}_${market.id}`,
    at,
    deskId: desk.id,
    desk: desk.name,
    marketId: market.id,
    market: market.strike,
    side,
    stake: amt,
    yesPct: market.yesPct,
  });
  s.fills = s.fills.slice(0, 18);
}

function maybeTick(s: Store, px: number) {
  s.sim = adminSim();
  if (s.sim !== "LIVE") {
    s.lastPx = px > 0 ? px : s.lastPx;
    save(s);
    return s;
  }
  const now = Date.now();
  if (s.lastTickAt && now - Date.parse(s.lastTickAt) < PRED_TICK_MS) {
    s.lastPx = px > 0 ? px : s.lastPx;
    return s;
  }
  const price = px > 0 ? px : s.lastPx || PRED_FALLBACK_PX;
  if (!s.weeklyOpen) s.weeklyOpen = price;
  const at = new Date().toISOString();
  for (const m of s.markets) m.yesPct = impliedYesPct(m.id, price, s.weeklyOpen);
  s.ticks += 1;
  const market = s.markets[(s.ticks - 1) % s.markets.length];
  for (const d of s.desks) {
    const fade = market.yesPct >= 70 ? "NO" : market.yesPct <= 30 ? "YES" : d.bias >= 0.5 ? "YES" : "NO";
    const stake = 40 + ((s.ticks + d.bias * 10) % 7) * 18;
    play(s, d, market, fade, stake, at);
  }
  s.lastPx = price;
  s.lastTickAt = at;
  save(s);
  return s;
}

function board(s: Store) {
  return [...s.desks]
    .map((d) => {
      const equity = markDesk(d, s.markets);
      return {
        id: d.id,
        name: d.name,
        kind: d.kind,
        system: d.system,
        cash: d.cash,
        equity,
        pnl: round2(equity - PRED_GRANT),
        lastAt: d.lastAt,
      };
    })
    .sort((a, b) => b.equity - a.equity || a.name.localeCompare(b.name))
    .map((row, i) => ({ rank: i + 1, ...row }));
}

export function predBookPublic(input?: { px?: number }) {
  const s = load();
  const px = tapePx(input?.px && input.px > 0 ? input.px : s.lastPx || PRED_FALLBACK_PX);
  maybeTick(s, px);
  const ranked = board(s);
  const live = s.sim === "LIVE";
  const tag = checkpointLabel(CHECKPOINT_BUILD_N);
  return {
    ok: true as const,
    name: PRED_NAME,
    seo: PRED_SEO,
    path: PRED_PATH,
    api: PRED_API,
    paperBook: true as const,
    token: PRED_TOKEN,
    tokenFake: true as const,
    grant: PRED_GRANT,
    title: PRED_TITLE,
    phoWallet: false as const,
    fakeWallets: false as const,
    bets: false as const,
    realMoney: false as const,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    sim: {
      status: s.sim,
      live,
      paper: true as const,
      followsAdminSim: true as const,
      lastPx: s.lastPx,
      ticks: s.ticks,
      note: live
        ? `${tag} PR3D1CT10N$ paper book LIVE on Coinbase last (or last-good tape). G M0D3 AUTO always plays. Fake ${PRED_TOKEN}. This host never takes bets.`
        : `${tag} PR3D1CT10N$ PAUSED with the admin simulation. Last tape held. Continue from Admin Console.`,
    },
    markets: s.markets,
    board: ranked,
    fills: s.fills,
    overlay: "Polymarket + Kalshi public odds stay a 7-B0T sub-analyst overlay. This host never takes bets.",
    welcome:
      "PR3D1CT10N$ is an AI-agent education experiment. Fake token S1R1U$. $ cannot mint a live token. Bring BYO compute and your quant. Rank AI AG3NT T0P D0G is paper only. Proof of concept. Using the system is agreement to Terms.",
    how: "GET /api/agent/pred. Paper play ticks while admin simulation is LIVE. Pause from Admin Console also pauses this book. No POST bets. No withdrawal. No Ph0 W@ll3t. This host never places Coinbase orders.",
    disclaimer:
      "Education experiment. Proof of concept. Fake S1R1U$ (grant 4,200). Not an offer of securities. This host never takes, matches, or escrows bets. Polymarket and Kalshi stay overlay only. Seek licensed counsel before any live market.",
  };
}
