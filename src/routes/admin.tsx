import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin-panel";
import { APP_NAME } from "@/lib/brand";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
  head: () => ({
    meta: [
      { title: `Admin · ${APP_NAME}` },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});
