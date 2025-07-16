/**
 * @fileoverview Loading skeleton for the My Journey page
 * 
 * This component provides a comprehensive loading state that mirrors the structure
 * of the actual My Journey page, ensuring a smooth user experience during data fetching.
 * 
 * Features:
 * - Profile header skeleton (avatar, name, email)
 * - Statistics cards skeleton (lessons completed, companions created)
 * - Accordion sections skeleton for organized content
 * - Responsive layout matching the main page
 * - Animated shimmer effects for visual feedback
 * - Consistent spacing and proportions
 * 
 * Layout Structure:
 * - Profile section: User avatar, name, email, and statistics
 * - Accordion sections: Bookmarked companions, recent sessions, my companions
 * - Each section includes appropriate skeleton placeholders
 * 
 * Performance Considerations:
 * - Lightweight skeleton components for fast rendering
 * - Maintains layout stability during loading
 * - Prevents layout shift when real content loads
 * - Uses semantic HTML structure for accessibility
 * 
 * @requires @/components/ui/skeleton - Base skeleton component for loading states
 * @requires @/components/ui/accordion - Accordion components for section organization
 * @requires @/components/CompanionsListSkeleton - Specialized skeleton for companion lists
 */

import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CompanionsListSkeleton from "@/components/CompanionsListSkeleton";

/**
 * MyJourneyLoading - Loading skeleton component for the My Journey page
 * 
 * This component provides a comprehensive loading state that exactly mirrors
 * the structure and layout of the actual My Journey page content.
 * 
 * @returns {JSX.Element} Rendered loading skeleton
 * 
 * Design Principles:
 * - Maintains exact layout structure of the main page
 * - Uses consistent skeleton dimensions for visual stability
 * - Provides appropriate loading states for each content section
 * - Ensures responsive behavior matches the main page
 * 
 * Skeleton Structure:
 * - Profile header: Avatar (110x110), name (48x8), email (64x4)
 * - Statistics cards: Icon (22x22), number (8x8), label (32x4)
 * - Accordion triggers: Section titles with varying widths
 * - Content areas: CompanionsListSkeleton with appropriate row counts
 * 
 * Accessibility:
 * - Maintains semantic structure for screen readers
 * - Preserves focus management during loading
 * - Uses appropriate ARIA attributes through base components
 */
const MyJourneyLoading = () => {
  return (
    // Main container matching the profile page layout
    <main className="lg:min-w-3/4">
      {/* Profile header skeleton section */}
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        {/* Left side: User profile information skeleton */}
        <div className="flex gap-4 items-center">
          {/* User avatar skeleton - circular, matching actual avatar size */}
          <Skeleton className="w-[110px] h-[110px] rounded-full" />
          <div className="flex flex-col gap-2">
            {/* User name skeleton - wider for full name */}
            <Skeleton className="h-8 w-48" />
            {/* Email address skeleton - longer for email format */}
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        
        {/* Right side: Statistics cards skeleton */}
        <div className="flex gap-4">
          {/* Lessons completed card skeleton */}
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              {/* Icon skeleton */}
              <Skeleton className="w-[22px] h-[22px]" />
              {/* Number skeleton */}
              <Skeleton className="h-8 w-8" />
            </div>
            {/* Label skeleton */}
            <Skeleton className="h-4 w-32" />
          </div>
          
          {/* Companions created card skeleton */}
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              {/* Icon skeleton */}
              <Skeleton className="w-[22px] h-[22px]" />
              {/* Number skeleton */}
              <Skeleton className="h-8 w-8" />
            </div>
            {/* Label skeleton */}
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </section>
      
      {/* Accordion sections skeleton with top margin */}
      <Accordion type="multiple" className="mt-8">
        {/* Bookmarked Companions section skeleton */}
        <AccordionItem value="bookmarks">
          <AccordionTrigger className="text-2xl font-bold">
            {/* Section title skeleton - sized for "Bookmarked Companions (X)" */}
            <Skeleton className="h-8 w-64" />
          </AccordionTrigger>
          <AccordionContent>
            {/* Companions list skeleton with 2 rows for bookmarks */}
            <CompanionsListSkeleton title="Bookmarked Companions" rows={2} />
          </AccordionContent>
        </AccordionItem>
        
        {/* Recent Sessions section skeleton */}
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">
            {/* Section title skeleton - sized for "Recent Sessions" */}
            <Skeleton className="h-8 w-48" />
          </AccordionTrigger>
          <AccordionContent>
            {/* Companions list skeleton with 3 rows for recent sessions */}
            <CompanionsListSkeleton title="Recent Sessions" rows={3} />
          </AccordionContent>
        </AccordionItem>
        
        {/* My Companions section skeleton */}
        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">
            {/* Section title skeleton - sized for "My Companions (X)" */}
            <Skeleton className="h-8 w-52" />
          </AccordionTrigger>
          <AccordionContent>
            {/* Companions list skeleton with 2 rows for user companions */}
            <CompanionsListSkeleton title="My Companions" rows={2} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default MyJourneyLoading;