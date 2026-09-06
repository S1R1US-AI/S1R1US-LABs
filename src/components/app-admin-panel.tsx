import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, LogOut, RefreshCw } from "lucide-react";
import { AskGrokPanel } from "@/components/ask-grok-panel";
import { Lock3dStatusPanel } from "@/components/lock3d-status";
import { money, CallWords } from "@/components/helios-card";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/shell";
import { TAB_BOARD, TAB_COMPUTE, TAB_HIVE } from "@/lib/brand";
import { BoardPlayPanel } from "@/components/board-play-panel";
import { HiveAdminPanel } from "@/components/hive-admin-panel";
import { HiveSwarmLabel } from "@/components/godzilla-mark";
import { useAppAdmin } from "@/lib/desk/app-admin-client";
import { APP_ADMIN_KIND_LABEL, APP_ADMIN_KINDS, APP_ADMIN_PATH, combineCompute } from "@/lib/desk/tenancy";
import { peekDeskTape, useDeskTape } from "@/lib/desk/tape-client";
import { STARTING_CASH, usePaper } from "@/lib/desk/store";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { cn } from "@/lib/utils";

type Tab = "console" | "wallet" | "paper" | "coin" | "website" | "access" | "security" | "bowl" | "hive";

export function AppAdminPanel() {
  const unlocked = useAppAdmin((s) => s.unlocked);
  const you = useAppAdmin((s) => s.you);
  const refresh = useAppAdmin((s) => s.refresh);
  const lock = useAppAdmin((s) => s.lock);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("console");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted) void refresh();
  }, [mounted, refresh]);

  if (!mounted) {
    return (
      <Shell>
        <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
          <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">login</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">Admin</h1>
        </main>
      </Shell>
    );
  }

  if (!unlocked || !you) return <ClaimForm />;

  return (
    <Shell
      right={
        <Button onClick={() => lock()} aria-label="Logout">
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      }
    >
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Your desk</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">Admin</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {you.label} · {APP_ADMIN_KIND_LABEL[you.kind]} @{you.handle}. Tape, paper, {TAB_COMPUTE}, {TAB_BOARD}, SUP3R B0WL, {TAB_HIVE}.
          Accumulate bitcoin. Never sell. Never short.
        </p>
        <nav className="desk-tabs mt-5 flex flex-wrap gap-1" aria-label="Admin sections">
          {(
            [
              ["console", "Console"],
              ["wallet", "Wallet"],
              ["paper", "Paper"],
              ["coin", "Coin"],
              ["website", "Website"],
              ["access", "Access"],
              ["security", "Security"],
              ["bowl", "SUP3R B0WL"],
              ["hive", "H1V3 SW@RM"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={cn("inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium", tab === id && "is-on", id === "hive" && "hive-nav")}
              onClick={() => setTab(id)}
            >
              {id === "hive" ? <HiveSwarmLabel className="text-sm" /> : label}
            </button>
          ))}
        </nav>
        {tab === "console" ? <ConsolePane /> : null}
        {tab === "wallet" ? <WalletPane /> : null}
        {tab === "paper" ? <PaperPane /> : null}
        {tab === "coin" ? <CoinPane /> : null}
        {tab === "website" ? <WebsitePane /> : null}
        {tab === "access" ? <AccessPane /> : null}
        {tab === "security" ? <SecurityPane /> : null}
        {tab === "bowl" ? (
          <BoardPlayPanel
            plane="app"
            defaultName={you.handle}
            defaultKind={you.kind}
            defaultHandle={you.handle}
          />
        ) : null}
        {tab === "hive" ? <HivePane /> : null}
      </main>
    </Shell>
  );
}

