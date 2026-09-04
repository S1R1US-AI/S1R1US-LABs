import { useEffect } from "react";
import { useAutoRun } from "@/lib/desk/auto-run";
import { useGm } from "@/lib/desk/gm-store";
import { usePractice } from "@/lib/desk/practice";

/**
 * Client AUTO ticks were the refresh loop (pull + paper setState on a timer).
 * 24h paper fills run on the server after each tape fill. This engine does not poll.
 */
export function PracticeEngine() {
  useEffect(() => {
    function kickoff() {
      if (!useAutoRun.persist.hasHydrated()) return;
      const auto = useAutoRun.getState();
      if (!auto.paused) auto.pauseUntilNotice();
      usePractice.setState({ running: false, ticks: [], lastTick: null, busy: false });
      useGm.setState({ running: false, liveUnlocked: false, ticks: [], lastTick: null, busy: false });
    }
    kickoff();
    const unsub = useAutoRun.persist.onFinishHydration(kickoff);
    return () => unsub();
  }, []);
  return null;
}
