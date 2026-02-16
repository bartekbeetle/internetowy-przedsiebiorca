import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-brand-accent text-white shadow hover:bg-brand-accent-dark",
        destructive:
          "bg-brand-error text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-slate-600 bg-transparent text-slate-100 shadow-sm hover:bg-slate-800 hover:text-white",
        secondary:
          "bg-brand-secondary text-slate-100 shadow-sm hover:bg-slate-700",
        ghost:
          "text-slate-100 hover:bg-slate-800 hover:text-white",
        link:
          "text-brand-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-lg",
        sm: "h-8 px-4 text-xs rounded-md",
        lg: "h-12 px-8 text-base rounded-lg",
        xl: "h-14 px-10 text-lg font-semibold rounded-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
