import { createFileRoute } from "@tanstack/react-router";
import { BitcoinMinersPage } from "@/components/bitcoin-miners-page";
import { MINERS_PATH, PAGE_DESC_MINERS, PAGE_TITLE_MINERS, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/Bitcoin-Miners")({
  component: BitcoinMinersPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_MINERS },
      { name: "description", content: PAGE_DESC_MINERS },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${MINERS_PATH}` }],
  }),
});
