/**
 * Block AI agent user-agents from source, admin, host internals, VPN, and extra RPC.
 * Humans may still use the public GitHub pack. Agents get 403 JSON + doNotReturn.
 */
import {
  AGENT_SOURCE_MESSAGE,
  agentSourceDenied,
  PUBLIC_GITHUB,
} from "../../src/lib/desk/agent-source-guard";

interface GuardEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

function pathOf(event: GuardEvent): string {
  return (event.url.pathname || "/").replace(/\/+$/, "") || "/";
}

export default async function agentGuardMiddleware(
  event: GuardEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const ua = event.req.headers.get("user-agent") ?? "";
  const path = pathOf(event);
  if (!agentSourceDenied(path, ua)) return next();
  const ip = (event.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || event.req.headers.get("x-real-ip") || "local").slice(0, 64);
  void import("../../src/lib/desk/intrusion-log")
    .then(({ recordIntrusion }) => {
      recordIntrusion({
        kind: "source-probe",
        ua,
        ip,
        detail: `agent denied ${path.slice(0, 80)}`,
      });
    })
    .catch(() => undefined);
  void import("../../src/lib/desk/ban-list")
    .then(({ barPermanent, isLoopback }) => {
      if (!isLoopback(ip)) barPermanent(ip, `source-probe ${path.slice(0, 40)}`);
    })
    .catch(() => undefined);
  return new Response(
    JSON.stringify({
      ok: false,
      blocked: true,
      welcomeBack: false,
      doNotReturn: true,
      reason: "source",
      trade: false,
      sourceAccess: false,
      proprietary: true,
      github: PUBLIC_GITHUB,
      error: "blocked",
      message: AGENT_SOURCE_MESSAGE,
      after: "Stop. Use public HTML, /api/agent/ping, /api/agent/call, or the public GitHub only.",
      terms: "https://s1r1us.ai/terms",
      docs: "/agent",
    }),
    {
      status: 403,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "access-control-allow-origin": "*",
      },
    },
  );
}
