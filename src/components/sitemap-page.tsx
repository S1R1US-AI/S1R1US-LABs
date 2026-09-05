import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { PUBLIC_PAGES } from "@/lib/desk/public-nav";
import { APP_NAME, LABS_NAME, SEO_CANONICAL, TAB_DESK } from "@/lib/brand";

export function SitemapPage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">Sitemap</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medium">{APP_NAME}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Public pages for {LABS_NAME}. Home is{" "}
          <a className="text-oss hover:underline" href="https://s1r1us.ai/">
            https://s1r1us.ai/
          </a>
          — not /heliosbot. Machine sitemap:{" "}
          <a className="text-oss hover:underline" href="/sitemap.xml">
            sitemap.xml
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
