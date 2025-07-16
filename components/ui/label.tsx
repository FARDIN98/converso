"use client"

// React library for component creation
import * as React from "react"
// Radix UI label primitive for accessible label functionality
import * as LabelPrimitive from "@radix-ui/react-label"

// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Label Component
 * 
 * An accessible label component that provides proper form field labeling.
 * Built on top of Radix UI's label primitive for enhanced accessibility.
 * 
 * Features:
 * - Proper form field association
 * - Disabled state styling
 * - Flexible layout with gap support
 * - Screen reader compatibility
 * - Peer element interaction support
 * 
 * @param className - Additional CSS classes to apply
 * @param props - All props from Radix UI LabelPrimitive.Root
 * @returns JSX.Element - The label element
 * 
 * @example
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 * ```
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label" // Data attribute for styling identification
      className={cn(
        // Base styling: flex layout with gap, typography, and user interaction
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        // Group disabled state styling
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        // Peer disabled state styling (for associated form elements)
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
