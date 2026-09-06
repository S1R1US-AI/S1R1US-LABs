import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shell";
import { GmRainbow } from "@/components/godzilla-mark";
import { fetchLockStatus, setLockStatus } from "@/lib/desk/desk-rpc";
import { useOperator } from "@/lib/desk/operator";
import { useAppAdmin } from "@/lib/desk/app-admin-client";
import {
  LOCK_GIF_CLOSED,
  LOCK_GIF_OPEN,
  TAB_LOCK3D,
  type LockId,
  type LockStatusPublic,
} from "@/lib/desk/lock-status";
import { seoImgAlt } from "@/lib/brand";
import { cn } from "@/lib/utils";

const POLL_MS = 20_000;

function useLockAdmin() {
  const sysTok = useOperator((s) => (s.unlocked && s.role === "admin" ? s.token : ""));
  const appTok = useAppAdmin((s) => (s.unlocked ? s.token : ""));
  const token = sysTok || (appTok.startsWith("app.") ? appTok : "");
  return {
    token,
    canEdit: Boolean(token),
    plane: sysTok ? ("system" as const) : token ? ("app-admin" as const) : null,
  };
}

function useLockView() {
  const [lock, setLock] = useState<LockStatusPublic | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const next = await fetchLockStatus();
      setLock(next);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not read LoCK3D STATUS");
    }
  }

  useEffect(() => {
    void load();
    const t = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(t);
  }, []);

  return { lock, setLock, err, setErr, busy, setBusy, load };
}

export function LockGif({
  locked,
  size = "md",
  className,
}: {
  locked: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const px = size === "lg" ? 32 : size === "sm" ? 20 : 24;
  return (
    <img
      src={locked ? LOCK_GIF_CLOSED : LOCK_GIF_OPEN}
      alt={seoImgAlt(locked ? "Closed padlock. LOCKED." : "Open padlock. UNLOCKED.")}
      width={px}
      height={px}
      className={cn("lock-gif", locked ? "lock-gif-closed" : "lock-gif-open", size === "lg" && "lock-gif-lg", className)}
    />
  );
}

export function LockName({ name, css, className }: { name: string; css: string; className?: string }) {
  if (css === "gm-rainbow" || css === "hive-nav") {
    return <GmRainbow text={name} className={cn("font-semibold", className)} />;
  }
  return <span className={cn("font-semibold", css, className)}>{name}</span>;
}

function liveTapeClass(tape: LockStatusPublic["tape"]) {
  return tape === "TRUE LIVE" ? "live-tape-all" : "live-tape-half";
}

type ActInput = {
  op: "master" | "one" | "include" | "includeAll" | "mode";
  locked?: boolean;
  id?: LockId;
  include?: boolean;
  mode?: "SIM" | "LIVE";
};

function LockControls({
  lock,
  canEdit,
  token,
  busy,
  err,
  onAct,
}: {
  lock: LockStatusPublic;
  canEdit: boolean;
  token: string;
  busy: boolean;
  err: string | null;
  onAct: (input: ActInput) => void;
}) {
  const included = lock.rows.filter((r) => r.include).length;
  return (
    <div className="lock-status-panel w-full min-w-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule pb-3">
        <span className={cn("inline-flex items-center gap-1.5 font-semibold", liveTapeClass(lock.tape))} title={lock.tapeNote}>
          <Radio className="size-4" />
          Live tape
          <strong className="font-semibold">{lock.tape}</strong>
        </span>
        <span className="text-xs text-muted">status only · not a lock · not user-adjusted</span>
        <span className="font-mono text-[11px] text-muted">
          desk {lock.mode}
          {lock.by ? ` · ${lock.by}` : ""}
        </span>
      </div>

      {canEdit ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant={lock.mode === "SIM" ? "primary" : "outline"}
            disabled={busy || !token}
            onClick={() => onAct({ op: "mode", mode: "SIM" })}
          >
            SIM
          </Button>
          <Button
            variant={lock.mode === "LIVE" ? "primary" : "outline"}
            disabled={busy || !token}
            onClick={() => onAct({ op: "mode", mode: "LIVE" })}
          >
            LIVE
          </Button>
          <Button disabled={busy || !token || included === 0} onClick={() => onAct({ op: "master", locked: true })}>
            <LockGif locked size="sm" />
            Lock selected
          </Button>
          <Button variant="primary" disabled={busy || !token || included === 0} onClick={() => onAct({ op: "master", locked: false })}>
            <LockGif locked={false} size="sm" />
            Unlock selected
          </Button>
          <Button disabled={busy || !token} onClick={() => onAct({ op: "includeAll", include: true })}>
            Include all
          </Button>
          <Button disabled={busy || !token} onClick={() => onAct({ op: "includeAll", include: false })}>
            Include none
          </Button>
        </div>
      ) : null}

      <ul className="mt-3 divide-y divide-rule">
        {lock.rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5">
            {canEdit ? (
              <button
                type="button"
                disabled={busy || !token}
                onClick={() => onAct({ op: "one", id: row.id, locked: !row.locked })}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-rule bg-paper-raised px-2 transition-transform duration-150 ease-out active:scale-[0.96]"
                aria-pressed={row.locked}
                aria-label={`${row.name} ${row.locked ? "LOCKED" : "UNLOCKED"} — toggle`}
                title={row.hint}
              >
                <LockGif locked={row.locked} />
              </button>
            ) : (
              <span className="inline-flex min-h-10 min-w-10 items-center justify-center" title={row.hint}>
                <LockGif locked={row.locked} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <LockName name={row.name} css={row.css} />
                <strong className={row.locked ? "text-sell" : "text-high"}>{row.label}</strong>
                {!row.include ? <span className="text-[11px] tracking-[0.08em] text-muted uppercase">off master</span> : null}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{row.hint}</p>
            </div>
            {canEdit ? (
              <label className="inline-flex min-h-10 items-center gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={row.include}
                  disabled={busy || !token}
                  onChange={() => onAct({ op: "include", id: row.id, include: !row.include })}
                />
                include
              </label>
            ) : null}
          </li>
        ))}
      </ul>
      {err ? <p className="mt-2 text-sm text-sell">{err}</p> : null}
      <p className="mt-3 text-xs leading-relaxed text-muted">{lock.notice}</p>
    </div>
  );
}

