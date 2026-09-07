import { createFileRoute, redirect } from "@tanstack/react-router";
import { OSS_ROADMAP_PATH } from "@/lib/brand";

export const Route = createFileRoute("/oss-roadmap")({
  beforeLoad: () => {
    throw redirect({ to: OSS_ROADMAP_PATH });
  },
});
