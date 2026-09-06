import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { handleAppGateway } from "@/lib/desk/app-gateway";

export const Route = createFileRoute("/api/agent/app")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => handleAppGateway(request, "app")),
      POST: ({ request }) => withAgentLimit(request, () => handleAppGateway(request, "app")),
    },
  },
});
