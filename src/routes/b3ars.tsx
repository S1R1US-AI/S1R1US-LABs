import { createFileRoute } from "@tanstack/react-router";
import { BearsPage } from "@/components/bears-page";
import { BEARS_PATH, PAGE_DESC_BEARS, PAGE_TITLE_BEARS, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/b3ars")({
  component: BearsPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_BEARS },
      { name: "description", content: PAGE_DESC_BEARS },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${BEARS_PATH}` }],
  }),
});
