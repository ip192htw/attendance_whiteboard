import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex items-center justify-center p-space-md">
      <main className="w-full max-w-md mx-auto text-center flex flex-col items-center">
        <div className="font-display text-[6rem] sm:text-[8rem] font-bold text-primary-container leading-none tracking-tight mb-space-sm select-none">
          404
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mb-space-sm">
          找不到頁面
        </h1>
        <p className="font-body-lg text-body-lg text-secondary leading-relaxed mb-space-lg">
          您所尋找的頁面或紀錄不存在、已被移除，或是網址輸入有誤。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-space-xs px-space-lg h-11 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>返回系統首頁</span>
        </Link>
      </main>
    </div>
  );
}
