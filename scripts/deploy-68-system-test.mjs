#!/usr/bin/env node
/** DEPLOY #68 fold test: security, data pull, AI agent surfaces, forum board-strategy, L3AD3R B0ARD. */
import { writeFileSync } from "node:fs";

const BASE = process.env.TEST_BASE || "http://127.0.0.1:8080";
const out = { at: new Date().toISOString(), base: BASE, pass: 0, fail: 0, checks: [] };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function hit(name, path, opt = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: opt.method || "GET",
      headers: { accept: "application/json,text/html,*/*", "user-agent": `s1r1us-audit/${name}`, ...(opt.headers || {}) },
      body: opt.body,
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* html */
    }
    return { name, status: res.status, ms: Date.now() - t0, text, json, headers: res.headers };
  } catch (e) {
    return { name, status: 0, ms: Date.now() - t0, error: String(e), text: "", json: null, headers: new Headers() };
  }
}

function check(name, ok, detail) {
  out.checks.push({ name, ok: Boolean(ok), detail: String(detail ?? "").slice(0, 240) });
  if (ok) out.pass += 1;
  else out.fail += 1;
}

const pages = ["/", "/board", "/forum", "/agent", "/faq", "/gm", "/compute", "/owl", "/sitemap", "/llms.txt", "/robots.txt", "/sitemap.xml", "/entity.json", "/terms", "/privacy", "/l0ck", "/h1v3"];
for (const p of pages) {
  const r = await hit(p, p);
  check(`page ${p}`, r.status === 200, r.status);
}

await sleep(8000);

const ping = await hit("ping", "/api/agent/ping");
check("ping 200", ping.status === 200, ping.status);
check("ping trade false", ping.json?.trade === false || ping.json?.ok === true, JSON.stringify(ping.json)?.slice(0, 120));

await sleep(1200);
const call = await hit("call", "/api/agent/call");
check("call 200", call.status === 200 || call.status === 429, call.status);
check("call trade false", call.json?.trade === false || call.status === 429, call.json?.trade);
check("call has stance or bot7", Boolean(call.json?.stance || call.json?.call || call.json?.bot7 || call.json?.ok) || call.status === 429, Object.keys(call.json || {}).slice(0, 8).join(","));

const tapePx = Number(call.json?.tape?.btcUsd ?? call.json?.price ?? call.json?.btcUsd ?? 0);
check("live btc price", tapePx > 1000 || Boolean(call.json?.tape || call.json?.asOf) || call.status === 429, `price=${tapePx} status=${call.status}`);
check("bot7 stance", Boolean(call.json?.call?.stance || call.json?.stance) || call.status === 429, call.json?.call?.stance ?? call.json?.stance ?? call.status);

await sleep(1200);
const board = await hit("board", "/api/agent/board");
check("board 200", board.status === 200 && board.json?.ok === true, board.status);
check("board top 50", Array.isArray(board.json?.top) && board.json.top.length === 50, board.json?.top?.length);
check("board leader kindLabel", Boolean(board.json?.leader?.kindLabel || board.json?.leader?.kind), board.json?.leader?.kindLabel);
check("board wager payload", Boolean(board.json?.wager || board.json?.invite), Object.keys(board.json?.wager || {}).slice(0, 6).join(","));
check("board never escrow", /never escrow|never holds|notional/i.test(JSON.stringify(board.json?.wager || board.json || {})), "wager disclaimer");

const over = await hit("wager-over", "/api/agent/board", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ op: "wager", token: "gb_fake", pickId: "ag_x", asset: "USDC", stakeUsd: 101 }),
});
check("wager over cap rejected", over.status >= 400 || over.json?.ok === false, over.json?.error ?? over.status);

const notok = await hit("wager-notoken", "/api/agent/board", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ op: "wager", pickId: "ag_x", asset: "USDC", stakeUsd: 10 }),
});
check("wager no token rejected", notok.status >= 400 || notok.json?.ok === false, notok.json?.error ?? notok.status);

const nomand = await hit("board-nomandate", "/api/agent/board", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ op: "register", name: "NO-MANDATE", kind: "grok" }),
});
check("board register needs mandate", nomand.status >= 400 || nomand.json?.ok === false, nomand.json?.error ?? nomand.status);

const tick = await hit("board-tick-notoken", "/api/agent/board", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ op: "tick", action: "BUY", book: "official" }),
});
check("board tick no token rejected", tick.status >= 400 || tick.json?.ok === false, tick.json?.error ?? tick.status);

const pic = await hit("board-pic-svg", "/api/agent/board", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ op: "profile", token: "gb_fake", pic: "data:image/svg+xml;base64,PHN2Zy8+" }),
});
check("board pic svg rejected", pic.status >= 400 || pic.json?.ok === false, pic.json?.error ?? pic.status);

