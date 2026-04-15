import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "../ThemeToggle";
import { ChevronDown, Check } from "lucide-react";
import { useMetrics } from "../../hooks/useMetrics";
import { apiFetch } from "../../App";

interface Props {
    children: ReactNode;
    handleLogout: () => void;
}

export function DashboardLayout({ children, handleLogout }: Props) {
    const { metrics, forceSync, syncing } = useMetrics();
    const [properties, setProperties] = useState<{ id: string, name: string }[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [switching, setSwitching] = useState(false);

    useEffect(() => {
        if (metrics.connected) {
            apiFetch('/api/oauth/google/properties', { method: 'GET' })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setProperties(data);
                });
        }
    }, [metrics.connected]);

    const handleSelectProperty = async (propId: string, propName: string) => {
        setShowDropdown(false);
        setSwitching(true);
        await apiFetch('/api/oauth/google/properties', {
            method: 'POST',
            body: JSON.stringify({ property_id: propId, property_name: propName })
        });
        await forceSync();
        setSwitching(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
            <Sidebar handleLogout={handleLogout} />
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="h-16 px-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-10 w-full">
                    <div className="font-medium text-sm text-slate-500 dark:text-zinc-400 relative z-50 flex items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-100 mr-3 hidden sm:inline-block">Naverys Panel</span>

                        {metrics.connected && metrics.propertyName ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    disabled={switching || syncing}
                                    className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                    {switching ? 'Cambiando origen...' : metrics.propertyName}
                                    <ChevronDown size={14} className={showDropdown ? "rotate-180 transition-transform" : "transition-transform"} />
                                </button>

                                {showDropdown && properties.length > 0 && (
                                    <div className="absolute top-12 left-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-xl py-2 w-72 backdrop-blur-xl">
                                        <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800/50 flex items-center justify-between">
                                            Orígenes de Datos
                                            <span className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px]">{properties.length}</span>
                                        </div>
                                        <div className="max-h-[60vh] overflow-y-auto p-1 custom-scrollbar">
                                            {properties.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => handleSelectProperty(p.id, p.name)}
                                                    className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all duration-200 mb-1 ${metrics.propertyName === p.name ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-slate-300 font-medium'}`}
                                                >
                                                    <span className="truncate pr-4">{p.name}</span>
                                                    {metrics.propertyName === p.name && <Check size={16} className="text-blue-500 shrink-0" strokeWidth={3} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="px-2">Sincronización Inactiva</span>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:opacity-90">
                            N
                        </div>
                    </div>
                </header>
                <main className="p-6 flex-1 w-full max-w-6xl mx-auto overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
