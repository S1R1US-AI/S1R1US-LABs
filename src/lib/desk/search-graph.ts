import {
  APP_NAME,
  LABS_NAME,
  PAGE_DESC_FAQ,
  PAGE_TITLE_FAQ,
  SEO_CANONICAL,
  SEO_DESCRIPTION,
  SITE_IMAGES,
  seoImgAlt,
  TAB_DESK,
  SEO_TAB_DESK,
} from "@/lib/brand";
import {
  FOUNDING_DATE,
  liveSameAs,
  OFFICIAL_PROPERTIES,
  sitelinkPages,
} from "@/lib/desk/official-presence";
import { COMPANY_X_HANDLE, COMPANY_X_URL } from "@/lib/desk/x-admin";
import { VIDEO_CLIPS } from "@/lib/desk/video-library";
import { FAQ_ITEMS, PUBLIC_PAGES } from "@/lib/desk/public-nav";

const origin = SEO_CANONICAL.replace(/\/$/, "");
const logoUrl = `${origin}/icon-512.png`;
const orgId = `${origin}/#organization`;
const webId = `${origin}/#website`;
const logoId = `${origin}/#logo`;

export function corporateSearchGraph() {
  const sameAs = liveSameAs();
  const sitelinks = sitelinkPages();
  return [
    {
      "@type": "Organization",
      "@id": orgId,
      name: LABS_NAME,
      legalName: LABS_NAME,
      alternateName: [APP_NAME, "S1R1US Labs", "S1R1US AI", TAB_DESK, SEO_TAB_DESK, "S1R1US Bot Hedge Fund"],
      url: SEO_CANONICAL,
      description: SEO_DESCRIPTION,
      foundingDate: FOUNDING_DATE,
      slogan: "Accumulate bitcoin. Never sell bitcoin. Never short bitcoin.",
      knowsAbout: [
        "AI agents",
        "bitcoin accumulation agent",
        "Bitcoin",
        "AI trading bots",
        "Bitcoin trading agents",
        "7-B0T",
      ],
      areaServed: "Worldwide",
      brand: { "@type": "Brand", name: APP_NAME, logo: logoUrl },
      logo: { "@id": logoId },
      image: { "@id": logoId },
      sameAs,
      identifier: [
        { "@type": "PropertyValue", name: "X", value: COMPANY_X_HANDLE },
        { "@type": "PropertyValue", name: "GitHub", value: "S1R1US-AI/S1R1US-LABs" },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "public desk",
          url: COMPANY_X_URL,
          availableLanguage: ["en"],
        },
      ],
    },
    {
      "@type": "ImageObject",
      "@id": logoId,
      url: logoUrl,
      contentUrl: logoUrl,
      width: 512,
      height: 512,
      encodingFormat: "image/png",
      name: seoImgAlt("S1R!US Godzilla Logo"),
      caption: seoImgAlt("Official S1R!US Godzilla Logo for AI agents and bitcoin accumulation agent"),
      description: seoImgAlt("S1R1US Labs hologram Godzilla mark"),
      representativeOfPage: true,
    },
    {
      "@type": "WebSite",
      "@id": webId,
      name: LABS_NAME,
      alternateName: [APP_NAME, TAB_DESK, "s1r1us.ai"],
      url: SEO_CANONICAL,
      description: SEO_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": orgId },
      isPartOf: { "@id": orgId },
      about: ["AI agents", "bitcoin accumulation agent", "AI trading bots", "Bitcoin trading agents", "7-B0T"],
      dateModified: "2026-09-06",
      hasPart: PUBLIC_PAGES.map((p) => ({
        "@type": "WebPage",
        "@id": `${p.loc}#webpage`,
        name: p.label,
        url: p.loc,
      })),
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${origin}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      name: "S1R1US.ai sitelinks",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: sitelinks.length,
      itemListElement: sitelinks.map((s, i) => ({
        "@type": "SiteNavigationElement",
        position: i + 1,
        name: s.name,
        url: s.url,
      })),
    },
    {
      "@type": "ItemList",
      name: "Official S1R1US Labs properties",
      description: "Live and reserved brand desks. sameAs only lists live owned profiles.",
      itemListElement: OFFICIAL_PROPERTIES.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${p.name} ${p.label}`,
        url: p.url,
        description: `${p.live ? "LIVE" : "RESERVED"} · ${p.hint}`,
      })),
    },
    ...SITE_IMAGES.map((img) => ({
      "@type": "ImageObject",
      contentUrl: `${origin}${img.src}`,
      url: `${origin}${img.src}`,
      name: img.name,
      caption: img.caption,
      description: img.caption,
      about: ["AI agents", "bitcoin accumulation agent", "AI trading bots", "Bitcoin trading agents"],
      publisher: { "@id": orgId },
    })),
    {
      "@type": "FAQPage",
      "@id": `${origin}/faq#faq`,
      url: `${origin}/faq`,
      name: PAGE_TITLE_FAQ,
      description: PAGE_DESC_FAQ,
      isPartOf: { "@id": webId },
      about: ["AI agents", "bitcoin accumulation agent", "admin panel", "morning report", "live tape"],
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        url: item.id ? `${origin}/faq#${item.id}` : `${origin}/faq`,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${origin}/#breadcrumbs`,
      itemListElement: sitelinkPages()
        .filter((s) => s.url.startsWith(origin))
        .map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          item: s.url,
        })),
    },
    {
      "@type": "DataCatalog",
      name: "S1R1US Labs AI agent surfaces",
      url: `${origin}/llms.txt`,
      description: "Read-only Bot 7 JSON, MCP, A2A, go-live notices, and W1S3 0WL$ Forum. This host never places Coinbase orders.",
      publisher: { "@id": orgId },
      dataset: [
        { "@type": "Dataset", name: "Bot 7 call", url: `${origin}/api/agent/call` },
        { "@type": "Dataset", name: "Go-live notices", url: `${origin}/api/agent/notices` },
        { "@type": "Dataset", name: "W1S3 0WL$ Forum", url: `${origin}/api/agent/forum` },
      ],
    },
  ];
}

export function videoObjectGraph() {
  const channels = OFFICIAL_PROPERTIES.filter((p) => p.kind === "youtube" || p.kind === "rumble" || p.kind === "tiktok").map(
    (p) => ({
      "@type": "BroadcastChannel",
      name: `S1R1US Labs ${p.name}`,
      url: p.url,
      broadcastDisplayName: p.label,
      inLanguage: "en",
      description: p.live
        ? p.hint
        : `${p.hint} Not yet live — reserved so search engines and agents resolve the official handle.`,
      publisher: { "@id": orgId },
    }),
  );
  const clips = VIDEO_CLIPS.map((v) => ({
    "@type": "VideoObject",
    name: v.title,
    description: v.seo,
    url: `${origin}/media#${v.id}`,
    contentUrl: `${origin}${v.href}`,
    thumbnailUrl: `${origin}/s1r1us-godzilla-logo.jpg`,
    uploadDate: "2026-09-06",
    duration: `PT${v.durationSec}S`,
    inLanguage: "en",
    isFamilyFriendly: true,
    publisher: { "@id": orgId },
  }));
  return [...channels, ...clips];
}
