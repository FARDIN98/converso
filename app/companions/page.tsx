import {getAllCompanions, getBookmarkedCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import {getSubjectColor} from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { currentUser } from "@clerk/nextjs/server";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    const filters = await searchParams;
    const subject = filters.subject ? filters.subject : '';
    const topic = filters.topic ? filters.topic : '';
    
    const user = await currentUser();
    const companions = await getAllCompanions({ subject, topic });
    const bookmarkedCompanions = user ? await getBookmarkedCompanions(user.id) : [];
    
    // Create a set of bookmarked companion IDs for quick lookup
    const bookmarkedIds = new Set(bookmarkedCompanions.map(comp => comp.id));

    return (
        <main>
            <section className="flex justify-between gap-4 max-sm:flex-col">
                <h1>Companion Library</h1>
                <div className="flex gap-4">
                    <SearchInput />
                    <SubjectFilter />
                </div>
            </section>
            <section className="companions-grid">
                {companions.map((companion) => (
                    <CompanionCard
                        key={companion.id}
                        {...companion}
                        color={getSubjectColor(companion.subject)}
                        bookmarked={bookmarkedIds.has(companion.id)}
                    />
                ))}
            </section>
        </main>
    )
}

export default CompanionsLibrary
