import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shell";
import { fetchTapeMeta, setTapeFreeze } from "@/lib/desk/desk-rpc";
import { useOperator } from "@/lib/desk/operator";

export function TapeFreezeBanner() {
  const [frozen, setFrozen] = useState(false);
  const [at, setAt] = useState<number | null>(null);
  useEffect(() => {
    void fetchTapeMeta().then((m) => {
      setFrozen(m.frozen);
      setAt(m.at);
    });
  }, []);
  if (!frozen) return null;
  const when = at ? new Date(at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "last good";
  return (
    <p className="mb-3 font-mono text-xs text-medium">
      Data pulls paused · last good {when} · desk uses this snapshot. Free market APIs idle. Mandate unchanged.
    </p>
  );
}

export function TapeFreezePanel({ onChange }: { onChange?: (paused: boolean) => void }) {
  const token = useOperator((s) => s.token);
  const [frozen, setFrozen] = useState(false);
  const [at, setAt] = useState<number | null>(null);
  const [pausedAt, setPausedAt] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void fetchTapeMeta().then((m) => {
      setFrozen(m.frozen);
      setAt(m.at);
      setPausedAt(m.pausedAt ?? null);
      setPrice(m.price);
    });
  }, []);
  async function toggle() {
    if (!token) return;
    setErr(null);
    setBusy(true);
    try {
      const res = await setTapeFreeze({ data: { token, frozen: !frozen } });
      if (!res.ok) {
        setErr(res.error ?? "Could not change data-pull pause");
        return;
      }
      setFrozen(res.frozen);
      setAt(res.at);
      setPausedAt(res.pausedAt ?? null);
      setPrice(res.price);
      onChange?.(res.frozen);
    } finally {
      setBusy(false);
    }
  }
  const when = at ? new Date(at).toLocaleString("en-US") : "none yet";
  const pausedWhen = pausedAt ? pausedAt.slice(0, 19).replace("T", " ") : null;
  return (
    <Panel
      className="mt-4"
      kicker="Data pulls"
      title={frozen ? "Paused · last good snapshot" : "Live 5-minute clock"}
      kickerClass={frozen ? "text-medium" : "text-high"}
      titleClass={frozen ? "text-medium" : "text-high"}
    >
      <p className="text-sm leading-relaxed text-muted">
        Pause suspends Coinbase, FRED, mempool, ETF, and other tape fetches so you can test UI, Lab, Security, and
        agents on the last validated snapshot. External AI agents read ops.status PAUSED on ping and must not trade
        on that snapshot. Resume stamps waitlist invites (invite.status SENT). It does not unlock live Coinbase, does
        not sell bitcoin, does not change 7-B0T's accumulate mandate, does not green errors, and does not close the
        external AI gate. Resume restores the 5-minute pull clock.
      </p>
      <p className="mt-2 font-mono text-xs text-muted">
        Last good {when}
        {price != null ? ` · $${Math.round(price).toLocaleString("en-US")}` : ""}
        {frozen && pausedWhen ? ` · paused ${pausedWhen}Z` : ""}
      </p>
      <Button className="mt-3" variant="primary" onClick={() => void toggle()} disabled={busy || !token}>
        {frozen ? <Play className="size-4" /> : <Pause className="size-4" />}
        {busy ? (frozen ? "Resuming…" : "Pausing…") : frozen ? "Resume data pulls" : "Pause data pulls"}
      </Button>
      {err ? <p className="mt-2 text-sm text-down">{err}</p> : null}
    </Panel>
  );
}
