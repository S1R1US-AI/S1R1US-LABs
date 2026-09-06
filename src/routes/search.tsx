import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/components/search-page";
import { PAGE_DESC_SEARCH, PAGE_TITLE_SEARCH, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: PAGE_TITLE_SEARCH },
      { name: "description", content: PAGE_DESC_SEARCH },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/search" }],
  }),
});
