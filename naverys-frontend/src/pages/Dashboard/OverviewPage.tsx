import { StatCard } from '../../components/Widgets/StatCard'
import { OverviewChart } from '../../components/Widgets/OverviewChart'
import { Users, MousePointerClick, Zap, DollarSign, Eye, UserPlus, Activity, Search, TrendingUp, Target } from 'lucide-react'
import { useMetrics } from '../../hooks/useMetrics'

export function OverviewPage() {
    const { metrics } = useMetrics();

    const activeIntegrationsCount = (metrics.connected ? 1 : 0) + (metrics.meta ? 1 : 0);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Sesiones" value={metrics.sessions > 0 ? metrics.sessions.toLocaleString() : "48.5K"} icon={<MousePointerClick size={20} />} trend="up" trendValue="12.5%" />
                <StatCard title="Usuarios Únicos" value={metrics.totalUsers > 0 ? metrics.totalUsers.toLocaleString() : "12.2K"} icon={<Users size={20} />} trend="up" trendValue="8.1%" />
                <StatCard title="Integraciones Activas" value={`${activeIntegrationsCount} API${activeIntegrationsCount !== 1 ? 's' : ''}`} icon={<Zap size={20} />} trend="neutral" trendValue="" />
            </div>
            {metrics.timeline.length > 0 ? (
                <OverviewChart data={metrics.timeline} />
            ) : (
                <OverviewChart data={[
                    { name: 'Lun', sessions: 0, users: 0 },
                    { name: 'Mar', sessions: 0, users: 0 },
                    { name: 'Mie', sessions: 0, users: 0 },
                    { name: 'Jue', sessions: 0, users: 0 },
                    { name: 'Vie', sessions: 0, users: 0 },
                    { name: 'Sab', sessions: 0, users: 0 },
                    { name: 'Dom', sessions: 0, users: 0 },
                ]} />
            )}

            {metrics.meta && (
                <div className="mt-10 mb-4 bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-500">
                            <Activity size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">Métricas Publicitarias</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-500 mt-1">Sincronización vía Graph API: <span className="font-semibold text-slate-700 dark:text-slate-300">{metrics.meta.account_name}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Inversión ($ USD)" value={metrics.meta.spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} icon={<DollarSign size={20} />} trend="neutral" trendValue="" />
                        <StatCard title="Impresiones Anuncios" value={metrics.meta.impressions.toLocaleString()} icon={<Eye size={20} />} trend="neutral" trendValue="" />
                        <StatCard title="Clics en Enlaces" value={metrics.meta.clicks.toLocaleString()} icon={<MousePointerClick size={20} />} trend="neutral" trendValue="" />
                        <StatCard title="Clientes Potenciales" value={metrics.meta.leads.toLocaleString()} icon={<UserPlus size={20} />} trend={metrics.meta.leads > 0 ? "up" : "neutral"} trendValue="" />
                    </div>
                </div>
            )}

            {metrics.seo && (
                <div className="mt-6 mb-4 bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Search size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">Rendimiento en Buscadores (SEO)</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-500 mt-1">
                                Google Search Console {metrics.seo.simulated && <span className="text-indigo-500 dark:text-indigo-400 font-semibold">(Simulado)</span>}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Clics Orgánicos" value={metrics.seo.clicks.toLocaleString()} icon={<MousePointerClick size={20} />} trend="neutral" trendValue="" />
                        <StatCard title="Impresiones Totales" value={metrics.seo.impressions.toLocaleString()} icon={<Eye size={20} />} trend="neutral" trendValue="" />
                        <StatCard title="CTR Promedio" value={`${metrics.seo.ctr.toFixed(2)}%`} icon={<Target size={20} />} trend="neutral" trendValue="" />
                        <StatCard title="Posición Media" value={metrics.seo.position.toFixed(1)} icon={<TrendingUp size={20} />} trend="up" trendValue="" />
                    </div>
                </div>
            )}
        </>
    )
}
