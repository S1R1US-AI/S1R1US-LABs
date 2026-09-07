import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pred")({
  beforeLoad: () => {
    throw redirect({ to: "/roadmap", hash: "pred-footnote" });
  },
});
