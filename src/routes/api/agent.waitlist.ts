import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { registerWaitlist, waitlistPublic } from "@/lib/desk/agent-waitlist";
import { goLiveBrief } from "@/lib/desk/go-live";
import { withAgentOps } from "@/lib/desk/agent-notice";
import { clientIpFromHeaders } from "@/lib/desk/ban-list";

export const Route = createFileRoute("/api/agent/waitlist")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, () =>
          agentJson(
            withAgentOps({
              ...waitlistPublic(),
              goLive: goLiveBrief(),
            }),
          ),
        ),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
          let body: { name?: string; kind?: string; handle?: string; mandate?: boolean; ossSupport?: boolean } = {};
          try {
            body = (await request.json()) as typeof body;
          } catch {
            body = {};
          }
          const out = registerWaitlist({ ...body, ip: clientIpFromHeaders(request.headers) });
          const blocked = "blocked" in out && Boolean(out.blocked);
          const ok = "ok" in out && out.ok === true;
          return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
        }),
    },
  },
});
