/** Auth hardening tests and a negative matrix over server functions. */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { forceRebuildAllowed, renewProofError, RENEW_PROOF_ERROR, systemTokenOnly } from "./auth-guards.ts";

const FIX_HANDLE = "aid_test_admin_x";
const FIX_ID = "1000000000000000001";
const ENV_KEYS = ["S1R1US_ADMIN_X_HANDLE", "S1R1US_ADMIN_X_ID", "S1R1US_ADMIN_X_NAME", "S1R1US_APP_ADMIN_SECRET"] as const;
const prev: Record<string, string | undefined> = {};
const TEST_SECRET = "test-only-app-admin-secret-0123456789abcdef";
/** Unique per run: the copy-admin store persists on disk between runs. */
const RUN = Date.now().toString(36);

const here = fileURLToPath(new URL(".", import.meta.url));
const srcRoot = join(here, "..", "..");
const read = (rel: string) => readFileSync(join(srcRoot, rel), "utf8");

function b64url(o: unknown) {
  return Buffer.from(JSON.stringify(o)).toString("base64url");
}
function fakeJwt(claims: unknown) {
  return `${b64url({ alg: "none" })}.${b64url(claims)}.sig`;
}

/** System verifier stub: accepts exactly one well-formed system token. */
const SYSTEM_TOKEN = `${Date.now() + 60_000}.1.${"a".repeat(64)}`;
let verifierCalls = 0;
const verifySystem = async (t: string | undefined) => {
  verifierCalls += 1;
  return t === SYSTEM_TOKEN;
};

before(() => {
  for (const k of ENV_KEYS) prev[k] = process.env[k];
  process.env.S1R1US_ADMIN_X_HANDLE = FIX_HANDLE;
  process.env.S1R1US_ADMIN_X_ID = FIX_ID;
  process.env.S1R1US_ADMIN_X_NAME = "AID Test Admin";
  process.env.S1R1US_APP_ADMIN_SECRET = TEST_SECRET;
});
after(() => {
  for (const k of ENV_KEYS) {
    if (prev[k] === undefined) delete process.env[k];
    else process.env[k] = prev[k];
  }
});

describe("B5 admin identity", { concurrency: false }, () => {
  it("profile fields do not grant admin", async () => {
    const { accountRowsAreAdminX } = await import("./x-admin.server.ts");
    const visitor = [{ providerId: "twitter", accountId: "1999999999999999999", idToken: null }];
    assert.equal(accountRowsAreAdminX(visitor), false);
    const src = read("lib/desk/access.server.ts");
    const fn = src.slice(src.indexOf("export async function sessionIsAdminX"), src.indexOf("export function assertNewAdminPass"));
    assert.doesNotMatch(fn, /from "user"/);
    assert.doesNotMatch(fn, /profileLooksLikeAdminX|u\.name|u\.email/);
    assert.match(fn, /accountRowsAreAdminX\(accounts\)/);
  });

  it("the real admin account row still passes (snowflake or handle accountId, or id_token claim)", async () => {
    const { accountRowsAreAdminX } = await import("./x-admin.server.ts");
    assert.equal(accountRowsAreAdminX([{ providerId: "twitter", accountId: FIX_ID, idToken: null }]), true);
    assert.equal(accountRowsAreAdminX([{ providerId: "grok-x", accountId: FIX_HANDLE, idToken: null }]), true);
    assert.equal(
      accountRowsAreAdminX([{ providerId: "grok-x", accountId: "uuid-x", idToken: fakeJwt({ sub: "uuid-x", preferred_username: FIX_HANDLE }) }]),
      true,
    );
  });

  it("non-X providers never count, even with the admin id", async () => {
    const { accountRowsAreAdminX } = await import("./x-admin.server.ts");
    for (const providerId of ["credential", "grok-gate", "google", "email"]) {
      assert.equal(accountRowsAreAdminX([{ providerId, accountId: FIX_ID, idToken: fakeJwt({ sub: FIX_ID }) }]), false);
    }
  });

  it("email values are not identity candidates", async () => {
    const { accountRowsAreAdminX, profileLooksLikeAdminX, idTokenClaimsAreAdmin } = await import("./x-admin.server.ts");
    const { collectXIdentityStrings } = await import("./x-admin.ts");
    assert.equal(profileLooksLikeAdminX({ email: `${FIX_HANDLE}@example.test` }), false);
    assert.equal(profileLooksLikeAdminX({ name: "someone", email: `${FIX_HANDLE}@users.noreply.x.com` }), false);
    assert.equal(profileLooksLikeAdminX(`${FIX_HANDLE}@example.test`), false);
    assert.equal(idTokenClaimsAreAdmin(fakeJwt({ sub: "other", email: `${FIX_HANDLE}@example.test` })), false);
    assert.equal(accountRowsAreAdminX([{ providerId: "twitter", accountId: `${FIX_HANDLE}@example.test`, idToken: null }]), false);
    assert.deepEqual(collectXIdentityStrings({ email: `${FIX_HANDLE}@example.test` }), []);
  });
});

