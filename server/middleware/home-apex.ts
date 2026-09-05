/**
 * Apex home is https://s1r1us.ai/ — never /heliosbot.
 * Runs on the production Nitro image before the SPA 404.
 */
interface ApexEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

function homeLocation(event: ApexEvent): string {
  const host = (
    event.req.headers.get("x-forwarded-host") ??
    event.req.headers.get("host") ??
    event.url.host
  )
    .split(",")[0]
    ?.trim()
    .split(":")[0]
    ?.toLowerCase();
  if (host === "s1r1us.ai" || host === "www.s1r1us.ai") return "https://s1r1us.ai/";
  return "/";
}

export default async function homeApexMiddleware(
  event: ApexEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const path = (event.url.pathname || "/").replace(/\/+$/, "") || "/";
  if (path.toLowerCase() !== "/heliosbot") return next();
  return new Response(null, {
    status: 301,
    headers: {
      location: homeLocation(event),
      "cache-control": "no-store",
    },
  });
}
