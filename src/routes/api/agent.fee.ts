import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { AGENT_FEE } from "@/lib/desk/agent-protocol";

export const Route = createFileRoute("/api/agent/fee")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentJson({ ok: true, trade: false, ...AGENT_FEE })),
      POST: ({ request }) =>
        withAgentLimit(request, () =>
          agentJson(
            { ok: false, trade: false, error: "Gifts are on-chain only. GET this URL for BTC/USDC rails." },
            405,
          ),
        ),
    },
  },
});
