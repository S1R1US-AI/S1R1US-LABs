import { createFileRoute } from "@tanstack/react-router";
import { AdminEntry } from "@/components/admin-entry";
import { APP_NAME } from "@/lib/brand";

export const Route = createFileRoute("/admin")({
  component: AdminEntry,
  head: () => ({
    meta: [
      { title: `Admin · ${APP_NAME}` },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});
