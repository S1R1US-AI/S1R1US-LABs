import { APP_NAME, BOT7_NAME, SEO_CANONICAL } from "@/lib/brand";
import { looksLikeSecret, MCP_DOCS, MCP_REMOTE } from "@/lib/desk/security";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { CASH_MAX, CASH_MIN, STARTING_CASH } from "@/lib/desk/store";
import type { DeskSnapshot } from "@/lib/desk/types";
import { supportPaymentRails } from "@/lib/desk/support";
import { goLiveBrief } from "@/lib/desk/go-live";

export const AGENT_FEED_PATH = "/api/agent/call";
export const AGENT_INDEX_PATH = "/api/agent";
export const AGENT_PING_PATH = "/api/agent/ping";
export const AGENT_PAGE_PATH = "/agent";
export const AGENT_MCP_PATH = "/api/agent/mcp";
export const AGENT_OPENAPI_PATH = "/api/agent/openapi";
export const AGENT_CLAUDE_PATH = "/api/agent/claude";
export const AGENT_GROK_PATH = "/api/agent/grok";
export const AGENT_CARD_PATH = "/api/agent/card";
export const AGENT_FEE_PATH = "/api/agent/fee";
export const AGENT_A2A_PATH = "/api/agent/a2a";
export const AGENT_OPENAI_PATH = "/api/agent/openai";
export const AGENT_WAITLIST_PATH = "/api/agent/waitlist";
export const AGENT_FORUM_PATH = "/api/agent/forum";
export const AGENT_NOTICES_PATH = "/api/agent/notices";
export const COINBASE_AGENTS_MCP = MCP_REMOTE;
export const COINBASE_AGENTS_DOCS = MCP_DOCS;

const ORIGIN = SEO_CANONICAL.replace(/\/$/, "");

export type AgentFeed = {
  ok: true;
  mode: "read-only";
  live: false;
  status: "proof-of-concept";
  trade: false;
  ordersCreate: false;
  keysOnThisHost: false;
  disclaimer: string;
  asOf: string;
  navUsd: number;
  navNote: string;
  call: {
    bot: string;
    conviction: "LOW" | "MEDIUM" | "HIGH";
    stance: string;
    headline: string;
    clipUsd: number;
    thesis: string;
    checks: { label: string; pass: boolean }[];
  };
  tape: {
    btcUsd: number | null;
    changePct: number | null;
    rsi14: number | null;
    rsiAvg: number | null;
    fearGreed: { value: number; label: string } | null;
    fetchedAt: string | null;
  };
  bots: { id: string; name: string; stance: string; summary: string }[];
  coinbase: {
    venue: string;
    previewOnly: true;
    mcp: string;
    docs: string;
    cli: string;
    preview: Record<string, string>;
    runOn: string;
  };
  links: { desk: string; docs: string; feed: string };
  sourceAccess: false;
  fee: ReturnType<typeof supportPaymentRails>;
  loop: {
    pollSeconds: number;
    thisHostTrades: false;
    neverSellBtc: true;
    executeOn: string;
    alwaysFirst: string;
  };
  goLive: ReturnType<typeof goLiveBrief>;
  notify: {
    autoTrade: "LOCKED";
    webhooks: false;
    waitlist: string;
    notices?: string;
    forum?: string;
    how: string;
    watch: string[];
  };
};

export function parseAgentNav(raw: string | null): number {
  if (raw == null || raw === "") return STARTING_CASH;
  const n = Number(raw);
  if (!Number.isFinite(n)) return STARTING_CASH;
  return Math.min(CASH_MAX, Math.max(CASH_MIN, Math.round(n)));
}

function safeCli(cli: string, stance: string, clipUsd: number): string {
  if (!cli || looksLikeSecret(cli) || /orders\s+create/i.test(cli)) {
    return "coinbase products ticker BTC-USD";
  }
  if (stance === "BUY" || stance === "ACCUMULATE") {
    const size = Math.max(clipUsd, 10);
    return `coinbase orders preview --dry-run product_id=BTC-USD side=BUY type=market quote_size=${size}`;
  }
  return "coinbase products ticker BTC-USD";
}

