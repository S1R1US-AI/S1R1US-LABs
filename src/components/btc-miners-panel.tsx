import { useEffect, useMemo, useState } from "react";
import { Pickaxe, RefreshCw, Save } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Panel } from "@/components/shell";
import { Button } from "@/components/ui/button";
import {
  bucketMinerSamples,
  ckpoolStatsUrl,
  fmtThs,
  MINER_TIMEFRAMES,
  MINERS_DEFAULT_ADDRESS,
  MINERS_DEFAULT_BACKUP,
  MINERS_DEFAULT_STRATUM,
  MINERS_DISCLAIMER,
  MINERS_INSTRUCTIONS,
  MINERS_PASSWORD_NOTE,
  MINERS_STRATUM_SCHEME,
  minerAddressError,
  SEO_TAB_MINERS,
  stratumError,
  stratumUrl,
  TAB_MINERS,
  type MinerTimeframe,
} from "@/lib/desk/btc-miners";
import { fetchBtcMiners, saveBtcMiners } from "@/lib/desk/miner-rpc";
import { cn } from "@/lib/utils";

/** Pro trading desk palette: bright green tape, yellow + blue contrasts. */
const HASH_GREEN = "#39ff14";
const HASH_YELLOW = "#ffd024";
const HASH_BLUE = "#38bdf8";

type MinersRes =
  | Awaited<ReturnType<typeof fetchBtcMiners>>
  | Awaited<ReturnType<typeof saveBtcMiners>>;
type MinersView = NonNullable<MinersRes["view"]>;

function fmtAgo(sec: number | null | undefined): string {
  const s = Number(sec);
  if (!Number.isFinite(s) || s <= 0) return "—";
  const d = Math.floor(Date.now() / 1000) - s;
  if (d < 0) return "now";
  if (d < 90) return `${d}s ago`;
  if (d < 5400) return `${Math.round(d / 60)}m ago`;
  if (d < 172800) return `${Math.round(d / 3600)}h ago`;
  return `${Math.round(d / 86400)}d ago`;
}

function fmtShare(n: number | null | undefined): string {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "—";
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toLocaleString("en-US");
}

