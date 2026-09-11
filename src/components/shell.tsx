import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { secondFactorStatus } from "@/lib/desk/access";
import { looksLikeCompanyX, COMPANY_X_HANDLE, COMPANY_X_NAME } from "@/lib/desk/x-admin";
import { CompanyAvatar } from "@/components/company-x";
import { AdminAuthControl } from "@/components/operator-lock";
import { useOperator } from "@/lib/desk/operator";
import {
  APP_NAME,
  MENU_AGENTS,
  MENU_FEED,
  MENU_FAQ,
  MENU_LAB,
  MENU_TAPE,
  TAB_AGENT,
  TAB_BEARS,
  TAB_OWL,
  TAB_ROBOTS,
  TAB_COMPUTE,
  TAB_APP,
  TAB_COFFEE,
  TAB_DESK,
  TAB_FEED,
  TAB_GM,
  TAB_HOVER_AGENT,
  TAB_HOVER_BEARS,
  TAB_HOVER_OWL,
  TAB_HOVER_ROBOTS,
  TAB_HOVER_COMPUTE,
  TAB_HOVER_APP,
  TAB_HOVER_BOARD,
  TAB_HOVER_HIVE,
  TAB_HOVER_COFFEE,
  TAB_HOVER_DESK,
  TAB_HOVER_FAQ,
  TAB_HOVER_FEED,
  TAB_HOVER_FORUM,
  TAB_HOVER_GM,
  TAB_HOVER_HOME,
  TAB_HOVER_LAB,
  TAB_HOVER_SITEMAP,
} from "@/lib/brand";
import { TAB_PRED } from "@/lib/pred-labels";
import "@/components/pred-nav.css";
import { OSS_LINK, OSS_LINK_LABEL } from "@/lib/launch/model";
import { GodzillaMark, GodzillaModeLabel, HiveSwarmLabel, LeaderBoardLabel } from "@/components/godzilla-mark";
import { ForumTitle } from "@/components/forum-title";
import { rainGmBurst } from "@/components/matrix-saver";
import { DisclaimerExpandBody } from "@/components/legal-bar";
import {
  TERMS_HOVER,
  TERMS_PATH,
  TERMS_TITLE,
  PRIVACY_HOVER,
  PRIVACY_PATH,
  PRIVACY_TITLE,
} from "@/lib/legal";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: MENU_TAPE, title: TAB_HOVER_DESK },
  { to: "/helios", label: MENU_LAB, title: TAB_HOVER_LAB },
] as const;

