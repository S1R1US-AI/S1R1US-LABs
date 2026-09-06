import { createFileRoute, Link } from "@tanstack/react-router";
import { AskGrokPanel } from "@/components/ask-grok-panel";
import { GoLivePanel } from "@/components/go-live-panel";
import { SeoCopy } from "@/components/seo-copy";
import { Shell } from "@/components/shell";
import { PAGE_DESC_COMPUTE, PAGE_TITLE_COMPUTE, PAID_SERVICES, SEO_KEYWORDS, SEO_TAB_COMPUTE, TAB_COMPUTE } from "@/lib/brand";
import { FEED_PLANS } from "@/lib/desk/feed-plans";

export const Route = createFileRoute("/compute")({
  component: ComputePage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_COMPUTE },
      { name: "description", content: PAGE_DESC_COMPUTE },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/compute" }],
  }),
});

function ComputePage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">
          {TAB_COMPUTE} · {SEO_TAB_COMPUTE}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{TAB_COMPUTE}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{PAID_SERVICES}</p>
        <div className="mt-6">
          <GoLivePanel />
        </div>
        <div className="mt-6">
          <AskGrokPanel />
        </div>
        <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
          <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Bot 7 HTTP SaaS</p>
          <h2 className="mt-1 text-base font-semibold text-fg">Pay for JSON — not conviction</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Public GET /api/agent/call is free and rate-limited (poll 300s). A hashed key in BOT7_FEED_KEY_HASHES
            raises the cap. Same Bot 7 call. No extra HIGH. No BTC share. No token. Spec:{" "}
            <a href="/api/agent/keys" className="text-tab hover:underline">
              /api/agent/keys
            </a>
            .
          </p>
          <ul className="mt-3 space-y-1 font-mono text-xs text-muted">
            {FEED_PLANS.map((p) => (
              <li key={p.id}>
                {p.id} · ${p.usdMonth}/mo · poll {p.pollSec}s — {p.note}
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5">
          <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">iOS / Play</p>
          <h2 className="mt-1 text-base font-semibold text-fg">Onboard compute</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Future F33D apps keep your xAI / Grok key in the device keychain. They GET Bot 7 JSON from this host
            and run Ask Grok on-device. This host never receives spend keys. Gifts for those apps stay on{" "}
            <Link to="/f33d" className="text-tab hover:underline">
              F33D H0ST1Ng
            </Link>
            .
          </p>
        </section>
      </main>
    </Shell>
  );
}
