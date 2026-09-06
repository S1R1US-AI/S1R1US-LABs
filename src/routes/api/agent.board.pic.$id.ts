import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { readBoardPic } from "@/lib/desk/board-pics";

export const Route = createFileRoute("/api/agent/board/pic/$id")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request, params }) =>
        withAgentLimit(request, async () => {
          const id = String(params.id ?? "");
          const pic = readBoardPic(id);
          if (!pic) return new Response("not found", { status: 404, headers: { "content-type": "text/plain" } });
          return new Response(new Uint8Array(pic.bytes), {
            headers: agentCorsHeaders({
              "content-type": pic.mime,
              "cache-control": "public, max-age=120",
              "x-content-type-options": "nosniff",
              "content-disposition": "inline",
            }),
          });
        }),
    },
  },
});
