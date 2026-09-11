/**
 * Screensaver lock policy. System-admin controlled from Admin → Security.
 *
 * Two savers exist:
 *  - GM rain: 2.5 s G0DZ1LLa M0D3 burst every time /gm opens. Never locks.
 *  - Matrix classic: full-screen rain after 5 minutes of no user activity.
 *
 * LOCKED   → an idle trip signs the operator out and requires login again.
 * UNLOCKED → the idle saver only displays; any activity dismisses it.
 * Only a system admin flips this switch. Client-safe, zustand persist.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SAVER_IDLE_MS = 5 * 60 * 1000;
export const GM_BURST_MS = 2_500;

type SaverLockState = {
  /** true = idle saver logs the session out and requires re-login. */
  locked: boolean;
  setLocked: (locked: boolean) => void;
};

export const useSaverLock = create<SaverLockState>()(
  persist(
    (set) => ({
      locked: true,
      setLocked: (locked) => set({ locked: Boolean(locked) }),
    }),
    { name: "s1r1us-saver-lock" },
  ),
);

/** Read outside React. Defaults to LOCKED (admin sessions re-auth on idle). */
export function saverLockEnabled() {
  return useSaverLock.getState().locked;
}

export function saverLockLabel(locked = saverLockEnabled()) {
  return locked
    ? "LOCKED — idle screensaver signs the session out; login required to continue."
    : "UNLOCKED — idle screensaver displays after 5 minutes but never locks the system.";
}
