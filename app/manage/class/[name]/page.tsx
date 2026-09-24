import Link from "next/link";

import { ClassHistoryTable } from "./component/ClassHistoryTable"


export default async function ClassDetailPage({ params }: {params: Promise<{name: string;}>;}) {
  const { name } = await params

  return (
    <div className="flex flex-col max-w-5xl">
      {/* Breadcrumb & Document Stamp Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-md">
        <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
          <Link href="/manage" className="hover:text-primary transition-colors cursor-pointer">
            出缺勤總覽
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold">一年一班</span>
        </nav>
      </div>

      {/* Primary Class Header & Meta */}
      <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-sm overflow-hidden mb-space-lg border border-outline-variant">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-primary-container" />
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg pl-space-xs">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <h1 className="text-lg text-primary tracking-tight font-bold">
                {name} 班 出缺勤紀錄表
              </h1>
              <span className="inline-flex items-center gap-1 px-space-sm py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold rounded">
                今日已回報
              </span>
            </div>
            <span className="font-semibold text-on-surface">風紀：{'王小明'}</span>

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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex items-center gap-space-sm flex-wrap xl:self-start">
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
          </div> */}
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
              {`班號`}出缺勤回報歷史紀錄
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            顯示 {`12`} 筆回報紀錄
          </span>
        </div>
        <ClassHistoryTable classNo={name} />
      </div>
    </div>
  );
}
