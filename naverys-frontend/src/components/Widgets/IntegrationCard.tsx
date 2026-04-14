import { ReactNode } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface IntegrationCardProps {
    provider: 'Google' | 'Meta';
    description: string;
    status: 'connected' | 'disconnected' | 'loading';
    icon: ReactNode;
    onConnect: () => void;
}

export function IntegrationCard({ provider, description, status, icon, onConnect }: IntegrationCardProps) {
    if (status === 'loading') {
        return (
            <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl animate-pulse shadow-sm">
                <div className="h-10 w-10 bg-slate-200 dark:bg-zinc-800 rounded-lg mb-4"></div>
                <div className="h-5 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded mb-6"></div>
                <div className="h-10 w-full bg-slate-200 dark:bg-zinc-800 rounded-lg"></div>
            </div>
        );
    }

    const isConnected = status === 'connected';

    return (
        <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-lg ${provider === 'Google' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600'}`}>
                        {icon}
                    </div>
                    {isConnected ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                            <CheckCircle2 size={14} /> Conectado
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full">
                            <XCircle size={14} /> Desconectado
                        </span>
                    )}
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{provider} {provider === 'Google' ? 'Analytics' : 'Business'}</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 line-clamp-3">
                    {description}
                </p>
            </div>

            <button
                onClick={onConnect}
                className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${isConnected
                        ? 'bg-slate-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-sm'
                    }`}
            >
                {isConnected ? 'Renovar Permisos (Reconectar)' : 'Vincular Cuenta'}
                {!isConnected && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
        </div>
    );
}
