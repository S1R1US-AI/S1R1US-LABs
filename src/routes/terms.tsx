import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/terms-page";
import { PAGE_DESC_TERMS, PAGE_TITLE_TERMS, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_TERMS },
      { name: "description", content: PAGE_DESC_TERMS },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/terms" }],
  }),
});
