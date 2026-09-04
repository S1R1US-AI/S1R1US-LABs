import { useEffect, useState, type ClipboardEvent, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, LogIn, LogOut } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { secondFactorStatus } from "@/lib/desk/access";
import { looksLikeSecret } from "@/lib/desk/security";
import { useOperator } from "@/lib/desk/operator";
import { APP_NAME } from "@/lib/brand";
import { XRenewWhenAdmin } from "@/components/renew-password";

export function OperatorGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const unlocked = useOperator((s) => s.unlocked);
  const role = useOperator((s) => s.role);
  const yubiTicket = useOperator((s) => s.yubiTicket);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <LockForm pending />;
  if (yubiTicket) return <YubiForm />;
  if (!unlocked || role !== "admin") {
    return <LockForm userOnly={unlocked && role === "user"} />;
  }
  return <>{children}</>;
}

function LockForm({ pending, userOnly }: { pending?: boolean; userOnly?: boolean }) {
  const user = useCurrentUser();
  const unlock = useOperator((s) => s.unlock);
  const idleLocked = useOperator((s) => s.idleLocked);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [xAdmin, setXAdmin] = useState(false);
  const [xErr, setXErr] = useState<string | null>(null);

  useEffect(() => {
    if (pending || !user) {
      setXAdmin(false);
      return;
    }
    setXAdmin(false);
    let gone = false;
    void (async () => {
      try {
        const st = await secondFactorStatus();
        if (gone) return;
        setXAdmin(Boolean(st.allowed));
      } catch {
        if (!gone) setXAdmin(false);
      }
    })();
    return () => {
      gone = true;
    };
  }, [pending, user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (looksLikeSecret(name) || looksLikeSecret(pass)) {
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed into this desk.");
      setPass("");
      return;
    }
    setBusy(true);
    setErr(null);
    const fail = await unlock(name, pass);
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
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed into this desk.");
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">
        {idleLocked ? "Idle lock" : "login"}
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
      {userOnly ? (
        <p className="mt-3 text-sm leading-relaxed text-down">
          This login is a desk user. Admin is only the operator X account plus name and password.
        </p>
      ) : null}
      {idleLocked || user ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {idleLocked ? "Screensaver locked the desk. Sign in again with your name and password." : null}
          {user ? (
            <>
              {idleLocked ? " " : null}
              Signed in as <span className="text-fg">{user.displayName ?? user.primaryEmail}</span>.
            </>
          ) : null}
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
              disabled={pending}
              onClick={() => void signIn(p.providerId, { callbackURL: "/admin" })}
            >
              Continue with X
            </Button>
          ))}
          <p className="text-xs leading-relaxed text-muted">
            Admin needs the operator X account, then name and password.
            Other X accounts and desk users stay users — they cannot open Admin, Wallet, or send.
          </p>
        </div>
      ) : null}
      {user ? (
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
        </div>
      ) : null}
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-3">
        <label className="block text-sm" htmlFor="op-user">
          Name
        </label>
        <input
          id="op-user"
          type="text"
          autoComplete="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
          required
          disabled={pending}
        />
        <label className="block text-sm" htmlFor="op-pass">
          Password
        </label>
        <input
          id="op-pass"
          type="password"
          autoComplete="current-password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onPaste={guardPaste}
          className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
          required
          disabled={pending}
        />
        {err ? <p className="text-sm text-down">{err}</p> : null}
        <Button variant="primary" type="submit" disabled={busy || pending} className="w-full">
          <Lock className="size-4" />
          Unlock desk
        </Button>
      </form>
      {user ? <XRenewWhenAdmin /> : null}
    </main>
  );
}

function YubiForm() {
  const tapYubi = useOperator((s) => s.tapYubi);
  const lock = useOperator((s) => s.lock);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(value: string) {
    const tap = value.trim().toLowerCase();
    if (tap.length !== 44) {
      setErr("Touch the YubiKey in this field until 44 characters appear.");
      return;
    }
    setBusy(true);
    setErr(null);
    const fail = await tapYubi(tap);
    setBusy(false);
    if (fail) {
      setErr(fail);
      setOtp("");
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">YubiKey</p>
      <h1 className="mt-2 font-mono text-2xl font-bold tracking-wide text-medium">{APP_NAME}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Touch the enrolled YubiKey with this field focused. Short-press emits a Yubico OTP. Do not
        paste a Coinbase secret here.
      </p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(otp);
        }}
      >
        <label className="block text-sm" htmlFor="yubi-otp">
          YubiKey
        </label>
        <input
          id="yubi-otp"
          type="text"
          inputMode="text"
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
          className="h-11 w-full rounded-md border border-rule bg-surface px-3 font-mono text-sm text-fg"
          maxLength={44}
          disabled={busy}
        />
        {err ? <p className="text-sm text-down">{err}</p> : null}
        <Button variant="primary" type="submit" disabled={busy} className="w-full">
          Verify YubiKey
        </Button>
        <Button type="button" className="w-full" onClick={() => void lock()}>
          Back
        </Button>
      </form>
    </main>
  );
}

export function AdminAuthControl() {
  const unlocked = useOperator((s) => s.unlocked);
  const lock = useOperator((s) => s.lock);
  if (unlocked) {
    return (
      <Button onClick={() => void lock()} aria-label="Logout">
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    );
  }
  return (
    <Link
      to="/login"
      className="inline-flex h-10 min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-brand hover:bg-brand/10"
      aria-label="login"
    >
      <LogIn className="size-4" />
      login
    </Link>
  );
}

/** @deprecated use AdminAuthControl */
export function LockButton() {
  return <AdminAuthControl />;
}
