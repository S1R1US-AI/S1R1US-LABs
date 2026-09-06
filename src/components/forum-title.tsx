import { FORUM_AGENTS, MENU_FORUM, TAB_HOVER_FORUM } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Menu / page title: W1S3 0WL$ + rainbow bold Forum. */
export function ForumTitle({ className, size = "nav" }: { className?: string; size?: "nav" | "hero" }) {
  return (
    <span
      className={cn("forum-title", size === "hero" && "forum-title-hero", className)}
      title={TAB_HOVER_FORUM}
      aria-label={MENU_FORUM}
    >
      <span className="forum-owls">{FORUM_AGENTS}</span>
      {"\u00a0"}
      <span className="forum-rainbow" aria-label="Forum">
        {Array.from("Forum").map((ch, i) => (
          <span key={`${ch}-${i}`} style={{ animationDelay: `${(i % 12) * -0.28}s` }}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}
