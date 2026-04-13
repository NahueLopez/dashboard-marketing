import { StatCard } from '../../components/Widgets/StatCard'
import { OverviewChart } from '../../components/Widgets/OverviewChart'
import { Users, MousePointerClick, Zap } from 'lucide-react'

export function OverviewPage() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Sesiones" value="48.5K" icon={<MousePointerClick size={20} />} trend="up" trendValue="12.5%" />
                <StatCard title="Usuarios Únicos" value="12.2K" icon={<Users size={20} />} trend="up" trendValue="8.1%" />
                <StatCard title="Integraciones Activas" value="2 APIs" icon={<Zap size={20} />} trend="neutral" trendValue="0%" />
            </div>
            <OverviewChart />
        </>
    )
}
