import { createFileRoute } from "@tanstack/react-router";
import { agentCatalog, agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";

export const Route = createFileRoute("/api/agent")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: () => agentJson(agentCatalog()),
      POST: () =>
        agentJson(
          { ok: false, trade: false, error: "Read-only. GET only. This host never places orders." },
          405,
        ),
    },
  },
});
