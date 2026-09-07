import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/predictions")({
  beforeLoad: () => {
    throw redirect({ to: "/roadmap", hash: "pred-footnote" });
  },
});
