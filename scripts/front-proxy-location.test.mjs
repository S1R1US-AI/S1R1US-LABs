// Front proxy: request-target normalization and upstream Location rewriting.
import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { after, before, test } from "node:test";
import { readFileSync } from "node:fs";
import {
  OWN_HOSTS,
  TRUSTED_REDIRECT_HOSTS,
  isInternalHost,
  normalizeRequestTarget,
  safeLocation,
  startFrontDoor,
} from "./do-start.mjs";

const BAD = /127\.0\.0\.1|localhost|:8081|\[::1\]|0\.0\.0\.0|^\/\/|^\/\\|^[a-z][a-z0-9+.-]*:/i;

let upstream;
let front;
let frontPort;

before(async () => {
  // Stub upstream that mimics Nitro: redirects to an absolute URL built from the Host header.
  upstream = http.createServer((req, res) => {
    const u = new URL(req.url, "http://placeholder.invalid");
    if (u.pathname === "/loc") {
      // Upstream echoes a chosen Location so the front door's rewrite is tested end to end.
      try {
        res.writeHead(302, { Location: u.searchParams.get("to") });
      } catch {
        res.writeHead(500);
      }
      return res.end();
    }
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
  assert.deepEqual(normalizeRequestTarget("/a\r\nb"), { url: "/ab" });
  assert.deepEqual(normalizeRequestTarget("/a\0b"), { status: 400 });
  assert.deepEqual(normalizeRequestTarget("*"), { status: 400 });
  assert.deepEqual(normalizeRequestTarget("http://evil.com/zz?a=1"), { url: "/zz?a=1" });
  assert.deepEqual(normalizeRequestTarget("//x"), { status: 308, location: "/x" });
});

const viaUpstream = async (to) => raw(`/loc?to=${encodeURIComponent(to)}`);

test("allowlist: trusted https OAuth hosts pass through unchanged", async () => {
  for (const to of [
    "https://x.com/i/oauth2/authorize?client_id=a&state=b",
    "https://twitter.com/i/oauth2/authorize",
    "https://api.x.com/2/oauth2/token",
    "https://auth.grok.me/api/auth/oauth2/authorize",
  ]) {
    assert.deepEqual(await viaUpstream(to), { status: 302, loc: to }, to);
  }
});

test("allowlist: untrusted or unsafe absolute URLs become /", async () => {
  for (const to of [
    "https://evil.com/x",
    "http://x.com/i/oauth2/authorize",
    "https://x.com:444/i/oauth2/authorize",
    "https://user:pw@x.com/",
    "https://x.com.evil.com/",
    "https://evilx.com/",
    "javascript:alert(1)",
    "data:text/html,hi",
    "ftp://x.com/",
    "ht\ttps://evil.com/",
    "https://[::ffff:8.8.8.8]/",
  ]) {
    assert.deepEqual(await viaUpstream(to), { status: 302, loc: "/" }, to);
    assert.equal(safeLocation(to), "/", to);
  }
});

test("allowlist: our own host becomes a same-origin relative path", () => {
  assert.equal(safeLocation("https://s1r1us.ai/faq/"), "/faq/");
  assert.equal(safeLocation("https://WWW.S1R1US.AI//evil.com?a=1"), "/evil.com?a=1");
  assert.equal(safeLocation("http://s1r1us.ai./x#h"), "/x#h");
  assert.equal(safeLocation("https://s1r1us.ai"), "/");
});

test("loopback: 127/8, localhost forms, unspecified and v4-mapped become relative", async () => {
  const hosts = [
    "127.0.0.1:8081",
    "127.1.2.3",
    "127.255.255.255:9",
    "0x7f.1",
    "2130706433",
    "LOCALHOST:8081",
    "localhost.",
    "foo.localhost",
    "A.B.LocalHost.",
    "0.0.0.0:8081",
    "0",
    "[::]",
    "[::1]:8081",
    "[0:0:0:0:0:0:0:1]",
    "[::ffff:127.0.0.1]:8081",
    "[::ffff:7f00:1]",
    "[::ffff:127.9.9.9]",
    "[::FFFF:7F01:0203]",
  ];
  for (const h of hosts) {
    for (const scheme of ["http", "HTTPS"]) {
      const to = `${scheme}://${h}//evil.com/p?q=1`;
      assert.equal(safeLocation(to), "/evil.com/p?q=1", to);
    }
    assert.deepEqual(await viaUpstream(`http://${h}/p`), { status: 302, loc: "/p" }, h);
  }
});

test("isInternalHost: exact cases", () => {
  for (const h of ["127.0.0.1", "127.8.9.10", "localhost", "LOCALHOST.", "x.localhost", "0.0.0.0", "[::]", "[::1]", "::1", "[::ffff:7f00:1]", "[::ffff:127.0.0.1]", "[::ffff:0:0]"]) {
    assert.equal(isInternalHost(h), true, h);
  }
  for (const h of ["128.0.0.1", "126.255.255.255", "localhost.evil.com", "evil-localhost", "127.evil.com", "[::2]", "[::ffff:8.8.8.8]", "[::ffff:808:808]", "s1r1us.ai", "x.com", ""]) {
    assert.equal(isInternalHost(h), false, h);
  }
});

test("tab/CR/LF and leading whitespace are dropped before the slash collapse", async () => {
  for (const to of ["/\t/evil.com", " //evil.com", "\t\n//evil.com", "/\r\n/evil.com", "\u0001/\\evil.com", "/\t\\/evil.com"]) {
    assert.equal(safeLocation(to), "/evil.com", JSON.stringify(to));
  }
  // End to end only for values that are legal in an HTTP header (tab and space are; CR/LF/C0 are not).
  for (const to of ["/\t/evil.com", "/\t\\/evil.com", "/ /\t/x"]) {
    const r = await viaUpstream(to);
    assert.equal(r.status, 302, JSON.stringify(to));
    assert.doesNotMatch(r.loc, BAD, JSON.stringify(to));
    assert.doesNotMatch(r.loc, /\t/, JSON.stringify(to));
  }
  assert.deepEqual(normalizeRequestTarget("/\t/evil.com"), { status: 308, location: "/evil.com" });
  assert.deepEqual(normalizeRequestTarget(" //evil.com?a=1"), { status: 308, location: "/evil.com?a=1" });
  assert.deepEqual(normalizeRequestTarget("\t/faq/"), { url: "/faq/" });
  assert.deepEqual(normalizeRequestTarget("/\r\n/evil.com"), { status: 308, location: "/evil.com" });
  // Raw tabs/spaces in a request line are rejected by Node's HTTP parser before the front door.
  assert.equal((await raw("/\t/evil.com")).status, 400);
});

test("allowlist mirrors the app's auth hosts", () => {
  const server = readFileSync(new URL("../src/lib/auth/server.ts", import.meta.url), "utf8");
  const preview = readFileSync(new URL("../src/lib/auth/preview.ts", import.meta.url), "utf8");
  const pub = /PUBLIC_SITE_HOSTS: string\[\] = \[([^\]]*)\]/.exec(server);
  assert.ok(pub, "PUBLIC_SITE_HOSTS not found");
  const hosts = [...pub[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]).sort();
  assert.deepEqual([...OWN_HOSTS].sort(), hosts);
  const issuer = /GROK_ISSUER_DEFAULT = "([^"]+)"/.exec(preview);
  assert.ok(issuer && TRUSTED_REDIRECT_HOSTS.has(new URL(issuer[1]).hostname));
  assert.ok(TRUSTED_REDIRECT_HOSTS.has("x.com") && TRUSTED_REDIRECT_HOSTS.has("twitter.com") && TRUSTED_REDIRECT_HOSTS.has("api.x.com"));
});
