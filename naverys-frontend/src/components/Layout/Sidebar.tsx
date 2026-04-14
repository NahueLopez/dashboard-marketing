import { LayoutDashboard, Users, Activity, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar({ handleLogout }: { handleLogout: () => void }) {
    return (
        <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-col hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-zinc-800">
                <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    Naverys
                </div>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1">
                <p className="px-2 text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">General</p>

                <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-slate-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/50 text-slate-600 dark:text-zinc-400'}`}>
                    <LayoutDashboard size={18} />
                    Overview
                </NavLink>

                <NavLink to="/metrics" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-slate-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/50 text-slate-600 dark:text-zinc-400'}`}>
                    <Activity size={18} />
                    Métricas Web
                </NavLink>

                <NavLink to="/integrations" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-slate-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/50 text-slate-600 dark:text-zinc-400'}`}>
                    <Users size={18} />
                    Integraciones
                </NavLink>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}
