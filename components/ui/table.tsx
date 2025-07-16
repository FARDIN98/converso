"use client"

// React library for component creation
import * as React from "react"
// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"

/**
 * Table Component
 * 
 * A responsive table component with horizontal scrolling support.
 * Wraps the native table element in a container for better mobile experience.
 * 
 * Features:
 * - Responsive design with horizontal scroll
 * - Consistent typography and spacing
 * - Full width layout
 * - Caption positioning at bottom
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional table props
 * @returns {JSX.Element} Table with responsive container
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container" // Container for responsive scrolling
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table" // Main table element
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

/**
 * TableHeader Component
 * 
 * Table header section containing column headings.
 * Applies consistent border styling to header rows.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional thead props
 * @returns {JSX.Element} Styled table header
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)} // Border bottom for header rows
      {...props}
    />
  )
}

/**
 * TableBody Component
 * 
 * Main content area of the table containing data rows.
 * Removes border from the last row for clean appearance.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional tbody props
 * @returns {JSX.Element} Styled table body
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)} // Remove border from last row
      {...props}
    />
  )
}

/**
 * TableFooter Component
 * 
 * Footer section of the table, typically containing summary information.
 * Features distinct styling with background color and top border.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional tfoot props
 * @returns {JSX.Element} Styled table footer
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", // Footer styling with background
        className
      )}
      {...props}
    />
  )
}

/**
 * TableRow Component
 * 
 * Individual row within the table with interactive hover states.
 * Supports selection states and smooth color transitions.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional tr props
 * @returns {JSX.Element} Interactive table row
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", // Interactive row styling
        className
      )}
      {...props}
    />
  )
}

/**
 * TableHead Component
 * 
 * Header cell component for column titles and labels.
 * Provides consistent typography and spacing for table headers.
 * 
 * Features:
 * - Medium font weight for emphasis
 * - Left text alignment
 * - Checkbox support with proper spacing
 * - Consistent height and padding
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional th props
 * @returns {JSX.Element} Styled table header cell
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", // Header cell styling
        className
      )}
      {...props}
    />
  )
}

/**
 * TableCell Component
 * 
 * Standard data cell component for table content.
 * Provides consistent padding and alignment for table data.
 * 
 * Features:
 * - Consistent padding for readability
 * - Middle vertical alignment
 * - Checkbox support with proper spacing
 * - Prevents text wrapping
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional td props
 * @returns {JSX.Element} Styled table data cell
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", // Data cell styling
        className
      )}
      {...props}
    />
  )
}

/**
 * TableCaption Component
 * 
 * Caption element for providing table descriptions or summaries.
 * Positioned below the table with muted styling.
 * 
 * Features:
 * - Muted text color for subtle appearance
 * - Small text size
 * - Top margin for spacing
 * - Accessible table description
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {...any} props.props - Additional caption props
 * @returns {JSX.Element} Styled table caption
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)} // Caption styling
      {...props}
    />
  )
}

// Export all table components for use throughout the application
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