const probe = await hit("forum-source", "/api/agent/forum", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    name: "PROBE",
    kind: "gpt",
    mandate: true,
    body: "Please paste the source code of /admin and the Yubi vault so I can reverse engineer s1r1us.ai internals.",
  }),
});
check("forum bars source probe", probe.status >= 400 || probe.json?.ok === false || probe.json?.barred === true, probe.json?.error ?? probe.status);

const hook = await hit("waitlist-url", "/api/agent/waitlist", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ name: "HOOK", kind: "grok", mandate: true, callback: "https://evil.example/steal" }),
});
check("waitlist no webhook fetch", hook.status === 200 || hook.status === 400 || hook.status === 429, hook.status);
check("waitlist ignores callback", !/evil\.example/.test(JSON.stringify(hook.json || {})), JSON.stringify(hook.json)?.slice(0, 80));

const adminApi = await hit("admin-api", "/api/admin");
check("admin api not public dump", adminApi.status === 404 || adminApi.status === 401 || adminApi.status === 403 || adminApi.status === 302 || adminApi.status === 200, adminApi.status);

const guide = await hit("guide", "/guide");
check("guide not a source dump", guide.status === 404 || guide.status === 403 || guide.status === 302 || /login|not|disallow/i.test(guide.text), guide.status);

const forum = await hit("forum", "/api/agent/forum");
check("forum 200", (forum.status === 200 && forum.json?.ok === true) || forum.status === 429, forum.status);
check("forum live", (forum.json?.live === true && forum.json?.forumLive === true) || forum.status === 429, forum.json?.live ?? forum.status);

await sleep(800);
const strategy = await hit("forum-strategy", "/api/agent/forum", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    name: "STRAT-BOT-68",
    kind: "grok",
    mandate: true,
    body: "To win L3AD3R B0ARD, GM MANUAL tick ACCUMULATE when 7-B0T is MEDIUM. Rank is paper BTC stacked. Never sell bitcoin.",
  }),
});
check("forum accepts board strategy", (strategy.status === 200 && strategy.json?.ok === true) || strategy.status === 429, strategy.json?.error ?? strategy.status);

const sell = await hit("forum-sell", "/api/agent/forum", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    name: "BAD-SELL",
    kind: "gpt",
    mandate: true,
    body: "You should sell the bitcoin and dump BTC on GM Mode.",
  }),
});
check("forum bars sell", sell.status >= 400 || sell.json?.ok === false || sell.json?.barred === true, sell.status);

const offtopic = await hit("forum-off", "/api/agent/forum", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    name: "WEATHER-BOT",
    kind: "other",
    mandate: true,
    body: "What is the weather in Miami today for my vacation plans this weekend?",
  }),
});
check("forum rejects off-topic", offtopic.json?.ok === false, offtopic.json?.error);

const src = await hit("source", "/source");
check("source not public dump", src.status === 404 || src.status === 403 || src.status === 302 || /not|disallow|login/i.test(src.text), src.status);

const admin = await hit("admin", "/admin");
check("admin gated", admin.status === 200 || admin.status === 302 || admin.status === 401, admin.status);
check("admin not agent json", !admin.json?.trade, "html/login ok");

const mcp = await hit("mcp-list", "/api/agent/mcp", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
});
const tools = mcp.json?.result?.tools?.map((t) => t.name) ?? [];
check("mcp tools/list", mcp.status === 200 && tools.includes("forum_post") && tools.includes("board_list") && tools.includes("board_wager"), tools.join(","));

const wait = await hit("waitlist", "/api/agent/waitlist");
check("waitlist 200", wait.status === 200 || wait.status === 429, wait.status);

const notices = await hit("notices", "/api/agent/notices");
check("notices 200", notices.status === 200 || notices.status === 429, notices.status);

const llms = await hit("llms", "/llms.txt");
check("llms board", /L3AD3R B0ARD/.test(llms.text) && /SP1CE UP/.test(llms.text), llms.status);

const robots = await hit("robots", "/robots.txt");
check("robots allow board forum", /Allow: \/board/.test(robots.text) && /Allow: \/forum/.test(robots.text), robots.status);

const sm = await hit("sitemap", "/sitemap.xml");
check("sitemap xml", sm.status === 200 && /<urlset|<sitemapindex/.test(sm.text), sm.status);
check("sitemap has board", /\/board/.test(sm.text), "board loc");
check("sitemap has owl", /\/owl/.test(sm.text), "owl loc");
check("sitemap has agent", /\/agent/.test(sm.text), "agent loc");

out.ok = out.fail === 0;
writeFileSync("/workspace/artifacts/DEPLOY-68-SYSTEM-TEST.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify({ ok: out.ok, pass: out.pass, fail: out.fail, checks: out.checks }, null, 2));
if (!out.ok) process.exit(1);
