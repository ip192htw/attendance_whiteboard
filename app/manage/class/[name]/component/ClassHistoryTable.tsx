"use client";

import { useClassHistory } from "@/hooks/use-class-history";

type Report = {
    id: string;
    class: string;
    report_date: string;
    submitted_by: string;
    submitted_at: string;
    payload: Record<string, number[]>;
};

type ClassHistoryTableProps = {
    classNo: string;
};

const leaveTypeLabels: Record<string, string> = {
    sick: "病假",
    personal: "事假",
    official: "公假",
    other: "其他",
};

function getSummary(payload: Report["payload"]) {
    return Object.entries(payload)
        .map(([type, students]) => {
            const label = leaveTypeLabels[type] ?? type;

            return `${label} ${students.length}`;
        })
        .join("、");
}

function formatDate(date: string) {
    const value = new Date(`${date}T00:00:00`);

    return new Intl.DateTimeFormat("zh-TW", {
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
    }).format(value);
}

function formatTime(timestamp: string) {
    return new Intl.DateTimeFormat("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(timestamp));
}

export function ClassHistoryTable({
    classNo,
}: ClassHistoryTableProps) {
    const {
        items,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        loadMore,
    } = useClassHistory(classNo);

    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest">
                <div className="animate-pulse">
                    <div className="h-14 bg-surface-container" />

                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-16 border-t border-outline-variant bg-surface-container-low"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-error-container bg-error-container px-6 py-5 text-on-error-container">
                <p className="text-sm font-medium">
                    無法載入班級回報歷史
                </p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-3 rounded-full bg-error px-4 py-2 text-sm font-medium text-on-error transition-colors hover:opacity-90"
                >
                    重新載入
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70">
            <div className="flex items-center justify-between bg-surface-container-low px-6 py-5">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-on-surface">
                        {classNo} 班
                    </h2>

                    <p className="mt-1 text-sm text-on-surface-variant">
                        歷史回報
                    </p>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="px-6 py-16 text-center">
                    <p className="text-sm text-on-surface-variant">
                        尚無回報紀錄
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] border-collapse">
                            <thead>
                                <tr className="bg-surface-container">
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
                                    >
                                        日期
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
                                    >
                                        回報內容
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
                                    >
                                        回報人員
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
                                    >
                                        回報時間
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="group border-t border-outline-variant/60 transition-colors hover:bg-surface-container-low"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="text-sm font-medium text-on-surface">
                                                {formatDate(
                                                    report.report_date,
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm text-on-surface-variant">
                                                {getSummary(
                                                    report.payload,
                                                )}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="text-sm text-on-surface">
                                                {report.submitted_by}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="text-sm tabular-nums text-on-surface-variant">
                                                {formatTime(
                                                    report.submitted_at,
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {hasMore && (
                        <div className="flex justify-center border-t border-outline-variant/60 bg-surface-container-lowest px-6 py-5">
                            <button
                                type="button"
                                onClick={() => void loadMore()}
                                disabled={isLoadingMore}
                                className="min-w-28 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoadingMore
                                    ? "載入中…"
                                    : "載入更多"}
                            </button>
                        </div>
                    )}

                    {!hasMore && (
                        <div className="border-t border-outline-variant/60 bg-surface-container-low px-6 py-4 text-center">
                            <span className="text-xs text-on-surface-variant">
                                已顯示全部歷史紀錄
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}