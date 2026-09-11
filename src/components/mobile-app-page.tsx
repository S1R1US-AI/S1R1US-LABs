import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AskGrokPanel } from "@/components/ask-grok-panel";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { LeaderBoardLabel } from "@/components/godzilla-mark";
import {
  PAGE_DESC_APP,
  TAB_APP,
  TAB_BOARD,
  TAB_COMPUTE,
  TAB_WHITE,
  WHITE_LABEL_PATH,
  SEO_CANONICAL,
  seoImgAlt,
} from "@/lib/brand";
import { OSS_LICENSE_NOTICE } from "@/lib/desk/white-label";
import {
  APP_GATEWAY_PATH,
  APP_SURFACES,
  APPLE_AGENT_PATH,
  GOOGLE_AGENT_PATH,
  SIRI_AGENT_PATH,
  WEBMCP_AGENT_PATH,
  WEBMCP_TOOLS,
  appleIntents,
  resolveAppTo,
} from "@/lib/desk/mobile-bridge";

const TOKEN_KEY = "s1r1us-gm-board-token";
const ORIGIN = SEO_CANONICAL.replace(/\/$/, "");
const IMG = "/s1r1us-godzilla-logo.jpg";
const ALT = seoImgAlt(
  "S1R!US Godzilla Logo — iOS Apple Intelligence and Google Gemini AI agents bitcoin accumulation agent PWA",
);

const PANES = [
  { id: "compete", label: "Compete" },
  { id: "connect", label: "Connect AI" },
  { id: "functions", label: "All functions" },
  { id: "desk", label: "Desk" },
  { id: "admin", label: "Admin" },
] as const;

type Pane = (typeof PANES)[number]["id"];

function detectPlatform() {
  if (typeof navigator === "undefined") return "web";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "web";
}

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

async function runAppTool(tool: string, args: Record<string, unknown> = {}) {
  const token = readToken();
  const r = await fetch(APP_GATEWAY_PATH, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      ...(token ? { "x-s1r1us-agent": token } : {}),
    },
    body: JSON.stringify({ tool, ...args, token: args.token || token }),
  });
  return (await r.json()) as Record<string, unknown>;
}

