import {
  COMPANY_X_AVATAR,
  COMPANY_X_HANDLE,
  COMPANY_X_LABEL,
  COMPANY_X_NAME,
  COMPANY_X_URL,
  companyHandleSet,
} from "@/lib/desk/x-admin";
import { cn } from "@/lib/utils";

export function CompanyAvatar({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={COMPANY_X_AVATAR}
      alt={COMPANY_X_LABEL}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full bg-black object-cover", className)}
    />
  );
}

/** Hidden until a live (non-blocked) company handle is set. */
export function CompanyXChip({ className }: { className?: string }) {
  if (!companyHandleSet() || !COMPANY_X_URL) return null;
  return (
    <a
      href={COMPANY_X_URL}
      target="_blank"
      rel="noreferrer"
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={`${COMPANY_X_NAME || COMPANY_X_LABEL} on X`}
    >
      <CompanyAvatar size={28} className="h-7 w-7 ring-1 ring-rule" />
      <span className="leading-tight">
        <span className="block text-xs font-bold tracking-tight text-fg">
          {COMPANY_X_NAME || COMPANY_X_LABEL}
        </span>
        <span className="block font-mono text-[10px] text-muted">{COMPANY_X_HANDLE}</span>
      </span>
    </a>
  );
}
