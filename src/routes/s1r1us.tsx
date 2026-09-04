import { createFileRoute } from "@tanstack/react-router";
import { S1r1usSite } from "@/components/s1r1us-site";
import { SEO_CANONICAL, SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from "@/lib/brand";

export const Route = createFileRoute("/s1r1us")({
  component: S1r1usSite,
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: SEO_CANONICAL }],
  }),
});