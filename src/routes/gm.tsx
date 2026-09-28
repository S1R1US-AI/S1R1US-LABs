import { createFileRoute, redirect } from "@tanstack/react-router";
import { GM_PATH } from "@/lib/brand";

/** Legacy /gm → /Godzilla-Mode (bookmarks + deep links #auto / #manual). */
export const Route = createFileRoute("/gm")({
  beforeLoad: () => {
    throw redirect({ to: GM_PATH, replace: true });
  },
  component: () => null,
});
