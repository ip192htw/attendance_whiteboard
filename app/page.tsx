"use client";

import React, { useState } from "react";

import { RadixMultiSelect } from "./components/ui";

export default function DailyReportPage() {


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  const [sickLeaveSelected, setSickLeaveSelected] = useState<string[]>([]);
  const [personalLeaveSelected, setPersonalLeaveSelected] = useState<string[]>([]);
  const [officialDutySelected, setOfficialDutySelected] = useState<string[]>([]);
  const [otherLeaveSelected, setOtherLeaveSelected] = useState<string[]>([]);

  const leaveCategories = [
    { name: "病假", selected: sickLeaveSelected, onChange: setSickLeaveSelected },
    { name: "事假", selected: personalLeaveSelected, onChange: setPersonalLeaveSelected },
    { name: "公假", selected: officialDutySelected, onChange: setOfficialDutySelected },
    { name: "其他 / 曠課", selected: otherLeaveSelected, onChange: setOtherLeaveSelected },
  ];

  const numbers = Array.from({ length: 40 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1)
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  function findOptions(selectedCategory: string): { label: string; value: string }[] {
    // 1. 收集「所有假別」已經選取的數字 (將多個子集合併成 Set)
    const allSelectedValues = new Set([
      ...sickLeaveSelected,
      ...personalLeaveSelected,
      ...officialDutySelected,
      ...otherLeaveSelected,
    ]);

    // 2. 取得「當前正在查看的假別」已經選取的數字
    const currentCategorySelected = new Set(
      selectedCategory === "病假" ? sickLeaveSelected :
      selectedCategory === "事假" ? personalLeaveSelected :
      selectedCategory === "公假" ? officialDutySelected :
      selectedCategory === "其他 / 曠課" ? otherLeaveSelected : []
    );

    // 3. 過濾選項：
    // 條件：(不在全域已被選取的名單中) OR (屬於當前假別自己選中的)
    return numbers.filter(
      (option) => !allSelectedValues.has(option.value) || currentCategorySelected.has(option.value)
    );
  }

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
          <div className="relative w-full max-w-120 bg-surface-container-lowest shadow-xl rounded-xl p-6 sm:p-10 transition-all duration-300">
            {/* Header Block */}s
            <div className="text-center mb-8">
                <h1 className="font-headline-lg text-3xl font-extrabold text-primary-container mb-2">
                  學務處學生缺曠回報
                </h1>
                <p className="text-on-surface-variant font-body-md">
                  1676班
                </p>
            </div>
            
            <div className="mt-8 space-y-4">
              {/* Card Form Body */}
              <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
                

                {/* Category 3: Official Duty */}
                {leaveCategories.map((category) => (
                  <div key={category.name} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {category.name}
                        </span>
                    </div>
                  </div>
                  <RadixMultiSelect
                      options={findOptions(category.name)}
                      placeholder="請選擇..."
                      selected={category.selected}
                      onChange={category.onChange}
                    />
                </div>))}

                

                

                {/* Submit Action */}
                <div className="flex sm:flex-row items-center justify-between pt-2 border-t border-outline-variant/40">
                  {submitted && (
                    <div className="flex items-center text-tertiary-container font-label-md font-semibold bg-tertiary-fixed px-4 py-2 rounded-lg">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      今日出缺勤紀錄已成功更新並送出至生輔組！
                    </div>
                  )}
                  {!submitted &&(
                      <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 w-full rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                        isSubmitting ? "opacity-70 pointer-events-none" : ""
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      <span>{isSubmitting ? "處理中..." : "送出今日回報"}</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Administrative Contact Section */}
            <div className="mt-6 pt-4 flex items-center justify-between text-secondary border-t border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">
                  contact_support
                </span>
                <span className="font-body-sm text-body-sm">
                  若無法登入或，請洽{" "}
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


