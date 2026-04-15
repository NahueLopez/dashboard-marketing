import { Activity, RefreshCcw, Users, MousePointerClick, UserPlus, Eye, Monitor, Smartphone } from 'lucide-react'
import { useMetrics } from '../../hooks/useMetrics'
import { StatCard } from '../../components/Widgets/StatCard'
import { ScoreRing } from '../../components/Widgets/ScoreRing'
import { OverviewChart } from '../../components/Widgets/OverviewChart'
import { useState, useEffect } from 'react'

export function WebMetricsPage() {
    const { metrics, loading, syncing, forceSync, syncPageSpeed } = useMetrics();
    const [pagespeedUrl, setPagespeedUrl] = useState('');

    useEffect(() => {
        if (metrics.pagespeedTargetUrl) {
            setPagespeedUrl(metrics.pagespeedTargetUrl);
        }
    }, [metrics.pagespeedTargetUrl]);

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
                    Métricas de velocidad y experiencia de usuario para tu dominio oficial (Google PageSpeed API).
                </p>

                <div className="bg-white dark:bg-[#111111] p-2 pl-5 rounded-xl border border-slate-200 dark:border-zinc-800 mb-6 flex gap-3 items-center">
                    <div className="flex-1 flex flex-col">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dominio Exacto a Analizar</label>
                        <input
                            type="url"
                            placeholder="https://ceramica-avellaneda.com.ar"
                            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-zinc-700 focus:ring-0 p-0 outline-none text-sm"
                            value={pagespeedUrl}
                            onChange={e => setPagespeedUrl(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => syncPageSpeed(pagespeedUrl)}
                        disabled={syncing || !pagespeedUrl}
                        className="px-6 py-3 h-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {syncing ? 'Analizando...' : 'Escaneo Exacto'}
                    </button>
                </div>

                {!metrics.pagespeed || !('mobile' in metrics.pagespeed) ? (
                    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 p-12 rounded-xl flex flex-col items-center justify-center text-center">
                        <Activity className="w-16 h-16 text-slate-300 dark:text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Análisis de Velocidad Pendiente</h3>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-lg text-sm">
                            Presiona Sincronizar Ahora para correr un escáner en vivo a tu dominio.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Mobile Column */}
                        <div className="bg-white dark:bg-[#111111] p-6 lg:p-8 rounded-xl border border-slate-200 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-500">
                                        <Smartphone size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Teléfono Móvil</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <ScoreRing value={metrics.pagespeed.mobile.performance_score} label="Rendimiento" />
                                <ScoreRing value={metrics.pagespeed.mobile.accessibility_score} label="Accesibilidad" />
                                <ScoreRing value={metrics.pagespeed.mobile.best_practices_score} label="Prácticas" />
                                <ScoreRing value={metrics.pagespeed.mobile.seo_score} label="SEO" />
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-zinc-800/50 pt-6">
                                <div>
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold tracking-widest uppercase mb-1">LCP Paint</p>
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{metrics.pagespeed.mobile.lcp}</p>
                                </div>
                                <div className="border-l border-slate-100 dark:border-zinc-800/50 pl-4">
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold tracking-widest uppercase mb-1">FCP Time</p>
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{metrics.pagespeed.mobile.fcp}</p>
                                </div>
                                <div className="border-l border-slate-100 dark:border-zinc-800/50 pl-4">
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold tracking-widest uppercase mb-1">Layout Shift</p>
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{metrics.pagespeed.mobile.cls}</p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Column */}
                        <div className="bg-white dark:bg-[#111111] p-6 lg:p-8 rounded-xl border border-slate-200 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-500">
                                        <Monitor size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ordenador PC</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <ScoreRing value={metrics.pagespeed.desktop.performance_score} label="Rendimiento" />
                                <ScoreRing value={metrics.pagespeed.desktop.accessibility_score} label="Accesibilidad" />
                                <ScoreRing value={metrics.pagespeed.desktop.best_practices_score} label="Prácticas" />
                                <ScoreRing value={metrics.pagespeed.desktop.seo_score} label="SEO" />
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-zinc-800/50 pt-6">
                                <div>
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold tracking-widest uppercase mb-1">LCP Paint</p>
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{metrics.pagespeed.desktop.lcp}</p>
                                </div>
                                <div className="border-l border-slate-100 dark:border-zinc-800/50 pl-4">
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold tracking-widest uppercase mb-1">FCP Time</p>
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{metrics.pagespeed.desktop.fcp}</p>
                                </div>
                                <div className="border-l border-slate-100 dark:border-zinc-800/50 pl-4">
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold tracking-widest uppercase mb-1">Layout Shift</p>
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{metrics.pagespeed.desktop.cls}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <hr className="border-slate-200 dark:border-zinc-800" />

            {/* Google Analytics Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Google Analytics 4</h2>
                        </div>
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