export function Shell({
  children,
  right,
}: {
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col overflow-x-hidden bg-bg text-fg">
      <header className="desk-nav-fiber no-print sticky top-0 z-30 border-b border-rule">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 sm:px-4">
          <nav className="desk-tabs flex flex-wrap gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                title={l.title}
                aria-label={l.title}
                className="coinbase-orange inline-flex min-h-10 max-w-[11.5rem] items-center rounded-md px-2.5 py-1.5 text-left text-[0.825rem] font-medium leading-tight sm:max-w-none sm:px-3 sm:text-[0.9625rem]"
                activeProps={{
                  className:
                    "coinbase-orange is-on inline-flex min-h-10 max-w-[11.5rem] items-center rounded-md px-2.5 py-1.5 text-left text-[0.825rem] font-medium leading-tight sm:max-w-none sm:px-3 sm:text-[0.9625rem]",
                }}
              >
                <span className="tab-shimmer">{l.label}</span>
              </Link>
            ))}
            <Link
              to="/gm"
              title={TAB_HOVER_GM}
              aria-label={TAB_HOVER_GM}
              className="gm-tab gm-nav inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              onClick={() => rainGmBurst(2500)}
              activeProps={{
                className:
                  "gm-tab gm-nav is-on inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              <GodzillaMark className="gm-mark-rainbow h-[1.1rem] w-[1.65rem] shrink-0" />
              <GodzillaModeLabel className="text-[0.825rem] font-medium sm:text-[0.9625rem]" />
            </Link>
            <Link
              to="/f33d"
              hash="donate"
              title={TAB_HOVER_FEED}
              aria-label={TAB_HOVER_FEED}
              className="gm-tab coinbase-orange inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              activeProps={{
                className:
                  "gm-tab coinbase-orange is-on inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              <span className="tab-shimmer">{MENU_FEED}</span>
            </Link>
            <Link
              to="/agent"
              title={TAB_HOVER_AGENT}
              aria-label={TAB_HOVER_AGENT}
              className="coinbase-orange inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              activeProps={{
                className:
                  "coinbase-orange is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              <span className="tab-shimmer">{MENU_AGENTS}</span>
            </Link>
            <Link
              to="/board"
              title={TAB_HOVER_BOARD}
              aria-label={TAB_HOVER_BOARD}
              className="board-nav gm-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              activeProps={{
                className:
                  "board-nav gm-nav is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              <LeaderBoardLabel className="text-[0.825rem] font-semibold sm:text-[0.9625rem]" />
            </Link>
            <Link
              to="/h1v3"
              title={TAB_HOVER_HIVE}
              aria-label={TAB_HOVER_HIVE}
              className="board-nav gm-nav hive-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              activeProps={{
                className:
                  "board-nav gm-nav hive-nav is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              <HiveSwarmLabel className="text-[0.825rem] font-semibold sm:text-[0.9625rem]" />
            </Link>
            <Link
              to="/pr3d"
              title="AI Agent Prediction Market"
              aria-label="PR3D1CT10N$ AI Agent Prediction Market"
              className="board-nav gm-nav pred-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              activeProps={{
                className:
                  "board-nav gm-nav pred-nav is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              {TAB_PRED}
            </Link>
            <Link
              to="/forum"
              title={TAB_HOVER_FORUM}
              aria-label={TAB_HOVER_FORUM}
              className="forum-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              activeProps={{
                className:
                  "forum-nav is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              <ForumTitle />
            </Link>
            <Link
              to="/faq"
              title={TAB_HOVER_FAQ}
              aria-label={TAB_HOVER_FAQ}
              className="faq-kicker inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              activeProps={{
                className:
                  "faq-kicker is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              <span className="tab-shimmer">{MENU_FAQ}</span>
            </Link>
            <AdminNavLink />
          </nav>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {right}
          </div>
        </div>
      </header>
      <DisclaimerBlock />
      <div className="flex-1">{children}</div>
      <footer className="no-print mt-auto border-t border-rule carbon-fiber">
        <div className="mx-auto max-w-[1400px] px-3 py-3 sm:px-4">
          <div className="flex flex-col gap-2">
            <Link to="/s1r1us" className="font-mono text-[11px] tracking-[0.12em] text-muted/45 hover:text-muted" title={TAB_HOVER_HOME} aria-label={TAB_HOVER_HOME}>
              s1r1us.ai
            </Link>
            <a
              href={OSS_LINK}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-oss hover:underline"
              title={OSS_LINK_LABEL}
              aria-label="HELP 7-BOT HEDGE FUND S1R1US LABS GO OPEN SOURCE. OP3N S0URC3 is open source."
            >
              <span className="block font-mono text-[11px] leading-snug tracking-[0.04em]">{OSS_LINK_LABEL}</span>
              <span className="seo-copy">
                HELP 7-BOT HEDGE FUND [ S1R1US LABS ] GO OPEN SOURCE. OP3N S0URC3 means open source.
              </span>
            </a>
            <nav
              className="flex w-full flex-wrap items-center justify-evenly gap-x-4 gap-y-2 text-center font-mono text-[11px] leading-snug tracking-[0.04em]"
              aria-label="Footer"
            >
              <Link to="/sitemap" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_SITEMAP}>
                Sitemap
              </Link>
              <a href="/media" className="shrink-0 text-oss hover:underline" title="Official X, GitHub, YouTube, Rumble, TikTok">
                Media
              </a>
              <Link to="/c0ff33" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_COFFEE}>
                {TAB_COFFEE}
              </Link>
              <Link to="/faq" className="faq-kicker shrink-0 hover:underline" title={TAB_HOVER_FAQ}>
                FAQ
              </Link>
              <Link to="/b3ars" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_BEARS}>
                {TAB_BEARS}
              </Link>
              <Link to="/owl" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_OWL}>
                {TAB_OWL}
              </Link>
              <Link to="/r0b0ts" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_ROBOTS}>
                {TAB_ROBOTS}
              </Link>
              <Link to="/agent" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_AGENT}>
                {TAB_AGENT}
              </Link>
              <Link to="/board" className="board-nav gm-nav shrink-0 hover:underline" title={TAB_HOVER_BOARD}>
                <LeaderBoardLabel className="text-[11px] font-semibold" />
              </Link>
              <Link to="/h1v3" className="board-nav gm-nav hive-nav shrink-0 hover:underline" title={TAB_HOVER_HIVE}>
                <HiveSwarmLabel className="text-[11px] font-semibold" />
              </Link>
              <Link to="/pr3d" className="board-nav gm-nav pred-nav shrink-0 hover:underline" title="PR3D1CT10N$ · AI Agent Prediction Market">
                {TAB_PRED}
              </Link>
              <Link to="/l0ck" className="legal-purple shrink-0 hover:underline" title="LoCK3D STATUS (Locked Status) · how to lock and unlock">
                LoCK3D STATUS
              </Link>
              <Link to="/roadmap" className="shrink-0 text-oss hover:underline" title="OSS Roadmap · functions, go-live status, estimated timeline">
                OSS Roadmap
              </Link>
              <Link to="/forum" className="forum-nav shrink-0 hover:underline" title={TAB_HOVER_FORUM}>
                <ForumTitle />
              </Link>
              <Link to="/compute" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_COMPUTE}>
                {TAB_COMPUTE}
              </Link>
              <Link to="/app" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_APP}>
                {TAB_APP}
              </Link>
              <Link to={TERMS_PATH} className="legal-purple shrink-0 hover:underline" title={TERMS_HOVER}>
                {TERMS_TITLE}
              </Link>
              <Link to={PRIVACY_PATH} className="legal-purple shrink-0 hover:underline" title={PRIVACY_HOVER}>
                {PRIVACY_TITLE}
              </Link>
              <Link to="/login" className="shrink-0 text-oss hover:underline" title="login">
                login
              </Link>
            </nav>
            <p className="mt-3 text-xs">
              <Link
                to="/roadmap"
                className="font-semibold text-oss hover:underline"
                title="OSS Roadmap · functions, go-live status, estimated timeline"
              >
                OSS Roadmap
              </Link>
              <span className="text-muted"> · functions · go-live status · full live estimated 2026-12-01</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DisclaimerBlock() {
  const [open, setOpen] = useState(false);
  return (
    <div id="disclaimer" className="w-full border-b border-rule carbon-fiber">
      <div className="w-full px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="disclaimer-full"
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="legal-purple text-[11px] font-bold tracking-[0.16em] uppercase">DISCLAIMER</span>
          <span className="expand-ctl font-mono text-[10px] tracking-[0.08em]">{open ? "collapse −" : "expand +"}</span>
        </button>
        {open ? (
          <div id="disclaimer-full" className="mt-2 w-full max-w-none">
            <DisclaimerExpandBody />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function useBoundXAdmin() {
  const { user, isPending } = useCurrentUserState();
  const [xVerified, setXVerified] = useState(false);
  useEffect(() => {
    if (!user) {
      setXVerified(false);
      return;
    }
    let gone = false;
    void secondFactorStatus()
      .then((st) => {
        if (!gone) setXVerified(Boolean(st.allowed));
      })
      .catch(() => {
        if (!gone) setXVerified(false);
      });
    return () => {
      gone = true;
    };
  }, [user]);
  return {
    user,
    isPending,
    xVerified: Boolean(user) && xVerified,
  };
}

function AdminNavLink() {
  const unlocked = useOperator((s) => s.unlocked);
  const role = useOperator((s) => s.role);
  if (role !== "admin" || !unlocked) return null;
  return (
    <Link
      to="/admin"
      title={`Admin · ${APP_NAME}`}
      className="coinbase-orange inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium"
      activeProps={{
        className:
          "coinbase-orange is-on inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
      }}
    >
      <span className="tab-shimmer">Admin</span>
    </Link>
  );
}

export function LoginCluster() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <AuthSlot />
      <AdminAuthControl />
    </div>
  );
}

function AuthSlot() {
  const { user, isPending, xVerified } = useBoundXAdmin();
  if (isPending) return <div className="h-10 w-24 animate-pulse rounded-md bg-fg/8" />;
  if (!user) return null;
  return (
    <div className="flex items-center gap-2">
      {looksLikeCompanyX(user.displayName) ? (
        <p className="flex items-center gap-2 text-sm font-medium text-medium">
          <CompanyAvatar size={28} className="h-7 w-7" />
          {COMPANY_X_NAME}
          {COMPANY_X_HANDLE ? (
            <span className="ml-1 font-mono text-xs text-muted">{COMPANY_X_HANDLE}</span>
          ) : null}
        </p>
      ) : xVerified ? (
        <span className="x-admin-name max-w-[11rem] truncate text-sm sm:max-w-none">
          operator
        </span>
      ) : null}
      <UserButton hideLabel={xVerified || looksLikeCompanyX(user.displayName)} />
    </div>
  );
}

export function Panel({
  title,
  kicker,
  className,
  titleClass,
  kickerClass,
  id,
  children,
}: {
  title: ReactNode;
  kicker?: ReactNode;
  className?: string;
  titleClass?: string;
  kickerClass?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "min-w-0 max-w-full rounded-md border border-rule bg-surface/95 p-3 sm:p-4",
        className,
      )}
    >
      <header className="mb-3">
        {kicker ? (
          <p className={cn("text-xs font-medium tracking-[0.08em] uppercase", kickerClass || "text-muted")}>
            {kicker}
          </p>
        ) : null}
        <h2 className={cn("text-sm font-semibold tracking-tight sm:text-base", titleClass || "text-fg")}>{title}</h2>
      </header>
      {children}
    </section>
  );
}
