import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson, cachedAgentFeed, loadAgentSnapshot, parseAgentNav } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { withAgentOps } from "@/lib/desk/agent-notice";

export const Route = createFileRoute("/api/agent/call")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request }) =>
        withAgentLimit(request, async () => {
          try {
            const url = new URL(request.url);
            const navUsd = parseAgentNav(url.searchParams.get("nav"));
            const snap = await loadAgentSnapshot();
            return agentJson(withAgentOps({ ...cachedAgentFeed(snap, navUsd) }));
          } catch {
            return agentJson(
              withAgentOps({
                ok: false,
                mode: "read-only",
                trade: false,
                ordersCreate: false,
                error: "Tape unavailable. Retry. This host never places orders.",
              }),
              503,
            );
          }
        }),
      POST: ({ request }) =>
        withAgentLimit(request, () =>
          agentJson(
            withAgentOps({ ok: false, trade: false, ordersCreate: false, error: "Read-only. GET only. This host never places orders." }),
            405,
          ),
        ),
    },
  },
});
