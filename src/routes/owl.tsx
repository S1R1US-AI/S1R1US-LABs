import { createFileRoute } from "@tanstack/react-router";
import { OwlPage } from "@/components/owl-page";
import { OWL_PATH, PAGE_DESC_OWL, PAGE_TITLE_OWL, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/owl")({
  component: OwlPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_OWL },
      { name: "description", content: PAGE_DESC_OWL },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${OWL_PATH}` }],
  }),
});
