import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { agentPublicJson } from "@/lib/desk/agent-notice";
import { AGENT_FEE } from "@/lib/desk/agent-protocol";

export const Route = createFileRoute("/api/agent/fee")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentPublicJson({ ok: true, trade: false, ...AGENT_FEE })),
      POST: ({ request }) =>
        withAgentLimit(request, () =>
          agentPublicJson(
            { ok: false, trade: false, error: "Gifts are on-chain only. GET this URL for BTC/USDC rails." },
            405,
          ),
        ),
    },
  },
});
