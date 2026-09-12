import { Link } from "@tanstack/react-router";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import { Panel, Shell } from "@/components/shell";
import { SupportDonate } from "@/components/support-donate";
import {
  GIF_SPONSOR_GOAL,
  GIF_SPONSOR_GOAL_NAME,
  GIF_SPONSOR_HEART,
  GIF_SPONSOR_HEART_NAME,
  GIF_SPONSOR_LARGE,
  GIF_SPONSOR_LARGE_NAME,
  PAGE_DESC_SPONSOR,
  SEO_TAB_SPONSOR,
  SPONSOR_HEADLINE,
  TAB_COFFEE,
  TAB_DESK,
  TAB_FEED,
  TAB_SPONSOR,
} from "@/lib/brand";
import { FUNDING_PLATFORMS, SUPPORT_GIFT_RECEIPT } from "@/lib/desk/support";

export function SponsorPage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">{TAB_SPONSOR} · {SEO_TAB_SPONSOR}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-high">{TAB_SPONSOR}</h1>
        <p className="mt-1 text-sm text-muted">{SEO_TAB_SPONSOR} · every FUNDING.yml donation type as a direct BTC / USDC gift</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{SPONSOR_HEADLINE}.</p>
        <SeoImage
          src={GIF_SPONSOR_LARGE}
          alt={GIF_SPONSOR_LARGE_NAME}
          title={GIF_SPONSOR_LARGE_NAME}
          desc={GIF_SPONSOR_LARGE_NAME}
          width={480}
          height={270}
          className="mt-4 h-auto w-full max-w-[480px] rounded-md border border-rule"
        />
        <p className="mt-3 text-sm leading-relaxed text-muted">{PAGE_DESC_SPONSOR}</p>
        <p className="mt-3 text-sm font-medium text-fg">{SUPPORT_GIFT_RECEIPT}</p>
        <Panel
          id="funding-map"
          className="mt-4 scroll-mt-24"
          kicker="FUNDING.yml"
          title="Every donation platform type → an s1r1us.ai gift page"
          kickerClass="text-high"
          titleClass="text-high"
        >
          <p className="mt-2 text-sm leading-relaxed text-muted">
            S1R1US L@Bs holds no third-party funding platform accounts. The GitHub{" "}
            <a
              href="https://github.com/S1R1US-AI/S1R1US-LABs/blob/main/.github/FUNDING.yml"
              target="_blank"
              rel="noreferrer"
              className="text-tab hover:underline"
            >
              FUNDING.yml
            </a>{" "}
            maps each supported platform to the closest on-site donation page. All gifts are direct
            on-chain Bitcoin (BTC) or native Circle USDC — never tokens, never upside.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                  <th className="py-2 pr-3">Platform</th>
                  <th className="py-2 pr-3">Donation type</th>
                  <th className="py-2">s1r1us.ai fit</th>
                </tr>
              </thead>
              <tbody>
                {FUNDING_PLATFORMS.map((p) => (
                  <tr key={p.key} className="border-b border-rule/60 align-top">
                    <td className="py-2 pr-3 font-mono text-xs text-fg">{p.platform}</td>
                    <td className="py-2 pr-3 text-muted">{p.type}</td>
                    <td className="py-2">
                      <Link to={p.path} className="text-tab hover:underline">
                        {p.fit}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <figure className="rounded-md border border-rule p-3">
            <SeoImage
              src={GIF_SPONSOR_HEART}
              alt={GIF_SPONSOR_HEART_NAME}
              title={GIF_SPONSOR_HEART_NAME}
              desc={GIF_SPONSOR_HEART_NAME}
              width={200}
              height={200}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[200px]"
            />
            <figcaption className="mt-2 text-center text-xs text-muted">
              GitHub Sponsors / Patreon / Polar donation type — a sponsor heart, settled as a BTC gift.
            </figcaption>
          </figure>
          <figure className="rounded-md border border-rule p-3">
            <SeoImage
              src={GIF_SPONSOR_GOAL}
              alt={GIF_SPONSOR_GOAL_NAME}
              title={GIF_SPONSOR_GOAL_NAME}
              desc={GIF_SPONSOR_GOAL_NAME}
              width={200}
              height={200}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[200px]"
            />
            <figcaption className="mt-2 text-center text-xs text-muted">
              Community Bridge / LFX / IssueHunt crowdfund + bounty donation type — one transparent goal.
            </figcaption>
          </figure>
        </div>
        <SupportDonate />
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/f33d" className="hover:underline">
            {TAB_FEED}
          </Link>
          <span className="px-2">|</span>
          <Link to="/c0ff33" className="hover:underline">
            {TAB_COFFEE}
          </Link>
          <span className="px-2">|</span>
          <Link to="/faq" hash="sponsor-the-bots" className="hover:underline">
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
