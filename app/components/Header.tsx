import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant z-30 flex items-center justify-between px-space-xl">
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-primary text-[18px]">
            event
          </span>
          <span className="font-label-md text-label-md text-on-surface font-medium">
            113學年度 第一學期 · 2024年10月15日 (二)
          </span>
        </div>
        <div className="flex items-center gap-space-xs px-space-md py-space-xs bg-tertiary-fixed text-on-tertiary-fixed rounded-full">
          <span className="material-symbols-outlined text-[16px]">
            schedule
          </span>
          <span className="font-label-md text-label-md font-semibold">
            回報時段 13:30 - 14:30
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 bg-surface-container-low rounded-lg border border-outline-variant text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-tertiary-container">
            verified_user
          </span>
          <span className="font-label-sm text-label-sm">
            Google Workspace 授權中
          </span>
        </div>
        <div className="flex items-center gap-space-sm pl-space-md border-l border-outline-variant">
          <div className="flex flex-col text-right">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold leading-tight">
              生輔組長 / 林組長
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              學務處生活輔導組
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-xs border border-outline-variant shadow-sm">
            林
          </div>
        </div>
      </div>
    </header>
  );
}
