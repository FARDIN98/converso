// React library for component creation
import * as React from "react"
// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Textarea Component
 * 
 * A flexible, accessible textarea component for multi-line text input.
 * Provides consistent styling and enhanced user experience features.
 * 
 * Features:
 * - Auto-sizing content with minimum height
 * - Consistent border radius and padding
 * - Focus states with ring indicators
 * - Error states with destructive styling
 * - Dark mode support
 * - Disabled state handling
 * - Responsive text sizing
 * - Smooth transitions
 * - Placeholder text styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional textarea props
 * @returns {JSX.Element} Styled textarea element
 * 
 * @example
 * // Basic textarea
 * <Textarea placeholder="Enter your message..." />
 * 
 * // Textarea with custom styling and rows
 * <Textarea 
 *   className="h-32" 
 *   placeholder="Write your story..." 
 *   rows={5}
 * />
 * 
 * // Controlled textarea
 * <Textarea 
 *   value={message} 
 *   onChange={(e) => setMessage(e.target.value)}
 *   placeholder="Type here..."
 * />
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea" // Data attribute for styling and testing
      className={cn(
        // Base textarea styling with auto-sizing and responsive design
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

// Export Textarea component for use throughout the application
export { Textarea }
