/**
 * @fileoverview SubjectFilterSkeleton component for displaying loading placeholder
 * while the SubjectFilter component is being loaded or data is being fetched.
 */

// UI component for skeleton loading animations
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton component that mimics the SubjectFilter layout
 * Displays an animated placeholder while the actual filter is loading
 * 
 * @component
 * @returns {JSX.Element} A skeleton placeholder matching SubjectFilter dimensions
 * 
 * @features
 * - Matches SubjectFilter component dimensions
 * - Animated loading effect
 * - Rounded corners for visual consistency
 * - Lightweight and fast rendering
 * 
 * @example
 * <SubjectFilterSkeleton />
 * 
 * @example
 * // Conditional rendering based on loading state
 * {isLoading ? <SubjectFilterSkeleton /> : <SubjectFilter />}
 * 
 * @dimensions
 * - Height: 40px (h-10)
 * - Width: 160px (w-40)
 * - Border radius: 8px (rounded-lg)
 */
const SubjectFilterSkeleton = () => {
  return (
    // Skeleton placeholder with dimensions matching SubjectFilter
    <Skeleton className="h-10 w-40 rounded-lg" />
  );
};

export default SubjectFilterSkeleton;