import { createFileRoute } from "@tanstack/react-router";
import { F33dPage } from "@/components/f33d-page";
import { SEO_KEYWORDS, TAB_FEED, TAB_FEED_GROWL } from "@/lib/brand";

export const Route = createFileRoute("/f33d")({
  component: F33dPage,
  head: () => ({
    meta: [
      { title: TAB_FEED },
      { name: "description", content: TAB_FEED_GROWL },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/f33d" }],
  }),
});