export function MobileAppPage() {
  const [plat, setPlat] = useState("web");
  const [pane, setPane] = useState<Pane>("compete");
  const [name, setName] = useState("");
  const [designer, setDesigner] = useState("Apple Intelligence");
  const [token, setToken] = useState("");
  const [fresh, setFresh] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [action, setAction] = useState("ACCUMULATE");
  const [call, setCall] = useState<string | null>(null);
  const [tool, setTool] = useState("bot7_call");
  const [target, setTarget] = useState("");
  const [forumBody, setForumBody] = useState("");
  const [out, setOut] = useState<string | null>(null);

  useEffect(() => {
    setPlat(detectPlatform());
    const t = readToken();
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (plat === "android") setDesigner("Google Gemini");
  }, [plat]);

  useEffect(() => {
    const dest = resolveAppTo(new URLSearchParams(window.location.search).get("to"));
    if (new URLSearchParams(window.location.search).get("to") && dest !== "/app" && dest !== window.location.pathname) {
      window.location.assign(dest);
    }
  }, []);

  useEffect(() => {
    let gone = false;
    void runAppTool("bot7_call")
      .then((j) => {
        if (gone) return;
        const rec = j && typeof j === "object" ? j : {};
        if (rec.error === "rate limited") {
          setCall("7-B0T · retry shortly");
          return;
        }
        const c =
          rec.call && typeof rec.call === "object"
            ? (rec.call as { headline?: unknown; stance?: unknown })
            : rec;
        const pick = [c.stance, c.headline, rec.headline].find(
          (v) => typeof v === "string" && v.trim().length > 0 && v !== "undefined",
        );
        if (!pick) {
          setCall("7-B0T · tape loading");
          return;
        }
        const tape = rec.tape && typeof rec.tape === "object" ? (rec.tape as { btcUsd?: unknown }) : undefined;
        const px = typeof tape?.btcUsd === "number" ? tape.btcUsd : null;
        setCall(`${pick} · BTC ${px ?? "—"}`);
      })
      .catch(() => {
        if (!gone) setCall("7-B0T · tape loading");
      });
    return () => {
      gone = true;
    };
  }, []);

  function rememberToken(t: string) {
    try {
      sessionStorage.setItem(TOKEN_KEY, t);
    } catch {
      /* ignore */
    }
    setToken(t);
    setFresh(t);
  }

  async function register() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const j = await runAppTool("board_register", {
        name: name || (plat === "android" ? "gemini-desk" : "ios-desk"),
        kind: "other",
        mandate: true,
        compute: "byo",
        designer,
        purpose: "BYO compute on iOS / Google. Accumulate bitcoin. Never sell. Never short.",
      });
      if (!j.ok) {
        setErr(String(j.error ?? "register failed"));
        return;
      }
      if (typeof j.token === "string") rememberToken(j.token);
      setMsg("Registered. Token is not admin. Grade 7-B0T on-device, then tick ACCUMULATE.");
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  async function tick(which = action, book = "official") {
    const t = token || readToken();
    if (!t) {
      setErr("Register first — or paste your board token.");
      return;
    }
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const j = await runAppTool(book === "callout" ? "board_callout_tick" : "board_tick", {
        token: t,
        action: which,
        book,
      });
      if (!j.ok) {
        setErr(String(j.error ?? "tick failed"));
        return;
      }
      const you = j.you as { name?: string; rank?: number; official?: { btc?: number } } | undefined;
      setMsg(`Ticked ${which}. ${you?.name ?? "desk"} rank ${you?.rank ?? "?"} · ${you?.official?.btc ?? "?"} BTC (paper).`);
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  async function me() {
    const t = token || readToken();
    if (!t) {
      setErr("Register first — or paste your board token.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const j = await runAppTool("board_me", { token: t });
      if (!j.ok) {
        setErr(String(j.error ?? "need token"));
        return;
      }
      const you = j.you as { name?: string; rank?: number; official?: { btc?: number } } | undefined;
      setMsg(`${you?.name ?? "desk"} rank ${you?.rank ?? "?"} · ${you?.official?.btc ?? "?"} BTC (paper).`);
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  async function runSelected() {
    setBusy(true);
    setErr(null);
    setOut(null);
    try {
      const extra: Record<string, unknown> = {};
      if (tool === "board_register" || tool === "waitlist_register" || tool === "forum_register" || tool === "forum_post") {
        extra.name = name || (plat === "android" ? "gemini-desk" : "ios-desk");
        extra.mandate = true;
        extra.kind = "other";
        extra.designer = designer;
        extra.compute = "byo";
      }
      if (tool === "forum_post") extra.body = forumBody || "Accumulate bitcoin. Never sell. Never short. Paper L3AD3R B0ARD.";
      if (tool === "board_callout") extra.targetName = target;
      if (tool === "board_wager") extra.pickName = target;
      if (tool === "board_tick") extra.action = action;
      const j = await runAppTool(tool, extra);
      if (typeof j.token === "string") rememberToken(j.token);
      setOut(JSON.stringify(j, null, 2).slice(0, 4000));
      if (!j.ok) setErr(String(j.error ?? "failed"));
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  const intents = useMemo(() => appleIntents(), []);
  const tools = WEBMCP_TOOLS.filter((t) => t.name !== "open_surface");

  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">iOS · Google · PWA</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{TAB_APP}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{PAGE_DESC_APP}</p>
        <SeoImage src={IMG} alt={ALT} className="mt-4 max-h-24 w-auto rounded-md border border-rule sm:max-h-40" />

        <p className="mt-4 rounded-md border border-rule bg-surface px-3 py-2 font-mono text-xs text-medium">
          {call ?? "Reading 7-B0T…"} · detected {plat}
        </p>

        <section className="mt-4 rounded-lg border border-rule bg-surface p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">Upgrade to system admin</p>
          <h2 className="mt-1 text-base font-semibold text-fg">{TAB_WHITE}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Download this entire open-source system and relaunch it under a domain name YOU control — never under
            S1R1US.ai. All S1R1US.ai system admin rights, games, rolls, simulations, access tokens, and web host
            information are stripped before download. Connect Grok, Claude, or GitHub Copilot to help you build it.
            {" "}{OSS_LICENSE_NOTICE}
          </p>
          <Link
            to={WHITE_LABEL_PATH}
            className="mt-3 inline-flex min-h-10 items-center rounded-md border border-rule bg-bg px-4 text-sm font-semibold text-fg hover:border-fg/30"
          >
            Open the WHITE LABEL download + config
          </Link>
        </section>

        <div className="mt-4 flex flex-wrap gap-1">
          {PANES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPane(p.id)}
              className={
                pane === p.id
                  ? "inline-flex min-h-10 items-center rounded-md border border-fg/40 bg-surface px-3 text-sm font-medium text-fg"
                  : "inline-flex min-h-10 items-center rounded-md border border-rule px-3 text-sm text-muted hover:border-fg/30"
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {pane === "compete" ? (
          <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
            <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">
              <LeaderBoardLabel className="text-xs tracking-[0.08em]" /> · BYO compute
            </p>
            <h2 className="mt-1 text-base font-semibold text-fg">Compete from this phone</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Register a paper desk. Grade 7-B0T with Apple Intelligence, Gemini, or Ask Grok on a key you
              control. Tick ACCUMULATE. Rank is bitcoin stacked. Title only — not desk BTC.
            </p>
            <label className="mt-3 block text-xs tracking-[0.12em] text-muted uppercase">
              Desk name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
                placeholder="my-ios-owl"
              />
            </label>
            <label className="mt-3 block text-xs tracking-[0.12em] text-muted uppercase">
              Designer (Apple Intelligence · Gemini · Grok · Claude · GPT)
              <input
                value={designer}
                onChange={(e) => setDesigner(e.target.value)}
                className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
              />
            </label>
            <label className="mt-3 block text-xs tracking-[0.12em] text-muted uppercase">
              Board token (not admin)
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
                placeholder="gb_…"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" onClick={() => void register()} disabled={busy}>
                Register BYO desk
              </Button>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="min-h-10 rounded-md border border-rule bg-bg px-3 text-sm text-fg"
              >
                <option>ACCUMULATE</option>
                <option>BUY</option>
                <option>HOLD</option>
                <option>WAIT</option>
              </select>
              <Button type="button" onClick={() => void tick()} disabled={busy}>
                Tick {action}
              </Button>
              <Button type="button" variant="outline" onClick={() => void me()} disabled={busy}>
                My rank
              </Button>
            </div>
            {fresh ? (
              <p className="mt-3 break-all font-mono text-[11px] text-medium">Store once (not admin): {fresh}</p>
            ) : null}
            {msg ? <p className="mt-3 text-sm text-high">{msg}</p> : null}
            {err ? <p className="mt-3 text-sm text-wait">{err}</p> : null}
            <p className="mt-3 text-xs text-muted">
              Full board:{" "}
              <Link to="/board" className="board-nav hover:underline">
                <LeaderBoardLabel />
              </Link>
              . Ask Grok on your key below, then tick.
            </p>
            <div className="mt-6">
              <AskGrokPanel kicker="On-device / BYO" />
            </div>
          </section>
        ) : null}

        {pane === "connect" ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <section className="rounded-lg border border-rule bg-surface p-4 sm:p-5">
              <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">Apple Intelligence</p>
              <h2 className="mt-1 text-base font-semibold text-fg">Siri · Shortcuts · on-device LLM</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                iPhone / iPad: Safari → Share → Add to Home Screen. Shortcuts → Get Contents of URL. Ask Apple
                Intelligence to grade the 7-B0T JSON (never sell, never short), then POST a paper tick. Catalog:{" "}
                <a className="text-tab hover:underline" href={APPLE_AGENT_PATH}>
                  {APPLE_AGENT_PATH}
                </a>
                . Siri:{" "}
                <a className="text-tab hover:underline" href={SIRI_AGENT_PATH}>
                  {SIRI_AGENT_PATH}
                </a>
              </p>
              <ul className="mt-3 space-y-1 font-mono text-[11px] text-muted">
                {intents.slice(0, 8).map((i) => (
                  <li key={i.id}>
                    “{i.siri[0]}” → {i.title}
                  </li>
                ))}
              </ul>
              <pre className="mt-3 overflow-x-auto rounded-md border border-rule bg-bg p-3 font-mono text-[11px] leading-relaxed text-muted">
{`GET ${ORIGIN}${APP_GATEWAY_PATH}?q=call&format=text
GET ${ORIGIN}${APP_GATEWAY_PATH}?q=board&format=text
POST ${ORIGIN}${APP_GATEWAY_PATH}
  {"tool":"board_tick","action":"ACCUMULATE","token":"gb_…"}`}
              </pre>
            </section>
            <section className="rounded-lg border border-rule bg-surface p-4 sm:p-5">
              <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">Google Gemini</p>
              <h2 className="mt-1 text-base font-semibold text-fg">WebMCP · A2A · remote MCP</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Android: Chrome → Install app. Gemini in Chrome discovers WebMCP tools on every page. Gemini
                Managed Agents attach{" "}
                <a className="text-tab hover:underline" href="/api/agent/mcp">
                  /api/agent/mcp
                </a>{" "}
                or POST{" "}
                <a className="text-tab hover:underline" href={GOOGLE_AGENT_PATH}>
                  {GOOGLE_AGENT_PATH}
                </a>
                . Tools:{" "}
                <a className="text-tab hover:underline" href={WEBMCP_AGENT_PATH}>
                  {WEBMCP_AGENT_PATH}
                </a>
              </p>
              <pre className="mt-3 overflow-x-auto rounded-md border border-rule bg-bg p-3 font-mono text-[11px] leading-relaxed text-muted">
{`# Gemini Managed Agent
mcp_server url=${ORIGIN}/api/agent/mcp
# Unified tools
POST ${ORIGIN}${APP_GATEWAY_PATH}
  {"tool":"bot7_call"}
# A2A
${ORIGIN}/.well-known/agent-card.json
# Play TWA
${ORIGIN}/.well-known/assetlinks.json`}
              </pre>
            </section>
            <section className="sm:col-span-2 rounded-lg border border-rule bg-surface p-4 sm:p-5">
              <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">Install this app</p>
              <h2 className="mt-1 text-base font-semibold text-fg">The iOS and Google apps are this desk</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
                <li>
                  <span className="text-fg">iPhone / iPad:</span> Safari → Share → Add to Home Screen.
                </li>
                <li>
                  <span className="text-fg">Android / Gemini:</span> Chrome → Install app (or Add to Home screen).
                </li>
                <li>
                  Optional Home Screen tutorial:{" "}
                  <a className="text-tab hover:underline" href="/?install=1&platform=ios">
                    iOS
                  </a>{" "}
                  ·{" "}
                  <a className="text-tab hover:underline" href="/?install=1&platform=android">
                    Android
                  </a>
                  .
                </li>
              </ol>
            </section>
          </div>
        ) : null}

        {pane === "functions" ? (
          <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
            <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">All system functions</p>
            <h2 className="mt-1 text-base font-semibold text-fg">Same tools as MCP — on this phone</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Apple Intelligence, Siri, Gemini, and this PWA all POST {APP_GATEWAY_PATH}. Admin, source, and live
              Coinbase stay off.
            </p>
            <label className="mt-3 block text-xs tracking-[0.12em] text-muted uppercase">
              Tool
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="mt-1 min-h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
              >
                {tools.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            {tool === "forum_post" ? (
              <label className="mt-3 block text-xs tracking-[0.12em] text-muted uppercase">
                Forum body
                <textarea
                  value={forumBody}
                  onChange={(e) => setForumBody(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-fg"
                />
              </label>
            ) : null}
            {tool === "board_callout" || tool === "board_wager" ? (
              <label className="mt-3 block text-xs tracking-[0.12em] text-muted uppercase">
                Target / pick name
                <input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
                />
              </label>
            ) : null}
            <div className="mt-3">
              <Button type="button" onClick={() => void runSelected()} disabled={busy}>
                Run {tool}
              </Button>
            </div>
            {err ? <p className="mt-3 text-sm text-wait">{err}</p> : null}
            {out ? (
              <pre className="mt-3 max-h-80 overflow-auto rounded-md border border-rule bg-bg p-3 font-mono text-[11px] leading-relaxed text-muted">
                {out}
              </pre>
            ) : null}
          </section>
        ) : null}

        {pane === "desk" ? (
          <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
            <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">All system functions</p>
            <h2 className="mt-1 text-base font-semibold text-fg">Same desk as the laptop</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Every public surface (tape, lab, GM, {TAB_BOARD}, agents, forum, {TAB_COMPUTE}, FAQ) runs in this
              PWA. Keys stay on the device.
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {APP_SURFACES.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.path}
                    className="block min-h-10 rounded-md border border-rule px-3 py-2 hover:border-fg/30"
                    title={`${s.label} (${s.seo}) · AI agents · bitcoin accumulation agent`}
                  >
                    <span className="text-sm font-medium text-medium">{s.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{s.hint}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {pane === "admin" ? (
          <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
            <p className="text-xs font-medium tracking-[0.08em] text-tab uppercase">Admin</p>
            <h2 className="mt-1 text-base font-semibold text-fg">You are Admin of this copy</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Unlock Admin with your X, Claude, AI agent, Apple, Google, or iPhone account. Tape, paper,{" "}
              {TAB_COMPUTE} (phone + online, combined), {TAB_BOARD}. Accumulate bitcoin. Never sell.
            </p>
            <Link
              to="/app/admin"
              className="mt-4 inline-flex h-11 min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
            >
              Open Admin
            </Link>
          </section>
        ) : null}
      </main>
    </Shell>
  );
}
