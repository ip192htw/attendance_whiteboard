import { StatCard } from "./StatCard";

export interface MetricsData {
    classcount: number;
    classespergrade: number;
    reportedClass: number;
    notReportedGrade1: number[];
    notReportedGrade2: number[];
    notReportedGrade3: number[];
    sick: number;
    personal: number;
    official: number;
    other: number;
    all: number;
}

export function Metrics({ data }: { data: MetricsData }) {
    const grades = [
        { label: '高一', unreported: data.notReportedGrade1 },
        { label: '高二', unreported: data.notReportedGrade2 },
        { label: '高三', unreported: data.notReportedGrade3 },
    ];

    const absences = [
        { label: '病', count: data.sick, color: 'text-rose-500' },
        { label: '事', count: data.personal, color: 'text-yellow-600' },
        { label: '公', count: data.official, color: 'text-lime-600' },
        { label: '曠', count: data.other, color: 'text-red-600' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Card 1: Completed */}
            <StatCard
                title="已完成回報班級"
                icon="task_alt"
                accentClass="bg-tertiary-container"
                iconClass="text-tertiary-container"
                iconFilled
            >
                <div className="mt-space-md flex items-baseline gap-space-xs">
                    <span className="font-display text-3xl text-primary font-bold tracking-tight">
                        {data.reportedClass}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                        / {data.classcount} 班
                    </span>
                </div>
                <div className="mt-space-md flex flex-col gap-1.5 pt-space-xs border-t border-outline-variant/30">
                    {grades.map(({ label, unreported }) => (
                        <span key={label} className="font-numeric-data text-label-sm">
                            {label}：{data.classespergrade - unreported.length} / {data.classespergrade}
                        </span>
                    ))}
                </div>
            </StatCard>

            {/* Card 2: Pending */}
            <StatCard
                title="尚未送出回報"
                icon="notifications_active"
                accentClass="bg-[#b87333]"
                iconClass="text-[#8a531e]"
                className="lg:col-span-2"
            >
                <div className="mt-space-md flex flex-col pt-space-xs border-t border-outline-variant/30">
                    {grades.map(({ label, unreported }) => (
                        <span
                            key={label}
                            className="font-headline-sm text-headline-sm text-on-surface-variant"
                        >
                            {label}：{unreported.length ? `${unreported.join('、')}。` : ''}
                        </span>
                    ))}
                </div>
            </StatCard>

            {/* Card 3: Absence */}
            <StatCard
                title="全校缺席人數統計"
                icon="person_off"
                accentClass="bg-primary-container"
                iconClass="text-primary-container"
                className="justify-between"
            >
                <div className="mt-space-md flex items-baseline gap-space-xs">
                    <span className="font-headline-md text-xl text-on-surface-variant">共</span>
                    <span className="font-display text-3xl text-primary font-bold tracking-tight">
                        {data.all}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                        名學生
                    </span>
                </div>
                <div className="mt-space-sm flex items-center gap-2 pt-space-xs border-t border-outline-variant/30 font-label-sm text-label-sm">
                    {absences.map(({ label, count, color }) => (
                        <span
                            key={label}
                            className={`px-1.5 py-0.5 bg-surface-container rounded font-medium ${color}`}
                        >
                            {label} {count}
                        </span>
                    ))}
                </div>
            </StatCard>
        </div>
    );
}