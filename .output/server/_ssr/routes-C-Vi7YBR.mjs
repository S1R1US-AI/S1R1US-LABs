import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as APP_CALLS } from "./brand-D1W3F7j-.mjs";
import { f as looksLikeSecret } from "./security-BwwT3rcO.mjs";
import { i as PRED_KIND_LABEL } from "./prediction-markets-DqQwubc4.mjs";
import { n as GOLD_TICKERS, s as SILVER_TICKERS } from "./proxy-book-CtmrAojx.mjs";
import { n as runBots, t as heliosCall } from "./signal-GwlzOT1d.mjs";
import { n as STARTING_CASH, r as STOP_DEFAULT, s as initialStop, u as usePaper } from "./store-oEyIFO9k.mjs";
import { n as askHelios } from "./grok-sMB2NRH5.mjs";
import { t as DESK_POLL_MS } from "./poll-ByA4PSVX.mjs";
import { r as useDeskTape } from "./tape-client-BE5FsWuO.mjs";
import { v as useOperator } from "./operator-CzUemrGu.mjs";
import { c as fgTone, f as rsiTone, i as USD_TONE, l as kimchiHex, o as barBlue, s as cn, t as BTC_TONE, u as kimchiTone } from "./renew-password-dhV3CJgU.mjs";
import { S as Activity, b as ArrowUpRight, x as ArrowDownRight } from "../_libs/lucide-react.mjs";
import { m as Panel, v as Shell } from "./shell-h_0UyERA.mjs";
import { t as GoLivePanel } from "./go-live-panel-BgslqRIJ.mjs";
import { t as BowlLiveFeed } from "./bowl-live-feed-BhnN1MdV.mjs";
import { a as PaperCard, l as isOutgoingCli, o as YubiApprove, r as ConfirmClip, u as money } from "./helios-card-dmH1OOvW.mjs";
import { t as TapeFreezeBanner } from "./tape-freeze-8_0WZURh.mjs";
import { t as rollBots } from "./roll-bots-DkxE5xXa.mjs";
import { t as SeoCopy } from "./seo-copy-0YpWT2tg.mjs";
import { t as LiveTracks } from "./live-tracks-CZkf1pab.mjs";
import { n as Route } from "./router-D1mMBW2E.mjs";
import { i as TROY_OZ_PER_TONNE } from "./gold-sovereign-BlGdXnIc.mjs";
import { a as YAxis, c as Line, d as Bar, f as Pie, g as Tooltip, h as ResponsiveContainer, i as LineChart, l as CartesianGrid, m as Cell, n as PieChart, o as XAxis, r as BarChart, s as Area, t as ComposedChart, u as ReferenceLine } from "../_libs/recharts+[...].mjs";
import { r as TapeChart, t as DeskWorkspace } from "./desk-workspace-BPFv5b2Z.mjs";
import { n as LeverageWhaleRow, r as S1r1usSite, t as HelloWorld } from "./s1r1us-site-WwaoR6yD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C-Vi7YBR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function compactUsd(n) {
	const sign = n < 0 ? "-" : "";
	const a = Math.abs(n);
	if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(2)}B`;
	if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(1)}M`;
	if (a >= 1e3) return `${sign}$${(a / 1e3).toFixed(0)}K`;
	return `${sign}${money(a, 0)}`;
}
function SizeBar(props) {
	const { x = 0, y = 0, width = 0, height = 0, payload } = props;
	if (!width || !height || height <= 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x,
		y,
		width,
		height,
		rx: 5,
		fill: payload?.color ?? "#d0f1fc"
	});
}
function StackTable({ title, rows }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!rows.length) return null;
	const btc = rows.reduce((s, d) => s + d.btc, 0);
	const usd = rows.reduce((s, d) => s + d.usd, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			"aria-expanded": open,
			className: "flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "coinbase-orange text-xs font-medium tracking-[0.08em] uppercase",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[11px] expand-ctl",
				children: [
					rows.length,
					" · ",
					btc.toLocaleString("en-US", { maximumFractionDigits: 0 }),
					" BTC · ",
					compactUsd(usd),
					" ·",
					" ",
					open ? "collapse" : "expand"
				]
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 overflow-x-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[28rem] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-rule text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "coinbase-orange py-1 pr-3 font-medium",
							children: "Entity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `py-1 pr-3 text-right font-medium ${BTC_TONE}`,
							children: "BTC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `py-1 text-right font-medium ${USD_TONE}`,
							children: "USD"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.slice(0, 12).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-rule/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-1.5 pr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "coinbase-orange",
								children: d.name
							}), d.ticker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "coinbase-orange ml-2 font-mono text-xs",
								children: d.ticker
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `py-1.5 pr-3 text-right font-mono tabular-nums ${BTC_TONE}`,
							children: d.btc.toLocaleString("en-US", { maximumFractionDigits: 0 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `py-1.5 text-right font-mono tabular-nums ${USD_TONE}`,
							children: compactUsd(d.usd)
						})
					]
				}, `${d.ticker}-${d.name}`)) })]
			}), rows.length > 12 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: [
					"Showing top 12 of ",
					rows.length,
					". Bar is the full stack."
				]
			}) : null]
		}) : null]
	});
}
function CapitalTapeChart({ snap }) {
	const bars = snap?.capital.bars ?? [];
	const data = (0, import_react.useMemo)(() => {
		const rows = bars.map((b) => ({
			...b,
			value: b.usd ?? 0,
			plot: b.usd != null && b.usd > 0 ? b.usd : null,
			missing: b.usd == null
		}));
		const positives = rows.map((b) => b.plot).filter((v) => v != null && v > 0);
		const maxUsd = positives.length ? Math.max(...positives) : 0;
		const minUsd = positives.length ? Math.min(...positives) : 0;
		return rows.map((b) => ({
			...b,
			color: b.missing || b.plot == null ? "#243038" : barBlue(b.plot, maxUsd, minUsd)
		}));
	}, [bars]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mb-4",
		kicker: "Capital tape",
		title: "Where the bid is",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [
			data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56 sm:h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						margin: {
							top: 8,
							right: 8,
							left: 8,
							bottom: 4
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: {
									fill: "#ff8a1f",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								scale: "log",
								domain: [1e5, (max) => Number.isFinite(max) && max > 0 ? max * 1.2 : 1e11],
								tickFormatter: (v) => compactUsd(Number(v)),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false,
								width: 64,
								allowDataOverflow: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								cursor: {
									fill: "var(--color-fg)",
									fillOpacity: .04
								},
								formatter: (v, _n, item) => {
									const row = item?.payload;
									if (row.missing) return ["—", row.note];
									return [compactUsd(Number(v)), row.note];
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "plot",
								shape: SizeBar,
								isAnimationActive: false,
								maxBarSize: 48
							})
						]
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Waiting for ETF and exchange prints…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
				children: data.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1.5 size-2.5 shrink-0 rounded-sm",
						style: { background: b.color }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "coinbase-orange text-xs font-medium tracking-[0.08em] uppercase",
							children: b.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-1 font-mono text-sm tabular-nums ${b.missing ? "text-muted" : USD_TONE}`,
							children: b.missing ? "—" : compactUsd(b.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted",
							children: b.note
						})
					] })]
				}, b.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackTable, {
				title: "ETF / ETP stack",
				rows: snap?.capital.etfs ?? []
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackTable, {
				title: "Public DAT stack",
				rows: snap?.capital.dats ?? []
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [
					"ETF bar is Bitbo global ETF/ETP holdings (IBIT, FBTC, GBTC, and the rest), not last-session flow. SoSoValue US net is in the ETF note",
					snap?.capital.etfFlow != null ? ` (${snap.capital.etfFlow >= 0 ? "+" : ""}${compactUsd(snap.capital.etfFlow)})` : "",
					". DAT is Bitbo public-company holdings. El Salv is El Salvador’s reserve. LatAm is all Latin American official BTC (El Salvador + Venezuela and any other free prints). Sovereign is Bhutan + UAE (not seized US/CN/UK). Axis is log so El Salvador is readable next to ETF/DAT. Bar fill is ice → navy by size. Coinbase and other CEX are 24h spot notional. Hyperliquid is BTC perp 24h notional.",
					snap?.capital.asOf ? ` US ETF flow as of ${snap.capital.asOf}.` : ""
				]
			})
		]
	});
}
function fmtPct(n) {
	if (n == null || Number.isNaN(n)) return "—";
	return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
function statusTone(s) {
	if (s === "holding") return "text-high";
	if (s === "law" || s === "pipe") return "text-medium";
	if (s === "bill") return "text-tab";
	return "text-muted";
}
function rotTone(n) {
	if (n == null) return "text-muted";
	if (n >= 1.2) return "text-high";
	if (n <= -1.2) return "text-down";
	return "text-muted";
}
function SlowPoolsBoard({ snap }) {
	const pools = snap?.pools.pools ?? [];
	const holding = pools.filter((p) => p.status === "holding").length;
	const law = pools.filter((p) => p.status === "law" || p.status === "pipe").length;
	const watch = pools.filter((p) => p.status === "bill" || p.status === "watch").length;
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "Slow capital · 5-year pipes",
		title: "CRE · 401k · insurers · endowments · state reserves",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			"aria-expanded": open,
			className: "flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-sm text-fg",
				children: [
					holding,
					" holding · ",
					law,
					" law/pipe · ",
					watch,
					" bill/watch"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 font-mono text-[11px] expand-ctl",
				children: open ? "collapse" : "expand"
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Largest traditional alpha pools that may rotate into bitcoin. Most do not publish a live BTC book — this is status + a free proxy vs IBIT, not a 5-minute AUM. Does not vote unless Rotation sees CRE/Nasdaq leaving for IBIT."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-muted",
				children: [snap?.pools.reviewedAt ? `weekly hunt ${snap.pools.reviewedAt.slice(0, 10)}` : "", snap?.pools.source ? ` · ${snap.pools.source}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[40rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-rule text-[11px] font-medium tracking-[0.08em] text-muted uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3",
								children: "Pool"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3",
								children: "Proxy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 text-right",
								children: "vs IBIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: `py-2 text-right ${USD_TONE}`,
								children: "Disclosed"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: pools.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoolRow, { p }, p.id)) })]
				})
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted",
			children: "Click to open CRE, 401k, insurers, endowments, state bills."
		})]
	});
}
function PoolRow({ p }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-b border-rule/70 align-top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "py-2 pr-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-[11px] text-muted",
						children: p.sleeve
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block max-w-xl text-[11px] leading-snug text-muted",
						children: p.note
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: cn("py-2 pr-3 font-mono text-[11px] uppercase", statusTone(p.status)),
				children: p.status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "py-2 pr-3 font-mono text-xs",
				children: [p.proxy ?? "—", p.proxyChg != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block text-muted",
					children: fmtPct(p.proxyChg)
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: cn("py-2 pr-3 text-right font-mono text-xs tabular-nums", rotTone(p.vsIbit)),
				children: p.vsIbit == null ? "—" : fmtPct(p.vsIbit)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: `py-2 text-right font-mono text-xs tabular-nums ${p.disclosedUsd != null ? USD_TONE : "text-muted"}`,
				children: p.disclosedUsd != null ? money(p.disclosedUsd, 0) : "—"
			})
		]
	});
}
var SUBSIDY = 3.125;
var BLOCKS_DAY = 144;
var FILL = {
	na: "#2563eb",
	cn: "var(--color-accum)",
	jp: "var(--color-hash-jp)",
	eu: "var(--color-hash-eu)",
	ru: "var(--color-medium)",
	ot: "var(--color-hash-ot)"
};
function toEh(qty, unit) {
	if (unit === "TH") return qty / 1e6;
	if (unit === "PH") return qty / 1e3;
	return qty;
}
function fmtEh(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	if (n >= 1e3) return `${(n / 1e3).toFixed(2)} ZH/s`;
	return `${n.toFixed(1)} EH/s`;
}
function fmtDiff(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	if (n >= 0xe8d4a51000) return `${(n / 0xe8d4a51000).toFixed(2)} T`;
	return n.toExponential(2);
}
function fmtShare(n) {
	if (!(n > 0)) return "—";
	const pct = n * 100;
	if (pct >= 1) return `${pct.toFixed(2)}%`;
	if (pct >= .001) return `${pct.toFixed(4)}%`;
	return `${pct.toExponential(1)}%`;
}
function fmtBtcDay(n) {
	if (!(n > 0)) return "—";
	if (n >= 1) return n.toFixed(3);
	if (n >= 1e-4) return n.toFixed(6);
	return n.toPrecision(3);
}
function HashrateBoard({ snap }) {
	const [qty, setQty] = (0, import_react.useState)("100");
	const [unit, setUnit] = (0, import_react.useState)("TH");
	const network = snap?.onchain.hashrateEh ?? null;
	const regions = snap?.onchain.regions ?? [];
	const mineEh = toEh(Number(qty) || 0, unit);
	const share = network && network > 0 ? mineEh / network : 0;
	const btcDay = share * SUBSIDY * BLOCKS_DAY;
	const pie = (0, import_react.useMemo)(() => {
		const rows = regions.map((r) => ({
			...r,
			pct: r.share * 100
		}));
		if (rows.length > 0 && !rows.some((r) => r.id === "na")) rows.unshift({
			id: "na",
			name: "North America",
			share: 0,
			eh: 0,
			pct: 0
		});
		return rows.sort((a, b) => a.id === "na" ? -1 : b.id === "na" ? 1 : b.share - a.share);
	}, [regions]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			kicker: "Network",
			title: "Bitcoin hashpower",
			kickerClass: "indicator-title",
			titleClass: "indicator-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
							label: "Hashrate",
							value: fmtEh(network),
							hint: snap?.onchain.source ?? "mempool.space"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
							label: "Difficulty",
							value: fmtDiff(snap?.onchain.difficulty ?? null),
							hint: "Current"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
							label: "Height",
							value: snap?.onchain.height != null ? snap.onchain.height.toLocaleString("en-US") : "—",
							hint: "Tip"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
							label: "Fast fee",
							value: snap?.onchain.feeFast != null ? `${snap.onchain.feeFast} sat/vB` : "—",
							hint: snap?.onchain.feeEcon != null ? `econ ${snap.onchain.feeEcon}` : "mempool.space"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 rounded-md border border-rule bg-bg/50 p-3",
					onSubmit: (e) => e.preventDefault(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "min-w-[8rem] flex-1 text-xs font-medium tracking-[0.08em] text-muted uppercase",
							children: ["Your hash", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								step: "any",
								value: qty,
								onChange: (e) => setQty(e.target.value),
								className: "mt-1 h-10 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "flex shrink-0 gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "sr-only",
								children: "Unit"
							}), [
								"TH",
								"PH",
								"EH"
							].map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": unit === u,
								onClick: () => setUnit(u),
								className: cn("h-10 min-h-10 rounded-md px-2.5 text-xs font-medium", unit === u ? "bg-brand text-accent-fg" : "border border-rule bg-bg text-muted"),
								children: [u, "/s"]
							}, u))]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
							label: "Share",
							value: fmtShare(share),
							hint: fmtEh(mineEh)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
							label: "BTC / day",
							value: fmtBtcDay(btcDay),
							hint: `${fmtShare(share)} of subsidy`,
							tone: BTC_TONE
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted",
					children: [
						"Subsidy ",
						SUBSIDY,
						" BTC × ",
						BLOCKS_DAY,
						" blocks/day, no fees. Not a forecast."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			kicker: "Geography",
			title: "Where the hash is",
			kickerClass: "text-medium",
			titleClass: "text-medium",
			children: [pie.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-48",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: pie,
							dataKey: "share",
							nameKey: "name",
							innerRadius: "48%",
							outerRadius: "78%",
							paddingAngle: 2,
							stroke: "var(--color-surface)",
							children: pie.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: FILL[r.id] ?? "var(--color-muted)" }, r.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: {
								background: "var(--color-surface)",
								border: "1px solid var(--color-rule)",
								color: "var(--color-fg)",
								fontSize: 12
							},
							formatter: (v, _n, item) => {
								const row = item?.payload;
								return [`${(row.pct ?? 0).toFixed(1)}% · ${fmtEh(row.eh)}`, row.name];
							}
						})] })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5 text-sm",
					children: pie.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-2.5 shrink-0 rounded-full",
								style: { background: FILL[r.id] ?? "var(--color-muted)" }
							}), r.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono tabular-nums text-muted",
							children: [(r.share * 100).toFixed(1), "%"]
						})]
					}, r.id))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Waiting for pool geography…"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "Live pool share (1w). Foundry USA, MARA, Luxor, OCEAN, CKPool roll up as North America. Not miner IP (Cambridge map is not a free live feed)."
			})]
		})]
	});
}
function Metric$1({ label, value, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-[10px] font-medium tracking-[0.08em] uppercase leading-tight", tone || "text-muted"),
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-0.5 truncate font-mono text-base tabular-nums tracking-tight sm:text-lg", tone),
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 truncate text-[11px] text-muted",
				children: hint
			}) : null
		]
	});
}
function btcFmt(n) {
	return n.toLocaleString("en-US", { maximumFractionDigits: n >= 1e3 ? 0 : 1 });
}
function ozFmt(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M oz`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K oz`;
	return `${n.toFixed(0)} oz`;
}
function chgHex$1(n) {
	if (n == null) return "var(--color-muted)";
	if (n > 0) return "#3dff1a";
	if (n < 0) return "#ff1f1f";
	return "var(--color-muted)";
}
function BtcHoldersTable({ snap }) {
	const rows = snap?.holders.holders ?? [];
	const btcRegions = snap?.holders.btcRegions ?? [];
	const btcPx = snap?.btc.price ?? null;
	const [open, setOpen] = (0, import_react.useState)(false);
	const shown = open ? rows : rows.slice(0, 5);
	const hidden = Math.max(0, rows.length - 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mb-4",
		kicker: "Who holds it",
		title: "Top 20 bitcoin holders",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen((o) => !o),
				"aria-expanded": open,
				className: "mb-2 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-sm text-high",
					children: [
						"Top 5 shown",
						rows[0] ? ` · #1 ${rows[0].name}` : "",
						hidden ? ` · +${hidden} more` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 font-mono text-[11px] expand-ctl",
					children: open ? "collapse" : "expand top 20"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full min-w-0 max-w-full overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[40rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3",
								children: "#"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3",
								children: "Holder"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: `py-2 pr-3 text-right ${BTC_TONE}`,
								children: "BTC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: `py-2 pr-3 text-right ${USD_TONE}`,
								children: "USD"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3",
								children: "How it is held"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [shown.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-rule/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3 font-mono tabular-nums text-muted",
								children: h.rank
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-2 pr-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: h.url,
									className: "text-fg hover:text-brand",
									target: "_blank",
									rel: "noreferrer",
									children: h.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [h.country ?? "—", h.sharePct != null ? ` · ${h.sharePct.toFixed(2)}% of 21m` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `py-2 pr-3 text-right font-mono tabular-nums ${BTC_TONE}`,
								children: btcFmt(h.btc)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `py-2 pr-3 text-right font-mono tabular-nums ${USD_TONE}`,
								children: h.usd != null ? money(h.usd, 0) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3 text-muted",
								children: h.held
							})
						]
					}, `${h.rank}-${h.name}`)), !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "py-3 text-muted",
						children: "Waiting for Bitbo treasuries…"
					}) }) : null] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "Bitbo tracked entities. “How it is held” is the vehicle (ETF, treasury, government, wrap) — not a wallet-level audit. Exchange customer coins are custody, not treasury."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlicePie, {
		className: "mb-4",
		kicker: "Sovereign bitcoin",
		title: "Bitcoin by region",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		slices: btcRegions.map((r) => ({
			id: r.id,
			name: r.name,
			value: r.btc,
			estimate: r.estimate,
			note: r.note,
			fill: r.fill
		})),
		format: (n) => btcAmt(n),
		usdOf: (n) => btcPx != null && btcPx > 0 ? n * btcPx : null,
		caption: "Government / seized BTC only — not ETFs or DATs. China, NK, Iran, Pakistan, Saudi are estimates (Grok max ceiling where no public print). Label only — does not vote.",
		wide: true
	})] });
}
function MetalBoards({ snap }) {
	const gold = snap?.holders.gold ?? [];
	const silver = snap?.holders.silver ?? [];
	const goldRegions = snap?.holders.goldRegions ?? [];
	const goldBanks = snap?.holders.goldBanks ?? [];
	const gld = snap?.quotes.find((q) => q.symbol === "GLD") ?? gold.find((r) => r.symbol === "GLD");
	const slv = snap?.quotes.find((q) => q.symbol === "SLV") ?? silver.find((r) => r.symbol === "SLV");
	const gcf = snap?.quotes.find((q) => q.symbol === "GC=F" || q.symbol === "GC%3DF");
	const sif = snap?.quotes.find((q) => q.symbol === "SI=F" || q.symbol === "SI%3DF");
	const goldPx = gcf?.last ?? (gld?.last != null ? gld.last / .095 : null);
	const silverPx = sif?.last ?? (slv?.last != null ? slv.last / 1 : null);
	const [goldBreakOpen, setGoldBreakOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mb-4",
		kicker: "Official gold",
		title: "Region · central bank",
		kickerClass: "gold-css",
		titleClass: "gold-css",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlicePie, {
					bare: true,
					compact: true,
					legend: false,
					kicker: "Sovereign metal",
					title: "By region",
					kickerClass: "gold-css",
					titleClass: "gold-css",
					slices: goldRegions.map((r) => ({
						id: r.id,
						name: r.name,
						value: r.tonnes,
						estimate: r.estimate,
						note: r.note,
						fill: r.fill
					})),
					format: (n) => tFmt(n),
					usdOf: (n) => goldPx != null && goldPx > 0 ? n * TROY_OZ_PER_TONNE * goldPx : null,
					caption: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlicePie, {
					bare: true,
					compact: true,
					legend: false,
					kicker: "Central banks",
					title: "By bank",
					kickerClass: "gold-css",
					titleClass: "gold-css",
					slices: goldBanks.map((r) => ({
						id: r.id,
						name: r.name,
						value: r.tonnes,
						estimate: r.estimate,
						note: r.note,
						fill: r.fill
					})),
					format: (n) => tFmt(n),
					usdOf: (n) => goldPx != null && goldPx > 0 ? n * TROY_OZ_PER_TONNE * goldPx : null,
					caption: ""
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setGoldBreakOpen((o) => !o),
				"aria-expanded": goldBreakOpen,
				className: "mt-3 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gold-css text-xs font-medium tracking-[0.08em] uppercase",
					children: "Region · central bank breakdown"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[11px] expand-ctl",
					children: [
						goldRegions.length,
						" regions · ",
						goldBanks.length,
						" banks · ",
						goldBreakOpen ? "collapse" : "expand"
					]
				})]
			}),
			goldBreakOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliceLegend, {
					slices: goldRegions.map((r) => ({
						id: r.id,
						name: r.name,
						value: r.tonnes,
						estimate: r.estimate,
						note: r.note,
						fill: r.fill
					})),
					format: tFmt,
					compact: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliceLegend, {
					slices: goldBanks.map((r) => ({
						id: r.id,
						name: r.name,
						value: r.tonnes,
						estimate: r.estimate,
						note: r.note,
						fill: r.fill
					})),
					format: tFmt,
					compact: true
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "IMF / WGC official tonnes. Region groups the book; bank is the same tonnes one slice per holder. EU = national CBs + ECB, UK excluded. Iran and NK estimated. Canada 0 t. Pink = euro-area. Labels only — do not vote."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetalPanel, {
			kicker: "Store of value",
			title: "Gold holdings",
			kickerClass: "gold-css",
			titleClass: "gold-css",
			headClass: "gold-css",
			rows: gold,
			metal: "Gold",
			spot: goldPx,
			empty: "Waiting for GLD / IAU / PHYS…",
			note: "Spot from GC=F, else GLD / 0.095 oz. Miners (GDX, NEM, Barrick) are equity, not allocated bars."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetalPanel, {
			kicker: "Store of value",
			title: "Silver holdings",
			kickerClass: "silver-css",
			titleClass: "silver-css",
			headClass: "silver-css",
			rows: silver,
			metal: "Silver",
			spot: silverPx,
			empty: "Waiting for SLV / PSLV / miners…",
			note: "Spot from SI=F, else SLV ~1 oz/share. PAAS / WPM / SIL are equity claims on production.",
			noteClass: "silver-css"
		})]
	})] });
}
function MetalPanel({ kicker, title, kickerClass, titleClass, headClass, rows, metal, spot, empty, note, noteClass }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		kicker,
		title,
		kickerClass,
		titleClass,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-end justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("text-xs font-medium tracking-[0.08em] uppercase", headClass || "text-muted"),
					children: [
						"Spot ",
						metal,
						" / oz"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("font-mono text-2xl tabular-nums", USD_TONE),
					children: spot != null ? money(spot, 2) : "—"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[28rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: cn("border-b border-rule text-xs font-medium tracking-[0.08em] uppercase", headClass || "text-muted"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3",
								children: "Vehicle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 text-right",
								children: "Last"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 text-right",
								children: "Day"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: `py-2 pr-3 text-right ${USD_TONE}`,
								children: "AUM"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 text-right",
								children: metal
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-rule/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-2 pr-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("font-medium", headClass === "gold-css" ? "gold-css" : headClass === "silver-css" ? "silver-css" : "text-fg"),
										children: s.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("text-xs", headClass === "silver-css" ? "silver-css" : "text-muted"),
										children: s.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("text-[11px]", headClass === "silver-css" ? "silver-css" : "text-muted"),
										children: s.held
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3 text-right font-mono tabular-nums",
								children: s.last != null ? money(s.last, 2) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3 text-right font-mono tabular-nums",
								style: { color: chgHex$1(s.changePct) },
								children: s.changePct == null ? "—" : `${s.changePct >= 0 ? "+" : ""}${s.changePct.toFixed(2)}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: cn("py-2 pr-3 text-right font-mono tabular-nums", USD_TONE),
								children: s.aumUsd != null ? money(s.aumUsd, 0) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3 text-right font-mono tabular-nums",
								children: s.kind === "miner" ? "—" : ozFmt(s.oz)
							})
						]
					}, s.symbol)), !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "py-3 text-muted",
						children: empty
					}) }) : null] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-3 text-xs", noteClass || "text-muted"),
				children: note
			})
		]
	});
}
function tFmt(n) {
	if (n <= 0) return "0 t";
	return `${n.toLocaleString("en-US", { maximumFractionDigits: n >= 100 ? 0 : 1 })} t`;
}
function btcAmt(n) {
	if (n <= 0) return "0 BTC";
	return `${n.toLocaleString("en-US", { maximumFractionDigits: n >= 100 ? 0 : 1 })} BTC`;
}
function SliceLegend({ slices, format, compact }) {
	const total = slices.reduce((s, r) => s + r.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: cn("grid gap-1", compact ? "grid-cols-2" : "sm:grid-cols-1"),
		children: slices.map((r) => {
			const share = total > 0 ? r.value / total * 100 : 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("flex items-start justify-between gap-2 rounded-md border border-rule/70 px-2", compact ? "py-1" : "py-1.5"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex min-w-0 items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 size-2.5 shrink-0 rounded-full",
						style: { background: r.fill }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-fg",
								children: r.name
							}),
							r.estimate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-[10px] tracking-wide text-muted uppercase",
								children: "est."
							}) : null,
							compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted",
								children: r.note
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 text-right font-mono text-xs tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-fg",
						children: format(r.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: r.value > 0 ? `${share.toFixed(1)}%` : "—"
					})]
				})]
			}, r.id);
		})
	});
}
function SlicePie({ kicker, title, slices, format, usdOf, caption, className, wide, bare, compact, legend = true, kickerClass, titleClass }) {
	const total = slices.reduce((s, r) => s + r.value, 0);
	const pie = slices.filter((r) => r.value > 0);
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		bare ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("block font-mono text-[11px] tracking-[0.12em] uppercase", kickerClass || "text-muted"),
				children: kicker
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-sm font-medium", titleClass || "text-fg"),
				children: title
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("grid items-center gap-3", compact || !legend ? "grid-cols-1" : wide ? "lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]" : "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: compact ? "h-44" : wide ? "h-72" : "h-64",
				children: pie.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: pie,
						dataKey: "value",
						nameKey: "name",
						innerRadius: "46%",
						outerRadius: "78%",
						paddingAngle: 1.5,
						stroke: "var(--color-bg)",
						children: pie.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: r.fill }, r.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (_v, _n, item) => {
						const row = item?.payload;
						const share = total > 0 ? row.value / total * 100 : 0;
						const u = usdOf(row.value);
						return [`${format(row.value)} · ${share.toFixed(1)}% of book${u != null ? ` · ${money(u, 0)}` : ""}`, row.name];
					} })] })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Waiting for book…"
				})
			}), legend ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliceLegend, {
				slices,
				format,
				compact
			}) : null]
		}),
		caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted",
			children: caption
		}) : null
	] });
	if (bare) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		className,
		kicker,
		title,
		kickerClass,
		titleClass,
		children: inner
	});
}
var GOLD = "#ffd24a";
var GOLD_TEXT = "text-[#ffd24a]";
function monthTick$1(t) {
	return new Date(t).toLocaleString("en-US", { month: "short" });
}
function GoldBtcChart({ snap }) {
	const tape = snap?.goldBtc;
	const gcf = snap?.quotes.find((q) => q.symbol === "GC=F" || q.symbol === "GC%3DF");
	const btcUsd = snap?.btc.price ?? tape?.btcUsd ?? null;
	const goldUsd = gcf?.last ?? tape?.goldUsd ?? null;
	const oz = btcUsd != null && goldUsd != null && goldUsd > 0 ? btcUsd / goldUsd : tape?.ozPerBtc ?? null;
	const btcPerOz = oz != null && oz > 0 ? 1 / oz : tape?.btcPerOz ?? null;
	const rows = (0, import_react.useMemo)(() => (tape?.series ?? []).map((p) => ({
		t: p.t,
		oz: p.ozPerBtc,
		label: monthTick$1(p.t)
	})), [tape?.series]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mb-4",
		kicker: "XAU / BTC · gold spot",
		title: "Gold to bitcoin",
		titleClass: GOLD_TEXT,
		kickerClass: GOLD_TEXT,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-end gap-x-6 gap-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-mono text-[11px] tracking-[0.08em] uppercase ${GOLD_TEXT}`,
						children: "Oz gold / BTC"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-mono text-2xl tabular-nums ${GOLD_TEXT}`,
						children: oz != null ? oz.toFixed(2) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-mono text-[11px] tracking-[0.08em] uppercase ${BTC_TONE}`,
						children: "BTC / oz"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-mono text-lg tabular-nums ${BTC_TONE}`,
						children: btcPerOz != null ? btcPerOz.toFixed(5) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-mono text-[11px] tracking-[0.08em] uppercase ${GOLD_TEXT}`,
						children: "Gold"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-mono text-sm tabular-nums ${GOLD_TEXT}`,
						children: goldUsd != null ? money(goldUsd, 0) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-mono text-[11px] tracking-[0.08em] uppercase ${BTC_TONE}`,
						children: "Bitcoin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-mono text-sm tabular-nums ${BTC_TONE}`,
						children: btcUsd != null ? money(btcUsd, 0) : "—"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-44 sm:h-52",
				children: rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: rows,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-rule)",
								strokeDasharray: "3 3",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11
								},
								interval: "preserveStartEnd"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: ["auto", "auto"],
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11
								},
								width: 42,
								tickFormatter: (v) => Number(v).toFixed(1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-surface)",
									border: "1px solid var(--color-rule)",
									fontSize: 12,
									color: "var(--color-fg)"
								},
								formatter: (v) => [`${Number(v).toFixed(2)} oz`, "Gold / BTC"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "oz",
								stroke: GOLD,
								strokeWidth: 2.25,
								dot: false
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Waiting on Yahoo GC=F / BTC-USD weekly spark."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: ["Ounces of gold that equal one bitcoin (BTC-USD ÷ COMEX gold). Weekly, 1 year. ", tape?.source ?? ""]
			})
		]
	});
}
function pct(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${n.toFixed(2)}%`;
}
function m2(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `$${(n / 1e3).toFixed(2)}T`;
}
function bn(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${n < 0 ? "-" : ""}$${Math.abs(n).toFixed(0)}bn`;
}
function monthLabel(t) {
	const d = /* @__PURE__ */ new Date(`${t.slice(0, 10)}T00:00:00Z`);
	if (Number.isNaN(d.getTime())) return t.slice(0, 7);
	return d.toLocaleString("en-US", {
		month: "short",
		timeZone: "UTC"
	});
}
function ym(t) {
	return t.slice(0, 7);
}
function yoyByMonth(levels) {
	const by = /* @__PURE__ */ new Map();
	for (const p of levels ?? []) {
		const k = ym(p.t);
		if (k && Number.isFinite(p.v)) by.set(k, p.v);
	}
	const out = /* @__PURE__ */ new Map();
	for (const [k, v] of by) {
		const y = Number(k.slice(0, 4));
		const m = k.slice(5, 7);
		if (!y || !m) continue;
		const prev = `${y - 1}-${m}`;
		const a = by.get(prev);
		if (a && a !== 0) out.set(k, (v - a) / a * 100);
	}
	return out;
}
function byYearMonth(points) {
	const map = /* @__PURE__ */ new Map();
	for (const p of points ?? []) {
		const k = ym(p.t);
		if (k) map.set(k, p.v);
	}
	return map;
}
/** Last 12 published CPI months, oldest → newest (no blank “this month”). */
function last12Published(cpi) {
	return [...cpi.keys()].sort().slice(-12);
}
function cpiFill(v) {
	if (v == null) return "var(--color-rule)";
	if (v >= 4) return "#ff1f1f";
	if (v >= 3) return "#ff8a1f";
	if (v >= 2) return "#3d7ee8";
	return "#7eb8ff";
}
var STABLE_TONE = {
	USDC: "text-hash-na",
	USDT: "text-high",
	USD1: "text-hash-eu"
};
function compactTvl(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B TVL`;
	if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M TVL`;
	return `$${n.toFixed(0)} TVL`;
}
var LINE = [
	{
		key: "tbill",
		color: "var(--color-tbill)",
		width: 1.8,
		dash: "4 4"
	},
	{
		key: "y2",
		color: "var(--color-y2)",
		width: 1.9
	},
	{
		key: "y10",
		color: "var(--color-y10)",
		width: 2.1
	},
	{
		key: "y30",
		color: "var(--color-y30)",
		width: 2.4
	}
];
function MacroTape({ snap }) {
	const macro = snap?.macro;
	const curve = (0, import_react.useMemo)(() => {
		if (!macro) return [];
		const map = /* @__PURE__ */ new Map();
		const add = (id, s) => {
			for (const p of s.points) {
				const row = map.get(p.t) ?? { t: p.t };
				row[id] = p.v;
				map.set(p.t, row);
			}
		};
		add("tbill", macro.tbill);
		add("y2", macro.y2);
		add("y10", macro.y10);
		add("y30", macro.y30);
		return [...map.values()].sort((a, b) => String(a.t).localeCompare(String(b.t)));
	}, [macro]);
	const m2pts = macro?.m2.points ?? [];
	const infl = (0, import_react.useMemo)(() => {
		const cpi = byYearMonth(macro?.cpiYoy.points ?? []);
		const m2y = yoyByMonth(macro?.m2.points);
		const printed = byYearMonth(macro?.printed.points);
		return (last12Published(cpi).length >= 6 ? last12Published(cpi) : last12Published(m2y)).map((k) => ({
			t: `${k}-01`,
			ym: k,
			label: monthLabel(`${k}-01`),
			year: k.slice(0, 4),
			cpi: cpi.get(k) ?? null,
			m2yoy: m2y.get(k) ?? null,
			printed: printed.get(k) ?? null
		}));
	}, [macro]);
	const latestCpi = infl.filter((r) => r.cpi != null).at(-1);
	const latestM2 = infl.filter((r) => r.m2yoy != null).at(-1);
	const debaseGap = latestCpi?.cpi != null && latestM2?.m2yoy != null ? latestM2.m2yoy - latestCpi.cpi : null;
	const printed12 = infl.reduce((s, r) => s + (r.printed ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			kicker: "BLS / FRED",
			title: "Inflation vs money printed",
			kickerClass: "indicator-title",
			titleClass: "indicator-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "CPI YoY",
							value: pct(latestCpi?.cpi ?? macro?.cpiYoy.last ?? null),
							hint: latestCpi ? `${latestCpi.label} ${latestCpi.year}` : "CPIAUCSL",
							valueStyle: { color: cpiFill(latestCpi?.cpi ?? macro?.cpiYoy.last ?? null) }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "M2 YoY",
							value: pct(latestM2?.m2yoy ?? null),
							hint: "Same months as CPI",
							tone: (latestM2?.m2yoy ?? 0) >= 0 ? "rsi-above" : "rsi-below"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Debase gap",
							value: debaseGap == null ? "—" : `${debaseGap >= 0 ? "+" : ""}${debaseGap.toFixed(1)}pt`,
							hint: "M2 YoY − CPI YoY",
							tone: debaseGap == null ? void 0 : debaseGap > 0 ? "rsi-above" : "rsi-below"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Printed 12m",
							value: bn(printed12 || null),
							hint: "M2 MoM sum $bn",
							tone: printed12 > 0 ? "rsi-above" : printed12 < 0 ? "rsi-below" : void 0
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mb-4 grid grid-cols-4 gap-1.5 sm:grid-cols-6",
					children: infl.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-rule px-2 py-1.5 text-center",
						style: { background: `${cpiFill(r.cpi)}18` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-medium tracking-[0.08em] text-muted uppercase",
							children: r.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 font-mono text-sm tabular-nums",
							style: { color: cpiFill(r.cpi) },
							children: r.cpi == null ? "—" : `${r.cpi.toFixed(1)}%`
						})]
					}, r.ym))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-52 sm:h-60",
					children: infl.some((r) => r.cpi != null) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
							data: infl,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--color-rule)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: {
										fill: "var(--color-muted)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fill: "var(--color-muted)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									tickFormatter: (v) => `${Number(v).toFixed(0)}%`,
									width: 36,
									domain: [0, "auto"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
									y: 2,
									stroke: "var(--color-muted)",
									strokeDasharray: "4 4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v, name) => [`${Number(v).toFixed(2)}%`, String(name)],
									labelFormatter: (_, payload) => {
										const row = payload?.[0]?.payload;
										return row?.label && row.year ? `${row.label} ${row.year}` : "";
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "cpi",
									name: "CPI YoY",
									radius: [
										4,
										4,
										0,
										0
									],
									maxBarSize: 28,
									fill: "#3d7ee8",
									isAnimationActive: false,
									children: infl.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: cpiFill(r.cpi) }, r.ym))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "m2yoy",
									name: "M2 YoY",
									stroke: "var(--color-medium)",
									strokeWidth: 2,
									dot: {
										r: 3,
										fill: "var(--color-medium)"
									},
									connectNulls: true,
									isAnimationActive: false
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Waiting for FRED CPIAUCSL / M2SL…"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted",
					children: "Last 12 published CPI months, oldest to newest (BLS lags about six weeks — no blank current month). Bars: CPI-U YoY. Color: under 2% light blue, 2–3% blue, 3–4% orange, 4%+ red. Orange line: M2 YoY on the same axis. Dashed line: Fed 2% target. Debase gap above zero means money is still growing faster than prices."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				kicker: "FRED",
				title: "Treasuries + M2",
				kickerClass: "indicator-title",
				titleClass: "indicator-title",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "T-bill 3m",
								value: pct(macro?.tbill.last ?? null),
								hint: macro?.tbill.asOf ?? void 0,
								tone: "text-tbill"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "2-year",
								value: pct(macro?.y2.last ?? null),
								hint: macro?.y2.asOf ?? void 0,
								tone: "text-y2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "10-year",
								value: pct(macro?.y10.last ?? null),
								hint: macro?.y10.asOf ?? void 0,
								tone: "text-y10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "30-year",
								value: pct(macro?.y30.last ?? null),
								hint: macro?.y30.asOf ?? void 0,
								tone: "text-y30"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-44 sm:h-52",
						children: curve.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data: curve,
								margin: {
									top: 8,
									right: 4,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--color-rule)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "t",
										hide: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: ["auto", "auto"],
										tick: {
											fill: "var(--color-muted)",
											fontSize: 11
										},
										axisLine: false,
										tickLine: false,
										tickFormatter: (v) => `${Number(v).toFixed(1)}%`,
										width: 44
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v, name) => [`${Number(v).toFixed(2)}%`, String(name)],
										labelFormatter: (l) => String(l)
									}),
									LINE.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: l.key,
										name: macro?.[l.key].name ?? l.key,
										stroke: l.color,
										strokeDasharray: l.dash,
										strokeWidth: l.width,
										dot: false,
										connectNulls: true
									}, l.key))
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Waiting for FRED…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "Daily constant-maturity yields. T-bill 3m yellow · 2y purple · 10y red · 30y blue."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					kicker: "Money supply",
					title: "M2",
					kickerClass: "indicator-title",
					titleClass: "indicator-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "M2 (SA)",
						value: m2(macro?.m2.last ?? null),
						hint: macro?.m2.asOf ? `${monthLabel(macro.m2.asOf)} ${macro.m2.asOf.slice(0, 4)} · FRED M2SL` : "FRED M2SL",
						tone: "text-accum"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-36",
						children: m2pts.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data: m2pts,
								margin: {
									top: 4,
									right: 8,
									left: 8,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "t",
										tickFormatter: monthLabel,
										tick: {
											fill: "var(--color-muted)",
											fontSize: 10
										},
										interval: "preserveStartEnd"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: [(min) => min * .995, (max) => max * 1.005],
										tickFormatter: (v) => `$${(Number(v) / 1e3).toFixed(1)}T`,
										tick: {
											fill: "var(--color-muted)",
											fontSize: 10
										},
										width: 52
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v) => [m2(Number(v)), "M2"],
										labelFormatter: (l) => String(l)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "v",
										stroke: "var(--color-medium)",
										strokeWidth: 2,
										fill: "var(--color-accum)",
										fillOpacity: .35,
										isAnimationActive: false
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Waiting for FRED M2SL…"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					kicker: "DefiLlama",
					title: "Stable yields",
					kickerClass: "indicator-title",
					titleClass: "indicator-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-3 items-start gap-x-3 gap-y-2",
						children: [
							"USDC",
							"USDT",
							"USD1"
						].map((sym) => {
							const s = (macro?.stables ?? []).find((x) => x.symbol === sym);
							const href = s?.protocol ? `https://defillama.com/protocol/${encodeURIComponent(s.protocol)}` : "https://defillama.com/stablecoins";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("truncate text-xs font-medium tracking-[0.08em] uppercase", STABLE_TONE[sym] || "text-muted"),
										children: sym
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("mt-1 font-mono text-lg tabular-nums leading-none", STABLE_TONE[sym] || "text-fg"),
										children: s?.apy != null ? `${s.apy.toFixed(2)}%` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href,
										target: "_blank",
										rel: "noreferrer",
										className: "legal-purple mt-1 block truncate text-xs hover:underline",
										title: s?.protocol ?? "DefiLlama stables",
										children: [s?.protocol ?? "DefiLlama", s?.tvlUsd ? ` · ${compactTvl(s.tvlUsd)}` : ""]
									})
								]
							}, sym);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "TVL-weighted APY on single-asset, no-IL pools ≥ $5M. Not a venue recommendation."
					})]
				})]
			})]
		})]
	});
}
function Metric({ label, value, hint, tone, valueStyle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "coinbase-orange text-xs font-medium tracking-[0.08em] uppercase",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-1 font-mono text-lg tabular-nums tracking-tight", tone),
			style: valueStyle,
			children: value
		}),
		hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-muted",
			children: hint
		}) : null
	] });
}
function chgClass(n) {
	if (n == null) return "text-muted";
	if (n > 0) return "rsi-above";
	if (n < 0) return "rsi-below";
	return "text-muted";
}
function fmtChg(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
function chgHex(n) {
	if (n == null) return "var(--color-muted)";
	if (n > 0) return "#3dff1a";
	if (n < 0) return "#ff1f1f";
	return "var(--color-muted)";
}
function monthTick(t) {
	return new Date(t).toLocaleString("en-US", { month: "short" });
}
function StrategyTape({ snap }) {
	const products = snap?.strategy.products ?? [];
	const mstr = products.find((p) => p.symbol === "MSTR");
	const prefs = products.filter((p) => p.kind === "preferred");
	const etfs = products.filter((p) => p.kind === "etf");
	const [stackOpen, setStackOpen] = (0, import_react.useState)(false);
	const spark = (0, import_react.useMemo)(() => (mstr?.points ?? []).map((p) => ({
		t: p.t,
		v: p.v,
		label: monthTick(p.t)
	})), [mstr]);
	const ranked = (0, import_react.useMemo)(() => {
		return [...products].filter((p) => p.change6m != null).sort((a, b) => (b.change6m ?? 0) - (a.change6m ?? 0)).map((p) => ({
			symbol: p.symbol,
			name: p.name,
			v: p.change6m ?? 0,
			kind: p.kind
		}));
	}, [products]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mb-4",
		kicker: "Strategy Inc",
		title: "MSTR + product stack",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "indicator-title text-xs font-medium tracking-[0.08em] uppercase",
						children: "MSTR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-3xl tabular-nums tracking-tight text-medium",
						children: mstr?.last != null ? money(mstr.last, 2) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex flex-wrap gap-3 font-mono text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: chgClass(mstr?.changePct ?? null),
							style: { color: chgHex(mstr?.changePct ?? null) },
							children: [fmtChg(mstr?.changePct ?? null), " day"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: chgClass(mstr?.change6m ?? null),
							style: { color: chgHex(mstr?.change6m ?? null) },
							children: [fmtChg(mstr?.change6m ?? null), " 6m"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-36",
						children: spark.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: spark,
								margin: {
									top: 8,
									right: 8,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--color-rule)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "t",
										type: "number",
										domain: ["dataMin", "dataMax"],
										tickFormatter: (v) => monthTick(Number(v)),
										tick: {
											fill: "var(--color-muted)",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: ["auto", "auto"],
										tickFormatter: (v) => `$${Number(v).toFixed(0)}`,
										tick: {
											fill: "var(--color-muted)",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false,
										width: 44
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v) => [money(Number(v), 2), "MSTR"],
										labelFormatter: (l) => new Date(Number(l)).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "v",
										stroke: "#ff8a1f",
										strokeWidth: 2.2,
										dot: false,
										isAnimationActive: false
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Waiting for MSTR weekly…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "MSTR last 6 months, USD. Not indexed."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "indicator-title text-xs font-medium tracking-[0.08em] uppercase",
						children: "6m total return"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-56 sm:h-64",
						children: ranked.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: ranked,
								layout: "vertical",
								margin: {
									top: 4,
									right: 36,
									left: 8,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--color-rule)",
										horizontal: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										tickFormatter: (v) => `${Number(v).toFixed(0)}%`,
										tick: {
											fill: "var(--color-muted)",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "symbol",
										width: 52,
										tick: {
											fill: "var(--color-fg)",
											fontSize: 11
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v, _n, item) => {
										const row = item?.payload;
										return [fmtChg(Number(v)), row.name ?? "6m"];
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "v",
										maxBarSize: 18,
										radius: [
											0,
											4,
											4,
											0
										],
										isAnimationActive: false,
										children: ranked.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: chgHex(r.v) }, r.symbol))
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Waiting for 6m returns…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Green = up over 6 months, red = down. Ranked, not overlapping."
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setStackOpen((o) => !o),
				"aria-expanded": stackOpen,
				className: "mt-4 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium tracking-[0.08em] expand-ctl uppercase",
					children: "Preferreds + vehicles"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[11px] expand-ctl",
					children: [
						prefs.length,
						" prefs · ",
						etfs.length,
						" ETFs · ",
						stackOpen ? "collapse" : "expand"
					]
				})]
			}),
			stackOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTable, {
				title: "Preferreds (issuer)",
				rows: prefs
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTable, {
				title: "MSTR vehicles",
				rows: etfs,
				className: "mt-4"
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [snap?.strategy.source ?? "CNBC · Yahoo", ". Preferreds are residual claims, not bitcoin. 2x ETFs decay."]
			})
		]
	});
}
function ProductTable({ title, rows, className }) {
	if (!rows.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "coinbase-orange mb-2 text-xs font-medium tracking-[0.08em] uppercase",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-rule text-sm",
				children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid grid-cols-[minmax(0,1.4fr)_auto_auto_auto] items-center gap-2 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "coinbase-orange font-medium",
								children: [p.symbol, p.coupon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "coinbase-orange ml-2 font-mono text-xs",
									children: p.coupon
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "coinbase-orange truncate text-xs",
								children: p.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums",
							children: p.last != null ? money(p.last, 2) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums",
							style: { color: chgHex(p.changePct) },
							children: fmtChg(p.changePct)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums",
							style: { color: chgHex(p.change6m) },
							children: fmtChg(p.change6m)
						})
					]
				}, p.symbol))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Last"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-16 text-right",
						children: "Day"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-16 text-right",
						children: "6m"
					})
				]
			})
		]
	});
}
function DeskApp() {
	const { snap, err, live } = useDeskTape();
	const [grok, setGrok] = (0, import_react.useState)(null);
	const [grokErr, setGrokErr] = (0, import_react.useState)(null);
	const [asking, setAsking] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [copyAsk, setCopyAsk] = (0, import_react.useState)(false);
	const cash = usePaper((s) => s.cashUsd);
	const btc = usePaper((s) => s.btc);
	const profitBtc = usePaper((s) => s.profitBtc);
	const fills = usePaper((s) => s.fills);
	const fill = usePaper((s) => s.fill);
	const reset = usePaper((s) => s.reset);
	const log = useOperator((s) => s.log);
	const unlocked = useOperator((s) => s.unlocked);
	const role = useOperator((s) => s.role);
	const isAdmin = unlocked && role === "admin";
	(0, import_react.useEffect)(() => setMounted(true), []);
	(0, import_react.useEffect)(() => {
		const admin = useOperator.getState().unlocked && useOperator.getState().role === "admin";
		rollBots({
			force: true,
			admin
		});
		const id = window.setInterval(() => {
			const a = useOperator.getState().unlocked && useOperator.getState().role === "admin";
			rollBots({ admin: a });
		}, DESK_POLL_MS);
		return () => window.clearInterval(id);
	}, []);
	const briefs = (0, import_react.useMemo)(() => snap ? runBots(snap) : [], [snap]);
	const nav = mounted ? cash + (btc + (profitBtc ?? 0)) * (snap?.btc.price ?? 0) : STARTING_CASH;
	const call = (0, import_react.useMemo)(() => snap ? heliosCall(snap, briefs, nav) : null, [
		snap,
		briefs,
		nav
	]);
	async function onAskGrok() {
		if (!unlocked || !snap || !call) return;
		setAsking(true);
		setGrokErr(null);
		try {
			const res = await askHelios({ data: {
				token: useOperator.getState().token,
				snapshot: snap,
				briefs,
				call
			} });
			if (!res.ok) setGrokErr(res.error);
			else {
				setGrok(res.text);
				log("grok", "Ask Grok");
			}
		} catch (e) {
			setGrokErr(e instanceof Error ? e.message : "Grok request failed");
		} finally {
			setAsking(false);
		}
	}
	function executeClip(c) {
		if (!unlocked || role !== "admin") return;
		const px = snap?.btc.price;
		if (!px || c.clipUsd <= 0) return;
		if (c.stance === "TRIM") {
			const qty = Math.min(btc, c.clipUsd / px);
			if (qty <= 0) return;
			fill({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				side: "SELL",
				usd: qty * px,
				btc: qty,
				price: px,
				note: `${APP_CALLS} ${c.stance} ${c.conviction}`,
				kind: "trim"
			});
			log("fill", `Paper SELL ${c.clipUsd}`);
			return;
		}
		const usd = Math.min(cash, c.clipUsd);
		if (usd <= 0) return;
		fill({
			at: (/* @__PURE__ */ new Date()).toISOString(),
			side: "BUY",
			usd,
			btc: usd / px,
			price: px,
			note: `${APP_CALLS} ${c.stance} ${c.conviction}`,
			kind: "clip",
			stopPrice: initialStop(px, STOP_DEFAULT),
			peakPrice: px
		});
		log("fill", `Paper BUY ${c.clipUsd}`);
	}
	async function copyCli(text) {
		if (looksLikeSecret(text) || text.includes("orders create")) {
			log("reject", "Blocked unsafe CLI copy");
			return;
		}
		await navigator.clipboard.writeText(text);
		log("copy", "Preview CLI copied");
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	}
	const px = snap?.btc.price;
	const chg = snap?.btc.changePct;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-[1400px] px-3 py-4 sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeFreezeBanner, {}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 rounded-md border border-down/40 bg-down/10 px-3 py-2 text-sm text-down",
				children: err
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskWorkspace, {
				snap,
				briefs,
				call,
				canAct: isAdmin,
				canFill: isAdmin && Boolean(px) && call != null && call.clipUsd > 0,
				asking,
				copied,
				grok,
				grokErr,
				onAsk: () => {
					if (!isAdmin) window.location.assign("/compute");
					else onAskGrok();
				},
				onCopy: () => {
					if (!call) return;
					if (isOutgoingCli(call.cli)) setCopyAsk(true);
					else copyCli(call.cli);
				},
				onFill: () => {
					if (isAdmin) setConfirm(true);
				}
			}),
			confirm && call ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmClip, {
				call,
				onCancel: () => setConfirm(false),
				onConfirm: () => {
					setConfirm(false);
					executeClip(call);
				}
			}) : null,
			copyAsk && call ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YubiApprove, {
				title: "Approve outgoing CLI",
				detail: "Copying a Coinbase BTC/USDC trade or transfer command requires the admin YubiKey. This does not place a live order.",
				action: `cli:helios:${call.stance}:${Math.round(call.clipUsd)}`,
				onCancel: () => setCopyAsk(false),
				onDone: () => {
					setCopyAsk(false);
					copyCli(call.cli);
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelloWorld, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoLivePanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BowlLiveFeed, { compact: true })
			}),
			isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperCard, {
					mounted,
					cash,
					btc,
					profitBtc: profitBtc ?? 0,
					px: px ?? null,
					fills,
					onReset: unlocked ? reset : void 0
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTracks, {
					briefs,
					note: "Live visual summary of bots 1–6 from the last tape pull. 7-B0T reads these lanes — it does not average them."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 mb-4 grid w-full grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "BTC-USD",
						value: px ? money(px, 0) : "—",
						hint: chg != null ? `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%` : "Coinbase",
						up: chg == null ? void 0 : chg >= 0,
						valueClass: USD_TONE,
						labelClass: BTC_TONE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "RSI-14 1h",
						value: snap?.rsi14 != null ? snap.rsi14.toFixed(1) : "—",
						hint: snap?.rsiAvg != null ? `avg ${snap.rsiAvg.toFixed(1)} · ${snap.rsi14 != null && snap.rsi14 < snap.rsiAvg ? "below" : "above"}` : "vs tape avg",
						valueClass: rsiTone(snap?.rsi14, snap?.rsiAvg),
						labelClass: rsiTone(snap?.rsi14, snap?.rsiAvg)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "MACD 1h",
						value: snap?.macd ? `${snap.macd.hist >= 0 ? "+" : ""}${Math.abs(snap.macd.hist) >= 10 ? snap.macd.hist.toFixed(0) : snap.macd.hist.toFixed(1)}` : "—",
						hint: snap?.macd ? snap.macd.hist >= 0 ? "hist · above signal" : "hist · below signal" : "12/26/9",
						valueClass: snap?.macd ? snap.macd.hist >= 0 ? "rsi-above" : "rsi-below" : void 0,
						labelClass: snap?.macd ? snap.macd.hist >= 0 ? "rsi-above" : "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "EMA-21 1h",
						value: snap?.ema21 != null ? money(snap.ema21, 0) : "—",
						hint: px != null && snap?.ema21 != null ? px >= snap.ema21 ? "last above" : "last below" : "trend",
						valueClass: px != null && snap?.ema21 != null ? px >= snap.ema21 ? "rsi-above" : "rsi-below" : void 0,
						labelClass: px != null && snap?.ema21 != null ? px >= snap.ema21 ? "rsi-above" : "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "SMA-50 1h",
						value: snap?.sma50 != null ? money(snap.sma50, 0) : "—",
						hint: px != null && snap?.sma50 != null ? px >= snap.sma50 ? "last above" : "last below" : "need 50 bars",
						valueClass: px != null && snap?.sma50 != null ? px >= snap.sma50 ? "rsi-above" : "rsi-below" : void 0,
						labelClass: px != null && snap?.sma50 != null ? px >= snap.sma50 ? "rsi-above" : "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "BB %B 1h",
						value: snap?.bbPct != null ? snap.bbPct.toFixed(2) : "—",
						hint: snap?.bbPct == null ? "20,2" : snap.bbPct <= .3 ? "lower band" : snap.bbPct >= .7 ? "upper band" : "mid band",
						valueClass: snap?.bbPct == null ? void 0 : snap.bbPct <= .3 ? "rsi-above" : snap.bbPct >= .7 ? "rsi-below" : void 0,
						labelClass: snap?.bbPct == null ? void 0 : snap.bbPct <= .3 ? "rsi-above" : snap.bbPct >= .7 ? "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Vol 1h",
						value: snap?.volRatio != null ? `${snap.volRatio.toFixed(2)}×` : "—",
						hint: snap?.volRatio != null ? snap.volRatio >= 1 ? "vs 20h avg" : "quiet vs 20h" : "vs 20h avg",
						valueClass: snap?.volRatio != null && snap.volRatio >= 1 ? "rsi-above" : snap?.volRatio != null ? "rsi-below" : void 0,
						labelClass: snap?.volRatio != null && snap.volRatio >= 1 ? "rsi-above" : snap?.volRatio != null ? "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "ATR-14 1h",
						value: snap?.atr != null ? money(snap.atr, 0) : "—",
						hint: "stop width"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Fear & Greed",
						value: snap?.fearGreed ? String(snap.fearGreed.value) : "—",
						hint: snap?.fearGreed?.label,
						valueClass: fgTone(snap?.fearGreed?.value, snap?.fearGreed?.label),
						labelClass: fgTone(snap?.fearGreed?.value, snap?.fearGreed?.label)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						labelNode: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "upbit-blue",
								children: "Upbit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: " vs "
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "coinbase-orange",
								children: "Coinbase"
							})
						] }),
						value: snap?.asia?.kimchiPct != null ? `${snap.asia.kimchiPct >= 0 ? "+" : ""}${snap.asia.kimchiPct.toFixed(2)}%` : "—",
						hint: "Kimchi premium",
						valueClass: kimchiTone(snap?.asia?.kimchiPct)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeChart, { snap })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeverageWhaleRow, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AsiaPanel, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmFlowPanel, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapitalTapeChart, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlowPoolsBoard, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashrateBoard, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtcHoldersTable, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quotes, { snap }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WirePanel, { snap })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinbasePanel, { call }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroTape, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StrategyTape, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldBtcChart, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetalBoards, { snap }),
			snap?.errors.length || snap?.pullMs ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 font-mono text-xs text-muted",
				children: [
					snap.pullMs ? `Live pull ${((snap.pullMs ?? 0) / 1e3).toFixed(1)}s` : null,
					snap.feedAudit ? ` · ${snap.feedAudit.ok}/${snap.feedAudit.ok + snap.feedAudit.fail} sources` : null,
					live ? " · 5m cadence" : " · paused",
					snap.errors.length ? ` · Degraded: ${snap.errors.join(" · ")}` : " · all sources live"
				]
			}) : null
		]
	}) });
}
function Stat({ label, labelNode, value, hint, up, valueClass, labelClass }) {
	const hot = valueClass === "rsi-below" ? "#ff1f1f" : valueClass === "rsi-above" ? "#3dff1a" : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("text-[11px] tracking-[0.14em] uppercase", !labelNode && (labelClass || "text-muted")),
			style: !labelNode && hot ? { color: hot } : void 0,
			children: labelNode ?? label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-1 text-lg tabular-nums", valueClass),
			style: hot ? { color: hot } : void 0,
			children: value
		}),
		hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("text-xs", up == null ? "text-muted" : up ? "text-up" : "text-down"),
			children: hint
		}) : null
	] });
}
function asiaVenueClass(id) {
	if (id === "upbit") return "upbit-blue";
	if (id === "bithumb") return "asia-bithumb";
	if (id === "hashkey") return "asia-hashkey";
	if (id === "okx") return "asia-okx";
	if (id === "htx") return "asia-htx";
	return "text-fg";
}
function AsiaPanel({ snap }) {
	const a = snap?.asia;
	const [open, setOpen] = (0, import_react.useState)(false);
	const fmtPrem = (n) => n == null ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "KR · HK · CN  ·  Binance blocked",
		title: "Asia bitcoin tape",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			"aria-expanded": open,
			className: "flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-2 rounded-md py-1 text-left hover:bg-fg/4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: a?.session ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 text-muted",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: kimchiTone(a?.kimchiPct),
						style: { color: kimchiHex(a?.kimchiPct) },
						children: ["kimchi ", fmtPrem(a?.kimchiPct)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 text-muted",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: kimchiTone(a?.hkPremiumPct),
						style: { color: kimchiHex(a?.hkPremiumPct) },
						children: ["HK ", fmtPrem(a?.hkPremiumPct)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 text-muted",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: kimchiTone(a?.cnyOtc.premiumPct),
						style: { color: kimchiHex(a?.cnyOtc.premiumPct) },
						children: ["CNY ", fmtPrem(a?.cnyOtc.premiumPct)]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 font-mono text-[11px] expand-ctl",
				children: open ? "collapse" : "expand"
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 mt-3 flex flex-wrap gap-6 font-mono text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted",
						children: "Session"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: a?.session ?? "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "upbit-blue",
								children: "Upbit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: " vs " }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "coinbase-orange",
								children: "Coinbase"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1", kimchiTone(a?.kimchiPct)),
						style: { color: kimchiHex(a?.kimchiPct) },
						children: fmtPrem(a?.kimchiPct)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] asia-hashkey",
						children: "HashKey HK"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1", kimchiTone(a?.hkPremiumPct)),
						style: { color: kimchiHex(a?.hkPremiumPct) },
						children: fmtPrem(a?.hkPremiumPct)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] asia-cny",
						children: "CNY OTC USDT"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 tabular-nums",
						children: [
							a?.cnyOtc.usdtCny != null ? a.cnyOtc.usdtCny.toFixed(3) : "—",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: kimchiTone(a?.cnyOtc.premiumPct),
								style: { color: kimchiHex(a?.cnyOtc.premiumPct) },
								children: fmtPrem(a?.cnyOtc.premiumPct)
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 font-mono text-sm",
				children: (a?.venues ?? []).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline justify-between gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-8 shrink-0 text-muted",
							children: v.region
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("min-w-0 flex-1 truncate", asiaVenueClass(v.id)),
							children: v.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: v.lastUsd != null ? money(v.lastUsd, 0) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("w-16 shrink-0 text-right tabular-nums", kimchiTone(v.premiumPct)),
							style: { color: kimchiHex(v.premiumPct) },
							children: fmtPrem(v.premiumPct)
						})
					]
				}, v.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "Premiums vs Coinbase USD. Korea is KRW converted at Frankfurter FX. China onshore trading is banned — HTX is the offshore proxy, CNY OTC is OKX P2P USDT/CNY. HashKey is the SFC-licensed Hong Kong book. No Binance key, no Binance host."
			})
		] }) : null]
	});
}
var FLOW_IN = "text-high";
var FLOW_OUT = "text-[#8a918c]";
var FLOW_FLAT = "text-tbill";
function flowClass(flow) {
	if (flow === "INFLOW") return FLOW_IN;
	if (flow === "OUTFLOW") return FLOW_OUT;
	return FLOW_FLAT;
}
function premClass(n) {
	if (n == null) return FLOW_OUT;
	if (n >= 1.5) return FLOW_IN;
	if (n <= -1.5) return FLOW_OUT;
	return FLOW_FLAT;
}
function EmFlowPanel({ snap }) {
	const em = snap?.em;
	const fmtPrem = (n) => n == null ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "UAE · ME · RU · AF · SA  ·  free public books",
		title: "EM bitcoin flow",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap gap-6 font-mono text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-[11px]", FLOW_IN),
						children: "Inflow"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 tabular-nums", FLOW_IN),
						children: em?.net.inflow ?? "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-[11px]", FLOW_OUT),
						children: "Outflow"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 tabular-nums", FLOW_OUT),
						children: em?.net.outflow ?? "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-[11px]", FLOW_FLAT),
						children: "Flat"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 tabular-nums", FLOW_FLAT),
						children: em?.net.flat ?? "—"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: (em?.regions ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-t border-line/60 pt-3 first:border-0 first:pt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3 font-mono text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: flowClass(r.flow),
								children: r.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("uppercase tracking-wide", flowClass(r.flow)),
								children: r.flow
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("tabular-nums", flowClass(r.flow)),
								children: fmtPrem(r.premiumPct)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-1 font-mono text-xs",
						children: r.venues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate text-muted",
								children: v.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("tabular-nums", premClass(v.premiumPct)),
								children: fmtPrem(v.premiumPct)
							})]
						}, v.id))
					})]
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "INFLOW = local BTC or USDT trading rich vs USD (demand / capital into bitcoin). OUTFLOW = trading cheap (selling). Spot: BitOasis AED, Luno ZAR/NGN, Mercado BRL, Buda CLP/COP vs Coinbase. P2P: OKX USDT vs open.er-api FX; Russia is Rapira USDT/RUB. Threshold ±1.5%. Binance is not used."
			})
		]
	});
}
function Quotes({ snap }) {
	const rows = snap?.quotes ?? [];
	const [open, setOpen] = (0, import_react.useState)(false);
	const top = rows.slice(0, 5);
	const rest = rows.slice(5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		kicker: "Sector / proxy",
		title: "Public quotes",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteList, { rows: top }), rest.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			"aria-expanded": open,
			className: "mt-2 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-sm text-high",
				children: [
					"Top 5 shown · ",
					rows.length,
					" quotes"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 font-mono text-[11px] expand-ctl",
				children: open ? "collapse" : `expand ${rest.length} more`
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteList, { rows: rest }) : null] }) : null]
	});
}
function QuoteList({ rows }) {
	const gold = new Set(GOLD_TICKERS);
	const silver = new Set(SILVER_TICKERS);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2 font-mono text-sm",
		children: rows.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center justify-between gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: silver.has(q.symbol) ? "silver-css" : gold.has(q.symbol) ? "gold-css" : "coinbase-orange",
					children: q.symbol
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: q.last != null ? money(q.last, 2) : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("flex items-center gap-0.5 tabular-nums", (q.changePct ?? 0) >= 0 ? "text-up" : "text-down"),
					children: [(q.changePct ?? 0) >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "size-3" }), q.changePct != null ? `${q.changePct.toFixed(2)}%` : "—"]
				})
			]
		}, q.symbol))
	});
}
function WirePanel({ snap }) {
	const filings = snap?.filings ?? [];
	const headlines = snap?.headlines ?? [];
	const preds = snap?.predictionMarkets ?? [];
	const [open, setOpen] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		kicker: "EDGAR · Free wire",
		title: "Filings & headlines",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			"aria-expanded": open,
			className: "flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-sm text-fg",
				children: [
					filings.length,
					" filings · ",
					headlines.length,
					" wire · ",
					preds.length,
					" BTC bets"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 font-mono text-[11px] expand-ctl",
				children: open ? "collapse" : "expand"
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid gap-6 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase",
				children: "SEC"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm",
				children: [filings.slice(0, 6).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[11px] text-muted",
					children: [
						f.name,
						" · ",
						f.form,
						" · ",
						f.filed
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate",
					children: f.title
				})] }, `${f.cik}-${f.filed}-${i}`)), !filings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: "No filings this cycle."
				}) : null]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase",
				children: "Wire"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm",
				children: [headlines.slice(0, 6).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-muted",
					children: h.source
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: h.url,
					target: "_blank",
					rel: "noreferrer",
					className: "line-clamp-2 hover:underline",
					children: h.title
				})] }, h.url)), !headlines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: "No headlines this cycle."
				}) : null]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PredictionTape, { rows: preds })] }) : null]
	});
}
function volShort(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
	if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}k`;
	return `$${n.toFixed(0)}`;
}
function PredictionTape({ rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pred-tape mt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex flex-wrap items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.12em] text-muted uppercase",
				children: "BTC prediction markets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Polymarket · Kalshi · display only · this host never takes bets"
			})]
		}), rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [
				"ath",
				"monthly",
				"other"
			].map((kind) => {
				const list = rows.filter((r) => r.kind === kind);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pred-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pred-col-h",
						children: PRED_KIND_LABEL[kind]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2.5 text-sm",
						children: list.length ? list.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "pred-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: r.url,
									target: "_blank",
									rel: "noreferrer",
									className: "pred-title hover:underline",
									children: r.strike ? `${r.strike}` : r.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-[11px] text-muted",
									children: [
										r.venue,
										" · ",
										volShort(r.volumeUsd)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pred-yes",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pred-yes-track",
										"aria-hidden": true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pred-yes-fill",
											style: { width: `${Math.min(100, Math.max(0, r.yesPct ?? 0))}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: cn("pred-yes-pct", (r.yesPct ?? 0) >= 50 ? "text-high" : "text-muted"),
										children: r.yesPct != null ? `${r.yesPct.toFixed(r.yesPct >= 10 ? 0 : 1)}% Yes` : "—"
									})]
								})
							]
						}, r.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-muted",
							children: [
								"No ",
								PRED_KIND_LABEL[kind].toLowerCase(),
								" markets this cycle."
							]
						})
					})]
				}, kind);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No BTC prediction markets this cycle."
		})]
	});
}
function CoinbasePanel({ call }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "Execution",
		title: "Coinbase for Agents",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: [
					"Helios never holds your CDP secret. Preview here, then run the CLI or connect MCP at",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-fg underline-offset-2 hover:underline",
						href: "https://agents.coinbase.com/mcp",
						target: "_blank",
						rel: "noreferrer",
						children: "agents.coinbase.com/mcp"
					}),
					". Docs:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-fg underline-offset-2 hover:underline",
						href: "https://docs.cdp.coinbase.com/coinbase-for-agents/overview",
						target: "_blank",
						rel: "noreferrer",
						children: "Coinbase for Agents"
					}),
					"."
				]
			}),
			call ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 overflow-x-auto rounded-md bg-bg px-3 py-2 font-mono text-[11px]",
				children: JSON.stringify(call.preview, null, 2)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-center gap-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }),
					" Isolated portfolio · Trade + Transfer · always",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "orders preview"
					}),
					" before create."
				]
			})
		]
	});
}
function Home() {
	const { marketing } = Route.useRouteContext();
	const [hostPub, setHostPub] = (0, import_react.useState)(marketing);
	(0, import_react.useEffect)(() => {
		const h = window.location.hostname.toLowerCase();
		setHostPub(h === "s1r1us.ai" || h === "www.s1r1us.ai");
	}, []);
	if (marketing || hostPub) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(S1r1usSite, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskApp, {});
}
//#endregion
export { Home as component };
