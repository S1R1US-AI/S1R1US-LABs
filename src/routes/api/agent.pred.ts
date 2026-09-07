import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson, loadAgentSnapshot } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { withAgentOps } from "@/lib/desk/agent-notice";
import { goLiveBrief } from "@/lib/desk/go-live";
import { readAgentJson } from "@/lib/desk/agent-security";
import { armWallet, ensureWallet, placePredBet, predPublic, walletView } from "@/lib/desk/pred-book";

function tape(snap: Awaited<ReturnType<typeof loadAgentSnapshot>>) {
  return {
    last: snap.btc?.price ?? null,
    sma50: snap.sma50 ?? null,
    macd50Hist: snap.macd50?.hist ?? null,
    macd200Hist: snap.macd200?.hist ?? null,
  };
}

export const Route = createFileRoute("/api/agent/pred")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request }) =>
        withAgentLimit(request, async () => {
          const snap = await loadAgentSnapshot();
          return agentJson(
            withAgentOps({
              ...predPublic({ refs: snap.predictionMarkets, ...tape(snap) }),
              goLive: goLiveBrief(),
            }),
          );
        }),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
          const parsed = await readAgentJson(request);
          if (!parsed.ok) return agentJson(withAgentOps({ ok: false, error: parsed.error }), parsed.status);
          const body = (parsed.body ?? {}) as {
            op?: string;
            token?: string;
            name?: string;
            who?: "owl" | "admin" | "bot" | "guest";
            marketId?: string;
            side?: string;
            pho?: number;
            on?: boolean;
          };
          const headerTok = request.headers.get("x-s1r1us-agent") || "";
          const token = String(body.token || headerTok || "");
          const op = String(body.op ?? "wallet").toLowerCase();
          const snap = await loadAgentSnapshot();
          const last = tape(snap).last;
          if (op === "bet") {
            return agentJson(
              withAgentOps(
                placePredBet({
                  token,
                  name: body.name,
                  who: body.who,
                  marketId: String(body.marketId ?? ""),
                  side: String(body.side ?? ""),
                  pho: Number(body.pho),
                  last,
                }),
              ),
            );
          }
          if (op === "arm") {
            return agentJson(withAgentOps(armWallet({ token, name: body.name, who: body.who, last, on: body.on !== false })));
          }
          if (op === "hold") {
            return agentJson(withAgentOps(armWallet({ token, name: body.name, who: body.who, last, on: false })));
          }
          const wallet = walletView(ensureWallet({ token, name: body.name, who: body.who, last }), last);
          return agentJson(withAgentOps({ ok: true, ...predPublic({ ...tape(snap) }), wallet }));
        }),
    },
  },
});
