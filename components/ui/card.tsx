// React library for component creation and forwardRef functionality
import * as React from "react"
// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Card Component
 * 
 * The main container component for card layouts. Provides a clean, bordered
 * container with rounded corners and subtle shadow.
 * 
 * Features:
 * - Rounded corners with consistent border radius
 * - Subtle border and shadow for depth
 * - Theme-aware background and text colors
 * - Forward ref support for direct DOM access
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref} ref - Forwarded ref to the div element
 * @returns {JSX.Element} Card container element
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Base card styling
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * CardHeader Component
 * 
 * Header section of the card, typically containing title and description.
 * Provides consistent spacing and layout for card headers.
 * 
 * Features:
 * - Vertical flex layout with consistent spacing
 * - Standard padding for visual hierarchy
 * - Forward ref support
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref} ref - Forwarded ref to the div element
 * @returns {JSX.Element} Card header container
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)} // Vertical layout with spacing
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * CardTitle Component
 * 
 * Primary heading for the card content. Renders as an h3 element with
 * consistent typography styling.
 * 
 * Features:
 * - Semantic h3 heading for accessibility
 * - Large, semibold typography
 * - Tight letter spacing for readability
 * - Forward ref support
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref} ref - Forwarded ref to the h3 element
 * @returns {JSX.Element} Card title heading
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Title typography
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * CardDescription Component
 * 
 * Secondary text content for the card, typically used for subtitles or
 * explanatory text below the card title.
 * 
 * Features:
 * - Smaller text size for hierarchy
 * - Muted color for visual distinction
 * - Semantic paragraph element
 * - Forward ref support
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref} ref - Forwarded ref to the p element
 * @returns {JSX.Element} Card description paragraph
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Smaller, muted text
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * CardContent Component
 * 
 * Main content area of the card. Provides consistent padding while
 * removing top padding to connect seamlessly with the header.
 * 
 * Features:
 * - Standard horizontal and bottom padding
 * - No top padding for header connection
 * - Flexible content container
 * - Forward ref support
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref} ref - Forwarded ref to the div element
 * @returns {JSX.Element} Card content container
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> // Padding without top
))
CardContent.displayName = "CardContent"

/**
 * CardFooter Component
 * 
 * Footer section of the card, typically containing actions or additional
 * information. Uses flexbox for horizontal layout of footer content.
 * 
 * Features:
 * - Horizontal flex layout for actions
 * - Centered alignment of items
 * - Standard padding without top padding
 * - Forward ref support
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref} ref - Forwarded ref to the div element
 * @returns {JSX.Element} Card footer container
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)} // Horizontal layout with padding
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Export all card components for use throughout the application
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }