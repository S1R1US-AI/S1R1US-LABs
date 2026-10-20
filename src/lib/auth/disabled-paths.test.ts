import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { DISABLED_AUTH_PATHS } from "./disabled-paths.ts";

const BASE = "http://localhost:8080";
const SECRET = "test-only-secret-not-used-anywhere-0123456789abcdef";
const serverSrc = readFileSync(new URL("./server.ts", import.meta.url), "utf8");

function makeAuth(disabled: readonly string[]) {
  const db = { user: [], session: [], account: [], verification: [] } as Record<string, unknown[]>;
  return betterAuth({
    baseURL: BASE,
    secret: SECRET,
    database: memoryAdapter(db),
    emailAndPassword: { enabled: true },
    disabledPaths: [...disabled],
    trustedOrigins: [BASE],
  });
}

async function signedIn(auth: ReturnType<typeof makeAuth>) {
  const res = await auth.handler(
    new Request(`${BASE}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: BASE },
      body: JSON.stringify({ email: "visitor@example.test", password: "visitor-password-123", name: "visitor" }),
    }),
  );
  assert.equal(res.status, 200);
  const cookie = (res.headers.get("set-cookie") ?? "").split(";")[0] ?? "";
  assert.ok(cookie.includes("session_token"));
  return cookie;
}

function post(path: string, cookie: string, body: unknown) {
  return new Request(`${BASE}/api/auth${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: BASE, cookie },
    body: JSON.stringify(body),
  });
}

async function sessionName(auth: ReturnType<typeof makeAuth>, cookie: string) {
  const res = await auth.handler(
    new Request(`${BASE}/api/auth/get-session`, { headers: { cookie, origin: BASE } }),
  );
  const j = (await res.json()) as { user?: { name?: string; email?: string } } | null;
  return j?.user ?? null;
}

describe("unused auth endpoints are disabled", { concurrency: false }, () => {
  it("server config wires the disabled list", () => {
    assert.match(serverSrc, /disabledPaths: \[\.\.\.DISABLED_AUTH_PATHS\]/);
    for (const p of ["/update-user", "/change-email", "/delete-user"]) {
      assert.ok(DISABLED_AUTH_PATHS.includes(p), p);
    }
  });

  it("control: endpoint answers when not disabled", async () => {
    const auth = makeAuth([]);
    const cookie = await signedIn(auth);
    const res = await auth.handler(post("/update-user", cookie, { name: "aid_test_admin_x" }));
    assert.equal(res.status, 200);
    assert.equal((await sessionName(auth, cookie))?.name, "aid_test_admin_x");
  });

  it("update-user returns 404 and the profile is unchanged", async () => {
    const auth = makeAuth(DISABLED_AUTH_PATHS);
    const cookie = await signedIn(auth);
    for (const path of ["/update-user", "/update-user/", "/update-user?x=1"]) {
      const res = await auth.handler(post(path, cookie, { name: "aid_test_admin_x" }));
      assert.ok(res.status === 404 || res.status === 403, `${path} -> ${res.status}`);
    }
    const user = await sessionName(auth, cookie);
    assert.equal(user?.name, "visitor");
  });

  it("change-email and delete-user return 404", async () => {
    const auth = makeAuth(DISABLED_AUTH_PATHS);
    const cookie = await signedIn(auth);
    const ce = await auth.handler(post("/change-email", cookie, { newEmail: "aid_test_admin_x@example.test" }));
    assert.equal(ce.status, 404);
    const du = await auth.handler(post("/delete-user", cookie, {}));
    assert.equal(du.status, 404);
    const user = await sessionName(auth, cookie);
    assert.equal(user?.email, "visitor@example.test");
  });
});
