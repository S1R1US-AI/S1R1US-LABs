import { createServerFn } from "@tanstack/react-start";
import { storedAdminName, verifyAccessToken, verifyDeskToken } from "./access.server";
import { assertSafePayload, grokRateLimit, grokUsage } from "./security";
import { heliosCall, runBots } from "./signal";
import { predAnalyst } from "./prediction-markets";
import { guardedFetch } from "./net-guard";
import type { BotBrief, DeskSnapshot, HeliosCall } from "./types";

type Input = {
  token: string;
  snapshot?: DeskSnapshot;
  briefs?: BotBrief[];
  call?: HeliosCall;
};

type ByoInput = {
  xaiKey: string;
  question?: string;
  bearer?: string;
  appToken?: string;
};

function looksLikeXaiKey(raw: string) {
  const k = raw.trim();
  if (k.length < 20 || k.length > 200) return false;
  if (!/^xai-[A-Za-z0-9_-]+$/.test(k) && !/^sk-[A-Za-z0-9_-]+$/.test(k)) return false;
  return true;
}

async function gradeWithKey(apiKey: string, question: string | undefined) {
  const { getLiveSnapshot } = await import("./sources");
  const s = await getLiveSnapshot();
  const briefs = runBots(s);
  const call = heliosCall(s, briefs, 1000);
  const compact = {
    btc: s.btc,
    rsi14: s.rsi14,
    fearGreed: s.fearGreed,
    positioning: s.positioning,
    onchain: s.onchain,
    asia: s.asia,
    em: {
      net: s.em.net,
      regions: s.em.regions.map((r) => ({
        id: r.id,
        flow: r.flow,
        premiumPct: r.premiumPct,
      })),
    },
    quotes: s.quotes,
    filings: s.filings.slice(0, 6),
    headlines: s.headlines.slice(0, 8).map((h) => `${h.source}: ${h.title}`),
    predictionMarkets: (s.predictionMarkets ?? []).slice(0, 8).map((m) => `${m.venue} ${m.kind} ${m.strike ?? m.title} Yes ${m.yesPct ?? "?"}%`),
    predAnalyst: predAnalyst(s.predictionMarkets, s.btc.price),
    bots: briefs.map((b) => ({ id: b.id, stance: b.stance, summary: b.summary })),
    helios: { stance: call.stance, conviction: call.conviction, clipUsd: call.clipUsd },
  };
  const unsafe = assertSafePayload(JSON.stringify(compact));
  if (unsafe) return { ok: false as const, error: unsafe };

  const userQ = (question ?? "").trim().slice(0, 400);
  const res = await guardedFetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 700,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are Helios, the seventh bot of a one-operator bitcoin accumulator. You can see the other six bots including Rotation Analyst (Nasdaq/AI/paper-gold → BTC, whale overlay, free RSS). Mandate: accumulate BTC, never short, never recommend leverage. Use only the supplied snapshot. Weight the Asia tape (Upbit kimchi, HashKey HK, HTX, OKX CNY OTC) especially during session ASIA. Weight the EM flow tape. Binance is unavailable. Mention X/Twitter sentiment only if the headlines imply it — do not invent posts. Polymarket/Kalshi BTC odds are labels only — they never vote. End with a single line: STANCE / CONVICTION / CLIP_USD.",
        },
        {
          role: "user",
          content: `${userQ ? `Strategy question (integrated with 7-B0T tape): ${userQ}\n` : ""}Grade the coordinator and issue the BTC accumulation call.\n${JSON.stringify(compact)}`,
        },
      ],
    }),
  });
  if (!res.ok) return { ok: false as const, error: `xAI API error ${res.status}` };
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return { ok: true as const, text: body.choices?.[0]?.message?.content ?? "" };
}

export const askHelios = createServerFn({ method: "POST" })
  .validator((input: Input) => input)
  .handler(async ({ data }) => {
    if (!(await verifyDeskToken(data.token))) {
      return { ok: false as const, error: "Desk session required." };
    }
    const limited = grokRateLimit();
    if (limited) return { ok: false as const, error: limited };

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Grok is not available in this environment." };
    return gradeWithKey(apiKey, undefined);
  });

/** Signed-in visitor Ask Grok using THEIR xAI key. Key is never stored. Operator SuperGrok is not spent. */
export const askHeliosByo = createServerFn({ method: "POST" })
  .validator((input: ByoInput) => input)
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser(data.bearer);
    let copyAdmin = false;
    if (!user && data.appToken) {
      const { isAppAdminToken } = await import("./tenancy");
      if (isAppAdminToken(data.appToken)) {
        const { verifyAppAdminToken } = await import("./app-admin");
        copyAdmin = Boolean(verifyAppAdminToken(data.appToken));
      }
    }
    if (!user && !copyAdmin) {
      return {
        ok: false as const,
        error: "Sign in with X, or unlock your copy Admin, then paste your xAI API key. This host never stores it and never spends operator SuperGrok on visitor Ask Grok.",
      };
    }
    const limited = grokRateLimit();
    if (limited) return { ok: false as const, error: limited };
    if (!looksLikeXaiKey(data.xaiKey)) {
      return { ok: false as const, error: "That is not an xAI API key. Create one at console.x.ai. Never paste Coinbase or wallet secrets." };
    }
    const { looksLikeSecret } = await import("./security");
    if (looksLikeSecret(data.xaiKey)) {
      return { ok: false as const, error: "Secret rejected. Never paste Coinbase keys, seeds, or xprv." };
    }
    const { inspectAgentInput } = await import("./agent-security");
    const q = (data.question ?? "").trim();
    if (q && inspectAgentInput(q).block) {
      return { ok: false as const, error: "Question rejected. Prompt-injection / goal-hijack text is not sent to Grok." };
    }
    return gradeWithKey(data.xaiKey.trim(), data.question);
  });

export const adminStatus = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const exp = Number(data.token.split(".")[0]);
    return {
      ok: true as const,
      grok: grokUsage(),
      grokReady: Boolean(process.env.XAI_API_KEY),
      exp: Number.isFinite(exp) ? exp : null,
      adminName: await storedAdminName(),
    };
  });
