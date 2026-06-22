import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold uppercase tracking-wide ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Rosso Ferrari primary CTA
        default:
          "bg-rosso text-white shadow-[0_8px_30px_rgba(255,40,0,0.25)] hover:bg-rosso-dark hover:shadow-[0_10px_40px_rgba(255,40,0,0.45)] hover:-translate-y-0.5",
        // Gold / premium accent
        gold: "bg-gold text-noir hover:bg-gold-dark hover:-translate-y-0.5",
        outline:
          "border border-white/20 bg-transparent text-white hover:border-rosso hover:text-rosso hover:bg-rosso/5",
        secondary:
          "bg-carbon text-blanc hover:bg-carbon-light hover:-translate-y-0.5",
        ghost: "text-white hover:bg-white/5 hover:text-rosso",
        link: "text-rosso underline-offset-4 hover:underline normal-case tracking-normal",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-9 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
