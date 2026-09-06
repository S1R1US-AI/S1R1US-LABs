import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/privacy-page";
import { PAGE_DESC_PRIVACY, PAGE_TITLE_PRIVACY, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_PRIVACY },
      { name: "description", content: PAGE_DESC_PRIVACY },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/privacy" }],
  }),
});
