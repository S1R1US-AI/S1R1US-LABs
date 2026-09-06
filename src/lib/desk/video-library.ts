/** Pinned AI Trading Bot Cost pack for TikTok + Rumble. Education only. */

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
};

export const VIDEO_LIBRARY_ZIP = "/video/ai-trading-bot-cost-library.zip";
export const VIDEO_LIBRARY_NAME = "AI Trading Bot Cost (pinned)";

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
  },
];
