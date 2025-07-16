"use client"

// React library for component creation
import * as React from "react"
// Radix UI select primitives for accessible select functionality
import * as SelectPrimitive from "@radix-ui/react-select"
// Icons from Lucide React for select indicators and navigation
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Select Component
 * 
 * The root container for a select dropdown. Manages the overall state and behavior
 * of the select component including open/closed state and value selection.
 * 
 * Features:
 * - Accessible select implementation using Radix UI
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Controlled and uncontrolled modes
 * 
 * @param props - All props from Radix UI Select.Root
 * @returns JSX.Element - The select root component
 * 
 * @example
 * ```tsx
 * <Select value={value} onValueChange={setValue}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

/**
 * SelectGroup Component
 * 
 * Groups related select items together with optional labeling.
 * Useful for organizing options into logical sections.
 * 
 * Features:
 * - Semantic grouping of select options
 * - Works with SelectLabel for group headers
 * - Maintains accessibility relationships
 * 
 * @param props - All props from Radix UI Select.Group
 * @returns JSX.Element - The select group component
 * 
 * @example
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Fruits</SelectLabel>
 *   <SelectItem value="apple">Apple</SelectItem>
 *   <SelectItem value="banana">Banana</SelectItem>
 * </SelectGroup>
 * ```
 */
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

