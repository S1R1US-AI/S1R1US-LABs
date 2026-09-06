import { createFileRoute } from "@tanstack/react-router";
import { sitemapIndexXml } from "@/lib/desk/public-nav";

export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapIndexXml(), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=300",
          },
        }),
    },
  },
});
