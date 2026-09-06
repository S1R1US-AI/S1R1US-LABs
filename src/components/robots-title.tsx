import { TAB_HOVER_ROBOTS, TAB_ROBOTS } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** FAQ / page title: R0B0T$ + rainbow ACT1VAT3. */
export function RobotsTitle({ className, size = "nav" }: { className?: string; size?: "nav" | "hero" }) {
  return (
    <span
      className={cn("forum-title", size === "hero" && "forum-title-hero", className)}
      title={TAB_HOVER_ROBOTS}
      aria-label={TAB_ROBOTS}
    >
      <span className="coinbase-orange">R0B0T$</span>
      {"\u00a0"}
      <span className="forum-rainbow" aria-label="Activate">
        {Array.from("ACT1VAT3").map((ch, i) => (
          <span key={`${ch}-${i}`} style={{ animationDelay: `${(i % 12) * -0.28}s` }}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}
