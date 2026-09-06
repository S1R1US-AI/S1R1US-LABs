import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/security")({
  beforeLoad: () => {
    throw redirect({ to: "/admin", hash: "security" });
  },
});