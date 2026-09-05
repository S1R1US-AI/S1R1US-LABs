import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { approveOutgoing } from "@/lib/desk/access";
import { useOperator } from "@/lib/desk/operator";

export function YubiApprove({
  title,
  detail,
  action,
  onDone,
  onCancel,
}: {
  title: string;
  detail: string;
  action: string;
  onDone: () => void | Promise<void>;
  onCancel: () => void;
}) {
  const token = useOperator((s) => s.token);
  const log = useOperator((s) => s.log);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(value: string) {
    const tap = value.trim().toLowerCase();
    if (tap.length !== 44) {
      setErr("Touch the admin YubiKey in this field until 44 characters appear.");
      return;
    }
    setBusy(true);
    setErr(null);
    const res = await approveOutgoing({ data: { token, otp: tap, action } });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      setOtp("");
      log("reject", "Outgoing blocked — YubiKey");
      return;
    }
    log("yubi", `Approved ${action}`);
    await onDone();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="yubi-approve-title"
    >
      <div className="w-full max-w-md rounded-lg border border-rule bg-surface p-5">
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">YubiKey required</p>
        <h2 id="yubi-approve-title" className="mt-1 text-base font-medium">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{detail}</p>
        <p className="mt-2 font-mono text-xs text-accent">{action}</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void submit(otp);
          }}
        >
          <label className="block text-sm" htmlFor="approve-yubi">
            Either enrolled YubiKey
          </label>
          <input
            id="approve-yubi"
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus
            value={otp}
            onChange={(e) => {
              const next = e.target.value.trim().toLowerCase();
              setOtp(next);
              if (next.length === 44) void submit(next);
            }}
            className="h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
            maxLength={44}
            disabled={busy}
          />
          {err ? (
            <p className="text-sm text-down">
              {err}{" "}
              {err.includes("Enroll") ? (
                <Link to="/admin" className="underline">
                  Open Admin
                </Link>
              ) : null}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" type="submit" disabled={busy}>
              Approve with YubiKey
            </Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function isOutgoingCli(cmd: string) {
  const t = cmd.toLowerCase();
  if (t.includes("orders create") || t.includes("orders preview")) return true;
  if (t.includes("coinbase send")) return true;
  if (t.includes("coinbase transfer") && (t.includes("currency=btc") || t.includes("currency=usdc"))) {
    return true;
  }
  return false;
}
