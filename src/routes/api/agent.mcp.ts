import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { AGENT_MCP_PATH, handleMcpHttp, mcpToolDefs } from "@/lib/desk/agent-protocol";

function mcpResponse(status: number, body: unknown, accept: string): Response {
  const headers = agentCorsHeaders({ "content-type": "application/json; charset=utf-8" });
  if (status === 202 && body == null) {
    return new Response(null, { status: 202, headers });
  }
  const json = JSON.stringify(body);
  if (accept.includes("text/event-stream") && !accept.includes("application/json")) {
    headers.set("content-type", "text/event-stream");
    return new Response(`event: message\ndata: ${json}\n\n`, { status, headers });
  }
  return new Response(json, { status, headers });
}

export const Route = createFileRoute("/api/agent/mcp")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: ({ request }) =>
        withAgentLimit(request, () => {
        const accept = request.headers.get("accept") ?? "";
        if (accept.includes("text/event-stream") && !accept.includes("application/json")) {
          return new Response(null, { status: 405, headers: agentCorsHeaders() });
        }
        return agentJson({
          transport: "streamable-http",
          url: AGENT_MCP_PATH,
          methods: ["initialize", "tools/list", "tools/call", "ping"],
          tools: mcpToolDefs().map((t) => t.name),
          trade: false,
          sourceAccess: false,
          paywall: false,
        });
      }),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
        try {
          const body = await request.json();
          const out = await handleMcpHttp(body);
          return mcpResponse(out.status, out.body, request.headers.get("accept") ?? "");
        } catch {
          return agentJson({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400);
        }
      }),
      DELETE: () => new Response(null, { status: 405, headers: agentCorsHeaders() }),
    },
  },
});
