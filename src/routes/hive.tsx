import { createFileRoute, redirect } from "@tanstack/react-router";
import { HIVE_PATH } from "@/lib/brand";

export const Route = createFileRoute("/hive")({
  beforeLoad: () => {
    throw redirect({ to: HIVE_PATH });
  },
});
