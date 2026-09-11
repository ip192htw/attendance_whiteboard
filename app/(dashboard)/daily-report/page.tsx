"use client";

import React, { useState } from "react";

export default function DailyReportPage() {
  const totalStudents = 42;
  const seats = Array.from({ length: totalStudents }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const [sickLeaves, setSickLeaves] = useState<string[]>(["02", "03", "07"]);
  const [personalLeaves, setPersonalLeaves] = useState<string[]>(["15", "21"]);
  const [officialLeaves, setOfficialLeaves] = useState<string[]>(["08"]);
  const [unexcusedLeaves, setUnexcusedLeaves] = useState<string[]>([]);
  const [remarks, setRemarks] = useState(
    "02 流感在家休養，預計週四返校；08 參加管樂團市賽集訓 (學務處學藝組已開立公假單)。"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleSeat = (
    seat: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(seat)) {
      setList(list.filter((s) => s !== seat));
    } else {
      setList([...list, seat].sort());
    }
  };

  const renderSummary = (list: string[]) => {
    if (list.length === 0) return "已選 0 人";
    return `已選 ${list.length} 人 (${list.join(", ")})`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className="w-full mx-auto max-w-3xl">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden">
        {/* Card Header */}
        <div className="px-8 py-6 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase font-semibold">
              班級出缺勤管理
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              一年一班 每日出缺勤填報
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-numeric-data text-body-sm shrink-0">
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              calendar_today
            </span>
            <span>2024年10月15日</span>
          </div>
        </div>

        {/* Card Form Body */}
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
          {/* Category 1: Sick Leave */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  1. 病假 (Sick Leave)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">
                {renderSummary(sickLeaves)}
              </span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-14 gap-2">
              {seats.map((seat) => {
                const selected = sickLeaves.includes(seat);
                return (
                  <button
                    key={`sick-${seat}`}
                    type="button"
                    onClick={() => toggleSeat(seat, sickLeaves, setSickLeaves)}
                    className={`w-10 h-10 rounded-lg font-numeric-data text-label-md transition-all cursor-pointer ${
                      selected
                        ? "bg-primary-container text-on-primary font-bold shadow-sm"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container font-medium"
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category 2: Personal Leave */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  2. 事假 (Personal Leave)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">
                {renderSummary(personalLeaves)}
              </span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-14 gap-2">
              {seats.map((seat) => {
                const selected = personalLeaves.includes(seat);
                return (
                  <button
                    key={`personal-${seat}`}
                    type="button"
                    onClick={() => toggleSeat(seat, personalLeaves, setPersonalLeaves)}
                    className={`w-10 h-10 rounded-lg font-numeric-data text-label-md transition-all cursor-pointer ${
                      selected
                        ? "bg-primary-container text-on-primary font-bold shadow-sm"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container font-medium"
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category 3: Official Duty */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  3. 公假 (Official Duty)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">
                {renderSummary(officialLeaves)}
              </span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-14 gap-2">
              {seats.map((seat) => {
                const selected = officialLeaves.includes(seat);
                return (
                  <button
                    key={`official-${seat}`}
                    type="button"
                    onClick={() => toggleSeat(seat, officialLeaves, setOfficialLeaves)}
                    className={`w-10 h-10 rounded-lg font-numeric-data text-label-md transition-all cursor-pointer ${
                      selected
                        ? "bg-primary-container text-on-primary font-bold shadow-sm"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container font-medium"
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category 4: Unexcused / Other */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-outline" />
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  4. 其他 / 曠課 (Other / Unexcused)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">
                {renderSummary(unexcusedLeaves)}
              </span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-14 gap-2">
              {seats.map((seat) => {
                const selected = unexcusedLeaves.includes(seat);
                return (
                  <button
                    key={`other-${seat}`}
                    type="button"
                    onClick={() => toggleSeat(seat, unexcusedLeaves, setUnexcusedLeaves)}
                    className={`w-10 h-10 rounded-lg font-numeric-data text-label-md transition-all cursor-pointer ${
                      selected
                        ? "bg-primary-container text-on-primary font-bold shadow-sm"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container font-medium"
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Remarks Textarea */}
          <div className="flex flex-col gap-2 pt-2">
            <label
              className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2"
              htmlFor="box-remarks"
            >
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                edit_note
              </span>
              <span>特殊事由與備註欄 (Notes / Remarks)</span>
            </label>
            <textarea
              id="box-remarks"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="若有特殊事由請在此輸入備註..."
              className="w-full rounded-lg bg-surface-container-low border border-outline-variant text-on-surface p-4 font-body-md text-body-md focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary-container transition-all"
            />
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-outline-variant/40">
            {submitted && (
              <div className="flex items-center gap-2 text-tertiary-container font-label-md font-semibold bg-tertiary-fixed px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined text-base">check_circle</span>
                今日出缺勤紀錄已成功更新並送出至生輔組！
              </div>
            )}
            {!submitted && <div />}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                isSubmitting ? "opacity-70 pointer-events-none" : ""
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>{isSubmitting ? "處理中..." : "送出今日回報"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