export function BtcMinersPanel({ token }: { token: string }) {
  const [view, setView] = useState<MinersView | null>(null);
  const [scope, setScope] = useState<"system" | "app" | null>(null);
  const [stratum, setStratum] = useState("");
  const [backup, setBackup] = useState("");
  const [address, setAddress] = useState("");
  const [frame, setFrame] = useState<MinerTimeframe>("day");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function applyRes(res: MinersRes) {
    if (!res.ok || !res.view || !res.config) {
      setErr(res.error ?? `Could not load ${TAB_MINERS}`);
      return;
    }
    setErr(null);
    setScope(res.scope);
    setView(res.view);
    setStratum(res.config.stratum);
    setBackup(res.config.backup);
    setAddress(res.config.address);
  }

  async function load() {
    if (!token) return;
    setBusy(true);
    try {
      applyRes(await fetchBtcMiners({ data: { token } }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : `Could not load ${TAB_MINERS}`);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function save() {
    if (!token) return;
    setBusy(true);
    setSaved(null);
    try {
      const res = await saveBtcMiners({ data: { token, config: { stratum, backup, address } } });
      applyRes(res);
      if (res.ok) {
        setSaved(
          stratum.trim() || backup.trim() || address.trim()
            ? `Saved — ${TAB_MINERS} data and view rebuilt for your stratum.`
            : "Saved blank — S1R1US.ai CKPool data populated the dialogue boxes.",
        );
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const stats = view?.stats ?? null;
  const active = Boolean(view?.active);
  const graph = useMemo(() => bucketMinerSamples(view?.samples ?? [], frame), [view?.samples, frame]);
  const stratumBad = stratumError(stratum);
  const backupBad = stratumError(backup);
  const addressBad = minerAddressError(address);

  return (
    <div className="mt-6 space-y-4">
      <Panel
        kicker={`${TAB_MINERS} · ${SEO_TAB_MINERS}`}
        title={
          <span className="inline-flex items-center gap-2">
            <Pickaxe className="size-5" style={{ color: HASH_GREEN }} />
            {active ? "ACTIVE on solo CKPool" : "IDLE — waiting for shares on solo CKPool"}
          </span>
        }
        kickerClass="text-high"
        titleClass={active ? "text-high" : "text-medium"}
      >
        <p className="text-sm leading-relaxed text-muted">
          Free public data for{" "}
          <a href={view?.statsUrl ?? ckpoolStatsUrl(MINERS_DEFAULT_ADDRESS)} target="_blank" rel="noreferrer" className="font-mono text-oss hover:underline">
            {view?.statsUrl ?? ckpoolStatsUrl(MINERS_DEFAULT_ADDRESS)}
          </a>
          . Miner data populates this view when the miners are active on the CK pool. Built from the ckpool.org docs.
        </p>
        {err ? <p className="mt-2 text-sm text-down">{err}</p> : null}
        {view?.error && !err ? <p className="mt-2 text-sm text-medium">{view.error}</p> : null}

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <MinerMetric label="Hash 1m" value={fmtThs(view?.ths.m1)} color={HASH_GREEN} />
          <MinerMetric label="Hash 5m" value={fmtThs(view?.ths.m5)} color={HASH_YELLOW} />
          <MinerMetric label="Hash 1hr" value={fmtThs(view?.ths.h1)} color={HASH_BLUE} />
          <MinerMetric label="Hash 1d" value={fmtThs(view?.ths.d1)} />
          <MinerMetric label="Hash 7d" value={fmtThs(view?.ths.d7)} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs sm:grid-cols-5">
          <div>
            <dt className="text-muted">Workers</dt>
            <dd className="text-fg">{stats ? stats.workers.toLocaleString("en-US") : "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Last share</dt>
            <dd className={active ? "text-high" : "text-medium"}>{fmtAgo(stats?.lastshare)}</dd>
          </div>
          <div>
            <dt className="text-muted">Shares</dt>
            <dd className="text-fg">{fmtShare(stats?.shares)}</dd>
          </div>
          <div>
            <dt className="text-muted">Best share</dt>
            <dd className="text-fg">{fmtShare(stats?.bestshare)}</dd>
          </div>
          <div>
            <dt className="text-muted">Best ever</dt>
            <dd className="text-fg">{fmtShare(stats?.bestever)}</dd>
          </div>
        </dl>
      </Panel>

      <Panel kicker="Hash power" title="Oscillating hash power — bright green tape" kickerClass="text-high" titleClass="text-high">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <label className="font-mono text-xs text-muted">
            Time frame
            <select
              className="mt-1 block min-h-11 rounded-md border border-rule bg-bg px-2 py-1 text-fg"
              value={frame}
              onChange={(e) => setFrame(e.target.value as MinerTimeframe)}
              aria-label="Hash power graph time frame"
            >
              {MINER_TIMEFRAMES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-3 font-mono text-[11px]">
            <span style={{ color: HASH_GREEN }}>■ 1m hash</span>
            <span style={{ color: HASH_YELLOW }}>■ 5m avg</span>
            <span style={{ color: HASH_BLUE }}>■ 1hr avg</span>
          </div>
        </div>
        {graph.length > 1 ? (
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={graph} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="minerHashFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={HASH_GREEN} stopOpacity={0.55} />
                    <stop offset="100%" stopColor={HASH_GREEN} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-rule)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--color-rule)" }} minTickGap={28} />
                <YAxis tickFormatter={(v: number) => fmtThs(v)} tick={{ fill: "var(--color-muted)", fontSize: 10 }} tickLine={false} axisLine={false} width={82} />
                <Tooltip
                  contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-rule)", color: "var(--color-fg)", fontSize: 12 }}
                  formatter={(v: number, name: string) => [fmtThs(v), name]}
                />
                <Area type="monotone" dataKey="ths" name="1m hash" stroke={HASH_GREEN} strokeWidth={2.5} fill="url(#minerHashFill)" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="ths5m" name="5m avg" stroke={HASH_YELLOW} strokeWidth={1.8} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="ths1h" name="1hr avg" stroke={HASH_BLUE} strokeWidth={1.8} dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Collecting hash power samples from solo CKPool — the graph draws itself as this desk polls the free public
            stats (styled after the CKPool miner explorer graphs). Keep the miners active and check back.
          </p>
        )}
      </Panel>

      {stats?.worker?.length ? (
        <Panel kicker="Rigs" title="Workers on the pool" kickerClass="text-tab" titleClass="text-tab">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left font-mono text-xs">
              <thead>
                <tr className="text-muted">
                  <th className="py-1 pr-2 font-medium">Worker</th>
                  <th className="py-1 pr-2 font-medium">1m</th>
                  <th className="py-1 pr-2 font-medium">1hr</th>
                  <th className="py-1 pr-2 font-medium">1d</th>
                  <th className="py-1 pr-2 font-medium">Last share</th>
                  <th className="py-1 font-medium">Best share</th>
                </tr>
              </thead>
              <tbody>
                {stats.worker.map((w) => (
                  <tr key={w.workername} className="border-t border-rule">
                    <td className="py-1.5 pr-2 text-fg">{w.workername}</td>
                    <td className="py-1.5 pr-2" style={{ color: HASH_GREEN }}>{w.hashrate1m}</td>
                    <td className="py-1.5 pr-2" style={{ color: HASH_BLUE }}>{w.hashrate1hr}</td>
                    <td className="py-1.5 pr-2 text-fg">{w.hashrate1d}</td>
                    <td className="py-1.5 pr-2 text-muted">{fmtAgo(w.lastshare)}</td>
                    <td className="py-1.5" style={{ color: HASH_YELLOW }}>{fmtShare(w.bestshare)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : null}

      <Panel kicker="Your stratum" title="Miner dialogue boxes — update only your own" kickerClass="text-medium" titleClass="text-medium">
        <p className="text-sm leading-relaxed text-muted">
          Only the most basic information is required. Each system admin updates only their own stratum
          {scope ? ` (this session: ${scope === "system" ? "s1r1us.ai system admin" : "app copy admin"})` : ""}. Enter
          your own CKPool miner information and hit Save to rebuild the {TAB_MINERS} data and view. Leave a box blank
          and hit Save = the S1R1US.ai CKPool data populates the dialogue boxes. {MINERS_PASSWORD_NOTE}
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted">{MINERS_STRATUM_SCHEME}</span>
            <input
              value={stratum}
              onChange={(e) => setStratum(e.target.value)}
              placeholder={MINERS_DEFAULT_STRATUM}
              className="mt-1 h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
            />
            {stratumBad ? <span className="mt-1 block text-xs text-sell">{stratumBad}</span> : (
              <span className="mt-1 block text-xs text-muted">{stratumUrl(stratum)}</span>
            )}
          </label>
          <label className="block text-sm">
            <span className="text-muted">Backup pool ({MINERS_STRATUM_SCHEME})</span>
            <input
              value={backup}
              onChange={(e) => setBackup(e.target.value)}
              placeholder={MINERS_DEFAULT_BACKUP}
              className="mt-1 h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
            />
            {backupBad ? <span className="mt-1 block text-xs text-sell">{backupBad}</span> : (
              <span className="mt-1 block text-xs text-muted">{stratumUrl(backup || MINERS_DEFAULT_BACKUP)}</span>
            )}
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-muted">BTC receiving address for the miners (default = S1R1US.ai system admin BTC key)</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={MINERS_DEFAULT_ADDRESS}
              className="mt-1 h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
            />
            {addressBad ? <span className="mt-1 block text-xs text-sell">{addressBad}</span> : null}
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={() => void save()} disabled={busy || Boolean(stratumBad || backupBad || addressBad)}>
            <Save className="size-4" /> Save — rebuild {TAB_MINERS}
          </Button>
          <Button onClick={() => void load()} disabled={busy} aria-label="Refresh miner stats">
            <RefreshCw className={cn("size-4", busy && "animate-spin")} /> Refresh
          </Button>
          {saved ? <span className="text-xs text-up">{saved}</span> : null}
        </div>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-xs leading-relaxed text-muted">
          {MINERS_INSTRUCTIONS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="mt-3 text-xs leading-relaxed text-muted">{MINERS_DISCLAIMER}</p>
      </Panel>
    </div>
  );
}

function MinerMetric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase leading-tight text-muted">{label}</p>
      <p className="mt-0.5 truncate font-mono text-base tabular-nums tracking-tight sm:text-lg" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}
