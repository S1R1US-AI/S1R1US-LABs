import { createFileRoute, redirect } from "@tanstack/react-router";
import { LOCK_PATH } from "@/lib/brand";

export const Route = createFileRoute("/lock3d")({
  beforeLoad: () => {
    throw redirect({ to: LOCK_PATH });
  },
});
