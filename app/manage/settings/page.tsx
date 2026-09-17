"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [startTime, setStartTime] = useState("13:30");
  const [endTime, setEndTime] = useState("14:30");
  const [autoLateApproval, setAutoLateApproval] = useState(true);

  return (
    <div className="flex flex-col w-full gap-space-lg">


      {/* Page Title
      <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/40">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase">
            <span>校園白板後台</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">系統全域設定</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            系統設定與行政管理
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            生輔組全域規則控管 · 出缺席作業時段 · 帳號權限及資料調度歸檔
          </p>
        </div>
      </div> */}

      <div className="grid grid-cols-12 gap-space-lg items-start">
        {/* Settings Navigation Sidebar */}
        {/* <div className="col-span-12 lg:col-span-3 flex flex-col gap-space-sm sticky top-20">
          <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 shadow-sm border border-outline-variant/40">
            <a
              href="#section-reporting"
              className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg bg-surface-container-highest text-primary font-headline-sm text-label-lg transition-all"
            >
              <div className="flex items-center gap-space-sm">
                <span
                  className="material-symbols-outlined text-[20px] text-primary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  schedule
                </span>
                <span>回報設定</span>
              </div>
              <span className="w-1.5 h-4 bg-primary-container rounded-full" />
            </a>
            <a
              href="#section-semester"
              className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-lg text-label-lg transition-colors"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[20px]">
                  calendar_month
                </span>
                <span>學期設定</span>
              </div>
              <span className="font-numeric-data text-label-sm text-secondary">
                113-1
              </span>
            </a>
            <a
              href="#section-personnel"
              className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-lg text-label-lg transition-colors"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[20px]">
                  badge
                </span>
                <span>人員管理</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-label-sm font-label-sm">
                53員
              </span>
            </a>
            <a
              href="#section-export"
              className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-lg text-label-lg transition-colors"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[20px]">
                  archive
                </span>
                <span>資料匯出</span>
              </div>
            </a>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between text-label-sm font-label-sm text-secondary">
              <span>上次變動時間</span>
              <span className="font-numeric-data">10/12 09:14</span>
            </div>
          </div>
        </div> */}

        {/* Settings Main Content Form */}
        <form className="col-span-12 lg:col-span-9 flex flex-col gap-space-xl">
          {/* Section 1: Reporting Window */}
          <section
            id="section-reporting"
            className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg relative overflow-hidden border border-outline-variant"
          >
            <div className="flex items-center gap-space-sm border-b border-outline-variant pb-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  timer
                </span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                  回報時段與規則設定
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  設定風紀股長每日常態登記與開放填報的時間區間
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs border border-outline-variant/30">
                <label className="font-label-lg text-label-lg font-semibold text-on-surface flex items-center justify-between">
                  <span>回報開始時間</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => console.log(e.target.value)}
                  className="w-full bg-surface-container-lowest text-primary font-numeric-data text-headline-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/40 mt-1"
                />
              </div>

              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs border border-outline-variant/30">
                <label className="font-label-lg text-label-lg font-semibold text-on-surface flex items-center justify-between">
                  <span>回報結束時間</span>
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-surface-container-lowest text-primary font-numeric-data text-headline-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/40 mt-1"
                />
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-outline-variant/30">
              <div className="flex flex-col gap-0.5">
                <span className="font-label-lg text-label-lg font-semibold text-on-surface">
                  超時自動開放補報申請
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  若班級超過 14:30 尚未送出，允許導師後台發起補報申請
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoLateApproval(!autoLateApproval)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  autoLateApproval ? "bg-primary-container" : "bg-outline-variant"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-surface-container-lowest absolute top-0.5 transition-transform ${
                    autoLateApproval ? "left-6.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Section 2: Semester Config */}
          <section
            id="section-semester"
            className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg relative overflow-hidden border border-outline-variant"
          >
            <div className="flex items-center gap-space-sm border-b border-outline-variant pb-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[24px]">
                  calendar_month
                </span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                  學期與校曆設定
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  維護目前的學年度、學期及出勤考核週次
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md font-body-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-md font-semibold text-on-surface">
                  學年度學期
                </label>
                <input
                  type="text"
                  defaultValue="113學年度 第一學期"
                  className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md font-semibold text-on-surface">
                  當前查核週次
                </label>
                <input
                  type="text"
                  defaultValue="第 8 週 (常態查核)"
                  className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/40"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Personnel */}
          <section
            id="section-personnel"
            className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg relative overflow-hidden border border-outline-variant"
          >
            <div className="flex items-center gap-space-sm border-b border-outline-variant pb-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[24px]">
                  badge
                </span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                  人員與教官導師權限管理
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  管理生輔組教官、各班導師及風紀股長之系統權限
                </p>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-center justify-between text-body-md">
              <div>
                <span className="font-semibold text-on-surface">生輔組長權限號：</span>
                <span className="font-numeric-data text-primary ml-1 font-bold">
                  ADMIN-STAFF-01
                </span>
              </div>
              <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-semibold rounded">
                全域最高管理權限
              </span>
            </div>
          </section>

          {/* Save Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>儲存系統設定</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
