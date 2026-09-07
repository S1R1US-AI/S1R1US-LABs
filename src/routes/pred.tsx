import { createFileRoute, redirect } from "@tanstack/react-router";
import { PRED_PATH } from "@/lib/brand";

export const Route = createFileRoute("/pred")({
  beforeLoad: () => {
    throw redirect({ to: PRED_PATH });
  },
});