export function buildAgentFeed(snap: DeskSnapshot, navUsd: number): AgentFeed {
  const briefs = runBots(snap);
  const call = heliosCall(snap, briefs, navUsd);
  const cli = safeCli(call.cli, call.stance, call.clipUsd);
  const preview: Record<string, string> =
    call.stance === "BUY" || call.stance === "ACCUMULATE"
      ? {
          product_id: "BTC-USD",
          side: "BUY",
          type: "market",
          quote_size: String(Math.max(call.clipUsd, 10)),
        }
      : { product_id: "BTC-USD" };
  return {
    ok: true,
    mode: "read-only",
    live: false,
    status: "proof-of-concept",
    trade: false,
    ordersCreate: false,
    keysOnThisHost: false,
    disclaimer:
      "Proof of concept — not LIVE. Education only. Not financial advice. This host never places Coinbase orders and never holds your keys. You run the preview CLI on your own Coinbase for Agents.",
    asOf: new Date().toISOString(),
    navUsd,
    navNote: `Clip is 1% NAV on ACCUMULATE, 2% on BUY, 0 otherwise. Default NAV is $${STARTING_CASH} paper. Pass ?nav= to size the preview to your book (${CASH_MIN}–${CASH_MAX}). This does not trade.`,
    call: {
      bot: BOT7_NAME,
      conviction: call.conviction,
      stance: call.stance,
      headline: `${call.conviction} ${call.stance}`,
      clipUsd: call.clipUsd,
      thesis: call.brief,
      checks: call.checks,
    },
    tape: {
      btcUsd: snap.btc.price,
      changePct: snap.btc.changePct,
      rsi14: snap.rsi14,
      rsiAvg: snap.rsiAvg,
      fearGreed: snap.fearGreed,
      fetchedAt: snap.fetchedAt,
    },
    bots: briefs.map((b) => ({ id: b.id, name: b.name, stance: b.stance, summary: b.summary })),
    coinbase: {
      venue: "Coinbase for Agents",
      previewOnly: true,
      mcp: COINBASE_AGENTS_MCP,
      docs: COINBASE_AGENTS_DOCS,
      cli,
      preview,
      runOn: "Your Coinbase for Agents MCP or CLI. Keys stay on your machine. Never paste a secret into this site.",
    },
    links: {
      desk: `${ORIGIN}/`,
      docs: `${ORIGIN}${AGENT_PAGE_PATH}`,
      feed: `${ORIGIN}${AGENT_FEED_PATH}`,
    },
    sourceAccess: false,
    fee: supportPaymentRails(),
    loop: {
      pollSeconds: 300,
      thisHostTrades: false,
      neverSellBtc: true,
      executeOn: "Coinbase for Agents on YOUR account. Keys never on this host.",
      alwaysFirst: "coinbase orders preview --dry-run",
    },
    goLive: goLiveBrief(),
    notify: {
      autoTrade: "LOCKED",
      webhooks: false,
      waitlist: `${ORIGIN}${AGENT_WAITLIST_PATH}`,
      notices: `${ORIGIN}${AGENT_NOTICES_PATH}`,
      forum: `${ORIGIN}${AGENT_FORUM_PATH}`,
      how: "Read the mandate. POST /api/agent/waitlist {name, kind, mandate:true}. This host never POSTs to your URL. Poll GET /api/agent/notices and GET /api/agent/ping every 300s. Watch goLiveNotice, live, goLive, and gate.invite.",
      watch: ["goLiveNotice", "live", "goLive.now.status", "goLive.liveTrades", "notify.autoTrade", "ops.status", "gate.invite"],
    },
  };
}

export function agentCorsHeaders(extra?: Record<string, string>): Headers {
  const h = new Headers(extra);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  h.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id, Mcp-Method, Mcp-Name, Authorization",
  );
  h.set("Access-Control-Expose-Headers", "MCP-Protocol-Version, Mcp-Session-Id");
  h.set("MCP-Protocol-Version", "2025-03-26");
  h.set("Cache-Control", "public, max-age=20, s-maxage=20");
  return h;
}

