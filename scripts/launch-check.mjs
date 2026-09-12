#!/usr/bin/env node
/** One system check for LAUNCH BUILD DEPLOY #58. Tape only — no practice fills, no live trades. */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const FEEDS = [
  ["coinbase", "https://api.exchange.coinbase.com/products/BTC-USD/ticker"],
  ["okx", "https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT"],
  ["bitfinex", "https://api-pub.bitfinex.com/v2/ticker/tBTCUSD"],
  ["mempool", "https://mempool.space/api/v1/fees/recommended"],
  ["fng", "https://api.alternative.me/fng/?limit=1"],
];

const PAGES = ["/", "/login", "/gm", "/f33d", "/faq", "/terms", "/labs", "/helios", "/sitemap", "/heliosbot", "/agent", "/api/agent", "/api/agent/call"];

function ok(name, pass, extra = "") {
  console.log(`${pass ? "OK " : "FAIL"} ${name}${extra ? " " + extra : ""}`);
  return pass;
}

async function probe(name, url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { "user-agent": "s1r1us-launch-58" } });
    return ok(name, res.ok, `${res.status} ${Date.now() - t0}ms`);
  } catch (e) {
    return ok(name, false, e instanceof Error ? e.message : "err");
  }
}

function read(path) {
  return readFileSync(path, "utf8");
}

const secretRe =
  /(sk-[A-Za-z0-9]{20,}|xai-[A-Za-z0-9]{20,}|BEGIN (RSA |OPENSSH )?PRIVATE KEY|CDP_API_KEY|api[_-]?secret\s*[:=]\s*['\"][^'\"]{12,})/i;

function secretScan() {
  const r = spawnSync(
    "grep",
    [
      "-R",
      "-I",
      "-n",
      "-E",
      secretRe.source,
      "--exclude=launch-check.mjs",
      "src",
      "scripts",
      ".do",
      "Dockerfile",
      "LAUNCH.md",
      "DEPLOY.md",
      "README.md",
    ],
    { encoding: "utf8" },
  );
  const hits = (r.stdout || "").trim();
  if (!hits) return ok("secret-scan", true, "clean");
  console.log(hits.slice(0, 800));
  return ok("secret-scan", false, "possible secret");
}

const freezeSrc = read("src/lib/launch/build.ts");
const practiceSrc = read("src/lib/desk/practice.ts");
const results = [];
results.push(secretScan());
results.push(ok("launch-name", freezeSrc.includes('LAUNCH_BUILD = "LAUNCH BUILD DEPLOY #58"')));
results.push(ok("freeze", /export const LAUNCH_FREEZE = true/.test(freezeSrc)));
results.push(ok("live-trades", /export const LIVE_UNLOCKED = false/.test(practiceSrc), "LIVE_UNLOCKED=false"));
results.push(ok("no-live-flag", /export const LAUNCH_LIVE_TRADES = false/.test(freezeSrc)));
results.push(ok("path-a", /export const PATH_A_LOCKED = true/.test(read("src/lib/launch/model.ts"))));
results.push(ok("tab-feed", /export const TAB_FEED = "F33D H0ST1Ng"/.test(read("src/lib/brand.ts"))));

for (const [name, url] of FEEDS) results.push(await probe(name, url));
for (const path of PAGES) results.push(await probe(`page ${path}`, `http://127.0.0.1:8080${path}`));

const fail = results.filter((x) => !x).length;
console.log(fail ? `\nLAUNCH #58 CHECK FAIL ${fail}` : "\nLAUNCH #58 CHECK PASS");
process.exit(fail ? 1 : 0);
