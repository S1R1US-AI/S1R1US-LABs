import { n as createMiddleware, r as createServerFn } from "./ssr.mjs";
import { n as ADMIN_X_LABEL, t as ADMIN_X_HANDLE } from "./x-admin-CALKyy-K.mjs";
import { f as looksLikeSecret, h as usdcReceiveError, u as isBtcReceiveAddress } from "./security-CMyXz6XE.mjs";
import { ADMIN_NAME_RE, adminLockReady, assert2fa, assertAdminX, assertNewAdminPass, bumpEpoch, clear2fa, consumeResetToken, createDeskUser, credsMatch, enroll2fa, enrolled2fa, enrolledRow, finishDeskUnlock, issueResetToken, listDeskUsers, matchDeskUser, removeDeskUser, rotateCreds, sessionIsAdminX, setPasswordless, setXBind, signAccessToken, signUserToken, storedAdminName, verifyAccessToken, verifyYubiTicket } from "./access.server-5mVXeerR.mjs";
import { t as createServerRpc } from "./createServerRpc-BgpH4YR6.mjs";
import { t as authMiddleware } from "./middleware-C0Y5-Uqn.mjs";
import { n as handleAuthAbuse } from "./auto-defend-CiARGVXy.mjs";
import { a as verifyYubicoOtp, i as saveYubi, n as consumeYubiOtp, o as yubiPublicId, r as maskYubiId, s as yubiRows, t as clearYubi } from "./yubi.server-DnGyn4Hv.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/access-C75W2TAt.js
var optionalXSession = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-Dkf4Mpw3.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { getSessionUser } = await import("./verify.server-BeBsNuXs.mjs");
	const { runWithBearer } = await import("./access.server-5mVXeerR.mjs");
	const bearer = context.bearerToken;
	const user = await getSessionUser(bearer);
	return runWithBearer(bearer, () => next({ context: {
		...context,
		bearerToken: bearer,
		xUserId: user?.id ?? null
	} }));
});
var WINDOW_MS = 6e5;
var MAX_TRIES = 8;
var tries = [];
function throttle() {
	const now = Date.now();
	while (tries.length && now - tries[0] > WINDOW_MS) tries.shift();
	if (tries.length >= MAX_TRIES) return "Too many attempts. Wait 10 minutes.";
	tries.push(now);
	return null;
}
var RESET_WINDOW_MS = 36e5;
var MAX_RESET = 3;
var resetTries = [];
function resetThrottle() {
	const now = Date.now();
	while (resetTries.length && now - resetTries[0] > RESET_WINDOW_MS) resetTries.shift();
	if (resetTries.length >= MAX_RESET) return "Too many renew requests. Wait an hour.";
	resetTries.push(now);
	return null;
}
async function resetOrigin() {
	try {
		const { getRequest } = await import("./server-CvwbZsEi.mjs").then((n) => n.t);
		const req = getRequest();
		const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(",")[0]?.trim();
		if (!host) return null;
		return `${req.headers.get("x-forwarded-proto") || "https"}://${host}`;
	} catch {
		return null;
	}
}
var revokeDeskSessions_createServerFn_handler = createServerRpc({
	id: "6b8982d09e1149c67c73735b62707e48db97be044371de46161546bbb93d065e",
	name: "revokeDeskSessions",
	filename: "src/lib/desk/access.ts"
}, (opts) => revokeDeskSessions.__executeServer(opts));
var revokeDeskSessions = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(revokeDeskSessions_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return { ok: false };
	try {
		await bumpEpoch();
	} catch {
		return { ok: false };
	}
	return { ok: true };
});
var bumpDeskEpoch_createServerFn_handler = createServerRpc({
	id: "1078d4d28c3e8d28ab7fe6b4f0b5af95d0185184a4a96f94ac063f68f4e2899a",
	name: "bumpDeskEpoch",
	filename: "src/lib/desk/access.ts"
}, (opts) => bumpDeskEpoch.__executeServer(opts));
var bumpDeskEpoch = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(bumpDeskEpoch_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	try {
		await bumpEpoch();
	} catch {
		return {
			ok: false,
			error: "Could not rotate session epoch."
		};
	}
	return { ok: true };
});
var signInDesk_createServerFn_handler = createServerRpc({
	id: "dca4d87376279eca9587a4116dd129419dd87dba6ff83aa63103145403d231c1",
	name: "signInDesk",
	filename: "src/lib/desk/access.ts"
}, (opts) => signInDesk.__executeServer(opts));
var signInDesk = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(signInDesk_createServerFn_handler, async ({ data, context }) => {
	const blocked = throttle();
	if (blocked) {
		import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a).then(({ recordIntrusion }) => {
			recordIntrusion({
				kind: "auth-throttle",
				detail: blocked
			});
		});
		handleAuthAbuse("local", "auth-throttle");
		return {
			ok: false,
			error: blocked
		};
	}
	if (looksLikeSecret(data.user) || looksLikeSecret(data.pass)) {
		import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a).then(({ recordIntrusion }) => {
			recordIntrusion({
				kind: "secret-paste",
				detail: "sign-in rejected secret-shaped input"
			});
		});
		handleAuthAbuse("local", "secret-paste");
		return {
			ok: false,
			error: "Secret rejected. Never paste a Coinbase key or wallet seed here."
		};
	}
	const name = data.user.trim();
	const xUserId = context.xUserId ?? null;
	if (!await adminLockReady()) {
		if (!xUserId) return {
			ok: false,
			error: "Sign in with X as the operator account first, then enter name and password to write the lock."
		};
		if (!await sessionIsAdminX(xUserId)) return {
			ok: false,
			error: "This X session is not the operator account."
		};
		if (name !== "S1R1uSxadm") return {
			ok: false,
			error: "Wrong name or password."
		};
		if (data.pass.length < 12 || data.pass.length > 128) return {
			ok: false,
			error: "Password must be at least 12 characters."
		};
		try {
			await rotateCreds(name, data.pass);
		} catch (e) {
			return {
				ok: false,
				error: e instanceof Error ? e.message : "Could not write the admin lock."
			};
		}
		return finishDeskUnlock();
	}
	if (!await credsMatch(name, data.pass)) {
		const deskUser = await matchDeskUser(name, data.pass);
		if (!deskUser) {
			import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a).then(({ recordIntrusion }) => {
				recordIntrusion({
					kind: "auth-fail",
					detail: "wrong name or password"
				});
			});
			handleAuthAbuse("local", "auth-fail");
			return {
				ok: false,
				error: "Wrong name or password."
			};
		}
		try {
			return {
				ok: true,
				needYubi: false,
				token: await signUserToken(deskUser.id),
				role: "user",
				username: deskUser.username
			};
		} catch {
			return {
				ok: false,
				error: "Could not open a user session."
			};
		}
	}
	if (!xUserId) return {
		ok: false,
		error: "Sign in with X as the operator account on this page first, then enter name and password."
	};
	if (!await sessionIsAdminX(xUserId)) {
		import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a).then(({ recordIntrusion }) => {
			recordIntrusion({
				kind: "auth-fail",
				detail: "password ok but X is not the operator account"
			});
		});
		handleAuthAbuse("local", "auth-fail");
		return {
			ok: false,
			error: "This X session is not the operator account."
		};
	}
	return finishDeskUnlock();
});
var changeAdminCreds_createServerFn_handler = createServerRpc({
	id: "714e6a99647b786be76155dccc41f88d1e9cd20b7c7759e61c1c7581a763f559",
	name: "changeAdminCreds",
	filename: "src/lib/desk/access.ts"
}, (opts) => changeAdminCreds.__executeServer(opts));
var changeAdminCreds = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(changeAdminCreds_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const blocked = throttle();
	if (blocked) return {
		ok: false,
		error: blocked
	};
	if (looksLikeSecret(data.current) || looksLikeSecret(data.next) || looksLikeSecret(data.nextName)) {
		import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a).then(({ recordIntrusion }) => {
			recordIntrusion({
				kind: "secret-paste",
				detail: "credential rotate rejected secret-shaped input"
			});
		});
		return {
			ok: false,
			error: "Secret rejected. Never paste a Coinbase key or wallet seed here."
		};
	}
	const liveName = await storedAdminName();
	if (!await credsMatch(liveName, data.current)) return {
		ok: false,
		error: "Current password is wrong."
	};
	const nextName = data.nextName.trim();
	const name = nextName || liveName;
	if (!ADMIN_NAME_RE.test(name)) return {
		ok: false,
		error: "Admin name: 3–32 characters, letters, numbers, . _ $ @ ! -"
	};
	const changingPass = Boolean(data.next);
	const changingName = Boolean(nextName) && nextName !== liveName;
	if (!changingPass && !changingName) return {
		ok: false,
		error: "Enter a new admin name and/or a new password."
	};
	if (changingPass) {
		if (data.next !== data.confirm) return {
			ok: false,
			error: "New passwords do not match."
		};
		if (data.next.length < 12) return {
			ok: false,
			error: "New password must be at least 12 characters."
		};
		if (data.next.length > 128) return {
			ok: false,
			error: "New password is too long."
		};
		if (data.next === data.current && !changingName) return {
			ok: false,
			error: "Pick a different password or a new admin name."
		};
	}
	const pass = changingPass ? data.next : data.current;
	try {
		await rotateCreds(name, pass);
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not store the new credentials."
		};
	}
	return {
		ok: true,
		token: await signAccessToken(),
		adminName: name
	};
});
var listDeskAccounts_createServerFn_handler = createServerRpc({
	id: "028840d145605509d02a84e3c9e10e20666a2f09596e3760b8531e00337b142b",
	name: "listDeskAccounts",
	filename: "src/lib/desk/access.ts"
}, (opts) => listDeskAccounts.__executeServer(opts));
var listDeskAccounts = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(listDeskAccounts_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	try {
		return {
			ok: true,
			users: await listDeskUsers()
		};
	} catch {
		return {
			ok: false,
			error: "Could not load users."
		};
	}
});
var addDeskAccount_createServerFn_handler = createServerRpc({
	id: "aabfbd992d53b80b9bfa984840ff4f1fa6047cd24fbf19077c50c7eb262c25e7",
	name: "addDeskAccount",
	filename: "src/lib/desk/access.ts"
}, (opts) => addDeskAccount.__executeServer(opts));
var addDeskAccount = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(addDeskAccount_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const blocked = throttle();
	if (blocked) return {
		ok: false,
		error: blocked
	};
	if (looksLikeSecret(data.username) || looksLikeSecret(data.pass)) {
		import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a).then(({ recordIntrusion }) => {
			recordIntrusion({
				kind: "secret-paste",
				detail: "desk-user create rejected secret-shaped input"
			});
		});
		return {
			ok: false,
			error: "Secret rejected. Never paste a Coinbase key or wallet seed here."
		};
	}
	const username = data.username.trim();
	if (!ADMIN_NAME_RE.test(username)) return {
		ok: false,
		error: "Username: 3–32 characters, letters, numbers, . _ $ @ ! -"
	};
	if (data.pass !== data.confirm) return {
		ok: false,
		error: "Passwords do not match."
	};
	if (data.pass.length < 12) return {
		ok: false,
		error: "Password must be at least 12 characters."
	};
	if (data.pass.length > 128) return {
		ok: false,
		error: "Password is too long."
	};
	try {
		return {
			ok: true,
			username: (await createDeskUser(username, data.pass)).username
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not create user."
		};
	}
});
var deleteDeskAccount_createServerFn_handler = createServerRpc({
	id: "a73ac4990fa60fd9c4761549d20c270b5a523ed55c0345083fa595814a22715a",
	name: "deleteDeskAccount",
	filename: "src/lib/desk/access.ts"
}, (opts) => deleteDeskAccount.__executeServer(opts));
var deleteDeskAccount = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(deleteDeskAccount_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	try {
		await removeDeskUser(data.id);
		return { ok: true };
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not remove user."
		};
	}
});
var secondFactorStatus_createServerFn_handler = createServerRpc({
	id: "f90b29ef79efd75cfcbf8084099a6bb59379e1a4b6f492752d0faa3050ca8c58",
	name: "secondFactorStatus",
	filename: "src/lib/desk/access.ts"
}, (opts) => secondFactorStatus.__executeServer(opts));
var secondFactorStatus = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).handler(secondFactorStatus_createServerFn_handler, async ({ context }) => {
	const row = await enrolledRow();
	const keys = await yubiRows();
	const allowed = await sessionIsAdminX(context.userId);
	let panelLock = false;
	let webauthnCount = 0;
	let webauthn = [];
	try {
		const gate = await import("./yubi-gate-1y3ZqjfE.mjs");
		const fido = await import("./webauthn.server-DMtSECIC.mjs");
		panelLock = await gate.adminPanelYubiLock();
		const rows = await fido.webauthnRows();
		webauthnCount = rows.length;
		webauthn = rows.map((r) => ({
			id: r.id,
			credentialId: fido.maskCredId(r.credential_id)
		}));
	} catch {}
	return {
		enrolled: Boolean(row),
		match: row?.user_id === context.userId,
		passwordless: Boolean(row?.passwordless),
		handle: allowed ? row?.handle ?? null : null,
		adminX: allowed ? ADMIN_X_LABEL : null,
		adminName: allowed ? await storedAdminName() : null,
		allowed,
		yubi: allowed ? keys.length > 0 : false,
		yubiId: allowed && keys[0]?.public_id ? maskYubiId(keys[0].public_id) : null,
		yubiCount: allowed ? keys.length : 0,
		yubiSlots: 2,
		yubiKeys: allowed ? keys.map((k) => ({
			slot: k.id,
			publicId: maskYubiId(k.public_id)
		})) : [],
		panelLock: allowed ? panelLock : false,
		webauthnCount: allowed ? webauthnCount : 0,
		webauthn: allowed ? webauthn : []
	};
});
var unlockBoundX_createServerFn_handler = createServerRpc({
	id: "66bce2ab80060d1a3cf1f7adb491e9c151baec4204d8ee6fa73c6f79d234b173",
	name: "unlockBoundX",
	filename: "src/lib/desk/access.ts"
}, (opts) => unlockBoundX.__executeServer(opts));
var unlockBoundX = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).handler(unlockBoundX_createServerFn_handler, async ({ context }) => {
	const who = await assertAdminX(context.userId);
	if (who) return {
		ok: false,
		error: who
	};
	const enrolled = await enrolled2fa();
	try {
		if (!enrolled) await enroll2fa(context.userId, ADMIN_X_HANDLE);
	} catch {
		return {
			ok: false,
			error: "Could not bind X admin."
		};
	}
	return {
		ok: true,
		needPassword: true
	};
});
var connectXAdmin_createServerFn_handler = createServerRpc({
	id: "99a48c81c1c9a39e8a8cf483a677adafc020c90f1cebb7a7636d99460f61d497",
	name: "connectXAdmin",
	filename: "src/lib/desk/access.ts"
}, (opts) => connectXAdmin.__executeServer(opts));
var connectXAdmin = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(connectXAdmin_createServerFn_handler, async ({ data, context }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const who = await assertAdminX(context.userId);
	if (who) return {
		ok: false,
		error: who
	};
	try {
		await setXBind(context.userId, ADMIN_X_HANDLE, false);
	} catch {
		return {
			ok: false,
			error: "Could not connect X admin."
		};
	}
	return {
		ok: true,
		handle: ADMIN_X_HANDLE
	};
});
var disconnectXAdmin_createServerFn_handler = createServerRpc({
	id: "61219593192ece2914d98974b32d3ecf6190fe2d923e9dac9abd63fcdd198b09",
	name: "disconnectXAdmin",
	filename: "src/lib/desk/access.ts"
}, (opts) => disconnectXAdmin.__executeServer(opts));
var disconnectXAdmin = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(disconnectXAdmin_createServerFn_handler, async ({ data, context }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const factor = await assert2fa(context.userId);
	if (factor) return {
		ok: false,
		error: factor
	};
	try {
		await setPasswordless(false);
	} catch {
		return {
			ok: false,
			error: "Could not disconnect X admin."
		};
	}
	return { ok: true };
});
var resetSecondFactor_createServerFn_handler = createServerRpc({
	id: "41c7f435231776334c1ee8bedbd182aac11b8b488b4280d092b91c02f5304912",
	name: "resetSecondFactor",
	filename: "src/lib/desk/access.ts"
}, (opts) => resetSecondFactor.__executeServer(opts));
var resetSecondFactor = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(resetSecondFactor_createServerFn_handler, async ({ data, context }) => {
	const who = await assertAdminX(context.userId);
	if (who) return {
		ok: false,
		error: who
	};
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const liveName = await storedAdminName();
	if (!await credsMatch(liveName, data.current)) return {
		ok: false,
		error: "Current password is wrong."
	};
	try {
		await clear2fa();
	} catch {
		return {
			ok: false,
			error: "Could not clear 2FA enrollment."
		};
	}
	return { ok: true };
});
var confirmYubi_createServerFn_handler = createServerRpc({
	id: "1f504f3759a09927c02161a4fe94340a66e215dbd27eebb3c61862e71b436d44",
	name: "confirmYubi",
	filename: "src/lib/desk/access.ts"
}, (opts) => confirmYubi.__executeServer(opts));
var confirmYubi = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(confirmYubi_createServerFn_handler, async ({ data, context }) => {
	const who = await assertAdminX(context.userId);
	if (who) return {
		ok: false,
		error: who
	};
	if (!await verifyYubiTicket(data.ticket)) return {
		ok: false,
		error: "YubiKey challenge expired. Unlock again."
	};
	const fail = await consumeYubiOtp(data.otp);
	if (fail) return {
		ok: false,
		error: fail
	};
	return {
		ok: true,
		token: await signAccessToken(),
		username: await storedAdminName()
	};
});
var confirmWebauthn_createServerFn_handler = createServerRpc({
	id: "0481761865848137848ea328ea5df62ee92834ec832192cd763b57cedaf884a9",
	name: "confirmWebauthn",
	filename: "src/lib/desk/access.ts"
}, (opts) => confirmWebauthn.__executeServer(opts));
var confirmWebauthn = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(confirmWebauthn_createServerFn_handler, async ({ data, context }) => {
	const who = await assertAdminX(context.userId);
	if (who) return {
		ok: false,
		error: who
	};
	if (!await verifyYubiTicket(data.ticket)) return {
		ok: false,
		error: "YubiKey challenge expired. Unlock again."
	};
	const fido = await import("./webauthn.server-DMtSECIC.mjs");
	const host = await fido.requestHost();
	if (!fido.originAllowed(data.origin, host)) return {
		ok: false,
		error: "WebAuthn origin not allowed."
	};
	const res = await fido.finishAuthentication({
		origin: data.origin,
		challenge: data.challenge,
		credentialId: data.credentialId,
		authenticatorData: data.authenticatorData,
		clientDataJSON: data.clientDataJSON,
		signature: data.signature
	});
	if (!res.ok) return res;
	return {
		ok: true,
		token: await signAccessToken(),
		username: await storedAdminName()
	};
});
var webauthnBeginLogin_createServerFn_handler = createServerRpc({
	id: "dd61df05b0fd80821645d9c56ef2635c65736e3ecf4d8ada1df06f02aa66eea9",
	name: "webauthnBeginLogin",
	filename: "src/lib/desk/access.ts"
}, (opts) => webauthnBeginLogin.__executeServer(opts));
var webauthnBeginLogin = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(webauthnBeginLogin_createServerFn_handler, async ({ data, context }) => {
	const who = await assertAdminX(context.userId);
	if (who) return {
		ok: false,
		error: who
	};
	if (!await verifyYubiTicket(data.ticket)) return {
		ok: false,
		error: "YubiKey challenge expired. Unlock again."
	};
	const fido = await import("./webauthn.server-DMtSECIC.mjs");
	const host = await fido.requestHost();
	return fido.authenticationOptions(data.origin, host);
});
var enrollYubi_createServerFn_handler = createServerRpc({
	id: "4fa8b20236df6ba606e4ca17dcdb1e4be033ec0167e3fac02a23b1e395de0728",
	name: "enrollYubi",
	filename: "src/lib/desk/access.ts"
}, (opts) => enrollYubi.__executeServer(opts));
var enrollYubi = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(enrollYubi_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required. First login: name + password, then enroll keys here."
	};
	const otp = data.otp.trim().toLowerCase();
	const cloud = await verifyYubicoOtp(otp);
	if (cloud) return {
		ok: false,
		error: cloud
	};
	const publicId = yubiPublicId(otp);
	try {
		const saved = await saveYubi(publicId, otp);
		if ("error" in saved) return {
			ok: false,
			error: saved.error
		};
		const keys = await yubiRows();
		return {
			ok: true,
			publicId: maskYubiId(publicId),
			slot: saved.slot,
			created: saved.created,
			count: keys.length,
			remaining: Math.max(0, 2 - keys.length)
		};
	} catch {
		return {
			ok: false,
			error: "Could not enroll YubiKey."
		};
	}
});
var removeYubi_createServerFn_handler = createServerRpc({
	id: "c10fb0a85e2cd1077f8f287b7d041a6d84db2e3e7e9084332a5a19de89eba858",
	name: "removeYubi",
	filename: "src/lib/desk/access.ts"
}, (opts) => removeYubi.__executeServer(opts));
var removeYubi = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(removeYubi_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const liveName = await storedAdminName();
	if (!await credsMatch(liveName, data.current)) return {
		ok: false,
		error: "Current password is wrong."
	};
	try {
		const { adminPanelYubiLock } = await import("./yubi-gate-1y3ZqjfE.mjs");
		const fido = await import("./webauthn.server-DMtSECIC.mjs");
		if (await adminPanelYubiLock()) {
			const keys = await yubiRows();
			const fidoCount = await fido.webauthnCount();
			if (!data.publicId) return {
				ok: false,
				error: "Turn off the admin-panel YubiKey lock before removing keys. Yubico: do not remove the last authenticator while it is required."
			};
			if (keys.filter((k) => k.id !== data.publicId && maskYubiId(k.public_id) !== data.publicId).length + fidoCount < 1) return {
				ok: false,
				error: "Turn off the admin-panel YubiKey lock before removing the last physical key."
			};
		}
		if (data.publicId) {
			const hit = (await yubiRows()).find((k) => k.id === data.publicId || maskYubiId(k.public_id) === data.publicId);
			await clearYubi(hit?.public_id);
		} else {
			await clearYubi();
			await fido.clearWebauthn();
		}
	} catch {
		return {
			ok: false,
			error: "Could not remove YubiKey."
		};
	}
	return {
		ok: true,
		count: (await yubiRows()).length
	};
});
var setYubiPanelLock_createServerFn_handler = createServerRpc({
	id: "0119304a468f34290344afa31c702b340a12ef2ae972e27cecd33058c9d1ced0",
	name: "setYubiPanelLock",
	filename: "src/lib/desk/access.ts"
}, (opts) => setYubiPanelLock.__executeServer(opts));
var setYubiPanelLock = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(setYubiPanelLock_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const { setAdminPanelYubiLock } = await import("./yubi-gate-1y3ZqjfE.mjs");
	return setAdminPanelYubiLock(data.on);
});
var webauthnBeginRegister_createServerFn_handler = createServerRpc({
	id: "6fc7d0f321f1594724d1925058050777d2ca782050e71ee4fdaa4a9efa735a20",
	name: "webauthnBeginRegister",
	filename: "src/lib/desk/access.ts"
}, (opts) => webauthnBeginRegister.__executeServer(opts));
var webauthnBeginRegister = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(webauthnBeginRegister_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required. Unlock first, then enroll a FIDO2 YubiKey."
	};
	const fido = await import("./webauthn.server-DMtSECIC.mjs");
	const host = await fido.requestHost();
	return fido.registrationOptions(data.origin, host);
});
var webauthnFinishRegister_createServerFn_handler = createServerRpc({
	id: "9245cf1543579f8b70006f205bc376319cfdaf0b4db35120c94bb0e492f21a83",
	name: "webauthnFinishRegister",
	filename: "src/lib/desk/access.ts"
}, (opts) => webauthnFinishRegister.__executeServer(opts));
var webauthnFinishRegister = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(webauthnFinishRegister_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const fido = await import("./webauthn.server-DMtSECIC.mjs");
	const host = await fido.requestHost();
	if (!fido.originAllowed(data.origin, host)) return {
		ok: false,
		error: "WebAuthn origin not allowed."
	};
	return fido.finishRegistration({
		origin: data.origin,
		challenge: data.challenge,
		credentialId: data.credentialId,
		publicKey: data.publicKey,
		alg: data.alg,
		transports: data.transports,
		clientDataJSON: data.clientDataJSON
	});
});
var removeWebauthn_createServerFn_handler = createServerRpc({
	id: "b39bd022495ae5e3a029e3daf43bd7890b38515d779d09a48ade7f9d35043be6",
	name: "removeWebauthn",
	filename: "src/lib/desk/access.ts"
}, (opts) => removeWebauthn.__executeServer(opts));
var removeWebauthn = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(removeWebauthn_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const liveName = await storedAdminName();
	if (!await credsMatch(liveName, data.current)) return {
		ok: false,
		error: "Current password is wrong."
	};
	const { adminPanelYubiLock } = await import("./yubi-gate-1y3ZqjfE.mjs");
	const fido = await import("./webauthn.server-DMtSECIC.mjs");
	if (await adminPanelYubiLock()) {
		const otp = (await yubiRows()).length;
		const rows = await fido.webauthnRows();
		if (otp + (data.credentialId ? rows.filter((r) => r.id !== data.credentialId && r.credential_id !== data.credentialId).length : 0) < 1) return {
			ok: false,
			error: "Turn off the admin-panel YubiKey lock before removing the last physical key."
		};
	}
	try {
		await fido.clearWebauthn(data.credentialId);
	} catch {
		return {
			ok: false,
			error: "Could not remove FIDO2 YubiKey."
		};
	}
	return {
		ok: true,
		count: await fido.webauthnCount()
	};
});
var ACTION_RE = /^[A-Za-z0-9:._= -]{3,200}$/;
var approveOutgoing_createServerFn_handler = createServerRpc({
	id: "c8c38dc27a85273c33a153b8bdd9ceb8050fbee3fd4aa99a6af0967f62bea416",
	name: "approveOutgoing",
	filename: "src/lib/desk/access.ts"
}, (opts) => approveOutgoing.__executeServer(opts));
var approveOutgoing = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(approveOutgoing_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const action = data.action.trim();
	if (!ACTION_RE.test(action)) return {
		ok: false,
		error: "Invalid approval action."
	};
	if ((await yubiRows()).length < 2) return {
		ok: false,
		error: "Enroll both admin YubiKeys in Admin before any outgoing BTC or USDC."
	};
	const fail = await consumeYubiOtp(data.otp);
	if (fail) return {
		ok: false,
		error: fail
	};
	return {
		ok: true,
		action
	};
});
var loadDeskVault_createServerFn_handler = createServerRpc({
	id: "39488170e2f4ede9521cf8480eb8834ea03a488feddb0db2a53c0da49cd81522",
	name: "loadDeskVault",
	filename: "src/lib/desk/access.ts"
}, (opts) => loadDeskVault.__executeServer(opts));
var loadDeskVault = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(loadDeskVault_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	try {
		const { readVault } = await import("./treasury.server-CKlTAD4k.mjs");
		return {
			ok: true,
			vault: await readVault()
		};
	} catch {
		return {
			ok: false,
			error: "Vault unavailable."
		};
	}
});
var saveDeskVault_createServerFn_handler = createServerRpc({
	id: "61dc68cb3e47b6f737b59aef4206d5d95c923fca2fd17a743f42496022983ea9",
	name: "saveDeskVault",
	filename: "src/lib/desk/access.ts"
}, (opts) => saveDeskVault.__executeServer(opts));
var saveDeskVault = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(saveDeskVault_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	if (data.sparrowAddress && !isBtcReceiveAddress(data.sparrowAddress)) return {
		ok: false,
		error: "Need a Bitcoin receive address (bc1… / 1… / 3…). No seeds."
	};
	if (data.usdcAddress) {
		const usdcErr = usdcReceiveError(data.usdcAddress);
		if (usdcErr) return {
			ok: false,
			error: usdcErr
		};
	}
	if (looksLikeSecret(data.sparrowAddress) || looksLikeSecret(data.mainUuid) || looksLikeSecret(data.agentUuid) || looksLikeSecret(data.usdcAddress ?? "")) return {
		ok: false,
		error: "Secret rejected."
	};
	try {
		const { readVault, writeVault } = await import("./treasury.server-CKlTAD4k.mjs");
		const current = await readVault();
		return {
			ok: true,
			vault: await writeVault({
				profitAddress: current.profitAddress,
				sparrowAddress: data.sparrowAddress,
				mainUuid: data.mainUuid,
				agentUuid: data.agentUuid,
				usdcAddress: data.usdcAddress ?? current.usdcAddress
			})
		};
	} catch {
		return {
			ok: false,
			error: "Could not encrypt vault."
		};
	}
});
var trackProfitWallet_createServerFn_handler = createServerRpc({
	id: "fb063609c78071b3e3e758f104f3addd377f7e782d404c1649251722ec90a80e",
	name: "trackProfitWallet",
	filename: "src/lib/desk/access.ts"
}, (opts) => trackProfitWallet.__executeServer(opts));
var trackProfitWallet = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(trackProfitWallet_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	try {
		const { profitChain } = await import("./treasury.server-CKlTAD4k.mjs");
		return {
			ok: true,
			chain: await profitChain()
		};
	} catch {
		return {
			ok: false,
			error: "Chain lookup failed."
		};
	}
});
var trackUsdcWallet_createServerFn_handler = createServerRpc({
	id: "655b6287f928b66af4ea43a18d488ad65454dde5a25513c897a89ec520fbb53a",
	name: "trackUsdcWallet",
	filename: "src/lib/desk/access.ts"
}, (opts) => trackUsdcWallet.__executeServer(opts));
var trackUsdcWallet = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(trackUsdcWallet_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	try {
		const { usdcChain } = await import("./treasury.server-CKlTAD4k.mjs");
		return {
			ok: true,
			chain: await usdcChain()
		};
	} catch {
		return {
			ok: false,
			error: "USDC lookup failed."
		};
	}
});
var requestAdminReset_createServerFn_handler = createServerRpc({
	id: "c07cac131e869252f1c8f5a7d6921698ad393b5d17f3b98af547969e3722495a",
	name: "requestAdminReset",
	filename: "src/lib/desk/access.ts"
}, (opts) => requestAdminReset.__executeServer(opts));
var requestAdminReset = createServerFn({ method: "POST" }).middleware([optionalXSession]).handler(requestAdminReset_createServerFn_handler, async ({ context }) => {
	const blocked = resetThrottle();
	if (blocked) return {
		ok: false,
		error: blocked
	};
	const xUserId = context.xUserId ?? null;
	if (!xUserId || !await sessionIsAdminX(xUserId)) return {
		ok: false,
		error: "Sign in with X as the operator account first."
	};
	try {
		const raw = await issueResetToken();
		const origin = await resetOrigin();
		if (!origin) return {
			ok: true,
			mailed: false
		};
		const { sendAdminResetMail } = await import("./reset-mail.server-C-m6odmn.mjs");
		return {
			ok: true,
			mailed: await sendAdminResetMail(`${origin}/renew?t=${raw}`)
		};
	} catch {
		return {
			ok: true,
			mailed: false
		};
	}
});
var completeAdminReset_createServerFn_handler = createServerRpc({
	id: "3a9d5b832410bc3d673c52dcdfddff6b023d4a16b6642a4e4a5ff90fbc69ba47",
	name: "completeAdminReset",
	filename: "src/lib/desk/access.ts"
}, (opts) => completeAdminReset.__executeServer(opts));
var completeAdminReset = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(completeAdminReset_createServerFn_handler, async ({ data, context }) => {
	const blocked = throttle();
	if (blocked) return {
		ok: false,
		error: blocked
	};
	const xUserId = context.xUserId ?? null;
	if (!xUserId || !await sessionIsAdminX(xUserId)) return {
		ok: false,
		error: "Sign in with X as the operator account first."
	};
	if (looksLikeSecret(data.next)) return {
		ok: false,
		error: "Secret rejected. Never paste a Coinbase key or wallet seed here."
	};
	const liveName = await storedAdminName();
	const bad = assertNewAdminPass(data.next, data.confirm, liveName);
	if (bad) return {
		ok: false,
		error: bad
	};
	try {
		if (!await consumeResetToken(data.token)) return {
			ok: false,
			error: "That renew link is invalid or expired."
		};
		await rotateCreds(liveName, data.next);
	} catch {
		return {
			ok: false,
			error: "Could not store the new password."
		};
	}
	return { ok: true };
});
var renewAdminPasswordWithX_createServerFn_handler = createServerRpc({
	id: "7a0518f7402808c01848d78b41fe4e037690e17016b522dd8589178db010723e",
	name: "renewAdminPasswordWithX",
	filename: "src/lib/desk/access.ts"
}, (opts) => renewAdminPasswordWithX.__executeServer(opts));
var renewAdminPasswordWithX = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(renewAdminPasswordWithX_createServerFn_handler, async ({ data, context }) => {
	const who = await assertAdminX(context.userId);
	if (who) return {
		ok: false,
		error: who
	};
	const blocked = throttle();
	if (blocked) return {
		ok: false,
		error: blocked
	};
	const liveName = await storedAdminName();
	const nextName = (data.nextName ?? "").trim() || liveName;
	if (!ADMIN_NAME_RE.test(nextName)) return {
		ok: false,
		error: "Admin name must be 3–32 letters, numbers, or . _ $ @ ! -"
	};
	const bad = assertNewAdminPass(data.next, data.confirm, nextName);
	if (bad) return {
		ok: false,
		error: bad
	};
	try {
		await rotateCreds(nextName, data.next);
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not store the new password."
		};
	}
	return {
		ok: true,
		token: await signAccessToken(),
		adminName: nextName
	};
});
var claimCopyAdmin_createServerFn_handler = createServerRpc({
	id: "1eda3a065e3f0b42de95beaed22e23df5e348fba2c87caae7820b1dd03e1e961",
	name: "claimCopyAdmin",
	filename: "src/lib/desk/access.ts"
}, (opts) => claimCopyAdmin.__executeServer(opts));
var claimCopyAdmin = createServerFn({ method: "POST" }).validator((input) => input).handler(claimCopyAdmin_createServerFn_handler, async ({ data }) => {
	const { claimAppAdmin, APP_ADMIN_PUBLIC } = await import("./app-admin-DF3iX8xC.mjs");
	const res = claimAppAdmin(data);
	if (!res.ok) return res;
	return {
		...res,
		public: APP_ADMIN_PUBLIC
	};
});
var peekCopyAdmin_createServerFn_handler = createServerRpc({
	id: "d63a77fa38a871d27ee178917d0340aa4e40fa6ad57210b741bf4c91bf0550d4",
	name: "peekCopyAdmin",
	filename: "src/lib/desk/access.ts"
}, (opts) => peekCopyAdmin.__executeServer(opts));
var peekCopyAdmin = createServerFn({ method: "POST" }).validator((input) => input).handler(peekCopyAdmin_createServerFn_handler, async ({ data }) => {
	const { isAppAdminToken } = await import("./tenancy-XVYWlKJ3.mjs").then((n) => n.s).then((n) => n.s);
	if (!isAppAdminToken(data.token)) return {
		ok: false,
		error: "Not a copy Admin session."
	};
	const { verifyAppAdminToken, peekAppAdmin, APP_ADMIN_PUBLIC } = await import("./app-admin-DF3iX8xC.mjs");
	const hit = verifyAppAdminToken(data.token);
	if (!hit) return {
		ok: false,
		error: "Copy Admin session expired."
	};
	const you = peekAppAdmin(hit.id);
	if (!you) return {
		ok: false,
		error: "Copy Admin session expired."
	};
	return {
		ok: true,
		you,
		public: APP_ADMIN_PUBLIC
	};
});
//#endregion
export { addDeskAccount_createServerFn_handler, approveOutgoing_createServerFn_handler, bumpDeskEpoch_createServerFn_handler, changeAdminCreds_createServerFn_handler, claimCopyAdmin_createServerFn_handler, completeAdminReset_createServerFn_handler, confirmWebauthn_createServerFn_handler, confirmYubi_createServerFn_handler, connectXAdmin_createServerFn_handler, deleteDeskAccount_createServerFn_handler, disconnectXAdmin_createServerFn_handler, enrollYubi_createServerFn_handler, listDeskAccounts_createServerFn_handler, loadDeskVault_createServerFn_handler, peekCopyAdmin_createServerFn_handler, removeWebauthn_createServerFn_handler, removeYubi_createServerFn_handler, renewAdminPasswordWithX_createServerFn_handler, requestAdminReset_createServerFn_handler, resetSecondFactor_createServerFn_handler, revokeDeskSessions_createServerFn_handler, saveDeskVault_createServerFn_handler, secondFactorStatus_createServerFn_handler, setYubiPanelLock_createServerFn_handler, signInDesk_createServerFn_handler, trackProfitWallet_createServerFn_handler, trackUsdcWallet_createServerFn_handler, unlockBoundX_createServerFn_handler, webauthnBeginLogin_createServerFn_handler, webauthnBeginRegister_createServerFn_handler, webauthnFinishRegister_createServerFn_handler };
