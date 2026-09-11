"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ClassItem {
  id: string;
  grade: number;
  name: string;
  teacher: string;
  status: "reported" | "pending" | "abnormal";
  absentCount: number;
  reportTime?: string;
  reporter?: string;
}

const mockClasses: ClassItem[] = [
  { id: "101", grade: 1, name: "一年一班", teacher: "張雅惠", status: "reported", absentCount: 5, reportTime: "14:32", reporter: "王小明 (風紀)" },
  { id: "102", grade: 1, name: "一年二班", teacher: "陳志豪", status: "reported", absentCount: 2, reportTime: "14:15", reporter: "李大同 (風紀)" },
  { id: "103", grade: 1, name: "一年三班", teacher: "林美玲", status: "pending", absentCount: 0 },
  { id: "104", grade: 1, name: "一年四班", teacher: "黃建國", status: "reported", absentCount: 0, reportTime: "13:58", reporter: "許家豪 (風紀)" },
  { id: "105", grade: 1, name: "一年五班", teacher: "劉淑貞", status: "abnormal", absentCount: 8, reportTime: "14:20", reporter: "吳佩珊 (風紀)" },
  { id: "201", grade: 2, name: "二年一班", teacher: "趙怡婷", status: "reported", absentCount: 1, reportTime: "14:10", reporter: "鄭詠晴 (風紀)" },
  { id: "202", grade: 2, name: "二年二班", teacher: "孫文雄", status: "pending", absentCount: 0 },
  { id: "203", grade: 2, name: "二年三班", teacher: "郭明賢", status: "reported", absentCount: 3, reportTime: "13:45", reporter: "謝品捷 (風紀)" },
  { id: "301", grade: 3, name: "三年一班", teacher: "周淑華", status: "reported", absentCount: 0, reportTime: "14:05", reporter: "蔡承翰 (風紀)" },
  { id: "302", grade: 3, name: "三年二班", teacher: "楊承翰", status: "pending", absentCount: 0 },
];

