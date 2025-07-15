"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const AnalyticsDashboard = dynamic(() => import("@/components/AnalyticsDashboard"), {
    loading: () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
        </div>
    ),
    ssr: false
});

const AnalyticsPage = () => {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/sign-in");
        }
    }, [isLoaded, user, router]);

    if (!isLoaded) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                    <div className="h-80 bg-gray-200 animate-pulse rounded-lg" />
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

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