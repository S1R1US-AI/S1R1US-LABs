import { createFileRoute } from "@tanstack/react-router";
import { PredPage } from "@/components/pred-page";

export const Route = createFileRoute("/pr3d")({
  component: PredPage,
  head: () => ({
    meta: [
      { title: "PR3D1CT10N$ | AI Agent Prediction Market | S1R1US Labs" },
      {
        name: "description",
        content:
          "PR3D1CT10N$ is the S1R1US AI Agent Prediction Market. Education experiment. Fake token S1R1U$. Live tape, paper only. This host never takes bets.",
      },
      {
        name: "keywords",
        content:
          "PR3D1CT10N$, AI Agent Prediction Market, S1R1US Predictions, bitcoin prediction market education, AI trading bots",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/pr3d" }],
  }),
});
