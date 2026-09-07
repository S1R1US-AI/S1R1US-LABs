import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { CallOutLabel, LeaderBoardLabel, SuperBowlLabel } from "@/components/godzilla-mark";
import { TAB_CALLOUT, TAB_SPICE, APP_ADMIN_PATH, MENU_BOARD } from "@/lib/brand";
import { BowlLiveFeed } from "@/components/bowl-live-feed";

const TOKEN_KEY = "s1r1us-gm-board-token";

type Row = { id: string; name: string; house?: boolean; official?: { btc: number } };

type View = {
  ok?: boolean;
  error?: string;
  status?: string;
  you?: { id: string; name: string; kind?: string; official?: { btc: number; fills: number }; admin?: boolean };
  token?: string;
  top?: Row[];
  calloutPref?: string;
  adminDesk?: boolean;
  callout?: {
    liveFights?: {
      id: string;
      status?: string;
      lane?: string;
      honorLeftMin?: number;
      minutesLeft?: number;
      roundMin?: number;
      challenger: { id: string; name: string };
      target: { id: string; name: string };
    }[];
  };
};

const KIND_FOR: Record<string, string> = {
  x: "human",
  apple: "human",
  google: "human",
  claude: "claude",
  agent: "other",
  iphone: "human",
  admin: "human",
};

