// Front proxy: request-target normalization and upstream Location rewriting.
import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { after, before, test } from "node:test";
import { normalizeRequestTarget, safeLocation, startFrontDoor } from "./do-start.mjs";

const BAD = /127\.0\.0\.1|localhost|:8081|\[::1\]|0\.0\.0\.0|^\/\/|^\/\\|^[a-z][a-z0-9+.-]*:/i;

let upstream;
let front;
let frontPort;

before(async () => {
  // Stub upstream that mimics Nitro: redirects to an absolute URL built from the Host header.
  upstream = http.createServer((req, res) => {
    const u = new URL(req.url, "http://placeholder.invalid");
    if (u.pathname === "/oauth") {
      res.writeHead(302, { Location: "https://x.com/i/oauth2/authorize?state=1" });
      return res.end();
    }
    res.writeHead(308, { Location: `http://${req.headers.host}${req.url}` });
    res.end();
  });
  await new Promise((r) => upstream.listen(0, "127.0.0.1", r));
  front = startFrontDoor({ port: 0, host: "127.0.0.1", nitroPort: upstream.address().port });
  await new Promise((r) => (front.listening ? r() : front.once("listening", r)));
  frontPort = front.address().port;
});

after(() => {
  front.close();
  upstream.close();
});

// Raw request so the exact request-target bytes reach the server.
function raw(target) {
  return new Promise((resolve, reject) => {
    const s = net.connect(frontPort, "127.0.0.1", () =>
      s.write(`GET ${target} HTTP/1.1\r\nHost: s1r1us.ai\r\nConnection: close\r\n\r\n`),
    );
    let d = "";
    s.on("data", (c) => (d += c));
    s.on("end", () => {
      const status = Number(d.slice(9, 12));
      const loc = (/\r\nlocation: ([^\r\n]*)/i.exec(d) || [])[1] ?? null;
      resolve({ status, loc });
    });
    s.on("error", reject);
  });
}

const variants = [
  "/%5cevil.com",
  "/%5Cevil.com",
  "/%5C%5Cevil.com",
  "/\\evil.com",
  "/\\\\evil.com",
  "/%2f%5cevil.com",
  "//evil.com",
  "///evil.com",
  "//evil.com/zz",
  "/%5c%5cevil.com/zz",
  "/%5Cevil.com?q=1",
  "/zz/%5cevil.com",
  "http://evil.com/zz",
  "http://evil.com//evil2.com",
  "http://127.0.0.1:8081/zz",
  "/x%0d%0aLocation:%20http://evil.com",
  "/./evil.com",
  "/a/../evil.com",
  "/%2e%2e/evil.com",
  "/faq/..%5cevil.com",
  "/nope",
];

for (const v of variants) {
  test(`no internal or foreign Location for ${JSON.stringify(v)}`, async () => {
    const { status, loc } = await raw(v);
    assert.ok(status >= 200 && status < 600, `status ${status}`);
    if (loc !== null) assert.doesNotMatch(loc, BAD, `Location ${loc}`);
  });
}

test("backslashes, raw or encoded, are rejected with 400", async () => {
  for (const v of ["/%5cevil.com", "/%5C%5Cevil.com", "/\\evil.com", "/%2f%5cevil.com", "/zz/%5cevil.com"]) {
    assert.equal((await raw(v)).status, 400, v);
  }
});

test("repeated leading slashes 308 to a single-slash same-origin path", async () => {
  assert.deepEqual(await raw("//evil.com/zz"), { status: 308, loc: "/evil.com/zz" });
  assert.deepEqual(await raw("///evil.com?a=1"), { status: 308, loc: "/evil.com?a=1" });
  assert.deepEqual(await raw("http://evil.com//evil2.com"), { status: 308, loc: "/evil2.com" });
});

test("upstream internal-origin Location becomes a relative path", async () => {
  assert.deepEqual(await raw("/nope"), { status: 308, loc: "/nope" });
  assert.deepEqual(await raw("/api/x?y=1"), { status: 308, loc: "/api/x?y=1" });
});

test("upstream external Location (OAuth) passes through unchanged", async () => {
  assert.deepEqual(await raw("/oauth"), { status: 302, loc: "https://x.com/i/oauth2/authorize?state=1" });
});

test("#226 no-slash 308s are unchanged", async () => {
  assert.deepEqual(await raw("/hindu-teachings"), { status: 308, loc: "/hindu-teachings/" });
  assert.deepEqual(await raw("/faq"), { status: 308, loc: "/faq/" });
  assert.deepEqual(await raw("/dmt?x=1"), { status: 308, loc: "/dmt/?x=1" });
  assert.equal((await raw("/hindu-teachings/")).status, 200);
});

test("safeLocation unit cases", () => {
  assert.equal(safeLocation("http://127.0.0.1:8081/evil.com"), "/evil.com");
  assert.equal(safeLocation("http://localhost:8081//evil.com?a=1#h"), "/evil.com?a=1#h");
  assert.equal(safeLocation("http://[::1]:8081/x"), "/x");
  assert.equal(safeLocation("//evil.com/x"), "/evil.com/x");
  assert.equal(safeLocation("/\\evil.com"), "/evil.com");
  assert.equal(safeLocation("/ok\r\nSet-Cookie: a=b"), "/okSet-Cookie: a=b");
  assert.equal(safeLocation("https://x.com/a"), "https://x.com/a");
  assert.equal(safeLocation("/faq/"), "/faq/");
  assert.equal(safeLocation("relative"), "relative");
});

test("normalizeRequestTarget unit cases", () => {
  assert.deepEqual(normalizeRequestTarget("/faq/?q=1"), { url: "/faq/?q=1" });
  assert.deepEqual(normalizeRequestTarget("/search?q=%5c"), { url: "/search?q=%5c" });
  assert.deepEqual(normalizeRequestTarget("/a%5Cb"), { status: 400 });
  assert.deepEqual(normalizeRequestTarget("/a\r\nb"), { status: 400 });
  assert.deepEqual(normalizeRequestTarget("*"), { status: 400 });
  assert.deepEqual(normalizeRequestTarget("http://evil.com/zz?a=1"), { url: "/zz?a=1" });
  assert.deepEqual(normalizeRequestTarget("//x"), { status: 308, location: "/x" });
});