function ClaimForm() {
  const claim = useAppAdmin((s) => s.claim);
  const [kind, setKind] = useState("iphone");
  const [handle, setHandle] = useState("");
  const [label, setLabel] = useState("");
  const [mandate, setMandate] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fail = await claim({ kind, handle, label, mandate });
    setBusy(false);
    if (fail) setErr(fail);
  }

  return (
    <Shell>
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">login</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">Admin</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Unlock Admin on this downloaded desk. Use your X, Claude, AI agent, Apple, Google, or iPhone name.
          Mandate: accumulate bitcoin. Never sell. Never short.
        </p>
        <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-3">
          <label className="block text-sm" htmlFor="aa-kind">
            Account
          </label>
          <select
            id="aa-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
          >
            {APP_ADMIN_KINDS.map((k) => (
              <option key={k} value={k}>
                {APP_ADMIN_KIND_LABEL[k]}
              </option>
            ))}
          </select>
          <label className="block text-sm" htmlFor="aa-handle">
            Name or handle
          </label>
          <input
            id="aa-handle"
            type="text"
            autoComplete="username"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
            required
            minLength={2}
            maxLength={32}
          />
          <label className="block text-sm" htmlFor="aa-label">
            Desk label
          </label>
          <input
            id="aa-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
            placeholder="My desk"
            maxLength={40}
          />
          <label className="flex items-start gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={mandate}
              onChange={(e) => setMandate(e.target.checked)}
              className="mt-1"
            />
            I will accumulate bitcoin. I will never sell bitcoin. I will never short bitcoin.
          </label>
          {err ? <p className="text-sm text-down">{err}</p> : null}
          <Button variant="primary" type="submit" disabled={busy || !mandate} className="w-full">
            <Lock className="size-4" />
            Unlock Admin
          </Button>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          This is Admin of <span className="text-fg">your</span> iOS / Google copy at {APP_ADMIN_PATH}. Same tape,
          paper, and {TAB_COMPUTE} as the main desk.
        </p>
      </main>
    </Shell>
  );
}

function ConsolePane() {
  const { snap, refresh } = useDeskTape();
  const cash = usePaper((s) => s.cashUsd);
  const btc = usePaper((s) => s.btc);
  const profitBtc = usePaper((s) => s.profitBtc);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("ACCUMULATE");
  const [online, setOnline] = useState("ACCUMULATE");
  const combined = combineCompute(phone, online);
  const px = snap?.btc.price ?? 0;
  const nav = cash + (btc + (profitBtc ?? 0)) * px;
  const call = snap ? heliosCall(snap, runBots(snap), nav || 1000) : null;

  async function reload() {
    setLoading(true);
    try {
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!snap) void peekDeskTape();
  }, [snap]);

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <section className="lg:col-span-2">
        <Lock3dStatusPanel className="mt-0" />
      </section>
      <section className="rounded-lg border border-rule bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">7-B0T tape</p>
          <Button onClick={() => void reload()} disabled={loading} aria-label="Refresh tape">
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
        {call ? (
          <p className="mt-3 text-sm">
            <CallWords call={{ stance: call.stance, conviction: call.conviction }} /> · clip {money(call.clipUsd)}
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted">Reading tape…</p>
        )}
        <p className="mt-2 font-mono text-sm text-fg">
          BTC {px ? money(px) : "—"} · paper NAV {money(nav)}
        </p>
      </section>
      <section className="rounded-lg border border-rule bg-surface p-4 sm:p-5">
        <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">{TAB_COMPUTE} · combine</p>
        <h2 className="mt-1 text-base font-semibold text-fg">Phone + online</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Grade 7-B0T on this phone (Apple Intelligence / Gemini) and with your online key. Both must ACCUMULATE
          to ACCUMULATE. Else WAIT. Never sell.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block text-xs tracking-[0.12em] text-muted uppercase">
            Phone
            <select
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 min-h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
            >
              <option>ACCUMULATE</option>
              <option>BUY</option>
              <option>HOLD</option>
              <option>WAIT</option>
            </select>
          </label>
          <label className="block text-xs tracking-[0.12em] text-muted uppercase">
            Online
            <select
              value={online}
              onChange={(e) => setOnline(e.target.value)}
              className="mt-1 min-h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg"
            >
              <option>ACCUMULATE</option>
              <option>BUY</option>
              <option>HOLD</option>
              <option>WAIT</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm font-medium text-medium">Combined: {combined}</p>
      </section>
      <section className="lg:col-span-2">
        <AskGrokPanel kicker="BYO online" />
      </section>
    </div>
  );
}

function WalletPane() {
  const cash = usePaper((s) => s.cashUsd);
  const btc = usePaper((s) => s.btc);
  const profitBtc = usePaper((s) => s.profitBtc);
  const fills = usePaper((s) => s.fills);
  const reset = usePaper((s) => s.reset);
  return (
    <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Wallet</p>
      <h2 className="mt-1 text-base font-semibold text-fg">Your paper book</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Paper cash {money(cash)} · BTC {btc.toFixed(6)} · profit BTC {(profitBtc ?? 0).toFixed(6)}. Starting cash{" "}
        {money(STARTING_CASH)}. Live Coinbase create stays off. Keys stay on your phone or online service — never
        here.
      </p>
      <p className="mt-2 text-sm text-muted">{fills.length} paper fills on this device.</p>
      <Button className="mt-4" type="button" onClick={() => reset()}>
        Reset paper
      </Button>
    </section>
  );
}

