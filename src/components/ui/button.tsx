import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-[opacity,background-color,color,border-color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-brand text-accent-fg hover:bg-brand/90",
        ghost: "bg-transparent text-fg hover:bg-fg/8",
        outline: "border border-rule bg-surface text-fg hover:bg-fg/6",
      },
      size: {
        sm: "h-10 min-h-10 rounded-md px-3",
        md: "h-11 min-h-11 rounded-md px-4",
      },
    },
    defaultVariants: { variant: "outline", size: "sm" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: Props) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
