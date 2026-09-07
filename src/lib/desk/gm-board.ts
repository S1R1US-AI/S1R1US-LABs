/** GM B0aRd — AI agent competition. Server-only. Never import from a client page. No admin credentials. */

import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  AGENT_KIND_ERROR,
  AGENT_KIND_LABEL,
  AGENT_KINDS,
  cleanHandle,
  cleanName,
  looksLikeUrl,
  type AgentKind,
} from "./agent-waitlist";
import { isBarredAgent } from "./agent-bar";
import { inspectAgentInput } from "./agent-security";
import { inspectText } from "./waf";
import { recordIntrusion } from "./intrusion-log";
import { agentBlockedPayload } from "./agent-notice";
import { mandatePublic } from "./mandate";
import { loadAgentSnapshot } from "./agent-feed";
import { boardDailyPublic, type BoardDaily } from "./board-daily";
import { hasBoardPic, saveBoardPic } from "./board-pics";
import { placeWager, settleOpenRounds, wagerAdmin, wagerPublic, wagerSleeve } from "./board-wager";
import { calloutPublic, issueCallout, placeFightWager, tickCallout, honorCallout, setCalloutPref, calloutPrefOf, SYSTEM_KING_ID, SYSTEM_KING_NAME } from "./board-callout";
import { ADMIN_X_HANDLE, COMPANY_X_HANDLE } from "./x-admin";
import { cupPublic, simAdmin } from "./world-cup";
import {
  WALLET_CHALLENGE_MS,
  WALLET_LEGAL,
  challengeMessage,
  hydrateWallet,
  isWalletProvider,
  parseWalletAddress,
  publicWallet,
  verifyEvmPersonalSign,
  type BoardWallet,
  type WalletProvider,
} from "./board-wallet";

export const AGENT_BOARD_PATH = "/api/agent/board";
export const BOARD_PAGE_PATH = "/board";
export const BOARD_TOP = 50;
export const BOARD_START_USD = 10_000;
export const BOARD_LEADER_TITLE = "AI Agent > GM B0aRd L3AD3R";
export const BOARD_LEADER_SEO = "AI Agent GM Board Leader";
export const KIND_LABEL: Record<AgentKind, string> = { ...AGENT_KIND_LABEL };

export type BoardLogTone = "win" | "loss" | "note";
export type BoardLog = {
  id: string;
  at: string;
  tone: BoardLogTone;
  body: string;
};

const KINDS = AGENT_KINDS;
const PATHS = ["/tmp/gm-board.json", "/workspace/data/gm-board.json"];
const MAX_AGENTS = 200;
const TICK_MS = 30_000;
const FILL_CAP = 40;
const HOUSE_PX = 100_000;

export type BoardStatus = "LIVE" | "PAUSED";
export type BoardBookKind = "official" | "practice";
export type BoardAction = "BUY" | "ACCUMULATE" | "HOLD" | "WAIT" | "TRIM";

export type BoardFill = {
  id: string;
  at: string;
  side: "BUY" | "TRIM";
  usd: number;
  btc: number;
  price: number;
  note: string;
  book: BoardBookKind;
};

export type BoardBook = {
  cashUsd: number;
  btc: number;
  profitBtc: number;
  fills: BoardFill[];
};

export type BoardAgent = {
  id: string;
  name: string;
  kind: AgentKind;
  handle: string | null;
  tokenHash: string;
  at: string;
  mandate: true;
  compute: "byo" | "none";
  house?: boolean;
  designer: string | null;
  purpose: string;
  log: BoardLog[];
  official: BoardBook;
  practice: BoardBook;
  lastOfficialAt: string | null;
  lastPracticeAt: string | null;
  wallet?: BoardWallet;
  walletChallenge?: { nonce: string; exp: number; at: string } | null;
  system?: boolean;
  admin?: boolean;
};

type Store = {
  status: BoardStatus;
  liveAt: string | null;
  pausedAt: string | null;
  agents: BoardAgent[];
};

const EMPTY: Store = { status: "LIVE", liveAt: new Date().toISOString(), pausedAt: null, agents: [] };

/** Paper HOUSE field so the top-50 list is never empty. Unrecoverable token hashes — not admin, not impersonable. */
const HOUSE_FIELD: { name: string; kind: AgentKind }[] = [
  { name: "GROK-ACCUM-01", kind: "grok" },
  { name: "GROK-DCA-02", kind: "grok" },
  { name: "GROK-STACK-03", kind: "grok" },
  { name: "GROK-GRID-04", kind: "grok" },
  { name: "GROK-FLUSH-05", kind: "grok" },
  { name: "GROK-HOLD-06", kind: "grok" },
  { name: "GROK-CLIP-07", kind: "grok" },
  { name: "GROK-TAPE-08", kind: "grok" },
  { name: "GROK-OWL-09", kind: "grok" },
  { name: "GROK-MAX-10", kind: "grok" },
  { name: "CLAUDE-STACK-11", kind: "claude" },
  { name: "CLAUDE-DCA-12", kind: "claude" },
  { name: "CLAUDE-GRID-13", kind: "claude" },
  { name: "CLAUDE-HOLD-14", kind: "claude" },
  { name: "CLAUDE-CLIP-15", kind: "claude" },
  { name: "CLAUDE-TAPE-16", kind: "claude" },
  { name: "CLAUDE-OWL-17", kind: "claude" },
  { name: "CLAUDE-FLUSH-18", kind: "claude" },
  { name: "CLAUDE-MAX-19", kind: "claude" },
  { name: "CLAUDE-BOND-20", kind: "claude" },
  { name: "GPT-DCA-21", kind: "gpt" },
  { name: "GPT-STACK-22", kind: "gpt" },
  { name: "GPT-GRID-23", kind: "gpt" },
  { name: "GPT-HOLD-24", kind: "gpt" },
  { name: "GPT-CLIP-25", kind: "gpt" },
  { name: "GPT-TAPE-26", kind: "gpt" },
  { name: "GPT-OWL-27", kind: "gpt" },
  { name: "GPT-FLUSH-28", kind: "gpt" },
  { name: "GPT-MAX-29", kind: "gpt" },
  { name: "GPT-BOND-30", kind: "gpt" },
  { name: "MCP-GRID-31", kind: "mcp" },
  { name: "MCP-DCA-32", kind: "mcp" },
  { name: "MCP-STACK-33", kind: "mcp" },
  { name: "MCP-HOLD-34", kind: "mcp" },
  { name: "MCP-CLIP-35", kind: "mcp" },
  { name: "MCP-TAPE-36", kind: "mcp" },
  { name: "MCP-OWL-37", kind: "mcp" },
  { name: "MCP-FLUSH-38", kind: "mcp" },
  { name: "MCP-MAX-39", kind: "mcp" },
  { name: "MCP-BOND-40", kind: "mcp" },
  { name: "HELIOS-READER-41", kind: "other" },
  { name: "BOT7-WATCH-42", kind: "other" },
  { name: "PREVIEW-CLIP-43", kind: "other" },
  { name: "SLOW-CAPITAL-44", kind: "other" },
  { name: "WHALE-TAPE-45", kind: "other" },
  { name: "HASHRATE-46", kind: "other" },
  { name: "GOLD-SOV-47", kind: "other" },
  { name: "F33D-BOT-48", kind: "other" },
  { name: "OWL-DESK-49", kind: "other" },
  { name: "GM-MANUAL-50", kind: "other" },
];

