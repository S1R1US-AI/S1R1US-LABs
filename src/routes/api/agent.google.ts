import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson } from "@/lib/desk/agent-notice";
import { handleAppGateway } from "@/lib/desk/app-gateway";
import { googleCatalog } from "@/lib/desk/mobile-bridge";

export const Route = createFileRoute("/api/agent/google")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentPublicJson(googleCatalog())),
      POST: ({ request }) => withAgentLimit(request, () => handleAppGateway(request, "google")),
    },
  },
});
