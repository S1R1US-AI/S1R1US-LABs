import { useEffect, useState, type ClipboardEvent, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, Lock, RefreshCw, Shield } from "lucide-react";
import { money, CallWords, bannerTone } from "@/components/helios-card";
import { AccessDesk } from "@/components/security-page";
import { SecurityDesk } from "@/components/security-desk";
import { DeskErrorLog } from "@/components/desk-error-log";
import { MorningReportPdf } from "@/components/morning-report-pdf";
import { LaunchDesk } from "@/components/launch-desk";
import { PaperManual } from "@/components/paper-manual";
import { PracticeDesk } from "@/components/practice-desk";
import { TapeFreezePanel } from "@/components/tape-freeze";
import { WebsitePortal } from "@/components/website-portal";
import { YubiApprove } from "@/components/yubi-approve";
import { OperatorGate } from "@/components/operator-lock";
import { XRenewWhenAdmin } from "@/components/renew-password";
import { BoardPlayPanel } from "@/components/board-play-panel";
import { HiveAdminPanel } from "@/components/hive-admin-panel";
import { HiveSwarmLabel } from "@/components/godzilla-mark";
import { Button } from "@/components/ui/button";
import { Panel, Shell } from "@/components/shell";
import { APP_NAME } from "@/lib/brand";
import { addDeskAccount, connectXAdmin, deleteDeskAccount, disconnectXAdmin, enrollYubi, listDeskAccounts, loadDeskVault, removeYubi, resetSecondFactor, saveDeskVault, secondFactorStatus, setYubiPanelLock, trackProfitWallet, trackUsdcWallet, webauthnBeginRegister, webauthnFinishRegister } from "@/lib/desk/access";
import { adminStatus } from "@/lib/desk/grok";
import { useOperator } from "@/lib/desk/operator";
import { BOT_ROSTER, CYCLE_ARCH, DATA_FEEDS, RISK_RULES, SYSTEM_REVIEWED } from "@/lib/desk/policy";
import { ANALYSIS_AS_OF, CDP_KEYS, CDP_REVOKE, MCP_DOCS, MCP_REMOTE, SPARROW_SITE, isEvmAddress, looksLikeSecret, protocolRows, usdcReceiveError, vulnRows } from "@/lib/desk/security";
import { buyBtcPreview, isPortfolioUuid, PROFIT_BTC_EXPLORER, PROFIT_BTC_RECEIVE, takeProfitPreviewUsd, transferPreview } from "@/lib/desk/treasury";
import { peekDeskTape, useDeskTape } from "@/lib/desk/tape-client";
import { DESK_POLL_MS } from "@/lib/desk/poll";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { STARTING_CASH, usePaper } from "@/lib/desk/store";
import { ADMIN_X_LABEL } from "@/lib/desk/x-admin";
import { cn, BTC_TONE, USD_TONE } from "@/lib/utils";

