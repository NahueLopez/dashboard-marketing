import { Activity, RefreshCcw, Users, MousePointerClick, UserPlus, Eye } from 'lucide-react'
import { useMetrics } from '../../hooks/useMetrics'
import { StatCard } from '../../components/Widgets/StatCard'
import { OverviewChart } from '../../components/Widgets/OverviewChart'

export function WebMetricsPage() {
    const { metrics, loading, syncing, forceSync } = useMetrics();

    if (loading) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center py-12">
                <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500 dark:text-zinc-400">Cargando métricas de Google Analytics...</p>
            </div>
        );
    }

    if (!metrics.connected) {
        return (
            <div className="mt-8 bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 p-12 rounded-xl flex flex-col items-center justify-center text-center">
                <Activity className="w-16 h-16 text-slate-300 dark:text-zinc-700 mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Sin Conexión</h3>
                <p className="text-slate-500 dark:text-zinc-400 max-w-lg text-sm">
                    Aún no has conectado tu cuenta de Google Analytics 4. Por favor, ve a la sección de Integraciones y vincula tu cuenta oficial.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full mt-4 space-y-8">
            {/* Core Web Vitals Section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Core Web Vitals</h2>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">
                    Métricas de velocidad y experiencia de usuario para naverys.com (Google PageSpeed API).
                </p>

                {!metrics.pagespeed ? (
                    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 p-12 rounded-xl flex flex-col items-center justify-center text-center">
                        <Activity className="w-16 h-16 text-slate-300 dark:text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Análisis de Velocidad Pendiente</h3>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-lg text-sm">
                            Presiona Sincronizar Ahora para correr un escáner en vivo a tu dominio.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Performance" 
                            value={metrics.pagespeed.performance_score.toString()} 
                            icon={<Activity size={20} />} 
                            trend={metrics.pagespeed.performance_score >= 90 ? 'up' : 'neutral'} 
                        />
                        <StatCard 
                            title="Largest Contentful Paint" 
                            value={metrics.pagespeed.lcp} 
                            icon={<Activity size={20} />} 
                        />
                        <StatCard 
                            title="First Contentful Paint" 
                            value={metrics.pagespeed.fcp} 
                            icon={<Activity size={20} />} 
                        />
                        <StatCard 
                            title="Cumulative Layout Shift" 
                            value={metrics.pagespeed.cls} 
                            icon={<Activity size={20} />} 
                        />
                    </div>
                )}
            </div>

            <hr className="border-slate-200 dark:border-zinc-800" />

            {/* Google Analytics Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Google Analytics 4</h2>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm">
                            Últimos 30 días. Actualizado: {metrics.last_updated ? new Date(metrics.last_updated).toLocaleString() : 'Nunca'}
                        </p>
                    </div>
                    <button 
                        onClick={forceSync} 
                        disabled={syncing}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium text-sm"
                    >
                        <RefreshCcw size={16} className={syncing ? "animate-spin" : ""} />
                        {syncing ? "Sincronizando..." : "Sincronizar Ahora"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Usuarios Totales" 
                        value={metrics.totalUsers.toLocaleString()} 
                        icon={<Users size={20} />} 
                        trend="up" 
                        trendValue="12.5%" 
                    />
                    <StatCard 
                        title="Usuarios Nuevos" 
                        value={metrics.newUsers.toLocaleString()} 
                        icon={<UserPlus size={20} />} 
                        trend="up" 
                        trendValue="8.1%" 
                    />
                    <StatCard 
                        title="Sesiones" 
                        value={metrics.sessions.toLocaleString()} 
                        icon={<MousePointerClick size={20} />} 
                        trend="up" 
                        trendValue="5.4%" 
                    />
                    <StatCard 
                        title="Vistas de Página" 
                        value={metrics.pageViews.toLocaleString()} 
                        icon={<Eye size={20} />} 
                        trend="up" 
                        trendValue="15.2%" 
                    />
                </div>

                <div className="mt-8">
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
                </div>
            </div>
        </div>
    )
}
