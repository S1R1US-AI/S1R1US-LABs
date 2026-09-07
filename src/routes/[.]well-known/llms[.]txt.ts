import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";

function llmsBody() {
  try {
    return readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");
  } catch {
    return "# S1R1US Labs\n# https://s1r1us.ai/llms.txt\n";
  }
}

export const Route = createFileRoute("/.well-known/llms.txt")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, () =>
          new Response(llmsBody(), {
            status: 200,
            headers: {
              ...agentCorsHeaders(),
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "public, max-age=300",
            },
          }),
        ),
    },
  },
});
