
export function ScoreRing({ value, label }: { value: number, label: string }) {
    // 0-49 red, 50-89 orange, 90-100 green
    let colorClass = 'text-red-500';
    let bgColorClass = 'text-red-100 dark:text-red-950/30';
    if (value >= 50 && value < 90) {
        colorClass = 'text-orange-500';
        bgColorClass = 'text-orange-100 dark:text-orange-950/30';
    } else if (value >= 90) {
        colorClass = 'text-green-500';
        bgColorClass = 'text-green-100 dark:text-green-950/30';
    }

    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-start">
            <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        className={bgColorClass}
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className={colorClass}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                    />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center text-3xl mb-1 ${colorClass}`}>
                    {value}
                </div>
            </div>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                {label}
            </span>
        </div>
    );
}
