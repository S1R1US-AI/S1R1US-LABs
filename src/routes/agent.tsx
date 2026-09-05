import { createFileRoute } from "@tanstack/react-router";
import { AgentFeedPage } from "@/components/agent-feed-page";
import { PAGE_DESC_AGENT, PAGE_TITLE_AGENT, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/agent")({
  component: AgentFeedPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_AGENT },
      { name: "description", content: PAGE_DESC_AGENT },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/agent" }],
  }),
});
