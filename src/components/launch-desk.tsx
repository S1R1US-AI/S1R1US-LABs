import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "@tanstack/react-router";

import { DonateTrack } from "@/components/donate-track";
import { MintLaunchPanel } from "@/components/mint-launch";
import { SystemOverview } from "@/components/system-overview";
import { Button } from "@/components/ui/button";
import { Panel, Shell } from "@/components/shell";
import { loadDeskVault, secondFactorStatus } from "@/lib/desk/access";
import { APP_NAME, TAB_DESK, TAB_LAB } from "@/lib/brand";
import { LIVE_UNLOCKED } from "@/lib/desk/practice";
import { useOperator } from "@/lib/desk/operator";
import { BUDGET, CHECKLIST, COIN_CHAIN_REC, COIN_DISPLAY, COIN_DOMAIN, COIN_NAME_NOTE, COIN_STANDARD, COIN_TICKER, COMPANY_X_STEPS, DNS_STEPS, DOMAINS, FUND_INTEGRATION, FUND_LANES, GODADDY_IO, HOWEY_POSTURE, ICP_NOTE, LIQ_BANDS, MINT_STEPS, PLATFORM_ROWS, RH_NOTE, TIERS, TOKEN_LAUNCHED, TOKEN_UTILITY, type LaunchCheck } from "@/lib/launch/model";
import { ADMIN_X_HANDLE, ADMIN_X_LABEL, COMPANY_X_ART, COMPANY_X_AVATAR, COMPANY_X_BANNER, COMPANY_X_HANDLE, COMPANY_X_LABEL, COMPANY_X_NAME, COMPANY_X_URL } from "@/lib/desk/x-admin";
import { CompanyAvatar } from "@/components/company-x";
import { probeLaunch, type DomainProbe } from "@/lib/launch/probes";
import { probeSiteHealth, type SiteHealth } from "@/lib/launch/site-health";
import { GODADDY_DNS_ROWS, GODADDY_DNS_SKIP } from "@/lib/launch/godaddy-dns";
import { useLaunchChecks } from "@/lib/launch/store";
import { cn, USD_TONE } from "@/lib/utils";

function usd(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `$${n}`;
}

function usdRange(a: [number, number]) {
  if (a[0] === 0 && a[1] === 0) return "—";
  return a[0] === a[1] ? usd(a[0]) : `${usd(a[0])}–${usd(a[1])}`;
}

function sumRange(pick: "surviveUsd" | "fundUsd" | "tgeUsd"): [number, number] {
  return BUDGET.reduce<[number, number]>(
    (s, r) => [s[0] + r[pick][0], s[1] + r[pick][1]],
    [0, 0],
  );
}

export function LaunchPage() {
  const role = useOperator((s) => s.role);
  const unlocked = useOperator((s) => s.unlocked);
  if (!unlocked || role !== "admin") return <Navigate to="/" />;
  return (
    <Shell>
      <LaunchDesk />
    </Shell>
  );
}

