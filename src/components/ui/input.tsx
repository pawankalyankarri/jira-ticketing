import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base",
        "border border-gray-300",
        "focus:border-2 focus:border-gray-400",
        "hover:border-gray-300 hover:bg-transparent",
        "shadow-none outline-none",
        className
      )}
      {...props}
    />
  );
}

export { Input };
