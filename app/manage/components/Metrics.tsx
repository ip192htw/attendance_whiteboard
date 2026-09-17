


export function Metrics() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Card 1: Completed */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary-container" />
            <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                已完成回報班級
                </span>
                <span
                className="material-symbols-outlined text-tertiary-container text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
                >
                task_alt
                </span>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-xs">
                <span className="font-display text-3xl text-primary font-bold tracking-tight">
                30
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                / 45 班
                </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between pt-space-xs border-t border-outline-variant/30">
                <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-tertiary-container" />
                <span className="font-numeric-data text-label-sm text-tertiary-container font-semibold">
                    66.7% 完成進度
                </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                符合常態速率
                </span>
            </div>
            </div>

            {/* Card 2: Pending */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#b87333]" />
            <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                尚未送出回報
                </span>
                <span className="material-symbols-outlined text-[#8a531e] text-[20px]">
                notifications_active
                </span>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-xs">
                <span className="font-display text-3xl text-[#7a4816] font-bold tracking-tight">
                15
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                班未到表
                </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between pt-space-xs border-t border-outline-variant/30">
                <button
                type="button"
                className="inline-flex items-center gap-1 text-primary-container hover:text-primary font-label-sm text-label-sm font-semibold transition-colors hover:underline cursor-pointer"
                >
                <span className="material-symbols-outlined text-[15px]">
                    campaign
                </span>
                <span>發送推播廣播提醒</span>
                </button>
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                剩餘 25 分
                </span>
            </div>
            </div>

            {/* Card 3: Absence */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />
            <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                全校登記缺席
                </span>
                <span className="material-symbols-outlined text-primary-container text-[20px]">
                person_off
                </span>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-xs">
                <span className="font-display text-3xl text-primary font-bold tracking-tight">
                23
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                名學生
                </span>
            </div>
            <div className="mt-space-sm flex items-center gap-2 pt-space-xs border-t border-outline-variant/30 font-label-sm text-label-sm text-on-surface-variant">
                <span className="px-1.5 py-0.5 bg-surface-container rounded text-primary font-medium">
                病假 14
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container rounded text-secondary font-medium">
                事假 6
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container rounded text-tertiary-container font-medium">
                公假 3
                </span>
            </div>
            </div>

            {/* Card 4: Live Update */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-outline-variant" />
            <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                即時最新送交
                </span>
                <span className="inline-flex items-center gap-1 font-numeric-data text-label-sm text-tertiary-container">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-ping" />{" "}
                即時
                </span>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-xs">
                <span className="font-numeric-data text-2xl text-primary font-bold">
                14:35
                </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between pt-space-xs border-t border-outline-variant/30">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                最近紀錄：一年五班
                </span>
                <span className="font-label-sm text-label-sm text-tertiary-container font-semibold">
                已即時存檔
                </span>
            </div>
            </div>
        </div>
    )
}