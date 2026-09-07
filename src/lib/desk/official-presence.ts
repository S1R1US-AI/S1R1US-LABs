/** Official public properties of S1R1US Labs. sameAs only includes live, owned URLs. */

import { COMPANY_X_HANDLE, COMPANY_X_URL } from "@/lib/desk/x-admin";
import { SEO_CANONICAL } from "@/lib/brand";

export const GITHUB_ORG_URL = "https://github.com/S1R1US-AI";
export const GITHUB_REPO_URL = "https://github.com/S1R1US-AI/S1R1US-LABs";
export const FOUNDING_DATE = "2026-09-04";
export const BRAND_HANDLE = "S1R1US_AI";

export type PresenceKind = "site" | "x" | "github" | "youtube" | "rumble" | "tiktok";

export type OfficialProperty = {
  kind: PresenceKind;
  name: string;
  label: string;
  url: string;
  live: boolean;
  sameAs: boolean;
  hint: string;
};

export const OFFICIAL_PROPERTIES: OfficialProperty[] = [
  {
    kind: "site",
    name: "Website",
    label: "s1r1us.ai",
    url: SEO_CANONICAL,
    live: true,
    sameAs: false,
    hint: "Canonical desk. Education only. Not financial advice.",
  },
  {
    kind: "x",
    name: "X",
    label: COMPANY_X_HANDLE,
    url: COMPANY_X_URL,
    live: true,
    sameAs: true,
    hint: "Official company desk on X. @S1R1S_AI is not the desk.",
  },
  {
    kind: "github",
    name: "GitHub",
    label: "S1R1US-AI/S1R1US-LABs",
    url: GITHUB_REPO_URL,
    live: true,
    sameAs: true,
    hint: "Open source repository. Operator vault stays private.",
  },
  {
    kind: "youtube",
    name: "YouTube",
    label: `@${BRAND_HANDLE}`,
    url: `https://www.youtube.com/@${BRAND_HANDLE}`,
    live: false,
    sameAs: false,
    hint: "Reserved brand handle. Clips publish here when the video desk is live.",
  },
  {
    kind: "rumble",
    name: "Rumble",
    label: BRAND_HANDLE,
    url: `https://rumble.com/c/${BRAND_HANDLE}`,
    live: false,
    sameAs: false,
    hint: "Reserved brand channel. Long-form desk video when live.",
  },
  {
    kind: "tiktok",
    name: "TikTok",
    label: `@${BRAND_HANDLE}`,
    url: `https://www.tiktok.com/@${BRAND_HANDLE}`,
    live: false,
    sameAs: false,
    hint: "Reserved brand handle. Short clips when live.",
  },
];

export function liveSameAs(): string[] {
  return OFFICIAL_PROPERTIES.filter((p) => p.live && p.sameAs).map((p) => p.url);
}

export function liveMeLinks(): string[] {
  return OFFICIAL_PROPERTIES.filter((p) => p.live && (p.kind === "x" || p.kind === "github")).map((p) => p.url);
}

export function sitelinkPages() {
  return [
    { name: "S1R1US Live Tape", url: `${SEO_CANONICAL}` },
    { name: "AI Agents", url: `${SEO_CANONICAL}agent` },
    { name: "AG3nT F0rUm", url: `${SEO_CANONICAL}forum` },
    { name: "FAQ", url: `${SEO_CANONICAL}faq` },
    { name: "R0B0T$ ACT1VAT3", url: `${SEO_CANONICAL}r0b0ts` },
    { name: "G0DZ1LLa M0D3", url: `${SEO_CANONICAL}gm` },
    { name: "L3AD3R B0ARD", url: `${SEO_CANONICAL}board` },
    { name: "SUP3R B0WL", url: `${SEO_CANONICAL}bowl` },
    { name: "W0rLd CUP", url: `${SEO_CANONICAL}w0rld` },
    { name: "H1V3 SW@RM", url: `${SEO_CANONICAL}h1v3` },
    { name: "LoCK3D STATUS", url: `${SEO_CANONICAL}l0ck` },
    { name: "OSS Roadmap", url: `${SEO_CANONICAL}roadmap` },
    { name: "C@LL 0UT sim", url: `${SEO_CANONICAL}c0ut` },
    { name: "iOS · Google App", url: `${SEO_CANONICAL}app` },
    { name: "S1R1US L@Bs", url: `${SEO_CANONICAL}helios` },
    { name: "Media", url: `${SEO_CANONICAL}media` },
    { name: "GitHub", url: GITHUB_REPO_URL },
    { name: "X", url: COMPANY_X_URL },
  ];
}

export const MEDIA_PATH = "/media";
export const SEARCH_PATH = "/search";
export const ENTITY_PATH = "/entity.json";
export const VIDEO_SITEMAP_PATH = "/video-sitemap.xml";
export const BRAND_TXT_PATH = "/brand.txt";
export const HUMANS_PATH = "/humans.txt";
