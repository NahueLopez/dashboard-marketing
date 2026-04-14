import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "../ThemeToggle";

interface Props {
    children: ReactNode;
    handleLogout: () => void;
}

export function DashboardLayout({ children, handleLogout }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
            <Sidebar handleLogout={handleLogout} />
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="h-16 px-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-10 w-full">
                    <div className="font-medium text-sm text-slate-500 dark:text-zinc-400">
                        Dashboard Global
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
