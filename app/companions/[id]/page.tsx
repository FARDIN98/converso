/**
 * @fileoverview Individual Companion Session page component
 * 
 * This page handles the display and interaction with a specific learning companion,
 * providing a dedicated chat interface for educational conversations.
 * 
 * Features:
 * - Dynamic route handling for companion IDs
 * - Client-side rendering for real-time chat functionality
 * - User authentication and authorization checks
 * - Dynamic component loading with loading states
 * - Responsive companion information display
 * - Error handling and navigation fallbacks
 * 
 * Security:
 * - Requires user authentication to access companion sessions
 * - Validates companion existence before rendering
 * - Handles invalid companion IDs gracefully
 * 
 * Performance:
 * - Dynamic imports for code splitting
 * - Loading states for better user experience
 * - Optimized image loading with Next.js Image component
 * 
 * @requires @/lib/actions/companion.actions - Server actions for companion data
 * @requires @clerk/nextjs - User authentication and management
 * @requires next/navigation - Client-side navigation utilities
 * @requires @/lib/utils - Utility functions for styling
 * @requires next/image - Optimized image component
 * @requires next/dynamic - Dynamic component loading
 * @requires react - React hooks for state management
 */

"use client";

import {getCompanion} from "@/lib/actions/companion.actions";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {getSubjectColor} from "@/lib/utils";
import Image from "next/image";
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";

// Dynamic import for the main companion chat component
// This enables code splitting and reduces initial bundle size
const CompanionComponent = dynamic(() => import("@/components/CompanionComponent"), {
    // Loading component displayed while the main component loads
    loading: () => (
        <div className="companion-chat-container">
            <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Loading companion...</div>
            </div>
        </div>
    ),
    // Disable server-side rendering for this component due to client-side dependencies
    ssr: false
});

/**
 * Companion interface defining the structure of companion data
 * 
 * This interface ensures type safety for companion objects throughout
 * the component and provides clear documentation of expected properties.
 */
interface Companion {
    id: string;                    // Unique identifier for the companion
    name: string;                  // Display name of the companion
    subject: string;               // Academic subject (e.g., "Math", "Science")
    topic: string;                 // Specific topic within the subject
    duration: number;              // Expected session duration in minutes
    description?: string;          // Optional detailed description
    instructions?: string;         // Optional AI instructions for behavior
    seed?: string;                 // Optional seed for AI consistency
    src?: string;                  // Optional source/reference material
    userId?: string;               // Optional creator user ID
    userName?: string;             // Optional creator username
    createdAt?: Date;             // Optional creation timestamp
    updatedAt?: Date;             // Optional last update timestamp
    _count?: {                    // Optional message count metadata
        messages: number;
    };
}

/**
 * Props interface for the CompanionSession component
 * 
 * Defines the expected structure of props passed from Next.js routing system
 * for dynamic route parameters.
 */
interface CompanionSessionPageProps {
    params: Promise<{ id: string}>; // Dynamic route parameter containing companion ID
}

/**
 * CompanionSession - Main component for individual companion interaction pages
 * 
 * This component manages the entire lifecycle of a companion session, from
 * initial loading and authentication to rendering the interactive chat interface.
 * 
 * @param {CompanionSessionPageProps} props - Component props
 * @param {Promise<{ id: string }>} props.params - Dynamic route parameters
 * 
 * @returns {JSX.Element} Rendered companion session page
 * 
 * State Management:
 * - companion: Stores the fetched companion data
 * - loading: Tracks the loading state during data fetching
 * - id: Stores the resolved companion ID from route parameters
 * 
 * Effects:
 * - Parameter resolution and data fetching effect
 * - Authentication and validation effect
 * 
 * Security Features:
 * - Redirects unauthenticated users to sign-in page
 * - Validates companion existence and redirects on invalid IDs
 * - Error handling for failed data fetching
 */
const CompanionSession = ({ params }: CompanionSessionPageProps) => {
    // Get current authenticated user information
    const { user } = useUser();
    // Router instance for programmatic navigation
    const router = useRouter();
    
    // Component state management
    const [companion, setCompanion] = useState<Companion | null>(null);  // Companion data
    const [loading, setLoading] = useState(true);                        // Loading state
    const [id, setId] = useState<string>('');                           // Companion ID

    // Effect for resolving route parameters and fetching companion data
    useEffect(() => {
        /**
         * Async function to handle parameter resolution and data fetching
         * 
         * This function:
         * 1. Resolves the Promise-based params to get the companion ID
         * 2. Fetches companion data from the database
         * 3. Handles errors gracefully with navigation fallbacks
         * 4. Updates loading state appropriately
         */
        const getParamsAndData = async () => {
            try {
                // Resolve the Promise-based params to get actual values
                const resolvedParams = await params;
                const companionId = resolvedParams.id;
                setId(companionId);
                
                // Fetch companion data using the resolved ID
                const companionData = await getCompanion(companionId);
                setCompanion(companionData);
            } catch (error) {
                // Log error and redirect to companions list on failure
                console.error('Error fetching companion:', error);
                router.push('/companions');
            } finally {
                // Always update loading state regardless of success/failure
                setLoading(false);
            }
        };

        getParamsAndData();
    }, [params, router]);

    // Effect for authentication and data validation
    useEffect(() => {
        // Redirect unauthenticated users to sign-in page
        if (!user && !loading) {
            router.push('/sign-in');
        }
        
        // Redirect if companion data is invalid (exists but has no name)
        if (companion && !companion.name) {
            router.push('/companions');
        }
    }, [user, companion, loading, router]);

    // Loading state - show spinner while fetching data or validating user
    if (loading || !companion || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    {/* Animated loading spinner */}
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading companion...</p>
                </div>
            </div>
        );
    }

    // Extract companion properties for easier access
    const { name, subject, topic, duration } = companion;

    return (
        <main>
            {/* Companion information header section */}
            <article className="flex rounded-border justify-between p-6 max-md:flex-col">
                {/* Left side: Companion details with icon and text */}
                <div className="flex items-center gap-2">
                    {/* Subject icon with dynamic background color */}
                    <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
                    </div>

                    {/* Companion name and topic information */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {/* Companion name as main heading */}
                            <p className="font-bold text-2xl">
                                {name}
                            </p>
                            {/* Subject badge (hidden on small screens) */}
                            <div className="subject-badge max-sm:hidden">
                                {subject}
                            </div>
                        </div>
                        {/* Topic description */}
                        <p className="text-lg">{topic}</p>
                    </div>
                </div>
                
                {/* Right side: Duration information (hidden on mobile) */}
                <div className="items-start text-2xl max-md:hidden">
                    {duration} minutes
                </div>
            </article>

            {/* Main companion chat interface */}
            <CompanionComponent
                {...companion}
                companionId={id}
                userName={user.firstName!}
                userImage={user.imageUrl!}
            />
        </main>
    )
}

export default CompanionSession
