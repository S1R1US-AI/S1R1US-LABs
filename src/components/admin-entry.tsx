import { lazy, Suspense, useEffect, useState } from "react";
import { OperatorGate } from "@/components/operator-lock";
import { Shell } from "@/components/shell";
import { grantAdminAssets, revokeAdminAssets } from "@/lib/desk/desk-rpc";
import { useOperator } from "@/lib/desk/operator";
import { useIsClient } from "@/lib/react/client";

/** Admin page code loads only after the server confirms the admin session. */
// The server never renders the panel (the gate shows first), so the server build skips the import.
const AdminPanel = import.meta.env.SSR
  ? () => null
  : lazy(() => import("@/components/admin-panel").then((m) => ({ default: m.AdminPanel })));

function Opening({ failed }: { failed?: boolean }) {
  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <p className="text-sm text-muted">{failed ? "Could not open Admin. Refresh, or sign in again." : "Opening Admin…"}</p>
    </main>
  );
}

export function AdminEntry() {
  const mounted = useIsClient();
  const token = useOperator((s) => s.token);
  const unlocked = useOperator((s) => s.unlocked);
  const role = useOperator((s) => s.role);
  const [granted, setGranted] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const admin = mounted && unlocked && role === "admin" && Boolean(token);

  useEffect(() => {
    if (!admin) {
      if (granted) {
        void revokeAdminAssets()
          .catch(() => undefined)
          .then(() => setGranted(null));
      }
      return;
    }
    if (granted === token) return;
    let gone = false;
    void grantAdminAssets({ data: { token } })
      .then((res) => {
        if (gone) return;
        setGranted(res.ok ? token : null);
        setFailed(!res.ok);
      })
      .catch(() => {
        if (!gone) setFailed(true);
      });
    return () => {
      gone = true;
    };
  }, [admin, token, granted]);

  if (admin && granted === token) {
    return (
      <Suspense
        fallback={
          <Shell>
            <Opening />
          </Shell>
        }
      >
        <AdminPanel />
      </Suspense>
    );
  }
  return (
    <Shell>
      <OperatorGate>
        <Opening failed={failed} />
      </OperatorGate>
    </Shell>
  );
}
