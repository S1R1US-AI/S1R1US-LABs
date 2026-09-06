/**
 * Nitro ingress: CRS-PL1 WAF + CrowdSec-style bans.
 * Filename prefixes so it runs before agent-guard / grok-pwa.
 */
interface WafEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

export default async function wafMiddleware(
  event: WafEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const { gateHttp, withSecHeaders } = await import("../../src/lib/desk/waf-gate");
  const https = event.url.protocol === "https:" || event.req.headers.get("x-forwarded-proto") === "https";
  const gate = gateHttp({
    method: event.req.method ?? "GET",
    url: event.url.href,
    headers: event.req.headers,
  });
  if (gate.block) {
    return withSecHeaders(
      new Response(gate.body, {
        status: gate.status,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      }),
      https || gate.https,
    );
  }
  const out = await next();
  if (out instanceof Response) return withSecHeaders(out, https || gate.https);
  return out;
}
