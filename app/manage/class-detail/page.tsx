"use client";

import React, { useState } from "react";
import Link from "next/link";

interface StudentRecord {
  seatNo: string;
  name: string;
  todayStatus: "present" | "sick" | "personal" | "official" | "unexcused";
  todayNote?: string;
  monthlyAbsences: number;
  attendanceRate: string;
}

const mockStudents: StudentRecord[] = [
  { seatNo: "01", name: "王大明", todayStatus: "present", monthlyAbsences: 0, attendanceRate: "100%" },
  { seatNo: "02", name: "李小華", todayStatus: "sick", todayNote: "流感在家休養", monthlyAbsences: 2, attendanceRate: "95.2%" },
  { seatNo: "03", name: "張志強", todayStatus: "sick", todayNote: "發燒就醫", monthlyAbsences: 1, attendanceRate: "97.6%" },
  { seatNo: "04", name: "陳雅婷", todayStatus: "present", monthlyAbsences: 0, attendanceRate: "100%" },
  { seatNo: "05", name: "林建安", todayStatus: "present", monthlyAbsences: 0, attendanceRate: "100%" },
  { seatNo: "06", name: "黃淑芬", todayStatus: "present", monthlyAbsences: 0, attendanceRate: "100%" },
  { seatNo: "07", name: "吳宗憲", todayStatus: "sick", todayNote: "牙醫診治", monthlyAbsences: 1, attendanceRate: "97.6%" },
  { seatNo: "08", name: "蔡佩君", todayStatus: "official", todayNote: "管樂團市賽集訓", monthlyAbsences: 0, attendanceRate: "100%" },
  { seatNo: "09", name: "楊世豪", todayStatus: "present", monthlyAbsences: 0, attendanceRate: "100%" },
  { seatNo: "10", name: "許佳玲", todayStatus: "present", monthlyAbsences: 0, attendanceRate: "100%" },
  { seatNo: "15", name: "鄭文彬", todayStatus: "personal", todayNote: "家中有事請假", monthlyAbsences: 3, attendanceRate: "92.8%" },
  { seatNo: "21", name: "謝易達", todayStatus: "personal", todayNote: "護照辦理請假", monthlyAbsences: 1, attendanceRate: "97.6%" },
];

