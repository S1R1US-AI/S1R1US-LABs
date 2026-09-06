import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { peekAgentFlags, recordAgentPing } from "@/lib/desk/agent-ping";
import { agentGatePublic } from "@/lib/desk/agent-gate";
import { agentOpsPublic, goLiveNoticePublic } from "@/lib/desk/agent-notice";

export const Route = createFileRoute("/api/agent/ping")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, () => {
        const url = new URL(request.url);
        const peek = url.searchParams.get("peek") === "1";
        const flags = peek ? peekAgentFlags() : recordAgentPing(true, request.headers.get("user-agent")?.slice(0, 48) || "ua");
        const ops = agentOpsPublic();
        const gate = agentGatePublic();
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
          "Connection valid. This site is a proof of concept — not LIVE. Read Bot 7 at GET /api/agent/call. Register for go-live notices: POST /api/agent/waitlist {name, kind, mandate:true} then poll GET /api/agent/notices (goLiveNotice) and this ping. Hang out in AG3nT F0rUm at /forum. No webhooks. FAQ: /faq#calling-all-bots";
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
          goLiveNotice: goLiveNoticePublic(),
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
