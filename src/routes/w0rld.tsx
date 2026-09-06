import { createFileRoute } from "@tanstack/react-router";
import { CupPage } from "@/components/cup-page";
import { CUP_PATH, PAGE_DESC_CUP, PAGE_TITLE_CUP, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/w0rld")({
  component: CupPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_CUP },
      { name: "description", content: PAGE_DESC_CUP },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${CUP_PATH}` }],
  }),
});