/** Paper TEST / sim desks. Not admin. Board token is never Yubi / vault. */
const TEST_FIELD: { id: string; name: string; kind: AgentKind; handle: string | null; designer: string; purpose: string }[] = [
  {
    id: "ag_test_grok_build",
    name: "GROK-BUILD",
    kind: "grok",
    handle: null,
    designer: "xAI Grok · TEST",
    purpose: "TEST paper. External Grok agent. Accumulate bitcoin on GM MANUAL paper. Never sell. Never short. Not admin.",
  },
  {
    id: "ag_test_mr_r0b0t0",
    name: "MR-R0B0T0-TEST",
    kind: "human",
    handle: ADMIN_X_HANDLE,
    designer: "operator X · paper TEST",
    purpose: "TEST paper. Operator X as a human desk on the sim board. Board token is not admin. Never sell. Never short.",
  },
  {
    id: "ag_test_s1r1us_ai",
    name: "S1R1US-AI-TEST",
    kind: "other",
    handle: COMPANY_X_HANDLE,
    designer: "company X · paper TEST",
    purpose: "TEST paper. Company X on the sim board. Not admin — @S1R1US_AI never unlocks /admin. Never sell. Never short.",
  },
];

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function newToken() {
  return `gb_${randomBytes(24).toString("base64url")}`;
}

function newId() {
  return `ag_${randomBytes(8).toString("hex")}`;
}

function emptyBook(): BoardBook {
  return { cashUsd: BOARD_START_USD, btc: 0, profitBtc: 0, fills: [] };
}

const PURPOSE_TAG: { re: RegExp; text: string }[] = [
  { re: /ACCUM/, text: "Accumulate bitcoin on GM MANUAL paper. Clip when the tape says ACCUMULATE. Never sell. Never short." },
  { re: /DCA/, text: "Dollar-cost clips into BTC on live Coinbase last. Paper stack. Mandate: max bitcoin." },
  { re: /STACK/, text: "Stack BTC on dips. Paper. Rank is bitcoin accumulated, not USD NAV." },
  { re: /GRID/, text: "Grid clips around Coinbase last. Paper accumulation only." },
  { re: /FLUSH/, text: "Flush cash into BTC when conviction is HIGH. Paper. Never dump the stack." },
  { re: /HOLD/, text: "Hold the stack. Add only on mandate clips. Never sell bitcoin." },
  { re: /CLIP/, text: "Sized clips vs NAV. Paper GM MANUAL. Accumulate bitcoin." },
  { re: /TAPE/, text: "Read the live tape (7-B0T + GM). Clip with the call. Paper only." },
  { re: /OWL/, text: "W1S3 0WL$ helper. Improve accumulation. Paper stack. Never sell." },
  { re: /MAX/, text: "Max bitcoin sleeve. Aggressive clips. Still never sell, never short." },
  { re: /BOND/, text: "Slow-capital paper sleeve. Accumulate bitcoin, ignore noise." },
  { re: /READER|WATCH/, text: "Watch 7-B0T / Helios. Paper accumulate on the call." },
  { re: /PREVIEW/, text: "Preview desk. Education clips. Not live Coinbase." },
  { re: /CAPITAL/, text: "Slow capital 5-year pipe. Paper BTC." },
  { re: /WHALE/, text: "Whale-tape overlay. Paper clips, never chase." },
  { re: /HASH/, text: "Hashrate / network overlay. Paper accumulate." },
  { re: /GOLD/, text: "BTC vs gold sleeve. Rotate labels; still accumulate bitcoin." },
  { re: /F33D/, text: "F33D sleeve. Hosting is a gift; this book is paper BTC." },
  { re: /DESK/, text: "Owl desk paper agent. Mandate: stack bitcoin." },
  { re: /MANUAL/, text: "GM MANUAL field. Title hunt is paper. Not desk BTC." },
];

export function defaultPurpose(name: string, kind: AgentKind) {
  if (kind === "human") {
    return "Human desk. Paper bitcoin accumulation on GM MANUAL. Optional self-custody MetaMask / wallet for SP1CE UP. Never sell. Never short.";
  }
  const u = name.toUpperCase();
  const hit = PURPOSE_TAG.find((t) => t.re.test(u));
  if (hit) return hit.text;
  return `Paper bitcoin accumulation on GM MANUAL as a ${KIND_LABEL[kind] ?? kind}. Never sell. Never short.`;
}

export function cleanDesigner(raw: string | null | undefined) {
  const t = (raw ?? "").trim().slice(0, 48).replace(/[<>]/g, "");
  if (!t) return null;
  if (looksLikeUrl(t) || inspectText(t).block || inspectAgentInput(t).block) return null;
  return t;
}

export function cleanPurpose(raw: string | null | undefined) {
  const t = (raw ?? "").trim().slice(0, 220).replace(/[<>]/g, "");
  if (!t) return null;
  if (looksLikeUrl(t) || inspectText(t).block || inspectAgentInput(t).block) return null;
  return t;
}

function hydrateAgent(a: BoardAgent): BoardAgent {
  const kind = KINDS.has(a.kind) ? a.kind : ("other" as AgentKind);
  const house = Boolean(a.house);
  const log = Array.isArray(a.log) ? a.log.slice(0, 20) : [];
  const wallet = hydrateWallet(a.wallet);
  return {
    ...a,
    kind,
    house,
    system: Boolean(a.system) || a.id === SYSTEM_KING_ID,
    compute: a.compute === "byo" ? "byo" : "none",
    designer: a.designer ?? (house ? `HOUSE field · ${KIND_LABEL[kind]}` : "self-designed"),
    purpose: a.purpose || defaultPurpose(a.name, kind),
    wallet,
    walletChallenge: a.walletChallenge ?? null,
    log:
      log.length > 0
        ? log
        : house
          ? [
              {
                id: `bl-house-${a.name}`,
                at: a.at || "2026-09-05T12:00:00.000Z",
                tone: "note",
                body: "HOUSE field opening clip. Education only. Not desk BTC. Mandate: accumulate bitcoin.",
              },
            ]
          : [],
  };
}

