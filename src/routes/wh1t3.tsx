import { createFileRoute } from "@tanstack/react-router";
import { WhiteLabelPage } from "@/components/white-label-page";
import { PAGE_DESC_WHITE, PAGE_TITLE_WHITE, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/wh1t3")({
  component: WhiteLabelPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_WHITE },
      { name: "description", content: PAGE_DESC_WHITE },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/wh1t3" }],
  }),
});
