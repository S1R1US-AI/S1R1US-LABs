import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Panel } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { fetchChampionshipSim, setChampionshipSim } from "@/lib/desk/desk-rpc";
import { cn } from "@/lib/utils";

type Sim = { live?: boolean; status?: string; note?: string; at?: string | null };

export function ChampionshipSimPanel({ token }: { token: string | null }) {
  const [sim, setSim] = useState<Sim | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    const res = await fetchChampionshipSim({ data: { token } });
    if (res.ok) setSim(res.sim);
    else setErr(res.error ?? "Could not load championship simulation");
  }

  useEffect(() => {
    void load();
  }, [token]);

  async function toggle(status: "LIVE" | "PAUSED") {
    if (!token || busy) return;
    setBusy(true);
    setErr(null);
    const res = await setChampionshipSim({ data: { token, status } });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error ?? "Could not change championship simulation");
      return;
    }
    setSim(res.sim);
  }

  const live = sim?.live !== false && sim?.status !== "PAUSED";
  return (
    <Panel
      className="mt-4"
      kicker="Championship sim"
      title={live ? "LIVE · World Cup + C@LL 0UT sim" : "PAUSED · championship sim frozen"}
      kickerClass={live ? "text-high" : "text-medium"}
      titleClass={live ? "text-high" : "text-medium"}
    >
      <p className="text-sm leading-relaxed text-muted">
        Pause or continue W0rLd CUP, simulated SUP3R B0WL, and C@LL 0UT paper ticks on live Coinbase last. System
        Admin and phone-app Admin share this control. Pause does not unlock Coinbase create and does not pause GM
        B0aRd official rank.
      </p>
      <p className="mt-2 font-mono text-xs text-muted">{sim?.note ?? "load simulation"}</p>
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
      {err ? <p className={cn("mt-2 text-sm text-sell")}>{err}</p> : null}
    </Panel>
  );
}
