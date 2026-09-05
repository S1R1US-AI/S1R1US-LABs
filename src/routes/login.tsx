import { useEffect, useState, type ClipboardEvent, type FormEvent } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { XRenewWhenAdmin } from "@/components/renew-password";
import { secondFactorStatus } from "@/lib/desk/access";
import { useOperator } from "@/lib/desk/operator";
import { looksLikeSecret } from "@/lib/desk/security";
import { APP_NAME } from "@/lib/brand";
import { LoginCluster, Shell } from "@/components/shell";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      { title: `Sign in · ${APP_NAME}` },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const me = useCurrentUser();
  const unlocked = useOperator((s) => s.unlocked);
  const idleLocked = useOperator((s) => s.idleLocked);
  const role = useOperator((s) => s.role);
  const unlock = useOperator((s) => s.unlock);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [xAdmin, setXAdmin] = useState(false);
  const [xErr, setXErr] = useState<string | null>(null);

  useEffect(() => {
    if (!me) {
      setXAdmin(false);
      return;
    }
    let gone = false;
    void (async () => {
      try {
        const st = await secondFactorStatus();
        if (gone) return;
        setXAdmin(Boolean(st.allowed));
      } catch {
        setXAdmin(false);
      }
    })();
    return () => {
      gone = true;
    };
  }, [me]);

  if (isPending) {
    return (
      <Shell>
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">login</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <div className="mt-6 h-11 animate-pulse rounded-md bg-fg/8" />
      </main>
      </Shell>
    );
  }
  if (unlocked) return <Navigate to={role === "user" ? "/" : "/admin"} />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (looksLikeSecret(name) || looksLikeSecret(pass)) {
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
      setPass("");
      return;
    }
    setBusy(true);
    setErr(null);
    const fail = await Promise.race([
      unlock(name, pass),
      new Promise<string>((resolve) =>
        setTimeout(() => resolve("Login timed out. Refresh and try again."), 20_000),
      ),
    ]);
    setBusy(false);
    if (fail && fail !== "yubi") {
      setErr(fail);
      setPass("");
    }
  }

  function guardPaste(e: ClipboardEvent<HTMLInputElement>) {
    const t = e.clipboardData.getData("text");
    if (looksLikeSecret(t)) {
      e.preventDefault();
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
    }
  }

  return (
    <Shell right={<LoginCluster />}>
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">
        {idleLocked ? "Idle lock" : "login"}
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
      {idleLocked ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Screensaver locked the desk. Sign in again with your name and password.
        </p>
      ) : null}
      {authEnabled && !user ? (
        <div className="mt-6 space-y-2">
          {GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              variant="primary"
              className="w-full"
              type="button"
              onClick={() => void signIn(p.providerId, { callbackURL: "/login" })}
            >
              Continue with X
            </Button>
          ))}
          <p className="text-xs leading-relaxed text-muted">
            Admin needs the operator X account, then name and password. Other X accounts stay users. They cannot open Admin.
          </p>
        </div>
      ) : user ? (
        <div className="mt-6 space-y-3">
          <UserButton />
          {xAdmin ? (
            <p className="text-sm text-high">
              Operator X verified. Enter name and password to finish.
            </p>
          ) : (
            <p className="text-sm text-muted">
              This X account is not the operator. Name + password opens a user session only.
            </p>
          )}
          <XRenewWhenAdmin />
        </div>
      ) : null}
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-3">
        <label className="block text-sm" htmlFor="login-user">
          Name
        </label>
        <input
          id="login-user"
          type="text"
          autoComplete="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
          required
        />
        <label className="block text-sm" htmlFor="login-pass">
          Password
        </label>
        <input
          id="login-pass"
          type="password"
          autoComplete="current-password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
          required
        />
        {err ? <p className="text-sm text-down">{err}</p> : null}
        <Button variant="primary" type="submit" disabled={busy} className="w-full">
          <Lock className="size-4" />
          {xAdmin ? "Unlock admin" : "Unlock"}
        </Button>
      </form>
      </main>
    </Shell>
  );
}