describe("B5 credential renew", { concurrency: false }, () => {
  const deps = (ok: { pass?: string; otp?: string }) => ({
    credsMatch: async (_n: string, p: string) => p === ok.pass,
    consumeYubiOtp: async (o: string) => (o === ok.otp ? null : "bad otp"),
  });
  const GOOD_OTP = "cccccbcdefghijklnrtuvcbdefghijklnrtuvcbdefgh";

  it("fails with no current password and no YubiKey", async () => {
    assert.equal(GOOD_OTP.length, 44);
    const d = deps({ pass: "correct-horse-battery", otp: GOOD_OTP });
    assert.equal(await renewProofError({}, "admin", d), RENEW_PROOF_ERROR);
    assert.equal(await renewProofError(null, "admin", d), RENEW_PROOF_ERROR);
    assert.equal(await renewProofError({ current: "" , otp: "" }, "admin", d), RENEW_PROOF_ERROR);
  });

  it("fails with a wrong password, a bad OTP, or wrong types", async () => {
    const d = deps({ pass: "correct-horse-battery", otp: GOOD_OTP });
    assert.equal(await renewProofError({ current: "wrong-password" }, "admin", d), RENEW_PROOF_ERROR);
    assert.equal(await renewProofError({ otp: "c".repeat(44) }, "admin", d), RENEW_PROOF_ERROR);
    assert.equal(await renewProofError({ otp: "not-an-otp" }, "admin", d), RENEW_PROOF_ERROR);
    assert.equal(await renewProofError({ current: 123 as unknown as string }, "admin", d), RENEW_PROOF_ERROR);
    assert.equal(await renewProofError({ current: "x".repeat(129) }, "admin", deps({ pass: "x".repeat(129) })), RENEW_PROOF_ERROR);
  });

  it("fails closed when a verifier throws", async () => {
    const boom = { credsMatch: async () => { throw new Error("db"); }, consumeYubiOtp: async () => { throw new Error("net"); } };
    assert.equal(await renewProofError({ current: "x", otp: GOOD_OTP }, "admin", boom), RENEW_PROOF_ERROR);
  });

  it("passes with the current password or an enrolled YubiKey tap", async () => {
    const d = deps({ pass: "correct-horse-battery", otp: GOOD_OTP });
    assert.equal(await renewProofError({ current: "correct-horse-battery" }, "admin", d), null);
    assert.equal(await renewProofError({ otp: GOOD_OTP.toUpperCase() }, "admin", d), null);
  });

  it("the renew handler checks the proof before rotating creds or minting a token", () => {
    const src = read("lib/desk/access.ts");
    const fn = src.slice(src.indexOf("export const renewAdminPasswordWithX"), src.indexOf("export const claimCopyAdmin"));
    const proofAt = fn.indexOf("renewProofError(data, liveName");
    assert.ok(proofAt > 0);
    assert.ok(proofAt < fn.indexOf("rotateCreds("));
    assert.ok(proofAt < fn.indexOf("signAccessToken()"));
    assert.match(fn, /if \(proof\) \{[\s\S]*?return \{ ok: false as const, error: proof \};/);
  });
});

describe("B5 copy-admin scope", { concurrency: false }, () => {
  it("a valid copy-admin token is rejected by the system-only guard", async () => {
    const { claimAppAdmin, verifyAppAdminToken } = await import("./app-admin.ts");
    const res = claimAppAdmin({ mandate: true, kind: "iphone", handle: `guard-test-${RUN}`, owner: "user-guard" });
    assert.equal(res.ok, true);
    if (!res.ok) return;
    assert.ok(verifyAppAdminToken(res.token));
    verifierCalls = 0;
    assert.equal(await systemTokenOnly(res.token, verifySystem), false);
    assert.equal(verifierCalls, 0, "copy-admin token never reaches the system verifier");
    assert.equal(await systemTokenOnly(SYSTEM_TOKEN, verifySystem), true);
  });

  it("sim, hive, championship and tape setters use the system-only guard and never accept copy-admin", () => {
    const rpc = read("lib/desk/desk-rpc.ts");
    const blocks = rpc.split(/(?=export const )/);
    for (const name of ["setLiveSim", "setHiveSwarmStatus", "setChampionshipSim", "setTapeFreeze", "postPracticePulse"]) {
      const blk = blocks.find((b) => b.startsWith(`export const ${name} =`));
      assert.ok(blk, name);
      assert.doesNotMatch(blk!, /verifyAppAdminToken/, name);
      assert.doesNotMatch(blk!, /"app-admin"/, name);
      assert.match(blk!, /systemTokenOnly|verifyAccessToken\(data\.token\)/, name);
    }
  });

  it("board register admin flag uses the system-only guard and never accepts copy-admin", () => {
    const route = read("routes/api/agent.board.ts");
    const start = route.indexOf('if (op === "register")');
    assert.ok(start >= 0, "register branch");
    const blk = route.slice(start, route.indexOf("registerBoard(", start));
    assert.doesNotMatch(blk, /verifyAppAdminToken|app-admin/);
    assert.match(blk, /asAdmin = await systemTokenOnly\(adminHdr, verifyAccessToken\)/);
    assert.doesNotMatch(route, /verifyAppAdminToken/);
  });

  it("signing secret comes from env and fails closed when unset or short", async () => {
    const { claimAppAdmin, signAppAdminToken, verifyAppAdminToken, APP_ADMIN_SECRET_ENV } = await import("./app-admin.ts");
    assert.equal(APP_ADMIN_SECRET_ENV, "S1R1US_APP_ADMIN_SECRET");
    const ok = claimAppAdmin({ mandate: true, kind: "iphone", handle: `secret-test-${RUN}`, owner: "user-s" });
    assert.equal(ok.ok, true);
    if (!ok.ok) return;
    for (const v of [undefined, "", "short-secret"]) {
      if (v === undefined) delete process.env.S1R1US_APP_ADMIN_SECRET;
      else process.env.S1R1US_APP_ADMIN_SECRET = v;
      assert.equal(verifyAppAdminToken(ok.token), null);
      assert.equal(signAppAdminToken("aa-x"), "");
      const c = claimAppAdmin({ mandate: true, kind: "iphone", handle: `secret-test-2-${RUN}`, owner: "user-s" });
      assert.equal(c.ok, false);
    }
    process.env.S1R1US_APP_ADMIN_SECRET = "a-different-secret-0123456789abcdef-rotated";
    assert.equal(verifyAppAdminToken(ok.token), null, "tokens signed with another secret are rejected");
    process.env.S1R1US_APP_ADMIN_SECRET = TEST_SECRET;
    assert.doesNotMatch(read("lib/desk/app-admin.ts"), /const PEPPER = "/);
  });

  it("claim needs a signed-in owner and cannot take another owner's copy", async () => {
    const { claimAppAdmin } = await import("./app-admin.ts");
    assert.equal(claimAppAdmin({ mandate: true, kind: "iphone", handle: `owner-test-${RUN}` }).ok, false);
    assert.equal(claimAppAdmin({ mandate: true, kind: "iphone", handle: `owner-test-${RUN}`, owner: "  " }).ok, false);
    const mine = claimAppAdmin({ mandate: true, kind: "iphone", handle: `owner-test-${RUN}`, owner: "user-a" });
    assert.equal(mine.ok, true);
    const theirs = claimAppAdmin({ mandate: true, kind: "iphone", handle: `owner-test-${RUN}`, owner: "user-b" });
    assert.equal(theirs.ok, false);
    const again = claimAppAdmin({ mandate: true, kind: "iphone", handle: `owner-test-${RUN}`, owner: "user-a" });
    assert.equal(again.ok, true);
    const access = read("lib/desk/access.ts");
    const fn = access.slice(access.indexOf("export const claimCopyAdmin"), access.indexOf("export const peekCopyAdmin"));
    assert.match(fn, /\.middleware\(\[optionalXSession\]\)/);
    assert.match(fn, /if \(!xUserId\) return \{ ok: false as const/);
    assert.match(fn, /owner: xUserId \}/);
  });
});

// ---------------------------------------------------------------------------
// B7: negative matrix over server functions.
// ---------------------------------------------------------------------------

function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}

type Fn = { file: string; name: string; method: string; body: string };
function serverFns(): Fn[] {
  const out: Fn[] = [];
  for (const file of walk(srcRoot)) {
    const src = readFileSync(file, "utf8");
    const hits = [...src.matchAll(/export const (\w+) = createServerFn\(\{\s*method:\s*"(\w+)"/g)];
    hits.forEach((m, i) => {
      const end = i + 1 < hits.length ? hits[i + 1]!.index! : src.length;
      out.push({ file: file.slice(srcRoot.length + 1), name: m[1]!, method: m[2]!, body: src.slice(m.index!, end) });
    });
  }
  return out;
}

const AUTH_RE = /verifyAccessToken|verifyAppAdminToken|authMiddleware|sessionIsAdminX|assertAdminX|systemTokenOnly|verifyDeskToken|minerScope|getSessionUser|xUserId|verifyYubiTicket|requireAdminData/;

/** Reviewed: callable without auth on purpose. Reads only, or a read-only peek of a caller-held token. */
const PUBLIC_OK: Record<string, string> = {
  fetchDesk: "public tape read; forced rebuild needs the system token",
  fetchTapeMeta: "public tape meta read",
  fetchDeskErrors: "public error list read",
  fetchAgentFlags: "public flags read",
  fetchPracticePulse: "public pulse read",
  fetchAuto24h: "public read",
  fetchLockStatus: "public lock status read",
  getGmLive: "public read",
  fetchLockTickets: "public ticket list read",
  fetchDonate: "public donate addresses read",
  isMarketingHost: "host check read",
  peekCopyAdmin: "verifies the caller's own copy-admin token",
};

describe("B7 auth negative matrix", { concurrency: false }, () => {
  const fns = serverFns();

  it("finds the server functions", () => {
    assert.ok(fns.length >= 60, `found ${fns.length}`);
  });

  it("every server function without an auth check is a reviewed public read", () => {
    const open = fns.filter((f) => !AUTH_RE.test(f.body)).map((f) => f.name).sort();
    const unexpected = open.filter((n) => !(n in PUBLIC_OK));
    assert.deepEqual(unexpected, [], `unreviewed no-auth server functions: ${unexpected.join(", ")}`);
  });

  it("no unauthenticated POST writes remain", () => {
    const openPosts = fns.filter((f) => f.method === "POST" && !AUTH_RE.test(f.body)).map((f) => f.name);
    assert.deepEqual(openPosts.filter((n) => n !== "peekCopyAdmin"), []);
  });

  it("previously open writes are now gated", () => {
    const by = (n: string) => fns.find((f) => f.name === n)!.body;
    assert.match(by("postPracticePulse"), /systemTokenOnly\(data\?\.token, verifyAccessToken\)/);
    assert.match(by("claimCopyAdmin"), /optionalXSession/);
    assert.match(by("fetchDesk"), /forceRebuildAllowed\(data, verifyAccessToken\)/);
    assert.doesNotMatch(by("fetchDesk"), /Boolean\(data\?\.force\) &&/);
  });

  const APP_TOKEN_SHAPE = `app.${Date.now() + 60_000}.aa-x.${"b".repeat(64)}`;
  const cases: [string, unknown][] = [
    ["no token", undefined],
    ["empty string", ""],
    ["null", null],
    ["number", 12345],
    ["object", { token: SYSTEM_TOKEN }],
    ["bad HMAC", `${Date.now() + 60_000}.1.${"0".repeat(64)}`],
    ["expired", `${Date.now() - 1}.1.${"a".repeat(64)}`],
    ["wrong epoch", `${Date.now() + 60_000}.2.${"a".repeat(64)}`],
    ["desk-user token shape", `${Date.now() + 60_000}.u.${"a".repeat(64)}`],
    ["copy-admin token shape", APP_TOKEN_SHAPE],
    ["two parts", "1.2"],
    ["oversized", "1.2." + "a".repeat(5000)],
  ];

  for (const [label, token] of cases) {
    it(`system-only guard denies: ${label}`, async () => {
      assert.equal(await systemTokenOnly(token, verifySystem), false);
      assert.equal(await forceRebuildAllowed({ force: true, token }, verifySystem), false);
    });
  }

  it("system-only guard fails closed when the verifier throws or returns a non-boolean", async () => {
    assert.equal(await systemTokenOnly(SYSTEM_TOKEN, async () => { throw new Error("db down"); }), false);
    assert.equal(await systemTokenOnly(SYSTEM_TOKEN, (async () => "yes") as unknown as typeof verifySystem), false);
  });

  it("forced rebuild: only force:true with the system token", async () => {
    assert.equal(await forceRebuildAllowed(undefined, verifySystem), false);
    assert.equal(await forceRebuildAllowed({}, verifySystem), false);
    assert.equal(await forceRebuildAllowed({ force: true }, verifySystem), false);
    assert.equal(await forceRebuildAllowed({ force: "true", token: SYSTEM_TOKEN }, verifySystem), false);
    assert.equal(await forceRebuildAllowed({ force: false, token: SYSTEM_TOKEN }, verifySystem), false);
    assert.equal(await forceRebuildAllowed({ force: true, token: SYSTEM_TOKEN }, verifySystem), true);
  });

  it("system-only setters do not use GET (no state change from a link)", () => {
    for (const n of ["setLiveSim", "setHiveSwarmStatus", "setChampionshipSim", "setTapeFreeze", "postPracticePulse", "claimCopyAdmin", "renewAdminPasswordWithX"]) {
      assert.equal(fns.find((f) => f.name === n)?.method, "POST", n);
    }
  });
});
