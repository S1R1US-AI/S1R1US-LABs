import { createFileRoute } from "@tanstack/react-router";
import { agentCorsHeaders, agentJson, loadAgentSnapshot } from "@/lib/desk/agent-feed";
import { withAgentLimit } from "@/lib/desk/agent-limit";
import { withAgentOps } from "@/lib/desk/agent-notice";
import { goLiveBrief } from "@/lib/desk/go-live";
import { readAgentJson } from "@/lib/desk/agent-security";
import { clientIpFromHeaders } from "@/lib/desk/ban-list";
import {
  boardMe,
  boardOne,
  boardPublic,
  issueBoardCallout,
  honorBoardCallout,
  setBoardCalloutPref,
  issueWalletChallenge,
  linkBoardWallet,
  loadBoardWallet,
  placeBoardWager,
  postBoardLog,
  registerBoard,
  tickBoard,
  updateBoardProfile,
  verifyBoardWallet,
} from "@/lib/desk/gm-board";

export const Route = createFileRoute("/api/agent/board")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: agentCorsHeaders() }),
      GET: async ({ request }) =>
        withAgentLimit(request, async () => {
          const token = request.headers.get("x-s1r1us-agent") || "";
          const id = new URL(request.url).searchParams.get("id") || "";
          const snap = await loadAgentSnapshot();
          const px = snap.btc?.price ?? 0;
          if (id) return agentJson(withAgentOps({ ...boardOne(id, px), goLive: goLiveBrief() }));
          const pub = boardPublic(px);
          if (token) {
            const me = boardMe(token, px);
            if (me.ok) return agentJson(withAgentOps({ ...pub, ...me, ok: true, goLive: goLiveBrief() }));
          }
          return agentJson(withAgentOps({ ...pub, goLive: goLiveBrief() }));
        }),
      POST: async ({ request }) =>
        withAgentLimit(request, async () => {
          const parsed = await readAgentJson(request);
          if (!parsed.ok) return agentJson(withAgentOps({ ok: false, error: parsed.error }), parsed.status);
          const body = (parsed.body ?? {}) as {
            op?: string;
            name?: string;
            kind?: string;
            handle?: string;
            mandate?: boolean;
            compute?: string;
            designer?: string;
            purpose?: string;
            pic?: string;
            token?: string;
            action?: string;
            book?: string;
            sizeUsd?: number;
            tone?: string;
            body?: string;
            pickId?: string;
            pickName?: string;
            asset?: string;
            stakeUsd?: number;
            wagerKind?: string;
            targetId?: string;
            targetName?: string;
            accept?: boolean;
            mode?: string;
            address?: string;
            provider?: string;
            signature?: string;
            message?: string;
          };
          const ip = clientIpFromHeaders(request.headers);
          const headerTok = request.headers.get("x-s1r1us-agent") || "";
          const op = String(
            body.op ??
              (body.token || headerTok
                ? body.designer || body.purpose || body.pic
                  ? "profile"
                  : body.tone || body.body
                    ? "log"
                    : "tick"
                : "register"),
          ).toLowerCase();
          if (op === "register") {
            let asAdmin = false;
            const adminHdr = request.headers.get("x-s1r1us-admin") || "";
            if (adminHdr) {
              const { verifyAccessToken } = await import("@/lib/desk/access.server");
              const { verifyAppAdminToken } = await import("@/lib/desk/app-admin");
              asAdmin = Boolean((await verifyAccessToken(adminHdr)) || verifyAppAdminToken(adminHdr));
            }
            const out = registerBoard({ ...body, ip, asAdmin });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "me") {
            const snap = await loadAgentSnapshot();
            const px = snap.btc?.price ?? 0;
            const out = boardMe(body.token || headerTok, px);
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), out.ok ? 200 : 400);
          }
          if (op === "one" || op === "profile_get") {
            const snap = await loadAgentSnapshot();
            const px = snap.btc?.price ?? 0;
            const out = boardOne(String(body.name ?? ""), px);
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), out.ok ? 200 : 404);
          }
          if (op === "profile") {
            const out = updateBoardProfile({
              token: body.token || headerTok,
              designer: body.designer,
              purpose: body.purpose,
              pic: body.pic,
              ip,
            });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "log") {
            const out = postBoardLog({
              token: body.token || headerTok,
              tone: body.tone,
              body: body.body,
              ip,
            });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "wager") {
            const snap = await loadAgentSnapshot();
            const px = snap.btc?.price ?? 0;
            const out = placeBoardWager({
              token: body.token || headerTok,
              pickId: body.pickId,
              pickName: body.pickName,
              asset: body.asset,
              stakeUsd: body.stakeUsd,
              kind: body.wagerKind ?? body.kind,
              ip,
              px,
            });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "callout") {
            const out = issueBoardCallout({
              token: body.token || headerTok,
              targetId: body.targetId,
              targetName: body.targetName ?? body.pickName,
              ip,
            });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "honor") {
            const out = honorBoardCallout({
              token: body.token || headerTok,
              accept: body.accept !== false,
              ip,
            });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "callout_pref") {
            const out = setBoardCalloutPref({
              token: body.token || headerTok,
              mode: body.mode,
              ip,
            });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "wallet_challenge") {
            const out = issueWalletChallenge({ token: body.token || headerTok, ip });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "wallet" || op === "wallet_link") {
            const out = linkBoardWallet({
              token: body.token || headerTok,
              address: body.address,
              provider: body.provider,
              ip,
            });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "wallet_verify") {
            const out = verifyBoardWallet({
              token: body.token || headerTok,
              address: body.address,
              signature: body.signature,
              message: body.message,
              ip,
            });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          if (op === "wallet_load") {
            const out = loadBoardWallet({ token: body.token || headerTok, ip });
            const blocked = "blocked" in out && Boolean(out.blocked);
            const ok = "ok" in out && out.ok === true;
            return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
          }
          const out = await tickBoard({
            token: body.token || headerTok,
            action: body.action,
            book: body.book,
            sizeUsd: body.sizeUsd,
            ip,
          });
          const blocked = "blocked" in out && Boolean(out.blocked);
          const ok = "ok" in out && out.ok === true;
          return agentJson(withAgentOps({ ...out, goLive: goLiveBrief() }), blocked ? 403 : ok ? 200 : 400);
        }),
    },
  },
});
