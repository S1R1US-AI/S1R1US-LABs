import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { Wr as TAB_WHITE, pt as PAGE_DESC_WHITE } from "./brand-Bmsh_nLf.mjs";
import { C as whiteLabelGoLive, S as fieldBlocked, _ as WHITE_LABEL_PRIVILEGES, b as builderPrompt, f as OSS_LICENSE_NOTICE, h as WHITE_LABEL_DOWNLOAD_URL, m as WHITE_LABEL_BUILDERS, p as SYSTEM_ADMIN_OVERRIDE, v as WHITE_LABEL_STRIP, x as emptyWhiteLabelConfig, y as WHITE_LABEL_WATCH } from "./oss-roadmap-BeMO01lx.mjs";
import { n as Button } from "./renew-password-DcvT1MqM.mjs";
import { S as Shell, _ as Panel } from "./shell-DLOYoZrA.mjs";
import { t as SeoCopy } from "./seo-copy-BZWfSzWg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wh1t3-BRyxCDcm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Box({ label, value, onChange, placeholder, locked }) {
	const blocked = fieldBlocked(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder: placeholder ?? "",
				disabled: locked,
				className: "mt-1 h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg disabled:opacity-50"
			}),
			blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xs text-sell",
				children: blocked
			}) : null
		]
	});
}
function WhiteLabelPage() {
	const [cfg, setCfg] = (0, import_react.useState)(() => emptyWhiteLabelConfig());
	const [handle, setHandle] = (0, import_react.useState)("");
	const [report, setReport] = (0, import_react.useState)(null);
	const [live, setLive] = (0, import_react.useState)(false);
	function set(key, value) {
		setCfg((c) => ({
			...c,
			[key]: value
		}));
	}
	function setMenu(i, v) {
		set("menus", cfg.menus.map((m, k) => k === i ? v : m));
	}
	function setSecret(i, field, v) {
		set("secrets", cfg.secrets.map((s, k) => k === i ? {
			...s,
			[field]: v
		} : s));
	}
	function runCheck() {
		const res = whiteLabelGoLive(cfg, { handle: handle || "@white-label-user" });
		setLive(res.live);
		setReport(res.report);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-[1100px] px-3 py-6 sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Download · rebrand · your domain"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-2xl font-semibold tracking-tight text-fg",
				children: TAB_WHITE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-3xl text-sm leading-relaxed text-muted",
				children: "Upgrade to system admin of your own copy: download this entire open-source system and relaunch it under a domain name YOU control — never under S1R1US.ai. Available to all phone app and website users. As soon as the system goes live on your domain it is rebranded for that domain. The go-live check below verifies zero use of S1R1US.ai system admin account data — the white label does not go live if the check fails."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-fg",
				children: OSS_LICENSE_NOTICE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-5",
				kicker: "Build with AI",
				title: "Connect Grok, Claude, or GitHub Copilot",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Connect an AI builder to help build your white label system using YOUR domain name and the config settings you enter below. Copy the prompt — it never includes your secrets."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [WHITE_LABEL_BUILDERS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: b.url,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-4 text-sm font-semibold hover:bg-fg/6",
							children: b.name
						}, b.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								try {
									navigator.clipboard.writeText(builderPrompt(cfg));
								} catch {}
							},
							children: "Copy builder prompt"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: OSS_LICENSE_NOTICE
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Stripped",
				title: "What is removed before every download",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted",
						children: WHITE_LABEL_STRIP.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: "The white label never gets s1r1us.ai system access, never populates with S1R1US.ai app data or system admin data, and can never overtake s1r1us.ai system admin rights — 100 percent match on security, no compromise. External AI agents can never take over the s1r1us.ai system admin."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: WHITE_LABEL_DOWNLOAD_URL,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-4 text-sm font-semibold hover:bg-fg/6",
							children: "Download the stripped OSS system"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Rebrand config",
				title: "Domain · web host · account access",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Every box starts blank. Populate the OSS information manually — including your own terms and agreement and privacy policy. Proprietary s1r1us.ai info is blocked from every box."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
							label: "Domain name (rebrand target — never S1R1US.ai)",
							value: cfg.domain,
							onChange: (v) => set("domain", v),
							placeholder: "your-domain.com"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
							label: "Actor handle (for the bad-actor gate)",
							value: handle,
							onChange: setHandle,
							placeholder: "@your_handle"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-sm font-semibold text-fg",
						children: "Top-level menu names"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid gap-3 sm:grid-cols-3",
						children: cfg.menus.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
							label: `Menu name ${i + 1}`,
							value: m,
							onChange: (v) => setMenu(i, v)
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => set("menus", [...cfg.menus, ""]),
							children: "+ menu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => set("menus", cfg.menus.slice(0, -1)),
							disabled: cfg.menus.length <= 1,
							children: "− menu"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-sm font-semibold text-fg",
						children: "Accounts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
							label: "1. System admin",
							value: cfg.systemAdmin,
							onChange: (v) => set("systemAdmin", v),
							placeholder: "@your_new_admin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
							label: "2. Phone app user",
							value: cfg.phoneAppUser,
							onChange: (v) => set("phoneAppUser", v),
							placeholder: "@your_phone_user"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-sm font-semibold text-fg",
						children: "Web host + DNS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
								label: "Web host name",
								value: cfg.webhostName,
								onChange: (v) => set("webhostName", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
								label: "Web host IP address",
								value: cfg.webhostIp,
								onChange: (v) => set("webhostIp", v),
								placeholder: "203.0.113.7"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
								label: "DNS server 1",
								value: cfg.dns1,
								onChange: (v) => set("dns1", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
								label: "DNS server 2",
								value: cfg.dns2,
								onChange: (v) => set("dns2", v)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-sm font-semibold text-fg",
						children: "Encrypted token ids + secrets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Name every id and encrypted secret needed to maintain or access your new branded system — for example a better_auth id and its secret. Use + / − to add more pairs."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 space-y-3",
						children: cfg.secrets.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
								label: `Token id ${i + 1}`,
								value: s.id,
								onChange: (v) => setSecret(i, "id", v),
								placeholder: "better_auth_id"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
								label: `Encrypted secret ${i + 1}`,
								value: s.secret,
								onChange: (v) => setSecret(i, "secret", v),
								placeholder: "secret name"
							})]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => set("secrets", [...cfg.secrets, {
								id: "",
								secret: ""
							}]),
							children: "+ secret"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => set("secrets", cfg.secrets.slice(0, -1)),
							disabled: cfg.secrets.length <= 1,
							children: "− secret"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-sm font-semibold text-fg",
						children: "GitHub"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
							label: "GitHub repository (never S1R1US-AI/S1R1US-LABs — any branch or main)",
							value: cfg.githubRepo,
							onChange: (v) => set("githubRepo", v),
							placeholder: "you/your-repo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
							label: "GitHub system admin for the white label",
							value: cfg.githubAdmin,
							onChange: (v) => set("githubAdmin", v)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: runCheck,
							children: "Run go-live check — verify no S1R1US.ai system admin data"
						})
					}),
					report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: live ? "mt-3 rounded-md border border-rule p-3 text-sm text-up" : "mt-3 rounded-md border border-rule p-3 text-sm text-sell",
						children: report.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 first:mt-0",
							children: r
						}, r))
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Security",
				title: "System admin vs white label admin",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-rule",
						children: WHITE_LABEL_PRIVILEGES.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-start gap-2 py-2 font-mono text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 text-fg",
									children: row.control
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: ["system: ", row.system]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: row.white.startsWith("NEVER") ? "text-sell" : "text-up",
									children: ["white label: ", row.white]
								})
							]
						}, row.control))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: WHITE_LABEL_WATCH
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-muted",
						children: [
							"Override authority: ",
							SYSTEM_ADMIN_OVERRIDE,
							" — main system admin for S1R1US.ai."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs leading-relaxed text-muted",
				children: PAGE_DESC_WHITE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {})
		]
	}) });
}
var SplitComponent = WhiteLabelPage;
//#endregion
export { SplitComponent as component };
