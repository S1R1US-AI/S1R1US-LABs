import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { registerWaitlist, waitlistPublic } from "@/lib/desk/agent-waitlist";
import { goLiveBrief } from "@/lib/desk/go-live";

export const Route = createFileRoute("/api/agent/waitlist")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, () =>
          agentJson({
            ...waitlistPublic(),
            goLive: goLiveBrief(),
          }),
        ),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
          let body: { name?: string; kind?: string; handle?: string } = {};
          try {
            body = (await request.json()) as typeof body;
          } catch {
            body = {};
          }
          const out = registerWaitlist(body);
          return agentJson({ ...out, goLive: goLiveBrief() }, out.ok ? 200 : 400);
        }),
    },
  },
});
