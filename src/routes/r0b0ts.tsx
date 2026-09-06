import { createFileRoute } from "@tanstack/react-router";
import { RobotsPage } from "@/components/robots-page";
import { PAGE_DESC_ROBOTS, PAGE_TITLE_ROBOTS, ROBOTS_PATH, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/r0b0ts")({
  component: RobotsPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_ROBOTS },
      { name: "description", content: PAGE_DESC_ROBOTS },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${ROBOTS_PATH}` }],
  }),
});
