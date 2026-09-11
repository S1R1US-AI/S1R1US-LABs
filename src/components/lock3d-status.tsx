import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shell";
import { GmRainbow, GoldCss } from "@/components/godzilla-mark";
import { rainGmBurst } from "@/components/matrix-saver";
import { fetchLockStatus, setLockStatus } from "@/lib/desk/desk-rpc";
import { useOperator } from "@/lib/desk/operator";
import { useAppAdmin } from "@/lib/desk/app-admin-client";
import {
  LOCK_GIF_CLOSED,
  LOCK_GIF_OPEN,
  LOCK_GIF_OPEN_NAME,
  TAB_LOCK3D,
  groupLockRows,
  lockGifSrc,
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
  const px = size === "lg" ? 28 : size === "sm" ? 16 : 22;
  const short = locked ? "LOCKED" : "UNLOCKED";
  const seo = seoImgAlt(locked ? "Closed padlock. LOCKED." : LOCK_GIF_OPEN_NAME);
  return (
    <img
      src={lockGifSrc(locked ? LOCK_GIF_CLOSED : LOCK_GIF_OPEN)}
      alt={seo}
      title={short}
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
  if (css.includes("gold-css") || css.includes("pred-nav")) {
    return <GoldCss text={name} className={cn("font-semibold pred-nav gold-css", className)} />;
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

type LockRow = LockStatusPublic["rows"][number];

function LockCell({
  row,
  canEdit,
  token,
  busy,
  showHint,
  showInclude,
  onAct,
}: {
  row: LockRow;
  canEdit: boolean;
  token: string;
  busy: boolean;
  showHint?: boolean;
  showInclude?: boolean;
  onAct?: (input: ActInput) => void;
}) {
  const gif = canEdit && onAct ? (
    <button
      type="button"
      disabled={busy || !token}
      onClick={() => onAct({ op: "one", id: row.id, locked: !row.locked })}
      className="lock-cell-gif inline-flex items-center justify-center rounded-md border border-rule bg-paper-raised transition-transform duration-150 ease-out active:scale-[0.96]"
      aria-pressed={row.locked}
      aria-label={`${row.name} ${row.label} — toggle`}
      title={row.hint}
    >
      <LockGif locked={row.locked} />
    </button>
  ) : (
    <span className="lock-cell-gif inline-flex items-center justify-center" title={row.hint}>
      <LockGif locked={row.locked} />
    </span>
  );
  return (
    <li className="lock-cell">
      {gif}
      <div className="lock-cell-copy min-w-0">
        <p className="lock-cell-line">
          <Link
            to={row.to}
            hash={row.hash}
            className={cn("lock-cell-link", row.css)}
            title={`${row.seo} — open view`}
            aria-label={`Open ${row.name}`}
            onClick={() => {
              if (row.id === "gmAuto" || row.id === "gmManual") rainGmBurst(2500);
            }}
          >
            <LockName name={row.name} css={row.css} />
          </Link>
        </p>
        {showHint ? <p className="lock-cell-hint">{row.hint}</p> : null}
      </div>
      <strong className={cn("lock-cell-state", row.locked ? "text-sell" : "text-high")}>{row.locked ? "locked" : "unlocked"}</strong>
      {showInclude && canEdit && onAct ? (
        <label className="lock-cell-include">
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
  );
}

function LockColumn({
  title,
  tone,
  rows,
  empty,
  canEdit,
  token,
  busy,
  showHint,
  showInclude,
  onAct,
}: {
  title: string;
  tone: "open" | "closed";
  rows: LockRow[];
  empty: string;
  canEdit: boolean;
  token: string;
  busy: boolean;
  showHint?: boolean;
  showInclude?: boolean;
  onAct?: (input: ActInput) => void;
}) {
  const closed = tone === "closed";
  return (
    <section className={cn("lock-col", closed ? "lock-col-closed" : "lock-col-open")}>
      <header className="lock-col-h">
        <span className={closed ? "text-sell" : "text-high"}>{title}</span>
        <LockGif locked={closed} size="lg" />
      </header>
      <ul className="lock-col-list">
        {rows.length ? (
          rows.map((row) => (
            <LockCell
              key={row.id}
              row={row}
              canEdit={canEdit}
              token={token}
              busy={busy}
              showHint={showHint}
              showInclude={showInclude}
              onAct={onAct}
            />
          ))
        ) : (
          <li className="lock-cell lock-cell-empty">{empty}</li>
        )}
      </ul>
    </section>
  );
}

export function LockBoard({
  lock,
  canEdit = false,
  token = "",
  busy = false,
  compact = false,
  onAct,
}: {
  lock: LockStatusPublic;
  canEdit?: boolean;
  token?: string;
  busy?: boolean;
  compact?: boolean;
  onAct?: (input: ActInput) => void;
}) {
  const grouped = groupLockRows(lock.rows);
  return (
    <div className="lock-status-board">
      <div className={cn("lock-status-cols", compact && "lock-status-cols-stack")}>
        <LockColumn
          title="UNLOCKED"
          tone="open"
          rows={grouped.unlocked}
          empty="none unlocked"
          canEdit={canEdit}
          token={token}
          busy={busy}
          showHint={!compact}
          showInclude={!compact}
          onAct={onAct}
        />
        <LockColumn
          title="LOCKED"
          tone="closed"
          rows={grouped.locked}
          empty="none locked"
          canEdit={canEdit}
          token={token}
          busy={busy}
          showHint={!compact}
          showInclude={!compact}
          onAct={onAct}
        />
      </div>
    </div>
  );
}

export function LockHead({
  lock,
  masterLocked,
  expanded,
  onToggle,
}: {
  lock: LockStatusPublic;
  masterLocked: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="lock-status-head">
      <div className="lock-status-title">
        <LockGif locked={masterLocked} size="lg" />
        <span className="legal-purple">{TAB_LOCK3D}</span>
        <strong className={masterLocked ? "text-sell" : "text-high"}>{masterLocked ? "LOCKED" : "UNLOCKED"}</strong>
        <span className="lock-status-mode">desk {lock.mode}</span>
        {onToggle ? (
          <button
            type="button"
            className="lock-status-expand text-expand"
            aria-expanded={Boolean(expanded)}
            onClick={onToggle}
          >
            {expanded ? "collapse" : "expand"}
          </button>
        ) : null}
      </div>
      <span className={cn("lock-status-tape", liveTapeClass(lock.tape))} title={lock.tapeNote}>
        <Radio className="size-4 shrink-0" />
        <span>Lock Status</span>
      </span>
    </div>
  );
}

function LockControls({
  lock,
  canEdit,
  token,
  busy,
  err,
  onAct,
  compact = false,
}: {
  lock: LockStatusPublic;
  canEdit: boolean;
  token: string;
  busy: boolean;
  err: string | null;
  onAct: (input: ActInput) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(!compact);
  const included = lock.rows.filter((r) => r.include).length;
  return (
    <div className="lock-status-panel w-full min-w-0">
      <LockHead lock={lock} masterLocked={lock.masterLocked} expanded={open} onToggle={() => setOpen((v) => !v)} />

      {open && canEdit ? (
        <div className="lock-status-actions">
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

      {open ? (
        <>
          <LockBoard lock={lock} canEdit={canEdit} token={token} busy={busy} compact={compact} onAct={onAct} />
          {err ? <p className="mt-2 text-sm text-sell">{err}</p> : null}
          {compact ? null : <p className="mt-3 text-xs leading-relaxed text-muted">{lock.notice}</p>}
        </>
      ) : err ? (
        <p className="mt-2 text-sm text-sell">{err}</p>
      ) : null}
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
      title={TAB_LOCK3D}
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
  const ok = feedAudit?.ok ?? 0;
  const fail = feedAudit?.fail ?? 0;
  const total = ok + fail;
  const feedTone = total === 0 || ok === 0 ? "live-tape-none" : fail === 0 ? "live-tape-all" : ok > total / 2 ? "live-tape-most" : "live-tape-half";

  return (
    <div className="lock-status-rail mb-3 rounded-md border border-rule bg-paper-raised px-4 py-3 text-sm leading-snug text-muted sm:px-5">
      {lock ? (
        <LockControls
          lock={lock}
          canEdit={canEdit}
          token={token}
          busy={busy}
          err={err}
          compact
          onAct={(i) => void act(i)}
        />
      ) : (
        <div className="lock-status-head">
          <div className="lock-status-title">
            <LockGif locked={masterLocked} size="lg" />
            <span className="legal-purple">{TAB_LOCK3D}</span>
          </div>
          <span className={cn("lock-status-tape", feedTone)}>
            <Radio className="size-4 shrink-0" />
            <span>Lock Status</span>
            {feedAudit ? <span className="lock-status-tape-note">{ok} live · {fail} down</span> : null}
          </span>
        </div>
      )}
    </div>
  );
}
