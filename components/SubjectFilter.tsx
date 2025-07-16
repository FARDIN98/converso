"use client";

/**
 * @fileoverview SubjectFilter component for filtering companions by subject
 * Provides a dropdown select interface that updates URL parameters for filtering.
 */

// React hooks for state management and side effects
import React, { useEffect, useState } from "react";
// UI components for select dropdown functionality
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
// Constants containing available subjects
import { subjects } from "@/constants";
// Next.js hooks for navigation and URL parameter management
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
// Utility functions for URL query manipulation
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

/**
 * Subject filter component that allows users to filter companions by subject
 * Updates URL parameters to maintain filter state across navigation
 * 
 * @component
 * @returns {JSX.Element} A select dropdown for subject filtering
 * 
 * @features
 * - Dropdown selection with all available subjects
 * - URL parameter synchronization for bookmarkable filters
 * - "All subjects" option to clear filters
 * - Automatic navigation without page scroll
 * - Capitalized subject display
 * 
 * @example
 * <SubjectFilter />
 * 
 * @workflow
 * 1. Component reads current subject filter from URL parameters
 * 2. User selects a subject from dropdown
 * 3. URL is updated with new subject parameter
 * 4. Parent components re-render with filtered data
 * 5. "All subjects" selection removes the subject parameter
 */
const SubjectFilter = () => {
    // Next.js router for programmatic navigation
    const router = useRouter();
    // Hook to access current URL search parameters
    const searchParams = useSearchParams();
    // Get current subject filter from URL, default to empty string
    const query = searchParams.get("subject") || "";

    // Local state to track selected subject
    const [subject, setSubject] = useState(query);

    /**
     * Effect to update URL parameters when subject selection changes
     * Handles both adding subject filter and removing it for "all" selection
     */
    useEffect(() => {
        let newUrl = "";
        
        // Remove subject parameter when "all" is selected
        if (subject === "all") {
            newUrl = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                keysToRemove: ["subject"],
            });
        } else {
            // Add or update subject parameter for specific subject selection
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "subject",
                value: subject,
            });
        }
        
        // Navigate to new URL without scrolling to top
        router.push(newUrl, { scroll: false });
    }, [subject, searchParams, router]);

    return (
        <Select onValueChange={setSubject} value={subject}>
            {/* Select trigger with placeholder and styling */}
            <SelectTrigger className="input capitalize">
                <SelectValue placeholder="Subject" />
            </SelectTrigger>
            
            {/* Dropdown content with subject options */}
            <SelectContent>
                {/* Option to show all subjects (removes filter) */}
                <SelectItem value="all">All subjects</SelectItem>
                
                {/* Map through available subjects to create options */}
                {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="capitalize">
                        {subject}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SubjectFilter;