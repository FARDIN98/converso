import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CompanionsListSkeleton from "@/components/CompanionsListSkeleton";

const MyJourneyLoading = () => {
  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Skeleton className="w-[110px] h-[110px] rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Skeleton className="w-[22px] h-[22px]" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Skeleton className="w-[22px] h-[22px]" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </section>
      
      <Accordion type="multiple" className="mt-8">
        <AccordionItem value="bookmarks">
          <AccordionTrigger className="text-2xl font-bold">
            <Skeleton className="h-8 w-64" />
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsListSkeleton title="Bookmarked Companions" rows={2} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">
            <Skeleton className="h-8 w-48" />
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsListSkeleton title="Recent Sessions" rows={3} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">
            <Skeleton className="h-8 w-52" />
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsListSkeleton title="My Companions" rows={2} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default MyJourneyLoading;