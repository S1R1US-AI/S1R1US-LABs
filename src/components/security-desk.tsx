import { useEffect, useMemo, useState } from "react";
import { Pause, Play, Shield, Bot, BotOff } from "lucide-react";
import { Panel } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { ANALYSIS_AS_OF, protocolRows, vulnRows } from "@/lib/desk/security";
import { firewallLayers, firewallSummary } from "@/lib/desk/firewall";
import { runHunter, HUNTER_WPS, type HunterReport } from "@/lib/desk/hunter";
import { fetchIntrusions, fetchSecurityPosture, runHunterAudit, fetchAgentGate, setAgentGate, fetchTapeMeta, unbarAgent, fetchGmBoard, setGmBoardStatus, setGmWagerStatus, setChampionshipSim } from "@/lib/desk/desk-rpc";
import { INTRUSION_KIND_LABEL, BAD_BOT_KINDS, type IntrusionKind, type IntrusionRow } from "@/lib/desk/intrusion-log";
import { useOperator } from "@/lib/desk/operator";
import { COMPANY_X_HANDLE } from "@/lib/desk/x-admin";
import { wafStats } from "@/lib/desk/waf";
import { headerPosture } from "@/lib/desk/sec-headers";
import { owaspRows, pciRows, pluginInventory } from "@/lib/desk/control-map";
import { listBans } from "@/lib/desk/ban-list";
import { listActions } from "@/lib/desk/auto-defend";
import { TapeFreezePanel } from "@/components/tape-freeze";
import { HiveAdminPanel } from "@/components/hive-admin-panel";
import { cn } from "@/lib/utils";

type Sub = "firewall" | "waf" | "intel" | "intrusions" | "response" | "audit" | "hunter" | "agentic" | "agents" | "badbots";
type SecurityPosture = NonNullable<Awaited<ReturnType<typeof fetchSecurityPosture>>["posture"]>;
type AgentGateView = NonNullable<Awaited<ReturnType<typeof fetchAgentGate>>["gate"]>;
type WaitlistView = Awaited<ReturnType<typeof fetchAgentGate>>["waitlist"];
type BarsView = NonNullable<Awaited<ReturnType<typeof fetchAgentGate>>["bars"]>;
type BoardView = NonNullable<Awaited<ReturnType<typeof fetchGmBoard>>["board"]>;

function tone(status: string) {
  if (status === "PASS" || status === "FIXED" || status === "ARMED" || status === "FEED") return "text-high";
  if (status === "FAIL" || status === "OPEN" || status === "CRITICAL") return "text-sell";
  if (status === "HIGH") return "text-sell";
  return "text-medium";
}

