import { Link } from "@tanstack/react-router";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import {
  GIF_MINERS_HASH,
  GIF_MINERS_HASH_NAME,
  GIF_MINERS_LARGE,
  GIF_MINERS_LARGE_NAME,
  GIF_MINERS_SWARM,
  GIF_MINERS_SWARM_NAME,
  LABS_NAME,
  MINERS_DISCLAIMER,
  MINERS_HEADLINE,
  MINERS_PATH,
  PAGE_DESC_MINERS,
  PAGE_TITLE_MINERS,
  SEO_CANONICAL,
  SEO_TAB_MINERS,
  TAB_MINERS,
  seoImgAlt,
} from "@/lib/brand";
import {
  CKPOOL_DOCS,
  MINERS_DEFAULT_ADDRESS,
  MINERS_DEFAULT_BACKUP,
  MINERS_DEFAULT_STRATUM,
  MINERS_FAQ_ITEMS,
  MINERS_INSTRUCTIONS,
  MINERS_PASSWORD_NOTE,
  MINERS_STRATUM_SCHEME,
  ckpoolStatsUrl,
} from "@/lib/desk/btc-miners";
import { WHITE_LABEL_PATH } from "@/lib/desk/white-label";

const ALT_LARGE = seoImgAlt(GIF_MINERS_LARGE_NAME);
const ALT_SWARM = seoImgAlt(GIF_MINERS_SWARM_NAME);
const ALT_HASH = seoImgAlt(GIF_MINERS_HASH_NAME);

/** /Bitcoin-Miners — BTC M1N3Rz (BTC Miners View): Bitcoin Miner for accumulation system. */
export function BitcoinMinersPage() {
  const origin = SEO_CANONICAL.replace(/\/$/, "");
  const statsUrl = ckpoolStatsUrl(MINERS_DEFAULT_ADDRESS);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: MINERS_HEADLINE,
        name: PAGE_TITLE_MINERS,
        alternateName: [TAB_MINERS, SEO_TAB_MINERS, MINERS_HEADLINE, "Bitcoin Miners"],
        description: PAGE_DESC_MINERS,
        url: `${origin}${MINERS_PATH}`,
        image: [ `${origin}${GIF_MINERS_LARGE}`, `${origin}${GIF_MINERS_SWARM}`, `${origin}${GIF_MINERS_HASH}` ],
        author: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        publisher: { "@type": "Organization", name: LABS_NAME, url: SEO_CANONICAL },
        about: ["bitcoin miner", "solo CKPool", "CKPool stratum", "miner hash power graph", SEO_TAB_MINERS],
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${GIF_MINERS_LARGE}`,
        url: `${origin}${GIF_MINERS_LARGE}`,
        name: ALT_LARGE,
        caption: `${TAB_MINERS} (${SEO_TAB_MINERS}) — ${MINERS_HEADLINE}`,
        description: ALT_LARGE,
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${GIF_MINERS_SWARM}`,
        url: `${origin}${GIF_MINERS_SWARM}`,
        name: ALT_SWARM,
        caption: seoImgAlt("connecting bitcoin miners to an AI hive swarm"),
        description: ALT_SWARM,
      },
      {
        "@type": "ImageObject",
        contentUrl: `${origin}${GIF_MINERS_HASH}`,
        url: `${origin}${GIF_MINERS_HASH}`,
        name: ALT_HASH,
        caption: seoImgAlt("solo CKPool bitcoin miner hash power graph"),
        description: ALT_HASH,
      },
      {
        "@type": "HowTo",
        name: `${TAB_MINERS} (${SEO_TAB_MINERS}) — how to connect a bitcoin miner`,
        description: `Point any SHA-256 bitcoin miner at solo CKPool and watch free public stats in the ${TAB_MINERS} desk view.`,
        url: `${origin}${MINERS_PATH}`,
        step: MINERS_INSTRUCTIONS.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      },
      {
        "@type": "FAQPage",
        name: `${TAB_MINERS} (${SEO_TAB_MINERS}) FAQ`,
        url: `${origin}${MINERS_PATH}`,
        mainEntity: MINERS_FAQ_ITEMS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <div className="mx-auto w-full max-w-[1100px] space-y-4 px-3 py-6 sm:px-4">
        <Panel
          kicker={`${TAB_MINERS} · ${SEO_TAB_MINERS}`}
          title={MINERS_HEADLINE}
        >
          <p className="mb-3 text-sm text-muted">
            Free public solo CKPool (ckpool.org) miner stats in a pro trading desk view — hash power by hour,
            day, month, and year. Connecting bitcoin miners to an AI hive swarm.
          </p>
          <SeoImage
            src={GIF_MINERS_LARGE}
            alt={ALT_LARGE}
            title={GIF_MINERS_LARGE_NAME}
            width={480}
            height={270}
            loading="eager"
            className="mx-auto h-auto w-full max-w-[480px] rounded-lg"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SeoImage
              src={GIF_MINERS_SWARM}
              alt={ALT_SWARM}
              title={GIF_MINERS_SWARM_NAME}
              width={200}
              height={200}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[200px] rounded-lg"
            />
            <SeoImage
              src={GIF_MINERS_HASH}
              alt={ALT_HASH}
              title={GIF_MINERS_HASH_NAME}
              width={200}
              height={200}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[200px] rounded-lg"
            />
          </div>
          <p className="mt-4 text-sm text-muted">
            {TAB_MINERS} ({SEO_TAB_MINERS}) lives in the S1R1US.ai system admin console and in every{" "}
            <Link to={WHITE_LABEL_PATH} className="underline">
              White Label
            </Link>{" "}
            download — miner information is never stripped. Live public stats for the S1R1US.ai system admin
            miner:{" "}
            <a href={statsUrl} target="_blank" rel="noreferrer" className="underline">
              {statsUrl}
            </a>
            .
          </p>
        </Panel>

        <Panel kicker="1NSTRUCT10NS" title={`How ${TAB_MINERS} is used`}>
          <p className="mb-3 text-sm text-muted">Only the most basic information is required.</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {MINERS_INSTRUCTIONS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-md border border-rule p-3">
              <div className="text-xs text-muted">{MINERS_STRATUM_SCHEME}</div>
              <div className="font-mono">{MINERS_DEFAULT_STRATUM}</div>
            </div>
            <div className="rounded-md border border-rule p-3">
              <div className="text-xs text-muted">backup pool</div>
              <div className="font-mono">{MINERS_DEFAULT_BACKUP}</div>
            </div>
            <div className="rounded-md border border-rule p-3">
              <div className="text-xs text-muted">BTC receive address (default)</div>
              <div className="break-all font-mono">{MINERS_DEFAULT_ADDRESS}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">{MINERS_PASSWORD_NOTE}</p>
          <p className="mt-1 text-xs text-muted">
            Solo CKPool docs:{" "}
            <a href={CKPOOL_DOCS} target="_blank" rel="noreferrer" className="underline">
              {CKPOOL_DOCS}
            </a>
          </p>
        </Panel>

        <Panel kicker="FAQ" title={`${TAB_MINERS} FAQ`}>
          <div className="space-y-4 text-sm">
            {MINERS_FAQ_ITEMS.map((f) => (
              <div key={f.id} id={f.id}>
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-1 text-muted">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">{MINERS_DISCLAIMER}</p>
        </Panel>
      </div>
      <SeoCopy />
    </Shell>
  );
}
