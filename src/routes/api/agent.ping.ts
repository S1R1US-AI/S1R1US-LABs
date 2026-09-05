import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { peekAgentFlags, recordAgentPing } from "@/lib/desk/agent-ping";

export const Route = createFileRoute("/api/agent/ping")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => {
        const url = new URL(request.url);
        const peek = url.searchParams.get("peek") === "1";
        const flags = peek ? peekAgentFlags() : recordAgentPing(true, request.headers.get("user-agent")?.slice(0, 48) || "ua");
        if (!peek) {
          void import("@/lib/desk/error-log").then(({ recordDeskFails }) => {
            recordDeskFails([`agent-ping: connection test ok (${flags.pings} today ET)`]);
          });
        }
        return agentJson({
          ok: true,
          pong: true,
          live: false,
          status: "proof-of-concept",
          trade: false,
          ordersCreate: false,
          keysOnThisHost: false,
          message:
            "Connection valid. This site is a proof of concept — not LIVE. Read Bot 7 at GET /api/agent/call. FAQ: /faq#calling-all-bots",
          asOf: new Date().toISOString(),
          flags,
        });
      },
      POST: () => {
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
          },
          405,
        );
      },
    },
  },
});
