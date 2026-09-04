import { useEffect, useState, type ClipboardEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { secondFactorStatus } from "@/lib/desk/access";
import { looksLikeSecret } from "@/lib/desk/security";
import { useOperator } from "@/lib/desk/operator";

export function XRenewWhenAdmin() {
  const { user, isPending } = useCurrentUserState();
  const [allowed, setAllowed] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setAllowed(false);
      setReady(true);
      return;
    }
    let gone = false;
    void secondFactorStatus()
      .then((st) => {
        if (gone) return;
        setAllowed(Boolean(st.allowed));
        setAdminName(st.adminName ?? "");
        setReady(true);
      })
      .catch(() => {
        if (!gone) {
          setAllowed(false);
          setReady(true);
        }
      });
    return () => {
      gone = true;
    };
  }, [user, isPending]);

  if (isPending || !ready || !user || !allowed) return null;
  return <XRenewBlock allowed adminName={adminName} />;
}

export function XRenewBlock({
  allowed = false,
  adminName = "",
  xErr,
}: {
  allowed?: boolean;
  adminName?: string;
  xErr?: string | null;
}) {
  const renewWithX = useOperator((s) => s.renewWithX);
  const [open, setOpen] = useState(false);
  const [nextName, setNextName] = useState(adminName);
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (adminName && !nextName) setNextName(adminName);
  }, [adminName, nextName]);

  if (!allowed) return xErr ? <p className="mt-4 text-sm text-down">{xErr}</p> : null;

  function guardPaste(e: ClipboardEvent<HTMLInputElement>) {
    const t = e.clipboardData.getData("text");
    if (looksLikeSecret(t)) {
      e.preventDefault();
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
    }
  }

  async function onSet(e: FormEvent) {
    e.preventDefault();
    if (looksLikeSecret(next) || looksLikeSecret(confirm) || looksLikeSecret(nextName)) {
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
      return;
    }
    setBusy(true);
    setErr(null);
    const fail = await renewWithX(next, confirm, nextName.trim() || undefined);
    setBusy(false);
    if (fail) {
      setErr(fail);
      setNext("");
      setConfirm("");
    }
  }

  return (
    <div className="mt-4 rounded-md border border-brand/40 bg-brand/8 p-3">
      {!open ? (
        <Button type="button" variant="primary" className="w-full" onClick={() => setOpen(true)}>
          Renew admin password
        </Button>
      ) : (
        <form onSubmit={(e) => void onSet(e)} className="space-y-3">
          <p className="text-sm leading-relaxed text-muted">
            Operator X is signed in. This sets the name and password for the second login
            (admin door). X stays this account.
          </p>
          <label className="block text-sm" htmlFor="renew-name">
            Admin name
          </label>
          <input
            id="renew-name"
            type="text"
            autoComplete="username"
            value={nextName}
            onChange={(e) => setNextName(e.target.value)}
            className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
            minLength={3}
            maxLength={32}
            required
          />
          <label className="block text-sm" htmlFor="renew-next">
            New password
          </label>
          <input
            id="renew-next"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            onPaste={guardPaste}
            className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
            minLength={12}
            maxLength={128}
            required
          />
          <label className="block text-sm" htmlFor="renew-confirm">
            Confirm new password
          </label>
          <input
            id="renew-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onPaste={guardPaste}
            className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
            minLength={12}
            maxLength={128}
            required
          />
          {err ? <p className="text-sm text-down">{err}</p> : null}
          <Button variant="primary" type="submit" disabled={busy} className="w-full">
            Set admin name and password
          </Button>
        </form>
      )}
      {xErr && !open ? <p className="mt-2 text-sm text-down">{xErr}</p> : null}
    </div>
  );
}

export function MailboxRenewForm({ token }: { token: string }) {
  const completeReset = useOperator((s) => s.completeReset);
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  function guardPaste(e: ClipboardEvent<HTMLInputElement>) {
    const t = e.clipboardData.getData("text");
    if (looksLikeSecret(t)) {
      e.preventDefault();
      setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
    }
  }

  async function onSet(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fail = await completeReset(token, next, confirm);
    setBusy(false);
    if (fail) {
      setErr(fail);
      return;
    }
    setOk(true);
    setNext("");
    setConfirm("");
  }

  if (ok) {
    return (
      <p className="text-sm text-up">
        Password updated. Sign in with the admin name and the new password.
      </p>
    );
  }

  return (
    <form onSubmit={(e) => void onSet(e)} className="mt-6 space-y-3">
      <label className="block text-sm" htmlFor="mail-next">
        New password
      </label>
      <input
        id="mail-next"
        type="password"
        autoComplete="new-password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        onPaste={guardPaste}
        className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
        minLength={12}
        maxLength={128}
        required
      />
      <label className="block text-sm" htmlFor="mail-confirm">
        Confirm new password
      </label>
      <input
        id="mail-confirm"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        onPaste={guardPaste}
        className="h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg"
        minLength={12}
        maxLength={128}
        required
      />
      {err ? <p className="text-sm text-down">{err}</p> : null}
      <Button variant="primary" type="submit" disabled={busy} className="w-full">
        Set new password
      </Button>
    </form>
  );
}