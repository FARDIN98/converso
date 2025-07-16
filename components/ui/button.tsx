// React library for component creation
import * as React from "react"
// Radix UI Slot component for polymorphic behavior
import { Slot } from "@radix-ui/react-slot"
// Class Variance Authority for type-safe variant styling
import { cva, type VariantProps } from "class-variance-authority"
// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Button component variants using Class Variance Authority (CVA)
 * 
 * Defines all possible button styles and sizes with consistent design tokens.
 * Includes accessibility features, focus states, and dark mode support.
 * 
 * @constant {VariantProps} buttonVariants - CVA configuration for button styling
 */
const buttonVariants = cva(
  // Base styles applied to all button variants
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary button style (default)
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        // Destructive actions (delete, remove, etc.)
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // Outlined button with border
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        // Secondary button style
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        // Ghost button (minimal styling)
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        // Link-styled button
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Standard button size
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        // Small button size
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        // Large button size
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        // Square icon button
        icon: "size-9",
      },
    },
    // Default variant and size when none specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button Component
 * 
 * A flexible, accessible button component with multiple variants and sizes.
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Different sizes (sm, default, lg, icon)
 * - Polymorphic behavior via asChild prop
 * - Full accessibility support with ARIA attributes
 * - Dark mode support
 * - Focus management and keyboard navigation
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.variant="default"] - Button visual variant
 * @param {string} [props.size="default"] - Button size
 * @param {boolean} [props.asChild=false] - Render as child element instead of button
 * @param {...any} props.props - Additional button props
 * @returns {JSX.Element} Styled button component
 * 
 * @example
 * // Basic button
 * <Button>Click me</Button>
 * 
 * // Destructive button
 * <Button variant="destructive">Delete</Button>
 * 
 * // Large outline button
 * <Button variant="outline" size="lg">Large Button</Button>
 * 
 * // Icon button
 * <Button variant="ghost" size="icon"><Icon /></Button>
 * 
 * // As a link (polymorphic)
 * <Button asChild><Link href="/">Home</Link></Button>
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  // Use Slot for polymorphic behavior or regular button element
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button" // Data attribute for styling and testing
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
