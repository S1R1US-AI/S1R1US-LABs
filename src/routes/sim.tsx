import { createFileRoute, redirect } from "@tanstack/react-router";
import { CALLOUT_WELCOME_PATH } from "@/lib/brand";

export const Route = createFileRoute("/sim")({
  beforeLoad: () => {
    throw redirect({ to: CALLOUT_WELCOME_PATH });
  },
  component: () => null,
});
