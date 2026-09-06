import { createFileRoute } from "@tanstack/react-router";
import { GmBoardProfile } from "@/components/gm-board-profile";
import { MENU_BOARD, PAGE_DESC_BOARD, SEO_KEYWORDS, SEO_TAB_LEADERBOARD, seoBotTitle } from "@/lib/brand";

export const Route = createFileRoute("/board/$id")({
  component: BoardProfileRoute,
  head: ({ params }) => ({
    meta: [
      { title: seoBotTitle(`${params.id} · ${MENU_BOARD} (${SEO_TAB_LEADERBOARD}) | W1S3 0WL$ profile | OP3N S0URC3`) },
      { name: "description", content: PAGE_DESC_BOARD },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai/board/${params.id}` }],
  }),
});

function BoardProfileRoute() {
  const { id } = Route.useParams();
  return <GmBoardProfile id={id} />;
}
