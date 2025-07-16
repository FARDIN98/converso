// React library for component creation
import * as React from "react"
// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Input Component
 * 
 * A flexible, accessible input component with consistent styling across the application.
 * Supports all native input types and provides enhanced visual feedback.
 * 
 * Features:
 * - All native HTML input types support
 * - Consistent border radius and padding
 * - Focus states with ring indicators
 * - Error states with destructive styling
 * - File input styling
 * - Dark mode support
 * - Disabled state handling
 * - Responsive text sizing
 * - Smooth transitions
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type] - Input type (text, email, password, etc.)
 * @param {...any} props.props - Additional input props
 * @returns {JSX.Element} Styled input element
 * 
 * @example
 * // Basic text input
 * <Input type="text" placeholder="Enter your name" />
 * 
 * // Email input with custom styling
 * <Input type="email" className="w-full" placeholder="your@email.com" />
 * 
 * // Password input
 * <Input type="password" placeholder="Enter password" />
 * 
 * // File input
 * <Input type="file" accept=".pdf,.doc,.docx" />
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input" // Data attribute for styling and testing
      className={cn(
        // Base input styling with file input support
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Focus state styling
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // Error/invalid state styling
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

// Export Input component for use throughout the application
export { Input }
