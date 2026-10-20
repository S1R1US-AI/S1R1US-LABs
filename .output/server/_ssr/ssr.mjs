import { r as __exportAll } from "../_runtime.mjs";
import { A as toCrossJSONStream, B as waitForReason, C as require_jsx_runtime, D as fromJSON, F as resolveManifestAssetLink, G as isRedirect, H as invariant, I as resolveManifestCssLink, J as rootRouteId, K as parseRedirect, N as getScriptPreloadAttrs, P as getStylesheetHref, R as isDangerousProtocol, V as _getRenderedMatches, X as require_react, Y as isNotFound, a as isSsrResponse, i as disposeSsrResponse, k as toCrossJSONAsync, n as bindSsrResponseToRequest, o as normalizeSsrResponse, p as RouterProvider, r as defineHandlerCallback, s as stripSsrResponseBody, t as renderRouterToStream, z as isPromise } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as defaultSerovalDeserializerPlugins, c as parseSetCookie, i as createRawStreamRPCPlugin, l as serialize, n as attachRouterServerSsrUtils, o as makeSerovalPlugin, r as getNormalizedURL, s as createSerializationAdapter, t as mergeHeaders, u as splitSetCookieString } from "../_libs/@tanstack/router-core+[...].mjs";
import { n as createServerHistory } from "../_libs/tanstack__history.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.nitro/vite/services/ssr/assets/internal-request-response-Bf7-NVJl.js
function getSetCookieValues(headers) {
	const headersWithSetCookie = headers;
	if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
	const value = headers.get("set-cookie");
	return value ? splitSetCookieString(value) : [];
}
var GLOBAL_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
var PROTECTED_RESPONSE_HEADERS = Symbol.for("tanstack-start:protected-response-headers");
function getProtectedResponseHeaders(response) {
	return response[PROTECTED_RESPONSE_HEADERS];
}
function installProtectedResponseHeaders(response, headers) {
	Object.defineProperty(response, PROTECTED_RESPONSE_HEADERS, {
		value: headers,
		configurable: true
	});
}
/** Transport requirements belong to the encoded body, not its wrapper. */
function transferResponseProtocol(source, target) {
	const protectedHeaders = getProtectedResponseHeaders(source);
	if (protectedHeaders && getProtectedResponseHeaders(target) !== protectedHeaders) installProtectedResponseHeaders(target, protectedHeaders);
}
/** Preserve metadata when Start reconstructs an existing response. */
function transferResponseMetadata(source, target) {
	transferResponseProtocol(source, target);
	const event = eventStorage.getStore();
	const appliedHeaderAppends = event?.responseHeaderAppends?.get(source);
	if (appliedHeaderAppends) event.responseHeaderAppends.set(target, appliedHeaderAppends);
}
function sanitizeStatusMessage(statusMessage) {
	return statusMessage.replace(/[^\t\x20-\x7e]/g, "");
}
function sanitizeStatusCode(statusCode) {
	const code = typeof statusCode === "string" ? Number(statusCode) : statusCode;
	if (code === void 0 || !Number.isInteger(code) || code < 200 || code > 599) return;
	return code;
}
function getObjectProperty(value, key) {
	if (typeof value === "object" && value || typeof value === "function") return value[key];
}
function getStatusCodeProperty(value, key) {
	const property = getObjectProperty(value, key);
	if (typeof property === "string" || typeof property === "number") return property;
}
function getErrorStatus(error) {
	const cause = getObjectProperty(error, "cause");
	return sanitizeStatusCode(getStatusCodeProperty(error, "status") ?? getStatusCodeProperty(error, "statusCode") ?? getStatusCodeProperty(cause, "status") ?? getStatusCodeProperty(cause, "statusCode"));
}
function getErrorStatusText(error) {
	const cause = getObjectProperty(error, "cause");
	const statusText = getObjectProperty(error, "statusText") ?? getObjectProperty(error, "statusMessage") ?? getObjectProperty(cause, "statusText") ?? getObjectProperty(cause, "statusMessage");
	if (typeof statusText === "string") return sanitizeStatusMessage(statusText);
}
var GENERATED_BODY_EXCLUDED_HEADERS = /* @__PURE__ */ new Set([
	"connection",
	"content-encoding",
	"content-length",
	"keep-alive",
	"proxy-connection",
	"te",
	"trailer",
	"transfer-encoding"
]);
function isResponse(value) {
	return value instanceof Response || Object.prototype.toString.call(value) === "[object Response]";
}
function getErrorHeaders(error) {
	let init = getObjectProperty(error, "headers");
	if (!init) {
		const cause = getObjectProperty(error, "cause");
		if (isResponse(cause)) return;
		init = getObjectProperty(cause, "headers");
	}
	if (!init) return;
	let headers;
	try {
		headers = new Headers(init);
	} catch {
		return;
	}
	for (const name of GENERATED_BODY_EXCLUDED_HEADERS) headers.delete(name);
	return headers;
}
function getResponseState(event) {
	return event.responseState ||= {
		headers: new Headers(),
		clearHeaders: false
	};
}
function getDistinctCookieKey(name, options, defaultPath = "") {
	return [
		name,
		options.domain || "",
		options.path ?? defaultPath
	].join(";");
}
function getDistinctCookieKeyFromHeader(cookie) {
	const parsed = parseSetCookie(cookie);
	return parsed ? getDistinctCookieKey(parsed.name, parsed) : `\0${cookie}`;
}
function replaceSetCookieValues(headers, cookies) {
	headers.delete("set-cookie");
	for (const cookie of cookies) headers.append("set-cookie", cookie);
}
function getCookieKey(state, cookie) {
	const keys = state.setCookieKeys ||= /* @__PURE__ */ new Map();
	let key = keys.get(cookie);
	if (key === void 0) {
		key = getDistinctCookieKeyFromHeader(cookie);
		keys.set(cookie, key);
	}
	return key;
}
function getMergedSetCookieValues(state, currentCookies, cookiesToMerge) {
	if (currentCookies.length === 0) return cookiesToMerge;
	const cookieKeysToMerge = /* @__PURE__ */ new Set();
	for (const cookie of cookiesToMerge) cookieKeysToMerge.add(getCookieKey(state, cookie));
	return currentCookies.filter((cookie) => !cookieKeysToMerge.has(getCookieKey(state, cookie))).concat(cookiesToMerge);
}
function mergeStartSetCookieValues(event, cookies) {
	if (cookies.length === 0) return;
	const state = getResponseState(event);
	state.removedHeaders?.delete("set-cookie");
	if (state.setCookieBehavior !== "replace") state.setCookieBehavior = "merge";
	replaceSetCookieValues(state.headers, getMergedSetCookieValues(state, getSetCookieValues(state.headers), cookies));
}
function hasProtectedHeaderChanges(response, protectedHeaders) {
	const headers = response.headers;
	for (const [name, value] of protectedHeaders) if (headers.get(name) !== value) return true;
	return false;
}
function applyProtectedHeaders(protectedHeaders, headers) {
	for (const [name, value] of protectedHeaders) if (value === null) headers.delete(name);
	else headers.set(name, value);
}
function applyHeaderState(target, state, generatedBody, protectedHeaders, appliedHeaderAppends) {
	let headers = target;
	const mutableHeaders = () => {
		if (headers === target) headers = new Headers(target);
		return headers;
	};
	if (state.clearHeaders) {
		for (const name of Array.from(target.keys())) if (!protectedHeaders?.has(name)) mutableHeaders().delete(name);
	}
	if (!state.clearHeaders && state.removedHeaders) {
		for (const name of state.removedHeaders) if (!protectedHeaders?.has(name) && headers.has(name)) mutableHeaders().delete(name);
	}
	for (const [name, value] of state.headers) if (name !== "set-cookie" && !protectedHeaders?.has(name) && !(generatedBody && GENERATED_BODY_EXCLUDED_HEADERS.has(name))) {
		let append = state.headerAppends?.get(name);
		if (!append) {
			if (headers.get(name) !== value) mutableHeaders().set(name, value);
			continue;
		}
		const applied = appliedHeaderAppends?.get(name);
		const pending = [];
		while (append && append !== applied) {
			pending.push(append.value);
			append = append.previous;
		}
		for (let index = pending.length - 1; index >= 0; index--) mutableHeaders().append(name, pending[index]);
	}
	if (state.setCookieBehavior && !protectedHeaders?.has("set-cookie")) {
		const eventSetCookies = getSetCookieValues(state.headers);
		const currentCookies = getSetCookieValues(headers);
		const cookies = state.setCookieBehavior === "replace" ? eventSetCookies : getMergedSetCookieValues(state, currentCookies, eventSetCookies);
		if (cookies.length !== currentCookies.length || cookies.some((cookie, index) => cookie !== currentCookies[index])) replaceSetCookieValues(mutableHeaders(), cookies);
	}
	return headers;
}
function canHaveBody(method, status) {
	return method !== "HEAD" && status !== 204 && status !== 205 && status !== 304;
}
/** A protected content type marks a Start-serialized body the client decodes. */
function isSerializedResponse(protectedHeaders) {
	return typeof protectedHeaders?.get("content-type") === "string";
}
/**
* A helper status that forbids a body never applies to a serialized
* server-function reply, because the client must decode it. Only a HEAD request
* drops its body.
*/
function getHelperStatus(state, serialized) {
	const status = state?.status;
	if (!serialized || status === void 0 || canHaveBody("GET", status)) return status;
}
/** Helper status text describes the helper status and is ignored with it. */
function getHelperStatusText(state, helperStatus) {
	return helperStatus === state?.status ? state?.statusText : void 0;
}
function cancelDroppedBody(response, reason) {
	try {
		response.body?.cancel(reason).catch(() => {});
	} catch {}
}
function createReconciledResponse(body, status, statusText, headers) {
	try {
		return new Response(body, {
			status,
			statusText,
			headers
		});
	} catch (cause) {
		throw new Error("Unable to reconcile response because its body has already been consumed or locked.", { cause });
	}
}
/** Apply helper state to a response that leaves Start. */
function finalizeResponse(response, event) {
	return applyResponseState(response, event, event.request.method);
}
/**
* Apply helper state with the body rules of `method`. Request middleware still
* reads a HEAD response's body, so the pipeline applies GET rules and strips a
* HEAD body only when the response leaves it.
*/
function applyResponseState(response, event, method, disposeBody) {
	const protectedHeaders = getProtectedResponseHeaders(response);
	const serialized = isSerializedResponse(protectedHeaders);
	let helperStatus = getHelperStatus(event.responseState, serialized);
	const mustDropBody = !canHaveBody(method, helperStatus ?? response.status) && response.body !== null;
	if (mustDropBody) {
		const reason = method === "HEAD" ? "HEAD body stripped" : "Response body dropped by Start reconciliation";
		if (disposeBody) disposeBody(reason);
		else cancelDroppedBody(response, reason);
		helperStatus = getHelperStatus(event.responseState, serialized);
	}
	const state = event.responseState;
	if (!state && !mustDropBody) {
		event.currentResponse = response;
		return response;
	}
	const status = helperStatus ?? response.status;
	const statusText = getHelperStatusText(state, helperStatus) ?? response.statusText;
	const statusChanged = status !== response.status;
	const statusTextChanged = statusText !== response.statusText;
	const headers = state ? applyHeaderState(response.headers, state, serialized, protectedHeaders, event.responseHeaderAppends?.get(response)) : response.headers;
	const reconciled = statusChanged || statusTextChanged || mustDropBody || headers !== response.headers ? createReconciledResponse(mustDropBody ? null : response.body, status, statusText, headers) : response;
	if (protectedHeaders && reconciled !== response) installProtectedResponseHeaders(reconciled, protectedHeaders);
	return publishResponse(reconciled, event);
}
function publishResponse(response, event) {
	const headerAppends = event.responseState?.headerAppends;
	if (headerAppends?.size) (event.responseHeaderAppends ||= /* @__PURE__ */ new WeakMap()).set(response, new Map(headerAppends));
	event.currentResponse = response;
	return response;
}
function getHttpErrorStatus(status) {
	return status !== void 0 && status >= 400 ? status : void 0;
}
/**
* Status for a response built from an uncaught error. Only an error status
* (400-599) from a helper or from error metadata describes the failure, so a
* success or redirect status set before the throw cannot hide it. The error is
* logged unless its own metadata marks it as an HTTP error. Reporting runs
* before helper state is read, so hooks that write helpers are included.
*/
function resolveErrorStatus(error, event) {
	const metadataStatus = getErrorStatus(error);
	const errorStatus = getHttpErrorStatus(metadataStatus);
	if (errorStatus === void 0) console.error(error);
	const state = event?.responseState;
	const helperStatus = getHttpErrorStatus(state?.status);
	const status = helperStatus ?? errorStatus ?? 500;
	const statusText = getHelperStatusText(state, helperStatus) ?? (status === errorStatus || metadataStatus === void 0 ? getErrorStatusText(error) : void 0) ?? "";
	if (state && state.status !== helperStatus) {
		state.status = void 0;
		state.statusText = void 0;
	}
	return {
		status,
		statusText
	};
}
/**
* Internal: status and status text for a serialized server-function error.
* Logs the error and discards a non-error helper status, like any error
* response Start builds.
*/
function resolveErrorResponseStatus(error) {
	return resolveErrorStatus(error, eventStorage.getStore());
}
function createErrorResponse(error, event) {
	let headers = getErrorHeaders(error) ?? new Headers();
	const { status, statusText } = resolveErrorStatus(error, event);
	const state = event.responseState;
	const body = canHaveBody(event.request.method, status) ? JSON.stringify({
		status,
		statusText,
		unhandled: true,
		message: "HTTPError"
	}) : null;
	if (!headers.has("content-type")) headers.set("content-type", "application/json");
	if (state) headers = applyHeaderState(headers, state, true);
	return publishResponse(new Response(body !== null && !headers.has("content-type") ? new TextEncoder().encode(body) : body, {
		status,
		statusText,
		headers
	}), event);
}
function finalizeError(error, event) {
	if (error instanceof Response) return finalizeResponse(error, event);
	return createErrorResponse(error, event);
}
function handleStartError(error) {
	const event = eventStorage.getStore();
	if (event) return finalizeError(error, event);
	if (error instanceof Response) return error;
	const request = new Request("http://localhost");
	return createErrorResponse(error, {
		request,
		requestUrl: new URL(request.url)
	});
}
/** Apply helper state to a response inside the request middleware pipeline. */
function reconcileResponse(response, event, disposeBody) {
	if (!event.responseState && (response === event.currentResponse || canHaveBody("GET", response.status)) || isRedirect(response)) {
		event.currentResponse = response;
		return response;
	}
	return applyResponseState(response, event, "GET", disposeBody);
}
/**
* Restore protocol headers that middleware changed directly on the response.
* Start does this once, when the response leaves the request middleware
* pipeline; helper writes never override them.
*/
function restoreResponseProtocol(response, event) {
	const protectedHeaders = getProtectedResponseHeaders(response);
	if (!protectedHeaders || !hasProtectedHeaderChanges(response, protectedHeaders)) return response;
	const headers = new Headers(response.headers);
	applyProtectedHeaders(protectedHeaders, headers);
	const restored = createReconciledResponse(response.body, response.status, response.statusText, headers);
	transferResponseMetadata(response, restored);
	event.currentResponse = restored;
	return restored;
}
/**
* Build a Start-owned serialized reply with already normalized protocol
* headers. A bodyless helper status never applies to it; only a HEAD request
* drops its body.
*/
function createFinalizedResponse(body, headers, protectedHeaders, event) {
	const state = event.responseState;
	let status = 200;
	let statusText = "";
	if (state) {
		const helperStatus = getHelperStatus(state, true);
		status = helperStatus ?? 200;
		statusText = getHelperStatusText(state, helperStatus) ?? "";
		headers = applyHeaderState(headers, state, true, protectedHeaders);
	}
	const response = new Response(canHaveBody(event.request.method, status) ? body : null, {
		status,
		statusText,
		headers
	});
	installProtectedResponseHeaders(response, protectedHeaders);
	return publishResponse(response, event);
}
function protectResponseHeaders(response, headers) {
	const previous = getProtectedResponseHeaders(response);
	if (previous === headers) return;
	if (previous) {
		const merged = new Map(previous);
		for (const [name, value] of headers) merged.set(name, value);
		headers = merged;
	}
	installProtectedResponseHeaders(response, headers);
}
/**
* Set and protect transport headers on a new response. Reuse the body stream
* without cloning or teeing it; callers transfer ownership to the result.
*/
function setProtectedResponseHeaders(response, headers) {
	let next;
	try {
		next = new Response(response.body, response);
		applyProtectedHeaders(headers, next.headers);
	} catch (cause) {
		throw new Error("Unable to set response header because its body has already been consumed or locked.", { cause });
	}
	transferResponseMetadata(response, next);
	protectResponseHeaders(next, headers);
	return next;
}
function decodePathname(pathname) {
	try {
		return decodeURI(pathname);
	} catch (error) {
		if (error instanceof URIError) return;
		throw error;
	}
}
function runInStartRequest(request, requestOpts, handler) {
	let requestUrl;
	try {
		requestUrl = new URL(request.url);
	} catch (error) {
		if (error instanceof TypeError) return new Response(null, {
			status: 400,
			statusText: "Bad Request"
		});
		throw error;
	}
	const pathname = requestUrl.pathname;
	if (pathname.includes("%") && decodePathname(pathname) === void 0) return new Response(null, {
		status: 400,
		statusText: "Bad Request"
	});
	const event = {
		request,
		requestUrl
	};
	return eventStorage.run(event, handler, request, requestOpts, event);
}
/**
* Keep the complete server entry, including custom error handling, inside one
* request scope. A custom returned response is used as-is; call handleStartError
* in a custom catch to preserve Start's response helper state.
*/
function createServerEntry$1(entry) {
	return { fetch: withStartRequest(async (request, requestOpts) => {
		try {
			return await entry.fetch(request, requestOpts);
		} catch (error) {
			return handleStartError(error);
		}
	}) };
}
/**
* Establish request scope; the response pipeline owns reconciliation. A nested
* handler delegating the same request participates in its scope. Independent
* fetch invocations and different requests get a fresh event.
*/
function withStartRequest(handler) {
	return (request, requestOpts) => {
		const event = eventStorage.getStore();
		if (event?.request === request) return handler(request, requestOpts, event);
		return runInStartRequest(request, requestOpts, handler);
	};
}
function getStartEvent() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event;
}
/**
* Internal: returns the per-request parsed URL for `request`, memoized on the
* Start event so the framework parses each request URL only once. Falls back
* to parsing when called outside a Start event (e.g. in unit tests) or for a
* foreign request. Callers MUST NOT mutate the returned URL.
*/
function getParsedRequestUrl(request) {
	const event = eventStorage.getStore();
	if (event && event.request === request) return event.requestUrl;
	return new URL(request.url);
}
function getRequest() {
	return getStartEvent().request;
}
function getRequestHeaders() {
	return getStartEvent().request.headers;
}
function getRequestHeader(name) {
	return getRequestHeaders().get(name) ?? void 0;
}
/**
* Get the request hostname.
*
* If `xForwardedHost` is `true`, it will use the `x-forwarded-host` header if it exists.
*
* If no host header is found, it uses the request URL's host.
*/
function getRequestHost(opts) {
	const headers = getRequestHeaders();
	if (opts?.xForwardedHost) {
		const host = headers.get("x-forwarded-host")?.split(",", 1)[0]?.trim();
		if (host) return host;
	}
	return headers.get("host") || getStartEvent().requestUrl.host || "localhost";
}
/**
* Set a cookie value by name.
* @param name Name of the cookie to set
* @param value Value of the cookie to set
* @param options {CookieSerializeOptions} Options for serializing the cookie
* ```ts
* setCookie('Authorization', '1234567')
* ```
*/
function setCookie(name, value, options) {
	const { encode, stringify, ...attrs } = options ?? {};
	mergeStartSetCookieValues(getStartEvent(), [serialize({
		name,
		value,
		path: "/",
		...attrs
	}, {
		encode,
		stringify
	})]);
}
/**
* Internal: helper status state for a serialized server-function reply.
* Bodyless statuses never apply to it and are omitted with their status text.
*/
function getSerializedResponseState() {
	const state = getStartEvent().responseState;
	const status = getHelperStatus(state, true);
	return {
		status,
		statusText: getHelperStatusText(state, status)
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/index.js
var ssr_exports = /* @__PURE__ */ __exportAll({
	a: () => getServerFnById,
	createServerEntry: () => createServerEntry,
	default: () => server_default,
	i: () => TSS_SERVER_FUNCTION,
	n: () => createMiddleware,
	o: () => HEADERS,
	r: () => createServerFn,
	t: () => createStartHandler
});
require_react();
var import_jsx_runtime = require_jsx_runtime();
function StartServer(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartServer, { router })
}));
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
/**
* @description Returns the router manifest data that should be sent to the client.
* This includes only the assets and preloads for the current route and any
* special assets that are needed for the client. It does not include relationships
* between routes or any other data that is not needed for the client.
*
* @param matchedRoutes - In dev mode, the matched routes are used to build
* the dev styles URL for route-scoped CSS collection.
*/
async function getStartManifest(matchedRoutes) {
	const { tsrStartManifest } = await import("../_tanstack-start-manifest_v-CxiiGHuB.mjs");
	const startManifest = tsrStartManifest();
	let routes = startManifest.routes;
	routes[rootRouteId];
	const manifestRoutes = {};
	for (const k in routes) {
		const v = routes[k];
		const result = {};
		if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
		if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
		if (v.css?.length) result.css = v.css;
		if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
	}
	return {
		...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
		...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
		routes: manifestRoutes
	};
}
var manifest = {
	"0119304a468f34290344afa31c702b340a12ef2ae972e27cecd33058c9d1ced0": {
		functionName: "setYubiPanelLock_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"028840d145605509d02a84e3c9e10e20666a2f09596e3760b8531e00337b142b": {
		functionName: "listDeskAccounts_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"0481761865848137848ea328ea5df62ee92834ec832192cd763b57cedaf884a9": {
		functionName: "confirmWebauthn_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"05aadc47905f591d09036fa351783a26a9a5db0045213487847835be1d2f1b12": {
		functionName: "askHeliosByo_createServerFn_handler",
		importer: () => import("./grok-Bp22T46u.mjs")
	},
	"08630dbdcc82e7ea9c877dbd4ba7153b1214827c58fc307a622d2d33054bfe0c": {
		functionName: "fetchGmBoard_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"08afd2e285c9ae25b69be9b0b0689069cb0b951c9f4e04fb46b172d4fbefd0e7": {
		functionName: "setGmLive_createServerFn_handler",
		importer: () => import("./gm-live-hhp3gDDQ.mjs")
	},
	"1078d4d28c3e8d28ab7fe6b4f0b5af95d0185184a4a96f94ac063f68f4e2899a": {
		functionName: "bumpDeskEpoch_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"1eda3a065e3f0b42de95beaed22e23df5e348fba2c87caae7820b1dd03e1e961": {
		functionName: "claimCopyAdmin_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"1f504f3759a09927c02161a4fe94340a66e215dbd27eebb3c61862e71b436d44": {
		functionName: "confirmYubi_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"2f88814ebe3c10d7156b6db6201076371c639ae3cf2a2a3bea005f8bfe6622dc": {
		functionName: "setGmBoardStatus_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"31199baf80fc241309bd11b14e343ec48ad346fb093882e65b45c27ba8367cb4": {
		functionName: "fetchHiveSwarm_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"31e5dd3b28e06f49ffb01f32fd9dcf61760e2f54fc54f4bb0be3c65ae954c524": {
		functionName: "fetchLiveSim_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"38899cab9b9e1946a930cd4a4c0042c64434b8f36fc9e04151f9faf8a5584e5c": {
		functionName: "setGmWagerStatus_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"39488170e2f4ede9521cf8480eb8834ea03a488feddb0db2a53c0da49cd81522": {
		functionName: "loadDeskVault_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"3a9d5b832410bc3d673c52dcdfddff6b023d4a16b6642a4e4a5ff90fbc69ba47": {
		functionName: "completeAdminReset_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"3bb2b512072976cd3a86a22f8611883216c8291ee761c4550c25d6127801d639": {
		functionName: "getGmLive_createServerFn_handler",
		importer: () => import("./gm-live-hhp3gDDQ.mjs")
	},
	"41c7f435231776334c1ee8bedbd182aac11b8b488b4280d092b91c02f5304912": {
		functionName: "resetSecondFactor_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"428fb23ec9fdf3ede46607e1241acc80a5022a44f56391a98b427fcb0e9286ec": {
		functionName: "fetchAgentFlags_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"4ad2fda086277f62e7ecbc8458401244541db57fe627e90504025516478eab67": {
		functionName: "fetchTapeMeta_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"4fa8b20236df6ba606e4ca17dcdb1e4be033ec0167e3fac02a23b1e395de0728": {
		functionName: "enrollYubi_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"56a5cd771ece1bf754af79b4554bf63f9f41484e364fb0b15cf2e36f5ee5bc68": {
		functionName: "setMorningReportPaused_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"5cf62f4e779d5d6880a0cc11d158c6be2e5eeb2026216ec06a53d5d2048406cd": {
		functionName: "fetchDesk_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"5d795ffcbdcf278e95568b2620b25787d8cc249f9c1bd5d88d8fc94e060d890b": {
		functionName: "fetchAuto24h_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"5e1297c3c46a34d5383344d4744427836346a714cac56b3c8b95fc2b8e31450d": {
		functionName: "probeLaunch_createServerFn_handler",
		importer: () => import("./probes-B47qjEN8.mjs")
	},
	"5fd7063674cca64fc5e76ee9b5c2a184e05a286f85934a9fde69c05c144aa196": {
		functionName: "fetchLockStatus_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"61219593192ece2914d98974b32d3ecf6190fe2d923e9dac9abd63fcdd198b09": {
		functionName: "disconnectXAdmin_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"61dc68cb3e47b6f737b59aef4206d5d95c923fca2fd17a743f42496022983ea9": {
		functionName: "saveDeskVault_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"645ce5dcd2143f301180bb73a3bbb42b5706b9673c921fa057498f2781d8f8b4": {
		functionName: "setTapeFreeze_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"655b6287f928b66af4ea43a18d488ad65454dde5a25513c897a89ec520fbb53a": {
		functionName: "trackUsdcWallet_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"66bce2ab80060d1a3cf1f7adb491e9c151baec4204d8ee6fa73c6f79d234b173": {
		functionName: "unlockBoundX_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"6b8982d09e1149c67c73735b62707e48db97be044371de46161546bbb93d065e": {
		functionName: "revokeDeskSessions_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"6cec224d2d3bacdaff9821d9e34983f58a4bb3ab931693a937be1ca19d5e3a92": {
		functionName: "rebuildDesk_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"6fc7d0f321f1594724d1925058050777d2ca782050e71ee4fdaa4a9efa735a20": {
		functionName: "webauthnBeginRegister_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"7092675022d7921cd8cc08898a38d6a7910d94df92d5d08d1b5ad31e50ccaeb3": {
		functionName: "fetchLockTickets_createServerFn_handler",
		importer: () => import("./lock-request-rpc-Ce5nwgK5.mjs")
	},
	"70e9587696840a33b344a5ecd8706e3aa8526f9c1a9462bcac2625207915aa78": {
		functionName: "askHelios_createServerFn_handler",
		importer: () => import("./grok-Bp22T46u.mjs")
	},
	"714e6a99647b786be76155dccc41f88d1e9cd20b7c7759e61c1c7581a763f559": {
		functionName: "changeAdminCreds_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"7352c638bd61f999d2be9e486607a1e67512dcfcc0182155697a6e28fb371501": {
		functionName: "postLockTicket_createServerFn_handler",
		importer: () => import("./lock-request-rpc-Ce5nwgK5.mjs")
	},
	"7426936e6524e949f61ef1414e1b7b92054624acddd912f28187bda0b5b11380": {
		functionName: "adminStatus_createServerFn_handler",
		importer: () => import("./grok-Bp22T46u.mjs")
	},
	"7a0518f7402808c01848d78b41fe4e037690e17016b522dd8589178db010723e": {
		functionName: "renewAdminPasswordWithX_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"7a4996c4db8a1aa4cca15b656b13d1e29fd87e599208137f37c014607844e570": {
		functionName: "setHiveSwarmStatus_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"7d0c11795f8624b74086b669339d9431d40f36fe77ad35a1e50d0b60b7e1bd4f": {
		functionName: "fetchSecurityBrief_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"7d95ce8b736ec263ed12bbaf93d618091433ac4e9c24ddd5d170c160adbb013c": {
		functionName: "fetchIntrusions_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"821cc51f8e53d995bccf344d723b48c673b7c3561883022e778666c2642bf20a": {
		functionName: "runHunterAudit_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"9245cf1543579f8b70006f205bc376319cfdaf0b4db35120c94bb0e492f21a83": {
		functionName: "webauthnFinishRegister_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"99a48c81c1c9a39e8a8cf483a677adafc020c90f1cebb7a7636d99460f61d497": {
		functionName: "connectXAdmin_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"9e2d670ea9885717b4bf6e44d44cffedc7a7dde00507e196e67749e1b40d8cca": {
		functionName: "unbarAgent_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"a09f23fe5bdae92d6c7606faa5e475556882d6ad931424c9a3c8a4bce42359e6": {
		functionName: "fetchDeskErrors_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"a73ac4990fa60fd9c4761549d20c270b5a523ed55c0345083fa595814a22715a": {
		functionName: "deleteDeskAccount_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"aabfbd992d53b80b9bfa984840ff4f1fa6047cd24fbf19077c50c7eb262c25e7": {
		functionName: "addDeskAccount_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"b362f7977f60bf3a07a7b092135628c037bdd92c14111c6c9f73719c4fb90045": {
		functionName: "fetchBtcMiners_createServerFn_handler",
		importer: () => import("./miner-rpc-B2WoNHrC.mjs")
	},
	"b39bd022495ae5e3a029e3daf43bd7890b38515d779d09a48ade7f9d35043be6": {
		functionName: "removeWebauthn_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"b78068c75690078e5a681d6804197292c06c5c9a8df7947d062d4d2a7ebd9393": {
		functionName: "isMarketingHost_createServerFn_handler",
		importer: () => import("./host-BFRARX_G.mjs")
	},
	"bd29d0b6bb34b0f97cb375088f5253f65373a39cffb50760d3afefd56a5a4669": {
		functionName: "probeSiteHealth_createServerFn_handler",
		importer: () => import("./site-health-D7qXz5tK.mjs")
	},
	"c07cac131e869252f1c8f5a7d6921698ad393b5d17f3b98af547969e3722495a": {
		functionName: "requestAdminReset_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"c09a6d649fb46548c258d51fc8c79aa919eaeab41ae6f0e8b4ec34c4e89e699f": {
		functionName: "setLiveSim_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"c10fb0a85e2cd1077f8f287b7d041a6d84db2e3e7e9084332a5a19de89eba858": {
		functionName: "removeYubi_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"c1ffd201e31acae1978bd563ee10bd68425f83d4908a6344d37b9352c784f10a": {
		functionName: "fetchChampionshipSim_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"c8c38dc27a85273c33a153b8bdd9ceb8050fbee3fd4aa99a6af0967f62bea416": {
		functionName: "approveOutgoing_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"cb77de7687fb7901cd976bb9f5db41657c61a486dce837e7a876bd337b90b3a6": {
		functionName: "setChampionshipSim_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"cc566ed26039b1983e76b5e9e83cce49a5174091823080d91b7d1a5cb3658e1f": {
		functionName: "setAgentGate_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"d63a77fa38a871d27ee178917d0340aa4e40fa6ad57210b741bf4c91bf0550d4": {
		functionName: "peekCopyAdmin_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"dca4d87376279eca9587a4116dd129419dd87dba6ff83aa63103145403d231c1": {
		functionName: "signInDesk_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"dd61df05b0fd80821645d9c56ef2635c65736e3ecf4d8ada1df06f02aa66eea9": {
		functionName: "webauthnBeginLogin_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"dd627f16b08fd625ddcdb5e70b03e75ced60f170f83a09f88a23a79a71f378f5": {
		functionName: "saveBtcMiners_createServerFn_handler",
		importer: () => import("./miner-rpc-B2WoNHrC.mjs")
	},
	"e8c64d6bb68ba4681691bea632985bc7af5dce8570257d70688d43934a6347ed": {
		functionName: "fetchSecurityPosture_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"e91da4e66df44aa9ebdf315575068b5fff2eede3ec0cfb2fcef1671147a4c0c7": {
		functionName: "postPracticePulse_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"ec4a1a26b62741ff71065c73371b20f95621e484f8951dd4ab7e95e2add1f9c5": {
		functionName: "setLockStatus_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"ee22c7fb43caf7a85cab1e93c385f89578a27439ee4627d25f82af6f48a4983b": {
		functionName: "fetchDonate_createServerFn_handler",
		importer: () => import("./donate-BKFGqei7.mjs")
	},
	"f372babf0f6ae485bb7482c85c670110ca8e92222ea4bf7de3f257bfa9b3c45d": {
		functionName: "fetchAgentGate_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"f50e05dc58b5b0575866cc2c7311bb5c3e0e947c4d045a2d25e02521fee667aa": {
		functionName: "fetchPracticePulse_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"f57bee00551cea168a828cfda0a1bbfa0a2802559e29d2c609fe1d31497cd3cf": {
		functionName: "fetchMorningLib_createServerFn_handler",
		importer: () => import("./desk-rpc-C6K26-MQ.mjs")
	},
	"f90b29ef79efd75cfcbf8084099a6bb59379e1a4b6f492752d0faa3050ca8c58": {
		functionName: "secondFactorStatus_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	},
	"fb063609c78071b3e3e758f104f3addd377f7e782d404c1649251722ec90a80e": {
		functionName: "trackProfitWallet_createServerFn_handler",
		importer: () => import("./access-BbAYLhWg.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
/** Content-Type for multiplexed framed responses (RawStream support) */
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
/** Largest payload accepted by one framed-protocol record. */
var MAX_FRAME_PAYLOAD_SIZE = 16777216;
/** Largest number of raw streams accepted in one framed response. */
var MAX_FRAMED_STREAMS = 1024;
/** Full Content-Type header value with version parameter */
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
var GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
var getStartOptions = () => getStartContext().startOptions;
/** Start's serialization adapters followed by `routerPlugins`. */
function getSerovalPlugins(routerPlugins) {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...routerPlugins];
}
/**
* Binary frame protocol for multiplexing JSON and raw streams over HTTP.
*
* Frame format: [type:1][streamId:4][length:4][payload:length]
* - type: 1 byte - frame type (JSON, CHUNK, END, ERROR)
* - streamId: 4 bytes big-endian uint32 - stream identifier
* - length: 4 bytes big-endian uint32 - payload length
* - payload: variable length bytes
*/
/** Cached TextEncoder for frame encoding */
var textEncoder$1 = new TextEncoder();
/** Shared empty payload for END frames - avoids allocation per call */
var EMPTY_PAYLOAD = /* @__PURE__ */ new Uint8Array(0);
var MAX_ERROR_MESSAGE_CODE_UNITS = 4096;
/**
* Encodes a single frame with header and payload.
*/
function encodeFrame(type, streamId, payload) {
	if (payload.byteLength > 16777216) throw new RangeError(`Frame payload exceeds ${MAX_FRAME_PAYLOAD_SIZE} bytes`);
	const frame = new Uint8Array(9 + payload.length);
	frame[0] = type;
	frame[1] = streamId >>> 24 & 255;
	frame[2] = streamId >>> 16 & 255;
	frame[3] = streamId >>> 8 & 255;
	frame[4] = streamId & 255;
	frame[5] = payload.length >>> 24 & 255;
	frame[6] = payload.length >>> 16 & 255;
	frame[7] = payload.length >>> 8 & 255;
	frame[8] = payload.length & 255;
	frame.set(payload, 9);
	return frame;
}
/** Encodes an error message payload, truncated to a bounded length. */
function encodeErrorPayload(error) {
	const originalMessage = error instanceof Error ? error.message : String(error ?? "Unknown error");
	const message = originalMessage.length > MAX_ERROR_MESSAGE_CODE_UNITS ? `${originalMessage.slice(0, MAX_ERROR_MESSAGE_CODE_UNITS)}…` : originalMessage;
	return textEncoder$1.encode(message);
}
/**
* Creates a multiplexed ReadableStream from serialized response records.
*
* A record's JSON frame is admitted before any raw stream referenced by that
* record starts. Raw streams from admitted records are pumped concurrently.
* The caller bounds the stream count before records reach this function.
*/
function createMultiplexedStream(recordStream, options = {}) {
	let controller;
	let stopped = false;
	let activePumps = 0;
	let wakeDemand;
	let admission;
	const readers = /* @__PURE__ */ new Set();
	const pendingRawStreams = /* @__PURE__ */ new Set();
	const abortOutput = () => errorOutput(options.signal?.reason);
	const wakeAdmission = () => {
		const wake = wakeDemand;
		wakeDemand = void 0;
		wake?.();
	};
	const cancelReader = (reader, reason) => {
		reader.cancel(reason).catch(() => {});
	};
	const cancelStream = (stream, reason) => {
		stream.cancel(reason).catch(() => {});
	};
	const stop = (reason) => {
		if (stopped) return false;
		stopped = [reason];
		options.signal?.removeEventListener("abort", abortOutput);
		wakeAdmission();
		for (const reader of readers) cancelReader(reader, reason);
		for (const stream of pendingRawStreams) cancelStream(stream, reason);
		pendingRawStreams.clear();
		return true;
	};
	const errorOutput = (error) => {
		if (!stop(error)) return;
		try {
			controller.error(error);
		} catch {}
	};
	const waitForDemand = async () => {
		while (!stopped && (controller.desiredSize ?? 0) <= 0) await new Promise((resolve) => {
			wakeDemand = resolve;
		});
		return !stopped;
	};
	const admitFrame = (type, streamId, payload) => {
		if (stopped) return false;
		if (!admission && (controller.desiredSize ?? 0) > 0) {
			controller.enqueue(encodeFrame(type, streamId, payload));
			return true;
		}
		const runAdmission = async () => {
			if (!await waitForDemand()) return false;
			controller.enqueue(encodeFrame(type, streamId, payload));
			return true;
		};
		const result = admission ? admission.then(runAdmission) : runAdmission();
		const clearAdmission = () => {
			if (admission === tail) admission = void 0;
		};
		const tail = result.then(clearAdmission, clearAdmission);
		admission = tail;
		return result;
	};
	const maybeClose = () => {
		if (activePumps !== 0 || !stop()) return;
		try {
			controller.close();
		} catch {}
	};
	const startPump = (pump) => {
		activePumps++;
		pump().then(() => {
			activePumps--;
			maybeClose();
		}, (error) => {
			activePumps--;
			errorOutput(error);
		});
	};
	async function pumpRawStream(streamId, stream) {
		const reader = stream.getReader();
		readers.add(reader);
		try {
			while (!stopped) {
				const { done, value } = await reader.read();
				if (stopped) return;
				if (done) {
					const frameAdmission = admitFrame(2, streamId, EMPTY_PAYLOAD);
					if (frameAdmission !== true) await frameAdmission;
					return;
				}
				if (!(value instanceof Uint8Array)) throw new TypeError("RawStream chunks must be Uint8Array");
				let offset = 0;
				do {
					const chunk = value.byteLength <= 16777216 ? value : value.subarray(offset, offset + MAX_FRAME_PAYLOAD_SIZE);
					const frameAdmission = admitFrame(1, streamId, chunk);
					if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
					offset += MAX_FRAME_PAYLOAD_SIZE;
				} while (offset < value.byteLength);
			}
		} catch (error) {
			if (!stopped) {
				const frameAdmission = admitFrame(3, streamId, encodeErrorPayload(error));
				if (frameAdmission !== true) await frameAdmission;
			}
		} finally {
			readers.delete(reader);
			reader.releaseLock();
		}
	}
	async function pumpRecords() {
		const reader = recordStream.getReader();
		readers.add(reader);
		try {
			while (!stopped) {
				const { done, value } = await reader.read();
				if (stopped) {
					if (!done) for (const registration of value.rawStreams) cancelStream(registration.stream, stopped[0]);
					return;
				}
				if (done) return;
				for (const registration of value.rawStreams) pendingRawStreams.add(registration.stream);
				const frameAdmission = admitFrame(0, 0, value.json);
				if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
				for (const registration of value.rawStreams) {
					pendingRawStreams.delete(registration.stream);
					startPump(pumpRawStream.bind(void 0, registration.id, registration.stream));
				}
			}
		} catch (error) {
			if (!stopped) errorOutput(error);
		} finally {
			readers.delete(reader);
			reader.releaseLock();
		}
	}
	return new ReadableStream({
		start(ctrl) {
			controller = ctrl;
			if (options.signal?.aborted) {
				cancelStream(recordStream, options.signal.reason);
				errorOutput(options.signal.reason);
				return;
			}
			options.signal?.addEventListener("abort", abortOutput, { once: true });
			startPump(pumpRecords);
		},
		pull() {
			wakeAdmission();
		},
		cancel(reason) {
			if (stop(reason)) options.onCancel?.(reason);
		}
	});
}
function isSafeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Merge target and source into a new null-proto object, filtering dangerous keys.
*/
function safeObjectMerge(target, source) {
	const result = Object.create(null);
	if (target) {
		const keys = Object.keys(target);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (isSafeKey(key)) result[key] = target[key];
		}
	}
	if (source && typeof source === "object") {
		const keys = Object.keys(source);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (isSafeKey(key)) result[key] = source[key];
		}
	}
	return result;
}
/**
* Create a null-prototype object, optionally copying from source.
*/
function createNullProtoObject(source) {
	return source ? safeObjectMerge(source, void 0) : Object.create(null);
}
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
	const resolvedOptions = __opts || options || {};
	if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
	const res = {
		options: resolvedOptions,
		middleware: (middleware) => {
			const newMiddleware = [...resolvedOptions.middleware || []];
			middleware.forEach((item) => {
				if (TSS_SERVER_FUNCTION_FACTORY in item) {
					if (item.options.middleware) newMiddleware.push(...item.options.middleware);
				} else newMiddleware.push(item);
			});
			const res = createServerFn(void 0, {
				...resolvedOptions,
				middleware: newMiddleware
			});
			res[TSS_SERVER_FUNCTION_FACTORY] = true;
			return res;
		},
		validator: (validator) => {
			return createServerFn(void 0, {
				...resolvedOptions,
				validator
			});
		},
		handler: (...args) => {
			const [extractedFn, serverFn] = args;
			const newOptions = {
				...resolvedOptions,
				extractedFn,
				serverFn
			};
			const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
			extractedFn.method = resolvedOptions.method;
			return Object.assign(async (opts) => {
				const result = await executeMiddleware$1(resolvedMiddleware, "client", {
					...extractedFn,
					...newOptions,
					data: opts?.data,
					headers: opts?.headers,
					signal: opts?.signal,
					fetch: opts?.fetch,
					context: createNullProtoObject()
				});
				if ("error" in result) throw parseRedirect(result.error) ?? result.error;
				return result.result;
			}, {
				...extractedFn,
				method: resolvedOptions.method,
				__executeServer: async (opts) => {
					const startContext = getStartContextServerOnly();
					const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
					const ctx = {
						...extractedFn,
						data: opts.data,
						method: opts.method ?? resolvedOptions.method,
						serverFnMeta: extractedFn.serverFnMeta,
						context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
						request: startContext.request
					};
					const result = await executeMiddleware$1(resolvedMiddleware, "server", ctx);
					if ("error" in result) return { error: result.error };
					return result.sendContext === void 0 ? { result: result.result } : {
						result: result.result,
						context: result.sendContext
					};
				}
			});
		}
	};
	const fun = (options) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			...options
		});
	};
	return Object.assign(fun, res);
};
function mergeOptionalSendContext(target, source) {
	return target === void 0 && source === void 0 ? void 0 : safeObjectMerge(target, source);
}
function mergeOptionalHeaders(target, source) {
	return target || source ? mergeHeaders(target, source) : void 0;
}
async function executeMiddleware$1(middlewares, env, opts) {
	const flattenedMiddlewares = flattenMiddlewares((getStartOptions()?.functionMiddleware || []).concat(middlewares), void 0, env === "server" ? new Set(getStartContextServerOnly({ throwIfNotFound: false })?.executedRequestMiddlewares) : void 0);
	let index = 0;
	const callNextMiddleware = async (callerCtx, userCtx) => {
		let ctx = callerCtx;
		if (userCtx !== void 0) {
			ctx = {
				...callerCtx,
				...userCtx
			};
			ctx.context = safeObjectMerge(callerCtx.context, userCtx.context);
			ctx.sendContext = mergeOptionalSendContext(callerCtx.sendContext, userCtx.sendContext);
			ctx.headers = mergeOptionalHeaders(callerCtx.headers, userCtx.headers);
			ctx._callSiteFetch = callerCtx._callSiteFetch;
			ctx.fetch = callerCtx._callSiteFetch ?? userCtx.fetch ?? callerCtx.fetch;
			ctx.result = userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : callerCtx.result;
		}
		let result = ctx;
		while (index < flattenedMiddlewares.length) {
			const options = flattenedMiddlewares[index++].options;
			const validator = options.validator;
			if (validator && env === "server") ctx.data = await execValidator(validator, ctx.data);
			const middlewareFn = env === "client" ? options.client : options.server;
			if (middlewareFn) {
				result = await middlewareFn({
					...ctx,
					next: (nextCtx = {}) => callNextMiddleware(ctx, nextCtx)
				});
				if (result instanceof Response) {
					if (isRedirect(result)) throw result;
					result = {
						...ctx,
						result
					};
				} else if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
				break;
			}
		}
		if ("error" in result) throw result.error;
		return result;
	};
	const initialCtx = {
		...opts,
		headers: opts.headers || (env === "client" ? {} : void 0),
		sendContext: opts.sendContext,
		context: opts.context || createNullProtoObject(),
		_callSiteFetch: opts.fetch
	};
	if (initialCtx.sendContext !== void 0) initialCtx.sendContext ||= {};
	try {
		return await callNextMiddleware(initialCtx);
	} catch (error) {
		return {
			...initialCtx,
			error
		};
	}
}
function flattenMiddlewares(middlewares, maxDepth = 100, seen = /* @__PURE__ */ new Set()) {
	const flattened = [];
	const recurse = (middleware, depth) => {
		if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware, depth + 1);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares, 0);
	return flattened;
}
async function execValidator(validator, input) {
	if (validator == null) return {};
	if ("~standard" in validator) {
		const result = await validator["~standard"].validate(input);
		if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
		return result.value;
	}
	if ("parse" in validator) return validator.parse(input);
	if (typeof validator === "function") return validator(input);
	throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
	return {
		"~types": void 0,
		options: {
			validator: options.validator,
			client: async ({ next, sendContext, fetch, ...ctx }) => {
				const payload = {
					...ctx,
					context: sendContext,
					fetch
				};
				return next(await options.extractedFn?.(payload));
			},
			server: async ({ next: _next, ...ctx }) => {
				const result = await options.serverFn?.(ctx);
				return {
					...ctx,
					result
				};
			}
		}
	};
}
var createMiddleware = (options, __opts) => {
	const resolvedOptions = {
		type: "request",
		...__opts || options
	};
	return {
		options: resolvedOptions,
		middleware: (middleware) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
		},
		validator: (validator) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { validator }));
		},
		client: (client) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { client }));
		},
		server: (server) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { server }));
		}
	};
};
var innerCreateCsrfMiddleware = (opts = {}) => {
	const continueRequest = (result, ctx) => {
		return isValidationResultAllowed(result, opts) ? ctx.next() : getFailureResponse(opts, ctx);
	};
	const validateRequest = (ctx) => {
		const result = validateCsrfRequest(opts, ctx);
		if (isPromise(result)) return result.then((result) => continueRequest(result, ctx));
		return continueRequest(result, ctx);
	};
	return createMiddleware().server((ctx) => {
		const csrfCtx = ctx;
		try {
			if (opts.filter) {
				const shouldValidate = opts.filter(csrfCtx);
				if (isPromise(shouldValidate)) return shouldValidate.then((shouldValidate) => shouldValidate ? validateRequest(csrfCtx) : ctx.next());
				if (!shouldValidate) return ctx.next();
			}
			return validateRequest(csrfCtx);
		} catch (error) {
			return Promise.reject(error);
		}
	});
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
function isValidationResultAllowed(result, opts) {
	return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
function validateCsrfRequest(opts, ctx) {
	const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
	if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
	const origin = ctx.request.headers.get("Origin");
	if (origin !== null) {
		if (opts.origin) return matchValue(opts.origin, origin, ctx);
		return origin === new URL(ctx.request.url).origin;
	}
	const referer = ctx.request.headers.get("Referer");
	if (referer === null || opts.referer === false) return;
	if (typeof opts.referer === "function") return opts.referer(referer, ctx);
	if (opts.origin) {
		const refererOrigin = getOriginFromUrl(referer);
		return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
	}
	return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
function matchValue(matcher, value, ctx) {
	if (typeof matcher === "function") return matcher(value, ctx);
	if (Array.isArray(matcher)) return matcher.includes(value);
	return value === matcher;
}
function getOriginFromUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function isRefererSameOrigin(referer, requestOrigin) {
	if (referer === requestOrigin) return true;
	if (!referer.startsWith(requestOrigin)) return false;
	if (referer.length === requestOrigin.length) return true;
	const code = referer.charCodeAt(requestOrigin.length);
	return code === 47 || code === 63 || code === 35;
}
function getFailureResponse(opts, ctx) {
	if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
	return opts.failureResponse?.clone() ?? new Response("Forbidden", { status: 403 });
}
var SERIALIZED_JSON_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	[X_TSS_SERIALIZED, "true"],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var SERIALIZED_JSON_HEADER_INIT = new Headers({
	"content-type": "application/json",
	[X_TSS_SERIALIZED]: "true"
});
/** Completed bytes own no stream until the request pipeline accepts them. */
var DeferredResponse = class {
	constructor(body) {
		this.body = body;
	}
	createResponse(event) {
		return createFinalizedResponse(this.body, SERIALIZED_JSON_HEADER_INIT, SERIALIZED_JSON_HEADERS, event);
	}
};
var SERIALIZED_FRAMED_HEADERS = /* @__PURE__ */ new Map([
	["content-type", TSS_CONTENT_TYPE_FRAMED_VERSIONED],
	[X_TSS_SERIALIZED, "true"],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var NOT_FOUND_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	[X_TSS_SERIALIZED, null],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var RAW_RESPONSE_HEADERS = /* @__PURE__ */ new Map([[X_TSS_RAW_RESPONSE, "true"]]);
var THROWN_RESPONSE_HEADERS = /* @__PURE__ */ new Map([[X_TSS_RAW_RESPONSE, "thrown"]]);
var MAX_PAYLOAD_SIZE = 1e6;
var MAX_PENDING_SERIALIZATION_RECORDS = 1024;
var MAX_PENDING_SERIALIZATION_BYTES = 33554432;
var textEncoder = new TextEncoder();
function encodeSerializationRecord(value) {
	return textEncoder.encode(JSON.stringify(value));
}
function exceedsPendingSerializationLimit(record, recordCount, pendingBytes) {
	return recordCount >= MAX_PENDING_SERIALIZATION_RECORDS || pendingBytes + record.byteLength > MAX_PENDING_SERIALIZATION_BYTES;
}
function runSerializationCleanup(dispose) {
	try {
		dispose();
	} catch {}
}
function cancelRawStream(stream, reason) {
	stream.cancel(reason).catch(() => {});
}
/**
* Marks a Response thrown during a server-function request so the client
* rejects the call with it. Redirects keep their own protocol.
*/
function toThrownServerFnResponse(response) {
	return isRedirect(response) ? response : setProtectedResponseHeaders(response, THROWN_RESPONSE_HEADERS);
}
/**
* Builds the reply for a server-function request that failed outside the
* function, such as in request middleware. Like a failed call, it carries
* only the thrown value under an `error` key, so the client rethrows it.
*/
async function createServerFnErrorResponse(error, serovalPlugins) {
	if (isNotFound(error)) return isNotFoundResponse(error);
	const headers = getErrorHeaders(error) ?? new Headers();
	const { status, statusText } = resolveErrorResponseStatus(error);
	headers.set("Content-Type", "application/json");
	headers.set(X_TSS_SERIALIZED, "true");
	headers.delete(X_TSS_RAW_RESPONSE);
	headers.delete("location");
	const plugins = serovalPlugins ?? getSerovalPlugins(defaultSerovalDeserializerPlugins);
	let serializedError;
	try {
		serializedError = JSON.stringify(await toCrossJSONAsync({ error }, {
			refs: /* @__PURE__ */ new Map(),
			plugins
		}));
	} catch (serializationError) {
		serializedError = JSON.stringify(await toCrossJSONAsync({ error: serializationError }, {
			refs: /* @__PURE__ */ new Map(),
			plugins
		}));
	}
	const errorResponse = new Response(serializedError, {
		status,
		statusText,
		headers
	});
	protectResponseHeaders(errorResponse, SERIALIZED_JSON_HEADERS);
	return errorResponse;
}
var handleServerAction = async ({ request, serverFnId }) => {
	const methodUpper = request.method.toUpperCase();
	const action = await getServerFnById(serverFnId, { origin: "client" });
	if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
		status: 405,
		headers: { Allow: action.method }
	});
	const headers = request.headers;
	const isServerFn = headers.get("x-tsr-serverfn") === "true";
	let serovalPlugins;
	const getRequestSerovalPlugins = () => {
		return serovalPlugins ??= getSerovalPlugins(defaultSerovalDeserializerPlugins);
	};
	const contentType = headers.get("content-type");
	try {
		let res;
		if (contentType && (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded"))) {
			if (methodUpper === "GET") invariant();
			const formData = await request.formData();
			const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
			formData.delete(TSS_FORMDATA_CONTEXT);
			const params = {
				data: formData,
				method: methodUpper
			};
			if (typeof serializedContext === "string") try {
				const parsedContext = JSON.parse(serializedContext);
				const deserializedContext = fromJSON(parsedContext, { plugins: getRequestSerovalPlugins() });
				if (typeof deserializedContext === "object" && deserializedContext) params.context = deserializedContext;
			} catch (e) {}
			res = await action(params);
		} else {
			let json;
			if (methodUpper === "GET") {
				const payloadParam = getParsedRequestUrl(request).searchParams.get("payload");
				if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
				json = payloadParam ? JSON.parse(payloadParam) : void 0;
			} else if (contentType?.includes("application/json")) json = await request.json();
			const payload = json === void 0 ? void 0 : fromJSON(json, { plugins: getRequestSerovalPlugins() });
			res = await action({
				data: payload?.data,
				context: payload?.context,
				method: methodUpper
			});
		}
		const failed = "error" in res;
		const unwrapped = failed ? res.error : res.result;
		if (!isServerFn && (unwrapped instanceof Response || unwrapped === null || typeof unwrapped !== "object")) return unwrapped;
		if (unwrapped instanceof Response) {
			if (failed) return toThrownServerFnResponse(unwrapped);
			if (isRedirect(unwrapped)) return unwrapped;
			return setProtectedResponseHeaders(unwrapped, RAW_RESPONSE_HEADERS);
		}
		return serializeResult(res, request, getRequestSerovalPlugins());
	} catch (error) {
		if (error instanceof Response) return error;
		return createServerFnErrorResponse(error, serovalPlugins);
	}
};
/**
* Serializes a server-function result. A result that Seroval completes
* synchronously without RawStreams becomes plain JSON; everything else is a
* framed response whose records and raw streams are multiplexed in order.
*/
function serializeResult(res, request, plugins) {
	const initialRecords = [];
	let initialBytes = 0;
	const pendingRawStreams = [];
	let done = false;
	let initialParsed = false;
	let serializationFailure;
	let disposeSerialization;
	let onParse = (value, initial) => {
		if (serializationFailure) return;
		initialParsed ||= initial;
		const record = encodeSerializationRecord(value);
		if (exceedsPendingSerializationLimit(record, initialRecords.length, initialBytes)) {
			serializationFailure = [/* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit")];
			return;
		}
		initialRecords.push(record);
		initialBytes += record.byteLength;
	};
	let onDone = () => {
		if (initialParsed) done = true;
	};
	let onError = (error) => {
		serializationFailure ??= [error];
	};
	const rawStreamPlugin = createRawStreamRPCPlugin((id, stream) => {
		if (serializationFailure) {
			cancelRawStream(stream, serializationFailure[0]);
			return;
		}
		if (id > 1024) {
			const error = /* @__PURE__ */ new Error(`Too many raw streams in framed response (max ${MAX_FRAMED_STREAMS})`);
			cancelRawStream(stream, error);
			onError(error);
			return;
		}
		pendingRawStreams.push({
			id,
			stream
		});
	});
	const dispose = toCrossJSONStream(res, {
		refs: /* @__PURE__ */ new Map(),
		plugins: [rawStreamPlugin, ...plugins],
		onParse(value, initial) {
			onParse(value, initial);
		},
		onDone() {
			onDone();
		},
		onError: (error) => {
			onError(error);
		}
	});
	if (serializationFailure) {
		runSerializationCleanup(dispose);
		for (const registration of pendingRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
		throw serializationFailure[0];
	}
	if (!done) disposeSerialization = dispose;
	if (done && pendingRawStreams.length === 0 && initialRecords.length === 1) return new DeferredResponse(initialRecords[0]);
	if (done && initialRecords.length === 1) {
		const json = initialRecords[0];
		if (json.byteLength > 16777216) {
			const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
			for (const registration of pendingRawStreams) cancelRawStream(registration.stream, error);
			throw error;
		}
		const rawStreams = pendingRawStreams.splice(0);
		initialRecords.length = 0;
		return createFramedResponse(new ReadableStream({
			start(controller) {
				controller.enqueue({
					json,
					rawStreams
				});
				controller.close();
			},
			cancel(reason) {
				for (const registration of rawStreams) cancelRawStream(registration.stream, reason);
			}
		}), { signal: request.signal });
	}
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const recordAbortController = new AbortController();
	let pendingBytes = 0;
	const pendingRecords = /* @__PURE__ */ new Set();
	const abortRecordStream = (error) => {
		if (serializationFailure) return;
		serializationFailure = [error];
		const disposeCurrentSerialization = disposeSerialization;
		disposeSerialization = void 0;
		for (const registration of pendingRawStreams.splice(0)) cancelRawStream(registration.stream, error);
		for (const record of pendingRecords) for (const registration of record.rawStreams) cancelRawStream(registration.stream, error);
		pendingRecords.clear();
		recordAbortController.abort(error);
		writer.abort(error).catch(() => {});
		if (disposeCurrentSerialization) runSerializationCleanup(disposeCurrentSerialization);
	};
	const writeRecord = (json, rawStreams) => {
		if (serializationFailure) {
			for (const registration of rawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
			return false;
		}
		if (json.byteLength > 16777216 || exceedsPendingSerializationLimit(json, pendingRecords.size, pendingBytes)) {
			const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
			for (const registration of rawStreams) cancelRawStream(registration.stream, error);
			onError(error);
			return false;
		}
		pendingBytes += json.byteLength;
		const record = {
			json,
			rawStreams
		};
		pendingRecords.add(record);
		writer.write(record).then(() => {
			pendingRecords.delete(record);
			pendingBytes -= json.byteLength;
		}, (error) => {
			const stillOwned = pendingRecords.delete(record);
			pendingBytes -= json.byteLength;
			if (stillOwned) for (const registration of rawStreams) cancelRawStream(registration.stream, error);
		});
		return true;
	};
	onParse = (value) => {
		if (serializationFailure) return;
		writeRecord(encodeSerializationRecord(value), pendingRawStreams.splice(0));
	};
	onDone = () => {
		if (serializationFailure) return;
		disposeSerialization = void 0;
		writer.close().catch(() => {});
	};
	onError = (error) => {
		abortRecordStream(error);
	};
	const initialRawStreams = pendingRawStreams.splice(0);
	for (let index = 0; index < initialRecords.length; index++) {
		const isLast = index === initialRecords.length - 1;
		if (!writeRecord(initialRecords[index], isLast ? initialRawStreams : [])) {
			if (!isLast) for (const registration of initialRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
			initialRecords.length = 0;
			throw serializationFailure[0];
		}
	}
	initialRecords.length = 0;
	if (done) onDone();
	writer.closed.catch((error) => {
		abortRecordStream(error);
	});
	return createFramedResponse(readable, {
		signal: AbortSignal.any([recordAbortController.signal, request.signal]),
		onCancel: abortRecordStream
	});
}
function createFramedResponse(records, options) {
	const multiplexedStream = createMultiplexedStream(records, options);
	const { status, statusText } = getSerializedResponseState();
	try {
		const response = new Response(multiplexedStream, {
			status,
			statusText,
			headers: {
				"Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
				[X_TSS_SERIALIZED]: "true"
			}
		});
		protectResponseHeaders(response, SERIALIZED_FRAMED_HEADERS);
		return response;
	} catch (error) {
		cancelRawStream(multiplexedStream, error);
		throw error;
	}
}
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	let responseHeaders;
	if (headers) {
		const copiedHeaders = new Headers(headers);
		copiedHeaders.set("Content-Type", "application/json");
		copiedHeaders.delete(X_TSS_SERIALIZED);
		copiedHeaders.delete(X_TSS_RAW_RESPONSE);
		copiedHeaders.delete("location");
		responseHeaders = copiedHeaders;
	} else responseHeaders = { "Content-Type": "application/json" };
	const response = new Response(JSON.stringify(rest), {
		status: 404,
		headers: responseHeaders
	});
	protectResponseHeaders(response, NOT_FOUND_HEADERS);
	return response;
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
	"fetch",
	"font",
	"image",
	"script",
	"style",
	"track"
]);
function buildLinkParam(name, value) {
	if (value === void 0) return name;
	if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
	return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
	const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
	if (hint.as) parts.push(buildLinkParam("as", hint.as));
	if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
	if (hint.type) parts.push(buildLinkParam("type", hint.type));
	if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
	if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
	if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
	return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
	const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
	return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
	const as = getStringAttr(attrs, "as");
	return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
	const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
	const type = getStringAttr(attrs, "type");
	const integrity = getStringAttr(attrs, "integrity");
	const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
	const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
	if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
	if (type) hint.type = type;
	if (integrity) hint.integrity = integrity;
	if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
	if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
	const href = getStringAttr(attrs, "href");
	const rel = getStringAttr(attrs, "rel");
	if (!href || !rel) return void 0;
	const relTokens = rel.split(/\s+/);
	let hintRel;
	let hintAs;
	if (relTokens.includes("modulepreload")) {
		hintRel = "modulepreload";
		hintAs = "script";
	} else if (relTokens.includes("stylesheet")) {
		hintRel = "preload";
		hintAs = "style";
	} else if (relTokens.includes("preload")) {
		hintAs = getPreloadAs(attrs);
		if (!hintAs) return void 0;
		hintRel = "preload";
	} else if (relTokens.includes("preconnect")) {
		hintRel = "preconnect";
		hintAs = void 0;
	} else if (relTokens.includes("dns-prefetch")) {
		hintRel = "dns-prefetch";
		hintAs = void 0;
	}
	if (!hintRel) return void 0;
	const hint = {
		href,
		rel: hintRel
	};
	if (hintAs) hint.as = hintAs;
	addEarlyHintFetchAttrs(hint, attrs);
	return hint;
}
function collectStaticHintsFromManifest(manifest, matchedRoutes) {
	const hints = [];
	for (const route of matchedRoutes) {
		const routeManifest = manifest.routes[route.id];
		if (!routeManifest) continue;
		for (const link of routeManifest.preloads ?? []) {
			const attrs = getScriptPreloadAttrs(manifest, link);
			const hint = {
				href: attrs.href,
				rel: attrs.rel,
				as: "script"
			};
			addEarlyHintFetchAttrs(hint, attrs);
			hints.push(hint);
		}
		for (const link of routeManifest.css ?? []) {
			const stylesheetHref = getStylesheetHref(link);
			if (manifest.inlineCss?.styles[stylesheetHref] !== void 0) continue;
			const resolvedLink = resolveManifestCssLink(link);
			const hint = {
				href: stylesheetHref,
				rel: "preload",
				as: "style"
			};
			if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
			hints.push(hint);
		}
	}
	return hints;
}
function collectDynamicHintsFromMatches(matches) {
	const hints = [];
	for (const match of matches) {
		const links = match.links;
		if (!Array.isArray(links)) continue;
		for (const link of links) {
			const hint = linkAttrsToEarlyHint(link);
			if (hint) hints.push(hint);
		}
	}
	return hints;
}
function createEarlyHintsEvent(opts) {
	const nextHints = [];
	const nextLinks = [];
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.sentHints.push(hint);
		nextHints.push(hint);
		nextLinks.push(link);
	}
	if (!nextHints.length && opts.phase !== "dynamic") return void 0;
	return {
		phase: opts.phase,
		hints: nextHints,
		links: nextLinks,
		allHints: opts.sentHints.slice(),
		allLinks: Array.from(opts.sentLinks)
	};
}
function createResponseLinkHeaderEntries(opts) {
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.entries.push({
			phase: opts.phase,
			hint,
			link
		});
	}
}
function getResponseLinkHeaderEntries(opts) {
	if (!opts.filter) return opts.entries.map((entry) => entry.link);
	try {
		const links = [];
		for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
		return links;
	} catch (err) {
		console.error("Error filtering response Link headers:", err);
		return [];
	}
}
function notifyEarlyHints(phase, event, onEarlyHints) {
	try {
		const result = onEarlyHints(event);
		if (result) Promise.resolve(result).catch((err) => {
			console.error(`Error sending ${phase} early hints:`, err);
		});
	} catch (err) {
		console.error(`Error sending ${phase} early hints:`, err);
	}
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
	if (typeof responseLinkHeader !== "object") return;
	return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
	for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
	for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
		phase: opts.phase,
		hint: opts.event.hints[index],
		link: opts.event.links[index]
	});
}
function collectEarlyHintsPhase(opts) {
	const event = opts.onEarlyHints ? createEarlyHintsEvent({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		sentHints: opts.sentHints
	}) : void 0;
	if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
	if (!opts.responseLinkHeaderEntries) return;
	if (event) {
		collectResponseLinkHeaderEntries({
			phase: opts.phase,
			event,
			entries: opts.responseLinkHeaderEntries
		});
		return;
	}
	createResponseLinkHeaderEntries({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		entries: opts.responseLinkHeaderEntries
	});
}
function createEarlyHintsCollector(opts) {
	if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
	const sentLinks = /* @__PURE__ */ new Set();
	const sentHints = opts.onEarlyHints ? new Array() : void 0;
	const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
	const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
	return {
		collectStatic: ({ manifest, matchedRoutes }) => {
			if (!matchedRoutes?.length) return;
			collectEarlyHintsPhase({
				phase: "static",
				hints: collectStaticHintsFromManifest(manifest, matchedRoutes),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		collectDynamic: (matches) => {
			collectEarlyHintsPhase({
				phase: "dynamic",
				hints: collectDynamicHintsFromMatches(matches),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		appendResponseHeaders: (headers) => {
			if (!responseLinkHeaderEntries?.length) return;
			appendResponseLinkHeaders({
				responseHeaders: headers,
				entries: responseLinkHeaderEntries,
				filter: responseLinkHeaderFilter
			});
		}
	};
}
function normalizeTransformAssetResult(result) {
	if (typeof result === "string") return { href: result };
	return result;
}
function escapeCssString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
	const { strings, urls } = options.template;
	if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
	let css = strings[0];
	for (let index = 0; index < urls.length; index++) {
		const transformed = normalizeTransformAssetResult(await options.transformFn({
			kind: "css-url",
			url: urls[index],
			stylesheetHref: options.stylesheetHref
		}));
		css += escapeCssString(transformed.href) + strings[index + 1];
	}
	return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
	const transformedStyles = {};
	const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
		const template = inlineCss.templates?.[stylesheetHref];
		return [stylesheetHref, template ? await transformInlineCssTemplate({
			stylesheetHref,
			template,
			transformFn
		}) : css];
	}));
	for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
	return {
		styles: transformedStyles,
		...inlineCss.templates ? { templates: inlineCss.templates } : {}
	};
}
function resolveTransformAssetsCrossOrigin(config, kind) {
	if (!config) return void 0;
	if (typeof config === "string") return config;
	return config[kind];
}
function isObjectShorthand(transform) {
	return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
	if (typeof transform === "string") {
		const prefix = transform;
		return {
			type: "transform",
			transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
			cache: true
		};
	}
	if (typeof transform === "function") return {
		type: "transform",
		transformFn: transform,
		cache: true
	};
	if (isObjectShorthand(transform)) {
		const { prefix, crossOrigin } = transform;
		return {
			type: "transform",
			transformFn: ({ url, kind }) => {
				const href = `${prefix}${url}`;
				if (kind === "css-url") return { href };
				const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
				return co ? {
					href,
					crossOrigin: co
				} : { href };
			},
			cache: true
		};
	}
	if ("createTransform" in transform && transform.createTransform) return {
		type: "createTransform",
		createTransform: transform.createTransform,
		cache: transform.cache !== false
	};
	return {
		type: "transform",
		transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
		cache: transform.cache !== false
	};
}
function assignManifestLink(link, next) {
	if (typeof link === "string") return next.crossOrigin ? next : next.href;
	const nextLink = {
		...link,
		href: next.href
	};
	if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
	else delete nextLink.crossOrigin;
	return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
	const manifest = structuredClone(source);
	const inlineCssEnabled = _opts?.inlineCss !== false;
	const scriptTransforms = /* @__PURE__ */ new Map();
	const transformScript = (url) => {
		const cached = scriptTransforms.get(url);
		if (cached) return cached;
		const transformed = Promise.resolve(transformFn({
			url,
			kind: "script"
		})).then(normalizeTransformAssetResult);
		scriptTransforms.set(url, transformed);
		return transformed;
	};
	if (!inlineCssEnabled) delete manifest.inlineCss;
	else if (manifest.inlineCss) manifest.inlineCss = await transformInlineCssStyles(manifest.inlineCss, transformFn);
	for (const route of Object.values(manifest.routes)) {
		if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
			const resolved = resolveManifestAssetLink(link);
			const result = await transformScript(resolved.href);
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.css?.length && !manifest.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
			const result = normalizeTransformAssetResult(await transformFn({
				url: resolveManifestCssLink(link).href,
				kind: "stylesheet"
			}));
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.scripts?.length) for (const script of route.scripts) {
			const src = script.attrs?.src;
			if (typeof src !== "string") continue;
			const result = await transformScript(src);
			script.attrs = {
				...script.attrs,
				src: result.href
			};
			if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
			else delete script.attrs.crossOrigin;
		}
	}
	return manifest;
}
/**
* Builds a final ServerManifest without URL transforms. Used when no
* transformAssets option is provided.
*
* Returns a new manifest object so the cached base manifest is never mutated.
*/
function buildManifest(source, opts) {
	return {
		...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
		...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
		routes: { ...source.routes }
	};
}
/**
* The inline-CSS choice that needs no handler callback: a request override
* wins, then a static handler option, then the default. Undefined when a
* handler callback has to decide.
*/
function getStaticInlineCss(requestInlineCss, handlerInlineCss) {
	if (requestInlineCss !== void 0) return requestInlineCss;
	if (typeof handlerInlineCss === "function") return;
	return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
	const inlineCss = getStaticInlineCss(opts.requestInlineCss, opts.handlerInlineCss);
	if (inlineCss !== void 0) return inlineCss;
	return await opts.handlerInlineCss({ request: opts.request });
}
function createCachedBaseManifestLoader(loadBaseManifest) {
	let baseManifestPromise;
	return () => {
		if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
			baseManifestPromise = void 0;
			throw error;
		});
		return baseManifestPromise;
	};
}
function createFinalManifestTransformResolver(transformAssets, opts) {
	const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
	const cache = transformConfig ? transformConfig.cache : true;
	const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
	let cachedCreateTransformPromise;
	const clearCachedCreateTransform = () => {
		cachedCreateTransformPromise = void 0;
	};
	return {
		cache,
		warmup,
		clearCachedCreateTransform,
		getTransformFn: async (ctx) => {
			if (!transformConfig) return void 0;
			if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
			if (!cache || !opts.cacheCreateTransform) return transformConfig.createTransform(ctx);
			if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
				clearCachedCreateTransform();
				throw error;
			});
			return cachedCreateTransformPromise;
		}
	};
}
function createFinalManifestResolver(opts) {
	const finalManifestCache = /* @__PURE__ */ new Map();
	const transformResolver = createFinalManifestTransformResolver(opts.transformAssets, { cacheCreateTransform: opts.cacheCreateTransform });
	const handlerDefaultInlineCss = getStaticInlineCss(void 0, opts.inlineCss);
	const getRequestManifestOptions = async (requestOpts) => {
		const transformFn = await transformResolver.getTransformFn({
			warmup: false,
			request: requestOpts.request
		});
		const inlineCss = await resolveInlineCssForRequest({
			request: requestOpts.request,
			handlerInlineCss: opts.inlineCss,
			requestInlineCss: requestOpts.requestInlineCss
		});
		return {
			getBaseManifest: requestOpts.getBaseManifest,
			transformFn,
			cache: transformResolver.cache,
			inlineCss
		};
	};
	const resolveRequest = async (requestOpts, cache) => {
		return resolveFinalManifest({
			...await getRequestManifestOptions(requestOpts),
			finalManifestCache: cache
		});
	};
	return {
		warmup: ({ getBaseManifest }) => warmupFinalManifest({
			enabled: transformResolver.warmup,
			handlerDefaultInlineCss,
			cache: transformResolver.cache,
			finalManifestCache,
			getBaseManifest,
			getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
			onError: transformResolver.clearCachedCreateTransform
		}),
		resolveCached: (requestOpts) => {
			const inlineCss = getStaticInlineCss(requestOpts.requestInlineCss, opts.inlineCss);
			if (transformResolver.cache && inlineCss !== void 0) {
				const cached = finalManifestCache.get(getFinalManifestCacheKey(inlineCss));
				if (cached) return cached;
			}
			return resolveRequest(requestOpts, finalManifestCache);
		},
		resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
	};
}
function getFinalManifestCacheKey(inlineCss) {
	return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(finalManifestCache, cacheKey, promise) {
	const cachedPromise = promise.then((manifest) => {
		if (finalManifestCache.get(cacheKey) === cachedPromise) finalManifestCache.set(cacheKey, manifest);
		return manifest;
	}, (error) => {
		if (finalManifestCache.get(cacheKey) === cachedPromise) finalManifestCache.delete(cacheKey);
		throw error;
	});
	finalManifestCache.set(cacheKey, cachedPromise);
	return cachedPromise;
}
function getOrCreateCachedFinalManifest(finalManifestCache, cacheKey, computeFinalManifest) {
	const cached = finalManifestCache.get(cacheKey);
	if (cached) return cached;
	return cacheFinalManifestPromise(finalManifestCache, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
	return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
	const computeFinalManifest = async () => {
		return buildFinalManifest({
			base: await opts.getBaseManifest(),
			transformFn: opts.transformFn,
			inlineCss: opts.inlineCss
		});
	};
	if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifest(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
	return computeFinalManifest();
}
function warmupFinalManifest(opts) {
	if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
	const inlineCss = opts.handlerDefaultInlineCss;
	const warmupPromise = cacheFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), Promise.resolve().then(async () => {
		const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
		return buildFinalManifest({
			base,
			transformFn,
			inlineCss
		});
	}));
	if (opts.onError) warmupPromise.catch(opts.onError);
	return warmupPromise;
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			const serverFn = await getServerFnById(functionId, { origin: "client" });
			const result = await serverFn({
				data: opts?.data,
				context: opts?.context,
				method: serverFn.method ?? "GET"
			}, signal);
			if ("error" in result) throw result.error;
			return result.result;
		};
		return fn;
	}
});
function getStartResponseHeaders(router) {
	const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
	const matches = _getRenderedMatches(router.stores.matches.get());
	return matches.some((match) => match.headers) ? mergeHeaders(headers, ...matches.map((match) => match.headers)) : headers;
}
var cachedEntries;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
	const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
		import("./router-Cxc9sFya.mjs").then((n) => n.t),
		import("./start-5Z2QO8AU.mjs"),
		import("./empty-plugin-adapters-D9UWiqvJ.mjs")
	]);
	return {
		routerEntry,
		startEntry,
		pluginAdapters
	};
}
function getEntries() {
	if (!cachedEntries) cachedEntries = loadEntries().then((entries) => {
		cachedEntries = entries;
		return entries;
	});
	return cachedEntries;
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var IS_DEV = false;
var ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
var ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
	throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
	throw new Error(ERR_NO_DEFER);
}
function getResponseFromResult(result) {
	return isSsrResponse(result) || result instanceof Response ? result : result?.response;
}
function disposeResponseResult(result, reason) {
	const response = getResponseFromResult(result);
	if (isSsrResponse(response) || response instanceof Response) disposeSsrResponse(response, reason);
}
/**
* A new body continues the owned one when it is the same stream, or when the
* owned body is already being read, as by a pipe, a tee, or a `Response` that
* copies a body by reading it (Bun, or a wrapped global `Response`). Start
* cannot tell such a reader from one that stops early, so it disposes only an
* unread body. A stream whose reader stops early ends with the request's abort
* or the SSR stream's lifetime limit.
*/
function inheritsResponseOwnership(ownership, body) {
	const ownedBody = ownership.response.body;
	return body === ownedBody || ownedBody.locked;
}
function disposeResponseOwnership(ownership, reason) {
	const { response, sourceBody, streamResponse } = ownership;
	streamResponse?.dispose(reason);
	if (!streamResponse || response.body !== sourceBody) response.body.cancel(reason).catch(() => {});
}
function getOwnedResponse(ownership) {
	const { response, sourceBody, streamResponse } = ownership;
	if (!streamResponse) return response;
	if (streamResponse.response === response && response.body === sourceBody) return streamResponse;
	if (response.body === sourceBody) return {
		...streamResponse,
		response
	};
	return {
		...streamResponse,
		response,
		dispose(reason) {
			disposeResponseOwnership(ownership, reason);
		}
	};
}
function createLateResponseDisposer(signal) {
	return (result) => disposeResponseResult(result, signal.reason);
}
/**
* Compose middleware around a terminal response handler. With no middleware
* the terminal runs directly.
*/
async function executeMiddleware(middlewares, terminal, ctx, signal, event, terminalNext) {
	let index = -1;
	let responseOwnership;
	let returnedDepth = Infinity;
	const disposeAbandonedResult = createLateResponseDisposer(signal);
	const adoptResponse = (exposed, streamResponse) => {
		const current = responseOwnership;
		const body = exposed instanceof Response ? exposed.body : null;
		const response = exposed;
		if (streamResponse && !body && streamResponse !== current?.streamResponse) streamResponse.dispose("Response body dropped by Start reconciliation");
		if (current && current.response === exposed) current.streamResponse ??= streamResponse;
		else if (current && body && inheritsResponseOwnership(current, body)) {
			if (body === current.response.body) transferResponseProtocol(current.response, response);
			current.response = response;
			current.streamResponse ??= streamResponse;
		} else {
			if (current) {
				responseOwnership = void 0;
				disposeResponseOwnership(current, "middleware response replaced");
			}
			responseOwnership = body ? {
				response,
				sourceBody: body,
				streamResponse
			} : void 0;
		}
		ctx.response = exposed;
	};
	const disposeCurrentBody = (reason) => {
		const current = responseOwnership;
		responseOwnership = void 0;
		if (current) disposeResponseOwnership(current, reason);
	};
	const setResponse = (response, caller) => {
		const owned = response !== void 0 && response === responseOwnership?.response;
		const ssrResponse = !owned && isSsrResponse(response) ? response : void 0;
		const exposed = ssrResponse ? ssrResponse.response : response;
		if (returnedDepth <= caller) {
			if (exposed !== ctx.response) disposeResponseResult(response, "late middleware response");
			return;
		}
		if (!owned) adoptResponse(exposed, ssrResponse?.serverSsrCleanup === "stream" ? ssrResponse : void 0);
		if (exposed instanceof Response) {
			const reconciled = reconcileResponse(exposed, event, disposeCurrentBody);
			if (reconciled !== exposed) adoptRebuilt(exposed, reconciled);
		}
	};
	const adoptRebuilt = (exposed, rebuilt) => {
		const current = responseOwnership;
		if (current?.response === exposed && rebuilt.body) {
			current.response = rebuilt;
			ctx.response = rebuilt;
		} else adoptResponse(rebuilt);
	};
	let nextPromise;
	function next(nextCtx) {
		const result = runNext(index, nextCtx);
		nextPromise = result;
		return result;
	}
	async function runNext(caller, nextCtx) {
		signal.throwIfAborted();
		if (nextCtx) {
			if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
			const keys = Object.keys(nextCtx);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (key === "response") setResponse(nextCtx.response, caller);
				else if (key !== "context") ctx[key] = nextCtx[key];
			}
		}
		const depth = ++index;
		const isTerminal = depth === middlewares.length;
		const middleware = depth < middlewares.length ? middlewares[depth] : isTerminal ? terminal : void 0;
		const middlewareNext = isTerminal && terminalNext ? terminalNext : next;
		if (!middleware) return ctx;
		let result;
		try {
			const pending = middleware({
				...ctx,
				next: middlewareNext
			});
			if (nextPromise && pending === nextPromise) {
				nextPromise = void 0;
				result = await pending;
				signal.throwIfAborted();
			} else if (!isPromise(pending)) {
				result = pending;
				signal.throwIfAborted();
			} else result = await waitForReason(pending, signal, disposeAbandonedResult, disposeAbandonedResult);
		} catch (err) {
			if (depth < returnedDepth) returnedDepth = depth;
			if (returnedDepth > caller) adoptResponse(ctx.response);
			if (signal.aborted) {
				if (result !== void 0) disposeAbandonedResult(result);
				if (err !== signal.reason) disposeAbandonedResult(err);
				throw signal.reason;
			}
			if (err instanceof Response) {
				setResponse(ctx.handlerType === "serverFn" ? toThrownServerFnResponse(err) : err, caller);
				return ctx;
			}
			throw err;
		}
		if (depth < returnedDepth) returnedDepth = depth;
		if (isTerminal && terminalNext && !result) throwRouteHandlerError();
		if (isTerminal && !terminalNext && result instanceof DeferredResponse) {
			if (returnedDepth > caller) {
				adoptResponse(void 0);
				adoptResponse(result.createResponse(event));
			}
			return ctx;
		}
		if (result && result !== ctx) {
			const response = getResponseFromResult(result);
			if (response !== void 0) {
				if (ctx.response !== responseOwnership?.response && ctx.response !== response && returnedDepth > caller) adoptResponse(ctx.response);
				setResponse(response, caller);
			} else setResponse(ctx.response, caller);
			if (returnedDepth > caller && response !== result && result.context && result.context !== ctx.context) ctx.context = safeObjectMerge(ctx.context, result.context);
		} else setResponse(ctx.response, caller);
		return ctx;
	}
	try {
		await runNext(-1);
		let response = ctx.response;
		if (!response) throwRouteHandlerError();
		if (signal.aborted) throw signal.reason;
		returnedDepth = -1;
		if (middlewares.length && ctx.handlerType === "serverFn") {
			const restored = restoreResponseProtocol(response, event);
			if (restored !== response) {
				adoptRebuilt(response, restored);
				response = restored;
			}
		}
		return responseOwnership ? getOwnedResponse(responseOwnership) : response;
	} catch (err) {
		returnedDepth = -1;
		if (responseOwnership) disposeResponseOwnership(responseOwnership, signal.aborted ? signal.reason : err);
		throw err;
	}
}
/**
* Creates the TanStack Start request handler.
*
* @example Backwards-compatible usage (handler callback only):
* ```ts
* export default createStartHandler(defaultStreamHandler)
* ```
*
* @example With CDN URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: 'https://cdn.example.com',
* })
* ```
*
* @example With per-request URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: {
*     transform: ({ url }) => {
*       const cdnBase = getRequest().headers.get('x-cdn-base') || ''
*       return { href: `${cdnBase}${url}` }
*     },
*     cache: false,
*   },
* })
* ```
*/
function createStartHandler(cbOrOptions) {
	const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
	const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
	const finalManifestResolver = createFinalManifestResolver({
		...handlerOptions,
		cacheCreateTransform: true
	});
	const resolveManifestForRequest = finalManifestResolver.resolveCached;
	finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest(void 0) });
	const startRequestResolver = async (request, requestOpts, event) => {
		const signal = request.signal;
		let router;
		let routerPromise;
		let responseOwnsCleanup = false;
		let response;
		try {
			signal.throwIfAborted();
			const requestUrl = event.requestUrl;
			let url = requestUrl;
			const pathname = url.pathname;
			if (!SERVER_FN_BASE || !pathname.startsWith(SERVER_FN_BASE) || pathname.includes("%") || pathname.startsWith("//")) {
				const normalized = getNormalizedURL(requestUrl);
				url = normalized.url;
				if (normalized.handledProtocolRelativeURL) return finalizeResponse(Response.redirect(url, 308), event);
			}
			const pendingEntries = getEntries();
			const entries = isPromise(pendingEntries) ? await waitForReason(pendingEntries, signal) : pendingEntries;
			const isServerFnRequest = !!SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE);
			const startInstance = entries.startEntry.startInstance;
			let startOptions;
			if (startInstance) {
				const pendingStartOptions = startInstance.getOptions();
				startOptions = isPromise(pendingStartOptions) ? await waitForReason(pendingStartOptions, signal) : pendingStartOptions;
				signal.throwIfAborted();
			} else startOptions = {};
			const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
			const serializationAdapters = [
				...startOptions.serializationAdapters || [],
				...hasPluginAdapters ? pluginSerializationAdapters : [],
				ServerFunctionSerializationAdapter
			];
			const requestStartOptions = {
				...startOptions,
				requestMiddleware: startInstance ? startOptions.requestMiddleware : isServerFnRequest ? [defaultCsrfMiddleware] : void 0,
				serializationAdapters
			};
			const requestMiddleware = requestStartOptions.requestMiddleware;
			let executedRequestMiddlewares;
			let flattenedRequestMiddlewares = [];
			if (requestMiddleware?.length) {
				executedRequestMiddlewares = /* @__PURE__ */ new Set();
				flattenedRequestMiddlewares = flattenMiddlewares(requestMiddleware, void 0, executedRequestMiddlewares);
			}
			const getRouter = () => {
				routerPromise ??= (async () => {
					signal.throwIfAborted();
					const routerUrl = url === requestUrl ? getNormalizedURL(url).url : url;
					const pendingRouter = entries.routerEntry.getRouter();
					const requestRouter = isPromise(pendingRouter) ? await waitForReason(pendingRouter, signal) : pendingRouter;
					let isShell = IS_SHELL_ENV;
					if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
					const history = createServerHistory(routerUrl.pathname + routerUrl.search + routerUrl.hash);
					requestRouter.update({
						history,
						isShell,
						isPrerendering: IS_PRERENDERING,
						origin: requestRouter.options.origin ?? routerUrl.origin,
						defaultSsr: requestStartOptions.defaultSsr,
						serializationAdapters: requestRouter.options.serializationAdapters?.length ? [...requestStartOptions.serializationAdapters, ...requestRouter.options.serializationAdapters] : requestStartOptions.serializationAdapters,
						basepath: ROUTER_BASEPATH
					});
					router = requestRouter;
					return requestRouter;
				})();
				return routerPromise;
			};
			const handlerType = isServerFnRequest ? "serverFn" : "router";
			const startContext = {
				getRouter,
				startOptions: requestStartOptions,
				request,
				executedRequestMiddlewares,
				handlerType
			};
			let terminal;
			if (isServerFnRequest) {
				const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
				if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
				terminal = ({ context }) => runWithStartContext({
					...startContext,
					contextAfterGlobalMiddlewares: context
				}, () => handleServerAction({
					request,
					serverFnId
				}));
			} else {
				const executeRouter = async (serverContext, matchedRoutes, routerInstance) => {
					if (!/(^|,)\s*(\*\/\*|text\/html)/.test(request.headers.get("Accept") || "*/*")) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 406 }));
					const pendingManifest = resolveManifestForRequest({
						request,
						requestInlineCss: requestOpts?.inlineCss,
						getBaseManifest: () => getBaseManifest(matchedRoutes)
					});
					const manifest = isPromise(pendingManifest) ? await waitForReason(pendingManifest, signal) : pendingManifest;
					const earlyHints = createEarlyHintsForRequest(requestOpts);
					earlyHints?.collectStatic({
						manifest,
						matchedRoutes
					});
					const storedStartContext = getStartContext({ throwIfNotFound: false });
					attachRouterServerSsrUtils({
						router: routerInstance,
						manifest,
						getRequestAssets: () => storedStartContext?.requestAssets
					});
					routerInstance.options.additionalContext = { serverContext };
					await routerInstance.load({
						_signal: signal,
						_skipLocationUpdate: true
					});
					signal.throwIfAborted();
					if (routerInstance._serverResult?.type === "redirect") return normalizeSsrResponse(routerInstance._serverResult.redirect);
					earlyHints?.collectDynamic(_getRenderedMatches(routerInstance.stores.matches.get()));
					await routerInstance.serverSsr.dehydrate({
						requestAssets: storedStartContext?.requestAssets,
						signal
					});
					signal.throwIfAborted();
					const responseHeaders = getStartResponseHeaders(routerInstance);
					earlyHints?.appendResponseHeaders(responseHeaders);
					signal.throwIfAborted();
					return normalizeSsrResponse(await cb({
						request,
						router: routerInstance,
						responseHeaders
					}));
				};
				terminal = ({ context }) => runWithStartContext({
					...startContext,
					contextAfterGlobalMiddlewares: context
				}, () => handleServerRoutes({
					getRouter,
					request,
					executeRouter,
					context,
					executedRequestMiddlewares,
					signal,
					event
				}));
			}
			const middlewareCtx = {
				request,
				pathname: url.pathname,
				handlerType,
				context: createNullProtoObject(requestOpts?.context)
			};
			let middlewareResponse;
			try {
				if (!isServerFnRequest && flattenedRequestMiddlewares.length === 0) middlewareResponse = await terminal(middlewareCtx);
				else middlewareResponse = await executeMiddleware(flattenedRequestMiddlewares.map((d) => d.options.server), terminal, middlewareCtx, signal, event);
			} catch (error) {
				if (signal.aborted) throw error;
				if (error instanceof Response) middlewareResponse = reconcileResponse(error, event);
				else if (!isServerFnRequest) throw error;
				else {
					const disposeLate = createLateResponseDisposer(signal);
					middlewareResponse = await waitForReason(runWithStartContext({
						...startContext,
						contextAfterGlobalMiddlewares: middlewareCtx.context
					}, () => createServerFnErrorResponse(error)), signal, disposeLate, disposeLate);
					middlewareResponse = reconcileResponse(middlewareResponse, event);
				}
			}
			let result;
			try {
				result = normalizeSsrResponse(middlewareResponse);
				if (isRedirect(result.response)) result = await handleRedirectResponse(result, getRouter, signal, isServerFnRequest && request.headers.get("x-tsr-serverFn") === "true", event);
				if (request.method === "HEAD" && result.response.body !== null) {
					const source = result.response;
					result = stripSsrResponseBody(result, "HEAD body stripped");
					transferResponseMetadata(source, result.response);
				}
			} catch (error) {
				disposeResponseResult(middlewareResponse, signal.aborted ? signal.reason : error);
				throw error;
			}
			bindSsrResponseToRequest(router, result, signal);
			signal.throwIfAborted();
			responseOwnsCleanup = result.serverSsrCleanup === "stream";
			response = result.response;
		} finally {
			if (router?.serverSsr && !responseOwnsCleanup) {
				router.serverSsr.cleanup();
				if (response) response = finalizeResponse(response, event);
			}
		}
		return response;
	};
	return withStartRequest(startRequestResolver);
}
var relativeRedirectProtocols = /* @__PURE__ */ new Set();
var SERIALIZED_REDIRECT_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	["location", null],
	[X_TSS_RAW_RESPONSE, null],
	[X_TSS_SERIALIZED, null]
]);
async function handleRedirectResponse(ssrResponse, getRouter, signal, serializeRedirect, event) {
	signal.throwIfAborted();
	const redirect = ssrResponse.response;
	if (!isRedirect(redirect)) return ssrResponse;
	const opts = redirect.options;
	const href = redirect.headers.get("Location") || opts.href;
	if (!href && opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
	if (!href && [
		"params",
		"search",
		"hash"
	].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
	signal.throwIfAborted();
	if (href && !isDangerousProtocol(href, relativeRedirectProtocols)) {
		opts.href = href;
		redirect.headers.set("Location", href);
	} else {
		const router = await getRouter();
		signal.throwIfAborted();
		router.resolveRedirect(redirect);
	}
	if (serializeRedirect) {
		const redirectOptions = { ...opts };
		delete redirectOptions.headers;
		redirectOptions.isSerializedRedirect = true;
		const responseHeaders = new Headers(redirect.headers);
		responseHeaders.set("content-type", "application/json");
		responseHeaders.delete("location");
		responseHeaders.delete(X_TSS_RAW_RESPONSE);
		responseHeaders.delete(X_TSS_SERIALIZED);
		const body = JSON.stringify(redirectOptions);
		if (body === void 0) throw new TypeError("Value is not JSON serializable");
		disposeSsrResponse(ssrResponse, "redirect response replaced");
		return {
			response: createFinalizedResponse(body, responseHeaders, SERIALIZED_REDIRECT_HEADERS, event),
			serverSsrCleanup: "none"
		};
	}
	ssrResponse.response = finalizeResponse(redirect, event);
	return ssrResponse;
}
function withParsedParams(handler, matchedRoutes) {
	if (!matchedRoutes.some((route) => route.options.params?.parse ?? route.options.parseParams)) return handler;
	return (ctx) => {
		const params = Object.assign(Object.create(null), ctx.params);
		for (const route of matchedRoutes) {
			const parse = route.options.params?.parse ?? route.options.parseParams;
			if (parse) Object.assign(params, parse(params));
		}
		return handler({
			...ctx,
			params
		});
	};
}
async function handleServerRoutes({ getRouter, request, executeRouter, context, executedRequestMiddlewares, signal, event }) {
	const router = await getRouter();
	const { pathname } = router.latestLocation;
	const [matchedRoutes, rawParams, foundRoute] = router.getMatchedRoutes(pathname);
	const isExactMatch = foundRoute && rawParams["**"] === void 0;
	const routeMiddlewares = [];
	let terminalHandler = (ctx) => executeRouter(ctx.context, matchedRoutes, router);
	let terminalNext;
	for (const route of matchedRoutes) {
		const serverMiddleware = route.options.server?.middleware;
		if (serverMiddleware) {
			const flattened = flattenMiddlewares(serverMiddleware);
			for (const m of flattened) if (!executedRequestMiddlewares?.has(m)) routeMiddlewares.push(m.options.server);
		}
	}
	const server = foundRoute?.options.server;
	if (server?.handlers && isExactMatch) {
		const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
		const requestMethod = request.method.toUpperCase();
		const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
		if (handler) {
			const mayDefer = !!foundRoute.options.component;
			if (typeof handler !== "function") {
				if (handler.middleware?.length) {
					const handlerMiddlewares = flattenMiddlewares(handler.middleware);
					for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
				}
			}
			const routeHandler = typeof handler === "function" ? handler : handler.handler;
			if (routeHandler) {
				const parsedHandler = withParsedParams(routeHandler, matchedRoutes);
				if (!mayDefer) {
					terminalHandler = parsedHandler;
					terminalNext = throwIfMayNotDefer;
				} else routeMiddlewares.push(parsedHandler);
			}
		}
	}
	const response = await executeMiddleware(routeMiddlewares, terminalHandler, {
		request,
		context,
		params: rawParams,
		pathname,
		handlerType: "router"
	}, signal, event, terminalNext);
	return normalizeSsrResponse(response);
}
var fetch = createStartHandler(defaultStreamHandler);
var createServerEntry = createServerEntry$1;
var server_default = createServerEntry({ fetch });
//#endregion
export { getServerFnById as a, getRequest as c, createServerEntry, setCookie as d, server_default as default, TSS_SERVER_FUNCTION as i, getRequestHeader as l, createMiddleware as n, HEADERS as o, createServerFn as r, ssr_exports as s, createStartHandler as t, getRequestHost as u };
