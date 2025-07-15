import CompanionCardSkeleton from "@/components/CompanionCardSkeleton";
import SearchInputSkeleton from "@/components/SearchInputSkeleton";
import SubjectFilterSkeleton from "@/components/SubjectFilterSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const CompanionsLoading = () => {
    return (
        <main>
            <section className="flex justify-between gap-4 max-sm:flex-col">
                <Skeleton className="h-12 w-64" />
                <div className="flex gap-4">
                    <SearchInputSkeleton />
                    <SubjectFilterSkeleton />
                </div>
            </section>
            
            <section className="companions-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                    <CompanionCardSkeleton key={index} />
                ))}
            </section>
        </main>
    );
};

export default CompanionsLoading;