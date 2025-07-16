/**
 * @fileoverview Companions Library page component for displaying and filtering learning companions
 * 
 * This page provides a comprehensive interface for browsing available learning companions
 * with advanced filtering capabilities and personalized bookmarking features.
 * 
 * Features:
 * - Server-side rendering for optimal SEO and performance
 * - Dynamic filtering by subject and topic via URL search parameters
 * - User authentication integration with Clerk
 * - Personalized bookmark status for authenticated users
 * - Responsive grid layout for companion cards
 * - Real-time search and filter functionality
 * 
 * @requires @/lib/actions/companion.actions - Server actions for companion data
 * @requires @/components/CompanionCard - Individual companion display component
 * @requires @/lib/utils - Utility functions for styling and data processing
 * @requires @/components/SearchInput - Search functionality component
 * @requires @/components/SubjectFilter - Subject filtering component
 * @requires @clerk/nextjs/server - Authentication and user management
 */

import {getAllCompanions, getBookmarkedCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import {getSubjectColor} from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { currentUser } from "@clerk/nextjs/server";

/**
 * CompanionsLibrary - Main page component for the companions library
 * 
 * This async server component handles the display of all available learning companions
 * with filtering, search, and personalized bookmark functionality.
 * 
 * @param {SearchParams} props - Component props containing search parameters
 * @param {Promise<{ [key: string]: string | string[] | undefined }>} props.searchParams - URL search parameters for filtering
 * 
 * @returns {Promise<JSX.Element>} Rendered companions library page
 * 
 * Functionality:
 * - Extracts subject and topic filters from URL search parameters
 * - Fetches current authenticated user information
 * - Retrieves filtered companions based on search criteria
 * - Loads user's bookmarked companions for personalization
 * - Creates optimized lookup set for bookmark status checking
 * - Renders responsive layout with search/filter controls and companion grid
 * 
 * Performance optimizations:
 * - Uses Set for O(1) bookmark lookup instead of array.includes()
 * - Server-side rendering for faster initial page load
 * - Conditional bookmark fetching only for authenticated users
 */
const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    // Extract and normalize filter parameters from URL search params
    // Await the searchParams promise to access the actual parameter values
    const filters = await searchParams;
    const subject = filters.subject ? filters.subject : '';
    const topic = filters.topic ? filters.topic : '';
    
    // Get current authenticated user for personalized features
    const user = await currentUser();
    
    // Fetch companions based on applied filters (subject and/or topic)
    const companions = await getAllCompanions({ subject, topic });
    
    // Fetch user's bookmarked companions only if user is authenticated
    // Returns empty array for unauthenticated users to prevent errors
    const bookmarkedCompanions = user ? await getBookmarkedCompanions(user.id) : [];
    
    // Create a Set of bookmarked companion IDs for efficient O(1) lookup
    // This optimization prevents O(n) array.includes() calls in the render loop
    const bookmarkedIds = new Set(bookmarkedCompanions.map(comp => comp.id));

    return (
        <main>
            {/* Page header section with title and filter controls */}
            <section className="flex justify-between gap-4 max-sm:flex-col">
                {/* Main page title */}
                <h1>Companion Library</h1>
                
                {/* Filter and search controls container */}
                <div className="flex gap-4">
                    {/* Real-time search input for filtering by topic/name */}
                    <SearchInput />
                    {/* Subject filter dropdown for category-based filtering */}
                    <SubjectFilter />
                </div>
            </section>
            
            {/* Companions display grid section */}
            <section className="companions-grid">
                {/* Render each companion as a card with personalized bookmark status */}
                {companions.map((companion) => (
                    <CompanionCard
                        key={companion.id}
                        {...companion}
                        color={getSubjectColor(companion.subject)}
                        bookmarked={bookmarkedIds.has(companion.id)}
                    />
                ))}
            </section>
        </main>
    )
}

export default CompanionsLibrary
