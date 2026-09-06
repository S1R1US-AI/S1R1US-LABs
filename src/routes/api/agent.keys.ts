import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson } from "@/lib/desk/agent-notice";
import { feedPlansPublic } from "@/lib/desk/feed-plans";

export const Route = createFileRoute("/api/agent/keys")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentPublicJson({ ok: true, trade: false, ...feedPlansPublic() })),
    },
  },
});