/**
 * SelectValue Component
 * 
 * Displays the currently selected value or placeholder text in the select trigger.
 * Automatically updates when the selection changes.
 * 
 * Features:
 * - Displays selected option text
 * - Shows placeholder when no selection
 * - Automatically handles text truncation
 * - Supports custom formatting
 * 
 * @param props - All props from Radix UI Select.Value
 * @returns JSX.Element - The select value display component
 * 
 * @example
 * ```tsx
 * <SelectTrigger>
 *   <SelectValue placeholder="Select an option..." />
 * </SelectTrigger>
 * ```
 */
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/**
 * SelectTrigger Component
 * 
 * The clickable button that opens the select dropdown. Displays the current
 * selection and provides visual feedback for user interactions.
 * 
 * Features:
 * - Two size variants: default (h-9) and small (h-8)
 * - Focus ring indicators for accessibility
 * - Error state styling with destructive colors
 * - Dark mode support with hover effects
 * - Disabled state handling
 * - Automatic chevron icon inclusion
 * 
 * @param className - Additional CSS classes
 * @param size - Size variant: "sm" | "default"
 * @param children - Content to display (typically SelectValue)
 * @param props - All other props from Radix UI Select.Trigger
 * @returns JSX.Element - The select trigger button
 * 
 * @example
 * ```tsx
 * <SelectTrigger size="sm">
 *   <SelectValue placeholder="Choose..." />
 * </SelectTrigger>
 * ```
 */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger" // Data attribute for styling and testing
      data-size={size} // Size variant data attribute
      className={cn(
        // Base trigger styling with input-like appearance
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        // Size-specific height styling
        "data-[size=default]:h-9 data-[size=sm]:h-8",
        // SelectValue styling and icon handling
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/**
 * SelectContent Component
 * 
 * The dropdown content container that appears when the select is opened.
 * Contains all the selectable options and handles positioning and animations.
 * 
 * Features:
 * - Portal rendering for proper z-index layering
 * - Smooth open/close animations with fade and zoom effects
 * - Automatic positioning relative to trigger
 * - Scroll buttons for long option lists
 * - Responsive sizing based on content
 * - Keyboard navigation support
 * 
 * @param className - Additional CSS classes
 * @param children - Select items, groups, and labels
 * @param position - Positioning strategy: "popper" (default) or "item-aligned"
 * @param props - All other props from Radix UI Select.Content
 * @returns JSX.Element - The select dropdown content
 * 
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectItem value="option1">Option 1</SelectItem>
 *   <SelectItem value="option2">Option 2</SelectItem>
 * </SelectContent>
 * ```
 */
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content" // Data attribute for styling and testing
        className={cn(
          // Base content styling with animations
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          // Popper-specific positioning adjustments
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1", // Base padding for content
            // Popper-specific viewport sizing
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/**
 * SelectLabel Component
 * 
 * A label component for grouping and describing sections of select options.
 * Typically used within SelectGroup to provide context for related items.
 * 
 * Features:
 * - Semantic labeling for option groups
 * - Muted text styling for visual hierarchy
 * - Proper spacing and typography
 * - Accessibility support for screen readers
 * 
 * @param className - Additional CSS classes
 * @param props - All props from Radix UI Select.Label
 * @returns JSX.Element - The select label component
 * 
 * @example
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Categories</SelectLabel>
 *   <SelectItem value="cat1">Category 1</SelectItem>
 *   <SelectItem value="cat2">Category 2</SelectItem>
 * </SelectGroup>
 * ```
 */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label" // Data attribute for styling and testing
      className={cn(
        // Label styling with muted appearance and proper spacing
        "text-muted-foreground px-2 py-1.5 text-xs",
        className
      )}
      {...props}
    />
  )
}

/**
 * SelectItem Component
 * 
 * An individual selectable option within the select dropdown.
 * Displays the option text and shows a check icon when selected.
 * 
 * Features:
 * - Hover and focus states with accent colors
 * - Selected state with check icon indicator
 * - Disabled state support
 * - Keyboard navigation compatibility
 * - Icon support within option text
 * - Proper spacing and alignment
 * 
 * @param className - Additional CSS classes
 * @param children - The option text or content
 * @param props - All props from Radix UI Select.Item (including value)
 * @returns JSX.Element - The select item component
 * 
 * @example
 * ```tsx
 * <SelectItem value="apple">🍎 Apple</SelectItem>
 * <SelectItem value="banana" disabled>🍌 Banana (Out of stock)</SelectItem>
 * ```
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item" // Data attribute for styling and testing
      className={cn(
        // Base item styling with focus and disabled states
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Icon styling and span layout
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      {/* Check icon indicator for selected state */}
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/**
 * SelectSeparator Component
 * 
 * A visual separator line used to divide groups of select options.
 * Provides visual organization within the dropdown content.
 * 
 * Features:
 * - Subtle border styling for visual separation
 * - Proper spacing and alignment
 * - Non-interactive (pointer-events-none)
 * - Consistent with design system borders
 * 
 * @param className - Additional CSS classes
 * @param props - All props from Radix UI Select.Separator
 * @returns JSX.Element - The select separator component
 * 
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectItem value="option1">Option 1</SelectItem>
 *   <SelectSeparator />
 *   <SelectItem value="option2">Option 2</SelectItem>
 * </SelectContent>
 * ```
 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator" // Data attribute for styling and testing
      className={cn(
        // Separator styling with border color and spacing
        "bg-border pointer-events-none -mx-1 my-1 h-px",
        className
      )}
      {...props}
    />
  )
}

/**
 * SelectScrollUpButton Component
 * 
 * A scroll button that appears at the top of the select content when there are
 * more options above the visible area. Allows users to scroll up through options.
 * 
 * Features:
 * - Automatic visibility based on scroll position
 * - Chevron up icon for clear direction indication
 * - Consistent styling with select theme
 * - Keyboard and mouse interaction support
 * 
 * @param className - Additional CSS classes
 * @param props - All props from Radix UI Select.ScrollUpButton
 * @returns JSX.Element - The scroll up button component
 * 
 * @example
 * This component is automatically included in SelectContent and doesn't need
 * to be manually added by developers.
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button" // Data attribute for styling and testing
      className={cn(
        // Button styling with centered icon
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

/**
 * SelectScrollDownButton Component
 * 
 * A scroll button that appears at the bottom of the select content when there are
 * more options below the visible area. Allows users to scroll down through options.
 * 
 * Features:
 * - Automatic visibility based on scroll position
 * - Chevron down icon for clear direction indication
 * - Consistent styling with select theme
 * - Keyboard and mouse interaction support
 * 
 * @param className - Additional CSS classes
 * @param props - All props from Radix UI Select.ScrollDownButton
 * @returns JSX.Element - The scroll down button component
 * 
 * @example
 * This component is automatically included in SelectContent and doesn't need
 * to be manually added by developers.
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button" // Data attribute for styling and testing
      className={cn(
        // Button styling with centered icon
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
