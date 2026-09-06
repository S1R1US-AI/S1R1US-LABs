import { createFileRoute } from "@tanstack/react-router";
import { appleAppSiteAssociation } from "@/lib/desk/mobile-bridge";

export const Route = createFileRoute("/.well-known/apple-app-site-association")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify(appleAppSiteAssociation()), {
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=300",
          },
        }),
    },
  },
});
