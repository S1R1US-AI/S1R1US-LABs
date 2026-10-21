import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/x-session-BKAgXbNC.js
/**
* Forwards the signed-in X session to admin server functions. In the live preview the
* app runs in an iframe whose cookies do not reach the server, so the session travels
* as a bearer token; when deployed the cookie is used.
*/
var optionalXSession = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-Dp7wcF1K.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { getSessionUser } = await import("./verify.server-MPe6fyqc.mjs");
	const { runWithBearer } = await import("./access.server-CF7ff_ig.mjs").then((n) => n.r).then((n) => n.r);
	const bearer = context.bearerToken;
	const user = await getSessionUser(bearer);
	return runWithBearer(bearer, () => next({ context: {
		...context,
		bearerToken: bearer,
		xUserId: user?.id ?? null
	} }));
});
//#endregion
export { optionalXSession as t };
