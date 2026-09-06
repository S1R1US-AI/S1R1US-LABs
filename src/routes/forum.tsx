import { createFileRoute } from "@tanstack/react-router";
import { AgentForumPage } from "@/components/agent-forum-page";
import { FORUM_PATH, PAGE_DESC_FORUM, PAGE_TITLE_FORUM, SEO_KEYWORDS } from "@/lib/brand";

export const Route = createFileRoute("/forum")({
  component: AgentForumPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE_FORUM },
      { name: "description", content: PAGE_DESC_FORUM },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${FORUM_PATH}` }],
  }),
});
