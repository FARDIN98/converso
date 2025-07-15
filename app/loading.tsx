import { Skeleton } from "@/components/ui/skeleton";
import CompanionCardSkeleton from "@/components/CompanionCardSkeleton";
import CompanionsListSkeleton from "@/components/CompanionsListSkeleton";

const MainLoading = () => {
    return (
        <main>
            {/* Page Title */}
            <Skeleton className="h-8 w-48 mb-6" />

            {/* Popular Companions Section */}
            <section className="home-section">
                {Array.from({ length: 3 }).map((_, index) => (
                    <CompanionCardSkeleton key={index} />
                ))}
            </section>

            {/* Recently Completed Sessions */}
            <section className="home-section">
                <div className="w-2/3 max-lg:w-full">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <CompanionsListSkeleton rows={2} />
                </div>
                
                {/* CTA Section Skeleton */}
                <div className="cta-section">
                    <Skeleton className="h-6 w-32 bg-cta-gold/20" />
                    <Skeleton className="h-8 w-48 bg-white/20" />
                    <Skeleton className="h-6 w-full bg-white/10" />
                    <Skeleton className="h-6 w-3/4 bg-white/10" />
                    <Skeleton className="h-10 w-40 bg-white/20 mt-4" />
                </div>
            </section>
        </main>
    );
};

export default MainLoading;