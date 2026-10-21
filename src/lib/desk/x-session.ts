/**
 * Forwards the signed-in X session to admin server functions. In the live preview the
 * app runs in an iframe whose cookies do not reach the server, so the session travels
 * as a bearer token; when deployed the cookie is used.
 */
import { createMiddleware } from "@tanstack/react-start";

export const optionalXSession = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getBearerToken } = await import("@/lib/auth/client");
    return next({ sendContext: { bearerToken: getBearerToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { runWithBearer } = await import("./access.server");
    const bearer = (context as { bearerToken?: string }).bearerToken;
    const user = await getSessionUser(bearer);
    return runWithBearer(bearer, () =>
      next({
        context: {
          ...context,
          bearerToken: bearer,
          xUserId: user?.id ?? null,
        },
      }),
    );
  });
