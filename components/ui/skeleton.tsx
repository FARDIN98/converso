// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Skeleton Component
 * 
 * A loading placeholder component that displays an animated shimmer effect
 * while content is being loaded. Provides visual feedback to users during
 * data fetching or processing.
 * 
 * Features:
 * - Pulse animation for loading indication
 * - Rounded corners for modern appearance
 * - Muted background color
 * - Custom shimmer effect
 * - Flexible sizing through className
 * - Accessible loading state
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes for custom sizing
 * @param {...any} props.props - Additional div props
 * @returns {JSX.Element} Animated skeleton placeholder
 * 
 * @example
 * // Basic skeleton
 * <Skeleton className="h-4 w-full" />
 * 
 * // Card skeleton
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-3/4" />
 *   <Skeleton className="h-4 w-1/2" />
 *   <Skeleton className="h-8 w-full" />
 * </div>
 * 
 * // Avatar skeleton
 * <Skeleton className="h-12 w-12 rounded-full" />
 * 
 * // Button skeleton
 * <Skeleton className="h-9 w-24" />
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted skeleton-shimmer", // Base skeleton styling with animation
        className
      )}
      {...props}
    />
  )
}

// Export Skeleton component for use throughout the application
export { Skeleton }