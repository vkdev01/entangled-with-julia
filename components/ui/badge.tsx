import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border/70 bg-muted/60 text-muted-foreground",
        primary: "border-primary/35 bg-primary/10 text-primary",
        signal: "border-signal/35 bg-signal/10 text-signal",
        ok: "border-ok/35 bg-ok/10 text-ok",
        warn: "border-warn/35 bg-warn/10 text-warn",
        bad: "border-bad/35 bg-bad/10 text-bad",
        outline: "border-border/70 text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
