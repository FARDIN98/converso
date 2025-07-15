import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

const AnalyticsPage = async () => {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Track your learning progress and engagement
                </p>
            </div>
            
            <AnalyticsDashboard userId={user.id} />
        </main>
    );
};

export default AnalyticsPage;