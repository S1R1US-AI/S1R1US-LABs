import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson, goLiveNoticePublic } from "@/lib/desk/agent-notice";
import { goLiveBrief } from "@/lib/desk/go-live";
import { mandatePublic } from "@/lib/desk/mandate";

export const Route = createFileRoute("/api/agent/notices")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, () =>
          agentPublicJson({
            ok: true,
            trade: false,
            goLive: goLiveBrief(),
            goLiveNotice: goLiveNoticePublic(),
            goals: mandatePublic(),
          }),
        ),
    },
  },
});
