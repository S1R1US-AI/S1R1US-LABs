import { createServerFn } from "@tanstack/react-start";

export const submitLockRequest = createServerFn({ method: "POST" })
  .validator((input: { token: string; ids: string[]; want: "lock" | "unlock"; note?: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAppAdminToken } = await import("./app-admin");
    if (!(await verifyAppAdminToken(data.token))) {
      return { ok: false as const, error: "Phone-app admin session required", rows: [] as const };
    }
    const { addLockRequest } = await import("./lock-request.server");
    return addLockRequest({ ids: data.ids, want: data.want, note: data.note });
  });

export const listLockRequests = createServerFn({ method: "GET" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAccessToken } = await import("./access.server");
    const { verifyAppAdminToken } = await import("./app-admin");
    const system = await verifyAccessToken(data.token);
    const phone = !system && (await verifyAppAdminToken(data.token));
    if (!system && !phone) return { ok: false as const, error: "Admin session required", rows: [] as const };
    const { listLockRequests: list } = await import("./lock-request.server");
    return { ok: true as const, error: null as string | null, rows: list() };
  });
