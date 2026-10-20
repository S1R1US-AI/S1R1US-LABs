// Drop into S1R1US-LABs as scripts/ai-building-systems-econ.test.mjs (picked up by `npm test`: node --test 'scripts/**/*.test.mjs').
// Offline: no network. Checks the drop-in files, data shape, honesty labels, CSP-safety and the debt-rate math.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const ECON = "front-door-static/ai-building-systems/econ/";
const read = (p) => readFileSync(new URL(p, root), "utf8");
const json = (p) => JSON.parse(read(p));

test("econ drop-in files exist", () => {
  for (const f of ["debt-clock.js", "econ-widgets.js", "econ-widgets.css", "data/snapshot.json", "data/foreign-holders.json", "data/wages.json", "data/autos-unions.json", "data/h1b-abuse.json", "data/sources.json"])
    assert.ok(existsSync(new URL(ECON + f, root)), f);
});

test("debt snapshot is sane and labelled", () => {
  const s = json(ECON + "data/snapshot.json");
  assert.ok(s.total > 3e13 && s.total < 1e14, "total in dollars");
  assert.match(s.record_date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(s.rate_per_second > 0 && s.rate_per_second < 1e6);
  assert.ok(s.rate_window.records >= 20);
  const js = read(ECON + "debt-clock.js");
  assert.ok(js.includes("Live estimate by S1R1US.ai based on official U.S. Treasury data. Not an official count."));
  assert.ok(js.includes("https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/"));
  assert.ok(js.includes("prefers-reduced-motion"));
});

test("debt rate math (OLS) matches a known line", async () => {
  const { computeDebtSnapshot } = await import(new URL("refresh-econ-data.mjs", import.meta.url));
  const recs = [0, 1, 2, 3].map((d) => ({ record_date: `2026-01-0${d + 1}`, tot_pub_debt_out_amt: String(1e13 + d * 86400 * 50000) }));
  assert.equal(computeDebtSnapshot(recs).rate_per_second, 50000);
});

test("foreign holders: country data starts 2000, totals start 1971, top 10 sorted", () => {
  const f = json(ECON + "data/foreign-holders.json");
  assert.match(f.country_start, /^2000-/);
  assert.match(f.total_foreign.data[0][0], /^1971-/);
  for (const m of f.months) { assert.ok(m.top.length >= 10); for (let i = 1; i < m.top.length; i++) assert.ok(m.top[i - 1][1] >= m.top[i][1]); }
  assert.ok(f.notes.some((n) => n.includes("Country-level data begins 2000")));
});

test("every widget section carries sources and the correlation label", () => {
  const S = json(ECON + "data/sources.json");
  for (const k of ["debt", "holders", "manufacturing", "autos", "china_trade", "china_shock", "foreign_born", "construction_wages", "electricians", "immigration_wages", "h1b", "h2b", "unions", "squeeze"]) {
    assert.ok(Array.isArray(S[k]) && S[k].some((s) => s.k === "gov"), k + " has an official source");
    for (const s of S[k]) assert.match(s.url, /^https?:\/\//);
  }
  const js = read(ECON + "econ-widgets.js");
  assert.ok(js.includes("Correlation, not proof of cause."));
});

test("components are CSP-friendly (no eval, no innerHTML, no inline style writes)", () => {
  for (const f of ["debt-clock.js", "econ-widgets.js"]) {
    const js = read(ECON + f);
    assert.ok(!/\beval\(|new Function|innerHTML|\.style\.[a-z]+\s*=|setAttribute\(\s*["']style/.test(js), f);
  }
});
