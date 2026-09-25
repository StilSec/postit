"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

//Custom label component to be reused throughout the application
function Label({
  className,
  onMouseDown,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      onMouseDown={(event) => {
        // Replicates Radix's Label behavior: prevent text selection
        // when double-clicking the label, but don't interfere with
        // clicks on interactive elements nested inside the label
        // (e.g. a checkbox/input rendered as a child).
        const target = event.target as HTMLElement
        if (target.closest("button, input, select, textarea")) {
          return
        }

        onMouseDown?.(event)

        // Prevent the default text-selection behavior on double click,
        // but only if the click wasn't already prevented by a handler above.
        if (!event.defaultPrevented && event.detail > 1) {
          event.preventDefault()
        }
      }}
      {...props}
    />
  )
}

export { Label }