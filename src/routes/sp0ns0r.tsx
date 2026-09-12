import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sp0ns0r")({
  beforeLoad: () => {
    throw redirect({ to: "/sponsor-ai-bitcoin-trading-bot", replace: true });
  },
  component: () => null,
});
