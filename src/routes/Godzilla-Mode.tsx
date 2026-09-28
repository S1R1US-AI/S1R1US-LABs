import { createFileRoute } from "@tanstack/react-router";
import { GmDesk } from "@/components/gm-desk";
import { GM_PATH, PAGE_DESC_GM, PAGE_TITLE_GM, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/Godzilla-Mode")({
  component: GmDesk,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_GM },
      { name: "description", content: PAGE_DESC_GM },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${GM_PATH}` }],
  }),
});
