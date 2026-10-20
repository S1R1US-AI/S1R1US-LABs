#!/usr/bin/env node
// S1R1US.ai econ widgets: build-time data refresh (no dependencies, Node 20+).
// Writes JSON next to the components so the page works with zero client-side
// third-party requests. If a source fails, the previous JSON is kept and the
// script exits 0 with a warning (build must never break on an upstream outage).
//
// Usage:  node refresh-data.mjs [outDir]
//   outDir defaults to ../data relative to this script.
//
// Sources (all public / official):
//   U.S. Treasury Fiscal Data  - Debt to the Penny (public domain)
//   U.S. Treasury TIC          - Major Foreign Holders (slt_table5.txt + mfhhis01.txt)
//   FRED / ALFRED (St. Louis Fed) - CPIAUCSL, CES0500000003, AHETPI, LES1252881600Q,
//                                   GFDEBTN, GFDEGDQ188S, PRS85006173, MANEMP,
//                                   CES3133600101, FDHBFIN
//   BLS                        - LU (union membership) flat file, OEWS API (electricians)
//   U.S. Census                - Trade in Goods with China (c5700)
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(process.argv[2] || join(HERE, "..", "data"));
const UA = "S1R1US.ai data refresh (build script; contact via s1r1us.ai)";
const warn = (...a) => console.warn("[refresh-data] WARN", ...a);
const log = (...a) => console.log("[refresh-data]", ...a);

async function get(url, { timeout = 45000, method = "GET", body, headers = {} } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(url, { method, body, signal: ctl.signal, headers: { "User-Agent": UA, ...headers } });
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return await r.text();
  } finally {
    clearTimeout(t);
  }
}
const save = (name, obj) => {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, name), JSON.stringify(obj, null, 1) + "\n");
  log("wrote", name);
};
const prev = (name) => (existsSync(join(OUT, name)) ? JSON.parse(readFileSync(join(OUT, name), "utf8")) : null);
const nowIso = () => new Date().toISOString();

/* ------------------------------------------------------------------ debt */
export function computeDebtSnapshot(records, windowDays = 90) {
  // records: [{record_date:"YYYY-MM-DD", tot_pub_debt_out_amt:"..."}] any order
  const rows = records
    .map((r) => ({ d: r.record_date, t: Date.parse(r.record_date + "T00:00:00Z") / 1000, v: Number(r.tot_pub_debt_out_amt) }))
    .filter((r) => Number.isFinite(r.v))
    .sort((a, b) => a.t - b.t);
  const last = rows[rows.length - 1];
  const win = rows.filter((r) => r.t >= last.t - windowDays * 86400);
  // Ordinary least squares slope of debt vs time (dollars per second).
  const n = win.length;
  const mt = win.reduce((s, r) => s + r.t, 0) / n;
  const mv = win.reduce((s, r) => s + r.v, 0) / n;
  let num = 0, den = 0;
  for (const r of win) { num += (r.t - mt) * (r.v - mv); den += (r.t - mt) ** 2; }
  const slope = num / den;
  const first = win[0];
  const endpoint = (last.v - first.v) / (last.t - first.t);
  return {
    total: last.v,
    record_date: last.d,
    // Treasury publishes the figure as of the END of the record date (close of business).
    // We anchor the live estimate at 00:00 UTC on the following day.
    anchor_utc: new Date((last.t + 86400) * 1000).toISOString(),
    rate_per_second: Math.round(slope * 100) / 100,
    rate_method: `OLS linear fit of tot_pub_debt_out_amt vs time over the ${n} daily records from ${first.d} to ${last.d} (last ${windowDays} calendar days)`,
    rate_window: { from: first.d, to: last.d, records: n, days: windowDays },
    rate_endpoint_per_second: Math.round(endpoint * 100) / 100,
    source: "U.S. Department of the Treasury, Fiscal Data, Debt to the Penny (public domain)",
    source_url: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/",
    api_url: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny",
    generated_utc: nowIso(),
  };
}
async function debt() {
  const url = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?fields=record_date,tot_pub_debt_out_amt&sort=-record_date&page[size]=100";
  const j = JSON.parse(await get(url));
  const snap = computeDebtSnapshot(j.data, 90);
  save("snapshot.json", snap);
  return snap;
}

