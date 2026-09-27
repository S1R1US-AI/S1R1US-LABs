import { createFileRoute } from "@tanstack/react-router";
import { DeskApp } from "@/components/desk-app";
import { S1r1usSite } from "@/components/s1r1us-site";
import { isMarketingHost } from "@/lib/launch/host";
import { SEO_CANONICAL, SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from "@/lib/brand";
import { useWindowHostname } from "@/lib/react/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => isMarketingHost(),
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: SEO_CANONICAL }],
  }),
  component: Home,
});

function Home() {
  const { marketing } = Route.useRouteContext();
  const host = useWindowHostname().toLowerCase();
  const hostPub = host === "s1r1us.ai" || host === "www.s1r1us.ai";
  if (marketing || hostPub) return <S1r1usSite />;
  return <DeskApp />;
}
