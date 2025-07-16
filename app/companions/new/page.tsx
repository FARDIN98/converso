/**
 * @fileoverview New Companion Creation page component
 * 
 * This page provides an interface for authenticated users to create new learning companions,
 * with built-in permission checking and subscription-based limitations.
 * 
 * Features:
 * - User authentication requirement
 * - Permission-based access control
 * - Subscription tier validation
 * - Responsive companion creation form
 * - Upgrade prompts for limited users
 * - Server-side rendering for security
 * 
 * Access Control:
 * - Requires user authentication (redirects to sign-in if not authenticated)
 * - Checks companion creation permissions based on subscription tier
 * - Displays upgrade prompt for users who have reached their limit
 * 
 * User Experience:
 * - Clean, centered layout for the creation form
 * - Visual feedback for permission limitations
 * - Clear call-to-action for subscription upgrades
 * - Responsive design for various screen sizes
 * 
 * @requires @/components/CompanionForm - Main companion creation form component
 * @requires @clerk/nextjs/server - Server-side authentication utilities
 * @requires next/navigation - Navigation utilities for redirects
 * @requires @/lib/actions/companion.actions - Permission checking functions
 * @requires next/image - Optimized image component
 * @requires next/link - Client-side navigation component
 */

import CompanionForm from "@/components/CompanionForm";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {newCompanionPermissions} from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";

/**
 * NewCompanion - Page component for creating new learning companions
 * 
 * This async server component handles the authentication, permission checking,
 * and rendering of either the companion creation form or upgrade prompt.
 * 
 * @returns {Promise<JSX.Element>} Rendered new companion page
 * 
 * Authentication Flow:
 * 1. Checks if user is authenticated via Clerk
 * 2. Redirects to sign-in page if not authenticated
 * 3. Validates companion creation permissions based on subscription
 * 4. Renders appropriate interface based on permissions
 * 
 * Permission-Based Rendering:
 * - If user can create companions: Shows companion creation form
 * - If user has reached limit: Shows upgrade prompt with subscription link
 * 
 * Security Features:
 * - Server-side authentication check prevents unauthorized access
 * - Permission validation ensures subscription compliance
 * - Automatic redirects for unauthenticated users
 */
const NewCompanion = async () => {
    // Authenticate user and get user ID
    const { userId } = await auth();
    
    // Redirect to sign-in if user is not authenticated
    if(!userId) redirect('/sign-in');

    // Check if user has permission to create new companions
    // This validates subscription tier and current companion count
    const canCreateCompanion = await newCompanionPermissions();

    return (
        // Main container with responsive width constraints
        <main className="min-lg:w-1/3 min-md:w-2/3 items-center justify-center">
            {canCreateCompanion ? (
                // Companion Creation Interface - Shown when user has permission
                <article className="w-full gap-4 flex flex-col">
                    {/* Page title for companion builder */}
                    <h1>Companion Builder</h1>

                    {/* Main companion creation form component */}
                    <CompanionForm />
                </article>
                ) : (
                    // Upgrade Prompt Interface - Shown when user has reached companion limit
                    <article className="companion-limit">
                        {/* Visual indicator for limit reached */}
                        <Image src="/images/limit.svg" alt="Companion limit reached" width={360} height={230} />
                        
                        {/* Call-to-action badge */}
                        <div className="cta-badge">
                            Upgrade your plan
                        </div>
                        
                        {/* Limit reached heading */}
                        <h1>You&apos;ve Reached Your Limit</h1>
                        
                        {/* Explanation text for the limitation */}
                        <p>You&apos;ve reached your companion limit. Upgrade to create more companions and premium features.</p>
                        
                        {/* Upgrade button linking to subscription page */}
                        <Link href="/subscription" className="btn-primary w-full justify-center" >
                            Upgrade My Plan
                        </Link>
                    </article>
                )}
        </main>
    )
}

export default NewCompanion