export function Lock3dStatusPanel({ className }: { className?: string }) {
  const { token, canEdit, plane } = useLockAdmin();
  const { lock, setLock, err, setErr, busy, setBusy } = useLockView();

  async function act(input: ActInput) {
    if (!token) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await setLockStatus({ data: { token, ...input } });
      if (!res.ok || !res.lock) {
        setErr(res.error ?? "Admin session required");
        return;
      }
      setLock(res.lock);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not change LoCK3D STATUS");
    } finally {
      setBusy(false);
    }
  }

  const masterLocked = lock?.masterLocked ?? true;
  return (
    <Panel
      className={cn("mt-4", className)}
      kicker={TAB_LOCK3D}
      title={
        <span className="inline-flex items-center gap-2">
          <LockGif locked={masterLocked} />
          {masterLocked ? "LOCKED" : "UNLOCKED"}
          <span className="font-mono text-[11px] font-normal text-muted">{lock?.mode ?? "SIM"}</span>
        </span>
      }
      kickerClass="legal-purple"
      titleClass={masterLocked ? "text-sell" : "text-high"}
    >
      <p className="text-sm leading-relaxed text-muted">
        System Admin and phone-app Admin share this board. Optional unlocks pick which rails the master lock hits.
        Live tape is status only. Championship pause stays system Admin. Unlock is live-intent — execute on YOUR
        Coinbase. This host never places orders.
        {plane ? ` Signed in as ${plane}.` : " Sign in as Admin to lock or unlock."}
      </p>
      {lock ? (
        <div className="mt-3">
          <LockControls lock={lock} canEdit={canEdit} token={token} busy={busy} err={err} onAct={(i) => void act(i)} />
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">{err ?? "Reading locks…"}</p>
      )}
    </Panel>
  );
}

export function Lock3dRail({
  feedAudit,
}: {
  feedAudit?: { ok: number; fail: number } | null;
}) {
  const { token, canEdit } = useLockAdmin();
  const { lock, setLock, err, setErr, busy, setBusy } = useLockView();
  const [open, setOpen] = useState(false);

  async function act(input: ActInput) {
    if (!token) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await setLockStatus({ data: { token, ...input } });
      if (!res.ok || !res.lock) {
        setErr(res.error ?? "Admin session required");
        return;
      }
      setLock(res.lock);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not change LoCK3D STATUS");
    } finally {
      setBusy(false);
    }
  }

  const tape = lock?.tape ?? "SIMULATED";
  const masterLocked = lock?.masterLocked ?? true;
  const ok = feedAudit?.ok ?? 0;
  const fail = feedAudit?.fail ?? 0;
  const total = ok + fail;
  const feedTone = total === 0 || ok === 0 ? "live-tape-none" : fail === 0 ? "live-tape-all" : ok > total / 2 ? "live-tape-most" : "live-tape-half";

  return (
    <div className="lock-status-rail mb-3 rounded-md border border-rule bg-paper-raised px-5 py-3 text-[1.08rem] leading-snug text-muted">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span
          className={cn("inline-flex items-center gap-1.5 font-semibold", lock ? liveTapeClass(tape) : feedTone)}
          title={lock?.tapeNote ?? (feedAudit ? `Live tape · ${ok} live · ${fail} down` : "Live tape")}
        >
          <Radio className="size-4" />
          Live tape
          <strong className="font-semibold">{tape}</strong>
        </span>
        {(lock?.rows ?? []).map((row) => (
          <span key={row.id} className="inline-flex items-center gap-1.5" title={row.hint}>
            {canEdit ? (
              <button
                type="button"
                disabled={busy || !token}
                onClick={() => void act({ op: "one", id: row.id, locked: !row.locked })}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md transition-transform duration-150 ease-out active:scale-[0.96]"
                aria-label={`${row.name} ${row.label}`}
              >
                <LockGif locked={row.locked} size="lg" />
              </button>
            ) : (
              <LockGif locked={row.locked} size="lg" />
            )}
            <LockName name={row.name} css={row.css} />
            <strong className={row.locked ? "text-sell" : "text-high"}>{row.locked ? "locked" : "unlocked"}</strong>
          </span>
        ))}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex min-h-10 items-center gap-1.5 font-bold tracking-[0.08em] uppercase",
            masterLocked ? "legal-purple" : "text-high",
          )}
        >
          <LockGif locked={masterLocked} size="lg" />
          {TAB_LOCK3D}
        </button>
      </div>
      {open ? (
        <div className="mt-3 w-full border-t border-rule pt-3">
          {lock ? (
            <LockControls lock={lock} canEdit={canEdit} token={token} busy={busy} err={err} onAct={(i) => void act(i)} />
          ) : (
            <p className="text-sm text-muted">{err ?? "Reading locks…"}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
