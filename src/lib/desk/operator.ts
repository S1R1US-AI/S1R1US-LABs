import { create } from "zustand";
import { persist } from "zustand/middleware";
import { bumpDeskEpoch, changeAdminCreds, completeAdminReset, confirmWebauthn, confirmYubi, renewAdminPasswordWithX, requestAdminReset, signInDesk, unlockBoundX, webauthnBeginLogin } from "./access";
import { signOut } from "@/lib/auth/client";

export type AuditEvent = {
  id: string;
  at: string;
  kind: "unlock" | "lock" | "fill" | "grok" | "copy" | "reject" | "password" | "treasury" | "yubi";
  note: string;
};

const TOKEN_KEY = "h3-op-token";
const ROLE_KEY = "h3-op-role";
const NAME_KEY = "h3-op-name";
const IDLE_FLAG = "h3-idle-lock";

function readSessionToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

function readSessionRole(): "admin" | "user" | "" {
  try {
    const r = sessionStorage.getItem(ROLE_KEY);
    return r === "admin" || r === "user" ? r : "";
  } catch {
    return "";
  }
}

function readSessionName() {
  try {
    return sessionStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeSessionToken(token: string, role = "", name = "") {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(ROLE_KEY, role);
      sessionStorage.setItem(NAME_KEY, name);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(ROLE_KEY);
      sessionStorage.removeItem(NAME_KEY);
    }
  } catch {
    /* private mode */
  }
}

function clearIdleFlag() {
  try {
    localStorage.removeItem(IDLE_FLAG);
  } catch {
    /* private mode */
  }
}

function raiseIdleFlag() {
  try {
    localStorage.setItem(IDLE_FLAG, String(Date.now()));
  } catch {
    /* private mode */
  }
}

type OpState = {
  token: string;
  yubiTicket: string;
  unlocked: boolean;
  idleLocked: boolean;
  role: "admin" | "user" | "";
  operatorName: string;
  audit: AuditEvent[];
  unlock: (user: string, pass: string) => Promise<string | null>;
  unlockBound: () => Promise<string | null>;
  requestReset: () => Promise<string | null>;
  completeReset: (token: string, next: string, confirm: string) => Promise<string | null>;
  renewWithX: (next: string, confirm: string, nextName?: string) => Promise<string | null>;
  openRenew: (next: string, confirm: string) => Promise<string | null>;
  tapYubi: (otp: string) => Promise<string | null>;
  tapWebauthn: () => Promise<string | null>;
  changeCreds: (current: string, next: string, confirm: string, nextName: string) => Promise<string | null>;
  lock: () => void | Promise<void>;
  lockFromIdle: () => Promise<void>;
  log: (kind: AuditEvent["kind"], note: string) => void;
};

