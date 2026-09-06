import { createFileRoute } from "@tanstack/react-router";
import { CoffeePage } from "@/components/coffee-page";
import { PAGE_DESC_COFFEE, PAGE_TITLE_COFFEE, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/c0ff33")({
  component: CoffeePage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_COFFEE },
      { name: "description", content: PAGE_DESC_COFFEE },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/c0ff33" }],
  }),
});
