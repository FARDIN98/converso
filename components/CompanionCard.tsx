"use client";

// Server actions for bookmark functionality
import { removeBookmark } from "@/lib/actions/companion.actions";
import { addBookmark } from "@/lib/actions/companion.actions";
// Next.js optimized components
import Image from "next/image";
import Link from "next/link";
// Next.js navigation hook
import { usePathname } from "next/navigation";
// React hooks and utilities
import { useState, memo } from "react";
// Toast notification library
import toast from "react-hot-toast";
// Custom loading spinner component
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * Props interface for CompanionCard component
 * 
 * @interface CompanionCardProps
 * @property {string} id - Unique identifier for the companion
 * @property {string} name - Display name of the companion
 * @property {string} topic - Topic or description of the companion
 * @property {string} subject - Subject category (e.g., Math, Science)
 * @property {number} duration - Lesson duration in minutes
 * @property {string} color - Background color for the card
 * @property {boolean} bookmarked - Initial bookmark status
 */
interface CompanionCardProps {
  id: string; // Unique companion identifier
  name: string; // Companion display name
  topic: string; // Companion topic/description
  subject: string; // Subject category
  duration: number; // Lesson duration in minutes
  color: string; // Card background color
  bookmarked: boolean; // Initial bookmark state
}

/**
 * CompanionCard Component
 * 
 * A memoized card component that displays companion information with interactive features.
 * Features:
 * - Dynamic background color based on companion theme
 * - Bookmark functionality with optimistic UI updates
 * - Loading states with spinner during async operations
 * - Success animations for user feedback
 * - Toast notifications for action confirmations
 * - Responsive design with proper accessibility
 * - Performance optimization through React.memo
 * 
 * @param {CompanionCardProps} props - Component props
 * @returns {JSX.Element} Rendered companion card
 * 
 * @example
 * <CompanionCard
 *   id="comp-123"
 *   name="Math Tutor"
 *   topic="Algebra and Geometry"
 *   subject="Mathematics"
 *   duration={45}
 *   color="#e3f2fd"
 *   bookmarked={false}
 * />
 */
const CompanionCard = memo(({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) => {
  // Get current pathname for server action context
  const pathname = usePathname();
  
  // Loading state for bookmark operations
  const [isLoading, setIsLoading] = useState(false);
  // Local bookmark state (optimistic updates)
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  // Animation state for successful bookmark actions
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  /**
   * Handles bookmark toggle functionality
   * 
   * This function manages the bookmark state with optimistic updates,
   * loading states, and user feedback through toast notifications.
   * 
   * Flow:
   * 1. Set loading state to prevent multiple clicks
   * 2. Check current bookmark status
   * 3. Call appropriate server action (add/remove)
   * 4. Update local state optimistically
   * 5. Show success animation and toast
   * 6. Handle errors with toast notification
   * 7. Reset loading state
   */
  const handleBookmark = async () => {
    setIsLoading(true); // Prevent multiple simultaneous requests
    
    try {
      if (isBookmarked) {
        // Remove bookmark: call server action and update UI
        await removeBookmark(id, pathname);
        setIsBookmarked(false);
        toast.success("Bookmark removed!");
      } else {
        // Add bookmark: call server action, update UI, and show animation
        await addBookmark(id, pathname);
        setIsBookmarked(true);
        
        // Trigger success animation for 300ms
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 300);
        
        toast.success("Bookmarked successfully!");
      }
    } catch {
      // Handle any errors during bookmark operations
      toast.error("Something went wrong!");
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };
  return (
    // Main card container with dynamic background color
    <article className="companion-card" style={{ backgroundColor: color }}>
      {/* Header section with subject badge and bookmark button */}
      <div className="flex justify-between items-center">
        {/* Subject category badge */}
        <div className="subject-badge">{subject}</div>
        
        {/* Bookmark toggle button with loading and animation states */}
        <button 
          className={`companion-bookmark ${
            isLoading ? 'opacity-50' : '' // Reduce opacity during loading
          } ${
            showSuccessAnimation ? 'bookmark-success' : '' // Apply success animation class
          }`} 
          onClick={handleBookmark}
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? (
            // Show loading spinner when bookmark operation is in progress
            <LoadingSpinner size="sm" className="w-3 h-3" />
          ) : (
            // Show appropriate bookmark icon based on current state
            <Image
              src={isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
              alt="bookmark"
              width={12.5}
              height={15}
            />
          )}
        </button>
      </div>

      {/* Companion name - main heading */}
      <h2 className="text-2xl font-bold">{name}</h2>
      
      {/* Companion topic/description */}
      <p className="text-sm">{topic}</p>
      
      {/* Duration section with clock icon */}
      <div className="flex items-center gap-2">
        {/* Clock icon for duration indicator */}
        <Image
          src="/icons/clock.svg"
          alt="duration"
          width={13.5}
          height={13.5}
        />
        {/* Duration text */}
        <p className="text-sm">{duration} minutes</p>
      </div>

      {/* Navigation link to companion detail page */}
      <Link href={`/companions/${id}`} className="w-full">
        {/* Primary action button to start the lesson */}
        <button className="btn-primary w-full justify-center">
          Launch Lesson
        </button>
      </Link>
    </article>
  );
});

// Set display name for React DevTools debugging
CompanionCard.displayName = 'CompanionCard';

// Export component as default export
export default CompanionCard;
