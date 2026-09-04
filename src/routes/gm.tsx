import { createFileRoute } from "@tanstack/react-router";
import { GmDesk } from "@/components/gm-desk";
import { TAB_GM } from "@/lib/brand";

export const Route = createFileRoute("/gm")({
  component: GmDesk,
  head: () => ({
    meta: [{ title: TAB_GM }],
  }),
});
