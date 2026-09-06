import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Panel } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { HiveSwarmLabel } from "@/components/godzilla-mark";
import { fetchHiveSwarm, setHiveSwarmStatus } from "@/lib/desk/desk-rpc";
import { HIVE_DISCLAIMER, TAB_HIVE } from "@/lib/brand";
import { cn } from "@/lib/utils";

type HiveView = NonNullable<Awaited<ReturnType<typeof fetchHiveSwarm>>["hive"]>;

export function HiveAdminPanel({ token }: { token: string }) {
  const [hive, setHive] = useState<HiveView | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    const res = await fetchHiveSwarm({ data: { token } });
    if (res.ok && res.hive) setHive(res.hive);
    else setErr(res.error ?? "Could not load H1V3 SW@RM");
  }

  useEffect(() => {
    void load();
  }, [token]);

  async function toggle(status: "LIVE" | "PAUSED") {
    if (!token) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await setHiveSwarmStatus({ data: { token, status } });
      if (!res.ok || !res.hive) {
        setErr(res.error ?? "Could not change H1V3 SW@RM");
        return;
      }
      setHive(res.hive);
    } finally {
      setBusy(false);
    }
  }

  const live = hive?.sim?.live !== false;
  const leaders = hive?.computeLeaders ?? [];

  return (
    <Panel
      className="mt-4"
      kicker={TAB_HIVE}
      title={live ? "LIVE · TEST data · paper hive" : "PAUSED · maintenance"}
      kickerClass={live ? "text-high" : "text-medium"}
      titleClass={live ? "text-high" : "text-medium"}
    >
      <p className="text-sm leading-relaxed text-muted">
        <HiveSwarmLabel className="text-sm" /> combines BYO compute (TH/s) and 7-B0T strategy. Paper BTC splits by pledged
        terahash. TEST data until go-live. System Admin and phone-app Admin may pause. Pause does not unlock Coinbase
        and does not grant source.
      </p>
      <p className="mt-2 font-mono text-xs text-muted">{hive?.sim?.note ?? "load swarm"}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-muted">Hive BTC</dt>
          <dd className="font-mono text-high">{(hive?.btc ?? 0).toFixed(6)}</dd>
        </div>
        <div>
          <dt className="text-muted">Swarm TH/s</dt>
          <dd className="font-mono text-tab">{(hive?.totalThs ?? 0).toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-muted">Members</dt>
          <dd className="font-mono">{hive?.count ?? 0}</dd>
        </div>
        <div>
          <dt className="text-muted">Ticks</dt>
          <dd className="font-mono">{hive?.ticks ?? 0}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        {live ? (
          <Button onClick={() => void toggle("PAUSED")} disabled={busy || !token}>
            <Pause className="size-4" />
            {busy ? "…" : "Pause H1V3 SW@RM"}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => void toggle("LIVE")} disabled={busy || !token}>
            <Play className="size-4" />
            {busy ? "…" : "Continue H1V3 SW@RM"}
          </Button>
        )}
      </div>
      {err ? <p className="mt-2 text-sm text-sell">{err}</p> : null}
      <p className="mt-3 text-[10px] font-semibold tracking-[0.1em] text-tab uppercase">Most compute pledged</p>
      <ol className="mt-1 max-h-56 divide-y divide-rule overflow-auto">
        {leaders.slice(0, 20).map((a) => (
          <li key={a.id} className="flex justify-between gap-2 py-1.5 font-mono text-xs">
            <span className={cn(a.system ? "text-tab" : undefined)}>
              #{a.rank} · {a.name}
              {a.demo ? " · demo" : ""}
            </span>
            <span className="text-tab">
              {a.ths.toFixed(2)} TH/s · {a.shareBtc.toFixed(6)} BTC
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-muted">{HIVE_DISCLAIMER}</p>
    </Panel>
  );
}
