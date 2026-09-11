import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Panel } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { fetchLiveSim, setLiveSim } from "@/lib/desk/desk-rpc";
import { LIVE_SIM_NAME } from "@/lib/desk/live-sim";
import type { LiveSimPublic } from "@/lib/desk/live-sim";
import { cn } from "@/lib/utils";

export function LiveSimPanel({ token }: { token: string | null }) {
  const [sim, setSim] = useState<LiveSimPublic | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    const res = await fetchLiveSim({ data: { token } });
    if (res.ok) setSim(res.sim);
    else setErr(res.error ?? "Could not load simulation");
  }

  useEffect(() => {
    void load();
  }, [token]);

  async function toggle(status: "LIVE" | "PAUSED") {
    if (!token || busy) return;
    setBusy(true);
    setErr(null);
    const res = await setLiveSim({ data: { token, status } });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error ?? "Could not change simulation");
      return;
    }
    setSim(res.sim);
  }

  const live = sim?.status === "LIVE";
  return (
    <Panel
      className="mt-4"
      kicker="As-live"
      title={live ? "LIVE · G M0D3 AUTO + AI agents" : "PAUSED · morning / admin"}
      kickerClass={live ? "text-high" : "text-medium"}
    >
      <p className="text-sm leading-relaxed text-muted">
        {LIVE_SIM_NAME} runs as live until go-live ({sim?.until ?? "2026-12-01"}). Paper on Coinbase last. Daily auto pause {sim?.pauseEt ?? "07:00"} ET, morning report{" "}
        {sim?.reportEt ?? "07:30"} ET, then resume. System Admin and phone-app Admin may pause. Championship World Cup /
        C@LL 0UT pause is also system Admin and phone-app Admin. Old practice ticks stay off. Checkpoint stays synced
        with the desk build. Conflict rebases to baseline DEPLOY #68 LIVE with pause allowed. Current fold is S1R1US App
        build #113 (live sim launch).
      </p>
      <p className="mt-2 font-mono text-xs text-muted">{sim?.note ?? "load simulation"}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-muted">Build</dt>
          <dd className={cn("font-mono", sim?.synced ? "text-high" : "text-sell")}>
            {sim?.label ?? "S1R1US App build #113"}
            {sim?.synced ? " · synced" : " · desync"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Status</dt>
          <dd className={cn("font-mono", live ? "text-high" : "text-medium")}>{sim?.status ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">Next pause</dt>
          <dd className="font-mono">{sim?.nextPauseAt ? sim.nextPauseAt.slice(0, 16).replace("T", " ") : "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">Next report</dt>
          <dd className="font-mono">{sim?.nextReportAt ? sim.nextReportAt.slice(0, 16).replace("T", " ") : "—"}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        {live ? (
          <Button onClick={() => void toggle("PAUSED")} disabled={busy || !token}>
            <Pause className="size-4" />
            {busy ? "…" : "Pause simulation"}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => void toggle("LIVE")} disabled={busy || !token}>
            <Play className="size-4" />
            {busy ? "…" : "Continue simulation"}
          </Button>
        )}
      </div>
      {err ? <p className="mt-2 text-sm text-sell">{err}</p> : null}
    </Panel>
  );
}
