import { notFound } from "next/navigation";
import { getClassNumberingConfig, getReportsByDate } from "@/app/actions";
import type { Metadata } from "next";
import { AppTime } from "@/shared/time";

import { DashboardContent } from "./components";

import Providers from "../components/QueryProviders"

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
        <Providers>
            <DashboardContent
                date={date}
                config={config.data}
                initialReports={reports.data}
            />
        </Providers>
    );
}