interface StatCardProps {
    title: string;
    icon: string;
    accentClass: string;
    iconClass: string;
    iconFilled?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function StatCard({
    title,
    icon,
    accentClass,
    iconClass,
    iconFilled,
    className = '',
    children,
}: StatCardProps) {
    return (
        <div
            className={`bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col relative overflow-hidden ${className}`}
        >
            <div className={`absolute top-0 left-0 right-0 h-1 ${accentClass}`} />
            <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    {title}
                </span>
                <span
                    className={`material-symbols-outlined text-[20px] ${iconClass}`}
                    style={iconFilled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                    {icon}
                </span>
            </div>
            {children}
        </div>
    );
}