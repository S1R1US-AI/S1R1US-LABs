import { createFileRoute } from "@tanstack/react-router";
import { pwaManifest } from "@/lib/desk/mobile-bridge";

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify(pwaManifest()), {
          headers: {
            "content-type": "application/manifest+json; charset=utf-8",
            "cache-control": "public, max-age=300",
          },
        }),
    },
  },
});
