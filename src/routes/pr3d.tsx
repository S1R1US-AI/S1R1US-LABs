import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pr3d")({
  beforeLoad: () => {
    throw redirect({ to: "/roadmap", hash: "pred-footnote" });
  },
});
