import { create } from "zustand";
import { persist } from "zustand/middleware";

type LaunchState = {
  done: Record<string, boolean>;
  toggle: (id: string) => void;
  reset: () => void;
};

export const useLaunchChecks = create<LaunchState>()(
  persist(
    (set, get) => ({
      done: {},
      toggle: (id) => set({ done: { ...get().done, [id]: !get().done[id] } }),
      reset: () => set({ done: {} }),
    }),
    { name: "s1rius-launch-checks-v1" },
  ),
);