function PaperPane() {
  return (
    <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Paper</p>
      <h2 className="mt-1 text-base font-semibold text-fg">Operating mandate</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
        <li>Maximize bitcoin accumulation.</li>
        <li>Never sell bitcoin. Never short.</li>
        <li>Grade 7-B0T on your phone and/or your online key, then tick {TAB_BOARD}.</li>
        <li>Paper fills use Coinbase last. This desk never places a live order.</li>
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Device paper book only. The host research paper and championship simulation pause stay on s1r1us.ai system Admin.
        This copy cannot pause World Cup / C@LL 0UT simulation. Pause {TAB_HIVE} from the {TAB_HIVE} tab.
      </p>
    </section>
  );
}

function CoinPane() {
  return (
    <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Coin</p>
      <h2 className="mt-1 text-base font-semibold text-fg">Ticker notes</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        7-B0T never trades a cultural ticker. Notes stay educational. Your book is bitcoin only.
      </p>
    </section>
  );
}

function WebsitePane() {
  return (
    <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Website</p>
      <h2 className="mt-1 text-base font-semibold text-fg">Public tape</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Same public surfaces as the laptop desk. Open them from this phone.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/" className="inline-flex h-10 items-center rounded-md border border-rule px-3 text-sm text-tab hover:underline">
          Live Tape
        </Link>
        <Link to="/board" className="inline-flex h-10 items-center rounded-md border border-rule px-3 text-sm text-tab hover:underline">
          {TAB_BOARD}
        </Link>
        <Link to="/compute" className="inline-flex h-10 items-center rounded-md border border-rule px-3 text-sm text-tab hover:underline">
          {TAB_COMPUTE}
        </Link>
        <Link to="/app" className="inline-flex h-10 items-center rounded-md border border-rule px-3 text-sm text-tab hover:underline">
          iOS · Google app
        </Link>
      </div>
    </section>
  );
}

function AccessPane() {
  const you = useAppAdmin((s) => s.you);
  if (!you) return null;
  return (
    <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Access</p>
      <h2 className="mt-1 text-base font-semibold text-fg">Your Admin identity</h2>
      <dl className="mt-3 grid gap-2 text-sm">
        <div>
          <dt className="text-muted">Account</dt>
          <dd className="font-mono text-fg">
            {APP_ADMIN_KIND_LABEL[you.kind]} · @{you.handle}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Desk</dt>
          <dd className="text-fg">{you.label}</dd>
        </div>
        <div>
          <dt className="text-muted">Opened</dt>
          <dd className="font-mono text-fg">{you.at}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-muted">
        Session lives in this browser. BYO compute keys stay in sessionStorage on this device.
      </p>
    </section>
  );
}

function SecurityPane() {
  const lock = useAppAdmin((s) => s.lock);
  const token = useAppAdmin((s) => s.token);
  return (
    <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Security</p>
      <h2 className="mt-1 text-base font-semibold text-fg">Your copy</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Lock this Admin session. Paper only. Never paste Coinbase keys or wallet seeds. Combine phone compute with
        an online key — both ACCUMULATE or WAIT. Copy-admin is a device-bound HMAC session (12h) plus mandate — not
        system 2FA. Host Yubi / FIDO2 stay on s1r1us.ai /admin. Compete on SUP3R B0WL from the SUP3R B0WL tab with a
        separate board token. Pause {TAB_HIVE} from this panel — championship World Cup pause stays on s1r1us.ai system
        Admin.
      </p>
      {token ? <HiveAdminPanel token={token} /> : null}
      <Button className="mt-4" type="button" onClick={() => lock()}>
        <LogOut className="size-4" />
        Lock Admin
      </Button>
    </section>
  );
}

function HivePane() {
  const token = useAppAdmin((s) => s.token);
  return (
    <section className="mt-6">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">{TAB_HIVE}</p>
      <h2 className="mt-1 text-base font-semibold text-fg">Combine BYO compute</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Phone-app Admin may pause or continue the paper hive. TEST data until go-live. Most TH/s pledged is listed
        below. This copy cannot open s1r1us.ai /admin, Yubi, or vault.
      </p>
      {token ? <HiveAdminPanel token={token} /> : null}
    </section>
  );
}
