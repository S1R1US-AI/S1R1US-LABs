import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  ADMIN_NAME_RE,
  assert2fa,
  assertAdminX,
  assertNewAdminPass,
  bumpEpoch,
  adminLockReady,
  clear2fa,
  consumeResetToken,
  createDeskUser,
  credsMatch,
  currentXUserId,
  enroll2fa,
  enrolled2fa,
  enrolledRow,
  finishDeskUnlock,
  issueResetToken,
  listDeskUsers,
  matchDeskUser,
  removeDeskUser,
  requireAdminXSession,
  rotateCreds,
  sessionIsAdminX,
  setPasswordless,
  setXBind,
  signAccessToken,
  signUserToken,
  storedAdminName,
  DEFAULT_ADMIN,
  verifyAccessToken,
  verifyYubiTicket,
} from "./access.server";
import { isBtcReceiveAddress, looksLikeSecret, usdcReceiveError } from "./security";
import { handleAuthAbuse } from "./auto-defend";
import { ADMIN_X_HANDLE, ADMIN_X_LABEL } from "./x-admin";
import { clearYubi, consumeYubiOtp, maskYubiId, saveYubi, verifyYubicoOtp, yubiPublicId, yubiRows } from "./yubi.server";

const optionalXSession = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getBearerToken } = await import("@/lib/auth/client");
    return next({ sendContext: { bearerToken: getBearerToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { runWithBearer } = await import("./access.server");
    const bearer = (context as { bearerToken?: string }).bearerToken;
    const user = await getSessionUser(bearer);
    return runWithBearer(bearer, () =>
      next({
        context: {
          ...context,
          bearerToken: bearer,
          xUserId: user?.id ?? null,
        },
      }),
    );
  });

const WINDOW_MS = 10 * 60_000;
const MAX_TRIES = 8;
const tries: number[] = [];

function throttle(): string | null {
  const now = Date.now();
  while (tries.length && now - tries[0]! > WINDOW_MS) tries.shift();
  if (tries.length >= MAX_TRIES) return "Too many attempts. Wait 10 minutes.";
  tries.push(now);
  return null;
}

const RESET_WINDOW_MS = 60 * 60_000;
const MAX_RESET = 3;
const resetTries: number[] = [];

function resetThrottle(): string | null {
  const now = Date.now();
  while (resetTries.length && now - resetTries[0]! > RESET_WINDOW_MS) resetTries.shift();
  if (resetTries.length >= MAX_RESET) return "Too many renew requests. Wait an hour.";
  resetTries.push(now);
  return null;
}

async function resetOrigin(): Promise<string | null> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "")
      .split(",")[0]
      ?.trim();
    if (!host) return null;
    const proto = req.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${host}`;
  } catch {
    return null;
  }
}

export const revokeDeskSessions = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const };
    }
    try {
      await bumpEpoch();
    } catch {
      return { ok: false as const };
    }
    return { ok: true as const };
  });

export const bumpDeskEpoch = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    try {
      await bumpEpoch();
    } catch {
      return { ok: false as const, error: "Could not rotate session epoch." };
    }
    return { ok: true as const };
  });

export const signInDesk = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { user: string; pass: string }) => input)
  .handler(async ({ data, context }) => {
    const blocked = throttle();
    if (blocked) {
      void import("./intrusion-log").then(({ recordIntrusion }) => {
        recordIntrusion({ kind: "auth-throttle", detail: blocked });
      });
      handleAuthAbuse("local", "auth-throttle");
      return { ok: false as const, error: blocked };
    }
    if (looksLikeSecret(data.user) || looksLikeSecret(data.pass)) {
      void import("./intrusion-log").then(({ recordIntrusion }) => {
        recordIntrusion({ kind: "secret-paste", detail: "sign-in rejected secret-shaped input" });
      });
      handleAuthAbuse("local", "secret-paste");
      return { ok: false as const, error: "Secret rejected. Never paste a Coinbase key or wallet seed here." };
    }
    const name = data.user.trim();
    const xUserId = (context as { xUserId?: string | null }).xUserId ?? null;
    const lockOn = await adminLockReady();
    if (!lockOn) {
      if (!xUserId) {
        return {
          ok: false as const,
          error: "Sign in with X as the operator account first, then enter name and password to write the lock.",
        };
      }
      if (!(await sessionIsAdminX(xUserId))) {
        return {
          ok: false as const,
          error: "This X session is not the operator account.",
        };
      }
      if (name !== DEFAULT_ADMIN) {
        return { ok: false as const, error: "Wrong name or password." };
      }
      if (data.pass.length < 12 || data.pass.length > 128) {
        return { ok: false as const, error: "Password must be at least 12 characters." };
      }
      try {
        await rotateCreds(name, data.pass);
      } catch (e) {
        return { ok: false as const, error: e instanceof Error ? e.message : "Could not write the admin lock." };
      }
      return finishDeskUnlock();
    }
    if (!(await credsMatch(name, data.pass))) {
      const deskUser = await matchDeskUser(name, data.pass);
      if (!deskUser) {
        void import("./intrusion-log").then(({ recordIntrusion }) => {
          recordIntrusion({ kind: "auth-fail", detail: "wrong name or password" });
        });
        handleAuthAbuse("local", "auth-fail");
        return { ok: false as const, error: "Wrong name or password." };
      }
      try {
        return {
          ok: true as const,
          needYubi: false as const,
          token: await signUserToken(deskUser.id),
          role: "user" as const,
          username: deskUser.username,
        };
      } catch {
        return { ok: false as const, error: "Could not open a user session." };
      }
    }
    if (!xUserId) {
      return {
        ok: false as const,
        error: "Sign in with X as the operator account on this page first, then enter name and password.",
      };
    }
    if (!(await sessionIsAdminX(xUserId))) {
      void import("./intrusion-log").then(({ recordIntrusion }) => {
        recordIntrusion({ kind: "auth-fail", detail: "password ok but X is not the operator account" });
      });
      handleAuthAbuse("local", "auth-fail");
      return {
        ok: false as const,
        error: "This X session is not the operator account.",
      };
    }
    return finishDeskUnlock();
  });

export const changeAdminCreds = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; current: string; next: string; confirm: string; nextName: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const blocked = throttle();
    if (blocked) return { ok: false as const, error: blocked };
    if (looksLikeSecret(data.current) || looksLikeSecret(data.next) || looksLikeSecret(data.nextName)) {
      void import("./intrusion-log").then(({ recordIntrusion }) => {
        recordIntrusion({ kind: "secret-paste", detail: "credential rotate rejected secret-shaped input" });
      });
      return { ok: false as const, error: "Secret rejected. Never paste a Coinbase key or wallet seed here." };
    }
    const liveName = await storedAdminName();
    if (!(await credsMatch(liveName, data.current))) {
      return { ok: false as const, error: "Current password is wrong." };
    }
    const nextName = data.nextName.trim();
    const name = nextName || liveName;
    if (!ADMIN_NAME_RE.test(name)) {
      return { ok: false as const, error: "Admin name: 3–32 characters, letters, numbers, . _ $ @ ! -" };
    }
    const changingPass = Boolean(data.next);
    const changingName = Boolean(nextName) && nextName !== liveName;
    if (!changingPass && !changingName) {
      return { ok: false as const, error: "Enter a new admin name and/or a new password." };
    }
    if (changingPass) {
      if (data.next !== data.confirm) return { ok: false as const, error: "New passwords do not match." };
      if (data.next.length < 12) return { ok: false as const, error: "New password must be at least 12 characters." };
      if (data.next.length > 128) return { ok: false as const, error: "New password is too long." };
      if (data.next === data.current && !changingName) {
        return { ok: false as const, error: "Pick a different password or a new admin name." };
      }
    }
    const pass = changingPass ? data.next : data.current;
    try {
      await rotateCreds(name, pass);
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Could not store the new credentials." };
    }
    return { ok: true as const, token: await signAccessToken(), adminName: name };
  });

export const listDeskAccounts = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    try {
      return { ok: true as const, users: await listDeskUsers() };
    } catch {
      return { ok: false as const, error: "Could not load users." };
    }
  });

export const addDeskAccount = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; username: string; pass: string; confirm: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const blocked = throttle();
    if (blocked) return { ok: false as const, error: blocked };
    if (looksLikeSecret(data.username) || looksLikeSecret(data.pass)) {
      void import("./intrusion-log").then(({ recordIntrusion }) => {
        recordIntrusion({ kind: "secret-paste", detail: "desk-user create rejected secret-shaped input" });
      });
      return { ok: false as const, error: "Secret rejected. Never paste a Coinbase key or wallet seed here." };
    }
    const username = data.username.trim();
    if (!ADMIN_NAME_RE.test(username)) {
      return { ok: false as const, error: "Username: 3–32 characters, letters, numbers, . _ $ @ ! -" };
    }
    if (data.pass !== data.confirm) return { ok: false as const, error: "Passwords do not match." };
    if (data.pass.length < 12) return { ok: false as const, error: "Password must be at least 12 characters." };
    if (data.pass.length > 128) return { ok: false as const, error: "Password is too long." };
    try {
      return { ok: true as const, username: (await createDeskUser(username, data.pass)).username };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Could not create user." };
    }
  });

export const deleteDeskAccount = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; id: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    try {
      await removeDeskUser(data.id);
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Could not remove user." };
    }
  });

export const secondFactorStatus = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .handler(async ({ context }) => {
    const row = await enrolledRow();
    const keys = await yubiRows();
    const allowed = await sessionIsAdminX(context.userId);
    let panelLock = false;
    let webauthnCount = 0;
    let webauthn: { id: string; credentialId: string }[] = [];
    try {
      const gate = await import("./yubi-gate");
      const fido = await import("./webauthn.server");
      panelLock = await gate.adminPanelYubiLock();
      const rows = await fido.webauthnRows();
      webauthnCount = rows.length;
      webauthn = rows.map((r) => ({ id: r.id, credentialId: fido.maskCredId(r.credential_id) }));
    } catch {
      /* preview */
    }
    return {
      enrolled: Boolean(row),
      match: row?.user_id === context.userId,
      passwordless: Boolean(row?.passwordless),
      handle: allowed ? (row?.handle ?? null) : null,
      adminX: allowed ? ADMIN_X_LABEL : null,
      adminName: allowed ? await storedAdminName() : null,
      allowed,
      yubi: allowed ? keys.length > 0 : false,
      yubiId: allowed && keys[0]?.public_id ? maskYubiId(keys[0].public_id) : null,
      yubiCount: allowed ? keys.length : 0,
      yubiSlots: 2,
      yubiKeys: allowed
        ? keys.map((k) => ({ slot: k.id, publicId: maskYubiId(k.public_id) }))
        : [],
      panelLock: allowed ? panelLock : false,
      webauthnCount: allowed ? webauthnCount : 0,
      webauthn: allowed ? webauthn : [],
    };
  });

export const unlockBoundX = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .handler(async ({ context }) => {
    const who = await assertAdminX(context.userId);
    if (who) return { ok: false as const, error: who };
    const enrolled = await enrolled2fa();
    try {
      if (!enrolled) await enroll2fa(context.userId, ADMIN_X_HANDLE);
    } catch {
      return { ok: false as const, error: "Could not bind X admin." };
    }
    return { ok: true as const, needPassword: true as const };
  });

export const connectXAdmin = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .validator((input: { token: string }) => input)
  .handler(async ({ data, context }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const who = await assertAdminX(context.userId);
    if (who) return { ok: false as const, error: who };
    try {
      await setXBind(context.userId, ADMIN_X_HANDLE, false);
    } catch {
      return { ok: false as const, error: "Could not connect X admin." };
    }
    return { ok: true as const, handle: ADMIN_X_HANDLE };
  });

export const disconnectXAdmin = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .validator((input: { token: string }) => input)
  .handler(async ({ data, context }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const factor = await assert2fa(context.userId);
    if (factor) return { ok: false as const, error: factor };
    try {
      await setPasswordless(false);
    } catch {
      return { ok: false as const, error: "Could not disconnect X admin." };
    }
    return { ok: true as const };
  });

export const resetSecondFactor = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .validator((input: { token: string; current: string }) => input)
  .handler(async ({ data, context }) => {
    const who = await assertAdminX(context.userId);
    if (who) return { ok: false as const, error: who };
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const liveName = await storedAdminName();
    if (!(await credsMatch(liveName, data.current))) {
      return { ok: false as const, error: "Current password is wrong." };
    }
    try {
      await clear2fa();
    } catch {
      return { ok: false as const, error: "Could not clear 2FA enrollment." };
    }
    return { ok: true as const };
  });

export const confirmYubi = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .validator((input: { ticket: string; otp: string }) => input)
  .handler(async ({ data, context }) => {
    const who = await assertAdminX(context.userId);
    if (who) return { ok: false as const, error: who };
    if (!(await verifyYubiTicket(data.ticket))) {
      return { ok: false as const, error: "YubiKey challenge expired. Unlock again." };
    }
    const fail = await consumeYubiOtp(data.otp);
    if (fail) return { ok: false as const, error: fail };
    return { ok: true as const, token: await signAccessToken(), username: await storedAdminName() };
  });

export const confirmWebauthn = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .validator(
    (input: {
      ticket: string;
      origin: string;
      challenge: string;
      credentialId: string;
      authenticatorData: string;
      clientDataJSON: string;
      signature: string;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const who = await assertAdminX(context.userId);
    if (who) return { ok: false as const, error: who };
    if (!(await verifyYubiTicket(data.ticket))) {
      return { ok: false as const, error: "YubiKey challenge expired. Unlock again." };
    }
    const fido = await import("./webauthn.server");
    const host = await fido.requestHost();
    if (!fido.originAllowed(data.origin, host)) {
      return { ok: false as const, error: "WebAuthn origin not allowed." };
    }
    const res = await fido.finishAuthentication({
      origin: data.origin,
      challenge: data.challenge,
      credentialId: data.credentialId,
      authenticatorData: data.authenticatorData,
      clientDataJSON: data.clientDataJSON,
      signature: data.signature,
    });
    if (!res.ok) return res;
    return { ok: true as const, token: await signAccessToken(), username: await storedAdminName() };
  });

export const webauthnBeginLogin = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .validator((input: { ticket: string; origin: string }) => input)
  .handler(async ({ data, context }) => {
    const who = await assertAdminX(context.userId);
    if (who) return { ok: false as const, error: who };
    if (!(await verifyYubiTicket(data.ticket))) {
      return { ok: false as const, error: "YubiKey challenge expired. Unlock again." };
    }
    const fido = await import("./webauthn.server");
    const host = await fido.requestHost();
    return fido.authenticationOptions(data.origin, host);
  });

export const enrollYubi = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; otp: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required. First login: name + password, then enroll keys here." };
    }
    const otp = data.otp.trim().toLowerCase();
    const cloud = await verifyYubicoOtp(otp);
    if (cloud) return { ok: false as const, error: cloud };
    const publicId = yubiPublicId(otp);
    try {
      const saved = await saveYubi(publicId, otp);
      if ("error" in saved) return { ok: false as const, error: saved.error };
      const keys = await yubiRows();
      return {
        ok: true as const,
        publicId: maskYubiId(publicId),
        slot: saved.slot,
        created: saved.created,
        count: keys.length,
        remaining: Math.max(0, 2 - keys.length),
      };
    } catch {
      return { ok: false as const, error: "Could not enroll YubiKey." };
    }
  });

export const removeYubi = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; current: string; publicId?: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const liveName = await storedAdminName();
    if (!(await credsMatch(liveName, data.current))) {
      return { ok: false as const, error: "Current password is wrong." };
    }
    try {
      const { adminPanelYubiLock } = await import("./yubi-gate");
      const fido = await import("./webauthn.server");
      if (await adminPanelYubiLock()) {
        const keys = await yubiRows();
        const fidoCount = await fido.webauthnCount();
        if (!data.publicId) {
          return {
            ok: false as const,
            error: "Turn off the admin-panel YubiKey lock before removing keys. Yubico: do not remove the last authenticator while it is required.",
          };
        }
        const remainingOtp = keys.filter((k) => k.id !== data.publicId && maskYubiId(k.public_id) !== data.publicId).length;
        if (remainingOtp + fidoCount < 1) {
          return {
            ok: false as const,
            error: "Turn off the admin-panel YubiKey lock before removing the last physical key.",
          };
        }
      }
      if (data.publicId) {
        const keys = await yubiRows();
        const hit = keys.find((k) => k.id === data.publicId || maskYubiId(k.public_id) === data.publicId);
        await clearYubi(hit?.public_id);
      } else {
        await clearYubi();
        await fido.clearWebauthn();
      }
    } catch {
      return { ok: false as const, error: "Could not remove YubiKey." };
    }
    return { ok: true as const, count: (await yubiRows()).length };
  });

export const setYubiPanelLock = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; on: boolean }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const { setAdminPanelYubiLock } = await import("./yubi-gate");
    return setAdminPanelYubiLock(data.on);
  });

export const webauthnBeginRegister = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; origin: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required. Unlock first, then enroll a FIDO2 YubiKey." };
    }
    const fido = await import("./webauthn.server");
    const host = await fido.requestHost();
    return fido.registrationOptions(data.origin, host);
  });

export const webauthnFinishRegister = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator(
    (input: {
      token: string;
      origin: string;
      challenge: string;
      credentialId: string;
      publicKey: string;
      alg: number;
      transports: string[];
      clientDataJSON: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const fido = await import("./webauthn.server");
    const host = await fido.requestHost();
    if (!fido.originAllowed(data.origin, host)) {
      return { ok: false as const, error: "WebAuthn origin not allowed." };
    }
    return fido.finishRegistration({
      origin: data.origin,
      challenge: data.challenge,
      credentialId: data.credentialId,
      publicKey: data.publicKey,
      alg: data.alg,
      transports: data.transports,
      clientDataJSON: data.clientDataJSON,
    });
  });

export const removeWebauthn = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; current: string; credentialId?: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const liveName = await storedAdminName();
    if (!(await credsMatch(liveName, data.current))) {
      return { ok: false as const, error: "Current password is wrong." };
    }
    const { adminPanelYubiLock } = await import("./yubi-gate");
    const fido = await import("./webauthn.server");
    if (await adminPanelYubiLock()) {
      const otp = (await yubiRows()).length;
      const rows = await fido.webauthnRows();
      const remaining = data.credentialId
        ? rows.filter((r) => r.id !== data.credentialId && r.credential_id !== data.credentialId).length
        : 0;
      if (otp + remaining < 1) {
        return {
          ok: false as const,
          error: "Turn off the admin-panel YubiKey lock before removing the last physical key.",
        };
      }
    }
    try {
      await fido.clearWebauthn(data.credentialId);
    } catch {
      return { ok: false as const, error: "Could not remove FIDO2 YubiKey." };
    }
    return { ok: true as const, count: await fido.webauthnCount() };
  });

const ACTION_RE = /^[A-Za-z0-9:._= -]{3,200}$/;

export const approveOutgoing = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; otp: string; action: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    const action = data.action.trim();
    if (!ACTION_RE.test(action)) return { ok: false as const, error: "Invalid approval action." };
    if ((await yubiRows()).length < 2) {
      return { ok: false as const, error: "Enroll both admin YubiKeys in Admin before any outgoing BTC or USDC." };
    }
    const fail = await consumeYubiOtp(data.otp);
    if (fail) return { ok: false as const, error: fail };
    return { ok: true as const, action };
  });

export const loadDeskVault = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    try {
      const { readVault } = await import("./treasury.server");
      return { ok: true as const, vault: await readVault() };
    } catch {
      return { ok: false as const, error: "Vault unavailable." };
    }
  });

export const saveDeskVault = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator(
    (input: {
      token: string;
      sparrowAddress: string;
      mainUuid: string;
      agentUuid: string;
      usdcAddress?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    if (data.sparrowAddress && !isBtcReceiveAddress(data.sparrowAddress)) {
      return { ok: false as const, error: "Need a Bitcoin receive address (bc1… / 1… / 3…). No seeds." };
    }
    if (data.usdcAddress) {
      const usdcErr = usdcReceiveError(data.usdcAddress);
      if (usdcErr) return { ok: false as const, error: usdcErr };
    }
    if (
      looksLikeSecret(data.sparrowAddress) ||
      looksLikeSecret(data.mainUuid) ||
      looksLikeSecret(data.agentUuid) ||
      looksLikeSecret(data.usdcAddress ?? "")
    ) {
      return { ok: false as const, error: "Secret rejected." };
    }
    try {
      const { readVault, writeVault } = await import("./treasury.server");
      const current = await readVault();
      return {
        ok: true as const,
        vault: await writeVault({
          profitAddress: current.profitAddress,
          sparrowAddress: data.sparrowAddress,
          mainUuid: data.mainUuid,
          agentUuid: data.agentUuid,
          usdcAddress: data.usdcAddress ?? current.usdcAddress,
        }),
      };
    } catch {
      return { ok: false as const, error: "Could not encrypt vault." };
    }
  });

export const trackProfitWallet = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    try {
      const { profitChain } = await import("./treasury.server");
      return { ok: true as const, chain: await profitChain() };
    } catch {
      return { ok: false as const, error: "Chain lookup failed." };
    }
  });

export const trackUsdcWallet = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { ok: false as const, error: "Admin session required." };
    }
    try {
      const { usdcChain } = await import("./treasury.server");
      return { ok: true as const, chain: await usdcChain() };
    } catch {
      return { ok: false as const, error: "USDC lookup failed." };
    }
  });

export const requestAdminReset = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .handler(async ({ context }) => {
    const blocked = resetThrottle();
    if (blocked) return { ok: false as const, error: blocked };
    const xUserId = (context as { xUserId?: string | null }).xUserId ?? null;
    if (!xUserId || !(await sessionIsAdminX(xUserId))) {
      return { ok: false as const, error: "Sign in with X as the operator account first." };
    }
    try {
      const raw = await issueResetToken();
      const origin = await resetOrigin();
      if (!origin) return { ok: true as const, mailed: false };
      const { sendAdminResetMail } = await import("./reset-mail.server");
      const mailed = await sendAdminResetMail(`${origin}/renew?t=${raw}`);
      return { ok: true as const, mailed };
    } catch {
      return { ok: true as const, mailed: false };
    }
  });

export const completeAdminReset = createServerFn({ method: "POST" })
  .middleware([optionalXSession])
  .validator((input: { token: string; next: string; confirm: string }) => input)
  .handler(async ({ data, context }) => {
    const blocked = throttle();
    if (blocked) return { ok: false as const, error: blocked };
    const xUserId = (context as { xUserId?: string | null }).xUserId ?? null;
    if (!xUserId || !(await sessionIsAdminX(xUserId))) {
      return { ok: false as const, error: "Sign in with X as the operator account first." };
    }
    if (looksLikeSecret(data.next)) {
      return { ok: false as const, error: "Secret rejected. Never paste a Coinbase key or wallet seed here." };
    }
    const liveName = await storedAdminName();
    const bad = assertNewAdminPass(data.next, data.confirm, liveName);
    if (bad) return { ok: false as const, error: bad };
    try {
      if (!(await consumeResetToken(data.token))) {
        return { ok: false as const, error: "That renew link is invalid or expired." };
      }
      await rotateCreds(liveName, data.next);
    } catch {
      return { ok: false as const, error: "Could not store the new password." };
    }
    return { ok: true as const };
  });

export const renewAdminPasswordWithX = createServerFn({ method: "POST" })
  .middleware([optionalXSession, authMiddleware])
  .validator((input: { next: string; confirm: string; nextName?: string }) => input)
  .handler(async ({ data, context }) => {
    const who = await assertAdminX(context.userId);
    if (who) return { ok: false as const, error: who };
    const blocked = throttle();
    if (blocked) return { ok: false as const, error: blocked };
    const liveName = await storedAdminName();
    const nextName = (data.nextName ?? "").trim() || liveName;
    if (!ADMIN_NAME_RE.test(nextName)) {
      return { ok: false as const, error: "Admin name must be 3–32 letters, numbers, or . _ $ @ ! -" };
    }
    const bad = assertNewAdminPass(data.next, data.confirm, nextName);
    if (bad) return { ok: false as const, error: bad };
    try {
      await rotateCreds(nextName, data.next);
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Could not store the new password." };
    }
    return { ok: true as const, token: await signAccessToken(), adminName: nextName };
  });
