/**
 * Analytics Loading Component
 * 
 * This component provides a comprehensive skeleton loading state for the analytics dashboard.
 * It mirrors the exact layout structure of the actual analytics page to provide seamless
 * loading transitions and maintain visual consistency.
 * 
 * Features:
 * - Responsive grid layouts matching the actual dashboard
 * - Skeleton components with proper sizing and spacing
 * - Consistent visual hierarchy and proportions
 * - Smooth loading animations with pulse effects
 * 
 * Layout Structure:
 * 1. Page Header (title and description skeletons)
 * 2. Stats Cards Grid (4 cards, responsive breakpoints)
 * 3. Charts Grid (2 charts, side-by-side on large screens)
 * 4. Insights Card (detailed content skeleton)
 * 
 * @returns {JSX.Element} Complete skeleton loading state for analytics dashboard
 */
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Analytics Loading Skeleton Component
 * 
 * Provides a pixel-perfect loading state that matches the analytics dashboard layout.
 * Uses the same container, spacing, and grid systems as the actual page.
 * 
 * Responsive Behavior:
 * - Mobile: Single column layout for all elements
 * - Tablet: 2-column grid for stats cards
 * - Desktop: 4-column grid for stats, 2-column for charts
 * 
 * Performance Considerations:
 * - Uses Skeleton component for consistent animations
 * - Minimal DOM elements for fast rendering
 * - Proper key props for React optimization
 */
const AnalyticsLoading = () => {
    return (
        <main className="container mx-auto px-4 py-8">
            {/* Page Header Skeleton */}
            <div className="mb-8">
                {/* Main title skeleton - matches h1 text size */}
                <Skeleton className="h-9 w-64 mb-2" />
                {/* Description skeleton - matches paragraph text */}
                <Skeleton className="h-5 w-96" />
            </div>
            
            {/* Stats Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            {/* Card title skeleton */}
                            <Skeleton className="h-4 w-20" />
                            {/* Card icon skeleton */}
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            {/* Main stat number skeleton */}
                            <Skeleton className="h-8 w-16 mb-2" />
                            {/* Stat description skeleton */}
                            <Skeleton className="h-3 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            {/* Charts Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        {/* Chart title skeleton */}
                        <Skeleton className="h-6 w-32 mb-2" />
                        {/* Chart description skeleton */}
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        {/* Chart area skeleton - matches typical chart height */}
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        {/* Chart title skeleton */}
                        <Skeleton className="h-6 w-32 mb-2" />
                        {/* Chart description skeleton */}
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        {/* Chart area skeleton - matches typical chart height */}
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
            </div>
            
            {/* Insights Card Skeleton */}
            <Card>
                <CardHeader>
                    {/* Insights title skeleton */}
                    <Skeleton className="h-6 w-32 mb-2" />
                    {/* Insights description skeleton */}
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    {/* Insights content skeleton - multiple lines of varying lengths */}
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
};

export default AnalyticsLoading;