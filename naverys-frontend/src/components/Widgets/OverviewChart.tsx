import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Lun', sessions: 1200, users: 900 },
    { name: 'Mar', sessions: 2100, users: 1800 },
    { name: 'Mie', sessions: 1800, users: 1500 },
    { name: 'Jue', sessions: 3200, users: 2800 },
    { name: 'Vie', sessions: 2600, users: 2200 },
    { name: 'Sab', sessions: 3900, users: 3100 },
    { name: 'Dom', sessions: 4800, users: 4200 },
];

export function OverviewChart() {
    return (
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm mt-6 hover:border-blue-500/30 dark:hover:border-zinc-600 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Tráfico Semanal de la Propiedad</h3>
            <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-zinc-800/80" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                            itemStyle={{ color: '#60a5fa' }}
                        />
                        <Area type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