/* ------------------------------------------------------------- FRED/ALFRED */
async function fred(id) {
  // ALFRED serves the same series as FRED (St. Louis Fed); the latest-vintage column is used.
  const csv = await get(`https://alfred.stlouisfed.org/graph/alfredgraph.csv?id=${id}`);
  const lines = csv.trim().split(/\r?\n/).slice(1);
  return lines
    .map((l) => l.split(","))
    .filter((p) => p[1] !== "" && p[1] !== "." && !isNaN(Number(p[1])))
    .map((p) => [p[0].slice(0, 7), Number(p[1])]);
}
const since = (s, ym) => s.filter(([d]) => d >= ym);

/* -------------------------------------------------------------------- TIC */
const AGG = /total|all other|oil exporters|carib|asian fin|of which|t-bills|t-bonds|treasury bills|for\. official|foreign official|memo|unknown|international|^country$|^$/i;
const MON = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
function cleanName(s) {
  let n = s.replace(/"/g, "").replace(/\s+\d+\/\s*$/, "").replace(/\s+/g, " ").trim();
  const map = { "Korea, South": "South Korea", Korea: "South Korea", "China, Mainland": "China (Mainland)" };
  return map[n] || n;
}
export function parseHistorical(txt) {
  const L = txt.split(/\r?\n/).map((l) => l.split("\t"));
  const out = {}; // ym -> {country: value}
  const totals = {};
  for (let i = 1; i < L.length; i++) {
    if ((L[i][0] || "").trim() !== "Country") continue;
    const mon = L[i - 1], yr = L[i], up2 = L[i - 2] || [];
    const cols = []; // [colIndex, "YYYY-MM", rowOffset]
    const seen = new Set();
    for (let c = 1; c < Math.max(yr.length, mon.length); c++) {
      const y = (yr[c] || "").trim(), m = (mon[c] || "").trim();
      let ym = null, off = 0;
      if (/^\d{4}$/.test(y) && MON[m]) ym = `${y}-${MON[m]}`;
      // 2002-2011 blocks carry January in a 13th column whose header sits one row
      // higher ("Jan" / year / "------") and whose values are shifted up one row.
      else if (/^-+$/.test(y) && /^\d{4}$/.test(m) && MON[(up2[c] || "").trim()]) { ym = `${m}-${MON[(up2[c] || "").trim()]}`; off = -1; }
      if (!ym || seen.has(ym)) continue; // series-break duplicate: keep the first (newer series)
      seen.add(ym);
      cols.push([c, ym, off]);
    }
    for (let r = i + 1; r < L.length; r++) {
      const name = (L[r][0] || "").trim();
      if (/^Of which/i.test(name) || /^Department of the Treasury/i.test(name)) break;
      if (!name || /^-+$/.test(name)) continue;
      const clean = cleanName(name);
      for (const [c, ym, off] of cols) {
        const cell = ((L[r + off] || [])[c] || "").trim();
        const v = Number(cell);
        if (!Number.isFinite(v) || cell === "") continue;
        if (/^Grand Total/i.test(clean)) { totals[ym] = v; continue; }
        if (AGG.test(clean)) continue;
        (out[ym] ||= {})[clean] = v;
      }
      if (/^Grand Total/i.test(name)) break;
    }
  }
  return { byMonth: out, totals };
}
export function parseTable5(txt) {
  const L = txt.split(/\r?\n/).map((l) => l.split("\t"));
  const hdr = L.find((r) => (r[0] || "").trim() === "Country");
  const months = hdr.slice(1).map((s) => s.trim()).filter((s) => /^\d{4}-\d{2}$/.test(s));
  const out = {}, totals = {};
  for (const r of L) {
    const name = (r[0] || "").trim();
    if (!name || name === "Country") continue;
    const clean = cleanName(name);
    months.forEach((ym, k) => {
      const v = Number((r[k + 1] || "").trim());
      if (!Number.isFinite(v) || (r[k + 1] || "").trim() === "") return;
      if (/^Grand Total/i.test(clean)) totals[ym] = v;
      else if (!AGG.test(clean)) (out[ym] ||= {})[clean] = v;
    });
  }
  return { byMonth: out, totals, months };
}
async function foreignHolders() {
  const base = "https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/";
  const [hist, cur] = await Promise.all([get(base + "mfhhis01.txt"), get(base + "slt_table5.txt")]);
  const H = parseHistorical(hist), C = parseTable5(cur);
  const byMonth = { ...H.byMonth, ...C.byMonth }; // current table overrides (latest revisions)
  const totals = { ...H.totals, ...C.totals };
  const months = Object.keys(byMonth).sort();
  const series = months.map((ym) => {
    const top = Object.entries(byMonth[ym]).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return { m: ym, total: totals[ym] ?? null, top };
  });
  const fd = await fred("FDHBFIN");
  const total = since(fd, "1971-01");
  const obj = {
    title: "Who holds U.S. debt? Top 10 foreign holders",
    units: "billions of U.S. dollars, holdings at end of month",
    country_start: months[0],
    latest: months[months.length - 1],
    months: series,
    total_foreign: { id: "FDHBFIN", units: "billions of dollars, quarterly, end of period", series_start: fd[0][0], shown_from: total[0][0], data: total },
    notes: [
      "Country-level data begins 2000; earlier years show total foreign holdings only.",
      `TIC country series begins ${months[0]} (mfhhis01.txt). Where TIC re-based the series (series breaks), the newer series value is used.`,
      "Regional aggregates reported by TIC in early years (Oil Exporters, Caribbean Banking Centers) are excluded from the country ranking; 'Belgium-Luxembourg' is shown as reported.",
      `FRED FDHBFIN begins ${fd[0][0]} (quarterly); chart starts 1971 (Nixon closes the gold window, Aug 15 1971).`,
    ],
    sources: [
      { label: "U.S. Treasury, TIC Table 5: Major Foreign Holders of Treasury Securities", url: base + "slt_table5.html" },
      { label: "U.S. Treasury, TIC historical MFH (mfhhis01.txt)", url: base + "mfhhis01.txt" },
      { label: "FRED FDHBFIN, Federal Debt Held by Foreign and International Investors (source: U.S. Treasury / Federal Reserve)", url: "https://fred.stlouisfed.org/series/FDHBFIN" },
    ],
    generated_utc: nowIso(),
  };
  save("foreign-holders.json", obj);
  return obj;
}

/* ------------------------------------------------------------- wages etc. */
async function chinaTrade() {
  const html = await get("https://www.census.gov/foreign-trade/balance/c5700.html");
  const text = html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  const years = {};
  for (const m of text.matchAll(/TOTAL (\d{4}) ([\d,.-]+) ([\d,.-]+) ([\d,.-]+)/g)) {
    years[m[1]] = { exports: +m[2].replace(/,/g, ""), imports: +m[3].replace(/,/g, ""), balance: +m[4].replace(/,/g, "") };
  }
  // months reported in the latest (partial) year
  const yrs = Object.keys(years).sort();
  const latest = yrs[yrs.length - 1];
  const re = new RegExp(`(January|February|March|April|May|June|July|August|September|October|November|December) ${latest} `, "g");
  const monthsLatest = new Set([...text.matchAll(re)].map((m) => m[1]));
  return { units: "millions of U.S. dollars, nominal, not seasonally adjusted", years, latest_year: latest, latest_year_months: monthsLatest.size, source: "U.S. Census Bureau, Trade in Goods with China (c5700)", url: "https://www.census.gov/foreign-trade/balance/c5700.html" };
}

async function blsUnion() {
  const ids = {
    LUU0204899600: "All wage and salary workers",
    LUU0204906600: "Private wage and salary workers",
    LUU0204910500: "Private sector, construction industry",
    LUU0204910600: "Private sector, manufacturing industry",
    LUU0204909800: "Construction and extraction occupations",
  };
  const txt = await get("https://download.bls.gov/pub/time.series/lu/lu.data.1.AllData", { timeout: 90000 });
  const out = {};
  for (const line of txt.split(/\r?\n/)) {
    const p = line.split("\t");
    const id = (p[0] || "").trim();
    if (!ids[id] || (p[2] || "").trim() !== "A01" || +p[1] < 2000) continue;
    (out[id] ||= { id, label: ids[id], data: [] }).data.push([+p[1], +p[3]]);
  }
  return Object.values(out).map((s) => ({ ...s, data: s.data.sort((a, b) => a[0] - b[0]) }));
}

async function blsElectricians() {
  const body = JSON.stringify({ seriesid: ["OEUN000000000000047211101", "OEUN000000000000047211113", "OEUN000000000000047211104"] });
  const j = JSON.parse(await get("https://api.bls.gov/publicAPI/v1/timeseries/data/", { method: "POST", body, headers: { "Content-Type": "application/json" } }));
  const v = {};
  for (const s of j.Results.series) if (s.data[0]) v[s.seriesID.slice(-2)] = { year: +s.data[0].year, value: +s.data[0].value };
  return { year: v["01"].year, employment: v["01"].value, median_annual: v["13"].value, mean_annual: v["04"].value };
}

async function blsForeignBorn() {
  // Foreign-born share of employed workers in an occupation group =
  //   FBpct * FBemployed / (FBpct * FBemployed + NBpct * NBemployed)
  // FBpct/NBpct: % of foreign-/native-born employed in that occupation (annual series).
  // FB/NB employed: monthly levels, averaged over the months published (2025 = 11 months, Oct 2025 not collected).
  const ids = ["LNU02073395", "LNU02073413", "LNU02073567", "LNU02073654", "LNU02073576", "LNU02073663"];
  const raw = {};
  const endYear = new Date().getUTCFullYear();
  for (let y0 = 2005; y0 <= endYear; y0 += 10) {
    const body = JSON.stringify({ seriesid: ids, startyear: String(y0), endyear: String(Math.min(y0 + 9, endYear)) });
    const j = JSON.parse(await get("https://api.bls.gov/publicAPI/v1/timeseries/data/", { method: "POST", body, headers: { "Content-Type": "application/json" } }));
    if (j.status !== "REQUEST_SUCCEEDED") throw new Error("BLS API: " + j.status);
    for (const s of j.Results.series) for (const d of s.data) { const v = Number(d.value); if (Number.isFinite(v)) ((raw[s.seriesID] ||= {})[d.year] ||= {})[d.period] = v; }
  }
  const ann = (id, y) => {
    const r = (raw[id] || {})[y] || {};
    if (r.A01 != null) return { v: r.A01, n: 12 };
    const ms = Object.entries(r).filter(([p]) => /^M(0[1-9]|1[0-2])$/.test(p)).map(([, v]) => v);
    return ms.length >= 11 ? { v: ms.reduce((a, b) => a + b, 0) / ms.length, n: ms.length } : null;
  };
  const rows = [];
  for (let y = 2005; y <= endYear; y++) {
    const fb = ann("LNU02073395", y), nb = ann("LNU02073413", y);
    const c1 = ann("LNU02073567", y), c2 = ann("LNU02073654", y), p1 = ann("LNU02073576", y), p2 = ann("LNU02073663", y);
    if (!fb || !nb || !c1 || !c2 || !p1 || !p2) continue;
    const share = (a, b) => Math.round((1000 * a.v * fb.v) / (a.v * fb.v + b.v * nb.v)) / 10;
    rows.push([y, share(c1, c2), share(p1, p2), fb.n]);
  }
  return { units: "% of employed workers in the occupation group who are foreign-born (annual average, CPS)", columns: ["year", "construction_extraction", "production", "months_in_avg"], data: rows };
}

async function wages() {
  const ids = ["CPIAUCSL", "CES0500000003", "AHETPI", "LES1252881600Q", "GFDEBTN", "GFDEGDQ188S", "PRS85006173", "MANEMP", "CES3133600101", "CES2000000003", "CSUSHPINSA", "MSPUS", "MEHOINUSA646N", "MEHOINUSA672N", "POPTHM"];
  const got = {};
  for (const id of ids) got[id] = since(await fred(id), "2000-01");
  const china = await chinaTrade();
  save("wages.json", {
    title: "How debt, inflation and globalization hit American wages (2000-today)",
    start: "2000-01",
    series: {
      CPIAUCSL: { label: "CPI-U, all items (index 1982-84=100, SA, monthly)", data: got.CPIAUCSL },
      CES0500000003: { label: "Average hourly earnings, all private employees (USD, SA, monthly; starts 2006-03)", data: got.CES0500000003 },
      AHETPI: { label: "Average hourly earnings, production & nonsupervisory, private (USD, SA, monthly)", data: got.AHETPI },
      LES1252881600Q: { label: "Median usual weekly real earnings, full-time wage & salary workers 16+ (1982-84 CPI-adjusted dollars, quarterly)", data: got.LES1252881600Q },
      GFDEBTN: { label: "Federal debt: total public debt (millions USD, quarterly)", data: got.GFDEBTN },
      GFDEGDQ188S: { label: "Federal debt: total public debt as % of GDP (quarterly)", data: got.GFDEGDQ188S },
      PRS85006173: { label: "Nonfarm business sector: labor share (index 2017=100, quarterly)", data: got.PRS85006173 },
      MANEMP: { label: "All employees, manufacturing (thousands, SA, monthly)", data: got.MANEMP },
      CES3133600101: { label: "All employees, motor vehicles and parts (thousands, SA, monthly)", data: got.CES3133600101 },
      CES2000000003: { label: "Average hourly earnings, all employees, construction (USD, SA, monthly; starts 2006-03)", data: got.CES2000000003 },
      CSUSHPINSA: { label: "S&P CoreLogic Case-Shiller U.S. National Home Price Index (Jan 2000=100, NSA, monthly)", data: got.CSUSHPINSA },
      MSPUS: { label: "Median sales price of houses sold, U.S. (USD, quarterly; Census/HUD)", data: got.MSPUS },
      MEHOINUSA646N: { label: "Median household income, U.S. (current USD, annual; Census)", data: got.MEHOINUSA646N },
      MEHOINUSA672N: { label: "Real median household income, U.S. (constant USD, annual; Census)", data: got.MEHOINUSA672N },
      POPTHM: { label: "Population incl. armed forces overseas (thousands, monthly; BEA)", data: got.POPTHM },
    },
    china_trade: china,
    generated_utc: nowIso(),
  });
  let union = null, elec = null, fborn = null;
  try { union = await blsUnion(); } catch (e) { warn("BLS union", e.message); }
  try { fborn = await blsForeignBorn(); } catch (e) { warn("BLS foreign-born", e.message); }
  try { elec = await blsElectricians(); } catch (e) { warn("BLS OEWS", e.message); }
  const p = prev("autos-unions.json") || {};
  save("autos-unions.json", {
    union: union || p.union,
    foreign_born: fborn || p.foreign_born,
    electricians: {
      soc: "47-2111",
      baseline: { period: "November 2000", employment: 640260, median_annual: 40120, mean_annual: 42210, source: "BLS OES 2000 national estimates (national_2000_dl.xls, oes00nat.zip)", url: "https://www.bls.gov/oes/special-requests/oes00nat.zip" },
      latest: elec ? { period: `May ${elec.year}`, ...elec, source: "BLS OEWS national estimates via BLS Public Data API (OEUN0000000000000472111xx)", url: "https://www.bls.gov/oes/current/oes472111.htm" } : p.electricians?.latest,
    },
    generated_utc: nowIso(),
  });
}

/* ------------------------------------------------------------------ main */
export async function main(only = process.env.ONLY ? process.env.ONLY.split(",") : ["debt", "foreignHolders", "wages"]) {
  const jobs = { debt, foreignHolders, wages };
  let failed = 0;
  for (const k of only) {
    try { await jobs[k](); } catch (e) { failed++; warn(k, "failed, keeping previous JSON:", e.message); }
  }
  log(failed ? `done with ${failed} warning(s)` : "done");
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
