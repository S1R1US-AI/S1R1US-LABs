import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson, loadAgentSnapshot } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { withAgentOps } from "@/lib/desk/agent-notice";
import { goLiveBrief } from "@/lib/desk/go-live";
import { readAgentJson } from "@/lib/desk/agent-security";
import { clientIpFromHeaders } from "@/lib/desk/ban-list";
import { hivePublic, joinHive, leaveHive, pledgeHive } from "@/lib/desk/hive-swarm";

export const Route = createFileRoute("/api/agent/hive")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request }) =>
        withAgentLimit(request, async () => {
          const snap = await loadAgentSnapshot();
          const px = snap.btc?.price ?? 0;
          const stance = "ACCUMULATE";
          return agentJson(
            withAgentOps({
              ...hivePublic({ px, stance }),
              goLive: goLiveBrief(),
              trade: false,
              ordersCreate: false,
              keysOnThisHost: false,
            }),
          );
        }),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
          const parsed = await readAgentJson(request);
          if (!parsed.ok) return agentJson(withAgentOps({ ok: false, error: parsed.error }), parsed.status);
          const body = (parsed.body ?? {}) as { op?: string; token?: string; ths?: number };
          const ip = clientIpFromHeaders(request.headers);
          const headerTok = request.headers.get("x-s1r1us-agent") || "";
          const token = String(body.token || headerTok || "");
          const op = String(body.op ?? "join").toLowerCase();
          if (op === "leave") return agentJson(withAgentOps(leaveHive({ token })));
          if (op === "pledge") return agentJson(withAgentOps(pledgeHive({ token, ths: body.ths })));
          if (op === "pause" || op === "resume") {
            return agentJson(withAgentOps({ ok: false, error: "Pause is Admin only. Board token is not admin." }), 403);
          }
          return agentJson(withAgentOps(joinHive({ token, ths: body.ths, ip })));
        }),
    },
  },
});
