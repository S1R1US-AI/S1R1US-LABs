/** Server-only: serves the admin page code that the build moved out of the public folder. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ADMIN_ASSET_COOKIE, ADMIN_ASSET_HEADERS, adminAssetDecision, cookieValue } from "./admin-assets";
import { isAdminToken } from "./admin-gate.server";

let cache: { dir: string; names: Set<string>; real: Map<string, string> } | null = null;

function gatedDir(): { dir: string; names: Set<string>; real: Map<string, string> } {
  if (cache) return cache;
  // Node build: .output/server/admin-assets. Vercel function: admin-assets beside the function entry (its cwd).
  const roots = [join(process.cwd(), ".output/server/admin-assets"), join(process.cwd(), "admin-assets")];
  if (process.argv[1]) roots.push(join(dirname(process.argv[1]), "admin-assets"));
  for (const dir of roots) {
    const list = join(dir, "admin-assets.json");
    if (!existsSync(list)) continue;
    try {
      const names = (JSON.parse(readFileSync(list, "utf8")) as { files?: string[] }).files ?? [];
      cache = { dir, names: new Set(names.map((n) => n.toLowerCase())), real: new Map(names.map((n) => [n.toLowerCase(), n])) };
      return cache;
    } catch {
      /* unreadable list → nothing served */
    }
  }
  cache = { dir: "", names: new Set(), real: new Map() };
  return cache;
}

function notFound(head: boolean) {
  return new Response(head ? null : "Not found", {
    status: 404,
    headers: { ...ADMIN_ASSET_HEADERS, "content-type": "text/plain; charset=utf-8" },
  });
}

export async function serveAdminAsset(request: Request): Promise<Response> {
  const head = request.method === "HEAD";
  const url = new URL(request.url);
  const { dir, names, real } = gatedDir();
  const pre = adminAssetDecision(url.pathname, names, true);
  if (!pre.serve) return notFound(head);
  const token = cookieValue(request.headers.get("cookie"), ADMIN_ASSET_COOKIE);
  const ok = await isAdminToken(token);
  const decision = adminAssetDecision(url.pathname, names, ok);
  if (!decision.serve || !dir) return notFound(head);
  let body: Buffer;
  try {
    const file = real.get(decision.serve);
    if (!file) return notFound(head);
    body = readFileSync(join(dir, file));
  } catch {
    return notFound(head);
  }
  return new Response(head ? null : new Uint8Array(body), {
    status: 200,
    headers: { ...ADMIN_ASSET_HEADERS, "content-type": "text/javascript; charset=utf-8" },
  });
}
