import * as React from "react";

import { cn } from "@/lib/utils";

const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "bg-background py-6 text-foreground sm:py-16 size md:py-20",
      className
    )}
    {...props}
  />
));
Section.displayName = "Section";

export { Section };
