'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserAnalytics, getSessionTrends } from '@/lib/actions/analytics.actions';
import { BarChart3, BookOpen, TrendingUp, Bookmark } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AnalyticsData {
    totalSessions: number;
    totalCompanions: number;
    totalBookmarks: number;
    subjectStats: Record<string, number>;
    recentSessions: number;
    sessionsData: unknown[];
    companionsData: unknown[];
}

interface TrendData {
    date: string;
    sessions: number;
}

interface SubjectData {
    subject: string;
    sessions: number;
    fill: string;
}

interface StatData {
    title: string;
    value: number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    change: string;
}

interface AnalyticsDashboardProps {
    userId: string;
}

const COLORS = {
    maths: '#3B82F6',
    science: '#10B981',
    language: '#F59E0B',
    history: '#EF4444',
    coding: '#8B5CF6',
    geography: '#06B6D4',
    economics: '#F97316',
    finance: '#84CC16',
    business: '#EC4899'
};

const AnalyticsDashboard = ({ userId }: AnalyticsDashboardProps) => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [trends, setTrends] = useState<TrendData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const [analyticsData, trendsData] = await Promise.all([
                    getUserAnalytics(userId),
                    getSessionTrends(userId, 7)
                ]);
                setAnalytics(analyticsData);
                setTrends(trendsData);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [userId]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => {
                        const gradients = [
                            'from-blue-500/10 to-blue-600/5 border-blue-200/20',
                            'from-green-500/10 to-green-600/5 border-green-200/20',
                            'from-purple-500/10 to-purple-600/5 border-purple-200/20',
                            'from-orange-500/10 to-orange-600/5 border-orange-200/20'
                        ];
                        return (
                            <Card key={i} className={`bg-gradient-to-br ${gradients[i]} border-6 animate-pulse`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <Skeleton className="h-4 w-24" />
                                    <div className="p-2 rounded-lg bg-white/10">
                                        <Skeleton className="h-5 w-5" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 border-6 border-slate-200/50 dark:border-slate-700/50 animate-pulse">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <Skeleton className="h-4 w-48 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full rounded-lg" />
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 border-6 border-slate-200/50 dark:border-slate-700/50 animate-pulse">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-6 w-40" />
                            </div>
                            <Skeleton className="h-4 w-36 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full rounded-lg" />
                        </CardContent>
                    </Card>
                </div>
                <Card className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 border-6 border-indigo-200/30 dark:border-indigo-700/30 animate-pulse">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded" />
                            <Skeleton className="h-6 w-36" />
                        </div>
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load analytics data</p>
            </div>
        );
    }

    // Prepare data for charts
    const subjectData: SubjectData[] = Object.entries(analytics.subjectStats).map(([subject, count]) => ({
        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
        sessions: count,
        fill: COLORS[subject as keyof typeof COLORS] || '#6B7280'
    }));

    const stats: StatData[] = [
        {
            title: "Total Sessions",
            value: analytics.totalSessions,
            description: "Learning sessions completed",
            icon: TrendingUp,
            change: `+${analytics.recentSessions} this week`
        },
        {
            title: "Companions Created",
            value: analytics.totalCompanions,
            description: "AI tutors you've created",
            icon: BookOpen,
            change: "Your teaching contributions"
        },
        {
            title: "Bookmarked",
            value: analytics.totalBookmarks,
            description: "Saved companions",
            icon: Bookmark,
            change: "Quick access favorites"
        },
        {
            title: "Recent Activity",
            value: analytics.recentSessions,
            description: "Sessions this week",
            icon: BarChart3,
            change: "Keep up the momentum!"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const gradients = [
                        'from-blue-500/10 to-blue-600/5 border-blue-200/20',
                        'from-green-500/10 to-green-600/5 border-green-200/20',
                        'from-purple-500/10 to-purple-600/5 border-purple-200/20',
                        'from-orange-500/10 to-orange-600/5 border-orange-200/20'
                    ];
                    const iconColors = [
                        'text-blue-600',
                        'text-green-600', 
                        'text-purple-600',
                        'text-orange-600'
                    ];
                    return (
                        <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${gradients[index]} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 group`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-semibold text-foreground/90">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg bg-white/10 ${iconColors[index]} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                                <p className="text-sm text-muted-foreground/80 font-medium">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Session Trends */}
                <Card className="hover:shadow-lg transition-all duration-300 border-2 border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Session Trends
                        </CardTitle>
                        <CardDescription className="text-base">
                            Your learning activity over the past 7 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            {trends.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="date" 
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                                        />
                                        <YAxis />
                                        <Tooltip 
                                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                            formatter={(value) => [value, 'Sessions']}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="sessions" 
                                            stroke="hsl(var(--primary))" 
                                            strokeWidth={2}
                                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
                                    <p className="text-muted-foreground">No session data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Subject Distribution */}
                 <Card className="hover:shadow-lg transition-all duration-300 border-2 border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-green-600" />
                            Subject Distribution
                        </CardTitle>
                        <CardDescription className="text-base">Sessions by subject</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            {subjectData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={subjectData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ subject, sessions }) => 
                                                `${subject}: ${sessions}`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="sessions"
                                        >
                                            {subjectData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Sessions']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
                                    <p className="text-muted-foreground">No subject data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Insights */}
            <Card className="hover:shadow-lg transition-all duration-300 border-2 border-indigo-200/30 dark:border-indigo-700/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                        Learning Insights
                    </CardTitle>
                    <CardDescription className="text-base">
                        Personalized recommendations based on your activity
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.totalSessions === 0 ? (
                            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/30">
                                <p className="text-blue-700 dark:text-blue-300 font-medium">
                                    🚀 Start your learning journey by taking your first session!
                                </p>
                            </div>
                        ) : (
                            <>
                                {analytics.recentSessions > 0 ? (
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/30">
                                        <p className="text-green-700 dark:text-green-300 font-medium">
                                            🔥 Great job! You&apos;ve been active this week with {analytics.recentSessions} sessions.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/30">
                                        <p className="text-amber-700 dark:text-amber-300 font-medium">
                                            💡 You haven&apos;t had any sessions this week. Time to get back to learning!
                                        </p>
                                    </div>
                                )}
                                
                                {analytics.totalCompanions > 0 && (
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/30">
                                        <p className="text-blue-700 dark:text-blue-300 font-medium">
                                            👨‍🏫 You&apos;ve created {analytics.totalCompanions} companions. You&apos;re contributing to the community!
                                        </p>
                                    </div>
                                )}
                                
                                {analytics.totalBookmarks > 0 && (
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/30">
                                        <p className="text-purple-700 dark:text-purple-300 font-medium">
                                            📚 You have {analytics.totalBookmarks} bookmarked companions for quick access.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsDashboard;