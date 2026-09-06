/** Client store for iOS / Google copy-admin. Never writes h3-op-token. */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { claimCopyAdmin, peekCopyAdmin } from "./access";
import { APP_ADMIN_PATH, APP_ADMIN_ROLE, type AppAdminKind } from "./tenancy";

const TOKEN_KEY = "h3-app-token";

export type AppAdminYou = {
  id: string;
  at: string;
  kind: AppAdminKind;
  handle: string;
  label: string;
};

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeToken(token: string) {
  try {
    if (token && token.startsWith("app.")) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
}

type State = {
  token: string;
  unlocked: boolean;
  you: AppAdminYou | null;
  path: string;
  claim: (input: {
    kind: string;
    handle: string;
    label?: string;
    mandate: boolean;
  }) => Promise<string | null>;
  refresh: () => Promise<void>;
  lock: () => void;
};

export const useAppAdmin = create<State>()(
  persist(
    (set, get) => ({
      token: "",
      unlocked: false,
      you: null,
      path: APP_ADMIN_PATH,
      claim: async (input) => {
        const res = await claimCopyAdmin({
          data: {
            kind: input.kind,
            handle: input.handle,
            label: input.label,
            mandate: input.mandate,
          },
        });
        if (!res.ok) return res.error;
        writeToken(res.token);
        set({
          token: res.token,
          unlocked: true,
          you: res.you,
          path: res.public.path,
        });
        return null;
      },
      refresh: async () => {
        const token = get().token || readToken();
        if (!token.startsWith("app.")) {
          writeToken("");
          set({ token: "", unlocked: false, you: null });
          return;
        }
        const res = await peekCopyAdmin({ data: { token } });
        if (!res.ok) {
          writeToken("");
          set({ token: "", unlocked: false, you: null });
          return;
        }
        set({ token, unlocked: true, you: res.you, path: res.public.path });
      },
      lock: () => {
        writeToken("");
        set({ token: "", unlocked: false, you: null });
      },
    }),
    {
      name: "h3-app-admin-lock",
      partialize: (s) => ({ you: s.you }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const token = readToken();
        if (!token.startsWith("app.")) {
          state.token = "";
          state.unlocked = false;
          state.you = null;
          return;
        }
        state.token = token;
        state.unlocked = true;
      },
    },
  ),
);

export const APP_ADMIN_ROLE_CLIENT = APP_ADMIN_ROLE;
