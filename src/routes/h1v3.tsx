import { createFileRoute } from "@tanstack/react-router";
import { HivePage } from "@/components/hive-page";
import { HIVE_PATH, PAGE_DESC_HIVE, PAGE_TITLE_HIVE, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/h1v3")({
  component: HivePage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_HIVE },
      { name: "description", content: PAGE_DESC_HIVE },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${HIVE_PATH}` }],
  }),
});
