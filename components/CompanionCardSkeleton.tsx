/**
 * Skeleton component for loading states and placeholder content
 */
import { Skeleton } from "@/components/ui/skeleton";

/**
 * CompanionCardSkeleton Component
 * 
 * A loading skeleton component that mimics the structure of a CompanionCard
 * while data is being fetched. Provides visual feedback to users during
 * loading states with animated placeholder elements.
 * 
 * Features:
 * - Matches CompanionCard layout structure
 * - Responsive skeleton elements
 * - Dark mode support with theme-aware styling
 * - Smooth loading animations
 * - Accessible loading state indication
 * 
 * @component
 * @returns {JSX.Element} Rendered skeleton placeholder for companion card
 * 
 * @example
 * ```tsx
 * // Display while loading companion data
 * {isLoading ? (
 *   <CompanionCardSkeleton />
 * ) : (
 *   <CompanionCard companion={companion} />
 * )}
 * 
 * // In a list of loading companions
 * {Array.from({ length: 6 }).map((_, index) => (
 *   <CompanionCardSkeleton key={index} />
 * ))}
 * ```
 */
const CompanionCardSkeleton = () => {
  return (
    // Main card container with theme-aware background
    <article className="companion-card bg-gray-100 dark:bg-gray-800">
      {/* Header section with subject badge and bookmark icon */}
      <div className="flex justify-between items-center">
        {/* Subject badge skeleton */}
        <Skeleton className="h-6 w-20" />
        {/* Bookmark icon skeleton */}
        <Skeleton className="h-4 w-4" />
      </div>

      {/* Companion name skeleton - takes 3/4 width */}
      <Skeleton className="h-8 w-3/4 mt-4" />
      
      {/* Description skeleton - full width */}
      <Skeleton className="h-4 w-full mt-2" />
      
      {/* Stats section with icon and text */}
      <div className="flex items-center gap-2 mt-3">
        {/* Stats icon skeleton */}
        <Skeleton className="h-3 w-3" />
        {/* Stats text skeleton */}
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Action button skeleton - full width with rounded corners */}
      <Skeleton className="h-10 w-full mt-4 rounded-lg" />
    </article>
  );
};

export default CompanionCardSkeleton;