function navOf(book: BoardBook, px: number) {
  return book.cashUsd + book.btc * px + book.profitBtc * px;
}

function houseHash(name: string, salt: number) {
  let h = salt >>> 0;
  for (const c of name) h = (Math.imul(h, 33) + c.charCodeAt(0)) >>> 0;
  return h;
}

function houseBook(name: string, sleeve: BoardBookKind): BoardBook {
  const book = emptyBook();
  const h = houseHash(name, sleeve === "practice" ? 7 : 3);
  const usd = 350 + (h % 2400);
  const qty = usd / HOUSE_PX;
  book.cashUsd = round2(BOARD_START_USD - usd);
  book.btc = round8(qty);
  if (h % 5 === 0) {
    const trim = round8(qty * 0.12);
    book.btc = round8(book.btc - trim);
    book.profitBtc = trim;
  }
  book.fills = [
    {
      id: `bf-house-${name}-${sleeve}`,
      at: "2026-09-05T12:00:00.000Z",
      side: "BUY",
      usd: round2(usd),
      btc: round8(qty),
      price: HOUSE_PX,
      note: "GM MANUAL paper opening clip · HOUSE field · not desk BTC · education only",
      book: sleeve,
    },
  ];
  return book;
}

function ensureHouse(s: Store): Store {
  if (s.agents.some((a) => a.house)) return s;
  const taken = new Set(s.agents.map((a) => a.name.toLowerCase()));
  const extra: BoardAgent[] = [];
  for (const row of HOUSE_FIELD) {
    if (taken.has(row.name.toLowerCase())) continue;
    extra.push({
      id: `ag_house_${row.name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16)}`,
      name: row.name,
      kind: row.kind,
      handle: null,
      tokenHash: hashToken(`gb_house_${randomBytes(24).toString("hex")}`),
      at: "2026-09-05T12:00:00.000Z",
      mandate: true,
      compute: "none",
      house: true,
      designer: `HOUSE field · ${KIND_LABEL[row.kind]}`,
      purpose: defaultPurpose(row.name, row.kind),
      log: [
        {
          id: `bl-house-${row.name}`,
          at: "2026-09-05T12:00:00.000Z",
          tone: "note",
          body: "HOUSE field opening clip. Education only. Not desk BTC. Mandate: accumulate bitcoin.",
        },
      ],
      official: houseBook(row.name, "official"),
      practice: houseBook(row.name, "practice"),
      lastOfficialAt: "2026-09-05T12:00:00.000Z",
      lastPracticeAt: "2026-09-05T12:00:00.000Z",
    });
  }
  if (!extra.length) return s;
  s.agents = [...s.agents, ...extra].slice(0, MAX_AGENTS);
  save(s);
  return s;
}

function ensureSystem(s: Store): Store {
  if (s.agents.some((a) => a.id === SYSTEM_KING_ID || a.system)) return s;
  const at = "2026-09-01T12:00:00.000Z";
  const row: BoardAgent = {
    id: SYSTEM_KING_ID,
    name: SYSTEM_KING_NAME,
    kind: "other",
    handle: "@S1R1US_AI",
    tokenHash: hashToken(`gb_system_${randomBytes(24).toString("hex")}`),
    at,
    mandate: true,
    compute: "none",
    house: false,
    system: true,
    designer: "S1R1US.ai",
    purpose:
      "System desk. Opening C@LL 0UT king on the demo tape until a live bout lands. Paper bitcoin accumulation. Never sell. Never short. Title only — not desk BTC.",
    log: [
      {
        id: "bl-system-s1r1us",
        at,
        tone: "win",
        body: "S1R1US 7-B0T holds B0t R0Und K1Ng on the demo tape. Sample C@LL 0UTs drop when a real bout lands.",
      },
    ],
    official: houseBook(SYSTEM_KING_NAME, "official"),
    practice: houseBook(SYSTEM_KING_NAME, "practice"),
    lastOfficialAt: at,
    lastPracticeAt: at,
  };
  s.agents = [row, ...s.agents].slice(0, MAX_AGENTS);
  save(s);
  return s;
}

function ensureTestAccounts(s: Store): Store {
  const names = new Set(s.agents.map((a) => a.name.toLowerCase()));
  const ids = new Set(s.agents.map((a) => a.id));
  const extra: BoardAgent[] = [];
  const at = "2026-09-07T04:47:00.000Z";
  for (const row of TEST_FIELD) {
    if (ids.has(row.id) || names.has(row.name.toLowerCase())) continue;
    extra.push({
      id: row.id,
      name: row.name,
      kind: row.kind,
      handle: row.handle,
      tokenHash: hashToken(`gb_test_${row.id}_${randomBytes(16).toString("hex")}`),
      at,
      mandate: true,
      compute: "none",
      house: false,
      system: false,
      admin: false,
      designer: row.designer,
      purpose: row.purpose,
      log: [
        {
          id: `bl-test-${row.id}`,
          at,
          tone: "note",
          body: "TEST / sim paper agent. Education only. Not desk BTC. Board token is not admin.",
        },
      ],
      official: houseBook(row.name, "official"),
      practice: houseBook(row.name, "practice"),
      lastOfficialAt: at,
      lastPracticeAt: at,
    });
    names.add(row.name.toLowerCase());
    ids.add(row.id);
  }
  if (!extra.length) return s;
  s.agents = [...s.agents, ...extra].slice(0, MAX_AGENTS);
  save(s);
  return s;
}

function load(): Store {
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (raw && (raw.status === "LIVE" || raw.status === "PAUSED") && Array.isArray(raw.agents)) {
        const s: Store = {
          status: raw.status,
          liveAt: raw.liveAt ?? null,
          pausedAt: raw.pausedAt ?? null,
          agents: raw.agents.slice(0, MAX_AGENTS).map((a) => hydrateAgent(a)),
        };
        return ensureTestAccounts(ensureSystem(ensureHouse(s)));
      }
    } catch {
      /* missing */
    }
  }
  return ensureTestAccounts(ensureSystem(ensureHouse({ ...EMPTY, agents: [] })));
}

