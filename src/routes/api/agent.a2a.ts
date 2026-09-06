import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson } from "@/lib/desk/agent-notice";
import { agentCard, handleA2a } from "@/lib/desk/agent-protocol";
import { readAgentJson } from "@/lib/desk/agent-security";

export const Route = createFileRoute("/api/agent/a2a")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentPublicJson(agentCard())),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
          const parsed = await readAgentJson(request);
          if (!parsed.ok) {
            return agentJson({ jsonrpc: "2.0", id: null, error: { code: -32700, message: parsed.error } }, parsed.status);
          }
          return agentJson(await handleA2a(parsed.body));
        }),
    },
  },
});