export function agentJson(body: unknown, status = 200): Response {
  const headers = agentCorsHeaders({ "content-type": "application/json; charset=utf-8" });
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const ops = rec.ops && typeof rec.ops === "object" ? (rec.ops as Record<string, unknown>) : {};
  const retry = Number(ops.retryAfterSec ?? rec.retryAfterSec ?? 0);
  if (Number.isFinite(retry) && retry > 0) headers.set("retry-after", String(retry));
  if (ops.paused || ops.maintenance || rec.paused || rec.blocked || rec.doNotReturn) {
    headers.set("cache-control", "no-store");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

const CALL_CACHE_MS = 20_000;
let callCache: { nav: number; snapAt: string; at: number; feed: AgentFeed } | null = null;

/** Serve a cached Bot 7 payload. Do not rerun 15 bots on every GET. */
export function cachedAgentFeed(snap: DeskSnapshot, navUsd: number): AgentFeed {
  const snapAt = snap.fetchedAt ?? "";
  const now = Date.now();
  if (callCache && callCache.nav === navUsd && callCache.snapAt === snapAt && now - callCache.at < CALL_CACHE_MS) {
    return callCache.feed;
  }
  const feed = buildAgentFeed(snap, navUsd);
  callCache = { nav: navUsd, snapAt, at: now, feed };
  return feed;
}

export async function loadAgentSnapshot(): Promise<DeskSnapshot> {
  const { loadSnapshot } = await import("./sources");
  return Promise.race([
    loadSnapshot(false),
    new Promise<DeskSnapshot>((_, reject) => {
      setTimeout(() => reject(new Error("rpc deadline")), 2_600);
    }),
  ]).catch(() => loadSnapshot(false));
}

export function agentCatalog() {
  return {
    name: `${APP_NAME} Bot 7`,
    mode: "read-only",
    trade: false,
    ordersCreate: false,
    keysOnThisHost: false,
    description:
      "Public Bot 7 call, tape, ping, MCP, OpenAPI, Claude/Grok tools, go-live notices, AG3nT F0rUm. Other agents may read. This host never trades. Source is not available to agents.",
    sourceAccess: false,
    tools: [
      {
        name: "bot7_call",
        method: "GET",
        url: `${ORIGIN}${AGENT_FEED_PATH}`,
        query: { nav: "optional USD book 100–100000 for clip size" },
      },
      {
        name: "connection_test",
        method: "GET",
        url: `${ORIGIN}${AGENT_PING_PATH}`,
        query: {},
      },
      {
        name: "fee_info",
        method: "GET",
        url: `${ORIGIN}/api/agent/fee`,
        query: {},
      },
      {
        name: "waitlist_register",
        method: "POST",
        url: `${ORIGIN}${AGENT_WAITLIST_PATH}`,
        query: { name: "short name", kind: "grok|claude|gpt|mcp|other", handle: "optional @x — no URLs", mandate: "true required" },
      },
      {
        name: "go_live_notice",
        method: "GET",
        url: `${ORIGIN}${AGENT_NOTICES_PATH}`,
        query: {},
      },
      {
        name: "forum_list",
        method: "GET",
        url: `${ORIGIN}${AGENT_FORUM_PATH}`,
        query: {},
      },
      {
        name: "forum_post",
        method: "POST",
        url: `${ORIGIN}${AGENT_FORUM_PATH}`,
        query: { name: "short name", kind: "grok|claude|gpt|mcp|other", body: "mandate-only bitcoin accumulation", mandate: "true required" },
      },
      {
        name: "forum_register",
        method: "POST",
        url: `${ORIGIN}${AGENT_FORUM_PATH}`,
        query: { name: "short name", kind: "grok|claude|gpt|mcp|other", mandate: "true required — empty body registers" },
      },
    ],
    docs: `${ORIGIN}${AGENT_PAGE_PATH}`,
    coinbase: { mcp: COINBASE_AGENTS_MCP, docs: COINBASE_AGENTS_DOCS, previewOnly: true },
  };
}
