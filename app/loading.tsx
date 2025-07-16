/**
 * @fileoverview Main loading skeleton component for the home page
 * 
 * This component provides a loading skeleton that matches the layout and structure
 * of the main home page, ensuring a smooth user experience during data fetching.
 * 
 * Features:
 * - Skeleton placeholders for all main page sections
 * - Responsive design matching the actual page layout
 * - Shimmer effects for visual feedback
 * - Consistent spacing and dimensions
 * - Prevents layout shift during loading
 * 
 * Layout Structure:
 * - Page title skeleton
 * - Popular companions section with card skeletons
 * - Recently completed sessions with list skeleton
 * - Call-to-action section with branded skeleton elements
 * 
 * Performance:
 * - Lightweight component with minimal rendering overhead
 * - Uses reusable skeleton components for consistency
 * - Optimized for fast initial render
 * 
 * @requires @/components/ui/skeleton - Base skeleton component
 * @requires @/components/CompanionCardSkeleton - Companion card loading state
 * @requires @/components/CompanionsListSkeleton - Companions list loading state
 */

import { Skeleton } from "@/components/ui/skeleton";
import CompanionCardSkeleton from "@/components/CompanionCardSkeleton";
import CompanionsListSkeleton from "@/components/CompanionsListSkeleton";

/**
 * MainLoading - Loading skeleton for the main home page
 * 
 * This component renders skeleton placeholders that mirror the structure
 * of the actual home page, providing visual feedback during data loading.
 * 
 * @returns {JSX.Element} Rendered loading skeleton matching home page layout
 * 
 * Structure:
 * - Page title placeholder
 * - Popular companions grid with 3 card skeletons
 * - Recently completed sessions section with list skeleton
 * - Call-to-action section with branded skeleton elements
 * 
 * Design Principles:
 * - Maintains exact layout dimensions of actual content
 * - Uses consistent spacing and styling
 * - Provides visual hierarchy through skeleton sizing
 * - Includes responsive behavior for different screen sizes
 * 
 * Accessibility:
 * - Semantic HTML structure
 * - Proper contrast for skeleton elements
 * - Screen reader friendly loading states
 */
const MainLoading = () => {
    return (
        <main>
            {/* Page title skeleton - matches main heading dimensions */}
            <Skeleton className="h-8 w-48 mb-6" />

            {/* Popular companions section - displays 3 companion card skeletons */}
            <section className="home-section">
                {Array.from({ length: 3 }).map((_, index) => (
                    <CompanionCardSkeleton key={index} />
                ))}
            </section>

            {/* Recently completed sessions section with responsive layout */}
            <section className="home-section">
                {/* Main content area - sessions list */}
                <div className="w-2/3 max-lg:w-full">
                    {/* Section title skeleton */}
                    <Skeleton className="h-8 w-64 mb-4" />
                    {/* Sessions list skeleton with 2 rows */}
                    <CompanionsListSkeleton rows={2} />
                </div>
                
                {/* Call-to-action section skeleton with branded styling */}
                <div className="cta-section">
                    {/* CTA badge skeleton */}
                    <Skeleton className="h-6 w-32 bg-cta-gold/20" />
                    {/* CTA heading skeleton */}
                    <Skeleton className="h-8 w-48 bg-white/20" />
                    {/* CTA description lines */}
                    <Skeleton className="h-6 w-full bg-white/10" />
                    <Skeleton className="h-6 w-3/4 bg-white/10" />
                    {/* CTA button skeleton */}
                    <Skeleton className="h-10 w-40 bg-white/20 mt-4" />
                </div>
            </section>
        </main>
    );
};

export default MainLoading;