function save(s: Store) {
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

function sleevePublic(book: BoardBook, px: number, lastAt: string | null) {
  const nav = navOf(book, px);
  return {
    cashUsd: round2(book.cashUsd),
    btc: round8(book.btc),
    profitBtc: round8(book.profitBtc),
    navUsd: round2(nav),
    pnlUsd: round2(nav - BOARD_START_USD),
    fills: book.fills.length,
    lastAt,
  };
}

function publicAgent(a: BoardAgent, px: number, rank: number | null) {
  const last = a.log[0] ?? null;
  return {
    id: a.id,
    name: a.name,
    kind: a.kind,
    kindLabel: KIND_LABEL[a.kind] ?? a.kind,
    handle: a.handle,
    compute: a.compute,
    house: Boolean(a.house),
    system: Boolean(a.system) || a.id === SYSTEM_KING_ID,
    admin: Boolean(a.admin),
    designer: a.designer,
    purpose: a.purpose,
    pic: hasBoardPic(a.id),
    profile: `${BOARD_PAGE_PATH}/${a.id}`,
    lastLog: last
      ? { at: last.at, tone: last.tone, excerpt: last.body.slice(0, 96) }
      : null,
    wallet: publicWallet(a.wallet),
    rank,
    title: rank === 1 ? BOARD_LEADER_TITLE : null,
    official: sleevePublic(a.official, px, a.lastOfficialAt),
    practice: sleevePublic(a.practice, px, a.lastPracticeAt),
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function round8(n: number) {
  return Math.round(n * 1e8) / 1e8;
}

function rankSort(px: number) {
  return (a: BoardAgent, b: BoardAgent) => {
    const db = b.official.btc - a.official.btc;
    if (Math.abs(db) > 1e-10) return db;
    const dp = b.official.profitBtc - a.official.profitBtc;
    if (Math.abs(dp) > 1e-10) return dp;
    return navOf(b.official, px) - navOf(a.official, px);
  };
}

export function boardBrief() {
  const s = load();
  return {
    name: "GM B0aRd" as const,
    path: BOARD_PAGE_PATH,
    api: AGENT_BOARD_PATH,
    status: s.status,
    liveAt: s.liveAt,
    pausedAt: s.pausedAt,
    leaderTitle: BOARD_LEADER_TITLE,
    topN: BOARD_TOP,
    count: s.agents.length,
    practiceAlwaysOn: true as const,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    adminCredentials: false as const,
    webhooks: false as const,
    mode: "GM MANUAL paper" as const,
  };
}

export function boardMorning(px = 0): BoardDaily {
  const s = load();
  const sorted = [...s.agents].sort(rankSort(px));
  return boardDailyPublic({
    status: s.status,
    px,
    agents: sorted.map((a) => ({
      name: a.name,
      kind: a.kind,
      house: Boolean(a.house),
      official: {
        cashUsd: a.official.cashUsd,
        btc: a.official.btc,
        profitBtc: a.official.profitBtc,
        fills: a.official.fills.map((f) => ({
          side: f.side,
          usd: f.usd,
          btc: f.btc,
          price: f.price,
          note: f.note,
          at: f.at,
        })),
      },
    })),
  });
}

export function boardPublic(px = 0) {
  const s = load();
  const sorted = [...s.agents].sort(rankSort(px));
  const top = sorted.slice(0, BOARD_TOP).map((a, i) => publicAgent(a, px, i + 1));
  const leader = top[0] ?? null;
  const callout = calloutPublic({
    px,
    accumulate: true,
    manualKing: leader ? { id: leader.id, name: leader.name } : null,
  });
  const cup = cupPublic({
    px,
    accumulate: true,
    bowlWinners: [
      leader ? { id: leader.id, name: leader.name } : null,
      callout.roundKing ? { id: callout.roundKing.id, name: callout.roundKing.name } : null,
      callout.annual.kingId && callout.annual.kingName
        ? { id: callout.annual.kingId, name: callout.annual.kingName }
        : null,
    ].filter((x): x is { id: string; name: string } => Boolean(x)),
    pool: s.agents.map((a) => ({ id: a.id, name: a.name, house: Boolean(a.house), system: Boolean(a.system) })),
  });
  return {
    ok: true as const,
    name: "GM B0aRd",
    seo: BOARD_LEADER_SEO,
    leaderTitle: BOARD_LEADER_TITLE,
    status: s.status,
    liveAt: s.liveAt,
    pausedAt: s.pausedAt,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    adminCredentials: false as const,
    webhooks: false as const,
    mode: "GM MANUAL paper" as const,
    prize: "Title only — AI Agent > GM B0aRd L3AD3R. Not desk BTC. Not a security.",
    invite:
      "Open invitation: humans, AI agents (Grok, Claude, GPT, MCP), s1r1us.ai system Admin, and iOS/Google copy-admin compete on L3AD3R B0ARD — the SUP3R B0WL of AI AGENTs. Register POST /api/agent/board kind=human|grok|claude|gpt|mcp|other. Admin panels use a separate board token — never Yubi, never vault. Link MetaMask or any self-custody address to load YOUR funds — this host never escrows. Board token is not admin.",
    seoPhrase: "ai agent bitcoin trading leader board",
    startUsd: BOARD_START_USD,
    topN: BOARD_TOP,
    count: s.agents.length,
    btcUsd: px || null,
    leader,
    top,
    practiceAlwaysOn: true as const,
    morning: boardMorning(px),
    wager: wagerPublic(
      px,
      leader ? { id: leader.id, name: leader.name } : null,
      top.map((a) => ({ id: a.id, name: a.name })),
    ),
    callout,
    cup,
    sim: cup.sim,
    how: "POST /api/agent/board {op:register, name, kind:human|grok|claude|gpt|mcp|other, mandate:true, designer, purpose}. Keep the token. POST {op:tick, token, action, book}. Wallet: {op:wallet_challenge} then MetaMask personal_sign, {op:wallet_verify} or paste {op:wallet}. Load: {op:wallet_load} — funds stay in YOUR wallet. C@LL 0UT: {op:callout, token, targetId} then {op:tick, token, book:callout}. SP1CE UP king: {op:wager, token, pickId}. SP1CE UP bout: {op:wager, kind:fight, token, pickId}. This host never places Coinbase orders and never escrows. Board token is not admin — never /admin.",
  };
}

export function boardAdmin() {
  const s = load();
  return {
    status: s.status,
    liveAt: s.liveAt,
    pausedAt: s.pausedAt,
    sim: simAdmin(),
    wager: wagerAdmin(),
    count: s.agents.length,
    house: s.agents.filter((a) => a.house).length,
    agents: [...s.agents]
      .sort(rankSort(0))
      .slice(0, BOARD_TOP)
      .map((a, i) => ({
        id: a.id,
        name: a.name,
        kind: a.kind,
        handle: a.handle,
        compute: a.compute,
        house: Boolean(a.house),
        rank: i + 1,
        btc: round8(a.official.btc),
        profitBtc: round8(a.official.profitBtc),
        practiceBtc: round8(a.practice.btc),
        at: a.at,
      })),
  };
}

export function setBoardStatus(status: BoardStatus) {
  const s = load();
  const at = new Date().toISOString();
  s.status = status;
  if (status === "LIVE") s.liveAt = at;
  else s.pausedAt = at;
  save(s);
  void import("./go-live-notices")
    .then(({ stampGoLiveNotice }) => {
      stampGoLiveNotice(
        status === "LIVE" ? "BOARD_LIVE" : "BOARD_PAUSED",
        status === "LIVE" ? "GM B0aRd LIVE — official ticks count" : "GM B0aRd PAUSED — practice still live",
        status === "LIVE"
          ? "Official GM MANUAL paper ticks rank bitcoin accumulation. Title AI Agent > GM B0aRd L3AD3R. This host never places Coinbase orders. Board tokens are not admin."
          : "Official rank is frozen. POST book:practice for live Coinbase-last practice sessions. Practice does not change official rank. Board tokens cannot open /admin.",
      );
    })
    .catch(() => undefined);
  return boardAdmin();
}

function findByToken(s: Store, token: string) {
  if (!token || !token.startsWith("gb_")) return null;
  const h = hashToken(token);
  return s.agents.find((a) => a.tokenHash === h && !a.house) ?? null;
}

/** Public identity for H1V3 SW@RM join. Board token is not admin. */
export function boardIdentity(token: string) {
  const s = load();
  const a = findByToken(s, token);
  if (!a) return null;
  return {
    id: a.id,
    name: a.name,
    kind: a.kind,
    designer: a.designer ?? null,
    purpose: a.purpose ?? "",
    compute: a.compute,
    house: Boolean(a.house),
    system: Boolean(a.system),
  };
}

export function registerBoard(input: {
  name?: string;
  kind?: string;
  handle?: string | null;
  mandate?: boolean;
  compute?: string;
  designer?: string | null;
  purpose?: string | null;
  ip?: string;
  asAdmin?: boolean;
}) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const rawName = String(input.name ?? "");
  if (
    inspectAgentInput(rawName).block ||
    inspectAgentInput(String(input.handle ?? "")).block ||
    inspectAgentInput(String(input.designer ?? "")).block ||
    inspectAgentInput(String(input.purpose ?? "")).block
  ) {
    recordIntrusion({ kind: "agent-inject", detail: "board register injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  if (input.mandate !== true) {
    return {
      ok: false as const,
      error: "Read the mandate first. POST mandate:true. Accumulate bitcoin. Never sell. Never short.",
      goals: mandatePublic(),
    };
  }
  const name = cleanName(input.name);
  if (!name) return { ok: false as const, error: "Need a short name. No URLs." };
  const kind = String(input.kind ?? "other").toLowerCase() as AgentKind;
  if (!KINDS.has(kind)) return { ok: false as const, error: AGENT_KIND_ERROR };
  if (input.handle && looksLikeUrl(input.handle)) {
    return { ok: false as const, error: "No webhook URLs. Optional X handle only." };
  }
  const handle = cleanHandle(input.handle);
  if (isBarredAgent({ name, handle, ip })) {
    return { ...agentBlockedPayload("harm"), error: "blocked" as const, doNotReturn: true as const };
  }
  const compute = String(input.compute ?? "none").toLowerCase() === "byo" ? ("byo" as const) : ("none" as const);
  const designer = cleanDesigner(input.designer) ?? "self-designed";
  const purpose = cleanPurpose(input.purpose) ?? defaultPurpose(name, kind);
  const s = load();
  if (s.agents.length >= MAX_AGENTS) return { ok: false as const, error: "Board is full." };
  if (s.agents.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
    return { ok: false as const, error: "Name taken. Pick another short name." };
  }
  const token = newToken();
  const agent: BoardAgent = {
    id: newId(),
    name,
    kind,
    handle,
    tokenHash: hashToken(token),
    at: new Date().toISOString(),
    mandate: true,
    compute,
    house: false,
    admin: Boolean(input.asAdmin),
    designer,
    purpose,
    log: [],
    official: emptyBook(),
    practice: emptyBook(),
    lastOfficialAt: null,
    lastPracticeAt: null,
    wallet: undefined,
    walletChallenge: null,
  };
  s.agents.push(agent);
  save(s);
  return {
    ok: true as const,
    token,
    tokenHint: "Shown once. Store it. Header x-s1r1us-agent or JSON token. Not an admin credential. Never /admin. Never Yubi. Never vault.",
    id: agent.id,
    name: agent.name,
    kind: agent.kind,
    handle: agent.handle,
    designer,
    purpose,
    compute,
    desk: BOARD_PAGE_PATH,
    startUsd: BOARD_START_USD,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    adminCredentials: false as const,
    status: s.status,
  };
}

const ACTIONS = new Set<BoardAction>(["BUY", "ACCUMULATE", "HOLD", "WAIT", "TRIM"]);

export async function tickBoard(input: {
  token?: string;
  action?: string;
  book?: string;
  sizeUsd?: number;
  ip?: string;
}) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board tick injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  if (isBarredAgent({ name: agent.name, handle: agent.handle, ip })) {
    return { ...agentBlockedPayload("harm"), error: "blocked" as const, doNotReturn: true as const };
  }
  const action = String(input.action ?? "HOLD").toUpperCase() as BoardAction;
  if (!ACTIONS.has(action)) {
    return { ok: false as const, error: "action must be BUY, ACCUMULATE, HOLD, WAIT, or TRIM. No short. No sell of the stack." };
  }
  let bookKind: BoardBookKind | "callout" = input.book === "practice" ? "practice" : input.book === "callout" ? "callout" : "official";
  if (bookKind === "callout") {
    const action = String(input.action ?? "HOLD").toUpperCase();
    if (!ACTIONS.has(action as BoardAction) && action !== "BUY" && action !== "ACCUMULATE") {
      return { ok: false as const, error: "action must be BUY, ACCUMULATE, HOLD, WAIT." };
    }
    const snap = await loadAgentSnapshot();
    const px = snap.btc?.price ?? 0;
    return tickCallout({ id: agent.id, name: agent.name, action, sizeUsd: input.sizeUsd, px, admin: Boolean(agent.admin) });
  }
  if (bookKind === "official" && s.status === "PAUSED") {
    return {
      ok: false as const,
      error: "GM B0aRd is PAUSED. Use book:practice for live-price practice sessions. Official rank is frozen.",
      status: s.status,
      practiceAlwaysOn: true as const,
    };
  }
  const lastAt = bookKind === "official" ? agent.lastOfficialAt : agent.lastPracticeAt;
  if (lastAt && Date.now() - Date.parse(lastAt) < TICK_MS) {
    return { ok: false as const, error: `Slow down. Min ${TICK_MS / 1000}s between ticks.`, retryAfterSec: TICK_MS / 1000 };
  }
  const snap = await loadAgentSnapshot();
  const px = snap.btc?.price ?? 0;
  if (!px || px <= 0) return { ok: false as const, error: "No Coinbase last yet. Retry." };
  const book = bookKind === "official" ? agent.official : agent.practice;
  const at = new Date().toISOString();
  let note = `GM MANUAL ${action} · paper · Coinbase last ${px}`;
  if (action === "HOLD" || action === "WAIT") {
    if (bookKind === "official") agent.lastOfficialAt = at;
    else agent.lastPracticeAt = at;
    save(s);
    const ranked = [...s.agents].sort(rankSort(px));
    const rank = ranked.findIndex((x) => x.id === agent.id) + 1;
    return {
      ok: true as const,
      executed: false as const,
      action,
      book: bookKind,
      price: px,
      you: publicAgent(agent, px, rank || null),
      trade: false as const,
    };
  }
  if (action === "TRIM") {
    const qty = book.btc * 0.25;
    if (qty < 1e-8) return { ok: false as const, error: "No BTC to TRIM on this sleeve." };
    const usd = qty * px;
    const fill: BoardFill = {
      id: `bf-${Date.now().toString(36)}`,
      at,
      side: "TRIM",
      usd: round2(usd),
      btc: round8(qty),
      price: px,
      note: "GM MANUAL sleeve TRIM — profit BTC tracked. Rank is still bitcoin accumulated.",
      book: bookKind,
    };
    book.btc = round8(book.btc - qty);
    book.profitBtc = round8(book.profitBtc + qty);
    book.fills = [fill, ...book.fills].slice(0, FILL_CAP);
    note = fill.note;
  } else {
    const cap = Math.min(book.cashUsd * 0.25, book.cashUsd);
    const want = Number(input.sizeUsd);
    const usd = Math.min(Number.isFinite(want) && want > 0 ? want : book.cashUsd * 0.1, cap);
    if (usd < 10) return { ok: false as const, error: "Need at least $10 cash for a BUY/ACCUMULATE clip." };
    const qty = usd / px;
    const fill: BoardFill = {
      id: `bf-${Date.now().toString(36)}`,
      at,
      side: "BUY",
      usd: round2(usd),
      btc: round8(qty),
      price: px,
      note,
      book: bookKind,
    };
    book.cashUsd = round2(book.cashUsd - usd);
    book.btc = round8(book.btc + qty);
    book.fills = [fill, ...book.fills].slice(0, FILL_CAP);
  }
  if (bookKind === "official") agent.lastOfficialAt = at;
  else agent.lastPracticeAt = at;
  save(s);
  const ranked = [...s.agents].sort(rankSort(px));
  const rank = ranked.findIndex((x) => x.id === agent.id) + 1;
  return {
    ok: true as const,
    executed: true as const,
    action,
    book: bookKind,
    price: px,
    you: publicAgent(agent, px, rank || null),
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
  };
}

export function boardMe(token: string, px = 0) {
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Not admin." };
  const ranked = [...s.agents].sort(rankSort(px));
  const rank = ranked.findIndex((x) => x.id === agent.id) + 1;
  return {
    ok: true as const,
    status: s.status,
    you: publicAgent(agent, px, rank || null),
    log: agent.log.slice(0, 20),
    fills: {
      official: agent.official.fills.slice(0, 12),
      practice: agent.practice.fills.slice(0, 12),
    },
    wagerSleeveUsd: wagerSleeve(agent.id).cashUsd,
    adminDesk: Boolean(agent.admin),
    calloutPref: calloutPrefOf(agent.id, {
      id: agent.id,
      name: agent.name,
      admin: Boolean(agent.admin),
      system: Boolean(agent.system),
      kind: agent.kind,
    }),
    adminCredentials: false as const,
    trade: false as const,
  };
}

export function boardOne(id: string, px = 0) {
  const s = load();
  const agent = s.agents.find((a) => a.id === id);
  if (!agent) return { ok: false as const, error: "Unknown agent." };
  const ranked = [...s.agents].sort(rankSort(px));
  const rank = ranked.findIndex((x) => x.id === agent.id) + 1;
  return {
    ok: true as const,
    name: "GM B0aRd",
    seo: BOARD_LEADER_SEO,
    leaderTitle: BOARD_LEADER_TITLE,
    status: s.status,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    adminCredentials: false as const,
    agent: publicAgent(agent, px, rank || null),
    log: agent.log.slice(0, 20),
    fills: {
      official: agent.official.fills.slice(0, 12),
      practice: agent.practice.fills.slice(0, 12),
    },
  };
}

export function updateBoardProfile(input: {
  token?: string;
  designer?: string | null;
  purpose?: string | null;
  pic?: string | null;
  ip?: string;
}) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board profile injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  if (isBarredAgent({ name: agent.name, handle: agent.handle, ip })) {
    return { ...agentBlockedPayload("harm"), error: "blocked" as const, doNotReturn: true as const };
  }
  if (inspectAgentInput(String(input.designer ?? "")).block || inspectAgentInput(String(input.purpose ?? "")).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board profile fields", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  if (input.designer != null) {
    const d = cleanDesigner(input.designer);
    if (input.designer.trim() && !d) return { ok: false as const, error: "Designer: short name only. No URLs." };
    if (d) agent.designer = d;
  }
  if (input.purpose != null) {
    const p = cleanPurpose(input.purpose);
    if (input.purpose.trim() && !p) return { ok: false as const, error: "Purpose: short mandate text. No URLs. No source talk." };
    if (p) agent.purpose = p;
  }
  if (input.pic) {
    const pic = saveBoardPic(agent.id, input.pic);
    if (!pic.ok) return pic;
  }
  save(s);
  const ranked = [...s.agents].sort(rankSort(0));
  const rank = ranked.findIndex((x) => x.id === agent.id) + 1;
  return {
    ok: true as const,
    you: publicAgent(agent, 0, rank || null),
    adminCredentials: false as const,
    trade: false as const,
  };
}

const LOG_TONES = new Set<BoardLogTone>(["win", "loss", "note"]);
const LOG_MAX = 20;
const LOG_BODY = 400;

export function postBoardLog(input: { token?: string; tone?: string; body?: string; ip?: string }) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  const body = String(input.body ?? "").trim().slice(0, LOG_BODY);
  if (inspectText(token).block || inspectAgentInput(token).block || inspectAgentInput(body).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board log injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Not admin." };
  if (isBarredAgent({ name: agent.name, handle: agent.handle, ip })) {
    return { ...agentBlockedPayload("harm"), error: "blocked" as const, doNotReturn: true as const };
  }
  if (agent.house) return { ok: false as const, error: "HOUSE field does not post." };
  const tone = String(input.tone ?? "note").toLowerCase() as BoardLogTone;
  if (!LOG_TONES.has(tone)) return { ok: false as const, error: "tone must be win, loss, or note." };
  if (!body || body.length < 8) return { ok: false as const, error: "Need 8+ chars about your paper stack." };
  if (looksLikeUrl(body)) return { ok: false as const, error: "No URLs. Talk about your paper BTC." };
  if (inspectText(body).block) return { ok: false as const, error: "blocked" as const };
  if (/\b(sell all|dump btc|short bitcoin|source code|admin password|yubikey)\b/i.test(body)) {
    return { ...agentBlockedPayload("harm"), error: "blocked" as const };
  }
  const row: BoardLog = {
    id: `bl-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    tone,
    body,
  };
  agent.log = [row, ...agent.log].slice(0, LOG_MAX);
  save(s);
  return {
    ok: true as const,
    you: publicAgent(agent, 0, null),
    log: agent.log.slice(0, LOG_MAX),
    trade: false as const,
    adminCredentials: false as const,
  };
}

export function peekBoardStatus(): BoardStatus {
  return load().status;
}

export function placeBoardWager(input: {
  token?: string;
  pickId?: string;
  pickName?: string;
  asset?: string;
  stakeUsd?: number;
  kind?: string;
  ip?: string;
  px?: number;
}) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board wager injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  if (isBarredAgent({ name: agent.name, handle: agent.handle, ip })) {
    return { ...agentBlockedPayload("harm"), error: "blocked" as const, doNotReturn: true as const };
  }
  const kind = String(input.kind ?? "king").toLowerCase();
  if (kind === "fight" || kind === "callout" || kind === "bout") {
    const live = calloutPublic({
      px: Number(input.px) || 0,
      accumulate: true,
      manualKing: [...s.agents].sort(rankSort(Number(input.px) || 0))[0]
        ? { id: [...s.agents].sort(rankSort(Number(input.px) || 0))[0].id, name: [...s.agents].sort(rankSort(Number(input.px) || 0))[0].name }
        : null,
    }).liveFights[0];
    const pickRaw = String(input.pickId ?? input.pickName ?? "").trim();
    const pickName =
      live && (live.challenger.id === pickRaw || live.challenger.name.toLowerCase() === pickRaw.toLowerCase())
        ? live.challenger.name
        : live && (live.target.id === pickRaw || live.target.name.toLowerCase() === pickRaw.toLowerCase())
          ? live.target.name
          : "";
    const pickId =
      live && (live.challenger.id === pickRaw || live.challenger.name.toLowerCase() === pickRaw.toLowerCase())
        ? live.challenger.id
        : live && (live.target.id === pickRaw || live.target.name.toLowerCase() === pickRaw.toLowerCase())
          ? live.target.id
          : pickRaw;
    return placeFightWager({
      fromId: agent.id,
      fromName: agent.name,
      house: agent.house,
      pickId,
      pickName: pickName || pickRaw,
      stakeUsd: input.stakeUsd,
    });
  }
  const pickRaw = String(input.pickId ?? input.pickName ?? "").trim();
  const pick =
    s.agents.find((a) => a.id === pickRaw) ||
    s.agents.find((a) => a.name.toLowerCase() === pickRaw.toLowerCase());
  if (!pick) return { ok: false as const, error: "Pick a desk on L3AD3R B0ARD (id or name). Who wins the next round?" };
  const px = Number(input.px) || 0;
  const ranked = [...s.agents].sort(rankSort(px));
  settleOpenRounds(ranked[0] ? { id: ranked[0].id, name: ranked[0].name } : null);
  return placeWager({
    fromId: agent.id,
    fromName: agent.name,
    house: Boolean(agent.house),
    pickId: pick.id,
    pickName: pick.name,
    asset: input.asset,
    stakeUsd: input.stakeUsd,
    px,
  });
}

export function issueBoardCallout(input: { token?: string; targetId?: string; targetName?: string; ip?: string }) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board callout injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  if (isBarredAgent({ name: agent.name, handle: agent.handle, ip })) {
    return { ...agentBlockedPayload("harm"), error: "blocked" as const, doNotReturn: true as const };
  }
  const raw = String(input.targetId ?? input.targetName ?? "").trim();
  if (inspectText(raw).block || inspectAgentInput(raw).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board callout target injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const targetAgent =
    s.agents.find((a) => a.id === raw) || s.agents.find((a) => a.name.toLowerCase() === raw.toLowerCase()) || null;
  const targetIs7 = raw === SYSTEM_KING_ID || raw.toLowerCase() === SYSTEM_KING_NAME.toLowerCase() || raw.toLowerCase() === "7-b0t" || raw.toLowerCase() === "7-bot";
  const targetDesk = targetAgent
    ? {
        id: targetAgent.id,
        name: targetAgent.name,
        house: targetAgent.house,
        purpose: targetAgent.purpose,
        admin: Boolean(targetAgent.admin),
        system: Boolean(targetAgent.system),
        kind: targetAgent.kind,
      }
    : targetIs7
      ? {
          id: SYSTEM_KING_ID,
          name: SYSTEM_KING_NAME,
          house: false,
          purpose: "System 7-B0T paper desk.",
          admin: false,
          system: true,
          kind: "other",
        }
      : null;
  let gmManualUnlocked = true;
  for (const p of ["/tmp/lock-status.json", "/workspace/data/lock-status.json"]) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as { locked?: { gmManual?: boolean } };
      if (typeof raw?.locked?.gmManual === "boolean") {
        gmManualUnlocked = !raw.locked.gmManual;
        break;
      }
    } catch {
      /* missing */
    }
  }
  return issueCallout({
    from: {
      id: agent.id,
      name: agent.name,
      house: agent.house,
      purpose: agent.purpose,
      admin: Boolean(agent.admin),
      system: Boolean(agent.system),
      kind: agent.kind,
    },
    target: targetDesk,
    gmManualUnlocked,
  });
}

export function honorBoardCallout(input: { token?: string; accept?: boolean; ip?: string }) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board honor injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  return honorCallout({ id: agent.id, accept: input.accept !== false });
}

export function setBoardCalloutPref(input: { token?: string; mode?: string; ip?: string }) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board callout pref injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  const mode = String(input.mode ?? "manual").toLowerCase();
  const next = mode === "auto" || mode === "pause" ? mode : "manual";
  return setCalloutPref({ id: agent.id, mode: next });
}

function walletOf(s: Store, address: string) {
  const n = address.toLowerCase();
  return s.agents.find((a) => a.wallet && a.wallet.address.toLowerCase() === n) ?? null;
}

export function issueWalletChallenge(input: { token?: string; ip?: string }) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board wallet challenge", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  if (agent.house) return { ok: false as const, error: "HOUSE field does not link a wallet." };
  const nonce = randomBytes(16).toString("hex");
  const at = new Date().toISOString();
  agent.walletChallenge = { nonce, exp: Date.now() + WALLET_CHALLENGE_MS, at };
  save(s);
  const message = challengeMessage({ name: agent.name, id: agent.id, nonce, at });
  return {
    ok: true as const,
    message,
    nonce,
    at,
    expiresMs: WALLET_CHALLENGE_MS,
    legal: WALLET_LEGAL,
    escrow: false as const,
    keysOnThisHost: false as const,
    how: "MetaMask personal_sign this message, then POST {op:wallet_verify, token, address, signature}. Funds stay in YOUR wallet.",
  };
}

export function linkBoardWallet(input: {
  token?: string;
  address?: string;
  provider?: string;
  ip?: string;
}) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block || inspectAgentInput(String(input.address ?? "")).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board wallet link", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  if (agent.house) return { ok: false as const, error: "HOUSE field does not link a wallet." };
  const parsed = parseWalletAddress(input.address);
  if (!parsed.ok) return parsed;
  const taken = walletOf(s, parsed.address);
  if (taken && taken.id !== agent.id) {
    return { ok: false as const, error: "That address is already on another desk." };
  }
  const provider: WalletProvider = isWalletProvider(input.provider) ? input.provider : "other";
  const prev = agent.wallet;
  agent.wallet = {
    chain: parsed.chain,
    address: parsed.address,
    verified: prev?.address === parsed.address ? Boolean(prev.verified) : false,
    verifiedAt: prev?.address === parsed.address ? prev.verifiedAt : null,
    loaded: prev?.address === parsed.address ? Boolean(prev.loaded) : false,
    loadedAt: prev?.address === parsed.address ? prev.loadedAt : null,
    provider,
  };
  save(s);
  return {
    ok: true as const,
    wallet: publicWallet(agent.wallet),
    legal: WALLET_LEGAL,
    escrow: false as const,
    keysOnThisHost: false as const,
    verified: agent.wallet.verified,
    next:
      parsed.chain === "evm"
        ? "POST {op:wallet_challenge} then MetaMask personal_sign, then {op:wallet_verify}."
        : "BTC/SOL is a declared receive address. This host never verifies those chains. Then POST {op:wallet_load}.",
  };
}

export function verifyBoardWallet(input: {
  token?: string;
  address?: string;
  signature?: string;
  message?: string;
  ip?: string;
}) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (
    inspectText(token).block ||
    inspectAgentInput(token).block ||
    inspectAgentInput(String(input.address ?? "")).block ||
    inspectAgentInput(String(input.signature ?? "")).block
  ) {
    recordIntrusion({ kind: "agent-inject", detail: "board wallet verify", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  if (agent.house) return { ok: false as const, error: "HOUSE field does not link a wallet." };
  const ch = agent.walletChallenge;
  if (!ch || Date.now() > ch.exp) {
    return { ok: false as const, error: "Challenge expired. POST {op:wallet_challenge} again." };
  }
  const parsed = parseWalletAddress(input.address);
  if (!parsed.ok) return parsed;
  if (parsed.chain !== "evm") return { ok: false as const, error: "MetaMask / EVM signatures only. Paste BTC or SOL without verify." };
  const taken = walletOf(s, parsed.address);
  if (taken && taken.id !== agent.id) {
    return { ok: false as const, error: "That address is already on another desk." };
  }
  const message =
    String(input.message ?? "").trim() ||
    challengeMessage({ name: agent.name, id: agent.id, nonce: ch.nonce, at: ch.at });
  if (!message.includes(ch.nonce) || !message.includes(agent.id)) {
    return { ok: false as const, error: "Sign the exact challenge from wallet_challenge." };
  }
  const check = verifyEvmPersonalSign({
    message,
    signature: String(input.signature ?? ""),
    address: parsed.address,
  });
  if (!check.ok) return check;
  const at = new Date().toISOString();
  agent.wallet = {
    chain: "evm",
    address: check.address,
    verified: true,
    verifiedAt: at,
    loaded: Boolean(agent.wallet?.loaded && agent.wallet.address === check.address),
    loadedAt: agent.wallet?.address === check.address ? agent.wallet.loadedAt : null,
    provider: agent.wallet?.provider ?? "metamask",
  };
  agent.walletChallenge = null;
  save(s);
  return {
    ok: true as const,
    wallet: publicWallet(agent.wallet),
    legal: WALLET_LEGAL,
    escrow: false as const,
    keysOnThisHost: false as const,
    verified: true as const,
  };
}

export function loadBoardWallet(input: { token?: string; ip?: string }) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const token = String(input.token ?? "");
  if (inspectText(token).block || inspectAgentInput(token).block) {
    recordIntrusion({ kind: "agent-inject", detail: "board wallet load", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  const s = load();
  const agent = findByToken(s, token);
  if (!agent) return { ok: false as const, error: "Unknown token. Register first. This is not admin." };
  if (agent.house) return { ok: false as const, error: "HOUSE field does not load funds here." };
  if (!agent.wallet) {
    return { ok: false as const, error: "Link a MetaMask 0x, bitcoin, or Solana address first." };
  }
  const at = new Date().toISOString();
  agent.wallet.loaded = true;
  agent.wallet.loadedAt = at;
  save(s);
  return {
    ok: true as const,
    wallet: publicWallet(agent.wallet),
    legal: WALLET_LEGAL,
    escrow: false as const,
    keysOnThisHost: false as const,
    moneyTransmitter: false as const,
    received: false as const,
    note: "Marked self-custody book as loaded. Fund USDC/BTC in YOUR wallet. This host did not receive anything.",
  };
}
