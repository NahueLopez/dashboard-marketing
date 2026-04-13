import { Activity } from 'lucide-react'

export function WebMetricsPage() {
    return (
        <div className="mt-8 bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 p-12 rounded-xl flex flex-col items-center justify-center text-center">
            <Activity className="w-16 h-16 text-slate-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Core Web Vitals</h3>
            <p className="text-slate-500 dark:text-zinc-400 max-w-lg text-sm">
                Aquí irán reflejadas las analíticas de velocidad, CLS, LCP integradas directamente desde PageSpeed Insights al proyecto Naverys.
            </p>
        </div>
    )
}
