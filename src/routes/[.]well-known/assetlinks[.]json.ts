import { createFileRoute } from "@tanstack/react-router";
import { assetLinks } from "@/lib/desk/mobile-bridge";

export const Route = createFileRoute("/.well-known/assetlinks.json")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify(assetLinks()), {
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=300",
          },
        }),
    },
  },
});
