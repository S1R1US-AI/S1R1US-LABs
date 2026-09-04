import { createFileRoute } from "@tanstack/react-router";
import { SitemapPage } from "@/components/sitemap-page";
import { LABS_NAME, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/sitemap")({
  component: SitemapPage,
  head: () => ({
    meta: [
      { title: `Sitemap · ${LABS_NAME}` },
      {
        name: "description",
        content:
          "Sitemap for S1R1US Labs: S1R1U$ 7-B0t Hedge Fund, G0DZ1LLa M0D3 (Godzilla mode), S1R1U$ L@B Strategies, FAQ, OP3N S0URC3 open source.",
      },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/sitemap" }],
  }),
});
