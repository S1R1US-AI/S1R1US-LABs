import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentCard, handleA2a } from "@/lib/desk/agent-protocol";

export const Route = createFileRoute("/api/agent/a2a")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentJson(agentCard())),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
          try {
            return agentJson(await handleA2a(await request.json()));
          } catch {
            return agentJson({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400);
          }
        }),
    },
  },
});
