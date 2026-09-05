import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/terms-page";
import { SEO_KEYWORDS } from "@/lib/brand";
import { LEGAL_NFA, TERMS_TITLE } from "@/lib/legal";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: `${TERMS_TITLE} · T0K3N L@UNCH (Token launch) · not financial advice` },
      {
        name: "description",
        content: `Terms and Agreements for s1r1us.ai. Using this website constitutes agreement. ${LEGAL_NFA}`,
      },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://s1r1us.ai/terms" }],
  }),
});
