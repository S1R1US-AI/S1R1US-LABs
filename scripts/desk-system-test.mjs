#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:8080";
mkdirSync("/workspace/screenshots", { recursive: true });

const report = {
  at: new Date().toISOString(),
  pages: {},
  cycle: null,
  leaks: [],
  errors: [],
};

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const page = await ctx.newPage();
page.on("pageerror", (e) => report.errors.push(`pageerror ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") report.errors.push(`console ${m.text().slice(0, 180)}`);
});

async function visit(path, shot, waitMs = 8000) {
  const t0 = Date.now();
  const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 25000 });
  await page.waitForTimeout(waitMs);
  const text = (await page.locator("body").innerText()).slice(0, 4000);
  const title = await page.title();
  await page.screenshot({ path: `/workspace/screenshots/${shot}`, fullPage: false });
  const rec = {
    status: res?.status() ?? 0,
    url: page.url(),
    title,
    ms: Date.now() - t0,
    hasPrice: /\$\s?\d{2},\d{3}|\$\s?\d{5}/.test(text) || /BTC-USD[\s\S]{0,40}\$\s?[\d,]+/.test(text),
    snippet: text.replace(/\s+/g, " ").slice(0, 280),
  };
  report.pages[path] = rec;
  const leakWords = ["pump.fun", "bonding curve", "mint s1r1us", "TOKEN_LAUNCHED", "Phantom / Backpack"];
  for (const w of leakWords) {
    if (text.toLowerCase().includes(w.toLowerCase()) && (path === "/" || path === "/s1r1us" || path === "/helios")) {
      report.leaks.push({ path, word: w });
    }
  }
  return rec;
}

try {
  await visit("/", "desk-system-test.png", 9000);
  const priceEl = page.locator("text=/BTC-USD/").first();
  const priceVisible = await priceEl.isVisible().catch(() => false);
  report.pages["/"].priceLabel = priceVisible;

  const run = page.getByRole("button", { name: /refresh desk|run cycle/i });
  if (await run.count()) {
    const t0 = Date.now();
    await run.click();
    await page.waitForTimeout(5200);
    const spinnerGone = !(await page.locator("button[aria-label='Refresh desk'] svg.animate-spin").count().catch(() => 0));
    const body = await page.locator("body").innerText();
    const priceMatch = body.match(/\$\s?([\d,]{5,})/);
    report.cycle = {
      ms: Date.now() - t0,
      spinnerGone,
      price: priceMatch?.[1] ?? null,
      hung: /Pulling live tape|loading desk/i.test(body) && !priceMatch,
    };
    await page.screenshot({ path: "/workspace/screenshots/desk-cycle-after.png" });
  } else {
    report.cycle = { error: "Run cycle button not found" };
  }

  await visit("/s1r1us", "site-system-test.png", 7000);
  await visit("/helios", "lab-system-test.png", 5000);

  const sec = await page.goto(`${BASE}/security`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(1500);
  report.pages["/security"] = { status: sec?.status() ?? 0, url: page.url() };

  const nav = await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  const navText = await page.locator("nav").innerText().catch(() => "");
  report.pages["nav"] = {
    text: navText.replace(/\s+/g, " "),
    hasAccess: /\bAccess\b/.test(navText),
    hasPaper: /\bPaper\b/.test(navText),
    hasCoin: /\bCoin\b/.test(navText),
    hasDesk: /\bDesk\b/.test(navText),
  };
} catch (e) {
  report.errors.push(e instanceof Error ? e.stack ?? e.message : String(e));
} finally {
  await browser.close();
}

writeFileSync("/workspace/artifacts/system-test.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
const fail =
  report.leaks.length > 0 ||
  report.pages["/"]?.status !== 200 ||
  report.cycle?.hung === true ||
  report.pages["nav"]?.hasAccess ||
  report.pages["nav"]?.hasCoin;
process.exit(fail ? 2 : 0);
