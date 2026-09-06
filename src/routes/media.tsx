import { createFileRoute } from "@tanstack/react-router";
import { MediaPage } from "@/components/media-page";
import { PAGE_DESC_MEDIA, PAGE_TITLE_MEDIA, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/media")({
  component: MediaPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_MEDIA },
      { name: "description", content: PAGE_DESC_MEDIA },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/media" }],
  }),
});
