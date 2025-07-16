/**
 * @fileoverview CompanionsListSkeleton component for displaying loading placeholders
 * while companion data is being fetched, maintaining the same layout as CompanionsList.
 */

// UI component for skeleton loading animations
import { Skeleton } from "@/components/ui/skeleton";
// UI components for table structure
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// Utility function for conditional class names
import { cn } from "@/lib/utils";

/**
 * Props interface for the CompanionsListSkeleton component
 * @interface CompanionsListSkeletonProps
 * @property {number} [rows=3] - Number of skeleton rows to display (default: 3)
 * @property {string} [classNames] - Optional additional CSS classes for styling
 */
interface CompanionsListSkeletonProps {
    rows?: number;
    classNames?: string;
}

/**
 * Loading skeleton component that mimics the CompanionsList layout
 * Displays animated placeholders while companion data is being fetched
 * 
 * @component
 * @param {CompanionsListSkeletonProps} props - Component props
 * @param {number} [props.rows=3] - Number of skeleton rows to display
 * @param {string} [props.classNames] - Optional additional CSS classes for styling
 * @returns {JSX.Element} A table with skeleton loading animations
 * 
 * @features
 * - Responsive design matching CompanionsList layout
 * - Configurable number of skeleton rows
 * - Animated loading placeholders
 * - Mobile-optimized skeleton elements
 * 
 * @example
 * <CompanionsListSkeleton rows={5} classNames="custom-loading" />
 * 
 * @example
 * // Default usage with 3 rows
 * <CompanionsListSkeleton />
 */
const CompanionsListSkeleton = ({ 
    rows = 3, 
    classNames 
}: CompanionsListSkeletonProps) => {
    return (
        <article className={cn('companion-list', classNames)}>
            {/* Title skeleton placeholder */}
            <Skeleton className="h-9 w-48 mb-4" />

            <Table>
                {/* Table header - same as actual CompanionsList */}
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-lg w-2/3">Lessons</TableHead>
                        <TableHead className="text-lg">Subject</TableHead>
                        <TableHead className="text-lg text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                {/* Table body with skeleton rows */}
                <TableBody>
                    {/* Generate specified number of skeleton rows */}
                    {Array.from({ length: rows }).map((_, index) => (
                        <TableRow key={index}>
                            {/* First column: Companion name and topic skeletons */}
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {/* Subject icon skeleton - hidden on mobile */}
                                    <Skeleton className="size-[72px] rounded-lg max-md:hidden" />
                                    {/* Companion details skeletons */}
                                    <div className="flex flex-col gap-2">
                                        {/* Companion name skeleton */}
                                        <Skeleton className="h-6 w-48" />
                                        {/* Topic skeleton */}
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            </TableCell>
                            {/* Second column: Subject badge skeletons */}
                            <TableCell>
                                {/* Text badge skeleton for desktop */}
                                <Skeleton className="h-6 w-20 max-md:hidden" />
                                {/* Icon badge skeleton for mobile */}
                                <Skeleton className="size-10 rounded-lg md:hidden" />
                            </TableCell>
                            {/* Third column: Duration skeletons */}
                            <TableCell>
                                <div className="flex items-center gap-2 w-full justify-end">
                                    {/* Duration text skeleton */}
                                    <Skeleton className="h-6 w-16" />
                                    {/* Clock icon skeleton for mobile */}
                                    <Skeleton className="size-3 md:hidden" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </article>
    );
};

export default CompanionsListSkeleton;