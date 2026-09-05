import { createFileRoute } from "@tanstack/react-router";
import { SitemapPage } from "@/components/sitemap-page";
import { PAGE_DESC_SITEMAP, PAGE_TITLE_SITEMAP, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/sitemap")({
  component: SitemapPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_SITEMAP },
      { name: "description", content: PAGE_DESC_SITEMAP },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/sitemap" }],
  }),
});
