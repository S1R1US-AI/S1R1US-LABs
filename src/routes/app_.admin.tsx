import { createFileRoute } from "@tanstack/react-router";
import { AppAdminPanel } from "@/components/app-admin-panel";
import { APP_NAME } from "@/lib/brand";
import { APP_ADMIN_PATH } from "@/lib/desk/tenancy";

export const Route = createFileRoute("/app_/admin")({
  component: AppAdminPanel,
  head: () => ({
    meta: [
      { title: `Admin · ${APP_NAME}` },
      { name: "robots", content: "noindex,nofollow" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [{ rel: "canonical", href: `https://s1r1us.ai${APP_ADMIN_PATH}` }],
  }),
});