export function LaunchDesk() {
  const role = useOperator((s) => s.role);
  const unlocked = useOperator((s) => s.unlocked);
  const done = useLaunchChecks((s) => s.done);
  const toggle = useLaunchChecks((s) => s.toggle);
  const reset = useLaunchChecks((s) => s.reset);
  const [probes, setProbes] = useState<DomainProbe[]>([]);
  const [at, setAt] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [yubiCount, setYubiCount] = useState(0);
  const [vaultOk, setVaultOk] = useState(false);
  const [health, setHealth] = useState<SiteHealth | null>(null);

  async function refresh() {
    setBusy(true);
    setErr(null);
    try {
      const token = useOperator.getState().token;
      if (!token) {
        setErr("Admin session required.");
        return;
      }
      const [p, y, v, h] = await Promise.all([
        probeLaunch({ data: { token } }),
        secondFactorStatus().catch(() => null),
        loadDeskVault({ data: { token } }).catch(() => null),
        probeSiteHealth({ data: { token } }).catch(() => null),
      ]);
      setProbes(p.domains);
      setAt(p.at);
      if (h) setHealth(h);
      if (y) setYubiCount(y.yubiCount ?? 0);
      setVaultOk(Boolean(v && v.ok && v.vault.profitAddress));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Launch probe failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (unlocked) void refresh();
  }, [unlocked]);

  const auto = useMemo(() => {
    const by = new Map(probes.map((d) => [d.name, d]));
    return { by, yubi: yubiCount >= 2, vault: vaultOk, lock: !LIVE_UNLOCKED };
  }, [probes, yubiCount, vaultOk]);

  function itemOn(c: LaunchCheck) {
    if (c.kind === "auto-domain" && c.domain) {
      const d = auto.by.get(c.domain);
      return d ? d.available === false : false;
    }
    if (c.kind === "auto-yubi") return auto.yubi;
    if (c.kind === "auto-vault") return auto.vault;
    if (c.kind === "auto-lock") return auto.lock;
    return Boolean(done[c.id]);
  }

  const req = CHECKLIST.filter((c) => c.required);
  const reqOn = req.filter(itemOn).length;
  const allOn = CHECKLIST.filter(itemOn).length;
  if (!unlocked || role !== "admin") return null;

  const phases = [...new Set(CHECKLIST.map((c) => c.phase))];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Marketing ticker · Path A</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
        s1r1us — not the desk
      </h1>

      <MintLaunchPanel />
      <SystemOverview showRoadmap />

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
        Path A is locked. <span className="font-mono text-fg">{COIN_TICKER}</span> is a marketing ticker — not{" "}
        {APP_NAME}, not {TAB_DESK}, not how bot 7 buys bitcoin. Desk book = operator cash + gifts that get
        nothing back. Same admin door. Bot 7 never trades this ticker. TOKEN_LAUNCHED ={" "}
        {TOKEN_LAUNCHED ? "true" : "false"}.
      </p>
      <div className="mt-6">
        <DonateTrack compact />
      </div>
      {err ? <p className="mt-3 text-sm text-down">{err}</p> : null}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button onClick={() => void refresh()} disabled={busy}>
          {busy ? "Probing…" : "Refresh live checks"}
        </Button>
        <p className="text-xs text-muted">
          {at ? `DNS ${new Date(at).toLocaleString()}` : "Waiting on Cloudflare DNS…"}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kicker k="Token" v={COIN_TICKER} hint="lowercase name + ticker" />
        <Kicker k="Domain" v={COIN_DOMAIN} hint="GoDaddy .ai" />
        <Kicker k="Tape" v={TAB_DESK} hint={TAB_LAB} />
        <Kicker k="Standard" v="pump.fun" hint={COIN_CHAIN_REC} />
        <Kicker
          k="Go-live"
          v={`${reqOn}/${req.length}`}
          hint={`${allOn}/${CHECKLIST.length} all boxes · required`}
          tone={reqOn === req.length ? "text-up" : "text-medium"}
        />
      </div>

      <Panel className="mt-4" kicker="Funding" title="Path A — desk gifts vs marketing ticker">
        <p className="text-sm text-muted">{FUND_INTEGRATION}</p>
        <p className="mt-3 text-sm text-fg">{TOKEN_UTILITY.oneLiner}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{TOKEN_UTILITY.howey}</p>
        <p className="mt-3 text-sm font-medium text-fg">{HOWEY_POSTURE.problem}</p>
        <ul className="mt-2 space-y-3">
          {HOWEY_POSTURE.paths.map((p) => (
            <li key={p.id}>
              <p className={cn("text-sm", p.id === HOWEY_POSTURE.chosen ? "font-medium text-high" : "text-muted")}>
                {p.id === HOWEY_POSTURE.chosen ? p.name : `${p.name} · not chosen`}
              </p>
              {p.id === HOWEY_POSTURE.chosen ? (
                <p className="text-xs leading-relaxed text-muted">{p.does}</p>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Do not say: {HOWEY_POSTURE.forbiddenPitch.join(" · ")}.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
                <th className="py-2 pr-3">Lane</th>
                <th className="py-2 pr-3">Kind</th>
                <th className="py-2 pr-3">Size</th>
                <th className="py-2 pr-3">Maps to</th>
                <th className="py-2 pr-3">Honest odds</th>
              </tr>
            </thead>
            <tbody>
              {FUND_LANES.map((f) => (
                <tr key={f.id} className="border-b border-rule/70 align-top">
                  <td className="py-2 pr-3">
                    <span className="font-medium text-fg">{f.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">{f.how}</span>
                  </td>
                  <td className="py-2 pr-3 font-mono text-[11px] uppercase text-muted">{f.kind}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{f.size}</td>
                  <td className="py-2 pr-3 text-xs">{f.mapsTo}</td>
                  <td className="py-2 pr-3 text-xs text-muted">{f.odds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-fg">Liquidity to launch vs stabilize (90 days)</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
                <th className="py-2 pr-3">Band</th>
                <th className="py-2 pr-3">Launch (you spend)</th>
                <th className="py-2 pr-3">Stabilize</th>
                <th className="py-2 pr-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {LIQ_BANDS.map((b) => (
                <tr key={b.id} className="border-b border-rule/70 align-top">
                  <td className="py-2 pr-3 font-medium">{b.name}</td>
                  <td className={cn("py-2 pr-3 font-mono text-xs", USD_TONE)}>{b.launchUsd}</td>
                  <td className={cn("py-2 pr-3 font-mono text-xs", USD_TONE)}>{b.stabilizeUsd}</td>
                  <td className="py-2 pr-3 text-xs text-muted">{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="mt-4" kicker="Mint" title="How the marketing ticker is created — not the desk book">
        <p className="text-sm text-fg">
          Pick <span className="font-medium">pump.fun on Solana, USDC curve</span>. Create is $0. Retail
          buys the curve. You do not deposit $150k to open a book. Do not tell anyone the token funds
          BTC clips. Desk stacks from operator cash and gifts with nothing back. Locked LP stays LP.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          {MINT_STEPS.map((s) => (
            <li key={s.slice(0, 40)} className="text-fg">
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
                <th className="py-2 pr-3">Venue</th>
                <th className="py-2 pr-3">Retail / viral</th>
                <th className="py-2 pr-3">Launch cost</th>
                <th className="py-2 pr-3">Pair with USDC/BTC</th>
                <th className="py-2 pr-3">Call</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORM_ROWS.map((r) => (
                <tr key={r.id} className="border-b border-rule/70 align-top">
                  <td className={cn("py-2 pr-3 font-medium", r.pick && "text-up")}>{r.name}</td>
                  <td className="py-2 pr-3">{r.viral}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{r.launchUsd}</td>
                  <td className="py-2 pr-3 text-xs">{r.pair}</td>
                  <td className="py-2 pr-3 text-xs text-muted">{r.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">{RH_NOTE}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{ICP_NOTE}</p>
      </Panel>

      <Panel className="mt-4" kicker="Identity" title="Name + domains">
        <p className="text-sm text-muted">
          Token: <span className="font-mono text-fg">{COIN_TICKER}</span>. {COIN_NAME_NOTE} {COIN_STANDARD}.
          Canonical host <span className="font-mono text-fg">{COIN_DOMAIN}</span>. S1R1U$.io is not a
          legal hostname.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
                <th className="py-2 pr-3">Domain</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Live DNS</th>
                <th className="py-2 pr-3">GoDaddy</th>
              </tr>
            </thead>
            <tbody>
              {DOMAINS.map((d) => {
                const p = probes.find((x) => x.name === d.name);
                const avail = p?.available;
                return (
                  <tr key={d.name} className="border-b border-rule/70">
                    <td className="py-2 pr-3 font-mono text-fg">{d.name}</td>
                    <td className="py-2 pr-3 text-muted">{d.role}</td>
                    <td
                      className={cn(
                        "py-2 pr-3 font-mono text-xs",
                        avail === true && "text-up",
                        avail === false && "text-down",
                        avail == null && "text-muted",
                      )}
                    >
                      {p ? p.status : "…"}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted">
                      {d.name.endsWith(".ai") || d.name.endsWith(".xyz") || d.name.endsWith(".io")
                        ? avail === true
                          ? `Register ~$${GODADDY_IO.renewalUsd}/yr`
                          : avail === false
                            ? "Taken — aftermarket"
                            : "—"
                        : avail === false
                          ? "Taken (NS live)"
                          : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          {GODADDY_IO.promoNote}. Renewal ${GODADDY_IO.renewalUsd}. {GODADDY_IO.privacy}.{" "}
          <a className="underline" href={GODADDY_IO.buy} target="_blank" rel="noreferrer">
            GoDaddy .ai
          </a>
          . Probe: NXDOMAIN = not in DNS yet; Registered = you own it (refresh after nameservers
          publish). Premium carts can still lie — you already bought s1r1us.ai.
        </p>
      </Panel>

      <Panel className="mt-4" kicker="DNS" title="Lock the name — do not Airo the site">
        <p className="text-sm text-muted">
          Set DNS/lock first. Do not build the public site with GoDaddy AI. I can ship a static
          s1r1us.ai page in this project when you want it — disclaimer, ticker, X, deposit
          watch-only. Not the admin desk.
        </p>
        {health ? (
          <div className="mt-4 rounded-md border border-rule p-3 font-mono text-xs">
            <p className="text-fg">{health.verdict}</p>
            <p className="mt-2 text-muted">A {health.apexA.join(" ") || "—"}</p>
            <p className="text-muted">www {health.wwwCname.join(" ") || "—"}</p>
            <p className="text-muted">HTTP {health.http.status} {health.http.body.slice(0, 80)}</p>
            <p className="text-muted">TLS {health.tls}</p>
          </div>
        ) : null}
        <p className="mt-4 text-sm text-fg">
          To put this tape on s1r1us.ai: in Grok use <span className="font-medium">Publish</span>{" "}
          (you get a grok.me link), then <span className="font-medium">custom domain</span> → add
          s1r1us.ai. Copy the records Grok shows. Leave the current A/CNAME until then — they
          already reach Vercel; SSL stays invalid until the domain is attached.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          {DNS_STEPS.map((s) => (
            <li key={s.slice(0, 48)} className="text-fg">
              {s}
            </li>
          ))}
        </ol>
        <p className="mt-6 font-mono text-xs tracking-[0.12em] text-muted uppercase">
          GoDaddy → s1r1us.ai → DNS → Records
        </p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Value</th>
                <th className="py-2 pr-3">TTL</th>
                <th className="py-2 pr-3">Use</th>
              </tr>
            </thead>
            <tbody>
              {GODADDY_DNS_ROWS.map((r) => (
                <tr key={`${r.type}-${r.name}-${r.value}`} className="border-b border-rule/70 align-top">
                  <td className="py-2 pr-3 font-mono">{r.type}</td>
                  <td className="py-2 pr-3 font-mono">{r.name}</td>
                  <td className="py-2 pr-3 font-mono text-fg">{r.value}</td>
                  <td className="py-2 pr-3 font-mono">{r.ttl}</td>
                  <td className="py-2 pr-3 text-xs text-muted">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted">
          {GODADDY_DNS_SKIP.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          Public page path after DNS works: <span className="font-mono text-fg">https://s1r1us.ai/s1r1us</span>
        </p>
        <Link
          to="/s1r1us"
          className="mt-4 inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6"
        >
          Open s1r1us.ai page
        </Link>
      </Panel>

      <Panel className="mt-4" kicker="X" title={`${COMPANY_X_LABEL} company account`}>
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex flex-col items-center gap-2">
            <CompanyAvatar size={96} className="h-24 w-24 ring-1 ring-rule" />
            <p className="font-mono text-[11px] text-muted">profile pic</p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">
              New company account under {ADMIN_X_LABEL}. Display{" "}
              <span className="text-fg">{COMPANY_X_NAME}</span>
              {COMPANY_X_HANDLE ? (
                <>
                  , handle <span className="font-mono text-fg">{COMPANY_X_HANDLE}</span>
                </>
              ) : (
                <>. You pick the handle ($ is not allowed on X)</>
              )}
              . This login cannot open Admin, Wallet, or copy outgoing BTC/USDC. Operator stays {ADMIN_X_HANDLE}.
            </p>
            <img
              src={COMPANY_X_BANNER}
              alt={`${COMPANY_X_NAME} X header`}
              className="mt-3 w-full max-w-xl rounded-md border border-rule object-cover"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={COMPANY_X_AVATAR}
                download="S1R1US-avatar.jpg"
                className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6"
              >
                Download avatar
              </a>
              <a
                href={COMPANY_X_BANNER}
                download="S1R1US-banner.jpg"
                className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6"
              >
                Download header
              </a>
              <a
                href={COMPANY_X_ART}
                download="S1R1US-art.png"
                className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6"
              >
                Full frame
              </a>
            </div>
          </div>
        </div>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          {COMPANY_X_STEPS.map((s) => (
            <li key={s} className="text-fg">
              {s}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">
          {COMPANY_X_URL ? (
            <>
              After you create it, open{" "}
              <a className="underline" href={COMPANY_X_URL} target="_blank" rel="noreferrer">
                {COMPANY_X_URL}
              </a>
              . Upload the avatar (400×400) and header (1500×500) on X.{" "}
            </>
          ) : (
            <>Pick the handle on X, then tell this desk. </>
          )}
          Tick the Identity boxes when the handle is live and the parent has pinned it. This desk
          cannot create the X account — only {ADMIN_X_HANDLE} can.
        </p>
      </Panel>

      <Panel className="mt-4" kicker="Capital" title="What it actually costs to fund the book">
        <div className="grid gap-3 sm:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.id} className="rounded-md border border-rule p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{t.name}</p>
              <p className={cn("mt-1 font-mono text-lg tabular-nums", USD_TONE)}>{t.range}</p>
              <p className="mt-1 text-xs text-muted">{t.netToBook}</p>
              <p className="mt-2 text-sm text-fg">{t.verdict}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
                <th className="py-2 pr-3">Line</th>
                <th className="py-2 pr-3 text-right">Survive</th>
                <th className="py-2 pr-3 text-right">Fund $25k book</th>
                <th className="py-2 pr-3 text-right">TGE</th>
                <th className="py-2 pr-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET.map((r) => (
                <tr key={r.id} className="border-b border-rule/70 align-top">
                  <td className="py-2 pr-3">
                    {r.item}
                    {r.recoverable ? <span className="block text-[11px] text-muted">inventory</span> : null}
                  </td>
                  <td className="py-2 pr-3 text-right font-mono tabular-nums">{usdRange(r.surviveUsd)}</td>
                  <td className={cn("py-2 pr-3 text-right font-mono tabular-nums", USD_TONE)}>
                    {usdRange(r.fundUsd)}
                  </td>
                  <td className="py-2 pr-3 text-right font-mono tabular-nums">{usdRange(r.tgeUsd)}</td>
                  <td className="py-2 pr-3 text-xs text-muted">{r.note}</td>
                </tr>
              ))}
              <tr className="font-medium">
                <td className="py-2 pr-3">Total committed</td>
                <td className="py-2 pr-3 text-right font-mono">{usdRange(sumRange("surviveUsd"))}</td>
                <td className={cn("py-2 pr-3 text-right font-mono", USD_TONE)}>
                  {usdRange(sumRange("fundUsd"))}
                </td>
                <td className="py-2 pr-3 text-right font-mono">{usdRange(sumRange("tgeUsd"))}</td>
                <td className="py-2 pr-3 text-xs text-muted">LP is held, not spent — until it dumps.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          Figures are 2026 street ranges. pump.fun mint is $0 — do not budget $150k as seed LP.
          SuperGrok stays the only paid data service on the trading desk. Token legal is a different bill.
        </p>
      </Panel>

      <Panel className="mt-4" kicker="Go live" title="Checklist — live on refresh">
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-rule">
          <div
            className="h-full bg-high"
            style={{ width: `${Math.round((reqOn / Math.max(req.length, 1)) * 100)}%` }}
          />
        </div>
        {phases.map((phase) => (
          <div key={phase} className="mb-4">
            <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{phase}</p>
            <ul className="mt-2 space-y-2">
              {CHECKLIST.filter((c) => c.phase === phase).map((c) => {
                const on = itemOn(c);
                const auto = c.kind !== "manual";
                return (
                  <li key={c.id} className="rounded-md border border-rule px-3 py-2">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={on}
                        disabled={auto}
                        onChange={() => toggle(c.id)}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-2">
                          <span className={cn("text-sm font-medium", on ? "text-up" : "text-fg")}>
                            {c.label}
                          </span>
                          <span className="text-[11px] text-muted">
                            {auto ? "live probe" : "operator"}
                            {c.required ? " · required" : ""}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">{c.detail}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <Button variant="ghost" onClick={reset}>
          Clear operator ticks
        </Button>
      </Panel>
    </main>
  );
}

function Kicker({
  k,
  v,
  hint,
  tone,
}: {
  k: string;
  v: string;
  hint: string;
  tone?: string;
}) {
  return (
    <div className="rounded-md border border-rule p-3">
      <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{k}</p>
      <p className={cn("mt-1 font-mono text-lg tabular-nums", tone)}>{v}</p>
      <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">{hint}</p>
    </div>
  );
}
