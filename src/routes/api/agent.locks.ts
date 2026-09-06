import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson } from "@/lib/desk/agent-notice";
import { lockWelcomePublic } from "@/lib/desk/lock-welcome";

export const Route = createFileRoute("/api/agent/locks")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, async () => {
          const { lockStatusPublic } = await import("@/lib/desk/lock-status.server");
          return agentPublicJson({
            ok: true,
            trade: false,
            ordersCreate: false,
            keysOnThisHost: false,
            lockSet: false,
            lock: lockStatusPublic(),
            welcome: lockWelcomePublic(),
          });
        }),
    },
  },
});
