import { DESK_POLL_MS } from "./poll";
import { useGm } from "./gm-store";
import { usePractice } from "./practice";
import { pullDeskTape } from "./tape-client";

/** Force a live Coinbase cycle, then re-vote Bot 7 and bots 1–6 (scan only unless fills are armed). */
export async function rollBots(opts?: { force?: boolean; admin?: boolean }) {
  await pullDeskTape({ force: opts?.force });
  await Promise.all([
    useGm.getState().tick({ admin: Boolean(opts?.admin) }),
    usePractice.getState().tick(),
  ]);
}

export { DESK_POLL_MS };