export default function DashboardPage() {
  const [selectedGrade, setSelectedGrade] = useState<"all" | "1" | "2" | "3">("all");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const filteredClasses = mockClasses.filter((item) => {
    if (selectedGrade === "all") return true;
    return item.grade === parseInt(selectedGrade);
  });

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setShowBroadcastModal(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* Top Header & Grade Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm mb-space-xs">
            <span className="font-label-sm text-label-sm text-primary-container bg-primary-fixed/60 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
              生活輔導督導記錄
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              軍訓督導室同步中
            </span>
          </div>
          <h1 className="font-display text-display text-primary tracking-tight font-bold">
            今日全校回報概況
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            2024年10月15日 (二) · 午間常態回報時段 (13:30 - 14:30) · 第 8 週常態查核
          </p>
        </div>

        {/* Grade Filter Segmented Control */}
        <div className="inline-flex p-1 rounded-xl bg-surface-container-high self-start md:self-auto shadow-sm">
          <button
            onClick={() => setSelectedGrade("all")}
            className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
              selectedGrade === "all"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface font-medium"
            }`}
            type="button"
          >
            全部年級{" "}
            <span className="font-numeric-data text-label-sm opacity-80 ml-1">
              (45班)
            </span>
          </button>
          <button
            onClick={() => setSelectedGrade("1")}
            className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
              selectedGrade === "1"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface font-medium"
            }`}
            type="button"
          >
            高一年級{" "}
            <span className="font-numeric-data text-label-sm opacity-80 ml-1">
              (15班)
            </span>
          </button>
          <button
            onClick={() => setSelectedGrade("2")}
            className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
              selectedGrade === "2"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface font-medium"
            }`}
            type="button"
          >
            高二年級{" "}
            <span className="font-numeric-data text-label-sm opacity-80 ml-1">
              (15班)
            </span>
          </button>
          <button
            onClick={() => setSelectedGrade("3")}
            className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
              selectedGrade === "3"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface font-medium"
            }`}
            type="button"
          >
            高三年級{" "}
            <span className="font-numeric-data text-label-sm opacity-80 ml-1">
              (15班)
            </span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
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
              onClick={() => setShowBroadcastModal(true)}
              type="button"
              className="inline-flex items-center gap-1 text-primary-container hover:text-primary font-label-sm text-label-sm font-semibold transition-colors hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                campaign
              </span>
              <span>發送推播廣播提醒</span>
            </button>
            <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-numeric-data">
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

      {/* Class List Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="px-space-lg py-space-md bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary-container text-[20px]">
              table_chart
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              班級回報狀態一覽
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            顯示 {filteredClasses.length} 個班級
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase border-b border-outline-variant">
                <th className="py-3 px-space-lg">班級名稱</th>
                <th className="py-3 px-space-md">導師</th>
                <th className="py-3 px-space-md">回報狀態</th>
                <th className="py-3 px-space-md">缺席人數</th>
                <th className="py-3 px-space-md">送出時間 / 風紀</th>
                <th className="py-3 px-space-lg text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-body-md text-body-md">
              {filteredClasses.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container/50 transition-colors"
                >
                  <td className="py-3.5 px-space-lg font-semibold text-on-surface">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-space-md text-on-surface-variant">
                    {item.teacher} 老師
                  </td>
                  <td className="py-3.5 px-space-md">
                    {item.status === "reported" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                        已完成
                      </span>
                    )}
                    {item.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f9f2e7] text-[#9c6b28] font-label-sm text-label-sm font-semibold border border-[#9c6b28]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9c6b28]" />
                        未回報
                      </span>
                    )}
                    {item.status === "abnormal" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f9eceb] text-[#7a1f1f] font-label-sm text-label-sm font-semibold border border-[#7a1f1f]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7a1f1f]" />
                        缺席異常
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-space-md font-numeric-data font-semibold">
                    {item.absentCount > 0 ? (
                      <span className="text-error font-bold">{item.absentCount} 人</span>
                    ) : (
                      <span className="text-on-surface-variant font-normal">0 人</span>
                    )}
                  </td>
                  <td className="py-3.5 px-space-md text-on-surface-variant font-label-sm text-label-sm">
                    {item.reportTime ? (
                      <span>
                        <span className="font-numeric-data text-on-surface font-medium mr-1">
                          {item.reportTime}
                        </span>
                        ({item.reporter})
                      </span>
                    ) : (
                      <span className="text-outline italic">尚未填報</span>
                    )}
                  </td>
                  <td className="py-3.5 px-space-lg text-right">
                    <Link
                      href={`/class-detail/${item.id}`}
                      className="inline-flex items-center gap-1 text-primary-container hover:text-primary font-label-sm text-label-sm font-semibold hover:underline"
                    >
                      <span>檢視詳情</span>
                      <span className="material-symbols-outlined text-[14px]">
                        chevron_right
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Alert Modal Dialog */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-space-lg border border-outline-variant relative">
            <div className="flex items-center gap-space-sm text-primary mb-space-sm">
              <span className="material-symbols-outlined text-2xl">campaign</span>
              <h3 className="font-headline-sm text-headline-sm font-bold">
                發送未回報提醒廣播
              </h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
              即將向目前的 <strong className="text-primary">15 個未回報班級</strong>{" "}
              之導師與風紀股長發送 LINE / App 系統推播提醒。
            </p>
            {broadcastSent ? (
              <div className="p-3 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg text-center font-label-md font-semibold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                廣播提醒已成功發送！
              </div>
            ) : (
              <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-space-md h-9 rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-container transition-colors"
                  type="button"
                >
                  取消
                </button>
                <button
                  onClick={handleBroadcast}
                  className="px-space-md h-9 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold hover:bg-primary transition-colors shadow-sm"
                  type="button"
                >
                  確認發送
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
