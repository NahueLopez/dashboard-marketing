import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { apiFetch } from '../App';

interface MetricsState {
    propertyName: string | null;
    pagespeedTargetUrl: string | null;
    sessions: number;
    totalUsers: number;
    newUsers: number;
    pageViews: number;
    timeline: Array<{ name: string, sessions: number, users: number }>;
    pagespeed: {
        mobile: any;
        desktop: any;
    } | null;
    meta: {
        account_name: string;
        spend: number;
        impressions: number;
        clicks: number;
        cpc: number;
        cpm: number;
        leads: number;
    } | null;
    seo: {
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
        simulated?: boolean;
    } | null;
    connected: boolean;
    last_updated: string | null;
}

interface MetricsContextType {
    metrics: MetricsState;
    loading: boolean;
    syncing: boolean;
    forceSync: () => Promise<void>;
    syncPageSpeed: (url: string) => Promise<void>;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export function MetricsProvider({ children }: { children: ReactNode }) {
    const [metrics, setMetrics] = useState<MetricsState>({
        propertyName: null,
        pagespeedTargetUrl: null,
        sessions: 0,
        totalUsers: 0,
        newUsers: 0,
        pageViews: 0,
        timeline: [],
        pagespeed: null,
        meta: null,
        seo: null,
        connected: false,
        last_updated: null
    });
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchMetrics = useCallback(async (isBackgroundSync = false) => {
        try {
            if (!isBackgroundSync) setLoading(true);
            const response = await apiFetch('/api/auth/metrics', { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                setMetrics(data);
            }
        } catch (error) {
            console.error('Failed to fetch metrics', error);
        } finally {
            if (!isBackgroundSync) setLoading(false);
        }
    }, []);

    const forceSync = useCallback(async () => {
        try {
            setSyncing(true);
            const response = await apiFetch('/api/auth/metrics/sync', { method: 'POST' });
            if (response.ok) {
                await fetchMetrics(true); // background reload
            }
        } catch (error) {
            console.error('Failed to sync metrics', error);
        } finally {
            setSyncing(false);
        }
    }, [fetchMetrics]);

    useEffect(() => {
        void fetchMetrics();
    }, [fetchMetrics]);

    const syncPageSpeed = useCallback(async (url: string) => {
        try {
            setSyncing(true);
            const response = await apiFetch('/api/auth/metrics/pagespeed', {
                method: 'POST',
                body: JSON.stringify({ url })
            });
            if (!response.ok) {
                const err = await response.json();
                alert(err.error || 'Google PageSpeed rechazó la conexión (Límite de Uso).');
                return;
            }
            await fetchMetrics(true);
        } catch (error) {
            console.error('Failed to sync pagespeed', error);
            alert('Error de conexión con la API.');
        } finally {
            setSyncing(false);
        }
    }, [fetchMetrics]);

    const contextValue = useMemo(() => ({
        metrics, loading, syncing, forceSync, syncPageSpeed
    }), [metrics, loading, syncing, forceSync, syncPageSpeed]);

    return (
        <MetricsContext.Provider value={contextValue}>
            {children}
        </MetricsContext.Provider>
    );
}

export function useMetrics() {
    const context = useContext(MetricsContext);
    if (context === undefined) {
        throw new Error('useMetrics must be used within a MetricsProvider');
    }
    return context;
}
