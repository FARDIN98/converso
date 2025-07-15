import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface CompanionsListSkeletonProps {
    rows?: number;
    classNames?: string;
}

const CompanionsListSkeleton = ({ 
    rows = 3, 
    classNames 
}: CompanionsListSkeletonProps) => {
    return (
        <article className={cn('companion-list', classNames)}>
            <Skeleton className="h-9 w-48 mb-4" />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-lg w-2/3">Lessons</TableHead>
                        <TableHead className="text-lg">Subject</TableHead>
                        <TableHead className="text-lg text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rows }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-[72px] rounded-lg max-md:hidden" />
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-6 w-20 max-md:hidden" />
                                <Skeleton className="size-10 rounded-lg md:hidden" />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 w-full justify-end">
                                    <Skeleton className="h-6 w-16" />
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