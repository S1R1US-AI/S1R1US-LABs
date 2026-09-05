import { a as getServerFnById, i as TSS_SERVER_FUNCTION, n as createMiddleware, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BNkAX6-X.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { i as signOut } from "./client-CVqXY6bk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-B2Izd0c7.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/operator-D_-RuOB2.js
var optionalXSession = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CVqXY6bk.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { getSessionUser } = await import("./verify.server-D6IajyLv.mjs");
	const { runWithBearer } = await import("./access.server-BPV3s8hu.mjs");
	const bearer = context.bearerToken;
	const user = await getSessionUser(bearer);
	return runWithBearer(bearer, () => next({ context: {
		...context,
		bearerToken: bearer,
		xUserId: user?.id ?? null
	} }));
});
createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("6b8982d09e1149c67c73735b62707e48db97be044371de46161546bbb93d065e"));
var bumpDeskEpoch = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("1078d4d28c3e8d28ab7fe6b4f0b5af95d0185184a4a96f94ac063f68f4e2899a"));
var signInDesk = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("dca4d87376279eca9587a4116dd129419dd87dba6ff83aa63103145403d231c1"));
var changeAdminCreds = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("714e6a99647b786be76155dccc41f88d1e9cd20b7c7759e61c1c7581a763f559"));
var listDeskAccounts = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("028840d145605509d02a84e3c9e10e20666a2f09596e3760b8531e00337b142b"));
var addDeskAccount = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("aabfbd992d53b80b9bfa984840ff4f1fa6047cd24fbf19077c50c7eb262c25e7"));
var deleteDeskAccount = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("a73ac4990fa60fd9c4761549d20c270b5a523ed55c0345083fa595814a22715a"));
var secondFactorStatus = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).handler(createSsrRpc("f90b29ef79efd75cfcbf8084099a6bb59379e1a4b6f492752d0faa3050ca8c58"));
var unlockBoundX = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).handler(createSsrRpc("66bce2ab80060d1a3cf1f7adb491e9c151baec4204d8ee6fa73c6f79d234b173"));
var connectXAdmin = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(createSsrRpc("99a48c81c1c9a39e8a8cf483a677adafc020c90f1cebb7a7636d99460f61d497"));
var disconnectXAdmin = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(createSsrRpc("61219593192ece2914d98974b32d3ecf6190fe2d923e9dac9abd63fcdd198b09"));
var resetSecondFactor = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(createSsrRpc("41c7f435231776334c1ee8bedbd182aac11b8b488b4280d092b91c02f5304912"));
var confirmYubi = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(createSsrRpc("1f504f3759a09927c02161a4fe94340a66e215dbd27eebb3c61862e71b436d44"));
var enrollYubi = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("4fa8b20236df6ba606e4ca17dcdb1e4be033ec0167e3fac02a23b1e395de0728"));
var removeYubi = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("c10fb0a85e2cd1077f8f287b7d041a6d84db2e3e7e9084332a5a19de89eba858"));
var approveOutgoing = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("c8c38dc27a85273c33a153b8bdd9ceb8050fbee3fd4aa99a6af0967f62bea416"));
var loadDeskVault = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("39488170e2f4ede9521cf8480eb8834ea03a488feddb0db2a53c0da49cd81522"));
var saveDeskVault = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("61dc68cb3e47b6f737b59aef4206d5d95c923fca2fd17a743f42496022983ea9"));
var trackProfitWallet = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("fb063609c78071b3e3e758f104f3addd377f7e782d404c1649251722ec90a80e"));
var trackUsdcWallet = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("655b6287f928b66af4ea43a18d488ad65454dde5a25513c897a89ec520fbb53a"));
var requestAdminReset = createServerFn({ method: "POST" }).middleware([optionalXSession]).handler(createSsrRpc("c07cac131e869252f1c8f5a7d6921698ad393b5d17f3b98af547969e3722495a"));
var completeAdminReset = createServerFn({ method: "POST" }).middleware([optionalXSession]).validator((input) => input).handler(createSsrRpc("3a9d5b832410bc3d673c52dcdfddff6b023d4a16b6642a4e4a5ff90fbc69ba47"));
var renewAdminPasswordWithX = createServerFn({ method: "POST" }).middleware([optionalXSession, authMiddleware]).validator((input) => input).handler(createSsrRpc("7a0518f7402808c01848d78b41fe4e037690e17016b522dd8589178db010723e"));
var TOKEN_KEY = "h3-op-token";
var ROLE_KEY = "h3-op-role";
var NAME_KEY = "h3-op-name";
var IDLE_FLAG = "h3-idle-lock";
function readSessionToken() {
	try {
		return sessionStorage.getItem(TOKEN_KEY) ?? "";
	} catch {
		return "";
	}
}
function readSessionRole() {
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
function writeSessionToken(token, role = "", name = "") {
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
	} catch {}
}
function clearIdleFlag() {
	try {
		localStorage.removeItem(IDLE_FLAG);
	} catch {}
}
function raiseIdleFlag() {
	try {
		localStorage.setItem(IDLE_FLAG, String(Date.now()));
	} catch {}
}
var useOperator = create()(persist((set, get) => ({
	token: "",
	yubiTicket: "",
	unlocked: false,
	idleLocked: false,
	role: "",
	operatorName: "",
	audit: [],
	unlock: async (user, pass) => {
		const res = await signInDesk({ data: {
			user,
			pass
		} });
		if (!res.ok) {
			get().log("reject", "Sign-in failed");
			return res.error;
		}
		if (res.needYubi) {
			set({
				yubiTicket: res.ticket,
				token: "",
				unlocked: false,
				role: "",
				operatorName: ""
			});
			get().log("yubi", "YubiKey tap required");
			return "yubi";
		}
		const role = "role" in res ? res.role : "admin";
		const operatorName = "username" in res ? res.username : "";
		writeSessionToken(res.token, role, operatorName);
		clearIdleFlag();
		set({
			token: res.token,
			unlocked: true,
			yubiTicket: "",
			idleLocked: false,
			role,
			operatorName
		});
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
		const res = await completeAdminReset({ data: {
			token,
			next,
			confirm
		} });
		if (!res.ok) {
			get().log("reject", "Password renew failed");
			return res.error;
		}
		get().log("password", "Admin password renewed from mailbox link");
		return null;
	},
	renewWithX: async (next, confirm, nextName) => {
		const res = await renewAdminPasswordWithX({ data: {
			next,
			confirm,
			nextName
		} });
		if (!res.ok) {
			get().log("reject", "Password renew failed");
			return res.error;
		}
		writeSessionToken(res.token, "admin", res.adminName);
		clearIdleFlag();
		set({
			token: res.token,
			unlocked: true,
			yubiTicket: "",
			idleLocked: false,
			role: "admin",
			operatorName: res.adminName
		});
		get().log("password", "Admin password renewed by operator X");
		return null;
	},
	openRenew: async (next, confirm) => {
		return get().renewWithX(next, confirm);
	},
	tapYubi: async (otp) => {
		const res = await confirmYubi({ data: {
			ticket: get().yubiTicket,
			otp
		} });
		if (!res.ok) {
			get().log("reject", "YubiKey failed");
			return res.error;
		}
		writeSessionToken(res.token, "admin", get().operatorName);
		clearIdleFlag();
		set({
			token: res.token,
			unlocked: true,
			yubiTicket: "",
			idleLocked: false,
			role: "admin"
		});
		get().log("unlock", "YubiKey accepted");
		return null;
	},
	changeCreds: async (current, next, confirm, nextName) => {
		const res = await changeAdminCreds({ data: {
			token: get().token,
			current,
			next,
			confirm,
			nextName
		} });
		if (!res.ok) {
			get().log("reject", "Credential change failed");
			return res.error;
		}
		writeSessionToken(res.token, "admin", res.adminName);
		clearIdleFlag();
		set({
			token: res.token,
			unlocked: true,
			yubiTicket: "",
			idleLocked: false,
			role: "admin",
			operatorName: res.adminName
		});
		get().log("password", nextName.trim() ? "Admin name/password updated" : "Admin password rotated");
		return null;
	},
	lock: async () => {
		const token = get().token;
		if (token && get().role === "admin") try {
			await bumpDeskEpoch({ data: { token } });
		} catch {}
		writeSessionToken("");
		clearIdleFlag();
		set({
			token: "",
			unlocked: false,
			yubiTicket: "",
			idleLocked: false,
			role: "",
			operatorName: ""
		});
		get().log("lock", "Session closed");
		try {
			await signOut("/login");
		} catch {
			try {
				sessionStorage.removeItem("grok-auth.bearer-token");
			} catch {}
		}
	},
	lockFromIdle: async () => {
		const token = get().token;
		const wasAdmin = get().role === "admin";
		writeSessionToken("");
		raiseIdleFlag();
		set({
			token: "",
			unlocked: false,
			yubiTicket: "",
			idleLocked: true,
			role: "",
			operatorName: ""
		});
		get().log("lock", "Idle lock");
		if (token && wasAdmin) try {
			await bumpDeskEpoch({ data: { token } });
		} catch {}
	},
	log: (kind, note) => {
		const ev = {
			id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			kind,
			note
		};
		set((s) => ({ audit: [ev, ...s.audit].slice(0, 40) }));
	}
}), {
	name: "h3-operator-lock",
	partialize: (s) => ({
		audit: s.audit,
		idleLocked: s.idleLocked
	}),
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
	}
}));
if (typeof window !== "undefined") window.addEventListener("storage", (e) => {
	if (e.key !== IDLE_FLAG || !e.newValue) return;
	writeSessionToken("");
	try {
		sessionStorage.removeItem("grok-auth.bearer-token");
	} catch {}
	useOperator.setState({
		token: "",
		unlocked: false,
		yubiTicket: "",
		idleLocked: true,
		role: "",
		operatorName: ""
	});
});
//#endregion
export { disconnectXAdmin as a, loadDeskVault as c, saveDeskVault as d, secondFactorStatus as f, createSsrRpc as g, useOperator as h, deleteDeskAccount as i, removeYubi as l, trackUsdcWallet as m, approveOutgoing as n, enrollYubi as o, trackProfitWallet as p, connectXAdmin as r, listDeskAccounts as s, addDeskAccount as t, resetSecondFactor as u };
