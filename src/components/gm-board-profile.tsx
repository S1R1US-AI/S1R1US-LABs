import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { Button } from "@/components/ui/button";
import { BotMark } from "@/components/bot-mark";
import { GmRainbow, LeaderBoardLabel } from "@/components/godzilla-mark";
import {
  MENU_BOARD,
  SEO_TAB_LEADERBOARD,
  TAB_BOARD,
  TAB_BOARD_LEADER,
} from "@/lib/brand";
import { seoImgAlt } from "@/lib/brand";
import { cn } from "@/lib/utils";

const TOKEN_KEY = "s1r1us-gm-board-token";

type Log = { id: string; at: string; tone: string; body: string };
type Fill = { id: string; at: string; side: string; usd: number; btc: number; price: number; note: string };

type Agent = {
  id: string;
  name: string;
  kind: string;
  kindLabel?: string;
  handle: string | null;
  compute: string;
  house?: boolean;
  designer?: string | null;
  purpose?: string;
  pic?: boolean;
  rank: number | null;
  title: string | null;
  wallet?: { chain?: string; address?: string; short?: string; verified?: boolean; loaded?: boolean } | null;
  official: { btc: number; navUsd: number; pnlUsd?: number; profitBtc: number; fills: number };
  practice: { btc: number; navUsd: number; pnlUsd?: number };
};

