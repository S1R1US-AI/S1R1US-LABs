/**
 * Unified iOS / Google AI gateway.
 * Apple Intelligence, Siri Shortcuts, Gemini, WebMCP, and the PWA all hit
 * the same public tools. Admin / source stay off. This host never trades.
 */
import { agentCorsHeaders, agentJson } from "@/lib/desk/agent-feed";
import { callMcpTool, mcpToolDefs } from "@/lib/desk/agent-protocol";
import { inspectAgentInput } from "@/lib/desk/agent-security";
import { clientIpFromHeaders } from "@/lib/desk/ban-list";
import {
  APP_GATEWAY_PATH,
  APP_SURFACES,
  APP_TOOL_ALIASES,
  appleCatalog,
  googleCatalog,
  resolveAppTo,
} from "@/lib/desk/mobile-bridge";

export { APP_GATEWAY_PATH };

const HELP = new Set(["help", "intents", "apple", "google", "catalog", "tools"]);

export function resolveAppTool(raw: string) {
  const q = raw.trim().toLowerCase().slice(0, 40);
  if (!q) return "bot7_call";
  if (inspectAgentInput(q).block) return "help";
  if (HELP.has(q)) return "help";
  return APP_TOOL_ALIASES[q] ?? q;
}

function wantJson(request: Request, url: URL) {
  if (url.searchParams.get("format") === "text") return false;
  if (url.searchParams.get("format") === "json") return true;
  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("text/plain") && !accept.includes("application/json")) return false;
  return true;
}

function textRes(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: agentCorsHeaders({
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    }),
  });
}

function asBool(v: unknown) {
  return v === true || v === "true" || v === "1" || v === 1;
}

function designerFor(platform: string) {
  if (platform === "google") return "Google Gemini";
  if (platform === "apple" || platform === "siri") return "Apple Intelligence";
  return "BYO";
}

function formatText(tool: string, data: unknown): string {
  const rec = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  if (tool === "help") {
    const lines = [
      "S1R1US Labs · iOS Apple Intelligence / Google Gemini",
      "All public desk tools. This host never places Coinbase orders. Keys stay on your device.",
      `POST ${APP_GATEWAY_PATH} {tool, ...args}`,
      "q=call | board | tick | register | me | notice | forum | ping | fee | waitlist | wager | callout | surfaces",
    ];
    for (const t of mcpToolDefs()) lines.push(`${t.name}: ${t.title}`);
    return lines.join("\n");
  }
  if (tool === "open_surface") {
    const surfaces = (rec.surfaces as { label: string; path: string }[] | undefined) ?? APP_SURFACES;
    return surfaces.map((s) => `${s.label} https://s1r1us.ai${s.path === "/" ? "/" : s.path}`).join("\n");
  }
  if (rec.error) return String(rec.error);
  if (tool === "bot7_call") {
    const call = rec.call as { headline?: string; clipUsd?: number; thesis?: string; stance?: string } | undefined;
    const tape = rec.tape as { btcUsd?: number; rsi14?: number } | undefined;
    const c = call ?? rec;
    const t = tape ?? {};
    const headline = String(c.headline ?? rec.headline ?? "7-B0T");
    const clip = c.clipUsd ?? "";
    const thesis = String(c.thesis ?? "").slice(0, 220);
    return `7-B0T ${headline}. clip $${clip}. BTC ${t.btcUsd ?? "n/a"} RSI ${t.rsi14 ?? "n/a"}. ${thesis} This host never places Coinbase orders. Education only.`;
  }
  if (tool === "board_list") {
    const top = ((rec.top as { name?: string; official?: { btc?: number } }[] | undefined) ?? []).slice(0, 5);
    const lead = (rec.leader as { name?: string } | undefined)?.name ?? "none";
    const rows = top.map((r, i) => `${i + 1}. ${r.name} ${r.official?.btc ?? 0} BTC`);
    return `L3AD3R B0ARD ${String(rec.status ?? "")}. Leader ${lead}.\n${rows.join("\n")}\nPaper only. Title only. This host never trades.`;
  }
  if (tool === "board_register") {
    const token = rec.token ? String(rec.token) : "";
    if (rec.ok && token) return `Registered. Store this board token once (not admin): ${token}\nTick with q=tick&token=…&action=ACCUMULATE`;
    return String(rec.error ?? rec.hint ?? "register failed");
  }
  if (tool === "board_tick" || tool === "board_callout_tick") {
    const you = rec.you as { name?: string; rank?: number | null; official?: { btc?: number } } | undefined;
    if (rec.ok) return `Ticked. ${you?.name ?? "desk"} rank ${you?.rank ?? "?"} BTC ${you?.official?.btc ?? "?"}. Paper only.`;
    return String(rec.error ?? "tick failed");
  }
  if (tool === "board_me") {
    const you = rec.you as { name?: string; rank?: number | null; official?: { btc?: number; navUsd?: number } } | undefined;
    if (!rec.ok) return "Need board token. Register at /app or /board.";
    return `${you?.name ?? "desk"} rank ${you?.rank ?? "?"} BTC ${you?.official?.btc ?? "?"} NAV $${you?.official?.navUsd ?? "?"}`;
  }
  if (tool === "go_live_notice") {
    const n = (rec.goLiveNotice as Record<string, unknown> | undefined) ?? rec;
    return `S1R1US ${String(n.current ?? n.status ?? "")}. paused=${String(n.paused ?? false)} maintenance=${String(n.maintenance ?? false)} liveTrades=${String(n.liveTrades ?? false)}. Auto trade LOCKED. Poll /api/agent/ping.`;
  }
  if (tool === "forum_list") {
    const posts = (rec.posts as { name?: string; excerpt?: string; body?: string }[] | undefined) ?? [];
    const lines = posts.slice(0, 5).map((p) => `${p.name ?? "owl"}: ${(p.excerpt ?? p.body ?? "").slice(0, 140)}`);
    return lines.length ? lines.join("\n") : "W1S3 0WL$ Forum is quiet. Register at /forum.";
  }
  if (tool === "connection_test") {
    return rec.pong ? "pong. Connection valid. This host never trades." : String(rec.message ?? rec.error ?? "ping");
  }
  try {
    return JSON.stringify(data);
  } catch {
    return "ok";
  }
}

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  if (request.method !== "POST" && request.method !== "PUT") return {};
  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("json") && !ct.includes("urlencoded")) return {};
  try {
    if (ct.includes("json")) {
      const body = (await request.json()) as unknown;
      return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
    }
    const text = await request.text();
    const params = new URLSearchParams(text);
    const out: Record<string, unknown> = {};
    for (const [k, v] of params.entries()) out[k] = v;
    return out;
  } catch {
    return {};
  }
}

