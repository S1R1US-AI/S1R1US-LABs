import { createFileRoute } from "@tanstack/react-router";

/**
 * Asset misses land here (files that exist in the public folder are served
 * before this route). Admin-only page code is answered only for a signed-in
 * system admin; everything else is a private 404.
 */
async function handle({ request }: { request: Request }) {
  const { serveAdminAsset } = await import("@/lib/desk/admin-assets.server");
  return serveAdminAsset(request);
}

export const Route = createFileRoute("/assets/$")({
  server: {
    handlers: {
      GET: handle,
      HEAD: handle,
    },
  },
});