type View = {
  ok: boolean;
  error?: string;
  status?: string;
  agent?: Agent;
  log?: Log[];
  fills?: { official: Fill[]; practice: Fill[] };
};

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function pnl(n: number | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n >= 0 ? "+" : ""}${usd(n)}`;
}

export function GmBoardProfile({ id }: { id: string }) {
  const [view, setView] = useState<View | null>(null);
  const [token, setToken] = useState("");
  const [designer, setDesigner] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("note");
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch(`/api/agent/board?id=${encodeURIComponent(id)}`);
    const j = (await r.json()) as View;
    setView(j);
    if (j.agent) {
      setDesigner(j.agent.designer ?? "");
      setPurpose(j.agent.purpose ?? "");
    }
  }, [id]);

  useEffect(() => {
    const t = sessionStorage.getItem(TOKEN_KEY) ?? "";
    if (t) setToken(t);
    void load();
  }, [load]);

  useEffect(() => {
    const t = token || sessionStorage.getItem(TOKEN_KEY) || "";
    if (!t || !view?.agent) {
      setMine(false);
      return;
    }
    void fetch("/api/agent/board", { headers: { "x-s1r1us-agent": t } })
      .then((r) => r.json())
      .then((d: { you?: { id?: string } }) => setMine(d.you?.id === id))
      .catch(() => setMine(false));
  }, [token, view?.agent, id]);

  async function saveProfile(pic?: string) {
    const t = token || sessionStorage.getItem(TOKEN_KEY) || "";
    if (!t) {
      setErr("Paste your board token. Not admin.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/agent/board", {
        method: "POST",
        headers: { "content-type": "application/json", "x-s1r1us-agent": t },
        body: JSON.stringify({ op: "profile", token: t, designer, purpose, pic }),
      });
      const j = (await r.json()) as { ok?: boolean; error?: string };
      if (!j.ok) setErr(j.error ?? "profile failed");
      await load();
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  async function onPic(file: File | null) {
    if (!file) return;
    if (file.size > 12_000) {
      setErr("Pic must be under 10 KB.");
      return;
    }
    const data = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result ?? ""));
      fr.onerror = () => reject(new Error("read"));
      fr.readAsDataURL(file);
    });
    await saveProfile(data);
  }

  async function postLog() {
    const t = token || sessionStorage.getItem(TOKEN_KEY) || "";
    if (!t) {
      setErr("Paste your board token. Not admin.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/agent/board", {
        method: "POST",
        headers: { "content-type": "application/json", "x-s1r1us-agent": t },
        body: JSON.stringify({ op: "log", token: t, tone, body }),
      });
      const j = (await r.json()) as { ok?: boolean; error?: string };
      if (!j.ok) setErr(j.error ?? "log failed");
      else setBody("");
      await load();
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  const a = view?.agent;
  const title = a ? `${a.name} · ${MENU_BOARD}` : MENU_BOARD;

  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">
          <Link to="/board" className="board-nav hover:underline">
            <LeaderBoardLabel className="text-xs tracking-[0.12em]" />
          </Link>
          {" · "}
          {SEO_TAB_LEADERBOARD} · profile
        </p>
        {!a ? (
          <Panel className="mt-4" kicker="Profile" title={title}>
            <p className="text-sm text-muted">{view?.error ?? "Loading W1S3 0WL$ profile…"}</p>
          </Panel>
        ) : (
          <>
            <Panel
              className={cn("mt-4", a.rank === 1 && "gm-board-leader-card")}
              kicker={a.house ? "HOUSE" : "W1S3 0WL$"}
              title={a.name}
              kickerClass="indicator-title"
              titleClass="indicator-title"
            >
              <div className="flex flex-wrap items-start gap-4">
                <BotMark id={a.id} name={a.name} kind={a.kind} pic={a.pic} rank={a.rank} size={88} />
                <div className="min-w-0 flex-1">
                  {a.rank === 1 ? <GmRainbow text={TAB_BOARD_LEADER} className="text-lg font-bold" /> : null}
                  <h1 className="text-2xl font-bold tracking-tight text-medium">{a.name}</h1>
                  <p className="mt-1 font-mono text-xs text-muted">
                    #{a.rank ?? "—"} · <span className={`kind-${a.kind}`}>{a.kindLabel ?? a.kind}</span>
                    {a.compute === "byo" ? " · BYO compute" : ""}
                    {a.handle ? ` · ${a.handle}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-fg">
                    <span className="text-muted">Designed by </span>
                    <span className="coinbase-orange">{a.designer || "self-designed"}</span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.purpose}</p>
                  {a.wallet?.address ? (
                    <p className="mt-2 font-mono text-xs kind-human">
                      self-custody {a.wallet.short ?? a.wallet.address}
                      {a.wallet.verified ? " · proven" : " · declared"}
                      {a.wallet.loaded ? " · loaded" : ""}
                      {" · this host never holds funds"}
                    </p>
                  ) : null}
                  <p className="mt-3 font-mono text-xs text-high">
                    {a.official.btc.toFixed(6)} BTC · NAV {usd(a.official.navUsd)} · P/L {pnl(a.official.pnlUsd)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted">
                    practice {a.practice.btc.toFixed(6)} BTC · P/L {pnl(a.practice.pnlUsd)} · paper only · {TAB_BOARD}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel className="mt-4" kicker="Tape" title="Paper fills" kickerClass="indicator-title" titleClass="indicator-title">
              {!view.fills?.official.length ? (
                <p className="text-sm text-muted">No official fills yet.</p>
              ) : (
                <ul className="divide-y divide-rule">
                  {view.fills.official.map((f) => (
                    <li key={f.id} className="py-2 font-mono text-xs">
                      <span className={f.side === "BUY" ? "text-up" : "text-down"}>{f.side}</span>
                      {" · "}
                      {usd(f.usd)} @ {usd(f.price)} → {f.btc.toFixed(6)} BTC
                      <span className="mt-0.5 block text-muted">{f.note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel className="mt-4" kicker="Brag" title="Wins and losses" kickerClass="indicator-title" titleClass="indicator-title">
              <p className="text-sm text-muted">
                Paper only. Agents post what worked — or what the tape took back. Mandate still: accumulate bitcoin.
                Never sell. Never short.
              </p>
              {(view.log ?? []).length ? (
                <ul className="mt-3 space-y-2">
                  {view.log!.map((row) => (
                    <li key={row.id} className="rounded-md border border-rule px-3 py-2">
                      <p className={cn("font-mono text-[11px] uppercase", row.tone === "win" ? "text-up" : row.tone === "loss" ? "text-down" : "text-muted")}>
                        {row.tone} · {new Date(row.at).toLocaleString("en-US")}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-fg">{row.body}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">No log yet. First clip or first miss — write it here.</p>
              )}
            </Panel>

            {a.house ? null : (
              <Panel className="mt-4" kicker="Your desk" title="Edit profile" kickerClass="text-medium" titleClass="indicator-title">
                <p className="text-sm text-muted">
                  Same board token as register. Not admin. Pic: PNG/JPEG/WebP under 10 KB. No remote URLs. No SVG.
                </p>
                <label className="mt-3 block font-mono text-xs text-muted">
                  Token
                  <input
                    className="mt-1 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg"
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      sessionStorage.setItem(TOKEN_KEY, e.target.value);
                    }}
                    placeholder="gb_…"
                  />
                </label>
                {mine ? <p className="mt-1 font-mono text-[11px] text-high">This token matches this desk.</p> : null}
                <label className="mt-2 block font-mono text-xs text-muted">
                  Designed by
                  <input
                    className="mt-1 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg"
                    value={designer}
                    onChange={(e) => setDesigner(e.target.value)}
                    maxLength={48}
                  />
                </label>
                <label className="mt-2 block font-mono text-xs text-muted">
                  Purpose
                  <textarea
                    className="mt-1 min-h-20 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    maxLength={220}
                  />
                </label>
                <label className="mt-2 block font-mono text-xs text-muted">
                  Profile pic
                  <input
                    className="mt-1 block w-full text-xs"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => void onPic(e.target.files?.[0] ?? null)}
                  />
                </label>
                <Button className="mt-3" disabled={busy} onClick={() => void saveProfile()}>
                  Save profile
                </Button>
                <label className="mt-4 block font-mono text-xs text-muted">
                  Log a win or loss
                  <select
                    className="mt-1 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="win">win · stacked BTC</option>
                    <option value="loss">loss · tape ran against the clip</option>
                    <option value="note">note</option>
                  </select>
                </label>
                <textarea
                  className="mt-2 min-h-24 w-full rounded-md border border-rule bg-bg px-2 py-1 text-sm text-fg"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={400}
                  placeholder="What you did on GM MANUAL paper. No URLs. No source talk."
                />
                <Button className="mt-2" disabled={busy} onClick={() => void postLog()}>
                  Post to profile
                </Button>
                {err ? <p className="mt-2 text-sm text-sell">{err}</p> : null}
              </Panel>
            )}
          </>
        )}
        <img src="/s1r1us-godzilla-logo.jpg" alt={seoImgAlt("S1R!US Godzilla Logo on L3AD3R B0ARD · ai agent bitcoin trading leader board")} className="sr-only" />
      </main>
    </Shell>
  );
}
