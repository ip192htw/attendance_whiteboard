"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-body-md text-on-surface antialiased">
      <main className="w-full">
        <div className="flex flex-col w-full items-center justify-center p-gutter md:p-gutter-desktop relative overflow-hidden">
          {/* Decorative background geometry */}
          <div
            aria-hidden="true"
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-surface-container-high/40 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none"
          />

          {/* Primary Authentication Container */}
          <div className="relative w-full max-w-[480px] bg-surface-container-lowest shadow-xl rounded-xl p-6 sm:p-10 transition-all duration-300">
            {/* Header Block */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary font-display font-bold text-2xl flex items-center justify-center mb-3 shadow-sm">
                校
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                電子白板
              </h1>
              <p className="font-body-md text-body-md text-secondary mt-2 tracking-normal text-on-surface-variant">
                本系統為校內行政與班級出缺勤回報專用平台。請使用學校公務信箱登入
              </p>
            </div>

            {/* SSO Action Area */}
            <div className="mt-8 space-y-4">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                type="button"
                className={`group relative w-full h-12 flex items-center justify-center gap-3 px-4 rounded-lg bg-primary-container hover:bg-primary active:scale-[0.99] text-on-primary shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
                  isLoading ? "opacity-80 pointer-events-none" : ""
                }`}
              >
                <span className="absolute left-0 inset-y-0 w-1.5 bg-on-primary-container transition-all group-hover:w-2" />
                <span className="w-7 h-7 rounded-md bg-surface-container-lowest flex items-center justify-center p-1 shadow-sm shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M12 5c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2 14.6 1.2 12 1.2 7.5 1.2 3.7 3.8 1.9 7.5l3.5 2.7C6.3 7.4 8.9 5 12 5z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.4 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.5C.7 9.8 0 10.9 0 12s.7 2.2 1.9 4.5l3.5-1.7z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.4-6.6-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                      fill="#34A853"
                    />
                  </svg>
                </span>
                <span className="font-label-lg text-label-lg font-medium tracking-wide">
                  使用學校 Google 帳號登入
                </span>
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-0.5">
                  arrow_forward
                </span>
              </button>

              {/* Feedback / Interactive Simulation indicator */}
              {isLoading && !isSuccess && (
                <div className="p-3 rounded-md bg-surface-container text-on-surface-variant font-body-sm text-body-sm flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8v8z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>正在連線至校園 SSO 單一登入中心...</span>
                </div>
              )}

              {isSuccess && (
                <div className="p-3 rounded-md bg-surface-container text-on-surface-variant font-body-sm text-body-sm flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-base text-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="font-label-sm text-on-surface">
                    帳號授權成功，正在載入班級日誌...
                  </span>
                </div>
              )}
            </div>

            {/* Administrative Contact Section */}
            <div className="mt-6 pt-4 flex items-center justify-between text-secondary border-t border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">
                  contact_support
                </span>
                <span className="font-body-sm text-body-sm">
                  若無法登入或座號權限未同步，請洽{" "}
                  <span className="font-semibold text-on-surface">
                    生輔組。
                  </span>
                </span>
              </div>
            </div>

            {/* Footer Inside Card */}
            <div className="mt-8 pt-4 bg-surface-container-high/30 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-4 rounded-b-xl flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2">
              <span className="font-label-sm text-label-sm text-secondary tracking-wider">
                國立師大附中
              </span>
              <span className="font-label-sm text-label-sm text-secondary">
                生活輔導組
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
