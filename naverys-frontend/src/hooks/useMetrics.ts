import { useState, useEffect } from 'react';
import { apiFetch } from '../App';

export function useMetrics() {
    const [metrics, setMetrics] = useState({
        sessions: 0,
        totalUsers: 0,
        newUsers: 0,
        pageViews: 0,
        timeline: [] as Array<{name: string, sessions: number, users: number}>,
        pagespeed: null as {
            performance_score: number;
            lcp: string;
            fcp: string;
            cls: string;
            tti: string;
        } | null,
        connected: false,
        last_updated: null as string | null
    });
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const response = await apiFetch('/api/auth/metrics', { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                setMetrics(data);
            }
        } catch (error) {
            console.error('Failed to fetch metrics', error);
        } finally {
            setLoading(false);
        }
    };

    const forceSync = async () => {
        try {
            setSyncing(true);
            const response = await apiFetch('/api/auth/metrics/sync', { method: 'POST' });
            if (response.ok) {
                await fetchMetrics(); // reload
            }
        } catch (error) {
            console.error('Failed to sync metrics', error);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        void fetchMetrics();
    }, []);

    return { metrics, loading, syncing, forceSync };
}
