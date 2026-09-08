import { createServerFn } from "@tanstack/react-start";

export const fetchLockTickets = createServerFn({ method: "GET" }).handler(async () => {
  const { listLockTickets } = await import("./lock-request.server");
  return { tickets: listLockTickets() };
});

export const postLockTicket = createServerFn({ method: "POST" })
  .validator((input: { token: string; ids: string[]; locked: boolean; note?: string }) => input)
  .handler(async ({ data }) => {
    const { verifyAppAdminToken } = await import("./app-admin");
    const copy = verifyAppAdminToken(data.token);
    if (!copy) return { ok: false as const, error: "Phone-app admin session required", ticket: null as null };
    const { fileLockTicket } = await import("./lock-request.server");
    const row = fileLockTicket(data.ids || [], data.locked, data.note || "");
    if ("error" in row) return { ok: false as const, error: row.error, ticket: null as null };
    return { ok: true as const, error: null as string | null, ticket: row };
  });