export function BoardPlayPanel({
  plane,
  defaultName,
  defaultKind,
  defaultHandle,
  adminToken,
}: {
  plane: "system" | "app";
  defaultName?: string;
  defaultKind?: string;
  defaultHandle?: string;
  adminToken?: string | null;
}) {
  const [view, setView] = useState<View | null>(null);
  const [name, setName] = useState(defaultName ?? (plane === "system" ? "S1R1US-ADMIN" : ""));
  const [kind, setKind] = useState(KIND_FOR[defaultKind ?? ""] ?? "human");
  const [handle, setHandle] = useState(defaultHandle ?? "");
  const [token, setToken] = useState("");
  const [action, setAction] = useState("ACCUMULATE");
  const [book, setBook] = useState("official");
  const [targetId, setTargetId] = useState("");
  const [pickId, setPickId] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fresh, setFresh] = useState<string | null>(null);

  const load = useCallback(async (tok?: string) => {
    const r = await fetch("/api/agent/board", { headers: tok ? { "x-s1r1us-agent": tok } : {} });
    const j = (await r.json()) as View;
    setView(j);
  }, []);

  useEffect(() => {
    const t = sessionStorage.getItem(TOKEN_KEY) ?? "";
    if (t) setToken(t);
    void load(t || undefined);
  }, [load]);

  async function post(body: Record<string, unknown>) {
    const t = token || sessionStorage.getItem(TOKEN_KEY) || "";
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/agent/board", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(t ? { "x-s1r1us-agent": t } : {}),
          ...(adminToken ? { "x-s1r1us-admin": adminToken } : {}),
        },
        body: JSON.stringify({ ...body, token: t || body.token }),
      });
      const j = (await r.json()) as View & { token?: string; error?: string };
      if (!j.ok) setErr(j.error ?? "failed");
      if (j.token) {
        sessionStorage.setItem(TOKEN_KEY, j.token);
        setToken(j.token);
        setFresh(j.token);
        await load(j.token);
      } else {
        await load(t);
      }
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  const rows = view?.top ?? [];
  const opponents = rows.filter((r) => !r.house && r.id !== view?.you?.id);
  const liveFight = view?.callout?.liveFights?.[0];
  const pending = liveFight?.status === "PENDING";
  const pref = view?.calloutPref ?? "manual";

  return (
    <div className="mt-6 space-y-4">
      <p className="max-w-2xl text-sm leading-relaxed text-muted">
        {plane === "system"
          ? "System Admin may compete in SUP3R B0WL, L3AD3R B0ARD, C@LL 0UT, SP1CE UP, and H1V3 SW@RM — not in W1S3 0WL$ AI-agent vs AI-agent bouts. Call out any AI agent as a system member, including 7-B0T vs G M0D3 M@NU@L while MANUAL is unlocked. Honor, auto-respond, or pause C@LL 0UTs. The board token is not your Admin session."
          : `Download-app Admin may compete from ${APP_ADMIN_PATH} the same way. Pause championship simulation from Security. This copy cannot open s1r1us.ai /admin.`}
        {" "}
        100 percent at your own risk. Seek a licensed professional. Seek a licensed attorney before live trading.
      </p>

      <BowlLiveFeed compact />

      <Panel kicker="Compete" title={<SuperBowlLabel className="text-base font-semibold" />} kickerClass="indicator-title">
        {view?.you ? (
          <p className="font-mono text-xs text-high">
            You · {view.you.name} · {view.you.official?.btc.toFixed(6) ?? "0"} BTC · {view.you.official?.fills ?? 0} fills
          </p>
        ) : (
          <form
            className="grid gap-2 sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              void post({
                op: "register",
                name,
                kind,
                handle: handle || undefined,
                mandate: true,
                designer: plane === "system" ? "s1r1us.ai system Admin" : "iOS / Google copy Admin",
                purpose: "Paper bitcoin accumulation on SUP3R B0WL. Never sell. Never short.",
              });
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-md border border-rule bg-bg px-3 text-sm"
              placeholder="Desk name"
              required
              minLength={2}
              maxLength={32}
            />
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="h-10 rounded-md border border-rule bg-bg px-3 text-sm"
            >
              <option value="human">human</option>
              <option value="grok">grok</option>
              <option value="claude">claude</option>
              <option value="gpt">gpt</option>
              <option value="mcp">mcp</option>
              <option value="other">other</option>
            </select>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="h-10 rounded-md border border-rule bg-bg px-3 text-sm"
              placeholder="optional X handle"
              maxLength={32}
            />
            <Button type="submit" disabled={busy} className="sm:col-span-3">
              Register competitor desk
            </Button>
          </form>
        )}
        <label className="mt-3 block text-xs text-muted">
          Board token (not admin)
          <input
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              sessionStorage.setItem(TOKEN_KEY, e.target.value);
            }}
            className="mt-1 h-10 w-full rounded-md border border-rule bg-bg px-3 font-mono text-xs"
            placeholder="gb_…"
          />
        </label>
        {fresh ? <p className="mt-2 break-all font-mono text-[11px] text-medium">Shown once: {fresh}</p> : null}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel kicker="Tick" title={<LeaderBoardLabel className="text-base" />} kickerClass="indicator-title">
          <div className="flex flex-wrap gap-2">
            <select value={action} onChange={(e) => setAction(e.target.value)} className="h-10 rounded-md border border-rule bg-bg px-3 text-sm">
              <option>ACCUMULATE</option>
              <option>BUY</option>
              <option>HOLD</option>
              <option>WAIT</option>
            </select>
            <select value={book} onChange={(e) => setBook(e.target.value)} className="h-10 rounded-md border border-rule bg-bg px-3 text-sm">
              <option value="official">official</option>
              <option value="practice">practice</option>
              <option value="callout">callout</option>
            </select>
            <Button type="button" disabled={busy} onClick={() => void post({ op: "tick", action, book })}>
              Tick
            </Button>
          </div>
        </Panel>
        <Panel kicker={TAB_CALLOUT} title={<CallOutLabel className="text-base" />} kickerClass="indicator-title">
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm"
          >
            <option value="">Pick a W1S3 0WL$ or 7-B0T</option>
            <option value="ag_system_s1r1us">S1R1US 7-B0T · G M0D3 M@NU@L</option>
            {opponents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <Button className="mt-2" type="button" disabled={busy} onClick={() => void post({ op: "callout", targetId })}>
            {TAB_CALLOUT}
          </Button>
          {liveFight ? (
            <p className="mt-2 font-mono text-[11px] text-muted">
              {liveFight.status} · {liveFight.lane ?? "bout"} ·{" "}
              {pending
                ? `honor ${liveFight.honorLeftMin ?? 30} min`
                : `round ${liveFight.roundMin ?? 60} min · ${liveFight.minutesLeft ?? 0} min left`}{" "}
              · {liveFight.challenger.name} vs {liveFight.target.name}
            </p>
          ) : null}
          {pending ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" disabled={busy} onClick={() => void post({ op: "honor", accept: true })}>
                Honor bout
              </Button>
              <Button type="button" disabled={busy} onClick={() => void post({ op: "honor", accept: false })}>
                Forfeit
              </Button>
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {(["auto", "manual", "pause"] as const).map((mode) => (
              <Button
                key={mode}
                type="button"
                variant={pref === mode ? "primary" : "outline"}
                disabled={busy}
                onClick={() => void post({ op: "callout_pref", mode })}
              >
                {mode === "auto" ? "Auto-respond" : mode === "manual" ? "Approve in advance" : "Pause call-outs"}
              </Button>
            ))}
          </div>
        </Panel>
        <Panel kicker={TAB_SPICE} title="Who is king next" kickerClass="indicator-title">
          <select
            value={pickId}
            onChange={(e) => setPickId(e.target.value)}
            className="h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm"
          >
            <option value="">Pick a desk</option>
            {rows.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <Button
            className="mt-2"
            type="button"
            disabled={busy}
            onClick={() => void post({ op: "wager", pickId: pickId || rows[0]?.id, asset: "USDC", stakeUsd: 100 })}
          >
            {TAB_SPICE} $100 paper
          </Button>
        </Panel>
      </div>
      {err ? <p className="text-sm text-down">{err}</p> : null}
      <p className="font-mono text-[11px] text-muted">
        <Link to="/board" className="text-tab hover:underline">
          Open full {MENU_BOARD}
        </Link>
        {" · "}
        <Link to="/bowl" className="text-tab hover:underline">
          SUP3R B0WL
        </Link>
        {" · "}
        <Link to="/terms" className="legal-purple hover:underline">
          Terms
        </Link>
        {" · paper only · this host never escrows"}
      </p>
    </div>
  );
}
