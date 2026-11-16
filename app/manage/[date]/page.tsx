import { notFound } from "next/navigation";

import { getClassNumberingConfig, getReportsByDate } from "../../../actions";

import { AutoRefresh } from "@/app/components/ui";

import { ReportItem } from "@/src/domain/attendance";

import type { Metadata } from "next";
import { AppTime } from "@/shared/time";

type Props = {
    params: Promise<{ date: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { date } = await params;

    const decodedName = date === AppTime.date()
        ? "本日回報"
        : decodeURIComponent(date);

    return {
        title: `${decodedName}學務處學生出缺勤回報系統`,
        description: `生活輔導組及全校班級每日出缺勤填報 - ${decodedName}`,
    };
}

export default async function DashboardPage({ params }: Props) {
    const { date } = await params;
    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) return notFound();

    const [config, reports] = await Promise.all([
        getClassNumberingConfig(),
        getReportsByDate(targetDate),
    ]);

    if (!config.data || !reports.data) return notFound();

    return (
        <div className="flex flex-col gap-space-lg w-full">

            <AutoRefresh intervalMs={30000} />\

            <div className="flex flex-col">
                <h1 className="font-display text-4xl text-primary tracking-tight font-bold">
                    {getFormattedDate(today)} 全校回報概況
                </h1>
            </div>

            {/* Metrics Grid */}
            <Suspense fallback={<MetricsSkeleton />}>
                <Metrics data={data} />
            </Suspense>

            {/* Class List Table */}
            <Suspense fallback={<ClassTableSkeleton />}>
                <ClassTable reports={fullReport} />
            </Suspense>


        </div>
    );
}