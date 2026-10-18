/**
 * schema.org `encodingFormat` (MIME type) for a site image path or URL.
 * Matches the file extension case-insensitively, ignoring any query string or hash.
 * GIF, PNG, WebP, AVIF and SVG map to their own types; everything else keeps the
 * historical default of `image/jpeg` (.jpg / .jpeg and extension-less paths).
 */
const IMAGE_MIME: Record<string, string> = {
  gif: "image/gif",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

export function imageEncodingFormat(src: string): string {
  const path = src.split(/[?#]/, 1)[0];
  const dot = path.lastIndexOf(".");
  const ext = dot > path.lastIndexOf("/") ? path.slice(dot + 1).toLowerCase() : "";
  return IMAGE_MIME[ext] ?? "image/jpeg";
}
