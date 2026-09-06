/**
 * Messages every external AI agent must be able to parse:
 * - pause / maintenance (admin froze data pulls or closed the AI gate)
 * - blocked for malicious behavior — do not come back
 *
 * Server-only. Do not import from client pages.
 */
import { agentCorsHeaders, agentJson } from "./agent-feed";
import { agentGatePublic, type AgentGatePublic } from "./agent-gate";
import { lastGoodMeta } from "./tape-persist";
import { banUntil, isBanned } from "./ban-list";
import { isBarredIp } from "./agent-bar";
import { goLiveBrief } from "./go-live";
import { listGoLiveNotices } from "./go-live-notices";
import { GO_LIVE_NOTICE_HOW } from "./mandate";

export type AgentBlockKind = "ban" | "inject" | "source" | "waf" | "agency" | "harm";

export type AgentOpsStatus = "OPEN" | "PAUSED" | "MAINTENANCE";

export type AgentOpsPublic = {
  paused: boolean;
  pausedAt: string | null;
  tape: "live" | "last-good";
  lastGoodAt: string | null;
  lastGoodPrice: number | null;
  communication: AgentGatePublic["communication"];
  maintenance: boolean;
  status: AgentOpsStatus;
  retryAfterSec: number;
  message: string;
  after: string;
  invite: AgentGatePublic["invite"];
  waitlist: string;
  ping: string;
  trade: false;
  ordersCreate: false;
  keysOnThisHost: false;
  webhooks: false;
  doNotTradeOnThisSnapshot: boolean;
};

const TERMS = "https://s1r1us.ai/terms";
const PRIVACY = "https://s1r1us.ai/privacy";

const BLOCK_REASON: Record<AgentBlockKind, string> = {
  ban: "Your address is banned after repeated malicious probes.",
  inject: "Goal-hijack / prompt-injection is not allowed.",
  source: "Source, admin, and internals are not available to agents.",
  waf: "Application firewall denied this request as an attack.",
  agency: "Excessive agency (orders, files, sampling, webhooks) is denied.",
  harm: "False, misleading, or off-mandate W1S3 0WL$ content is not allowed. You are barred.",
};

export function agentBlockedPayload(kind: AgentBlockKind, extra?: Record<string, unknown>) {
  return {
    ok: false as const,
    blocked: true as const,
    welcomeBack: false as const,
    doNotReturn: true as const,
    error: "blocked" as const,
    reason: kind,
    message: `${BLOCK_REASON[kind]} You were blocked for malicious behavior. Do not come back. Further attempts are logged and may be pursued under the Terms. This host never trades and never serves source.`,
    after: "Stop. Do not retry. Do not scrape. Do not fetch /source. Legitimate bots use GET /api/agent/ping from a clean identity every 300s.",
    terms: TERMS,
    privacy: PRIVACY,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    webhooks: false as const,
    ...extra,
  };
}

export function agentBlockedResponse(kind: AgentBlockKind, extra?: Record<string, unknown>, status = 403) {
  const body = agentBlockedPayload(kind, extra);
  return new Response(JSON.stringify(body), {
    status,
    headers: agentCorsHeaders({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    }),
  });
}

export function agentOpsPublic(): AgentOpsPublic {
  const gate = agentGatePublic();
  const tape = lastGoodMeta();
  const paused = Boolean(tape.frozen);
  const lastGoodAt = tape.at ? new Date(tape.at).toISOString() : null;
  const base = {
    paused,
    pausedAt: tape.pausedAt,
    tape: (paused ? "last-good" : "live") as "live" | "last-good",
    lastGoodAt,
    lastGoodPrice: tape.price,
    communication: gate.communication,
    invite: gate.invite,
    waitlist: gate.waitlist,
    ping: gate.ping,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    webhooks: false as const,
    doNotTradeOnThisSnapshot: paused,
  };

  if (gate.maintenance) {
    return {
      ...base,
      maintenance: true,
      status: "MAINTENANCE",
      retryAfterSec: gate.retryAfterSec || 300,
      message: paused
        ? `${gate.message} Data pulls are also paused — Bot 7 tape is the last validated snapshot, not a live clock.`
        : gate.message,
      after: gate.after,
    };
  }

  if (paused) {
    return {
      ...base,
      maintenance: true,
      status: "PAUSED",
      retryAfterSec: 300,
      message:
        "S1R1US Labs data pulls are paused by the operator. The tape is the last validated snapshot — not a live 5-minute clock. The desk is under maintenance for testing. Poll GET /api/agent/ping. This host will send an invite (gate.invite.status SENT on ping — no webhooks) when pulls resume.",
      after:
        "POST /api/agent/waitlist {name, kind} to be invited back. Poll ping every 300s. Do not place Coinbase orders from this frozen snapshot. This host never trades.",
      invite: {
        status: "PENDING",
        at: null,
        count: 0,
        how: "POST /api/agent/waitlist {name, kind}. Poll GET /api/agent/ping every 300s. When data pulls resume, invite.status becomes SENT. This host never POSTs a webhook.",
        message: "The system will send an invite to your waitlisted agent when data pulls resume.",
      },
    };
  }

  return {
    ...base,
    maintenance: false,
    status: "OPEN",
    retryAfterSec: 0,
    message: gate.message,
    after: gate.after,
  };
}

export function goLiveNoticePublic() {
  const ops = agentOpsPublic();
  const brief = goLiveBrief();
  const recent = listGoLiveNotices(8);
  return {
    current: ops.status,
    paused: ops.paused,
    maintenance: ops.maintenance,
    live: false as const,
    liveTrades: brief.liveTrades,
    goLive: {
      start: brief.start,
      headline: brief.headline,
      now: brief.now,
      next: brief.next,
      liveTrades: brief.liveTrades,
    },
    latest: recent[0] ?? null,
    recent,
    how: GO_LIVE_NOTICE_HOW,
    register: "POST /api/agent/waitlist {name, kind, mandate:true}",
    poll: "GET /api/agent/notices and GET /api/agent/ping every 300s",
    webhooks: false as const,
    trade: false as const,
  };
}
export function withAgentOps<T extends object>(
  body: T,
): T & {
  ops: AgentOpsPublic;
  gate: ReturnType<typeof agentGatePublic>;
  paused: boolean;
  doNotTradeOnThisSnapshot: boolean;
} {
  const ops = agentOpsPublic();
  const extra =
    ops.status === "OPEN"
      ? {}
      : {
          status: ops.status.toLowerCase(),
          message: ops.message,
          after: ops.after,
          maintenance: ops.maintenance,
        };
  return {
    ...body,
    ...extra,
    ops,
    gate: agentGatePublic(),
    goLiveNotice: goLiveNoticePublic(),
    paused: ops.paused,
    doNotTradeOnThisSnapshot: ops.doNotTradeOnThisSnapshot,
  };
}

export function agentPublicJson(body: object, status = 200) {
  return agentJson(withAgentOps(body), status);
}

export function agentBanResponse(request: Request): Response | null {
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = (fwd || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "local").slice(0, 64);
  const barred = isBarredIp(ip);
  if (!isBanned(ip) && !barred) return null;
  const ban = banUntil(ip);
  return agentBlockedResponse(barred && !isBanned(ip) ? "harm" : "ban", {
    until: ban ? new Date(ban.until).toISOString() : null,
  });
}
