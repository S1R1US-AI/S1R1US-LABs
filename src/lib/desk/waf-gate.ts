/**
 * Single ingress gate used by Vite (dev) and Nitro (deploy).
 * Order: banned IP → CRS inspect → auto-defend → 403.
 */
import { applySecHeaders } from "./sec-headers";
import { inspectRequest, skipWafPath, type WafVerdict } from "./waf";
import { banUntil, barPermanent, clientIpFromHeaders, isBanned, isLoopback } from "./ban-list";
import { handleWafBlock } from "./auto-defend";
import { AGENT_SOURCE_MESSAGE, agentSourceDenied, PUBLIC_GITHUB } from "./agent-source-guard";

export type GateReq = {
  method: string;
  url: string;
  headers: unknown;
  ip?: string;
};

export type GateResult = {
  block: boolean;
  status: number;
  body: string;
  verdict: WafVerdict | null;
  ip: string;
  https: boolean;
};

function json(error: string, extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    ok: false,
    trade: false,
    ordersCreate: false,
    blocked: true,
    welcomeBack: false,
    doNotReturn: true,
    error,
    message:
      extra.doNotReturn === false
        ? error
        : `${error} You were blocked for malicious behavior. Do not come back. Further attempts are logged. Terms: https://s1r1us.ai/terms`,
    after: "Stop. Do not retry. Do not scrape. Legitimate bots poll GET /api/agent/ping every 300s.",
    terms: "https://s1r1us.ai/terms",
    ...extra,
  });
}

function headerGet(headers: unknown, name: string): string {
  if (headers && typeof headers === "object" && typeof (headers as { get?: unknown }).get === "function") {
    return String((headers as { get: (n: string) => string | null }).get(name) ?? "");
  }
  if (headers && typeof headers === "object") {
    const rec = headers as Record<string, unknown>;
    const v = rec[name] ?? rec[name.toLowerCase()];
    if (Array.isArray(v)) return String(v[0] ?? "");
    return typeof v === "string" ? v : "";
  }
  return "";
}

export function gateHttp(req: GateReq): GateResult {
  let path = "/";
  let search = "";
  let https = false;
  try {
    const u = req.url.startsWith("http") ? new URL(req.url) : new URL(req.url, "http://local");
    path = u.pathname || "/";
    search = u.search || "";
    https = u.protocol === "https:";
  } catch {
    path = (req.url || "/").split("?")[0] || "/";
    search = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  }
  const ip = (req.ip || clientIpFromHeaders(req.headers)).slice(0, 64);
  const ua = headerGet(req.headers, "user-agent") || "-";
  const proto = headerGet(req.headers, "x-forwarded-proto");
  if (proto.toLowerCase() === "https") https = true;

  if (isBanned(ip)) {
    const ban = banUntil(ip);
    return {
      block: true,
      status: 403,
      body: json("Denied. Source banned after repeated probes.", {
        reason: "ban",
        until: ban ? new Date(ban.until).toISOString() : null,
      }),
      verdict: null,
      ip,
      https,
    };
  }

  if (agentSourceDenied(path, ua)) {
    if (!isLoopback(ip)) barPermanent(ip, `source-probe ${path.slice(0, 40)}`);
    return {
      block: true,
      status: 403,
      body: json(AGENT_SOURCE_MESSAGE, {
        reason: "source",
        sourceAccess: false,
        proprietary: true,
        github: PUBLIC_GITHUB,
      }),
      verdict: null,
      ip,
      https,
    };
  }

  if (skipWafPath(path)) {
    return { block: false, status: 200, body: "", verdict: null, ip, https };
  }

  const verdict = inspectRequest({
    method: req.method,
    path,
    search,
    ua,
    ip,
  });
  if (verdict.block) {
    handleWafBlock(verdict, ip, ua);
    return {
      block: true,
      status: 403,
      body: json("Denied by application firewall.", {
        reason: "waf",
        family: verdict.matches[0]?.rule.family,
        anomaly: verdict.anomaly,
      }),
      verdict,
      ip,
      https,
    };
  }
  return { block: false, status: 200, body: "", verdict, ip, https };
}

export function attachHeaders(target: { setHeader?(n: string, v: string): void; set?(n: string, v: string): void }, https: boolean) {
  const wrapper = {
    set(name: string, value: string) {
      if (typeof target.setHeader === "function") target.setHeader(name, value);
      else if (typeof target.set === "function") target.set(name, value);
    },
  };
  applySecHeaders(wrapper, { https });
}

export function withSecHeaders(res: Response, https: boolean): Response {
  const headers = new Headers(res.headers);
  applySecHeaders(headers, { https });
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
