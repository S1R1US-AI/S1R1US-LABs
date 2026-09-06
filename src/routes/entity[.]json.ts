import { createFileRoute } from "@tanstack/react-router";
import { SEO_CANONICAL, SEO_DESCRIPTION, LABS_NAME, APP_NAME } from "@/lib/brand";
import { corporateSearchGraph, videoObjectGraph } from "@/lib/desk/search-graph";
import { liveSameAs, OFFICIAL_PROPERTIES, FOUNDING_DATE } from "@/lib/desk/official-presence";

export const Route = createFileRoute("/entity.json")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          JSON.stringify(
            {
              "@context": "https://schema.org",
              name: LABS_NAME,
              alternateName: [APP_NAME, "S1R1US AI"],
              url: SEO_CANONICAL,
              description: SEO_DESCRIPTION,
              foundingDate: FOUNDING_DATE,
              sameAs: liveSameAs(),
              officialProperties: OFFICIAL_PROPERTIES,
              "@graph": [...corporateSearchGraph(), ...videoObjectGraph()],
            },
            null,
            2,
          ),
          {
            headers: {
              "content-type": "application/ld+json; charset=utf-8",
              "cache-control": "public, max-age=300",
            },
          },
        ),
    },
  },
});
