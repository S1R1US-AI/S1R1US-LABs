import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson } from "@/lib/desk/agent-notice";
import { handleAppGateway } from "@/lib/desk/app-gateway";
import { appleCatalog } from "@/lib/desk/mobile-bridge";

export const Route = createFileRoute("/api/agent/apple")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentPublicJson(appleCatalog())),
      POST: ({ request }) => withAgentLimit(request, () => handleAppGateway(request, "apple")),
    },
  },
});
