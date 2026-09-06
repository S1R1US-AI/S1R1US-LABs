import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Purple Expand for summaries longer than two rows. Leader board + FAQ. */
export function CollapseSummary({
  children,
  className,
  defaultOpen = false,
  label = "summary",
}: {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={className}>
      <div className={cn("text-sm leading-relaxed text-muted", open ? "" : "line-clamp-2")}>{children}</div>
      <button
        type="button"
        className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-expand hover:underline"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Collapse" : "Expand"} {label}
      </button>
    </div>
  );
}
