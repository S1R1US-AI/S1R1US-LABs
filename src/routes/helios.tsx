import { createFileRoute } from "@tanstack/react-router";
import { HeliosLab } from "@/components/helios-lab";
import { PAGE_DESC_LAB, PAGE_TITLE_LAB, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/helios")({
  component: HeliosLab,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_LAB },
      { name: "description", content: PAGE_DESC_LAB },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/helios" }],
  }),
});
