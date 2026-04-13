import type { ReactNode } from "react"

interface StatCardProps {
    title: string
    value: string
    icon: ReactNode
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
}

export function StatCard({ title, value, icon, trend, trendValue }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-500/30 dark:hover:border-zinc-600 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                    {title}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-zinc-800/50 rounded-lg text-slate-600 dark:text-zinc-300">
                    {icon}
                </div>
            </div>

            <div>
                <div className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-1">
                    {value}
                </div>

                {trendValue && (
                    <div className={`text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                            trend === 'down' ? 'text-red-500 dark:text-red-400' :
                                'text-slate-500 dark:text-zinc-400'
                        }`}>
                        {trend === 'up' && '↗'}
                        {trend === 'down' && '↘'}
                        {trend === 'neutral' && '→'}
                        <span>{trendValue} </span>
                        <span className="text-slate-400 dark:text-zinc-500 font-normal">vs último mes</span>
                    </div>
                )}
            </div>
        </div>
    )
}
