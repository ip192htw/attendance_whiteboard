// app/daily-report/page.tsx
import { Suspense } from "react";
import { redirect, forbidden } from "next/navigation";
import { requireUser } from "@/src/dal/auth";
import { UnauthorizedError, ForbiddenError } from "@/src/application/errors";
import { getReportConfig, getLeastReportByClass } from "./actions";
import Card, { SignOutButton } from "./components/ui";
import { ReportForm } from "./components/ReportForm";
import { ReportFormSkeleton } from "./components/ReportFormSkeleton"
import { AppTime } from "@/shared/time";

export default async function DailyReportPage() {
    let usr;
    try {
        usr = await requireUser();
    } catch (error) {
        if (error instanceof UnauthorizedError) redirect("/login");
        if (error instanceof ForbiddenError) forbidden();
        throw error;
    }

    if (usr.role !== "monitor") redirect("/manage");

    const [config, lastReport] = await Promise.all([
        getReportConfig(),
        getLeastReportByClass(usr.class),
    ]);

    const report = lastReport.data ?? null;

    // 檢查回報時間邏輯
    const date = AppTime.date();
    const day = AppTime.day();
    const time = AppTime.time();

    if (!config.data) return <ErrorMessage message="系統尚未啟用" />;
    if (date < config.data.semester_start) return <ErrorMessage message="本學期尚未開始" />;
    if (date > config.data.semester_end) return <ErrorMessage message="本學期已結束" />;
    if (day === 0 || day === 6) return <ErrorMessage message="今日非回報日" />;
    if (time < config.data.report_start_time) return <ErrorMessage message="今日回報尚未開始" />;
    if (time > config.data.report_end_time) return <ErrorMessage message="今日回報時間已結束" />;


    return (
        <Card>
            {/* 1. 外頁與標題：秒開直接渲染 */}
            <div className="text-center mb-8">
                <h1 className="font-headline-lg text-3xl font-extrabold text-primary-container mb-2">
                    學務處學生缺曠回報
                </h1>
                <p className="text-on-surface-variant text-2xl">
                    {usr.class}班
                </p>
            </div>

            {/* 2. 資料密集區塊：使用 Suspense 達成獨立 Streaming */}
            <Suspense fallback={<ReportFormSkeleton />}>
                <ReportForm
                    cooldown_seconds={config.data.report_cooldown_seconds}
                    report={report}
                />
            </Suspense>

            {/* 3. 靜態操作按鈕：秒開直接渲染 */}
            <div className="flex justify-center mt-6">
                <SignOutButton />
            </div>
        </Card>
    );
}

function ErrorMessage({ message }: { message: string }) {
    return (
        <h1 className="text-2xl text-center text-on-surface mb-space-sm tracking-tight font-bold">
            {message}
        </h1>
    );
}