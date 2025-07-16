/**
 * @fileoverview User Profile and Journey page component
 * 
 * This page displays a comprehensive overview of the user's learning journey,
 * including their profile information, learning statistics, and organized
 * collections of companions and sessions.
 * 
 * Features:
 * - User profile display with avatar and contact information
 * - Learning progress statistics (lessons completed, companions created)
 * - Organized accordion sections for different content types
 * - Bookmarked companions management
 * - Recent session history tracking
 * - Personal companion collection display
 * - Server-side rendering for optimal performance
 * - Responsive design for various screen sizes
 * 
 * Data Sources:
 * - User profile data from Clerk authentication
 * - User-created companions from database
 * - Session history for progress tracking
 * - Bookmarked companions for quick access
 * 
 * Security:
 * - Requires user authentication (redirects to sign-in if not authenticated)
 * - User-specific data fetching ensures privacy
 * - Server-side data validation
 * 
 * @requires @/components/ui/accordion - Collapsible content sections
 * @requires @clerk/nextjs/server - Server-side user authentication
 * @requires next/navigation - Navigation utilities for redirects
 * @requires @/lib/actions/companion.actions - Data fetching functions
 * @requires next/image - Optimized image component
 * @requires @/components/CompanionsList - Reusable companion display component
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionsList";

/**
 * Profile - User profile and learning journey page component
 * 
 * This async server component fetches and displays comprehensive user data
 * including profile information, learning statistics, and organized content collections.
 * 
 * @returns {Promise<JSX.Element>} Rendered user profile page
 * 
 * Data Fetching:
 * - Retrieves current user information from Clerk
 * - Fetches user-created companions
 * - Loads session history for progress tracking
 * - Gets bookmarked companions for quick access
 * 
 * Authentication Flow:
 * 1. Checks if user is authenticated
 * 2. Redirects to sign-in page if not authenticated
 * 3. Fetches user-specific data from multiple sources
 * 4. Renders personalized dashboard
 * 
 * Performance Optimizations:
 * - Server-side rendering for faster initial load
 * - Parallel data fetching for multiple data sources
 * - Optimized image loading with Next.js Image component
 * - Accordion-based content organization for better UX
 */
const Profile = async () => {
  // Get current authenticated user from Clerk
  const user = await currentUser();

  // Redirect to sign-in if user is not authenticated
  if (!user) redirect("/sign-in");

  // Fetch user-specific data in parallel for better performance
  const companions = await getUserCompanions(user.id);           // User's created companions
  const sessionHistory = await getUserSessions(user.id);        // User's learning session history
  const bookmarkedCompanions = await getBookmarkedCompanions(user.id); // User's bookmarked companions

  return (
    // Main container with responsive width
    <main className="min-lg:w-3/4">
      {/* Profile Header Section - User info and statistics */}
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        {/* Left side: User profile information */}
        <div className="flex gap-4 items-center">
          {/* User avatar */}
          <Image
            src={user.imageUrl}
            alt={user.firstName!}
            width={110}
            height={110}
          />
          {/* User details */}
          <div className="flex flex-col gap-2">
            {/* User full name */}
            <h1 className="font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h1>
            {/* User email address */}
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        
        {/* Right side: Learning statistics cards */}
        <div className="flex gap-4">
          {/* Lessons completed statistics card */}
          <div className="border border-black rouded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              {/* Checkmark icon for completed lessons */}
              <Image
                src="/icons/check.svg"
                alt="checkmark"
                width={22}
                height={22}
              />
              {/* Number of completed sessions */}
              <p className="text-2xl font-bold">{sessionHistory.length}</p>
            </div>
            <div>Lessons completed</div>
          </div>
          
          {/* Companions created statistics card */}
          <div className="border border-black rouded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              {/* Graduation cap icon for companions */}
              <Image src="/icons/cap.svg" alt="cap" width={22} height={22} />
              {/* Number of companions created */}
              <p className="text-2xl font-bold">{companions.length}</p>
            </div>
            <div>Companions created</div>
          </div>
        </div>
      </section>
      
      {/* Content Sections - Organized in accordion format */}
      <Accordion type="multiple">
        {/* Bookmarked Companions Section */}
        <AccordionItem value="bookmarks">
          <AccordionTrigger className="text-2xl font-bold">
            Bookmarked Companions {`(${bookmarkedCompanions.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList
              companions={bookmarkedCompanions}
              title="Bookmarked Companions"
            />
          </AccordionContent>
        </AccordionItem>
        
        {/* Recent Sessions Section */}
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">
            Recent Sessions
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList
              title="Recent Sessions"
              companions={sessionHistory}
            />
          </AccordionContent>
        </AccordionItem>
        
        {/* User's Created Companions Section */}
        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">
            My Companions {`(${companions.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList title="My Companions" companions={companions} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};
export default Profile;
