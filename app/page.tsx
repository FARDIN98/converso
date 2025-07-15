/* eslint-disable @typescript-eslint/no-unused-vars */
import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import dynamic from "next/dynamic";
import {recentSessions} from "@/constants";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";

const CTA = dynamic(() => import("@/components/CTA"), {
    loading: () => (
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
        </div>
    )
});

const Page = async () => {
    const companions = await getAllCompanions({ limit: 3 });
    const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main>
      <h1>Popular Companions</h1>

        <section className="home-section">
            {companions.map((companion) => (
                <CompanionCard
                    key={companion.id}
                    {...companion}
                    color={getSubjectColor(companion.subject)}
                />
            ))}

        </section>

        <section className="home-section">
            <CompanionsList
                title="Recently completed sessions"
                companions={recentSessionsCompanions}
                classNames="w-2/3 max-lg:w-full"
            />
            <CTA />
        </section>
    </main>
  )
}

export default Page