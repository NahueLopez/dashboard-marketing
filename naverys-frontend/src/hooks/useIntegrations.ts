import { useState, useEffect } from 'react';
import { apiFetch } from '../App';

export function useIntegrations() {
    const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const response = await apiFetch('/api/oauth/accounts', { method: 'GET' });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setConnectedProviders(data.connected);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch integrations', error);
            } finally {
                setLoading(false);
            }
        };

        void fetchIntegrations();
    }, []);

    return { connectedProviders, loading };
}
