/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

// Next.js navigation hooks for routing and URL manipulation
import {usePathname, useRouter, useSearchParams} from "next/navigation";
// React hooks for state management and side effects
import {useEffect, useState} from "react";
// Next.js optimized image component
import Image from "next/image";
// Utility functions for URL query manipulation
import {formUrlQuery, removeKeysFromUrlQuery} from "@jsmastery/utils";

/**
 * SearchInput Component
 * 
 * A debounced search input component that allows users to search for companions.
 * Features:
 * - Real-time search with 500ms debounce to prevent excessive API calls
 * - URL synchronization - search terms are reflected in the URL as 'topic' parameter
 * - Automatic URL cleanup when search is cleared on companions page
 * - Responsive design with search icon
 * 
 * @returns {JSX.Element} Rendered search input component
 */
const SearchInput = () => {
    // Get current pathname to check if we're on companions page
    const pathname = usePathname();
    // Router instance for programmatic navigation
    const router = useRouter();
    // Current URL search parameters
    const searchParams = useSearchParams();
    // Get existing topic query parameter (not currently used but available)
    const query = searchParams.get('topic') || '';

    // Local state for search input value
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Effect hook for debounced search functionality
     * 
     * This effect runs whenever searchQuery, router, searchParams, or pathname changes.
     * It implements a 500ms debounce to prevent excessive URL updates and API calls.
     * 
     * Behavior:
     * - If search query has content: adds/updates 'topic' parameter in URL
     * - If search query is empty and on companions page: removes 'topic' parameter
     * - Uses scroll: false to prevent page scroll on navigation
     */
    useEffect(() => {
        // Create debounce timer with 500ms delay
        const delayDebounceFn = setTimeout(() => {
            // Check if search query has actual content (not just whitespace)
            if(searchQuery.trim()) {
                // Create new URL with search query as 'topic' parameter
                const newUrl = formUrlQuery({
                    params: searchParams.toString(), // Current URL parameters
                    key: "topic", // Parameter key for search
                    value: searchQuery.trim(), // Trimmed search value
                });

                // Navigate to new URL without scrolling to top
                router.push(newUrl, { scroll: false });
            } else {
                // Only remove topic parameter if we're on the companions page
                // This prevents unwanted parameter removal on other pages
                if(pathname === '/companions') {
                    // Remove 'topic' parameter from URL when search is cleared
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["topic"], // Remove topic parameter
                    });

                    // Navigate to cleaned URL
                    router.push(newUrl, { scroll: false });
                }
            }
        }, 500) // 500ms debounce delay

        // Cleanup function to clear timeout on component unmount or dependency change
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, router, searchParams, pathname]); // Dependencies for effect

    return (
        // Container with border, rounded corners, and flex layout
        <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">
            {/* Search icon using Next.js Image component for optimization */}
            <Image src="/icons/search.svg" alt="search" width={15} height={15} />
            {/* Search input field */}
            <input
                placeholder="Search companions..." // Placeholder text for user guidance
                className="outline-none" // Remove default browser outline
                value={searchQuery} // Controlled input value
                onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
            />
        </div>
    )
}

// Export component as default export
export default SearchInput
