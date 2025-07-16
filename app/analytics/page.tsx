/**
 * Analytics Page Component
 * 
 * This is a client-side component that displays the analytics dashboard for authenticated users.
 * It provides insights into user learning progress, engagement metrics, and companion usage statistics.
 * 
 * Features:
 * - User authentication check with automatic redirect to sign-in
 * - Dynamic loading of analytics dashboard with skeleton loading states
 * - Responsive design with container layout
 * - Client-side rendering for real-time data updates
 * 
 * @requires Clerk authentication for user management
 * @requires Next.js router for navigation
 * @requires Dynamic import for code splitting and performance optimization
 */
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect } from "react";

/**
 * Dynamically imported Analytics Dashboard Component
 * 
 * Uses Next.js dynamic import for:
 * - Code splitting to reduce initial bundle size
 * - Client-side only rendering (ssr: false) for real-time data
 * - Custom loading component with skeleton UI for better UX
 * 
 * Loading State Features:
 * - 4 stat cards skeleton (responsive grid layout)
 * - 2 chart placeholders with proper aspect ratios
 * - Consistent spacing and visual hierarchy
 */
const AnalyticsDashboard = dynamic(() => import("@/components/AnalyticsDashboard"), {
    loading: () => (
        <div className="space-y-6">
            {/* Stats Cards Skeleton Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
            {/* Charts Skeleton Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
        </div>
    ),
    ssr: false
});

/**
 * Main Analytics Page Component
 * 
 * Handles user authentication, loading states, and renders the analytics dashboard.
 * Implements a multi-stage loading and authentication flow for optimal user experience.
 * 
 * Authentication Flow:
 * 1. Check if Clerk user data is loaded
 * 2. If loaded but no user, redirect to sign-in
 * 3. If user exists, render dashboard
 * 
 * Loading States:
 * 1. Initial loading (Clerk data not loaded) - shows skeleton
 * 2. Component loading (dynamic import) - handled by AnalyticsDashboard
 * 3. Data loading (API calls) - handled within AnalyticsDashboard
 * 
 * @returns {JSX.Element} The analytics page with authentication and loading handling
 */
const AnalyticsPage = () => {
    // Clerk authentication hook - provides user data and loading state
    const { user, isLoaded } = useUser();
    // Next.js router for programmatic navigation
    const router = useRouter();

    /**
     * Authentication Effect
     * 
     * Monitors authentication state and redirects unauthenticated users.
     * Only runs after Clerk has finished loading to avoid false redirects.
     * 
     * Dependencies:
     * - isLoaded: Prevents redirect during initial Clerk loading
     * - user: Triggers redirect when user becomes null
     * - router: Navigation dependency
     */
    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/sign-in");
        }
    }, [isLoaded, user, router]);

    /**
     * Initial Loading State
     * 
     * Displayed while Clerk is determining authentication status.
     * Shows skeleton placeholders that match the final dashboard layout.
     * 
     * Layout:
     * - Container with consistent padding
     * - Header skeleton (h-32)
     * - Main content skeleton (h-80)
     * - Proper spacing between elements
     */
    if (!isLoaded) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                    <div className="h-80 bg-gray-200 animate-pulse rounded-lg" />
                </div>
            </div>
        );
    }

    /**
     * Unauthenticated State
     * 
     * Returns null while redirect is in progress.
     * Prevents flash of content before navigation completes.
     */
    if (!user) {
        return null;
    }

    /**
     * Authenticated Dashboard Render
     * 
     * Main dashboard layout with:
     * - Semantic main element for accessibility
     * - Container with responsive padding
     * - Header section with title and description
     * - Analytics dashboard component with user ID
     * 
     * The AnalyticsDashboard component handles:
     * - Data fetching and loading states
     * - Chart rendering and interactions
     * - Error handling and retry logic
     */
    return (
        <main className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Track your learning progress and engagement
                </p>
            </div>
            
            {/* Main Dashboard Component */}
            <AnalyticsDashboard userId={user.id} />
        </main>
    );
};

export default AnalyticsPage;