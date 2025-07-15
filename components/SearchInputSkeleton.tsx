import { Skeleton } from "@/components/ui/skeleton";

const SearchInputSkeleton = () => {
  return (
    <div className="relative">
      <Skeleton className="h-10 w-64 rounded-lg" />
      <Skeleton className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
    </div>
  );
};

export default SearchInputSkeleton;