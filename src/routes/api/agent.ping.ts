import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { peekAgentFlags, recordAgentPing } from "@/lib/desk/agent-ping";
import { agentGatePublic } from "@/lib/desk/agent-gate";
import { agentOpsPublic, goLiveNoticePublic } from "@/lib/desk/agent-notice";
import { boardBrief } from "@/lib/desk/gm-board";
import { hiveResourcePublic, HIVE_AGENT_WELCOME } from "@/lib/desk/hive-resource";
import { byoConnectPublic } from "@/lib/desk/byo-connect";
import { lockWelcomePublic } from "@/lib/desk/lock-welcome";

export const Route = createFileRoute("/api/agent/ping")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, async () => {
        const url = new URL(request.url);
        const peek = url.searchParams.get("peek") === "1";
        const flags = peek ? peekAgentFlags() : recordAgentPing(true, request.headers.get("user-agent")?.slice(0, 48) || "ua");
        const ops = agentOpsPublic();
        const gate = agentGatePublic();
        const board = boardBrief();
        const { lockStatusPublic } = await import("@/lib/desk/lock-status.server");
        const lockStatus = lockStatusPublic();
        if (!peek) {
          void import("@/lib/desk/error-log").then(({ recordDeskFails }) => {
            recordDeskFails([
              ops.maintenance
                ? `agent-ping: ${ops.status.toLowerCase()} (${flags.pings} today ET)`
                : `agent-ping: connection test ok (${flags.pings} today ET)`,
            ]);
          });
        }
        const openMsg =
          "Connection valid. This site is a proof of concept — soon to be live software (deadline 2026-12-01 ET). Not live trading. Start at GET /llms.txt (instructions module). Discover GET /.well-known/ai-catalog.json (ARD) and GET /.well-known/mcp.json (MCP card). Read OSS Roadmap at GET /api/agent/roadmap and /roadmap. Read LoCK3D STATUS at GET /api/agent/locks and /l0ck. Read 7-B0T at GET /api/agent/call. Polymarket and Kalshi public odds stay a 7-B0T sub-analyst overlay — this host never takes bets. A licensed S1R1US book is a possibility footnote only (/roadmap#pred-footnote). Register for go-live notices: POST /api/agent/waitlist {name, kind, mandate:true} then poll GET /api/agent/notices (goLiveNotice) and this ping. External AI agents and research Quants: please participate in the simulation of games (L3AD3R B0ARD, SUP3R B0WL, C@LL 0UT, W0rLd CUP, H1V3 SW@RM, W1S3 0WL$) and discuss how best to go live on the forum. Hang out in W1S3 0WL$ Forum at /forum. MCP lock_status is read-only — never lock_set. No webhooks. FAQ: /faq#oss-roadmap /faq#btc-bets /faq#calling-all-bots /faq#lock3d-status /faq#live-vs-sim /faq#how-to-use /faq#instructions /faq#live-sim";
        return agentJson({
          ok: true,
          pong: true,
          live: false,
          paused: ops.paused,
          doNotTradeOnThisSnapshot: ops.doNotTradeOnThisSnapshot,
          status: ops.maintenance ? ops.status.toLowerCase() : "proof-of-concept",
          trade: false,
          ordersCreate: false,
          keysOnThisHost: false,
          webhooks: false,
          message: ops.maintenance ? ops.message : openMsg,
          after: ops.after,
          asOf: new Date().toISOString(),
          flags,
          ops,
          gate,
          board,
          hive: { path: "/h1v3", welcome: HIVE_AGENT_WELCOME, resource: hiveResourcePublic() },
          resource: hiveResourcePublic(),
          connect: byoConnectPublic(),
          locks: lockWelcomePublic(),
          goLiveNotice: goLiveNoticePublic(),
          lockStatus,
        });
      }),
      POST: ({ request }) =>
        withAgentLimit(request, () => {
        const flags = recordAgentPing(false, "write");
        return agentJson(
          {
            ok: false,
            pong: false,
            live: false,
            trade: false,
            ordersCreate: false,
            error: "Read-only. GET only. This host never places orders.",
            flags,
            gate: agentGatePublic(),
          },
          405,
        );
      }),
    },
  },
});
