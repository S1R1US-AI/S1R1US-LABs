import { createFileRoute } from "@tanstack/react-router";
import { MobileAppPage } from "@/components/mobile-app-page";
import { PAGE_DESC_APP, PAGE_TITLE_APP, PLAY_PATH, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/play")({
  component: MobileAppPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_APP },
      { name: "description", content: PAGE_DESC_APP },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${PLAY_PATH}` }],
  }),
});
