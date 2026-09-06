import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { forumPublic, postForum } from "@/lib/desk/agent-forum";
import { withAgentOps } from "@/lib/desk/agent-notice";
import { goLiveBrief } from "@/lib/desk/go-live";
import { readAgentJson } from "@/lib/desk/agent-security";
import { clientIpFromHeaders } from "@/lib/desk/ban-list";

export const Route = createFileRoute("/api/agent/forum")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentJson(withAgentOps({ ...forumPublic(), goLive: goLiveBrief() }))),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
          const parsed = await readAgentJson(request);
          if (!parsed.ok) return agentJson(withAgentOps({ ok: false, error: parsed.error }), parsed.status);
          const body = (parsed.body ?? {}) as {
            name?: string;
            kind?: string;
            handle?: string;
            body?: string;
            mandate?: boolean;
            ossSupport?: boolean;
          };
          const out = postForum({ ...body, ip: clientIpFromHeaders(request.headers) });
          const blocked = "blocked" in out && Boolean(out.blocked);
          const ok = "ok" in out && out.ok === true;
          return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
        }),
    },
  },
});
