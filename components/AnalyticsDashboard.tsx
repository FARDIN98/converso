'use client';

/**
 * React hooks for state management, memoization, and lifecycle management
 */
import { useEffect, useState, memo, useMemo, useCallback } from 'react';

/**
 * UI components for creating cards with headers, content, and descriptions
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Skeleton component for loading states and placeholder content
 */
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Server actions for fetching user analytics data and session trends
 */
import { getUserAnalytics, getSessionTrends } from '@/lib/actions/analytics.actions';

/**
 * Lucide React icons for analytics dashboard UI elements
 */
import { BarChart3, BookOpen, TrendingUp, Bookmark } from "lucide-react";

/**
 * Recharts components for creating interactive charts and data visualizations
 */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

/**
 * Interface for analytics data structure containing user statistics
 * @interface AnalyticsData
 * @property {number} totalSessions - Total number of learning sessions completed
 * @property {number} totalCompanions - Total number of AI companions created
 * @property {number} totalBookmarks - Total number of bookmarked companions
 * @property {Record<string, number>} subjectStats - Statistics grouped by subject
 * @property {number} recentSessions - Number of recent sessions (typically this week)
 * @property {unknown[]} sessionsData - Raw session data for additional processing
 * @property {unknown[]} companionsData - Raw companion data for additional processing
 */
interface AnalyticsData {
    totalSessions: number;
    totalCompanions: number;
    totalBookmarks: number;
    subjectStats: Record<string, number>;
    recentSessions: number;
    sessionsData: unknown[];
    companionsData: unknown[];
}

/**
 * Interface for trend data used in line charts
 * @interface TrendData
 * @property {string} date - Date in string format for the data point
 * @property {number} sessions - Number of sessions for that date
 */
interface TrendData {
    date: string;
    sessions: number;
}

/**
 * Interface for subject distribution data used in pie charts
 * @interface SubjectData
 * @property {string} subject - Subject name (e.g., 'Math', 'Science')
 * @property {number} sessions - Number of sessions for this subject
 * @property {string} fill - Hex color code for chart visualization
 */
interface SubjectData {
    subject: string;
    sessions: number;
    fill: string;
}

/**
 * Interface for statistics card data
 * @interface StatData
 * @property {string} title - Display title for the statistic
 * @property {number} value - Numeric value to display
 * @property {string} description - Description text for the statistic
 * @property {React.ComponentType<{ className?: string }>} icon - Lucide icon component
 * @property {string} change - Change indicator text (e.g., '+5 this week')
 */
interface StatData {
    title: string;
    value: number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    change: string;
}

/**
 * Props interface for the AnalyticsDashboard component
 * @interface AnalyticsDashboardProps
 * @property {string} userId - Unique identifier for the user whose analytics to display
 */
interface AnalyticsDashboardProps {
    userId: string;
}

/**
 * Color mapping for different subjects used in charts and visualizations
 * Each subject has a unique color to maintain consistency across the dashboard
 * @constant {Record<string, string>} COLORS
 */
const COLORS = {
    maths: '#3B82F6',      // Blue - for mathematics
    science: '#10B981',    // Green - for science subjects
    language: '#F59E0B',   // Amber - for language studies
    history: '#EF4444',    // Red - for history
    coding: '#8B5CF6',     // Purple - for programming/coding
    geography: '#06B6D4',  // Cyan - for geography
    economics: '#F97316',  // Orange - for economics
    finance: '#84CC16',    // Lime - for finance
    business: '#EC4899'    // Pink - for business studies
};

/**
 * AnalyticsDashboard Component
 * 
 * A comprehensive analytics dashboard that displays user learning statistics,
 * session trends, subject distribution, and personalized insights.
 * 
 * Features:
 * - Real-time analytics data fetching
 * - Interactive charts (line charts, pie charts)
 * - Loading states with skeleton components
 * - Responsive design with gradient styling
 * - Memoized performance optimization
 * - Error handling and fallback states
 * 
 * @component
 * @param {AnalyticsDashboardProps} props - Component props
 * @param {string} props.userId - User ID for fetching analytics data
 * @returns {JSX.Element} Rendered analytics dashboard
 * 
 * @example
 * ```tsx
 * <AnalyticsDashboard userId="user123" />
 * ```
 */
const AnalyticsDashboard = memo(({ userId }: AnalyticsDashboardProps) => {
    // State for storing user analytics data (sessions, companions, bookmarks, etc.)
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    
    // State for storing session trend data for line chart visualization
    const [trends, setTrends] = useState<TrendData[]>([]);
    
    // Loading state to show skeleton components while data is being fetched
    const [loading, setLoading] = useState(true);

    /**
     * Fetches analytics data and session trends for the user
     * Handles loading states and error management
     * @async
     * @function fetchAnalytics
     */
    const fetchAnalytics = useCallback(async () => {
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
    }, [userId]);

    // Fetch analytics data when component mounts or userId changes
    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    /**
     * Memoized subject distribution data for pie chart
     * Converts subject statistics into chart-ready format with colors
     * @returns {SubjectData[]} Array of subject data with colors for pie chart
     */
    const subjectData: SubjectData[] = useMemo(() => {
        if (!analytics) return [];
        return Object.entries(analytics.subjectStats).map(([subject, count]) => ({
            subject: subject.charAt(0).toUpperCase() + subject.slice(1),
            sessions: count,
            fill: COLORS[subject as keyof typeof COLORS] || '#6B7280'
        }));
    }, [analytics]);

    /**
     * Memoized statistics data for the overview cards
     * Transforms raw analytics data into display-ready format
     * @returns {StatData[]} Array of statistics for overview cards
     */
    const stats: StatData[] = useMemo(() => {
        if (!analytics) return [];
        return [
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
    }, [analytics]);

    // Show loading skeleton while data is being fetched
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

    // Show error message if analytics data failed to load
    if (!analytics) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load analytics data</p>
            </div>
        );
    }

    // Render the complete analytics dashboard
    return (
        <div className="space-y-6">
            {/* Overview Statistics Cards - displays key metrics in a responsive grid */}
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

            {/* Charts Section - displays session trends and subject distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Session Trends Chart - Line chart showing learning activity over time */}
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
                                /* Responsive container for line chart */
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trends}>
                                        {/* Grid lines for better readability */}
                                        <CartesianGrid strokeDasharray="3 3" />
                                        {/* X-axis showing dates */}
                                        <XAxis 
                                            dataKey="date" 
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                                        />
                                        {/* Y-axis showing session counts */}
                                        <YAxis />
                                        {/* Interactive tooltip on hover */}
                                        <Tooltip 
                                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                            formatter={(value) => [value, 'Sessions']}
                                        />
                                        {/* Main trend line with interactive dots */}
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

                {/* Subject Distribution Chart - Pie chart showing learning focus by subject */}
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
                                /* Responsive container for pie chart */
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        {/* Pie chart with session count labels */}
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
                                            {/* Apply custom colors to each pie slice */}
                                            {subjectData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        {/* Interactive tooltip showing detailed information */}
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
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';

export default AnalyticsDashboard;