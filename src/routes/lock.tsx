import { createFileRoute, redirect } from "@tanstack/react-router";
import { LOCK_PATH } from "@/lib/brand";

export const Route = createFileRoute("/lock")({
  beforeLoad: () => {
    throw redirect({ to: LOCK_PATH });
  },
});
