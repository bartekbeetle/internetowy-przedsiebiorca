import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-accent text-white",
        secondary:
          "border-transparent bg-brand-secondary text-slate-100",
        destructive:
          "border-transparent bg-brand-error text-white",
        outline:
          "border-slate-600 text-slate-300",
        success:
          "border-transparent bg-brand-success text-white",
        warning:
          "border-transparent bg-brand-warning text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
