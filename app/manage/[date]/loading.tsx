import { MetricsSkeleton, ClassTableSkeleton } from "../components"



type Props = {
    params: Promise<{ date: string }>;
};



export default async function DashboardPage({ params }: Props) {
    const { date } = await params

    const today = new Date(date)


    function getFormattedDate(date: Date): string {
        const days = ['日', '一', '二', '三', '四', '五', '六'] as const;

        const year = date.getFullYear() - 1911;
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayName = days[date.getDay()];

        return `${year}年${month}月${day}日 (${dayName})`;
    }

    return (
        <div className="flex flex-col gap-space-lg w-full">


            <div className="flex flex-col">
                <h1 className="font-display text-4xl text-primary tracking-tight font-bold">
                    {getFormattedDate(today)} 全校回報概況
                </h1>
            </div>

            {/* Metrics Grid */}
            <MetricsSkeleton />

            {/* Class List Table */}
            <ClassTableSkeleton />

        </div>
    );
}
