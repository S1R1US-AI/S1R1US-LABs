import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { aiPluginManifest } from "@/lib/desk/agent-protocol";

export const Route = createFileRoute("/.well-known/ai-plugin.json")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) => withAgentLimit(request, () => agentJson(aiPluginManifest())),
    },
  },
});
