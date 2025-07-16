/**
 * @fileoverview Loading skeleton component for the Companions Library page
 * 
 * This component provides a comprehensive loading state that matches the exact
 * layout and structure of the main companions page, ensuring a smooth user
 * experience during data fetching operations.
 * 
 * Features:
 * - Skeleton placeholders for all page elements
 * - Responsive layout matching the main page design
 * - Consistent visual hierarchy with proper spacing
 * - Animated shimmer effects for better perceived performance
 * - Grid layout for companion card skeletons
 * 
 * Layout Structure:
 * - Page header with title skeleton and filter controls
 * - Search input and subject filter skeleton components
 * - Grid of 6 companion card skeletons for initial load
 * 
 * @requires @/components/CompanionCardSkeleton - Individual companion card loading state
 * @requires @/components/SearchInputSkeleton - Search input loading state
 * @requires @/components/SubjectFilterSkeleton - Subject filter loading state
 * @requires @/components/ui/skeleton - Base skeleton component with animations
 */

import CompanionCardSkeleton from "@/components/CompanionCardSkeleton";
import SearchInputSkeleton from "@/components/SearchInputSkeleton";
import SubjectFilterSkeleton from "@/components/SubjectFilterSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * CompanionsLoading - Loading skeleton component for the companions library page
 * 
 * This component renders skeleton placeholders that mirror the exact layout
 * of the CompanionsLibrary page, providing visual feedback during data loading.
 * 
 * @returns {JSX.Element} Loading skeleton layout matching the main page structure
 * 
 * Design considerations:
 * - Maintains consistent spacing and layout with the actual page
 * - Uses responsive design classes matching the main component
 * - Provides appropriate skeleton dimensions for visual consistency
 * - Renders 6 companion card skeletons as a reasonable initial load expectation
 */
const CompanionsLoading = () => {
    return (
        <main>
            {/* Header section skeleton matching the main page layout */}
            <section className="flex justify-between gap-4 max-sm:flex-col">
                {/* Page title skeleton - sized to match "Companion Library" heading */}
                <Skeleton className="h-12 w-64" />
                
                {/* Filter controls container skeleton */}
                <div className="flex gap-4">
                    {/* Search input skeleton component */}
                    <SearchInputSkeleton />
                    {/* Subject filter dropdown skeleton component */}
                    <SubjectFilterSkeleton />
                </div>
            </section>
            
            {/* Companions grid skeleton section */}
            <section className="companions-grid">
                {/* Generate 6 companion card skeletons for initial loading state */}
                {/* This number provides a good balance between perceived performance and layout */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <CompanionCardSkeleton key={index} />
                ))}
            </section>
        </main>
    );
};

export default CompanionsLoading;