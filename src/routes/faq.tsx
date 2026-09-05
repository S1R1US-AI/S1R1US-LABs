import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/faq-page";
import { PAGE_DESC_FAQ, PAGE_TITLE_FAQ, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_FAQ },
      { name: "description", content: PAGE_DESC_FAQ },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/faq" }],
  }),
});
