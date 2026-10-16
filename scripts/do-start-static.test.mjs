import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { mkdtempSync, writeFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { serveStatic, staticValidators } from "./do-start.mjs";

const dir = mkdtempSync(join(tmpdir(), "do-start-static-"));
const file = join(dir, "clip.mp4");
const body = Buffer.from(Array.from({ length: 1000 }, (_, i) => i % 256));
writeFileSync(file, body);
let server, port;

before(async () => {
  server = http.createServer((req, res) => serveStatic(res, file, req));
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  port = server.address().port;
});
after(() => server.close());

function get(headers = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path: "/clip.mp4", method, headers }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("full GET is 200 video/mp4 with validators", async () => {
  const r = await get();
  assert.equal(r.status, 200);
  assert.equal(r.headers["content-type"], "video/mp4");
  assert.equal(r.headers["content-length"], "1000");
  assert.equal(r.headers["accept-ranges"], "bytes");
  assert.ok(r.headers.etag);
  assert.ok(r.headers["last-modified"]);
  assert.deepEqual(r.body, body);
});

test("Range returns 206", async () => {
  const r = await get({ Range: "bytes=0-1" });
  assert.equal(r.status, 206);
  assert.equal(r.headers["content-range"], "bytes 0-1/1000");
  assert.equal(r.headers["content-length"], "2");
  assert.deepEqual(r.body, body.subarray(0, 2));
});

test("suffix range returns last bytes", async () => {
  const r = await get({ Range: "bytes=-10" });
  assert.equal(r.status, 206);
  assert.equal(r.headers["content-range"], "bytes 990-999/1000");
  assert.deepEqual(r.body, body.subarray(990));
});

test("unsatisfiable range is 416", async () => {
  const r = await get({ Range: "bytes=5000-6000" });
  assert.equal(r.status, 416);
  assert.equal(r.headers["content-range"], "bytes */1000");
});

test("HEAD ignores Range: 200, full Content-Length, no body", async () => {
  const r = await get({ Range: "bytes=0-1" }, "HEAD");
  assert.equal(r.status, 200);
  assert.equal(r.headers["content-length"], "1000");
  assert.equal(r.headers["content-range"], undefined);
  assert.equal(r.body.length, 0);
  const oob = await get({ Range: "bytes=5000-6000" }, "HEAD");
  assert.equal(oob.status, 200);
});

test("If-Range mismatch serves full 200", async () => {
  const r = await get({ Range: "bytes=0-1", "If-Range": 'W/"stale-etag"' });
  assert.equal(r.status, 200);
  assert.equal(r.body.length, 1000);
  const d = await get({ Range: "bytes=0-1", "If-Range": "Thu, 01 Jan 2004 00:00:00 GMT" });
  assert.equal(d.status, 200);
});

test("If-Range match (ETag or Last-Modified) serves 206", async () => {
  const v = staticValidators(statSync(file));
  const r = await get({ Range: "bytes=0-1", "If-Range": v.etag });
  assert.equal(r.status, 206);
  assert.equal(r.body.length, 2);
  const d = await get({ Range: "bytes=0-1", "If-Range": v.lastModified });
  assert.equal(d.status, 206);
});
