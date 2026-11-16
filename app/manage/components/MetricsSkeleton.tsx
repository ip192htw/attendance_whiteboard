export function MetricsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md animate-pulse">
            {/* Card 1: Completed */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary-container" />
                <div className="flex items-center justify-between"></div>
                <div className="mt-space-md flex items-baseline gap-space-xs"></div>
                {/* <div className="mt-space-sm flex items-center justify-between pt-space-xs border-t border-outline-variant/30"></div> */}
            </div>

            {/* Card 2: Pending */}
            <div className="bg-surface-container-lowest lg:col-span-2 rounded-xl p-space-lg shadow-sm flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#b87333]" />
                <div className="flex items-center justify-between"></div>
                <div className="mt-space-md flex flex-col items-baseline gap-space-xs"></div>
                {/* <div className="mt-space-sm flex items-center justify-between pt-space-xs border-t border-outline-variant/30"></div> */}
            </div>

            {/* Card 3: Absence */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />
                <div className="flex items-center justify-between"></div>
                <div className="mt-space-md flex items-baseline gap-space-xs"></div>
                <div className="mt-space-sm flex items-center gap-2 pt-space-xs border-t border-outline-variant/30 font-label-sm text-label-sm text-on-surface-variant"></div>
            </div>
        </div>
    )
}