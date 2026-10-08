import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function ResetPwordExpand({ plane }: { plane: "system" | "phone" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 rounded-md border border-rule p-3 text-sm">
      <button type="button" className="legal-purple font-medium" onClick={() => setOpen((v) => !v)}>
        {open ? "collapse" : "expand"} reset p-word
      </button>
      {open ? (
        <div className="mt-2 space-y-2 text-muted">
          {plane === "system" ? (
            <>
              <p>System admin username is the bound operator name after X verifies. This page never shows the live password.</p>
              <p>Reset is operator only and follows a private procedure.</p>
              <p>
                <Link to="/renew" className="underline">
                  Open /renew
                </Link>
              </p>
            </>
          ) : (
            <>
              <p>Phone-app admin is a device session, not the host password. This page never shows a host password.</p>
              <p>Reset that copy: open /app/admin, lock the session, claim again with a new handle label. Host /admin credentials stay system-only.</p>
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
