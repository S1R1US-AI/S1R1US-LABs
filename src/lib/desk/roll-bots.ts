import { LAUNCH_FREEZE } from "@/lib/launch/build";
import { DESK_POLL_MS } from "./poll";
import { useAutoRun } from "./auto-run";
import { useGm } from "./gm-store";
import { usePractice } from "./practice";
import { pullDeskTape } from "./tape-client";

/** Live Coinbase cycle. Under LAUNCH_FREEZE: scan/vote only — no practice or GM paper fills. */
export async function rollBots(opts?: { force?: boolean; admin?: boolean }) {
  if (LAUNCH_FREEZE) {
    usePractice.setState({ running: false });
    useGm.setState({ running: false, liveUnlocked: false });
    useAutoRun.getState().pauseUntilNotice();
  }
  await pullDeskTape({ force: opts?.force });
  await Promise.all([
    useGm.getState().tick({ admin: Boolean(opts?.admin) }),
    usePractice.getState().tick(),
  ]);
}

export { DESK_POLL_MS };
