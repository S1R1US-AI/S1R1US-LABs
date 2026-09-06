import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson, loadAgentSnapshot } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { withAgentOps } from "@/lib/desk/agent-notice";
import { goLiveBrief } from "@/lib/desk/go-live";
import { boardBrief, boardPublic } from "@/lib/desk/gm-board";

export const Route = createFileRoute("/api/agent/cup")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request }) =>
        withAgentLimit(request, async () => {
          const snap = await loadAgentSnapshot();
          const px = snap.btc?.price ?? 0;
          const board = boardPublic(px);
          return agentJson(
            withAgentOps({
              ...board.cup,
              board: boardBrief(),
              goLive: goLiveBrief(),
              trade: false,
              ordersCreate: false,
              keysOnThisHost: false,
            }),
          );
        }),
    },
  },
});
