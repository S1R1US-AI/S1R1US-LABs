import { createFileRoute } from "@tanstack/react-router";
import { SponsorPage } from "@/components/sponsor-page";
import { PAGE_DESC_SPONSOR, PAGE_TITLE_SPONSOR, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/sponsor-ai-bitcoin-trading-bot")({
  component: SponsorPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_SPONSOR },
      { name: "description", content: PAGE_DESC_SPONSOR },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/sponsor-ai-bitcoin-trading-bot" }],
  }),
});
