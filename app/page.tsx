/* eslint-disable @typescript-eslint/no-unused-vars */
// Individual companion card component for displaying companion information
import CompanionCard from "@/components/CompanionCard";
// List component for displaying multiple companions in a structured format
import CompanionsList from "@/components/CompanionsList";
// Next.js dynamic import for code splitting and lazy loading
import dynamic from "next/dynamic";
// Static data for recent learning sessions (fallback/demo data)
import {recentSessions} from "@/constants";
// Server actions for fetching companion and session data
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
// Utility function for getting subject-specific color schemes
import {getSubjectColor} from "@/lib/utils";

/**
 * Dynamically imported Call-to-Action component
 * 
 * Uses Next.js dynamic imports for:
 * - Code splitting (reduces initial bundle size)
 * - Lazy loading (loads only when needed)
 * - Better performance on the homepage
 * 
 * @constant {React.ComponentType} CTA - Dynamically loaded CTA component
 */
const CTA = dynamic(() => import("@/components/CTA"), {
    loading: () => (
        // Loading skeleton while CTA component is being loaded
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
        </div>
    )
});

/**
 * Homepage Component
 * 
 * The main landing page of the Converso application that displays:
 * - Popular companions (limited to 3 for homepage)
 * - Recently completed learning sessions
 * - Call-to-action section for user engagement
 * 
 * This is a server component that fetches data at build time or request time
 * for optimal SEO and performance.
 * 
 * @async
 * @function Page
 * @returns {Promise<JSX.Element>} The homepage layout with companions and sessions
 */
const Page = async () => {
    // Fetch top 3 companions for the "Popular Companions" section
    const companions = await getAllCompanions({ limit: 3 });
    // Fetch recent 10 learning sessions for the "Recently completed" section
    const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main>
      {/* Main page heading */}
      <h1>Popular Companions</h1>

        {/* Popular Companions Section */}
        <section className="home-section">
            {companions.map((companion) => (
                <CompanionCard
                    key={companion.id}
                    {...companion} // Spread all companion properties
                    color={getSubjectColor(companion.subject)} // Add subject-specific color
                />
            ))}
        </section>

        {/* Recent Sessions and CTA Section */}
        <section className="home-section">
            {/* List of recently completed learning sessions */}
            <CompanionsList
                title="Recently completed sessions"
                companions={recentSessionsCompanions}
                classNames="w-2/3 max-lg:w-full" // Responsive width classes
            />
            {/* Call-to-action component (dynamically loaded) */}
            <CTA />
        </section>
    </main>
  )
}

export default Page