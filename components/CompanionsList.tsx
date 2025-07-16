/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

/**
 * @fileoverview CompanionsList component for displaying a list of companions in a table format
 * with virtual scrolling support for large datasets and responsive design.
 */

// UI components for table structure
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
// Utility functions for styling and color management
import {cn, getSubjectColor} from "@/lib/utils";
// Next.js components for navigation and image optimization
import Link from "next/link";
import Image from "next/image";
// React hooks for performance optimization
import { memo, useMemo } from "react";
// Virtual scrolling library for handling large lists efficiently
import { FixedSizeList as List } from 'react-window';

/**
 * Props interface for the CompanionsList component
 * @interface CompanionsListProps
 * @property {string} title - The title to display above the companions list
 * @property {Companion[]} [companions] - Optional array of companion objects to display
 * @property {string} [classNames] - Optional additional CSS classes for styling
 */
interface CompanionsListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
}

/**
 * Memoized component for rendering individual companion rows in virtual scrolling
 * Optimized for performance when dealing with large lists of companions
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the current item in the virtual list
 * @param {unknown} props.style - Style object provided by react-window for positioning
 * @param {Companion[]} props.data - Array of companion data
 * @returns {JSX.Element} A table row containing companion information
 * 
 * @example
 * // Used internally by react-window's FixedSizeList
 * <List itemData={companions}>{CompanionRow}</List>
 */
const CompanionRow = memo(({ index, style, data }: { index: number; style: unknown; data: Companion[] }) => {
    // Extract companion data for the current row
    const companion = data[index];
    const { id, subject, name, topic, duration } = companion;
    
    return (
        // Container div with positioning style from react-window
        <div style={style}>
            <TableRow>
                {/* First column: Companion name and topic with navigation */}
                <TableCell>
                    <Link href={`/companions/${id}`}>
                        <div className="flex items-center gap-2">
                            {/* Subject icon container - hidden on mobile */}
                            <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: getSubjectColor(subject) }}>
                                <Image
                                    src={`/icons/${subject}.svg`}
                                    alt={subject}
                                    width={35}
                                    height={35} />
                            </div>
                            {/* Companion details */}
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-2xl">
                                    {name}
                                </p>
                                <p className="text-lg">
                                    {topic}
                                </p>
                            </div>
                        </div>
                    </Link>
                </TableCell>
                {/* Second column: Subject badge with responsive design */}
                <TableCell>
                    {/* Text badge for desktop */}
                    <div className="subject-badge w-fit max-md:hidden">
                        {subject}
                    </div>
                    {/* Icon badge for mobile */}
                    <div className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                        <Image
                            src={`/icons/${subject}.svg`}
                            alt={subject}
                            width={18}
                            height={18}
                        />
                    </div>
                </TableCell>
                {/* Third column: Duration with responsive text/icon */}
                <TableCell>
                    <div className="flex items-center gap-2 w-full justify-end">
                        <p className="text-2xl">
                            {duration} {' '}
                            <span className="max-md:hidden">mins</span>
                        </p>
                        {/* Clock icon for mobile */}
                        <Image src="/icons/clock.svg" alt="minutes" width={14} height={14} className="md:hidden" />
                    </div>
                </TableCell>
            </TableRow>
        </div>
    );
});

// Set display name for debugging purposes
CompanionRow.displayName = 'CompanionRow';

/**
 * Memoized component for displaying a list of companions in a table format
 * Automatically switches to virtual scrolling for large datasets (>20 items)
 * 
 * @component
 * @param {CompanionsListProps} props - Component props
 * @param {string} props.title - The title to display above the companions list
 * @param {Companion[]} [props.companions] - Optional array of companion objects to display
 * @param {string} [props.classNames] - Optional additional CSS classes for styling
 * @returns {JSX.Element} A table displaying companions with optional virtual scrolling
 * 
 * @features
 * - Responsive design with mobile-optimized layout
 * - Virtual scrolling for performance with large datasets
 * - Subject-based color coding
 * - Navigation to individual companion pages
 * - Duration display with appropriate units
 * 
 * @example
 * <CompanionsList 
 *   title="My Companions" 
 *   companions={companionData}
 *   classNames="custom-styling"
 * />
 */
const CompanionsList = memo(({ title, companions, classNames }: CompanionsListProps) => {
    // Determine whether to use virtual scrolling based on list size
    // Virtual scrolling improves performance for large lists (>20 items)
    const shouldUseVirtualScrolling = useMemo(() => {
        return companions && companions.length > 20;
    }, [companions]);
    
    // Fixed height for each row in virtual scrolling
    const itemHeight = 100; // Approximate height of each row
    
    // Render virtual scrolling version for large lists
    if (shouldUseVirtualScrolling) {
        return (
            <article className={cn('companion-list', classNames)}>
                {/* Section title */}
                <h2 className="font-bold text-3xl">{title}</h2>
                
                {/* Table header (separate from virtual list) */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-lg w-2/3">Lessons</TableHead>
                            <TableHead className="text-lg">Subject</TableHead>
                            <TableHead className="text-lg text-right">Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                
                {/* Virtual scrolling container */}
                <div className="h-[400px] w-full">
                    <List
                        height={400}
                        itemCount={companions?.length || 0}
                        itemSize={itemHeight}
                        itemData={companions}
                        width="100%"
                    >
                        {CompanionRow}
                    </List>
                </div>
            </article>
        );
    }

    // Render standard table version for smaller lists
    return (
        <article className={cn('companion-list', classNames)}>
            {/* Section title */}
            <h2 className="font-bold text-3xl">{title}</h2>

            <Table>
                {/* Table header */}
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-lg w-2/3">Lessons</TableHead>
                        <TableHead className="text-lg">Subject</TableHead>
                        <TableHead className="text-lg text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                {/* Table body with companion rows */}
                <TableBody>
                    {companions?.map(({id, subject, name, topic, duration}) => (
                        <TableRow key={id}>
                            {/* First column: Companion name and topic with navigation */}
                            <TableCell>
                                <Link href={`/companions/${id}`}>
                                    <div className="flex items-center gap-2">
                                        {/* Subject icon container - hidden on mobile */}
                                        <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: getSubjectColor(subject) }}>
                                            <Image
                                                src={`/icons/${subject}.svg`}
                                                alt={subject}
                                                width={35}
                                                height={35} />
                                        </div>
                                        {/* Companion details */}
                                        <div className="flex flex-col gap-2">
                                            <p className="font-bold text-2xl">
                                                {name}
                                            </p>
                                            <p className="text-lg">
                                                {topic}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </TableCell>
                            {/* Second column: Subject badge with responsive design */}
                            <TableCell>
                                {/* Text badge for desktop */}
                                <div className="subject-badge w-fit max-md:hidden">
                                    {subject}
                                </div>
                                {/* Icon badge for mobile */}
                                <div className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                            <Image
                                src={`/icons/${subject}.svg`}
                                alt={subject}
                                width={18}
                                height={18}
                            />
                                </div>
                            </TableCell>
                            {/* Third column: Duration with responsive text/icon */}
                            <TableCell>
                                <div className="flex items-center gap-2 w-full justify-end">
                                    <p className="text-2xl">
                                        {duration} {' '}
                                        <span className="max-md:hidden">mins</span>
                                    </p>
                                    {/* Clock icon for mobile */}
                                    <Image src="/icons/clock.svg" alt="minutes" width={14} height={14} className="md:hidden" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </article>
    );
});

// Set display name for debugging purposes
CompanionsList.displayName = 'CompanionsList';

export default CompanionsList;