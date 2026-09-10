import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Purple expand / collapse for summaries longer than two rows. Leader board + FAQ. */
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
        {open ? "collapse" : "expand"} {label}
      </button>
    </div>
  );
}

/** Purple expand / collapse for long ranked lists so two-column boards stay even. */
export function CollapseMore({
  open,
  onToggle,
  more,
  label,
  className,
}: {
  open: boolean;
  onToggle: () => void;
  more: number;
  label: string;
  className?: string;
}) {
  if (!open && more <= 0) return null;
  return (
    <button
      type="button"
      className={cn(
        "mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-expand hover:underline",
        className,
      )}
      aria-expanded={open}
      onClick={onToggle}
    >
      {open ? `collapse ${label}` : `expand ${label} · ${more} more`}
    </button>
  );
}
