import { createFileRoute } from "@tanstack/react-router";
import { MobileAppPage } from "@/components/mobile-app-page";
import { IOS_PATH, PAGE_DESC_APP, PAGE_TITLE_APP, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/ios")({
  component: MobileAppPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_APP },
      { name: "description", content: PAGE_DESC_APP },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${IOS_PATH}` }],
  }),
});