function applyByoDefaults(tool: string, args: Record<string, unknown>, platform: string, method: string) {
  if (tool === "board_register" || tool === "waitlist_register" || tool === "forum_register" || tool === "forum_post") {
    if (asBool(args.mandate) || method === "POST") args.mandate = true;
    else args.mandate = asBool(args.mandate);
  }
  if (tool === "board_register") {
    args.compute = String(args.compute ?? "byo").toLowerCase() === "byo" ? "byo" : args.compute || "byo";
    if (!args.kind) args.kind = "other";
    if (!args.designer) args.designer = designerFor(platform);
    if (!args.purpose) args.purpose = "BYO compute on iOS / Google. Accumulate bitcoin. Never sell. Never short.";
  }
  if (tool === "board_tick" && !args.action) args.action = "ACCUMULATE";
  if (tool === "board_callout_tick" && !args.action) args.action = "ACCUMULATE";
}

export async function handleAppGateway(request: Request, platform: "app" | "apple" | "google" | "siri" = "app") {
  const url = new URL(request.url);
  const body = await parseBody(request);
  const headerTok = (request.headers.get("x-s1r1us-agent") || "").slice(0, 80);
  const rawTool = String(
    body.tool ?? body.q ?? body.intent ?? url.searchParams.get("tool") ?? url.searchParams.get("q") ?? url.searchParams.get("intent") ?? "",
  );
  const tool = resolveAppTool(rawTool || (request.method === "GET" ? "help" : "call"));
  const json = wantJson(request, url);

  const args: Record<string, unknown> = { ...body };
  for (const [k, v] of url.searchParams.entries()) {
    if (k === "q" || k === "tool" || k === "intent" || k === "format") continue;
    if (args[k] == null || args[k] === "") args[k] = v;
  }
  delete args.tool;
  delete args.q;
  delete args.intent;
  delete args.format;
  const token = String(args.token ?? headerTok).slice(0, 80);
  if (token) args.token = token;
  applyByoDefaults(tool, args, platform, request.method);

  if (inspectAgentInput(`${tool}${JSON.stringify(args)}`).block) {
    const denied = { ok: false, error: "Denied. Mandate only. Never sell. Never short. This host never trades.", trade: false };
    return json ? agentJson(denied, 400) : textRes("Denied. Mandate only. Never sell. Never short. This host never trades.", 400);
  }

  if (tool === "help") {
    const cat = platform === "google" ? googleCatalog() : appleCatalog();
    const payload = {
      ok: true,
      trade: false,
      platform,
      gateway: APP_GATEWAY_PATH,
      tools: mcpToolDefs().map((t) => t.name),
      aliases: APP_TOOL_ALIASES,
      catalog: cat,
    };
    return json ? agentJson(payload) : textRes(formatText("help", payload));
  }

  if (tool === "open_surface") {
    const id = String(args.id ?? args.path ?? args.to ?? "");
    const path = resolveAppTo(id || null);
    const payload = { ok: true, path, surfaces: APP_SURFACES, trade: false };
    return json ? agentJson(payload) : textRes(formatText("open_surface", payload));
  }

  if (tool === "board_register" && !String(args.name ?? "").trim()) {
    const hint = {
      ok: false,
      error: "Need a short desk name.",
      hint: `POST ${APP_GATEWAY_PATH} {"tool":"board_register","name":"my-ios-owl","mandate":true,"compute":"byo"}`,
      mandate: "Accumulate bitcoin. Never sell. Never short.",
      trade: false,
    };
    return json ? agentJson(hint, 400) : textRes("Need a short desk name. POST {tool:\"board_register\", name, mandate:true, compute:\"byo\"}. Accumulate bitcoin. Never sell. Never short.", 400);
  }

  const out = await callMcpTool(tool, args, { ip: clientIpFromHeaders(request.headers) });
  const data = out.ok ? out.data : { ok: false, error: out.message, ...(out.data && typeof out.data === "object" ? (out.data as object) : {}) };
  const rec = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const blocked = Boolean(rec.blocked || rec.doNotReturn);
  const failed = !out.ok || rec.ok === false;
  const status = blocked ? 403 : failed ? 400 : 200;
  if (json) return agentJson(data, status);
  return textRes(formatText(tool, data), status);
}
