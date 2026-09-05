import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old / mistaken path. Apex home is https://s1r1us.ai/ — not /heliosbot. */
export const Route = createFileRoute("/heliosbot")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
