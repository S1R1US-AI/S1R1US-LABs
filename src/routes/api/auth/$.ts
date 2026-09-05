import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";

function loginErrorRedirect(request: Request) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", "x");
  return Response.redirect(url, 302);
}

async function handleAuth(request: Request) {
  try {
    const res = await auth.handler(request);
    if (res.status >= 500 && request.method === "GET") {
      return loginErrorRedirect(request);
    }
    return res;
  } catch (err) {
    console.error("[auth]", err instanceof Error ? err.message : err);
    if (request.method === "GET") return loginErrorRedirect(request);
    return Response.json({ error: "X sign-in failed" }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAuth(request),
      POST: ({ request }) => handleAuth(request),
    },
  },
});
