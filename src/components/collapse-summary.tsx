import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const CTL = "mt-2 inline-flex min-h-11 items-center text-sm font-semibold legal-purple hover:underline";

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
      <button type="button" className={CTL} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? "collapse" : "expand"} {label}
      </button>
    </div>
  );
}

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
    <button type="button" className={cn(CTL, className)} aria-expanded={open} onClick={onToggle}>
      {open ? `collapse ${label}` : `expand ${label} · ${more} more`}
    </button>
  );
}
