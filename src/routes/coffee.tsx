import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/coffee")({
  beforeLoad: () => {
    throw redirect({ to: "/c0ff33", replace: true });
  },
  component: () => null,
});
