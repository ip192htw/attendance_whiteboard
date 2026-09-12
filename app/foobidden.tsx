"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForbiddenPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex items-center justify-center p-space-xl relative overflow-hidden">
      {/* Floating Background Academic Accent */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

      {/* Center Hero Card Container */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-md p-space-xl sm:p-12 overflow-hidden border border-outline-variant">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-surface-container-high via-primary-container to-surface-container-high" />

        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="font-display text-7xl sm:text-8xl font-bold text-primary-container tracking-tight mb-space-xs select-none">
            403
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-sm tracking-tight font-bold">
            沒有權限存取此頁面
          </h1>

          <p className="font-body-lg text-body-lg text-secondary mb-space-lg leading-relaxed">
            您的帳號目前未獲得存取此行政模組或班級日誌的存取權限。
          </p>

          <div className="w-full bg-surface-container-low rounded-lg p-space-lg text-left border-l-4 border-primary-container mb-space-lg">
            <div className="flex items-center gap-space-xs text-primary-container font-label-md text-label-md mb-space-xs">
              <span className="material-symbols-outlined text-[18px]">
                help_center
              </span>
              <span className="font-semibold">權限異動與申訴說明</span>
            </div>
            <p className="text-on-surface-variant font-body-sm text-body-sm leading-relaxed">
              各班風紀股長權限與導師帳號皆由學務處生活輔導組統籌管理。若座號異動或幹部更替，請攜帶學生證至生輔組臨櫃核對登記。
            </p>
          </div>

          <div className="flex items-center gap-space-md">
            <Link
              href="/"
              className="inline-flex items-center gap-space-xs px-space-lg h-11 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                home
              </span>
              <span>返回系統首頁</span>
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-space-xs px-space-lg h-11 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-medium hover:bg-surface-container transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                contact_support
              </span>
              <span>聯絡生輔組</span>
            </button>
          </div>
        </div>
      </div>

      {/* Support Dialog Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-space-lg border border-outline-variant relative">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant mb-space-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                學務處生活輔導組 聯絡資訊
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-on-surface-variant hover:text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="space-y-3 font-body-md text-body-md text-on-surface">
              <p>
                <strong>位置：</strong> 行政大樓一樓 學務處生活輔導組
              </p>
              <p>
                <strong>校內分機：</strong> #1302, #1305
              </p>
              <p>
                <strong>服務時間：</strong> 上課日 07:30 - 17:00
              </p>
            </div>
            <div className="mt-space-lg flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-space-md h-9 rounded-lg bg-surface-container text-on-surface font-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