export default function ClassDetailPage({
  params,
}: {
  params?: Promise<{ id?: string }>;
}) {
  const [activeRange, setActiveRange] = useState<"today" | "week" | "month">("today");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary px-4 py-2.5 rounded-lg shadow-lg font-label-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb & Document Stamp Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-md">
        <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
          <Link href="/" className="hover:text-primary transition-colors cursor-pointer">
            出缺勤總覽
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer">一年級</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold">一年一班</span>
        </nav>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <span className="px-space-sm py-0.5 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm rounded uppercase tracking-wider">
            卷宗編號：REG-113-101-L
          </span>
          <div className="flex items-center gap-1 text-tertiary-container font-label-sm text-label-sm bg-tertiary-fixed/60 px-space-sm py-0.5 rounded">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span>教務學務即時認證檔</span>
          </div>
        </div>
      </div>

      {/* Primary Class Header & Meta */}
      <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-sm overflow-hidden mb-space-lg border border-outline-variant">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-primary-container" />
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg pl-space-xs">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                一年一班 出缺勤紀錄表
              </h1>
              <span className="inline-flex items-center gap-1 px-space-sm py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                今日已回報
              </span>
              <span className="text-on-surface-variant font-label-sm text-label-sm bg-surface-container px-space-sm py-0.5 rounded">
                快照核章流水號 #SNAP-1015-02
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-on-surface-variant font-body-md text-body-md mt-1">
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-on-surface">導師：</span>張雅惠 老師
              </span>
              <span className="text-outline-variant">/</span>
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-on-surface">現任風紀：</span>王小明
              </span>
              <span className="text-outline-variant">/</span>
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-on-surface">班級總人數：</span>42人
              </span>
            </div>

            {/* Today's live tally chips */}
            <div className="flex flex-wrap items-center gap-space-sm mt-space-xs">
              <div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-1 rounded border border-outline-variant/30">
                <span className="material-symbols-outlined text-[16px] text-primary-container">
                  update
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  最後更新：
                </span>
                <span className="font-numeric-data text-numeric-data text-on-surface font-semibold">
                  14:32
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  (第 2 版快照)
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-error-container/60 px-space-sm py-1 rounded text-on-error-container">
                <span className="material-symbols-outlined text-[16px] text-error">
                  person_off
                </span>
                <span className="font-label-sm text-label-sm font-medium">
                  今日缺席人數：
                </span>
                <span className="font-numeric-data text-numeric-data font-bold">
                  5
                </span>
                <span className="font-label-sm text-label-sm">
                  人 (出席率 88.1%)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-space-sm flex-wrap xl:self-start">
            <button
              onClick={() => showToast("已準備匯出一年一班月報表 (CSV / Excel)")}
              className="inline-flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg font-medium hover:bg-surface-container-highest transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                file_download
              </span>
              <span>匯出此班月報表</span>
            </button>
            <button
              onClick={() => showToast("已發送列印指令，正在產生 PDF 出席單...")}
              className="inline-flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-medium hover:bg-primary transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                print
              </span>
              <span>列印今日回報單 (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Interval Navigator */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border border-outline-variant">
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-1.5 rounded-lg border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-[18px]">
              calendar_today
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              2024年10月
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant ml-1">
              (當月)
            </span>
          </div>
          <div className="inline-flex p-1 bg-surface-container-low rounded-lg gap-1 border border-outline-variant/30">
            <button
              onClick={() => setActiveRange("today")}
              className={`px-space-sm py-1 rounded text-label-md font-label-md transition-all cursor-pointer ${
                activeRange === "today"
                  ? "bg-primary-container text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
              type="button"
            >
              今日 (10/15)
            </button>
            <button
              onClick={() => setActiveRange("week")}
              className={`px-space-sm py-1 rounded text-label-md font-label-md transition-all cursor-pointer ${
                activeRange === "week"
                  ? "bg-primary-container text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
              type="button"
            >
              本週 (10/14 - 10/18)
            </button>
            <button
              onClick={() => setActiveRange("month")}
              className={`px-space-sm py-1 rounded text-label-md font-label-md transition-all cursor-pointer ${
                activeRange === "month"
                  ? "bg-primary-container text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
              type="button"
            >
              全月統計
            </button>
          </div>
        </div>
      </div>

      {/* Roster & Attendance History Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="px-space-lg py-space-md bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary-container text-[20px]">
              badge
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              全班座號學生出缺席明細
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            顯示 12 筆示範名冊
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase border-b border-outline-variant">
                <th className="py-3 px-space-lg w-20">座號</th>
                <th className="py-3 px-space-md">姓名</th>
                <th className="py-3 px-space-md">今日狀態</th>
                <th className="py-3 px-space-md">事由與備註</th>
                <th className="py-3 px-space-md">本月累計缺席</th>
                <th className="py-3 px-space-lg text-right">月出席率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-body-md text-body-md">
              {mockStudents.map((student) => (
                <tr
                  key={student.seatNo}
                  className="hover:bg-surface-container/50 transition-colors"
                >
                  <td className="py-3 px-space-lg font-numeric-data font-bold text-primary">
                    {student.seatNo}
                  </td>
                  <td className="py-3 px-space-md font-semibold text-on-surface">
                    {student.name}
                  </td>
                  <td className="py-3 px-space-md">
                    {student.todayStatus === "present" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                        正常出席
                      </span>
                    )}
                    {student.todayStatus === "sick" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error" />
                        病假
                      </span>
                    )}
                    {student.todayStatus === "personal" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        事假
                      </span>
                    )}
                    {student.todayStatus === "official" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                        公假
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-space-md text-on-surface-variant font-body-sm">
                    {student.todayNote ? (
                      <span className="text-on-surface">{student.todayNote}</span>
                    ) : (
                      <span className="text-outline italic">-</span>
                    )}
                  </td>
                  <td className="py-3 px-space-md font-numeric-data">
                    {student.monthlyAbsences > 0 ? (
                      <span className="text-primary font-bold">{student.monthlyAbsences} 次</span>
                    ) : (
                      <span className="text-on-surface-variant">0 次</span>
                    )}
                  </td>
                  <td className="py-3 px-space-lg text-right font-numeric-data font-semibold text-on-surface">
                    {student.attendanceRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
