import { seoImgAlt } from "@/lib/brand";
import { cn } from "@/lib/utils";

function hashName(name: string) {
  let h = 2166136261;
  for (const c of name) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function BotMark({
  id,
  name,
  kind,
  pic,
  rank,
  size = 40,
  className,
}: {
  id: string;
  name: string;
  kind: string;
  pic?: boolean;
  rank?: number | null;
  size?: number;
  className?: string;
}) {
  const alt = seoImgAlt(`${name} · ${kind} · W1S3 0WL$ L3AD3R B0ARD · ai agent bitcoin trading leader board`);
  if (pic && id) {
    return (
      <img
        src={`/api/agent/board/pic/${encodeURIComponent(id)}`}
        alt={alt}
        title={alt}
        width={size}
        height={size}
        className={cn("board-pic shrink-0 object-cover", `kind-${kind}`, rank === 1 && "board-pic-leader", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  const h = hashName(name);
  const letters = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || kind.slice(0, 2).toUpperCase();
  const a = 8 + (h % 10);
  const b = 18 + ((h >>> 5) % 12);
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={cn("board-pic shrink-0", `kind-${kind}`, rank === 1 && "board-pic-leader", className)}
      role="img"
      aria-label={alt}
    >
      <title>{alt}</title>
      <rect width="40" height="40" rx="8" fill="var(--color-bg)" />
      <rect x="1" y="1" width="38" height="38" rx="7" fill="none" stroke="var(--kind-fill, var(--color-oss))" strokeWidth="1.6" />
      <circle cx={12 + (h % 8)} cy={14} r="5" fill="var(--kind-fill, var(--color-oss))" opacity="0.35" />
      <circle cx={28 - (h % 6)} cy={26} r="7" fill="var(--kind-fill, var(--color-oss))" opacity="0.22" />
      <path d={`M${a} 30 L${b} 10 L${b + 10} 30`} fill="none" stroke="var(--kind-fill, var(--color-oss))" strokeWidth="1.4" />
      <text x="20" y="25" textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono, ui-monospace, monospace" fill="var(--kind-fill, var(--color-oss))" fontWeight="700">
        {letters}
      </text>
    </svg>
  );
}
