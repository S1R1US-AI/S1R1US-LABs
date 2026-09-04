import { YubiApprove } from "@/components/yubi-approve";
import { money } from "@/components/helios-card";
import type { HeliosCall } from "@/lib/desk/types";

export function ConfirmClip({
  call,
  onCancel,
  onConfirm,
}: {
  call: HeliosCall;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const sell = call.stance === "TRIM";
  const side = sell ? "SELL" : "BUY";
  return (
    <YubiApprove
      title={sell ? "Approve take-profit send" : "Approve paper buy"}
      detail={
        sell
          ? `TRIM clip ${money(call.clipUsd, 0)} as BTC to the admin profit wallet (encrypted, Admin only). Paper book only — Coinbase will not receive this send. Admin YubiKey is required.`
          : `BUY clip ${money(call.clipUsd, 0)} at Coinbase last. Paper book only — Coinbase will not receive this fill. Admin YubiKey is required.`
      }
      action={`paper:${side}:${Math.round(call.clipUsd)}`}
      onCancel={onCancel}
      onDone={onConfirm}
    />
  );
}
