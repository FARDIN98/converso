import { Skeleton } from "@/components/ui/skeleton";

const CompanionCardSkeleton = () => {
  return (
    <article className="companion-card bg-gray-100 dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-4" />
      </div>

      <Skeleton className="h-8 w-3/4 mt-4" />
      <Skeleton className="h-4 w-full mt-2" />
      
      <div className="flex items-center gap-2 mt-3">
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-16" />
      </div>

      <Skeleton className="h-10 w-full mt-4 rounded-lg" />
    </article>
  );
};

export default CompanionCardSkeleton;