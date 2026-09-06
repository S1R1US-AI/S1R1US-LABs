import { createFileRoute, redirect } from "@tanstack/react-router";
import { CUP_PATH } from "@/lib/brand";

export const Route = createFileRoute("/world-cup")({
  beforeLoad: () => {
    throw redirect({ to: CUP_PATH });
  },
  component: () => null,
});
