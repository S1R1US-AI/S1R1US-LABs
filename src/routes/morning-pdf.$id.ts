import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/morning-pdf/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const id = String(params.id ?? "").replace(/[^0-9-]/g, "");
        const dl = new URL(request.url).searchParams.get("dl") === "1";
        const { readMorningPdf } = await import("@/lib/desk/morning-lib.server");
        const { morningPdfName } = await import("@/lib/desk/morning-lib");
        const buf = await readMorningPdf(id);
        if (!buf) return new Response("not found", { status: 404, headers: { "content-type": "text/plain" } });
        const name = morningPdfName(id);
        return new Response(new Uint8Array(buf), {
          headers: {
            "content-type": "application/pdf",
            "content-disposition": `${dl ? "attachment" : "inline"}; filename="${name}"`,
            "cache-control": "private, max-age=120",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});
