import { createFileRoute, Link } from "@tanstack/react-router";
import { MailboxRenewForm } from "@/components/renew-password";
import { APP_NAME } from "@/lib/brand";

type Search = { t?: string };

export const Route = createFileRoute("/renew")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    t: typeof s.t === "string" ? s.t : "",
  }),
  head: () => ({
    meta: [
      { title: `${APP_NAME} renew` },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RenewPage,
});

function RenewPage() {
  const { t } = Route.useSearch();
  const token = (t ?? "").trim();
  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Password renew</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
      {token.length === 64 ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Set a new admin password. This link works once.
          </p>
          <MailboxRenewForm token={token} />
        </>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This renew link is missing or incomplete. Sign in with X as the bound admin and request a
          new one.
        </p>
      )}
      <p className="mt-8 text-sm">
        <Link to="/admin" className="text-brand underline-offset-2 hover:underline">
          login
        </Link>
      </p>
    </main>
  );
}
