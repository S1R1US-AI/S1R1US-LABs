import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { OSS_PDF_BASE64, OSS_PDF_NAME } from "@/lib/desk/oss-pdf";
import { seoImgAlt } from "@/lib/brand";
import { cn } from "@/lib/utils";

const PAGES = [
  { src: "/oss-brief-1.jpg", alt: seoImgAlt("Cover — Matrix idle lock · S1R1US Labs open source brief") },
  { src: "/oss-brief-2.jpg", alt: seoImgAlt("Open source brief page 2 · S1R1US Labs") },
  { src: "/oss-brief-3.jpg", alt: seoImgAlt("Open source brief page 3 · S1R1US Labs") },
];

type Mode = "images" | "pdfjs" | "native" | "embed";

function pdfBytes() {
  const bin = atob(OSS_PDF_BASE64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function downloadOssPdf() {
  const blob = new Blob([pdfBytes()], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = OSS_PDF_NAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function usePdfBlob() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = URL.createObjectURL(new Blob([pdfBytes()], { type: "application/pdf" }));
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, []);
  return url;
}

export function OssPdfViewers() {
  const [mode, setMode] = useState<Mode>("images");
  const blobUrl = usePdfBlob();

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Open source brief</p>
          <h2 className="mt-1 text-xl font-semibold text-medium">Matrix cover + MIT / team / v3</h2>
        </div>
        <button
          type="button"
          onClick={downloadOssPdf}
          className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
        >
          <Download className="size-4" />
          Download PDF
        </button>
      </div>

      <div className="desk-tabs mt-4 flex flex-wrap gap-1" role="tablist" aria-label="PDF viewers">
        {(
          [
            ["images", "Pages"],
            ["pdfjs", "PDF.js"],
            ["native", "Native"],
            ["embed", "Embed"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={cn(
              "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
              mode === id && "is-on",
            )}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {mode === "images" ? <ImageViewer /> : null}
        {mode === "pdfjs" ? <PdfJsViewer /> : null}
        {mode === "native" ? (
          blobUrl ? (
            <iframe
              title="Native PDF viewer"
              src={blobUrl}
              className="h-[72vh] w-full rounded-md border border-rule bg-surface"
            />
          ) : (
            <p className="text-sm text-muted">Preparing native viewer…</p>
          )
        ) : null}
        {mode === "embed" ? (
          blobUrl ? (
            <object
              title="Embedded PDF"
              data={blobUrl}
              type="application/pdf"
              className="h-[72vh] w-full rounded-md border border-rule bg-surface"
            >
              <p className="p-4 text-sm text-muted">
                This browser blocked the embed. Use Pages or PDF.js, or Download PDF.
              </p>
            </object>
          ) : (
            <p className="text-sm text-muted">Preparing embed…</p>
          )
        ) : null}
      </div>
    </section>
  );
}

function ImageViewer() {
  return (
    <div className="space-y-4">
      {PAGES.map((p) => (
        <img key={p.src} src={p.src} alt={p.alt} title={p.alt} className="w-full rounded-md border border-rule bg-surface" />
      ))}
    </div>
  );
}

function PdfJsViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(3);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let gone = false;
    async function draw() {
      setBusy(true);
      setErr(null);
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const task = pdfjs.getDocument({ data: pdfBytes() });
        const pdf = await task.promise;
        if (gone) return;
        setPages(pdf.numPages);
        const pg = await pdf.getPage(page);
        const viewport = pg.getViewport({ scale: 1.35 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await pg.render({ canvasContext: ctx, viewport, canvas }).promise;
      } catch (e) {
        if (!gone) setErr(e instanceof Error ? e.message : "PDF.js could not render.");
      } finally {
        if (!gone) setBusy(false);
      }
    }
    void draw();
    return () => {
      gone = true;
    };
  }, [page]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-3 text-sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft className="size-4" />
          Prev
        </button>
        <p className="font-mono text-sm text-muted">
          {page} / {pages}
        </p>
        <button
          type="button"
          className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-3 text-sm"
          disabled={page >= pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
      {err ? <p className="mb-3 text-sm text-down">{err}</p> : null}
      {busy ? <p className="mb-2 text-sm text-muted">Rendering…</p> : null}
      <canvas ref={canvasRef} className="w-full rounded-md border border-rule bg-surface" />
    </div>
  );
}
