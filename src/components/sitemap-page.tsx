import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { PUBLIC_PAGES, SITEMAP_MACHINE } from "@/lib/desk/public-nav";
import { APP_NAME, LABS_NAME, SEO_CANONICAL, TAB_DESK } from "@/lib/brand";

export function SitemapPage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">Sitemap</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Main menu: S1R1US Live Tape, S1R1US L@Bs, GM, F33D, AI Agents, FAQ, @S1R1US_AI. Public pages
          for {LABS_NAME}: {TAB_DESK} (S1R1US 7-bot hedge fund), G0DZ1LLa M0D3 (Godzilla
          mode), B3AT TH3 B3AR$ (Beat the Bears), AI AG3NTS (AI AGENTS), W1S3 0WL (Wise Owl), F33D H0ST1Ng (Feed Hosting), Buy M3 a Cup of C0FF33 (Buy Me a Cup of Coffee), Call1ng
          All B0Ts (Calling All Bots). Home is{" "}
          <a className="text-oss hover:underline" href="https://s1r1us.ai/">
            https://s1r1us.ai/
          </a>
          — not /heliosbot. Official company X:{" "}
          <a className="text-oss hover:underline" href="https://x.com/S1R1US_AI">
            @S1R1US_AI
          </a>
          . Machine sitemap:{" "}
          <a className="text-oss hover:underline" href="/sitemap.xml">
            sitemap.xml
          </a>
          . AI agents start at{" "}
          <a className="text-oss hover:underline" href="/llms.txt">
            /llms.txt
          </a>
          . Crawlers: {SEO_CANONICAL}
        </p>
        <Panel kicker="Index" title="Public URLs" className="mt-6" kickerClass="text-oss">
          <ul className="space-y-3">
            {PUBLIC_PAGES.map((p) => (
              <li key={p.path}>
                <a href={p.path} className="font-medium text-fg hover:underline">
                  {p.label}
                </a>
                <p className="font-mono text-xs text-muted">{p.title}</p>
                <p className="text-xs text-muted">{p.hint}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel kicker="Agents" title="Machine URLs" className="mt-6" kickerClass="text-tab">
          <ul className="space-y-3">
            {SITEMAP_MACHINE.map((p) => (
              <li key={p.loc}>
                <a href={p.loc} className="font-medium text-fg hover:underline">
                  {p.label}
                </a>
                <p className="font-mono text-xs text-muted">{p.loc.replace(SEO_CANONICAL.replace(/\/$/, ""), "")}</p>
                <p className="text-xs text-muted">{p.hint}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/faq" className="hover:underline">
            FAQ
          </Link>
          <span className="px-2">|</span>
          <Link to="/" className="hover:underline">
            {TAB_DESK}
          </Link>
        </p>
      </main>
    </Shell>
  );
}