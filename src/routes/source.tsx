import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/source")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
  component: () => null,
});
