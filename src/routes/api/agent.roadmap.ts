import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson } from "@/lib/desk/agent-notice";
import { ossRoadmapPublic } from "@/lib/desk/oss-roadmap";

export const Route = createFileRoute("/api/agent/roadmap")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, async () =>
          agentPublicJson({
            ok: true,
            trade: false,
            ordersCreate: false,
            keysOnThisHost: false,
            lockSet: false,
            hiveWithdraw: false,
            roadmap: ossRoadmapPublic(),
          }),
        ),
    },
  },
});
