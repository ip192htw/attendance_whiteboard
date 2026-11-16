"use client";


import {
    Metrics,
    ClassTable,
    type MetricsData,
} from "../components";

import { useReportsByDate } from "@/hooks/use-reports-by-date";

import { ReportItem } from "@/src/domain/attendance";
import { ClassNumberingConfig } from "@/src/domain/system";

import { AppTime } from "@/shared/time";



interface Props {
    date: string;
    config: ClassNumberingConfig;
    initialReports: ReportItem[]
}

export function DashboardContent({
    date,
    config,
    initialReports,
}: Props) {
    const { data: reports } = useReportsByDate({
        date,
        initialData: initialReports,
    });

    const today = new Date(date);

    // 以下沿用原本的統計邏輯
    const data: MetricsData = {
        classcount: +config.classesPerGrade * 3,
        reportedClass: 0,

        notReportedGrade1: [],
        notReportedGrade2: [],
        notReportedGrade3: [],

        sick: 0,
        personal: 0,
        official: 0,
        other: 0,
        all: 0,
    };

    const reportsMap = new Map(
        reports.map((report) => [report.class, report])
    );

    const yearBaseClass =
        +config.baseClass +
        (
            AppTime.year() -
            +config.baseYear -
            (AppTime.month() >= 8 ? 1 : 0)
        ) * +config.classesPerGrade;

    function getGrade(classNo: number) {
        const offset = classNo - yearBaseClass;

        if (offset < 0 || offset >= data.classcount) {
            return 0;
        }

        return 3 - Math.floor(offset / +config.classesPerGrade);
    }

    const allClass = Array.from(
        { length: 3 * +config.classesPerGrade },
        (_, i) => String(yearBaseClass + i)
    );

    const fullReport: ReportItem[] = allClass.map((classNo) => {
        const report = reportsMap.get(classNo);
        const grade = getGrade(+classNo);

        if (report) {
            data.sick += report.sick;
            data.personal += report.personal;
            data.official += report.official;
            data.other += report.other;
            data.all += report.absentCount;
            data.reportedClass += 1;

            return {
                ...report,
                grade,
            };
        }

        switch (grade) {
            case 1:
                data.notReportedGrade1.push(+classNo);
                break;
            case 2:
                data.notReportedGrade2.push(+classNo);
                break;
            case 3:
                data.notReportedGrade3.push(+classNo);
                break;
        }

        return {
            id: "",
            class: classNo,
            grade,

            sick: 0,
            personal: 0,
            official: 0,
            other: 0,

            absentCount: -1,

            status: "pending",
            report_date: "Not available",
            submitted_by: "Not available",
            submitted_at: "Not available",
        };
    });

    function getFormattedDate(date: Date): string {
        const days = ["日", "一", "二", "三", "四", "五", "六"] as const;

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

            <Metrics data={data} />

            <ClassTable reports={fullReport} />
        </div>
    );
}