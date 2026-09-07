import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { withAgentOps } from "@/lib/desk/agent-notice";
import { goLiveBrief } from "@/lib/desk/go-live";
import { PRED_FOOTNOTE } from "@/lib/desk/oss-roadmap";

const GONE = {
  ok: false,
  gone: true,
  paperBook: false,
  phoWallet: false,
  fakeWallets: false,
  bets: false,
  path: "/roadmap#pred-footnote",
  overlay: "Polymarket + Kalshi public odds stay a 7-B0T sub-analyst overlay. This host never takes bets.",
  error: PRED_FOOTNOTE,
};

export const Route = createFileRoute("/api/agent/pred")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request }) =>
        withAgentLimit(request, async () => agentJson(withAgentOps({ ...GONE, goLive: goLiveBrief() }))),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => agentJson(withAgentOps({ ...GONE, goLive: goLiveBrief() }), 410)),
    },
  },
});
