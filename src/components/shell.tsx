import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { secondFactorStatus } from "@/lib/desk/access";
import { looksLikeCompanyX, COMPANY_X_HANDLE, COMPANY_X_LABEL, COMPANY_X_NAME, COMPANY_X_URL } from "@/lib/desk/x-admin";
import { CompanyAvatar, CompanyXChip } from "@/components/company-x";
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
  TAB_COMPUTE,
  TAB_COFFEE,
  TAB_DESK,
  TAB_FEED,
  TAB_GM,
  TAB_HOVER_AGENT,
  TAB_HOVER_BEARS,
  TAB_HOVER_OWL,
  TAB_HOVER_COMPUTE,
  TAB_HOVER_COFFEE,
  TAB_HOVER_DESK,
  TAB_HOVER_FAQ,
  TAB_HOVER_FEED,
  TAB_HOVER_GM,
  TAB_HOVER_HOME,
  TAB_HOVER_LAB,
  TAB_HOVER_SITEMAP,
  TAB_LAB,
} from "@/lib/brand";
import { OSS_LINK, OSS_LINK_LABEL } from "@/lib/launch/model";
import { GodzillaMark, GmRainbow } from "@/components/godzilla-mark";
import { rainGmBurst } from "@/components/matrix-saver";
import { LegalBar } from "@/components/legal-bar";
import { TERMS_HOVER, TERMS_PATH, TERMS_TITLE, PRIVACY_HOVER, PRIVACY_PATH, PRIVACY_TITLE } from "@/lib/legal";
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
          <Link to="/" className="flex min-w-0 items-center gap-2" title={TAB_HOVER_HOME} aria-label={TAB_HOVER_HOME}>
            <CompanyAvatar size={28} className="h-7 w-7 ring-1 ring-rule" />
            <span className="truncate text-[0.9625rem] font-semibold tracking-[0.04em] text-fg">S1R1US</span>
          </Link>
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
                {l.label}
              </Link>
            ))}
            <Link
              to="/gm"
              title={TAB_HOVER_GM}
              aria-label={TAB_HOVER_GM}
              className="gm-tab gm-nav inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              onClick={() => rainGmBurst(3000)}
              activeProps={{
                className:
                  "gm-tab gm-nav is-on inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              <GodzillaMark className="gm-mark-rainbow h-[1.1rem] w-[1.65rem] shrink-0" />
              <GmRainbow text="GM" />
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
              {MENU_FEED}
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
              {MENU_AGENTS}
            </Link>
            <Link
              to="/faq"
              title={TAB_HOVER_FAQ}
              aria-label={TAB_HOVER_FAQ}
              className="faq-kicker coinbase-orange inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]"
              activeProps={{
                className:
                  "faq-kicker coinbase-orange is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
              }}
            >
              {MENU_FAQ}
            </Link>
            {COMPANY_X_URL ? (
              <a
                href={COMPANY_X_URL}
                target="_blank"
                rel="noreferrer"
                title={`${COMPANY_X_LABEL} on X`}
                aria-label={`${COMPANY_X_LABEL} on X. S1R1US Labs. AI trading bots. Bitcoin trading agents.`}
                className="x-handle-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 font-mono text-[0.825rem] font-medium sm:px-3 sm:text-[0.9625rem]"
              >
                {COMPANY_X_HANDLE}
              </a>
            ) : null}
            <AdminNavLink />
          </nav>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <CompanyXChip className="hidden sm:inline-flex" />
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
              <Link to="/agent" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_AGENT}>
                {TAB_AGENT}
              </Link>
              <Link to="/compute" className="shrink-0 text-oss hover:underline" title={TAB_HOVER_COMPUTE}>
                {TAB_COMPUTE}
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
          </div>
        </div>
      </footer>
    </div>
  );
}

function DisclaimerBlock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full border-b border-rule carbon-fiber">
      <div className="w-full px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="disclaimer-full"
          className="legal-purple flex w-full items-center justify-between gap-3 text-left text-[11px] font-bold tracking-[0.16em] uppercase"
        >
          <span>DISCLAIMER</span>
          <span className="font-mono text-[10px] tracking-[0.08em]">{open ? "collapse −" : "expand +"}</span>
        </button>
        {open ? (
          <div id="disclaimer-full" className="mt-2 w-full max-w-none space-y-2">
            <p className="w-full text-justify font-mono text-[10px] leading-relaxed text-muted">
              {TAB_LAB} is NOT considered financial advice or a financial recommendation. S1R1US.ai
              and the 7-B0T H3DG3 Fund and any related systems are NOT LICENSED for financial advice.
              If you need real financial advice seek a licensed professional. {TAB_LAB} and all related
              entities such as Desk, Lab, website or systems are for EDUCATION purpose ONLY. Invest at
              your own risk and only upon the advice of your licensed advisor. Using this website is
              agreement to the Terms and Agreements. Nothing here is an offer of securities. A cultural
              ticker, if one exists, is not a claim on bitcoin and is not how the desk is funded. No bot
              may retain system information or reverse engineer source without S1R1US.ai authorization.{" "}
              <Link to={PRIVACY_PATH} className="legal-purple hover:underline" title={PRIVACY_HOVER}>
                {PRIVACY_TITLE}
              </Link>
              .
            </p>
            <LegalBar />
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
      Admin
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
  kicker?: string;
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
