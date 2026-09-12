import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old Helios-era path. S1R1US L@Bs (S1R1US Lab Strategies) lives at /labs. */
export const Route = createFileRoute("/helios")({
  beforeLoad: () => {
    throw redirect({ to: "/labs", replace: true });
  },
});
