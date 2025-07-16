"use client"

// React library for component creation
import * as React from "react"
// Radix UI accordion primitives for accessible accordion functionality
import * as AccordionPrimitive from "@radix-ui/react-accordion"
// Chevron down icon from Lucide React for expand/collapse indicator
import { ChevronDownIcon } from "lucide-react"

// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Accordion Component
 * 
 * A collapsible content container that allows users to toggle the visibility of sections.
 * Built on top of Radix UI's accordion primitive for accessibility and keyboard navigation.
 * 
 * Features:
 * - Keyboard navigation support
 * - ARIA attributes for screen readers
 * - Customizable styling through className
 * - Single or multiple item expansion modes
 * 
 * @param props - All props from Radix UI AccordionPrimitive.Root
 * @returns JSX.Element - The accordion container
 * 
 * @example
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content for section 1</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

/**
 * AccordionItem Component
 * 
 * Individual item within an accordion that can be expanded or collapsed.
 * Provides the container for accordion trigger and content.
 * 
 * Features:
 * - Bottom border styling with last item exception
 * - Customizable styling through className
 * - Accessible item identification
 * 
 * @param className - Additional CSS classes to apply
 * @param props - All props from Radix UI AccordionPrimitive.Item
 * @returns JSX.Element - The accordion item container
 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item" // Data attribute for styling identification
      className={cn("border-b last:border-b-0", className)} // Bottom border, removed on last item
      {...props}
    />
  )
}

/**
 * AccordionTrigger Component
 * 
 * Clickable header that toggles the visibility of accordion content.
 * Includes a chevron icon that rotates based on the expanded state.
 * 
 * Features:
 * - Click and keyboard activation
 * - Visual feedback on hover and focus
 * - Animated chevron icon rotation
 * - Accessible button semantics
 * - Disabled state support
 * 
 * @param className - Additional CSS classes to apply
 * @param children - Content to display in the trigger (usually text)
 * @param props - All props from Radix UI AccordionPrimitive.Trigger
 * @returns JSX.Element - The accordion trigger button
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex"> {/* Header wrapper for semantic structure */}
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger" // Data attribute for styling identification
        className={cn(
          // Focus and interaction styles
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          // Chevron rotation when expanded
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children} {/* Trigger content (title/label) */}
        {/* Chevron icon with rotation animation */}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/**
 * AccordionContent Component
 * 
 * Collapsible content area that appears when the accordion item is expanded.
 * Features smooth slide animations for expand/collapse transitions.
 * 
 * Features:
 * - Smooth slide up/down animations
 * - Overflow hidden for clean transitions
 * - Customizable content styling
 * - Proper content padding
 * 
 * @param className - Additional CSS classes to apply to content wrapper
 * @param children - Content to display when accordion is expanded
 * @param props - All props from Radix UI AccordionPrimitive.Content
 * @returns JSX.Element - The accordion content container
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content" // Data attribute for styling identification
      // Animation classes for smooth expand/collapse
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      {/* Content wrapper with padding */}
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
