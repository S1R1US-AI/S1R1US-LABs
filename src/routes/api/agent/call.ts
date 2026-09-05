import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson, buildAgentFeed, loadAgentSnapshot, parseAgentNav } from "@/lib/desk/agent-feed";

export const Route = createFileRoute("/api/agent/call")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const navUsd = parseAgentNav(url.searchParams.get("nav"));
          const snap = await loadAgentSnapshot();
          return agentJson(buildAgentFeed(snap, navUsd));
        } catch {
          return agentJson(
            {
              ok: false,
              mode: "read-only",
              trade: false,
              ordersCreate: false,
              error: "Tape unavailable. Retry. This host never places orders.",
            },
            503,
          );
        }
      },
      POST: () =>
        agentJson(
          { ok: false, trade: false, ordersCreate: false, error: "Read-only. GET only. This host never places orders." },
          405,
        ),
    },
  },
});
