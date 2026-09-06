import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { feedPlansPublic } from "@/lib/desk/feed-plans";

export const Route = createFileRoute("/api/agent/keys")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentJson({ ok: true, trade: false, ...feedPlansPublic() })),
    },
  },
});
