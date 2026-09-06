import { useEffect } from "react";
import { useAutoRun } from "@/lib/desk/auto-run";
import { useGm } from "@/lib/desk/gm-store";
import { usePractice } from "@/lib/desk/practice";

/**
 * Stop paper fills and extra AUTO ticks. Live tape still runs.
 * Purchase calls on the desk are computed from the live snapshot (would-accumulate).
 */
export function PracticeEngine() {
  useEffect(() => {
    function halt() {
      useAutoRun.getState().pauseUntilNotice();
      usePractice.setState({ running: false, busy: false, error: null });
      useGm.setState({ running: false, liveUnlocked: false, busy: false, error: null });
    }
    halt();
    const unsub = useAutoRun.persist.onFinishHydration(halt);
    return () => unsub();
  }, []);
  return null;
}
