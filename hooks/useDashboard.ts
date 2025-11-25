import { auth, getDashboardStats } from '@/services/firebase';
import { DashboardStats } from '@/services/firebase/dashboard';
import { useEffect, useState } from 'react';

interface UseDashboardReturn {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

export function useDashboard(dateRange: 7 | 14 | 30 = 7): UseDashboardReturn {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentUser = auth.currentUser;

    const loadStats = async () => {
        if (!currentUser) {
            setLoading(false);
            setError('User not authenticated');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            console.log(`📊 Loading dashboard stats for ${dateRange} days...`);

            const dashboardStats = await getDashboardStats(currentUser.uid, dateRange);
            setStats(dashboardStats);
            console.log('✅ Dashboard stats loaded:', dashboardStats);
        } catch (err: any) {
            console.error('❌ Error loading dashboard stats:', err);
            setError(err.message || 'Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [currentUser?.uid, dateRange]);

    const refresh = () => {
        loadStats();
    };

    return {
        stats,
        loading,
        error,
        refresh
    };
}
