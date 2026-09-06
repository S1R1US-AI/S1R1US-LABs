import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { fullCatalog } from "@/lib/desk/agent-protocol";

export const Route = createFileRoute("/api/agent")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentJson(fullCatalog())),
      POST: ({ request }) =>
        withAgentLimit(request, () =>
          agentJson(
            { ok: false, trade: false, error: "Read-only. GET only. This host never places orders." },
            405,
          ),
        ),
    },
  },
});