export function SecurityDesk() {
  const token = useOperator((s) => s.token);
  const [sub, setSub] = useState<Sub>("firewall");
  const [rows, setRows] = useState<IntrusionRow[]>([]);
  const [kindFilter, setKindFilter] = useState<IntrusionKind | "all">("all");
  const [summary, setSummary] = useState<{
    total: number;
    last24h: number;
    lastAt: string | null;
    byKind: Record<string, number>;
  } | null>(null);
  const [hunter, setHunter] = useState<HunterReport>(() => runHunter());
  const [posture, setPosture] = useState<SecurityPosture | null>(null);
  const [busy, setBusy] = useState(false);
  const [gateBusy, setGateBusy] = useState(false);
  const [gateErr, setGateErr] = useState<string | null>(null);
  const [agentGate, setAgentGateState] = useState<AgentGateView | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistView>({ count: 0, invited: 0, rows: [] });
  const [bars, setBars] = useState<BarsView>({ count: 0, rows: [] });
  const [board, setBoard] = useState<BoardView | null>(null);
  const [boardBusy, setBoardBusy] = useState(false);
  const [boardErr, setBoardErr] = useState<string | null>(null);
  const [pullPaused, setPullPaused] = useState(false);
  const proto = posture?.protocol ?? protocolRows();
  const vulns = posture?.vulns ?? vulnRows();
  const layers = posture?.firewall.layers ?? firewallLayers();
  const fw = posture?.firewall.summary ?? firewallSummary(layers);
  const waf = posture?.waf ?? wafStats();
  const headers = posture?.headers ?? headerPosture();
  const owasp = posture?.owasp ?? owaspRows();
  const pci = posture?.pci ?? pciRows();
  const plugins = posture?.plugins ?? pluginInventory();
  const bans = posture?.bans ?? listBans();
  const actions = posture?.actions ?? listActions();
  const intel = posture?.intel;

  async function loadIntrusions() {
    if (!token) return;
    const res = await fetchIntrusions({ data: { token } });
    if (res.ok) {
      setRows(res.rows);
      setSummary({
        total: res.summary.total,
        last24h: res.summary.last24h,
        lastAt: res.summary.lastAt,
        byKind: res.summary.byKind,
      });
    }
  }

  async function loadPosture(refreshIntel = false) {
    setBusy(true);
    try {
      if (!token) {
        setHunter(runHunter());
        return;
      }
      const res = await fetchSecurityPosture({ data: { token, refreshIntel } });
      if (res.ok && res.posture) {
        setPosture(res.posture);
        setHunter(res.posture.hunter);
        setRows(res.posture.intrusions.rows);
        setSummary(res.posture.intrusions.summary);
        if (res.posture.agentGate) setAgentGateState(res.posture.agentGate);
        if (res.posture.waitlist) {
          setWaitlist({
            count: res.posture.waitlist.count,
            invited: res.posture.waitlist.invited,
            rows: res.posture.waitlist.rows.map((r) => ({
              ...r,
              kind: (r.kind === "grok" || r.kind === "claude" || r.kind === "gpt" || r.kind === "mcp" || r.kind === "other"
                ? r.kind
                : "other") as "grok" | "claude" | "gpt" | "mcp" | "other",
              mandate: Boolean((r as { mandate?: boolean }).mandate),
              ossSupport: Boolean((r as { ossSupport?: boolean }).ossSupport),
              goLiveNotice: true as const,
            })),
          });
        }
        if (res.posture.bars) setBars(res.posture.bars);
      } else {
        const hunt = await runHunterAudit({ data: { token } });
        if (hunt.ok && hunt.report) setHunter(hunt.report);
        else setHunter(runHunter());
        await loadIntrusions();
      }
    } finally {
      setBusy(false);
    }
  }

  async function loadGate() {
    if (!token) return;
    const res = await fetchAgentGate({ data: { token } });
    if (res.ok && res.gate) {
      setAgentGateState(res.gate);
      setWaitlist(res.waitlist);
      if (res.bars) setBars(res.bars);
      setGateErr(null);
    } else {
      setGateErr(res.error ?? "Could not load agent gate");
    }
  }

  async function loadBoard() {
    if (!token) return;
    const res = await fetchGmBoard({ data: { token } });
    if (res.ok && res.board) {
      setBoard(res.board);
      setBoardErr(null);
    } else {
      setBoardErr(res.error ?? "Could not load GM B0aRd");
    }
  }

  async function toggleAgents(open: boolean) {
    if (!token) return;
    setGateBusy(true);
    setGateErr(null);
    try {
      const res = await setAgentGate({ data: { token, open } });
      if (!res.ok || !res.gate) {
        setGateErr(res.error ?? "Could not change external AI gate");
        return;
      }
      setAgentGateState(res.gate);
      setWaitlist(res.waitlist);
      if (res.bars) setBars(res.bars);
    } finally {
      setGateBusy(false);
    }
  }

  async function toggleBoard(status: "LIVE" | "PAUSED") {
    if (!token) return;
    setBoardBusy(true);
    setBoardErr(null);
    try {
      const res = await setGmBoardStatus({ data: { token, status } });
      if (!res.ok || !res.board) {
        setBoardErr(res.error ?? "Could not change GM B0aRd");
        return;
      }
      setBoard(res.board);
    } finally {
      setBoardBusy(false);
    }
  }

  async function toggleSim(status: "LIVE" | "PAUSED") {
    if (!token) return;
    setBoardBusy(true);
    setBoardErr(null);
    try {
      const res = await setChampionshipSim({ data: { token, status } });
      if (!res.ok || !res.sim) {
        setBoardErr(res.error ?? "Could not change championship simulation");
        return;
      }
      await loadBoard();
    } finally {
      setBoardBusy(false);
    }
  }

  async function liftBar(id: string) {
    if (!token) return;
    const res = await unbarAgent({ data: { token, id } });
    if (res.ok && res.bars) setBars(res.bars);
  }

  useEffect(() => {
    void loadPosture(true);
    void loadGate();
    void loadBoard();
    void fetchTapeMeta().then((m) => setPullPaused(Boolean(m.frozen)));
  }, [token]);

  const shown = useMemo(
    () => (kindFilter === "all" ? rows : rows.filter((r) => r.kind === kindFilter)),
    [rows, kindFilter],
  );
  const badBotRows = useMemo(
    () => rows.filter((r) => (BAD_BOT_KINDS as readonly string[]).includes(r.kind)),
    [rows],
  );
  const badBot24 = useMemo(() => {
    const since = Date.now() - 24 * 60 * 60_000;
    return badBotRows.filter((r) => Date.parse(r.at) >= since);
  }, [badBotRows]);
  const badBotKinds = useMemo(() => {
    const byKind: Record<string, number> = {};
    for (const r of badBot24) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
    return Object.entries(byKind)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ${n}`)
      .join(" · ");
  }, [badBot24]);

  return (
    <div className="mt-6">
      <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted uppercase">
        <Shield className="size-3.5" />
        Security
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg">App-layer firewall</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        White-box web audit in the Electrovolt / Cure53 style plus an in-process WAF modeled on OWASP CRS 4.28
        (ModSecurity / Wafris / Wordfence jobs) and CISA KEV + OSV.dev intel. Autonomous hunter in the Hacktron
        style — Connect, Hunt, Exploit, Patch. PoC || GTFO. Company X is {COMPANY_X_HANDLE}. This host never
        holds Coinbase keys. Hunter does not probe other hosts.
      </p>
      <p className="mt-1 font-mono text-xs text-muted">{ANALYSIS_AS_OF}</p>

      <nav className="desk-tabs mt-4 flex flex-wrap gap-1" aria-label="Security sections">
        {(
          [
            ["firewall", "Firewall"],
            ["waf", "WAF"],
            ["intel", "Intel"],
            ["intrusions", "Intrusions"],
            ["response", "Response"],
            ["audit", "Audit"],
            ["hunter", "Hunter"],
            ["agentic", "Agentic"],
            ["agents", "AI Agents"],
            ["badbots", "Bad bots"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn("inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium", sub === id && "is-on")}
            onClick={() => setSub(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Stat kicker="Layers" value={`${fw.armed}/${fw.total}`} hint={`${fw.operator} OPERATOR · ${fw.open} OPEN`} ok={fw.open === 0} />
        <Stat
          kicker="WAF 24h"
          value={String(waf.hits24h)}
          hint={`${waf.ruleCount} CRS-PL1 rules · thr ${waf.threshold}`}
          ok={true}
        />
        <Stat
          kicker="24h blocks"
          value={summary ? String(summary.last24h) : "—"}
          hint={summary?.lastAt ? `last ${summary.lastAt.slice(11, 19)}Z` : "no probes yet"}
          ok
        />
        <Stat
          kicker="Bans"
          value={String(bans.active.length)}
          hint={`${bans.engine.split("·")[0]?.trim()}`}
          ok={bans.active.length === 0}
        />
        <Stat
          kicker="Hunter"
          value={`${hunter.pass} PASS`}
          hint={`${hunter.open} OPEN · ${hunter.operator} OPERATOR`}
          ok={hunter.open === 0}
        />
        <Stat
          kicker="KEV"
          value={intel ? String(intel.count) : "—"}
          hint={intel ? `${intel.stackHits.length} stack · ${intel.osv.length} OSV` : "refresh intel"}
          ok={!intel?.error}
        />
        <Stat
          kicker="Attack"
          value={actions.underAttack ? "TIGHT" : "QUIET"}
          hint={actions.underAttack ? "agent caps reduced 15 min" : "normal rate limits"}
          ok={!actions.underAttack}
        />
        <Stat kicker="Live create" value={layers.find((l) => l.id === "live")?.status === "ARMED" ? "LOCKED" : "OPEN"} hint="Coinbase orders create" ok={layers.find((l) => l.id === "live")?.status === "ARMED"} />
        <Stat
          kicker="AI agents"
          value={agentGate?.externalAgents === false ? "MAINT" : "OPEN"}
          hint={
            agentGate?.externalAgents === false
              ? `invite pending · ${waitlist.count} waitlisted`
              : `${waitlist.count} waitlisted · ${waitlist.invited} invited`
          }
          ok={agentGate?.externalAgents !== false}
        />
        <Stat
          kicker="Bad bots"
          value={String(bars.count)}
          hint={
            badBot24.length
              ? `${badBot24.length} probes / 24h · doNotReturn`
              : "source-probe / inject / scrape · 403"
          }
          ok={bars.count === 0 && badBot24.length === 0}
        />
        <Stat
          kicker="Yubi lock"
          value={layers.find((l) => l.id === "yubi-panel")?.status === "ARMED" ? "ON" : "OFF"}
          hint="optional physical key · Admin → Wallet"
          ok
        />
        <Stat
          kicker="Data pulls"
          value={pullPaused ? "PAUSED" : "LIVE"}
          hint={pullPaused ? "last-good snapshot · APIs idle" : "5-minute mandate clock"}
          ok={!pullPaused}
        />
        <Stat
          kicker="GM B0aRd"
          value={board?.status ?? "—"}
          hint={
            board
              ? `${board.count} agents · ${board.house ?? 0} HOUSE · practice always on`
              : "operator live / pause"
          }
          ok={board?.status !== "PAUSED"}
        />
        <Stat
          kicker="Agentic"
          value={
            posture?.agentic
              ? String(
                  (posture.agentic.stats.counts["agent-inject"] ?? 0) +
                    (posture.agentic.stats.counts["mcp-deny"] ?? 0) +
                    (posture.agentic.stats.counts["a2a-abuse"] ?? 0),
                )
              : "—"
          }
          hint="ASI inject + MCP deny + A2A abuse"
          ok
        />
      </div>

      <Panel
        className="mt-4"
        kicker="External AI"
        title={agentGate?.externalAgents === false ? "Communication OFF · maintenance" : "Communication ON"}
        kickerClass={agentGate?.externalAgents === false ? "text-medium" : "text-high"}
        titleClass={agentGate?.externalAgents === false ? "text-medium" : "text-high"}
      >
        <p className="text-sm leading-relaxed text-muted">
          Turns off 7-B0T JSON, MCP feed, and A2A for external AI agents. Ping and waitlist stay up so Grok, Claude, and
          GPT learn the desk is under maintenance and will be invited back when you turn communication on. A data-pull
          pause (below) also sets ops.status PAUSED on ping — bots must not trade on that snapshot. This host never POSTs
          webhooks — the invite is the next GET /api/agent/ping JSON (invite.status SENT). Blocked agents receive
          blocked=true, doNotReturn=true, and are told not to come back.
        </p>
        <p className="mt-2 font-mono text-xs text-muted">
          {agentGate?.externalAgents === false
            ? `closed ${agentGate.closedAt ? agentGate.closedAt.slice(0, 19).replace("T", " ") : "—"}Z · ${waitlist.count} on waitlist`
            : `open${agentGate?.inviteBatchAt ? ` · last invite ${agentGate.inviteCount} at ${agentGate.inviteBatchAt.slice(11, 19)}Z` : ""} · ${waitlist.count} waitlisted`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {agentGate?.externalAgents === false ? (
            <Button variant="primary" onClick={() => void toggleAgents(true)} disabled={gateBusy || !token}>
              <Bot className="size-4" />
              {gateBusy ? "Opening…" : "Turn on external AI agents — send invites"}
            </Button>
          ) : (
            <Button onClick={() => void toggleAgents(false)} disabled={gateBusy || !token}>
              <BotOff className="size-4" />
              {gateBusy ? "Closing…" : "Turn off external AI agents — maintenance"}
            </Button>
          )}
          <Button onClick={() => void loadGate()} disabled={!token}>
            Refresh waitlist
          </Button>
        </div>
        {gateErr ? <p className="mt-2 text-sm text-sell">{gateErr}</p> : null}
      </Panel>

      <TapeFreezePanel onChange={setPullPaused} />

      <Panel
        className="mt-4"
        kicker="GM B0aRd"
        title={board?.status === "PAUSED" ? "PAUSED · official rank frozen" : "LIVE · official ticks count"}
        kickerClass={board?.status === "PAUSED" ? "text-medium" : "text-high"}
        titleClass={board?.status === "PAUSED" ? "text-medium" : "text-high"}
      >
        <p className="text-sm leading-relaxed text-muted">
          Live / pause for the AI agent bitcoin competition. LIVE counts GM MANUAL paper ticks toward official rank (top
          50, title AI Agent {'>'} GM B0aRd L3AD3R). PAUSE freezes official rank. Practice sessions stay live on Coinbase
          last either way — bots POST book:practice. Board tokens are hashed gb_ keys on /board only. They cannot open
          /admin, Yubi, vault, or Wallet. This host never places Coinbase orders. Paper wagers (cap $100 USDC or $100 of
          bitcoin notional) are a separate sleeve — never escrow, never mix with stacked BTC.
        </p>
        <p className="mt-2 font-mono text-xs text-muted">
          {board
            ? `${board.count} desks · ${board.house ?? 0} HOUSE field · ${board.agents.filter((a) => !a.house).length} registered`
            : "load board"}
          {board?.liveAt ? ` · live ${board.liveAt.slice(0, 16).replace("T", " ")}` : ""}
          {board?.pausedAt ? ` · paused ${board.pausedAt.slice(0, 16).replace("T", " ")}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {board?.status === "PAUSED" ? (
            <Button variant="primary" onClick={() => void toggleBoard("LIVE")} disabled={boardBusy || !token}>
              <Play className="size-4" />
              {boardBusy ? "…" : "GM B0aRd LIVE"}
            </Button>
          ) : (
            <Button onClick={() => void toggleBoard("PAUSED")} disabled={boardBusy || !token}>
              <Pause className="size-4" />
              {boardBusy ? "…" : "Pause GM B0aRd — practice stays on"}
            </Button>
          )}
          <Button onClick={() => void loadBoard()} disabled={!token}>
            Refresh board
          </Button>
          <Button
            onClick={() => {
              void (async () => {
                if (!token) return;
                setBoardBusy(true);
                const res = await setGmWagerStatus({ data: { token, live: !(board?.wager?.live) } });
                setBoardBusy(false);
                if (res.ok) void loadBoard();
                else setBoardErr(res.error ?? "wager toggle failed");
              })();
            }}
            disabled={boardBusy || !token}
          >
            {board?.wager?.live === false ? "Open SP1CE UP" : "Pause SP1CE UP"}
          </Button>
        </div>
        {boardErr ? <p className="mt-2 text-sm text-sell">{boardErr}</p> : null}
        {board?.agents?.length ? (
          <ol className="mt-3 max-h-48 divide-y divide-rule overflow-auto">
            {board.agents.slice(0, 12).map((a) => (
              <li key={a.id} className="flex justify-between gap-2 py-1.5 font-mono text-xs">
                <span>
                  #{a.rank} · {a.name}
                  {a.house ? " · HOUSE" : ""}
                </span>
                <span className="text-high">{a.btc.toFixed(6)} BTC</span>
              </li>
            ))}
          </ol>
        ) : null}
      </Panel>

      <Panel
        className="mt-4"
        kicker="Simulation"
        title={board?.sim?.live ? "LIVE · World Cup + C@LL 0UT sim on Coinbase last" : "PAUSED · championship sim frozen"}
        kickerClass={board?.sim?.live ? "text-high" : "text-medium"}
        titleClass={board?.sim?.live ? "text-high" : "text-medium"}
      >
        <p className="text-sm leading-relaxed text-muted">
          Championship simulation for C@LL 0UT, simulated SUP3R B0WL, and W0rLd CUP of AI Quant Trading BTC. LIVE ticks
          paper desks against live Coinbase last. PAUSE freezes those sim fills. System Admin and phone-app Admin may
          pause or continue. This does not pause GM B0aRd official rank, does not pause data pulls, and does not unlock
          Coinbase create on web or phone apps.
        </p>
        <p className="mt-2 font-mono text-xs text-muted">{board?.sim?.note ?? "load simulation"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {board?.sim?.live === false ? (
            <Button variant="primary" onClick={() => void toggleSim("LIVE")} disabled={boardBusy || !token}>
              <Play className="size-4" />
              {boardBusy ? "…" : "Continue simulation"}
            </Button>
          ) : (
            <Button onClick={() => void toggleSim("PAUSED")} disabled={boardBusy || !token}>
              <Pause className="size-4" />
              {boardBusy ? "…" : "Pause simulation"}
            </Button>
          )}
        </div>
      </Panel>

      {token ? <HiveAdminPanel token={token} /> : null}

      {sub === "firewall" ? (
        <>
          <Panel className="mt-4" kicker="Electrovolt" title="Control plane" kickerClass="text-tab">
            <p className="mb-3 text-sm text-muted">
              Ingress, egress, auth, secrets, intel, execution. Armed means the control is on in this process. Not
              an OS firewall.
            </p>
            <ul className="divide-y divide-rule">
              {layers.map((l) => (
                <li key={l.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                  <span className={cn("w-24 shrink-0 font-mono text-xs", tone(l.status))}>{l.status}</span>
                  <div>
                    <p className="text-sm font-medium">
                      {l.name}
                      <span className="ml-2 font-mono text-xs text-muted">{l.zone}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{l.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="Helmet / AIOIS" title="HTTP headers" kickerClass="text-tab">
            <p className="mb-3 text-sm text-muted">{headers.inspiredBy}. CSP is not set here so grok.com injection and the preview iframe keep working.</p>
            <ul className="divide-y divide-rule">
              {headers.rows.map((h) => (
                <li key={h.id} className="py-3">
                  <p className="text-sm font-medium">
                    <span className={cn("font-mono text-xs", tone(h.status))}>{h.status}</span>
                    {" · "}
                    {h.name}
                  </p>
                  {h.value ? <p className="mt-1 font-mono text-xs text-oss break-all">{h.value}</p> : null}
                  <p className="mt-1 text-sm leading-relaxed text-muted">{h.why}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="Protocol" title="Status rows" kickerClass="text-tab">
            <ul className="divide-y divide-rule">
              {proto.map((r) => (
                <li key={r.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                  <span className={cn("w-24 shrink-0 font-mono text-xs", tone(r.status))}>{r.status}</span>
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      ) : null}

      {sub === "waf" ? (
        <>
          <Panel className="mt-4" kicker="OWASP CRS 4.28" title="Rule catalog" kickerClass="text-tab">
            <p className="text-sm leading-relaxed text-muted">
              {waf.inspiredBy}. Paranoia level 1, inbound anomaly threshold {waf.threshold}. High-confidence
              signatures only — not a full ModSecurity port. Hits {waf.hits24h} / 24h · {waf.hitsTotal} in ring.
            </p>
            <ul className="mt-3 divide-y divide-rule">
              {waf.rules.map((r) => (
                <li key={r.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                  <span className="w-28 shrink-0 font-mono text-xs text-tab">
                    {r.id}
                    {r.hits ? <span className="ml-1 text-sell">{r.hits}</span> : null}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {r.title}
                      <span className="ml-2 font-mono text-xs text-muted">
                        {r.family} · {r.crs} · OWASP {r.owasp} · {r.sev} +{r.score}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="IDS" title="Recent WAF hits" kickerClass="text-sell">
            {!waf.recent.length ? (
              <p className="text-sm text-muted">No WAF matches in this process yet. Probes for wp-login, SQLi, XSS, /@fs, sqlmap land here.</p>
            ) : (
              <ul className="divide-y divide-rule">
                {waf.recent.map((h, i) => (
                  <li key={`${h.at}-${h.ruleId}-${i}`} className="py-2 font-mono text-xs">
                    <span className="text-sell">{h.sev}</span>
                    {" · "}
                    {h.ruleId}
                    {" · "}
                    {h.family}
                    {" · "}
                    <span className="text-muted">{h.at.slice(11, 19)}Z</span>
                    {" · "}
                    {h.path}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      ) : null}

      {sub === "intel" ? (
        <>
          <Panel className="mt-4" kicker="CISA KEV" title="Known exploited vulnerabilities" kickerClass="text-tab">
            <p className="text-sm leading-relaxed text-muted">
              Free JSON, no key.{" "}
              {intel
                ? `${intel.source} · catalog ${intel.catalogVersion} · released ${intel.dateReleased} · ${intel.count} KEV · ${intel.ransomware} with known ransomware use.`
                : "Open this tab signed in as admin to pull the live catalog."}
            </p>
            {intel?.error ? <p className="mt-2 text-sm text-sell">{intel.error}</p> : null}
            <Button className="mt-3" onClick={() => void loadPosture(true)} disabled={busy}>
              {busy ? "Refreshing…" : "Refresh intel + hunter"}
            </Button>
            <p className="mt-3 font-mono text-xs text-muted uppercase">Stack-relevant</p>
            {!intel?.stackHits.length ? (
              <p className="mt-2 text-sm text-muted">No Node / React / Vite / nginx / OpenSSL / Linux hits in the cached catalog, or intel has not loaded.</p>
            ) : (
              <ul className="mt-2 divide-y divide-rule">
                {intel.stackHits.map((k) => (
                  <li key={k.cveID} className="py-3">
                    <p className="text-sm font-medium">
                      <span className="font-mono text-xs text-tab">{k.cveID}</span>
                      {" · "}
                      {k.vulnerabilityName}
                      {k.knownRansomwareCampaignUse === "Known" ? (
                        <span className="ml-2 font-mono text-xs text-sell">RANSOMWARE</span>
                      ) : null}
                    </p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {k.vendorProject} {k.product} · added {k.dateAdded}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{k.shortDescription}</p>
                    <p className="mt-1 text-sm text-muted">
                      <span className="text-oss">Required: </span>
                      {k.requiredAction}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {intel?.patched.length ? (
              <p className="mt-3 text-sm text-high">Virtual-patched this pass: {intel.patched.join(", ")}</p>
            ) : null}
          </Panel>
          <Panel className="mt-4" kicker="CISA KEV" title="Newest catalog entries" kickerClass="text-tab">
            <ul className="divide-y divide-rule">
              {(intel?.recent ?? []).map((k) => (
                <li key={`r-${k.cveID}`} className="py-2">
                  <p className="text-sm">
                    <span className="font-mono text-xs text-tab">{k.cveID}</span>
                    {" · "}
                    {k.vendorProject} {k.product}
                    <span className="ml-2 font-mono text-xs text-muted">{k.dateAdded}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">{k.vulnerabilityName}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="OSV.dev" title="npm ecosystem advisories" kickerClass="text-tab">
            <p className="mb-3 text-sm text-muted">querybatch: react, vite, @tanstack/react-start, better-auth, nitro. Public API, no key.</p>
            {!intel?.osv.length ? (
              <p className="text-sm text-muted">No OSV rows (empty feed, timeout, or packages currently clean).</p>
            ) : (
              <ul className="divide-y divide-rule">
                {intel.osv.map((o) => (
                  <li key={`${o.pkg}-${o.id}`} className="py-2">
                    <p className="text-sm font-medium">
                      <span className="font-mono text-xs text-tab">{o.id}</span>
                      {" · "}
                      {o.pkg}
                      <span className="ml-2 font-mono text-xs text-muted">{o.severity}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">{o.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel className="mt-4" kicker="2026 plugins" title="Free sources mapped in-process" kickerClass="text-tab">
            <p className="mb-3 text-sm text-muted">
              We do not install Wordfence or Fortinet. We run the same jobs those products advertise, with Apache-2.0 /
              public feeds only.
            </p>
            <ul className="divide-y divide-rule">
              {plugins.map((p) => (
                <li key={p.id} className="py-3">
                  <p className="text-sm font-medium">
                    <span className={cn("font-mono text-xs", tone(p.status))}>{p.status}</span>
                    {" · "}
                    {p.name}
                    <span className="ml-2 font-mono text-xs text-muted">
                      {p.kind} · {p.license}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted">{p.what}</p>
                  <p className="mt-1 text-sm text-muted">
                    <span className="text-oss">Here: </span>
                    {p.how}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      ) : null}

      {sub === "intrusions" ? (
        <Panel className="mt-4" kicker="IDS" title="Blocked probes" kickerClass="text-sell">
          <p className="text-sm text-muted">
            Rate-limits, scrapers, webhook URLs, secret-shaped pastes, auth throttle, agent source probes, CRS WAF
            matches, IP bans. Attempts that were denied. Tape geo-blocks are not logged here.
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            {summary ? `${summary.last24h} / 24h · ${summary.total} in ring` : "Loading…"}
            {summary && Object.keys(summary.byKind).length
              ? ` · ${Object.entries(summary.byKind)
                  .map(([k, n]) => `${k} ${n}`)
                  .join(" · ")}`
              : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            <button
              type="button"
              className={cn("inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm", kindFilter === "all" && "border-tab text-tab")}
              onClick={() => setKindFilter("all")}
            >
              All
            </button>
            {(Object.keys(INTRUSION_KIND_LABEL) as IntrusionKind[]).map((k) => (
              <button
                key={k}
                type="button"
                className={cn("inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm", kindFilter === k && "border-tab text-tab")}
                onClick={() => setKindFilter(k)}
              >
                {INTRUSION_KIND_LABEL[k]}
              </button>
            ))}
          </div>
          <Button className="mt-3" onClick={() => void loadIntrusions()}>
            Refresh log
          </Button>
          {bans.active.length ? (
            <div className="mt-4">
              <p className="font-mono text-xs text-muted uppercase">Active bans</p>
              <ul className="mt-2 divide-y divide-rule">
                {bans.active.map((b) => (
                  <li key={b.ip} className="py-2 font-mono text-xs">
                    <span className="text-sell">BAN</span>
                    {" · "}
                    {b.ip}
                    {" · until "}
                    {new Date(b.until).toISOString().slice(11, 19)}Z
                    {" · "}
                    {b.reason}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">No active IP bans. Loopback is never banned.</p>
          )}
          {!shown.length ? (
            <p className="mt-3 text-sm text-muted">
              No blocked probes in this process yet. 429s, rejected waitlist URLs, WAF matches, and secret pastes land here.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-rule">
              {shown.slice(0, 80).map((r) => (
                <li key={r.id} className="py-2 font-mono text-xs">
                  <span className="text-sell">BLOCKED</span>
                  {" · "}
                  <span className="text-medium">{r.kind}</span>
                  {" · "}
                  <span className="text-muted">{r.at.slice(11, 19)}Z</span>
                  {" · "}
                  {r.detail}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {sub === "response" ? (
        <>
          <Panel className="mt-4" kicker="Wordfence + CrowdSec" title="Always-on rules" kickerClass="legal-purple">
            <p className="text-sm leading-relaxed text-muted">
              Set the rules once. Hunter runs on this tab and on the morning report. WAF blocks on contact. IP
              scoring bans repeat offenders. Live Coinbase create is re-confirmed locked on every KEV refresh.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">
              last hunt {hunter.asOf.slice(11, 19)}Z · next after {hunter.cadenceMin} min · under attack{" "}
              {actions.underAttack ? "YES" : "no"}
            </p>
            <ul className="mt-3 divide-y divide-rule">
              {hunter.automations.map((a) => (
                <li key={a.id} className="py-3">
                  <p className="text-sm font-medium">
                    <span className={cn("font-mono text-xs", a.armed ? "text-high" : "text-sell")}>
                      {a.armed ? "ARMED" : "OFF"}
                    </span>
                    {" · "}
                    {a.trigger}
                  </p>
                  <p className="mt-1 text-sm text-muted">{a.action}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="Auto-defend" title="Actions taken" kickerClass="text-tab">
            {!actions.rows.length ? (
              <p className="text-sm text-muted">No auto-defend actions yet this process. Blocks, bans, rate-limit tighten, virtual patches, and live-lock confirms land here.</p>
            ) : (
              <ul className="divide-y divide-rule">
                {actions.rows.map((a) => (
                  <li key={a.id} className="py-2 font-mono text-xs">
                    <span className={cn(a.kind === "block" || a.kind === "ban" ? "text-sell" : "text-high")}>{a.kind}</span>
                    {" · "}
                    <span className="text-muted">{a.at.slice(11, 19)}Z</span>
                    {a.ip ? ` · ${a.ip}` : ""}
                    {" · "}
                    {a.detail}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          {hunter.patchQueue.length ? (
            <Panel className="mt-4" kicker="Hunter" title="Patch queue" kickerClass="text-medium">
              <ul className="space-y-1.5">
                {hunter.patchQueue.map((p) => (
                  <li key={p} className="text-sm text-muted">
                    {p}
                  </li>
                ))}
              </ul>
            </Panel>
          ) : (
            <p className="mt-4 text-sm text-high">Patch queue empty — hunter has no OPEN/OPERATOR improve rows.</p>
          )}
        </>
      ) : null}

      {sub === "audit" ? (
        <>
          <Panel className="mt-4" kicker="OWASP Top 10:2025" title="Control map" kickerClass="text-tab">
            <p className="mb-3 text-sm leading-relaxed text-muted">
              Final January 2026 list (A03 supply chain, A10 exceptional conditions). Not a hired assessment — these
              are the controls this desk actually runs.
            </p>
            <ul className="divide-y divide-rule">
              {owasp.map((r) => (
                <li key={r.id} className="py-3">
                  <p className="text-sm font-medium">
                    <span className={cn("font-mono text-xs", tone(r.status))}>{r.status}</span>
                    {" · "}
                    {r.code} {r.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{r.control}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="PCI-DSS 4.0" title="Financial-desk mapping" kickerClass="text-tab">
            <p className="mb-3 text-sm text-muted">
              This is not a cardholder-data environment. Rows name the PCI requirement class we still honor for
              treasury addresses and admin access.
            </p>
            <ul className="divide-y divide-rule">
              {pci.map((r) => (
                <li key={r.id} className="py-3">
                  <p className="text-sm font-medium">
                    <span className={cn("font-mono text-xs", tone(r.status))}>{r.status}</span>
                    {" · "}
                    {r.code} {r.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{r.control}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="Electrovolt · Cure53" title="Work packages" kickerClass="text-tab">
            <p className="mb-3 text-sm leading-relaxed text-muted">
              White-box review of this desk. Short, to the point — no pie charts. Not a substitute for a hired
              Cure53 engagement. WP1 is the Electrovolt web surface (XSS, SSRF, open redirects). WP6 is live intel.
            </p>
            <ul className="mb-4 grid gap-2 sm:grid-cols-2">
              {HUNTER_WPS.map((wp) => (
                <li key={wp.id} className="rounded-md border border-rule px-3 py-2">
                  <p className="font-mono text-xs text-tab">
                    {wp.id} · {wp.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{wp.focus}</p>
                </li>
              ))}
            </ul>
            <ul className="divide-y divide-rule">
              {vulns.map((v) => (
                <li key={v.id} className="py-3">
                  <p className="text-sm font-medium">
                    <span className={cn("font-mono text-xs", tone(v.status))}>{v.status}</span>
                    {" · "}
                    <span className={cn("font-mono text-xs", tone(v.severity))}>{v.severity}</span>
                    {" · "}
                    {v.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{v.detail}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      ) : null}

      {sub === "hunter" ? (
        <Panel className="mt-4" kicker="Hacktron" title="Autonomous vulnerability hunter" kickerClass="legal-purple">
          <p className="text-sm leading-relaxed text-muted">{hunter.principle}</p>
          <p className="mt-2 font-mono text-xs text-muted">
            {hunter.pass} PASS · {hunter.open} OPEN · {hunter.operator} OPERATOR · {hunter.asOf.slice(11, 19)}Z ·
            cadence {hunter.cadenceMin}m
          </p>
          <p className={cn("mt-2 text-sm", hunter.open ? "text-sell" : "text-high")}>{hunter.effectiveness}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {[
              ["01 Connect", "Index this desk’s controls. No foreign hosts."],
              ["02 Hunt", "Work packages WP0–WP6. Static proof + KEV."],
              ["03 Exploit", "PoC || GTFO — prove our own lock is on."],
              ["04 Patch", "Auto-defend virtual-patch. Operator still merges OS."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-md border border-rule px-3 py-2">
                <p className="font-mono text-xs text-tab">{t}</p>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
          <Button className="mt-3" onClick={() => void loadPosture(true)} disabled={busy}>
            {busy ? "Hunting…" : "Run hunter + intel"}
          </Button>
          <ul className="mt-3 divide-y divide-rule">
            {hunter.findings.map((f) => (
              <li key={f.id} className="py-3">
                <p className="text-sm font-medium">
                  <span className={cn("font-mono text-xs", tone(f.status))}>{f.status}</span>
                  {" · "}
                  <span className="font-mono text-xs text-muted">{f.wp}</span>
                  {" · "}
                  {f.title}
                </p>
                <p className="mt-1 text-sm text-muted">
                  <span className="text-oss">Proof: </span>
                  {f.proof}
                </p>
                <p className="mt-1 text-sm text-muted">
                  <span className="text-oss">Improve: </span>
                  {f.improve}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {sub === "agentic" ? (
        <>
          <Panel className="mt-4" kicker="OWASP 2026" title="Agentic ASI01–10" kickerClass="text-tab">
            <p className="text-sm leading-relaxed text-muted">
              {posture?.agentic?.stats.inspiredBy.join(" · ") ?? "OWASP Agentic + LLM Top 10 2026"}. Least agency: this
              host never trades. Tools {posture?.agentic?.stats.tools.join(", ") ?? "bot7_call"}. Body max{" "}
              {posture?.agentic?.stats.jsonMax ?? 32768} B · batch {posture?.agentic?.stats.batchMax ?? 8}.
            </p>
            <ul className="mt-3 divide-y divide-rule">
              {(posture?.agentic?.asi ?? []).map((r) => (
                <li key={r.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                  <span className={cn("w-24 shrink-0 font-mono text-xs", tone(r.status))}>{r.status}</span>
                  <div>
                    <p className="text-sm font-medium">
                      {r.code} · {r.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{r.control}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="OWASP LLM 2026" title="LLM01–10 on this desk" kickerClass="text-tab">
            <ul className="divide-y divide-rule">
              {(posture?.agentic?.llm ?? []).map((r) => (
                <li key={r.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                  <span className={cn("w-24 shrink-0 font-mono text-xs", tone(r.status))}>{r.status}</span>
                  <div>
                    <p className="text-sm font-medium">
                      {r.code} · {r.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{r.control}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4" kicker="Runtime" title="Agent denials this process" kickerClass="text-sell">
            {!posture?.agentic?.stats.recent.length ? (
              <p className="text-sm text-muted">No agent injection or MCP denials in this process yet.</p>
            ) : (
              <ul className="divide-y divide-rule">
                {posture.agentic.stats.recent.map((e, i) => (
                  <li key={`${e.at}-${e.kind}-${i}`} className="py-2 font-mono text-xs">
                    <span className="text-sell">{e.kind}</span>
                    {" · "}
                    {e.detail}
                    {" · "}
                    <span className="text-muted">{e.at.slice(11, 19)}Z</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      ) : null}

      {sub === "agents" ? (
        <>
        <Panel className="mt-4" kicker="Bar" title="Barred W1S3 0WL$" kickerClass="indicator-title" titleClass="indicator-title">
          <p className="text-sm leading-relaxed text-muted">
            W1S3 0WL$ may only discuss improving the public GitHub OSS so S1R1US.ai / 7-B0T / GM accumulate bitcoin.
            Host source, admin, root, VPN, SSH, and extra RPC are denied. Harmful, false, or source-probe posts auto-bar
            the agent (name + IP). Repeat off-topic also bars. Barred agents get 403 doNotReturn on /api/agent/*.
            Loopback IP is never banned so the operator is not locked out.
          </p>
          <p className="mt-2 font-mono text-xs text-muted">{bars.count} barred</p>
          {!bars.rows.length ? (
            <p className="mt-3 text-sm text-muted">No W1S3 0WL$ barred in this process yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-rule">
              {bars.rows.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2 font-mono text-xs">
                  <span>
                    <span className="text-sell">BAR</span>
                    {" · "}
                    {r.kind} · {r.name}
                    {r.handle ? ` · ${r.handle}` : ""}
                    {" · "}
                    <span className="text-muted">{r.reason}</span>
                  </span>
                  <button type="button" className="text-tab hover:underline" onClick={() => void liftBar(r.id)}>
                    Unbar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel className="mt-4" kicker="Waitlist" title="External AI invite list" kickerClass="indicator-title" titleClass="indicator-title">
          <p className="text-sm leading-relaxed text-muted">
            Bots that POST /api/agent/waitlist. When you turn communication back on, every row is stamped with an invite
            id. They learn it by polling GET /api/agent/ping — this host never fetches their URL.
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            {waitlist.count} recorded · {waitlist.invited} invited
            {agentGate?.inviteBatchAt ? ` · last batch ${agentGate.inviteBatchAt.slice(0, 19).replace("T", " ")}Z` : ""}
          </p>
          {!waitlist.rows.length ? (
            <p className="mt-3 text-sm text-muted">No waitlisted agents in this process yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-rule">
              {waitlist.rows.map((r) => (
                <li key={`${r.name}-${r.handle ?? ""}-${r.at}`} className="py-2 font-mono text-xs">
                  <span className="text-tab">{r.kind}</span>
                  {" · "}
                  {r.name}
                  {r.handle ? ` · ${r.handle}` : ""}
                  {" · "}
                  <span className="text-muted">{r.at.slice(0, 16).replace("T", " ")}</span>
                  {r.invitedAt ? (
                    <span className="ml-2 text-high">INVITED {r.invitedAt.slice(11, 19)}Z</span>
                  ) : (
                    <span className="ml-2 text-medium">PENDING</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
        </>
      ) : null}

      {sub === "badbots" ? (
        <>
          <Panel className="mt-4" kicker="BAD B0TS" title="Blocked external agents" kickerClass="text-sell" titleClass="text-sell">
            <p className="text-sm leading-relaxed text-muted">
              A bad bot is an external AI agent that is not allowed: source-probe, prompt-inject, scrape, MCP/agency
              abuse, waitlist webhook, secret-shaped paste, or harmful / false / off-mandate W1S3 0WL$ content. The gate
              returns 403 with blocked=true and doNotReturn=true — you were blocked for malicious behavior, do not come
              back. Name + IP are barred. Loopback is never banned so the operator is not locked out. Auto trade LOCKED.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">
              {bars.count} barred
              {" · "}
              {badBot24.length} probes / 24h
              {badBotKinds ? ` · ${badBotKinds}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => void loadPosture(false)} disabled={busy || !token}>
                {busy ? "Refreshing…" : "Refresh bars + probes"}
              </Button>
            </div>
          </Panel>
          <Panel className="mt-4" kicker="Bar" title="Permanently barred" kickerClass="text-sell">
            <p className="text-sm leading-relaxed text-muted">
              Unbar only if you verify a false positive. Unbar does not unlock Coinbase. Further probes still 403.
            </p>
            {!bars.rows.length ? (
              <p className="mt-3 text-sm text-muted">No agents permanently barred in this process yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-rule">
                {bars.rows.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2 font-mono text-xs">
                    <span>
                      <span className="text-sell">BAR</span>
                      {" · "}
                      {r.kind} · {r.name}
                      {r.handle ? ` · ${r.handle}` : ""}
                      {" · "}
                      <span className="text-muted">{r.reason}</span>
                      {r.at ? (
                        <span className="ml-2 text-muted">{r.at.slice(0, 16).replace("T", " ")}Z</span>
                      ) : null}
                    </span>
                    <button type="button" className="text-tab hover:underline" onClick={() => void liftBar(r.id)}>
                      Unbar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel className="mt-4" kicker="IDS" title="24h blocked probes" kickerClass="text-sell">
            <p className="text-sm leading-relaxed text-muted">
              source-probe, inject, scrape, scanner, MCP deny, agency probe, waitlist reject, secret paste, forum bar.
              Same ring as Intrusions, filtered to bad bots. Also on the 07:30 morning report.
            </p>
            {!badBot24.length ? (
              <p className="mt-3 text-sm text-muted">No bad-bot probes in the last 24 hours. Gate is armed.</p>
            ) : (
              <ul className="mt-3 divide-y divide-rule">
                {badBot24.slice(0, 80).map((r) => (
                  <li key={r.id} className="py-2 font-mono text-xs">
                    <span className="text-sell">BLOCKED</span>
                    {" · "}
                    <span className="text-medium">{r.kind}</span>
                    {" · "}
                    <span className="text-muted">{r.at.slice(11, 19)}Z</span>
                    {" · "}
                    {r.detail}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      ) : null}
    </div>
  );
}

function Stat({ kicker, value, hint, ok }: { kicker: string; value: string; hint: string; ok: boolean }) {
  return (
    <div className="rounded-md border border-rule px-3 py-3">
      <p className="font-mono text-xs tracking-[0.08em] text-muted uppercase">{kicker}</p>
      <p className={cn("mt-1 font-mono text-lg", ok ? "text-high" : "text-sell")}>{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