export function AdminPanel() {
  const token = useOperator((s) => s.token);
  const unlocked = useOperator((s) => s.unlocked);
  const audit = useOperator((s) => s.audit);
  const lock = useOperator((s) => s.lock);
  const log = useOperator((s) => s.log);
  const changeCreds = useOperator((s) => s.changeCreds);
  const role = useOperator((s) => s.role);
  const operatorName = useOperator((s) => s.operatorName);
  const cash = usePaper((s) => s.cashUsd);
  const btc = usePaper((s) => s.btc);
  const profitBtc = usePaper((s) => s.profitBtc);
  const fills = usePaper((s) => s.fills);
  const reset = usePaper((s) => s.reset);

  const { snap, refresh: refreshTape } = useDeskTape();
  const [status, setStatus] = useState<{
    grok: { used: number; max: number; windowMin: number };
    grokReady: boolean;
    exp: number | null;
    adminName: string;
  } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"console" | "wallet" | "paper" | "coin" | "website" | "access" | "security" | "bowl" | "hive">("wallet");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash.replace(/^#/, "");
    if (h === "access") setTab("access");
    if (h === "security") setTab("security");
    if (h === "bowl") setTab("bowl");
    if (h === "hive") setTab("hive");
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tab === "access" || tab === "security" || tab === "bowl" || tab === "hive") {
      const want = `#${tab}`;
      if (window.location.hash !== want) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${want}`);
      }
    } else if (window.location.hash === "#access" || window.location.hash === "#security" || window.location.hash === "#bowl" || window.location.hash === "#hive") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, [tab]);

  async function refresh() {
    const had = Boolean(snap);
    if (!had) setLoading(true);
    setErr(null);
    try {
      const [, st] = await Promise.all([
        refreshTape(),
        adminStatus({ data: { token: useOperator.getState().token } }),
      ]);
      if (!st.ok) setErr(st.error);
      else setStatus({ grok: st.grok, grokReady: st.grokReady, exp: st.exp, adminName: st.adminName });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Admin fetch failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (unlocked && token) void refresh();
  }, [unlocked, token]);

  const px = snap?.btc.price ?? 0;
  const nav = cash + (btc + (profitBtc ?? 0)) * px;
  const rows = protocolRows();

  return (
    <Shell
      right={
        <>
          <Button onClick={() => void refresh()} disabled={loading} aria-label="Refresh admin">
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </>
      }
    >
      <OperatorGate>
        {role === "user" ? (
          <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
            <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Restricted</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-brand">Admin</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Signed in as desk user <span className="font-mono text-fg">{operatorName || "—"}</span>.
              s1r1us.ai Admin is only @_Mr_R0b0t0_ plus name and password (two YubiKeys). iOS / Google copy
              Admin is on the downloaded app. Open the desk, or sign in as system admin.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex h-11 min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
            >
              Open desk
            </Link>
          </main>
        ) : (
        <>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Operator console</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">Admin</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {tab === "wallet"
              ? "Wallet rails: fund the Coinbase agent in USDC, accumulate BTC, take profit to the Coinbase BTC address. Dry-run + YubiKey. No keys on this host."
              : tab === "paper"
                ? "Research paper — system Admin only. PhD-style working paper on architecture and future outcomes. Not shown on iOS/Google copy-admin."
                : tab === "coin"
                  ? "Second business: S1R1US access-token launch. Same admin/Yubi. 7-B0T never trades the ticker."
                  : tab === "website"
                    ? "Portal to the public s1r1us.ai tape. Live build in this app. No launch notes on that page."
                    : tab === "access"
                      ? "Secure access — Coinbase MCP posture, protocol status, vulnerability review. Admin only."
                      : tab === "security"
                        ? "Firewall, intrusion log, Electrovolt audit, Hacktron-style hunter. Admin only."
                        : tab === "bowl"
                          ? "SUP3R B0WL / L3AD3R B0ARD / C@LL 0UT — compete as a separate board token. Not Yubi. Not vault."
                          : tab === "hive"
                            ? "H1V3 SW@RM — combine BYO compute (TH/s). Paper BTC split by pledged terahash. TEST until go-live. Pause/continue. Copy-admin may pause hive; championship pause stays system-only."
                : `Fund control for ${APP_NAME}. Session, Grok cap, two YubiKeys, risk rules, Coinbase MCP posture.`}
          </p>
          {err ? <p className="mt-3 text-sm text-down">{err}</p> : null}

          <nav className="desk-tabs mt-5 flex flex-wrap gap-1" aria-label="Admin sections">
            <button
              type="button"
              className={cn(
                "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "console" && "is-on",
              )}
              onClick={() => setTab("console")}
            >
              Console
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "wallet" && "is-on",
              )}
              onClick={() => setTab("wallet")}
            >
              Wallet
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "paper" && "is-on",
              )}
              onClick={() => setTab("paper")}
            >
              Paper
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "coin" && "is-on",
              )}
              onClick={() => setTab("coin")}
            >
              Coin
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "website" && "is-on",
              )}
              onClick={() => setTab("website")}
            >
              Website
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "access" && "is-on",
              )}
              onClick={() => setTab("access")}
            >
              Access
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "security" && "is-on",
              )}
              onClick={() => setTab("security")}
            >
              Security
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "bowl" && "is-on",
              )}
              onClick={() => setTab("bowl")}
            >
              SUP3R B0WL
            </button>
            <button
              type="button"
              className={cn(
                "hive-nav inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
                tab === "hive" && "is-on",
              )}
              onClick={() => setTab("hive")}
            >
              <HiveSwarmLabel className="text-sm" />
            </button>
          </nav>

          {tab === "console" || tab === "wallet" ? <PracticeDesk /> : null}
          {tab === "console" ? <TapeFreezePanel /> : null}
          {tab === "console" ? <DeskErrorLog /> : null}
          {tab === "console" ? <MorningReportPdf /> : null}

          {tab === "console" || tab === "wallet" ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Stat kicker="Paper NAV" value={mounted ? money(nav, 0) : "—"} hint="Cash + hot + profit BTC" />
            <Stat kicker="Cash" value={mounted ? money(cash, 0) : "—"} hint={`Start ${money(STARTING_CASH, 0)}`} />
            <Stat kicker="BTC" value={mounted ? btc.toFixed(6) : "—"} hint={px ? `@ ${money(px, 0)}` : "Coinbase"} />
            <Stat kicker="Profit BTC" value={mounted ? (profitBtc ?? 0).toFixed(6) : "—"} hint="Take-profit wallet" />
            <Stat
              kicker="Grok"
              value={status ? `${status.grok.used}/${status.grok.max}` : "—"}
              hint={status?.grokReady ? `${status.grok.windowMin} min window` : "xAI not injected"}
            />
          </div>
          ) : null}

          {tab === "paper" ? (
            <div className="mt-6">
              <PaperManual />
            </div>
          ) : tab === "coin" ? (
            <LaunchDesk />
          ) : tab === "website" ? (
            <WebsitePortal />
          ) : tab === "access" ? (
            <AccessDesk />
          ) : tab === "security" ? (
            <SecurityDesk />
          ) : tab === "bowl" ? (
            <BoardPlayPanel plane="system" defaultName="S1R1US-ADMIN" defaultKind="admin" />
          ) : tab === "hive" ? (
            token ? <HiveAdminPanel token={token} /> : null
          ) : tab === "wallet" ? (
            <>
              <TreasuryPanel />
              <YubiPanel />
            </>
          ) : (
            <>
          <YubiPanel />

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel kicker="Session" title="Admin access">
              <p className="font-mono text-sm">{unlocked ? "Unlocked" : "Locked"}</p>
              <p className="mt-1 font-mono text-sm text-accent">{status?.adminName ?? "—"}</p>
              <p className="mt-2 text-sm text-muted">
                Token{" "}
                {status?.exp
                  ? `expires ${new Date(status.exp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                  : "—"}
                . Ask Grok refuses a missing or expired session.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => void lock()}>
                  <Lock className="size-4" />
                  Lock session
                </Button>
                <Link
                  to="/"
                  className="inline-flex h-10 min-h-10 items-center rounded-sm border border-rule bg-surface px-3 text-sm hover:bg-fg/6"
                >
                  Open desk
                </Link>
              </div>
              <XRenewInAdmin />
            </Panel>

            <div className="space-y-4">
              <PasswordPanel
                changeCreds={changeCreds}
                adminName={status?.adminName ?? ""}
                onSaved={() => void refresh()}
              />
              <UsersPanel />
            </div>
          </div>

          <FactorPanel />

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel kicker="Paper book" title="Fund controls">
              <p className="text-sm leading-relaxed text-muted">
                Fills are simulated at Coinbase last. Reset returns {money(STARTING_CASH, 0)} cash and zero
                BTC. Not a Coinbase order.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => setConfirmReset(true)}>
                  Reset paper book
                </Button>
              </div>
              <ul className="mt-4 max-h-40 space-y-1 overflow-auto font-mono text-xs">
                {mounted && fills.length ? (
                  fills.slice(0, 8).map((f) => (
                    <li key={f.id} className="flex gap-2">
                      <span className={f.side === "BUY" ? "text-up" : "text-down"}>{f.side}</span>
                      <span>{money(f.usd, 0)}</span>
                      <span className="text-muted">{f.note}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No fills this book.</li>
                )}
              </ul>
            </Panel>
          </div>

          <Panel className="mt-4" kicker="Tape" title="Source health">
            <p className="mb-3 text-xs text-muted">
              Two-phase {CYCLE_ARCH.name}: core ≤ {CYCLE_ARCH.coreMs / 1000}s then fill. Hunt {SYSTEM_REVIEWED}. SuperGrok
              only paid. Hunt date does not bump unless a pull is clean or a fix is 100%.
            </p>
            {snap?.feedAudit ? (
              <p className={cn("mb-3 font-mono text-xs", snap.feedAudit.fail ? "text-down" : "text-up")}>
                Last pull {snap.feedAudit.at.slice(11, 19)}Z · {snap.feedAudit.pullMs}ms · {snap.feedAudit.ok} ok · {snap.feedAudit.fail} fail
              </p>
            ) : null}
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {DATA_FEEDS.map((f) => {
                const audit = snap?.feedAudit.rows.find((r) => r.id === f.id);
                const down = audit ? !audit.ok : snap?.errors.some((e) => e.toLowerCase().includes(f.id));
                return (
                  <li key={f.id}>
                    <p className={cn("font-mono text-xs", down ? "text-down" : "text-up")}>
                      {down ? "FAIL" : snap ? "OK" : "—"}
                    </p>
                    <p className="text-sm">{f.name}</p>
                    <p className="text-xs text-muted">{audit?.detail ?? f.role}</p>
                  </li>
                );
              })}
            </ul>
            {snap?.errors.length ? (
              <p className="mt-3 font-mono text-xs text-muted">Degraded: {snap.errors.join(" · ")}</p>
            ) : null}
          </Panel>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel kicker="Helios" title="Risk policy">
              <ul className="divide-y divide-rule">
                {RISK_RULES.map((r) => (
                  <li key={r.id} className="flex gap-3 py-2">
                    <span className="w-24 shrink-0 font-mono text-xs text-muted">{r.label}</span>
                    <span className="text-sm">{r.value}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel kicker="Seven bots" title="Roster">
              <ul className="divide-y divide-rule">
                {BOT_ROSTER.map((b) => (
                  <li key={b.id} className="flex items-baseline justify-between gap-3 py-2">
                    <div>
                      <p className="text-sm">{b.name}</p>
                      <p className="font-mono text-xs text-muted">{b.layer}</p>
                    </div>
                    <p className="text-xs text-muted">{b.feed}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel className="mt-4" kicker="Coinbase MCP" title="Execution posture">
            <p className="text-sm leading-relaxed text-muted">
              Isolated portfolio. Trade + Transfer only. Preview before create. This host copies{" "}
              <span className="font-mono text-fg">orders preview --dry-run</span>. You authorize live
              trades on MCP or CLI.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <a className="underline" href={MCP_REMOTE} target="_blank" rel="noreferrer">
                agents.coinbase.com/mcp
              </a>
              <a className="underline" href={MCP_DOCS} target="_blank" rel="noreferrer">
                MCP docs
              </a>
              <a className="underline" href={CDP_KEYS} target="_blank" rel="noreferrer">
                Scoped API key
              </a>
              <a className="underline" href={CDP_REVOKE} target="_blank" rel="noreferrer">
                Revoke
              </a>
            </div>
            <ul className="mt-4 divide-y divide-rule">
              {rows.map((r) => (
                <li key={r.id} className="flex gap-3 py-2">
                  <span
                    className={cn(
                      "w-20 shrink-0 font-mono text-xs",
                      r.status === "PASS" ? "text-up" : "text-accent",
                    )}
                  >
                    {r.status}
                  </span>
                  <span className="text-sm">{r.title}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="mt-4" kicker="Analysis" title={`Vulnerability review · ${ANALYSIS_AS_OF}`}>
            <ul className="divide-y divide-rule">
              {vulnRows().map((v) => (
                <li key={v.id} className="flex gap-3 py-3">
                  <span
                    className={cn(
                      "w-24 shrink-0 font-mono text-xs",
                      v.severity === "HIGH" ? "text-down" : v.severity === "MED" ? "text-accent" : "text-muted",
                    )}
                  >
                    {v.severity}
                  </span>
                  <div>
                    <p className="text-sm">
                      {v.title}{" "}
                      <span className={v.status === "FIXED" || v.status === "MITIGATED" ? "text-up" : "text-accent"}>
                        {v.status}
                      </span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{v.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="mt-4" kicker="Audit" title="This browser">
            <ul className="max-h-56 space-y-1 overflow-auto font-mono text-xs">
              {audit.length ? (
                audit.map((e) => (
                  <li key={e.id} className="flex gap-3">
                    <span className="text-muted">{e.at.slice(11, 19)}</span>
                    <span className="text-accent">{e.kind}</span>
                    <span>{e.note}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted">No events yet.</li>
              )}
            </ul>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted">
              <Shield className="mt-0.5 size-3.5 shrink-0" />
              Coinbase does not guarantee agent actions. You review every live trade.
            </p>
          </Panel>
            </>
          )}
        </main>

        {confirmReset ? (
          <div
            className="fixed inset-0 z-40 flex items-end justify-center bg-bg/80 p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
          >
            <div className="w-full max-w-md rounded-lg border border-rule bg-surface p-5">
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Human in the loop</p>
              <h2 id="reset-title" className="mt-1 text-base font-medium">
                Reset paper book?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Cash returns to {money(STARTING_CASH, 0)}. BTC and fills clear. Coinbase is not contacted.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    reset();
                    log("fill", "Paper book reset");
                    setConfirmReset(false);
                  }}
                >
                  Confirm reset
                </Button>
                <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        ) : null}
        </>
        )}
      </OperatorGate>
    </Shell>
  );
}

function TreasuryPanel() {
  const log = useOperator((s) => s.log);
  const token = useOperator((s) => s.token);
  const paperProfit = usePaper((s) => s.profitBtc);
  const paperCash = usePaper((s) => s.cashUsd);
  const paperBtc = usePaper((s) => s.btc);
  const [profitAddress, setProfitAddress] = useState("");
  const [addr, setAddr] = useState("");
  const [main, setMain] = useState("");
  const [agent, setAgent] = useState("");
  const [amount, setAmount] = useState("100");
  const [usdc, setUsdc] = useState("");
  const [usdcBal, setUsdcBal] = useState<{
    usdc: number | null;
    ethUsdc?: number | null;
    baseUsdc?: number | null;
    network: string;
    explorer: string;
    ethExplorer?: string;
    baseExplorer?: string;
    address: string;
    kind?: string;
  } | null>(null);
  const [call, setCall] = useState<{
    stance: string;
    conviction: string;
    clipUsd: number;
    cli: string;
  } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmAddr, setConfirmAddr] = useState(false);
  const [pendingOut, setPendingOut] = useState<{ title: string; detail: string; action: string; cmd: string; label: string } | null>(null);
  const [chain, setChain] = useState<{
    explorer: string;
    btc: number | null;
    incoming: number | null;
    outgoing: number | null;
    txCount: number | null;
    source: string;
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    void loadDeskVault({ data: { token } }).then((res) => {
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      setProfitAddress(res.vault.profitAddress);
      setAddr(res.vault.sparrowAddress);
      setMain(res.vault.mainUuid);
      setAgent(res.vault.agentUuid);
      setUsdc(res.vault.usdcAddress ?? "");
      try {
        localStorage.removeItem("h3-treasury-watch");
      } catch {
        /* ignore */
      }
    });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let stop = false;
    async function pull() {
      const res = await trackProfitWallet({ data: { token: token! } });
      if (stop) return;
      if (res.ok) setChain(res.chain);
      const usd = await trackUsdcWallet({ data: { token: token! } });
      if (stop) return;
      if (usd.ok) setUsdcBal(usd.chain);
      try {
        const tape = peekDeskTape();
        if (!tape) return;
        const nav = paperCash + (paperBtc + (paperProfit ?? 0)) * (tape.btc.price ?? 0);
        const next = heliosCall(tape, runBots(tape), nav || STARTING_CASH);
        if (!stop) {
          setCall({
            stance: next.stance,
            conviction: next.conviction,
            clipUsd: next.clipUsd,
            cli: next.cli,
          });
        }
      } catch {
        /* tape optional */
      }
    }
    void pull();
    const id = window.setInterval(() => void pull(), DESK_POLL_MS);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [token]);

  async function persistVault(nextAddr = addr, nextMain = main, nextAgent = agent, nextUsdc = usdc) {
    if (!token) {
      setErr("Admin session required.");
      return false;
    }
    const res = await saveDeskVault({
      data: {
        token,
        sparrowAddress: nextAddr,
        mainUuid: nextMain,
        agentUuid: nextAgent,
        usdcAddress: nextUsdc,
      },
    });
    if (!res.ok) {
      setErr(res.error);
      return false;
    }
    setProfitAddress(res.vault.profitAddress);
    setAddr(res.vault.sparrowAddress);
    setMain(res.vault.mainUuid);
    setAgent(res.vault.agentUuid);
    setUsdc(res.vault.usdcAddress ?? "");
    setErr(null);
    return true;
  }

  function guardPaste(e: ClipboardEvent<HTMLInputElement>) {
    const t = e.clipboardData.getData("text");
    if (looksLikeSecret(t)) {
      e.preventDefault();
      setErr("Seed / key rejected. Paste a receive address or portfolio UUID only.");
      return;
    }
    if (isEvmAddress(t) && (e.currentTarget.id === "main-uuid" || e.currentTarget.id === "agent-uuid")) {
      e.preventDefault();
      setErr("That is a USDC 0x. Paste it in Staging USDC at the top of this tab — not in a portfolio UUID.");
    }
  }

  async function copy(text: string, label: string) {
    if (looksLikeSecret(text) || text.includes("orders create")) {
      log("reject", "Blocked unsafe CLI copy");
      return;
    }
    await navigator.clipboard.writeText(text);
    log("copy", label);
    setCopied(label);
  }

  function requestOutgoing(title: string, detail: string, action: string, cmd: string, label: string) {
    if (looksLikeSecret(cmd) || cmd.includes("orders create")) {
      log("reject", "Blocked unsafe CLI copy");
      return;
    }
    setPendingOut({ title, detail, action, cmd, label });
  }

  const amt = Math.max(1, Number(amount) || 0);
  const fundCli =
    isPortfolioUuid(main) && isPortfolioUuid(agent)
      ? transferPreview(amt, "USDC", main, agent)
      : "coinbase portfolios list  # copy the main and S1R1U$ UUIDs";
  const sweepCli =
    isPortfolioUuid(main) && isPortfolioUuid(agent)
      ? transferPreview(amt, "BTC", agent, main)
      : "coinbase transfer amount=<n> currency=BTC from=<H3_UUID> to=<MAIN_UUID>";
  const usdcOutCli =
    isPortfolioUuid(main) && isPortfolioUuid(agent)
      ? transferPreview(amt, "USDC", agent, main)
      : "coinbase transfer amount=<n> currency=USDC from=<AGENT_UUID> to=<MAIN_UUID>";
  const buyCli = buyBtcPreview(amt);
  const profitCli = profitAddress
    ? takeProfitPreviewUsd(amt, profitAddress)
    : "coinbase send --dry-run amount=<BTC> currency=BTC to=<admin profit wallet>";

  return (
    <Panel className="mt-4" kicker="Wallet" title="Staging USDC 0x + Coinbase portfolios">
      <p className="max-w-3xl text-sm leading-relaxed text-fg">
        The 0x (e.g. 0x5511…) goes <span className="font-medium">here</span>. It does{" "}
        <span className="font-medium">not</span> go in Main UUID or S1R1U$ UUID.
      </p>

      <div className="mt-4 rounded-md border border-brand/50 bg-brand/8 p-4">
        <p className="text-[11px] font-medium tracking-[0.08em] text-high uppercase">
          Staging USDC — paste the 0x here
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Base app with Ethereum or Base selected → Receive USDC → copy 0x. Same address works on ERC-20 and
          Base. This is self-custody staging, not the Coinbase agent book. To trade, send native USDC from
          this 0x to the S1R1U$ Coinbase portfolio (that UUID is a different field below).
        </p>
        <label className="mt-3 block text-sm" htmlFor="usdc-addr">
          Staging 0x
        </label>
        <input
          id="usdc-addr"
          value={usdc}
          onChange={(e) => setUsdc(e.target.value.trim())}
          onPaste={guardPaste}
          placeholder="0x551163f5d4c0361155d16131459afa5c936a60ad"
          className="mt-1 h-11 w-full rounded-md border border-rule bg-surface px-3 font-mono text-sm text-fg"
          autoComplete="off"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              if (usdc) {
                const usdcErr = usdcReceiveError(usdc);
                if (usdcErr) {
                  setErr(usdcErr);
                  return;
                }
              }
              void persistVault(addr, main, agent, usdc).then((ok) => {
                if (ok) log("treasury", "USDC receive address encrypted");
              });
            }}
          >
            Save USDC address
          </Button>
          {usdc ? (
            <Button type="button" onClick={() => void copy(usdc, "USDC receive")}>
              Copy address
            </Button>
          ) : null}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm sm:grid-cols-4">
          <div>
            <p className="text-[11px] text-muted">ETH USDC</p>
            <p className={`mt-0.5 tabular-nums ${USD_TONE}`}>
              {usdcBal?.ethUsdc != null ? usdcBal.ethUsdc.toFixed(2) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted">Base USDC</p>
            <p className={`mt-0.5 tabular-nums ${USD_TONE}`}>
              {usdcBal?.baseUsdc != null ? usdcBal.baseUsdc.toFixed(2) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted">On-chain total</p>
            <p className={`mt-0.5 tabular-nums ${USD_TONE}`}>
              {usdcBal?.usdc != null ? usdcBal.usdc.toFixed(2) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted">Paper USDC</p>
            <p className={`mt-0.5 tabular-nums ${USD_TONE}`}>{paperCash.toFixed(2)}</p>
          </div>
        </div>
        {usdcBal?.kind ? <p className="mt-2 text-xs text-muted">{usdcBal.kind}</p> : null}
        <div className="mt-2 flex flex-wrap gap-3 text-xs">
          {usdcBal?.ethExplorer ? (
            <a className="text-accent underline" href={usdcBal.ethExplorer} target="_blank" rel="noreferrer">
              Etherscan USDC
            </a>
          ) : null}
          {usdcBal?.baseExplorer ? (
            <a className="text-accent underline" href={usdcBal.baseExplorer} target="_blank" rel="noreferrer">
              Basescan USDC
            </a>
          ) : null}
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
        {APP_NAME} does not hold keys. Trading USDC/BTC sit in the Coinbase{" "}
        <span className="text-fg">S1R1U$ agent portfolio</span> (UUID). Take-profit BTC goes to your Coinbase
        Receive. Sparrow is optional backup only.
      </p>

      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li className="rounded-md border border-rule bg-bg p-3">
          <p className="font-mono text-xs text-accent">USDC book</p>
          <p className="mt-1 text-sm">
            Coinbase Advanced <span className="text-fg">agent portfolio</span>. Receive USDC there (Base
            or Ethereum). No 0x required on this desk.
          </p>
        </li>
        <li className="rounded-md border border-rule bg-bg p-3">
          <p className="font-mono text-xs text-medium">BTC book</p>
          <p className="mt-1 text-sm">
            BTC bought by the agent stays in that same portfolio until TRIM. No desk-owned BTC key.
          </p>
        </li>
        <li className="rounded-md border border-rule bg-bg p-3">
          <p className={`font-mono text-xs ${BTC_TONE}`}>Profit BTC</p>
          <p className="mt-1 text-sm">
            Your Coinbase BTC Receive. TRIM sends here. Incoming is tracked even after Coinbase sweeps.
          </p>
        </li>
        <li className="rounded-md border border-rule bg-bg p-3">
          <p className="font-mono text-xs text-muted">Sparrow</p>
          <p className="mt-1 text-sm">Optional watch-only backup. Never the live take-profit dest.</p>
        </li>
      </ol>

      <div className="mt-4 rounded-md border border-rule bg-bg p-4">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
          7-B0T → Coinbase agent
        </p>
        {call ? (
          <div className="mt-2">
            <CallWords call={call} className="font-mono text-sm" />
            <p className="font-mono text-xs text-muted">clip {money(call.clipUsd, 0)}</p>
          </div>
        ) : (
          <p className="mt-2 font-mono text-sm text-muted">Waiting for tape…</p>
        )}
        <p className="mt-2 text-sm text-muted">
          HIGH BUY/ACCUMULATE copies a BTC-USDC buy preview for the clip (1% ACCUMULATE / 2% BUY of the
          $100 book). HIGH TRIM copies a take-profit send. This desk never broadcasts. Two YubiKeys
          must be enrolled.
        </p>
        {call && call.conviction === "HIGH" && (call.stance === "BUY" || call.stance === "ACCUMULATE") ? (
          <div className="mt-3">
            <CliRow
              label="HIGH conviction buy (agent)"
              cmd={buyBtcPreview(call.clipUsd)}
              onCopy={() =>
                requestOutgoing(
                  "Approve HIGH conviction BTC buy",
                  `7-B0T ${call.stance} HIGH. Clip ${money(call.clipUsd, 0)} USDC from the $100 book. Dry-run only. You run the Coinbase agent/CLI.`,
                  `trade:HIGH-BUY:${call.clipUsd}`,
                  buyBtcPreview(call.clipUsd),
                  "HIGH buy preview",
                )
              }
              copied={copied}
            />
          </div>
        ) : null}
        {call && call.conviction === "HIGH" && call.stance === "TRIM" && profitAddress ? (
          <div className="mt-3">
            <CliRow
              label="HIGH conviction take-profit"
              cmd={takeProfitPreviewUsd(call.clipUsd, profitAddress)}
              onCopy={() =>
                requestOutgoing(
                  "Approve HIGH conviction take-profit",
                  `7-B0T TRIM HIGH. Clip ${money(call.clipUsd, 0)} toward the Coinbase BTC profit address. Dry-run only.`,
                  `send:HIGH-TRIM:${call.clipUsd}`,
                  takeProfitPreviewUsd(call.clipUsd, profitAddress),
                  "HIGH trim send",
                )
              }
              copied={copied}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (looksLikeSecret(addr)) {
              setErr("Seed rejected.");
              return;
            }
            setConfirmAddr(true);
          }}
        >
          <label className="block text-sm" htmlFor="sparrow-addr">
            Sparrow backup address (optional, watch-only)
          </label>
          <input
            id="sparrow-addr"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            onPaste={guardPaste}
            placeholder="bc1q…"
            className="h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
            autoComplete="off"
          />
          <label className="block text-sm" htmlFor="main-uuid">
            Main portfolio UUID (not a 0x)
          </label>
          <input
            id="main-uuid"
            value={main}
            onChange={(e) => setMain(e.target.value)}
            onPaste={guardPaste}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
            autoComplete="off"
          />
          <label className="block text-sm" htmlFor="agent-uuid">
            S1R1U$ portfolio UUID (not a 0x)
          </label>
          <input
            id="agent-uuid"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            onPaste={guardPaste}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
            autoComplete="off"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                if (isEvmAddress(main) || isEvmAddress(agent)) {
                  setErr("That is a USDC 0x. Paste it in Staging USDC at the top — not in a UUID field.");
                  return;
                }
                if (main && !isPortfolioUuid(main)) {
                  setErr("Main UUID looks wrong.");
                  return;
                }
                if (agent && !isPortfolioUuid(agent)) {
                  setErr("Agent UUID looks wrong.");
                  return;
                }
                setErr(null);
                void persistVault(addr, main, agent).then((ok) => {
                  if (ok) log("treasury", "Portfolio UUIDs encrypted in vault");
                });
              }}
            >
              Save UUIDs
            </Button>
            <Button variant="primary" type="submit">
              Save backup address
            </Button>
          </div>
          {err ? <p className="text-sm text-down">{err}</p> : null}
        </form>

        <div className="space-y-3">
          <label className="block text-sm" htmlFor="clip-amt">
            Preview size (USDC / USD)
          </label>
          <input
            id="clip-amt"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
          />
          <CliRow label="List portfolios" cmd="coinbase portfolios list" onCopy={() => void copy("coinbase portfolios list", "List portfolios")} copied={copied} />
          <CliRow label="Fund agent USDC" cmd={fundCli} onCopy={() => void copy(fundCli, "Fund agent USDC")} copied={copied} />
          {profitAddress ? (
            <CliRow
              label="Coinbase BTC profit address"
              cmd={profitAddress}
              onCopy={() => void copy(profitAddress, "Profit BTC address")}
              copied={copied}
            />
          ) : null}
          <CliRow
            label="USDC agent → main"
            cmd={usdcOutCli}
            onCopy={() =>
              requestOutgoing(
                "Approve outgoing USDC",
                "USDC leaves the S1R1U$ agent toward main. Admin YubiKey required.",
                `transfer:USDC-out:${amt}`,
                usdcOutCli,
                "USDC agent → main",
              )
            }
            copied={copied}
          />
          <CliRow
            label="Buy BTC preview"
            cmd={buyCli}
            onCopy={() =>
              requestOutgoing(
                "Approve BTC buy",
                "USDC leaves the S1R1U$ portfolio to buy BTC. Admin YubiKey required.",
                `trade:BUY-BTC:${amt}`,
                buyCli,
                "Buy BTC preview",
              )
            }
            copied={copied}
          />
          <CliRow
            label="BTC agent → main"
            cmd={sweepCli}
            onCopy={() =>
              requestOutgoing(
                "Approve outgoing BTC",
                "BTC leaves the S1R1U$ portfolio toward main. Admin YubiKey required.",
                `transfer:BTC-out:${amt}`,
                sweepCli,
                "BTC agent → main",
              )
            }
            copied={copied}
          />
          <CliRow
            label="Take profit → Coinbase BTC"
            cmd={profitCli}
            onCopy={() =>
              requestOutgoing(
                "Approve take-profit send",
                `BTC leaves the agent toward the encrypted profit wallet. Admin YubiKey required. Dry-run only.`,
                `send:BTC-profit:${amt}`,
                profitCli,
                "Take profit send",
              )
            }
            copied={copied}
          />
          <div className="rounded-md border border-rule bg-bg p-3">
            <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
              Profit-taking transfer balance
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-sm sm:grid-cols-4">
              <div>
                <p className="text-[11px] text-muted">On-chain</p>
                <p className={`mt-0.5 tabular-nums ${BTC_TONE}`}>
                  {chain?.btc != null ? `${chain.btc.toFixed(8)} BTC` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-high">In</p>
                <p className="mt-0.5 tabular-nums text-high">
                  {chain?.incoming != null ? chain.incoming.toFixed(8) : "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Out</p>
                <p className="mt-0.5 tabular-nums text-muted">
                  {chain?.outgoing != null ? chain.outgoing.toFixed(8) : "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Paper TRIM</p>
                <p className={`mt-0.5 tabular-nums ${BTC_TONE}`}>{(paperProfit ?? 0).toFixed(8)}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">
              {chain?.txCount != null ? `${chain.txCount} txs` : "txs —"} · {chain?.source ?? "waiting"}
            </p>
            {chain?.explorer ? (
              <a
                className="mt-1 inline-block text-xs text-accent underline"
                href={chain.explorer}
                target="_blank"
                rel="noreferrer"
              >
                Open on blockchain.com
              </a>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Profit BTC is your Coinbase Receive{" "}
            <span className={`break-all font-mono ${BTC_TONE}`}>{profitAddress || PROFIT_BTC_RECEIVE}</span>
            . That is the correct TRIM destination. The desk does not need its own Bitcoin address.{" "}
            <a className="underline" href={PROFIT_BTC_EXPLORER} target="_blank" rel="noreferrer">
              blockchain.com
            </a>
            . Sparrow backup: <span className="font-mono text-fg">{addr || "not set"}</span>.
          </p>
        </div>
      </div>

      {confirmAddr ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-bg/80 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sparrow-title"
        >
          <div className="w-full max-w-md rounded-lg border border-rule bg-surface p-5">
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Human in the loop</p>
            <h2 id="sparrow-title" className="mt-1 text-base font-medium">
              Save this Sparrow backup address?
            </h2>
            <p className="mt-3 break-all font-mono text-sm">{addr}</p>
            <p className="mt-2 text-sm text-muted">
              Optional worst-case backup only. Watch-only. No seed. Take-profit still goes to the Coinbase
              BTC address.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  void persistVault(addr, main, agent).then((ok) => {
                    if (ok) log("treasury", "Sparrow backup encrypted in vault");
                    setConfirmAddr(false);
                  });
                }}
              >
                Confirm address
              </Button>
              <Button onClick={() => setConfirmAddr(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      ) : null}
      {pendingOut ? (
        <YubiApprove
          title={pendingOut.title}
          detail={pendingOut.detail}
          action={pendingOut.action}
          onCancel={() => setPendingOut(null)}
          onDone={() => {
            const next = pendingOut;
            setPendingOut(null);
            void copy(next.cmd, next.label);
          }}
        />
      ) : null}
    </Panel>
  );
}

function CliRow({
  label,
  cmd,
  onCopy,
  copied,
}: {
  label: string;
  cmd: string;
  onCopy: () => void;
  copied: string | null;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm">{label}</p>
        <Button onClick={onCopy} aria-label={`Copy ${label}`}>
          <Copy className="size-4" />
          {copied === label ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="mt-1 overflow-x-auto rounded-md border border-rule bg-bg p-2 font-mono text-xs text-muted">
        {cmd}
      </pre>
    </div>
  );
}

function FactorPanel() {
  const token = useOperator((s) => s.token);
  const log = useOperator((s) => s.log);
  const [st, setSt] = useState<{
    enrolled: boolean;
    match: boolean;
    passwordless: boolean;
    handle: string | null;
    adminX: string | null;
    allowed: boolean;
  } | null>(null);
  const [current, setCurrent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      setSt(await secondFactorStatus());
    } catch {
      setSt(null);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const handle = st?.handle ?? ADMIN_X_LABEL;

  return (
    <Panel className="mt-4" kicker="Two-factor" title={`${ADMIN_X_LABEL} admin`} titleClass="x-admin-name">
      <p className="text-sm leading-relaxed text-muted">
        First login is admin name + password. Then enroll two YubiKeys (panel above). X is optional.
        Connect records this X session as a passwordless admin path.
      </p>
      <p className="mt-3 font-mono text-sm">
        {handle}{" "}
        <span className={st?.passwordless && st.match && st.allowed ? "text-up" : "text-accent"}>
          {!st?.allowed
            ? "not this X account"
            : st.passwordless && st.match
              ? "connected — no extra login"
              : st.enrolled
                ? "enrolled — password still required"
                : "not enrolled"}
        </span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="primary"
          disabled={busy || !st?.allowed || Boolean(st?.passwordless && st.match)}
          onClick={() => {
            setBusy(true);
            setErr(null);
            setOk(null);
            void (async () => {
              const res = await connectXAdmin({ data: { token } });
              setBusy(false);
              if (!res.ok) {
                setErr(res.error);
                return;
              }
              log("password", `${ADMIN_X_LABEL} connected as X admin`);
              setOk(`${ADMIN_X_LABEL} connected. Next X login unlocks the desk.`);
              await refresh();
            })();
          }}
        >
          Connect {ADMIN_X_LABEL}
        </Button>
        <Button
          disabled={busy || !st?.passwordless}
          onClick={() => {
            setBusy(true);
            setErr(null);
            setOk(null);
            void (async () => {
              const res = await disconnectXAdmin({ data: { token } });
              setBusy(false);
              if (!res.ok) {
                setErr(res.error);
                return;
              }
              log("password", `${ADMIN_X_LABEL} disconnected`);
              setOk("Disconnected. X + admin password required again.");
              await refresh();
            })();
          }}
        >
          Disconnect
        </Button>
      </div>
      {!st?.allowed ? (
        <p className="mt-2 text-sm text-muted">Sign in with {ADMIN_X_LABEL} to connect.</p>
      ) : null}
      <form
        className="mt-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void (async () => {
            setErr(null);
            setOk(null);
            const res = await resetSecondFactor({ data: { token, current } });
            if (!res.ok) {
              setErr(res.error);
              return;
            }
            setCurrent("");
            setOk("Enrollment cleared.");
            log("password", "2FA enrollment cleared");
            await refresh();
          })();
        }}
      >
        <div className="min-w-48 flex-1">
          <label className="block text-sm" htmlFor="reset-2fa">
            Password to clear enrollment
          </label>
          <input
            id="reset-2fa"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
            required
          />
        </div>
        <Button type="submit">Clear 2FA enrollment</Button>
      </form>
      {err ? <p className="mt-2 text-sm text-down">{err}</p> : null}
      {ok ? <p className="mt-2 text-sm text-up">{ok}</p> : null}
    </Panel>
  );
}

function YubiPanel() {
  const token = useOperator((s) => s.token);
  const log = useOperator((s) => s.log);
  const [st, setSt] = useState<{
    yubi: boolean;
    yubiCount: number;
    yubiSlots: number;
    yubiKeys: { slot: string; publicId: string }[];
    panelLock: boolean;
    webauthnCount: number;
    webauthn: { id: string; credentialId: string }[];
  } | null>(null);
  const [otp, setOtp] = useState("");
  const [current, setCurrent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fidoOk, setFidoOk] = useState(false);

  async function refresh() {
    try {
      const row = await secondFactorStatus();
      setSt({
        yubi: row.yubi,
        yubiCount: row.yubiCount ?? 0,
        yubiSlots: row.yubiSlots ?? 2,
        yubiKeys: row.yubiKeys ?? [],
        panelLock: Boolean(row.panelLock),
        webauthnCount: row.webauthnCount ?? 0,
        webauthn: row.webauthn ?? [],
      });
    } catch {
      setSt(null);
    }
  }

  useEffect(() => {
    void refresh();
    void import("@/lib/desk/webauthn-client").then((m) => setFidoOk(m.webauthnAvailable()));
  }, []);

  const count = st?.yubiCount ?? 0;
  const slots = st?.yubiSlots ?? 2;
  const firstLogin = count < slots;
  const fidoCount = st?.webauthnCount ?? 0;
  const hasKey = count > 0 || fidoCount > 0;
  const lockOn = Boolean(st?.panelLock);

  async function enroll(value: string) {
    const tap = value.trim().toLowerCase();
    if (tap.length !== 44) {
      setErr("Touch the YubiKey in this field until 44 characters appear.");
      return;
    }
    setBusy(true);
    setErr(null);
    setOk(null);
    const res = await enrollYubi({ data: { token, otp: tap } });
    setBusy(false);
    setOtp("");
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    log("yubi", `YubiKey slot ${res.slot} enrolled`);
    const left = res.remaining;
    setOk(
      left > 0
        ? `Key ${res.slot} saved (${res.publicId}). Tap the second YubiKey now (${res.count}/${slots}).`
        : `Both YubiKeys enrolled. Outgoing BTC/USDC requires either key.`,
    );
    await refresh();
  }

  async function enrollFido() {
    setBusy(true);
    setErr(null);
    setOk(null);
    try {
      const { clientOrigin, createYubiCredential } = await import("@/lib/desk/webauthn-client");
      const origin = clientOrigin();
      const begin = await webauthnBeginRegister({ data: { token, origin } });
      if (!begin.ok) {
        setErr(begin.error);
        setBusy(false);
        return;
      }
      const cred = await createYubiCredential(begin.options);
      const res = await webauthnFinishRegister({
        data: {
          token,
          origin,
          challenge: cred.challenge,
          credentialId: cred.credentialId,
          publicKey: cred.publicKey,
          alg: cred.alg,
          transports: cred.transports,
          clientDataJSON: cred.clientDataJSON,
        },
      });
      if (!res.ok) {
        setErr(res.error);
        setBusy(false);
        return;
      }
      log("yubi", `FIDO2 YubiKey enrolled (${res.credentialId})`);
      setOk(`FIDO2 key saved (${res.credentialId}). Yubico: enroll a backup key too.`);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "FIDO2 enrollment failed.");
    }
    setBusy(false);
  }

  async function toggleLock(on: boolean) {
    setBusy(true);
    setErr(null);
    setOk(null);
    const res = await setYubiPanelLock({ data: { token, on } });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    log("yubi", on ? "Admin panel locked behind YubiKey" : "Admin panel YubiKey lock off");
    setOk(
      on
        ? "Admin panel now requires a physical YubiKey after X + name + password."
        : "YubiKey lock off. X + name + password opens Admin again.",
    );
    await refresh();
  }

  return (
    <Panel className="mt-4" kicker="Yubico" title="YubiKey — OTP, FIDO2, optional panel lock">
      <p className="text-sm leading-relaxed text-muted">
        First login is name + password only. Enroll <strong>two</strong> YubiKeys for outgoing BTC/USDC
        (Yubico OTP, slot 1, short-press). Optionally lock the admin panel behind a physical key —
        default <strong>off</strong>. Official:{" "}
        <a className="text-brand underline" href="https://www.yubico.com/" target="_blank" rel="noreferrer">
          yubico.com
        </a>
        .
      </p>

      <div className="mt-4 rounded-md border border-rule bg-bg px-3 py-3">
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Admin panel lock</p>
        <p className={cn("mt-1 font-mono text-sm", lockOn ? "text-up" : "text-accent")}>
          {lockOn ? "ON — physical YubiKey required to open Admin" : "OFF — X + name + password is enough"}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Optional extra door. Cannot turn on without an enrolled YubiKey (OTP or FIDO2). Cannot remove
          the last key while this is on. Yubico recommends two keys (primary + backup). Outgoing BTC/USDC
          still needs both OTP keys. Official WebAuthn: UV required, hardware-bound, sign-count clone
          detection.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant={lockOn ? undefined : "primary"} disabled={busy || lockOn || !hasKey} onClick={() => void toggleLock(true)}>
            Lock admin behind YubiKey
          </Button>
          <Button disabled={busy || !lockOn} onClick={() => void toggleLock(false)}>
            Turn lock off
          </Button>
        </div>
        {!hasKey ? <p className="mt-2 text-xs text-accent">Enroll a YubiKey below before turning the lock on.</p> : null}
        {hasKey && (count + fidoCount) < 2 ? (
          <p className="mt-2 text-xs text-accent">Yubico: enroll a second key (backup) before relying on this lock.</p>
        ) : null}
      </div>

      <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Yubico OTP × 2 (outgoing)</p>
      <ol className="mt-2 grid gap-2 sm:grid-cols-2">
        {[1, 2].map((n) => {
          const row = st?.yubiKeys.find((k) => k.slot === String(n));
          return (
            <li key={n} className="rounded-md border border-rule bg-bg px-3 py-2">
              <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Key {n}</p>
              <p className={cn("mt-1 font-mono text-sm", row ? "text-up" : "text-accent")}>
                {row ? `enrolled ${row.publicId}` : n === 1 ? "tap first key" : "tap second key"}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 font-mono text-sm">
        {firstLogin ? (
          <span className="text-accent">
            Enroll {slots - count} more OTP key{slots - count === 1 ? "" : "s"} ({count}/{slots})
          </span>
        ) : (
          <span className="text-up">Both OTP keys enrolled</span>
        )}
      </p>
      <form
        className="mt-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void enroll(otp);
        }}
      >
        <div className="min-w-48 flex-1">
          <label className="block text-sm" htmlFor="enroll-yubi">
            {count === 0 ? "Tap YubiKey 1" : count === 1 ? "Tap YubiKey 2" : "OTP slots full"}
          </label>
          <input
            id="enroll-yubi"
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={otp}
            onChange={(e) => {
              const next = e.target.value.trim().toLowerCase();
              setOtp(next);
              if (next.length === 44) void enroll(next);
            }}
            className="mt-1 h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
            maxLength={44}
            disabled={busy || count >= slots}
          />
        </div>
        <Button type="submit" variant="primary" disabled={busy || count >= slots}>
          Enroll OTP {Math.min(count + 1, slots)}
        </Button>
      </form>

      <p className="mt-6 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">FIDO2 / WebAuthn (panel lock)</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Hardware-bound YubiKey 5 / Security Key. User verification (PIN) required — Yubico FIDO2 MFA.
        Cross-platform only (not a phone passkey). Enroll a backup.{" "}
        <a className="text-brand underline" href="https://developers.yubico.com/WebAuthn/" target="_blank" rel="noreferrer">
          developers.yubico.com/WebAuthn
        </a>
      </p>
      <ol className="mt-2 grid gap-2 sm:grid-cols-2">
        {(st?.webauthn ?? []).length ? (
          (st?.webauthn ?? []).map((k, i) => (
            <li key={k.id} className="rounded-md border border-rule bg-bg px-3 py-2">
              <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">FIDO2 {i + 1}</p>
              <p className="mt-1 font-mono text-sm text-up">{k.credentialId}</p>
            </li>
          ))
        ) : (
          <li className="rounded-md border border-rule bg-bg px-3 py-2">
            <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">FIDO2</p>
            <p className="mt-1 font-mono text-sm text-accent">none enrolled</p>
          </li>
        )}
      </ol>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="primary" disabled={busy || !fidoOk || fidoCount >= 4} onClick={() => void enrollFido()}>
          Enroll FIDO2 YubiKey
        </Button>
        {!fidoOk ? <p className="self-center text-xs text-muted">This browser has no WebAuthn.</p> : null}
      </div>

      <form
        className="mt-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void (async () => {
            setErr(null);
            setOk(null);
            const res = await removeYubi({ data: { token, current } });
            if (!res.ok) {
              setErr(res.error);
              return;
            }
            setCurrent("");
            log("yubi", "YubiKeys removed");
            setOk("YubiKeys removed. First-login protocol is open again — tap two keys.");
            await refresh();
          })();
        }}
      >
        <div className="min-w-48 flex-1">
          <label className="block text-sm" htmlFor="remove-yubi">
            Password to remove all YubiKeys
          </label>
          <input
            id="remove-yubi"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
            required
            disabled={!hasKey}
          />
        </div>
        <Button type="submit" disabled={!hasKey}>
          Remove all keys
        </Button>
      </form>
      {lockOn ? (
        <p className="mt-2 text-xs text-accent">Turn the panel lock off before removing the last physical key.</p>
      ) : null}

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <li>
          <a className="underline hover:text-fg" href="https://www.yubico.com/setup/" target="_blank" rel="noreferrer">
            Setup
          </a>
        </li>
        <li>
          <a className="underline hover:text-fg" href="https://www.yubico.com/products/how-the-yubikey-works/" target="_blank" rel="noreferrer">
            How the YubiKey works
          </a>
        </li>
        <li>
          <a className="underline hover:text-fg" href="https://developers.yubico.com/OTP/" target="_blank" rel="noreferrer">
            Yubico OTP
          </a>
        </li>
        <li>
          <a className="underline hover:text-fg" href="https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/Best_Practices.html" target="_blank" rel="noreferrer">
            WebAuthn best practices
          </a>
        </li>
      </ul>
      {err ? <p className="mt-2 text-sm text-down">{err}</p> : null}
      {ok ? <p className="mt-2 text-sm text-up">{ok}</p> : null}
    </Panel>
  );
}

function XRenewInAdmin() {
  return <XRenewWhenAdmin />;
}

function PasswordPanel({
  changeCreds,
  adminName,
  onSaved,
}: {
  changeCreds: (current: string, next: string, confirm: string, nextName: string) => Promise<string | null>;
  adminName: string;
  onSaved: () => void;
}) {
  const [nextName, setNextName] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  function guardPaste(e: ClipboardEvent<HTMLInputElement>) {
    const t = e.clipboardData.getData("text");
    if (looksLikeSecret(t)) {
      e.preventDefault();
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setOk(false);
    if (looksLikeSecret(current) || looksLikeSecret(next) || looksLikeSecret(nextName)) {
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
      return;
    }
    setBusy(true);
    setErr(null);
    const fail = await changeCreds(current, next, confirm, nextName);
    setBusy(false);
    if (fail) {
      setErr(fail);
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    setNextName("");
    setOk(true);
    onSaved();
  }

  return (
    <Panel kicker="Credentials" title="Change admin name / password">
      <p className="text-sm leading-relaxed text-muted">
        Current admin: <span className="font-mono text-fg">{adminName || "—"}</span>. Change name, password,
        or both. Current password is required. New password 12+ characters if you set one.
      </p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-4 space-y-3">
        <label className="block text-sm" htmlFor="new-admin">
          New admin name
        </label>
        <input
          id="new-admin"
          type="text"
          autoComplete="off"
          value={nextName}
          onChange={(e) => setNextName(e.target.value)}
          onPaste={guardPaste}
          placeholder={adminName || "leave blank to keep"}
          className="h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
          minLength={3}
          maxLength={32}
        />
        <label className="block text-sm" htmlFor="cur-pass">
          Current password
        </label>
        <input
          id="cur-pass"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
          required
        />
        <label className="block text-sm" htmlFor="new-pass">
          New password
        </label>
        <input
          id="new-pass"
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          onPaste={guardPaste}
          placeholder="leave blank to keep"
          className="h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
          minLength={12}
        />
        <label className="block text-sm" htmlFor="confirm-pass">
          Confirm new password
        </label>
        <input
          id="confirm-pass"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
          minLength={12}
        />
        {err ? <p className="text-sm text-down">{err}</p> : null}
        {ok ? <p className="text-sm text-up">Credentials updated. Session refreshed.</p> : null}
        <Button variant="primary" type="submit" disabled={busy}>
          Save credentials
        </Button>
      </form>
    </Panel>
  );
}

function UsersPanel() {
  const token = useOperator((s) => s.token);
  const log = useOperator((s) => s.log);
  const [users, setUsers] = useState<{ id: string; username: string; created_at: string }[]>([]);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await listDeskAccounts({ data: { token } });
    if (res.ok) setUsers(res.users);
  }

  useEffect(() => {
    if (!token) return;
    void refresh();
  }, [token]);

  function guardPaste(e: ClipboardEvent<HTMLInputElement>) {
    const t = e.clipboardData.getData("text");
    if (looksLikeSecret(t)) {
      e.preventDefault();
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (looksLikeSecret(username) || looksLikeSecret(pass)) {
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
      return;
    }
    setBusy(true);
    setErr(null);
    setOk(null);
    const res = await addDeskAccount({ data: { token, username, pass, confirm } });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    setUsername("");
    setPass("");
    setConfirm("");
    setOk(`Created ${res.username}. They can unlock the desk with this name and password.`);
    log("password", `Desk user created: ${res.username}`);
    await refresh();
  }

  return (
    <Panel kicker="Desk access" title="Create user accounts">
      <p className="text-sm leading-relaxed text-muted">
        Users you create can unlock Desk and L@B. They cannot open Admin, Paper, Wallet, Coin, Website, or Access.
        Paper, Wallet, or approve outgoing BTC/USDC.
      </p>
      <form onSubmit={(e) => void onCreate(e)} className="mt-4 space-y-3">
        <label className="block text-sm" htmlFor="desk-user">
          Username
        </label>
        <input
          id="desk-user"
          type="text"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
          minLength={3}
          maxLength={32}
          required
        />
        <label className="block text-sm" htmlFor="desk-pass">
          Password
        </label>
        <input
          id="desk-pass"
          type="password"
          autoComplete="new-password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
          minLength={12}
          required
        />
        <label className="block text-sm" htmlFor="desk-confirm">
          Confirm password
        </label>
        <input
          id="desk-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
          minLength={12}
          required
        />
        {err ? <p className="text-sm text-down">{err}</p> : null}
        {ok ? <p className="text-sm text-up">{ok}</p> : null}
        <Button variant="primary" type="submit" disabled={busy}>
          Create user
        </Button>
      </form>
      <ul className="mt-4 divide-y divide-rule">
        {users.length ? (
          users.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3 py-2">
              <span className="font-mono text-sm">{u.username}</span>
              <Button
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  setErr(null);
                  void (async () => {
                    const res = await deleteDeskAccount({ data: { token, id: u.id } });
                    setBusy(false);
                    if (!res.ok) {
                      setErr(res.error);
                      return;
                    }
                    log("password", `Desk user removed: ${u.username}`);
                    await refresh();
                  })();
                }}
              >
                Remove
              </Button>
            </li>
          ))
        ) : (
          <li className="py-2 text-sm text-muted">No desk users yet.</li>
        )}
      </ul>
    </Panel>
  );
}

function Stat({ kicker, value, hint }: { kicker: string; value: string; hint: string }) {
  const tone =
    kicker === "BTC" || kicker === "Profit BTC"
      ? BTC_TONE
      : kicker === "Cash" || kicker === "Paper NAV"
        ? USD_TONE
        : "";
  return (
    <div className="rounded-lg border border-rule bg-surface p-4">
      <p className={cn("font-mono text-[11px] tracking-[0.14em] uppercase", tone || "text-muted")}>{kicker}</p>
      <p className={cn("mt-2 font-mono text-xl tabular-nums", tone)}>{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
