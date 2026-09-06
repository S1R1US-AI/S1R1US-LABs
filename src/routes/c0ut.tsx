import { createFileRoute } from "@tanstack/react-router";
import { CalloutWelcomePage } from "@/components/callout-welcome-page";
import { CALLOUT_WELCOME_PATH, PAGE_DESC_CALLOUT_WELCOME, PAGE_TITLE_CALLOUT_WELCOME, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/c0ut")({
  component: CalloutWelcomePage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_CALLOUT_WELCOME },
      { name: "description", content: PAGE_DESC_CALLOUT_WELCOME },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${CALLOUT_WELCOME_PATH}` }],
  }),
});
