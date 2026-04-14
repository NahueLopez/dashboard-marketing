import { StatCard } from '../../components/Widgets/StatCard'
import { OverviewChart } from '../../components/Widgets/OverviewChart'
import { Users, MousePointerClick, Zap } from 'lucide-react'
import { useMetrics } from '../../hooks/useMetrics'

export function OverviewPage() {
    const { metrics } = useMetrics();

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Sesiones" value={metrics.sessions > 0 ? metrics.sessions.toLocaleString() : "48.5K"} icon={<MousePointerClick size={20} />} trend="up" trendValue="12.5%" />
                <StatCard title="Usuarios Únicos" value={metrics.totalUsers > 0 ? metrics.totalUsers.toLocaleString() : "12.2K"} icon={<Users size={20} />} trend="up" trendValue="8.1%" />
                <StatCard title="Integraciones Activas" value={metrics.connected ? "1 API" : "0 APIs"} icon={<Zap size={20} />} trend="neutral" trendValue="0%" />
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
        </>
    )
}
