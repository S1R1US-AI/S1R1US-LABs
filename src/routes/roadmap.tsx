import { createFileRoute } from "@tanstack/react-router";
import { OssRoadmapPage } from "@/components/oss-roadmap-page";
import { OSS_ROADMAP_PATH, PAGE_DESC_OSS_ROADMAP, PAGE_TITLE_OSS_ROADMAP, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/roadmap")({
  component: OssRoadmapPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_OSS_ROADMAP },
      { name: "description", content: PAGE_DESC_OSS_ROADMAP },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${OSS_ROADMAP_PATH}` }],
  }),
});