export const useOperator = create<OpState>()(
  persist(
    (set, get) => ({
      token: "",
      yubiTicket: "",
      unlocked: false,
      idleLocked: false,
      role: "",
      operatorName: "",
      audit: [],
      unlock: async (user, pass) => {
        const res = await signInDesk({ data: { user, pass } });
        if (!res.ok) {
          get().log("reject", "Sign-in failed");
          return res.error;
        }
        if (res.needYubi) {
          const operatorName = "username" in res ? res.username : "";
          set({ yubiTicket: res.ticket, token: "", unlocked: false, role: "", operatorName });
          get().log("yubi", "YubiKey tap required");
          return "yubi";
        }
        const role = "role" in res ? res.role : "admin";
        const operatorName = "username" in res ? res.username : "";
        writeSessionToken(res.token, role, operatorName);
        clearIdleFlag();
        set({ token: res.token, unlocked: true, yubiTicket: "", idleLocked: false, role, operatorName });
        get().log("unlock", role === "user" ? `User session (${operatorName})` : "Admin session open");
        return null;
      },
      unlockBound: async () => {
        const res = await unlockBoundX();
        if (!res.ok) {
          get().log("reject", "X admin unlock failed");
          return res.error;
        }
        if ("needPassword" in res && res.needPassword) {
          get().log("unlock", "Operator X verified — admin name + password still required");
          return "need-password";
        }
        get().log("reject", "X alone cannot open admin");
        return "Admin requires X and password.";
      },
      requestReset: async () => {
        const res = await requestAdminReset();
        if (!res.ok) {
          get().log("reject", "Password renew request failed");
          return res.error;
        }
        get().log("password", res.mailed ? "Password renew mailed" : "Password renew — set here (mailbox transport off)");
        return res.mailed ? null : "mailbox-offline";
      },
      completeReset: async (token, next, confirm) => {
        const res = await completeAdminReset({ data: { token, next, confirm } });
        if (!res.ok) {
          get().log("reject", "Password renew failed");
          return res.error;
        }
        get().log("password", "Admin password renewed from mailbox link");
        return null;
      },
      renewWithX: async (next, confirm, nextName) => {
        const res = await renewAdminPasswordWithX({ data: { next, confirm, nextName } });
        if (!res.ok) {
          get().log("reject", "Password renew failed");
          return res.error;
        }
        writeSessionToken(res.token, "admin", res.adminName);
        clearIdleFlag();
        set({ token: res.token, unlocked: true, yubiTicket: "", idleLocked: false, role: "admin", operatorName: res.adminName });
        get().log("password", "Admin password renewed by operator X");
        return null;
      },
      openRenew: async (next, confirm) => {
        return get().renewWithX(next, confirm);
      },
      tapYubi: async (otp) => {
        const res = await confirmYubi({ data: { ticket: get().yubiTicket, otp } });
        if (!res.ok) {
          get().log("reject", "YubiKey failed");
          return res.error;
        }
        const operatorName = "username" in res ? res.username : get().operatorName;
        writeSessionToken(res.token, "admin", operatorName);
        clearIdleFlag();
        set({ token: res.token, unlocked: true, yubiTicket: "", idleLocked: false, role: "admin", operatorName });
        get().log("unlock", "YubiKey accepted");
        return null;
      },
      tapWebauthn: async () => {
        const ticket = get().yubiTicket;
        if (!ticket) return "YubiKey challenge expired. Unlock again.";
        try {
          const { clientOrigin, getYubiAssertion } = await import("./webauthn-client");
          const begin = await webauthnBeginLogin({ data: { ticket, origin: clientOrigin() } });
          if (!begin.ok) {
            get().log("reject", "YubiKey FIDO2 failed");
            return begin.error;
          }
          const assertion = await getYubiAssertion(begin.options);
          const res = await confirmWebauthn({
            data: {
              ticket,
              origin: clientOrigin(),
              challenge: assertion.challenge,
              credentialId: assertion.credentialId,
              authenticatorData: assertion.authenticatorData,
              clientDataJSON: assertion.clientDataJSON,
              signature: assertion.signature,
            },
          });
          if (!res.ok) {
            get().log("reject", "YubiKey FIDO2 failed");
            return res.error;
          }
          const operatorName = "username" in res ? res.username : get().operatorName;
          writeSessionToken(res.token, "admin", operatorName);
          clearIdleFlag();
          set({ token: res.token, unlocked: true, yubiTicket: "", idleLocked: false, role: "admin", operatorName });
          get().log("unlock", "YubiKey FIDO2 accepted");
          return null;
        } catch (e) {
          const msg = e instanceof Error ? e.message : "YubiKey FIDO2 failed.";
          get().log("reject", "YubiKey FIDO2 failed");
          return msg;
        }
      },
      changeCreds: async (current, next, confirm, nextName) => {
        const res = await changeAdminCreds({
          data: { token: get().token, current, next, confirm, nextName },
        });
        if (!res.ok) {
          get().log("reject", "Credential change failed");
          return res.error;
        }
        writeSessionToken(res.token, "admin", res.adminName);
        clearIdleFlag();
        set({ token: res.token, unlocked: true, yubiTicket: "", idleLocked: false, role: "admin", operatorName: res.adminName });
        get().log("password", nextName.trim() ? "Admin name/password updated" : "Admin password rotated");
        return null;
      },
      lock: async () => {
        const token = get().token;
        if (token && get().role === "admin") {
          try {
            await bumpDeskEpoch({ data: { token } });
          } catch {
            /* still lock locally */
          }
        }
        writeSessionToken("");
        clearIdleFlag();
        set({ token: "", unlocked: false, yubiTicket: "", idleLocked: false, role: "", operatorName: "" });
        get().log("lock", "Session closed");
        try {
          await signOut("/login");
        } catch {
          try {
            sessionStorage.removeItem("grok-auth.bearer-token");
          } catch {
            /* private mode */
          }
        }
      },
      lockFromIdle: async () => {
        const token = get().token;
        const wasAdmin = get().role === "admin";
        writeSessionToken("");
        raiseIdleFlag();
        set({ token: "", unlocked: false, yubiTicket: "", idleLocked: true, role: "", operatorName: "" });
        get().log("lock", "Idle lock");
        if (token && wasAdmin) {
          try {
            await bumpDeskEpoch({ data: { token } });
          } catch {
            /* local lock already applied */
          }
        }
      },
      log: (kind, note) => {
        const ev: AuditEvent = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          at: new Date().toISOString(),
          kind,
          note,
        };
        set((s) => ({ audit: [ev, ...s.audit].slice(0, 40) }));
      },
    }),
    {
      name: "h3-operator-lock",
      partialize: (s) => ({ audit: s.audit, idleLocked: s.idleLocked }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.idleLocked) {
          writeSessionToken("");
          state.token = "";
          state.unlocked = false;
          state.role = "";
          state.operatorName = "";
          return;
        }
        const token = readSessionToken();
        state.token = token;
        state.unlocked = Boolean(token);
        state.role = token ? readSessionRole() : "";
        state.operatorName = token ? readSessionName() : "";
      },
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== IDLE_FLAG || !e.newValue) return;
    writeSessionToken("");
    try {
      sessionStorage.removeItem("grok-auth.bearer-token");
    } catch {
      /* private mode */
    }
    useOperator.setState({ token: "", unlocked: false, yubiTicket: "", idleLocked: true, role: "", operatorName: "" });
  });
}
