import { useIntegrations } from '../../hooks/useIntegrations';
import { IntegrationCard } from '../../components/Widgets/IntegrationCard';
import { BarChart3, Share2 } from 'lucide-react';

interface IntegrationsPageProps {
    handleOAuth: (provider: string) => Promise<void>
}

export function IntegrationsPage({ handleOAuth }: IntegrationsPageProps) {
    const { connectedProviders, loading } = useIntegrations();

    const getStatus = (provider: string) => {
        if (loading) return 'loading';
        return connectedProviders.includes(provider) ? 'connected' : 'disconnected';
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Integraciones de Datos</h2>
                <p className="text-slate-500 dark:text-zinc-400">
                    Gestión de plataformas de terceros. Conecta tus proveedores oficiales para alimentar el análisis transaccional general de la visión de la empresa.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard
                    provider="Google"
                    description="Vincula tu propiedad de Google Analytics 4 para sincronizar sesiones en vivo, tasas de abandono y tráfico orgánico centralizado."
                    status={getStatus('google')}
                    icon={<BarChart3 size={24} />}
                    onConnect={() => handleOAuth('google')}
                />
                <IntegrationCard
                    provider="Meta"
                    description="Conecta con Meta Business Suite para importar el rendimiento de campañas pagas, ROI publicitario y datos demográficos interactivos."
                    status={getStatus('meta')}
                    icon={<Share2 size={24} />}
                    onConnect={() => handleOAuth('meta')}
                />
            </div>
        </div>
    );
}
