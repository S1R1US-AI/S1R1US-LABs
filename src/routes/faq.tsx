import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/faq-page";
import { SEO_KEYWORDS, TAB_DESK, TAB_GM, TAB_LAB } from "@/lib/brand";

const TITLE = `FAQ · ${TAB_DESK} · ${TAB_GM} · ${TAB_LAB} · OP3N S0URC3`;
const DESC =
  "FAQ for S1R1U$ 7-B0t Hedge Fund (S1R1US 7-bot hedge fund), G0DZ1LLa M0D3 (Godzilla mode), S1R1U$ L@B Strategies (S1R1US Lab Strategies), OP3N S0URC3 (open source). AI Bitcoin trading bot, AI stock trading bot, AI Hedge Fund. Not financial advice.";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/faq" }],
  }),
});
