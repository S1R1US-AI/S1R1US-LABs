import { useState } from "react";
import { Link } from "@tanstack/react-router";

/** Expandable reset help. Never prints a live password. */
export function ResetPwordExpand({ plane }: { plane: "system" | "phone" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 rounded-md border border-rule p-3 text-sm">
      <button type="button" className="text-expand font-medium" onClick={() => setOpen((v) => !v)}>
        {open ? "Collapse" : "Expand"} reset p-word
      </button>
      {open ? (
        <div className="mt-2 space-y-2 text-muted">
          {plane === "system" ? (
            <>
              <p>System admin username is the bound operator name after X verifies. This page never shows the live password.</p>
              <p>Reset: Continue with X as the bound admin → request a one-time mailbox link → open /renew?t=… and set a new password. Then Yubi.</p>
              <p>
                <Link to="/renew" className="underline">
                  Open /renew
                </Link>
              </p>
            </>
          ) : (
            <>
              <p>Phone-app admin is a device session, not the host password. This page never shows a host password.</p>
              <p>Reset that copy: open /app/admin, lock the session, claim again with a new handle label. Host /admin Yubi stays system-only.</p>
              <p>
                <Link to="/app/admin" className="underline">
                  Open /app/admin
                </Link>
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
