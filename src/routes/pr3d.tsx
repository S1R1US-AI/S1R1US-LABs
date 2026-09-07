import { createFileRoute } from "@tanstack/react-router";
import { PredPage } from "@/components/pred-page";
import { PAGE_DESC_PRED, PAGE_TITLE_PRED, PRED_PATH, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/pr3d")({
  component: PredPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_PRED },
      { name: "description", content: PAGE_DESC_PRED },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${PRED_PATH}` }],
  }),
});
