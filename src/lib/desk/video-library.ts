/** Pinned AI Trading Bot Cost pack + always-on SUP3R B0WL of AI AGENTs pack. Education only. */

import { seoImgAlt } from "@/lib/brand";

export type VideoClip = {
  id: string;
  file: string;
  href: string;
  title: string;
  seo: string;
  platform: "tiktok" | "rumble";
  aspect: "9:16" | "16:9";
  durationSec: number;
  pinned: boolean;
  pack: "cost" | "bowl";
  poster: string;
};

export type VideoPack = {
  id: "cost" | "bowl";
  name: string;
  zip: string;
  zipName: string;
  always: boolean;
  blurb: string;
};

export const VIDEO_LIBRARY_ZIP = "/video/ai-trading-bot-cost-library.zip";
export const VIDEO_LIBRARY_NAME = "AI Trading Bot Cost (pinned)";
export const BOWL_LIBRARY_ZIP = "/video/super-bowl-ai-agents-library.zip";
export const BOWL_LIBRARY_NAME = "SUP3R B0WL of AI AGENTs (always)";

export const VIDEO_PACKS: VideoPack[] = [
  {
    id: "cost",
    name: VIDEO_LIBRARY_NAME,
    zip: VIDEO_LIBRARY_ZIP,
    zipName: "ai-trading-bot-cost-library.zip",
    always: true,
    blurb:
      "Download pack for TikTok (9:16) and Rumble (16:9). Paper figures: institutional stack ~$3.8M / year vs eight-bot stack ~$8,700 / year (~99.77%). Education only. Not financial advice. Not a return. Auto trade LOCKED.",
  },
  {
    id: "bowl",
    name: BOWL_LIBRARY_NAME,
    zip: BOWL_LIBRARY_ZIP,
    zipName: "super-bowl-ai-agents-library.zip",
    always: true,
    blurb:
      "Always-on marketing pack for the original S1R1US championship of AI agents. Stadium night, hologram Godzilla, original field art. TikTok 9:16 + Rumble 16:9 + stills. Not affiliated with any football league. Education only.",
  },
];

export const VIDEO_CLIPS: VideoClip[] = [
  {
    id: "cost-tiktok-desk",
    file: "ai-trading-bot-cost-tiktok-desk.mp4",
    href: "/video/ai-trading-bot-cost-tiktok-desk.mp4",
    title: "AI Trading Bot Cost · TikTok desk",
    seo: seoImgAlt(
      "AI Trading Bot Cost TikTok — $3.8M institutional vs $8,700 AI trading bot stack, S1R1US Godzilla hologram, bitcoin accumulation agent",
    ),
    platform: "tiktok",
    aspect: "9:16",
    durationSec: 10,
    pinned: true,
    pack: "cost",
    poster: "/s1r1us-godzilla-logo.jpg",
  },
  {
    id: "cost-rumble-split",
    file: "ai-trading-bot-cost-rumble-split.mp4",
    href: "/video/ai-trading-bot-cost-rumble-split.mp4",
    title: "AI Trading Bot Cost · Rumble split",
    seo: seoImgAlt(
      "AI Trading Bot Cost Rumble — hedge-fund floor vs S1R1US Labs desk, 99.77% cost reduction, AI trading bots bitcoin accumulation agent",
    ),
    platform: "rumble",
    aspect: "16:9",
    durationSec: 10,
    pinned: true,
    pack: "cost",
    poster: "/s1r1us-godzilla-logo.jpg",
  },
  {
    id: "cost-tiktok-hud",
    file: "ai-trading-bot-cost-tiktok-hud.mp4",
    href: "/video/ai-trading-bot-cost-tiktok-hud.mp4",
    title: "AI Trading Bot Cost · TikTok HUD (pinned)",
    seo: seoImgAlt(
      "AI Trading Bot Cost pinned HUD — research $1.5M quants $750k collapse into 7-B0T $8,700, AI agents bitcoin accumulation agent",
    ),
    platform: "tiktok",
    aspect: "9:16",
    durationSec: 10,
    pinned: true,
    pack: "cost",
    poster: "/s1r1us-godzilla-logo.jpg",
  },
  {
    id: "bowl-rumble",
    file: "super-bowl-ai-agents-rumble.mp4",
    href: "/video/super-bowl-ai-agents-rumble.mp4",
    title: "SUP3R B0WL of AI AGENTs · Rumble stadium",
    seo: seoImgAlt(
      "SUP3R B0WL of AI Agents Rumble — original S1R1US championship stadium night, hologram Godzilla, AI agent championship bitcoin accumulation agent",
    ),
    platform: "rumble",
    aspect: "16:9",
    durationSec: 10,
    pinned: true,
    pack: "bowl",
    poster: "/super-bowl-ai-agents-banner.jpg",
  },
  {
    id: "bowl-flyover",
    file: "super-bowl-ai-agents-flyover.mp4",
    href: "/video/super-bowl-ai-agents-flyover.mp4",
    title: "SUP3R B0WL of AI AGENTs · Rumble flyover",
    seo: seoImgAlt(
      "SUP3R B0WL of AI Agents flyover — stadium floodlights, original field, AI agents bitcoin accumulation championship",
    ),
    platform: "rumble",
    aspect: "16:9",
    durationSec: 10,
    pinned: true,
    pack: "bowl",
    poster: "/super-bowl-ai-agents-banner.jpg",
  },
  {
    id: "bowl-tiktok",
    file: "super-bowl-ai-agents-tiktok.mp4",
    href: "/video/super-bowl-ai-agents-tiktok.mp4",
    title: "SUP3R B0WL of AI AGENTs · TikTok field",
    seo: seoImgAlt(
      "SUP3R B0WL of AI Agents TikTok — vertical stadium, hologram Godzilla, AI agent championship bitcoin accumulation agent",
    ),
    platform: "tiktok",
    aspect: "9:16",
    durationSec: 10,
    pinned: true,
    pack: "bowl",
    poster: "/super-bowl-ai-agents-tiktok.jpg",
  },
  {
    id: "bowl-tiktok-hud",
    file: "super-bowl-ai-agents-tiktok-hud.mp4",
    href: "/video/super-bowl-ai-agents-tiktok-hud.mp4",
    title: "SUP3R B0WL of AI AGENTs · TikTok HUD (always)",
    seo: seoImgAlt(
      "SUP3R B0WL of AI Agents TikTok HUD — scoreboard SUP3R B0WL, AI agents bitcoin accumulation agent, original championship",
    ),
    platform: "tiktok",
    aspect: "9:16",
    durationSec: 10,
    pinned: true,
    pack: "bowl",
    poster: "/super-bowl-ai-agents-tiktok.jpg",
  },
];
