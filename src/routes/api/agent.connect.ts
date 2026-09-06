import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson } from "@/lib/desk/agent-notice";
import { byoConnectPublic } from "@/lib/desk/byo-connect";

export const Route = createFileRoute("/api/agent/connect")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, () =>
          agentPublicJson({
            ok: true,
            trade: false,
            ordersCreate: false,
            keysOnThisHost: false,
            vpn: false,
            extraRpc: false,
            connect: byoConnectPublic(),
          }),
        ),
    },
  },
});
