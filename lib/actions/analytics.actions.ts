/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { createSupabaseClient } from "@/lib/supabase";

interface UserAnalytics {
    totalSessions: number;
    totalCompanions: number;
    totalBookmarks: number;
    subjectStats: { [key: string]: number };
    recentSessions: number;
    sessionsData: unknown[];
    companionsData: unknown[];
}

interface GlobalAnalytics {
    totalUsers: number;
    totalSessions: number;
    totalCompanions: number;
    subjectPopularity: { [key: string]: number };
    recentActivity: number;
}

interface SessionTrend {
    date: string;
    sessions: number;
}

// Get user analytics data
export const getUserAnalytics = async (userId: string) => {
    const supabase = createSupabaseClient();
    
    try {
        // Total sessions
        const { data: sessions, error: sessionsError } = await supabase
            .from('session_history')
            .select('*')
            .eq('user_id', userId);
            
        if (sessionsError) throw new Error(sessionsError.message);
        
        // Total companions created
        const { data: companions, error: companionsError } = await supabase
            .from('companions')
            .select('*')
            .eq('author', userId);
            
        if (companionsError) throw new Error(companionsError.message);
        
        // Total bookmarks
        const { data: bookmarks, error: bookmarksError } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', userId);
            
        if (bookmarksError) throw new Error(bookmarksError.message);
        
        // Sessions by subject
        const { data: sessionsBySubject, error: subjectError } = await supabase
            .from('session_history')
            .select(`
                companions:companion_id (
                    subject
                )
            `)
            .eq('user_id', userId);
            
        if (subjectError) throw new Error(subjectError.message);
        
        // Process sessions by subject
        const subjectStats = sessionsBySubject?.reduce((acc: Record<string, number>, session: unknown) => {
            const subject = session.companions?.subject;
            if (subject) {
                acc[subject] = (acc[subject] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>) || {};
        
        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: recentSessions, error: recentError } = await supabase
            .from('session_history')
            .select('created_at')
            .eq('user_id', userId)
            .gte('created_at', sevenDaysAgo.toISOString());
            
        if (recentError) throw new Error(recentError.message);
        
        return {
            totalSessions: sessions?.length || 0,
            totalCompanions: companions?.length || 0,
            totalBookmarks: bookmarks?.length || 0,
            subjectStats,
            recentSessions: recentSessions?.length || 0,
            sessionsData: sessions || [],
            companionsData: companions || [],
        };
    } catch (error) {
        console.error('getUserAnalytics error:', error);
        return {
            totalSessions: 0,
            totalCompanions: 0,
            totalBookmarks: 0,
            subjectStats: {},
            recentSessions: 0,
            sessionsData: [],
            companionsData: [],
        };
    }
};

// Get global analytics (for admin dashboard)
export const getGlobalAnalytics = async () => {
    const supabase = createSupabaseClient();
    
    try {
        // Total users (from session_history)
        const { data: uniqueUsers, error: usersError } = await supabase
            .from('session_history')
            .select('user_id')
            .order('user_id');
            
        if (usersError) throw new Error(usersError.message);
        
        const totalUsers = new Set(uniqueUsers?.map(u => u.user_id)).size;
        
        // Total sessions
        const { data: allSessions, error: sessionsError } = await supabase
            .from('session_history')
            .select('*');
            
        if (sessionsError) throw new Error(sessionsError.message);
        
        // Total companions
        const { data: allCompanions, error: companionsError } = await supabase
            .from('companions')
            .select('*');
            
        if (companionsError) throw new Error(companionsError.message);
        
        // Popular subjects
        const { data: popularSubjects, error: subjectsError } = await supabase
            .from('session_history')
            .select(`
                companions:companion_id (
                    subject
                )
            `);
            
        if (subjectsError) throw new Error(subjectsError.message);
        
        const subjectPopularity = popularSubjects?.reduce((acc: Record<string, number>, session: unknown) => {
            const subject = session.companions?.subject;
            if (subject) {
                acc[subject] = (acc[subject] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>) || {};
        
        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: recentActivity, error: recentError } = await supabase
            .from('session_history')
            .select('created_at')
            .gte('created_at', thirtyDaysAgo.toISOString());
            
        if (recentError) throw new Error(recentError.message);
        
        return {
            totalUsers,
            totalSessions: allSessions?.length || 0,
            totalCompanions: allCompanions?.length || 0,
            subjectPopularity,
            recentActivity: recentActivity?.length || 0,
        };
    } catch (error) {
        console.error('getGlobalAnalytics error:', error);
        return {
            totalUsers: 0,
            totalSessions: 0,
            totalCompanions: 0,
            subjectPopularity: {},
            recentActivity: 0,
        };
    }
};

// Get session trends (daily sessions for charts)
export const getSessionTrends = async (userId?: string, days = 7) => {
    const supabase = createSupabaseClient();
    
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        let query = supabase
            .from('session_history')
            .select('created_at')
            .gte('created_at', startDate.toISOString());
            
        if (userId) {
            query = query.eq('user_id', userId);
        }
        
        const { data, error } = await query;
        
        if (error) throw new Error(error.message);
        
        // Group by date
        const trends = data?.reduce((acc: Record<string, number>, session: { created_at: string }) => {
            const date = new Date(session.created_at).toDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>) || {};
        
        // Fill missing dates with 0
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            result.push({
                date: dateStr,
                sessions: trends[dateStr] || 0
            });
        }
        
        return result;
    } catch (error) {
        console.error('getSessionTrends error:', error);
        return [];
    }
};