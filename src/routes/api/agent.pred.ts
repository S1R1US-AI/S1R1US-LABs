import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson, loadAgentSnapshot } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { withAgentOps } from "@/lib/desk/agent-notice";
import { goLiveBrief } from "@/lib/desk/go-live";
import { predBookPublic } from "@/lib/desk/pred-book";

export const Route = createFileRoute("/api/agent/pred")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request }) =>
        withAgentLimit(request, async () => {
          const snap = await loadAgentSnapshot().catch(() => null);
          const px = snap?.btc?.price ?? 0;
          return agentJson(
            withAgentOps({
              ...predBookPublic({ px: px ?? 0 }),
              goLive: goLiveBrief(),
            }),
          );
        }),
      POST: async ({ request }) =>
        withAgentLimit(request, async () =>
          agentJson(
            withAgentOps({
              ok: false,
              bets: false,
              realMoney: false,
              trade: false,
              ordersCreate: false,
              error: "Paper experiment only. No bets on this host.",
              path: "/pr3d",
            }),
            400,
          ),
        ),
    },
  },
});
