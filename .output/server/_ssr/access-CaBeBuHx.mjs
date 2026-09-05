import { n as createMiddleware, r as createServerFn } from "./ssr.mjs";
import { _ as getSql, n as ADMIN_X_LABEL, t as ADMIN_X_HANDLE } from "./x-admin-Dt29NgIk.mjs";
import { f as looksLikeSecret, m as usdcReceiveError, u as isBtcReceiveAddress } from "./security-DAI2JSE-.mjs";
import { ADMIN_NAME_RE, adminLockReady, assert2fa, assertAdminX, assertNewAdminPass, bumpEpoch, clear2fa, consumeResetToken, createDeskUser, credsMatch, enroll2fa, enrolled2fa, enrolledRow, finishDeskUnlock, issueResetToken, listDeskUsers, matchDeskUser, removeDeskUser, rotateCreds, sessionIsAdminX, setPasswordless, setXBind, signAccessToken, signUserToken, storedAdminName, verifyAccessToken, verifyYubiTicket } from "./access.server-aW6gB_An.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-B40CSwqR.mjs";
import { n as guardedFetch } from "./net-guard-BVXXcES3.mjs";
import { randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/access-CaBeBuHx.js
var YUBI_OTP_RE = /^[cbdefghijklnrtuv]{44}$/;
function yubiPublicId(otp) {
	return otp.slice(0, 12);
}
function maskYubiId(publicId) {
	if (publicId.length < 6) return publicId;
	return `${publicId.slice(0, 4)}…${publicId.slice(-2)}`;
}
async function yubiRows() {
	try {
		return await (await getSql())`
      select id, public_id, last_otp from admin_yubi order by id asc
    `;
	} catch {
		return [];
	}
}
async function saveYubi(publicId, otp) {
	const sql = await getSql();
	const rows = await yubiRows();
	const same = rows.find((r) => r.public_id === publicId);
	if (same) {
		await sql`update admin_yubi set last_otp = ${otp}, enrolled_at = now() where public_id = ${publicId}`;
		return {
			slot: same.id,
			created: false
		};
	}
	if (rows.length >= 2) return { error: `Both YubiKey slots are full (2). Remove one before adding another.` };
	const slot = new Set(rows.map((r) => r.id)).has("1") ? "2" : "1";
	await sql`
    insert into admin_yubi (id, public_id, last_otp, enrolled_at)
    values (${slot}, ${publicId}, ${otp}, now())
    on conflict (id) do update set
      public_id = excluded.public_id,
      last_otp = excluded.last_otp,
      enrolled_at = now()
  `;
	return {
		slot,
		created: true
	};
}
async function touchYubi(publicId, otp) {
	await (await getSql())`update admin_yubi set last_otp = ${otp} where public_id = ${publicId}`;
}
async function consumeYubiOtp(otp) {
	const tap = otp.trim().toLowerCase();
	const cloud = await verifyYubicoOtp(tap);
	if (cloud) return cloud;
	const rows = await yubiRows();
	if (!rows.length) return "Enroll two admin YubiKeys in Admin before approving outgoing BTC or USDC.";
	const pid = yubiPublicId(tap);
	const row = rows.find((r) => r.public_id === pid);
	if (!row) return "That YubiKey is not one of the two enrolled admin keys.";
	if (row.last_otp && row.last_otp === tap) return "That YubiKey OTP was already used. Tap again.";
	try {
		await touchYubi(pid, tap);
	} catch {
		return "Could not record YubiKey tap.";
	}
	return null;
}
async function clearYubi(publicId) {
	const sql = await getSql();
	if (publicId) {
		await sql`delete from admin_yubi where public_id = ${publicId}`;
		return;
	}
	await sql`delete from admin_yubi`;
}
async function verifyYubicoOtp(otp) {
	if (!YUBI_OTP_RE.test(otp)) return "Tap the YubiKey in this field (44-character Yubico OTP).";
	const nonce = randomBytes(16).toString("hex");
	const id = process.env.YUBICO_CLIENT_ID?.trim() || "1";
	const hosts = [
		"https://api.yubico.com/wsapi/2.0/verify",
		"https://api2.yubico.com/wsapi/2.0/verify",
		"https://api3.yubico.com/wsapi/2.0/verify",
		"https://api4.yubico.com/wsapi/2.0/verify",
		"https://api5.yubico.com/wsapi/2.0/verify"
	];
	const query = `id=${encodeURIComponent(id)}&otp=${encodeURIComponent(otp)}&nonce=${nonce}`;
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), 8e3);
	try {
		const settled = await Promise.allSettled(hosts.map((url) => guardedFetch(`${url}?${query}`, { signal: ac.signal })));
		let replay = false;
		let bad = false;
		for (const item of settled) {
			if (item.status !== "fulfilled" || !item.value.ok) continue;
			const body = await item.value.text();
			if (!body.includes(`nonce=${nonce}`)) continue;
			if (/\bstatus=OK\b/.test(body)) return null;
			if (/\bstatus=REPLAYED_OTP\b/.test(body)) replay = true;
			if (/\bstatus=BAD_OTP\b/.test(body)) bad = true;
		}
		if (replay) return "That YubiKey OTP was already used. Tap again.";
		if (bad) return "YubiCloud rejected that OTP.";
		return "YubiCloud could not verify that tap. Try again.";
	} catch {
		return "YubiCloud is unreachable. Try the tap again.";
	} finally {
		clearTimeout(timer);
	}
}
var optionalXSession = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CVqXY6bk.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { getSessionUser } = await import("./verify.server-Cz2Eax-R.mjs");
	const { runWithBearer } = await import("./access.server-aW6gB_An.mjs");
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
		const { getRequest } = await import("./server-DFlXc04R.mjs").then((n) => n.t);
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
	if (blocked) return {
		ok: false,
		error: blocked
	};
	if (looksLikeSecret(data.user) || looksLikeSecret(data.pass)) return {
		ok: false,
		error: "Secret rejected. Never paste a Coinbase key or wallet seed here."
	};
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
		if (!deskUser) return {
			ok: false,
			error: "Wrong name or password."
		};
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
	if (!await sessionIsAdminX(xUserId)) return {
		ok: false,
		error: "This X session is not the operator account."
	};
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
	if (looksLikeSecret(data.current) || looksLikeSecret(data.next) || looksLikeSecret(data.nextName)) return {
		ok: false,
		error: "Secret rejected. Never paste a Coinbase key or wallet seed here."
	};
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
	if (looksLikeSecret(data.username) || looksLikeSecret(data.pass)) return {
		ok: false,
		error: "Secret rejected. Never paste a Coinbase key or wallet seed here."
	};
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
		})) : []
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
		token: await signAccessToken()
	};
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
		if (data.publicId) await clearYubi((await yubiRows()).find((k) => k.id === data.publicId || maskYubiId(k.public_id) === data.publicId)?.public_id);
		else await clearYubi();
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
		const { readVault } = await import("./treasury.server-Dij4LfsI.mjs");
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
		const { readVault, writeVault } = await import("./treasury.server-Dij4LfsI.mjs");
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
		const { profitChain } = await import("./treasury.server-Dij4LfsI.mjs");
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
		const { usdcChain } = await import("./treasury.server-Dij4LfsI.mjs");
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
//#endregion
export { addDeskAccount_createServerFn_handler, approveOutgoing_createServerFn_handler, bumpDeskEpoch_createServerFn_handler, changeAdminCreds_createServerFn_handler, completeAdminReset_createServerFn_handler, confirmYubi_createServerFn_handler, connectXAdmin_createServerFn_handler, deleteDeskAccount_createServerFn_handler, disconnectXAdmin_createServerFn_handler, enrollYubi_createServerFn_handler, listDeskAccounts_createServerFn_handler, loadDeskVault_createServerFn_handler, removeYubi_createServerFn_handler, renewAdminPasswordWithX_createServerFn_handler, requestAdminReset_createServerFn_handler, resetSecondFactor_createServerFn_handler, revokeDeskSessions_createServerFn_handler, saveDeskVault_createServerFn_handler, secondFactorStatus_createServerFn_handler, signInDesk_createServerFn_handler, trackProfitWallet_createServerFn_handler, trackUsdcWallet_createServerFn_handler, unlockBoundX_createServerFn_handler };
