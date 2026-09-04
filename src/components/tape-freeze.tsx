import { useEffect, useState } from "react";
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
      Tape frozen · {when} · Lab and tests use this snapshot. Free APIs idle.
    </p>
  );
}

export function TapeFreezePanel() {
  const token = useOperator((s) => s.token);
  const [frozen, setFrozen] = useState(false);
  const [at, setAt] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    void fetchTapeMeta().then((m) => {
      setFrozen(m.frozen);
      setAt(m.at);
      setPrice(m.price);
    });
  }, []);
  async function toggle() {
    setErr(null);
    const res = await setTapeFreeze({ data: { token, frozen: !frozen } });
    if (!res.ok) {
      setErr(res.error ?? "Could not change tape freeze");
      return;
    }
    setFrozen(res.frozen);
    setAt(res.at);
    setPrice(res.price);
  }
  const when = at ? new Date(at).toLocaleString("en-US") : "none yet";
  return (
    <Panel className="mt-4" kicker="Tape" title={frozen ? "Frozen · last good" : "Live 5-minute"} titleClass={frozen ? "text-medium" : "text-high"}>
      <p className="text-sm text-muted">
        Frozen = tests and Lab use the last validated snapshot. No Coinbase / mempool / FRED pulls until you unfreeze.
        Live = one pull every 5 minutes. That is the mandate clock.
      </p>
      <p className="mt-2 font-mono text-xs text-muted">
        Last good {when}
        {price != null ? ` · $${Math.round(price).toLocaleString("en-US")}` : ""}
      </p>
      <Button className="mt-3" variant="primary" onClick={() => void toggle()}>
        {frozen ? "Unfreeze — live 5-minute pulls" : "Freeze tape — test without APIs"}
      </Button>
      {err ? <p className="mt-2 text-sm text-down">{err}</p> : null}
    </Panel>
  );
}
