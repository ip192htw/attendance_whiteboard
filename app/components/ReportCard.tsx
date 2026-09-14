'use client'

import { RadixMultiSelect } from "./ui";
import { useState, useActionState } from "react";

import { Report } from "@/src/domain/attendance"



export function ReportCard({ report }: {report: Report}) {

    const [sickLeaveSelected, setSickLeaveSelected] = useState<string[]>([]);
    const [personalLeaveSelected, setPersonalLeaveSelected] = useState<string[]>([]);
    const [officialDutySelected, setOfficialDutySelected] = useState<string[]>([]);
    const [otherLeaveSelected, setOtherLeaveSelected] = useState<string[]>([]);
    const [state, formAction, isPending] = useActionState(
        async () => {
        // 這裡呼叫你的 API 或 Server Action
        setTimeout(() => {}, 3000);
        return { success: true };
        },
        { success: false } // 初始 state
    );


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
        <div className="mt-8 space-y-4">
            {/* Card Form Body */}
            <form onSubmit={formAction} className="p-8 flex flex-col gap-8">
                
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
                  {state.success && (
                    <div className="flex items-center text-tertiary-container font-label-md font-semibold bg-tertiary-fixed px-4 py-2 rounded-lg">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      今日出缺勤紀錄已成功更新並送出至生輔組！
                    </div>
                  )}
                  {!state.success &&(
                      <button
                      type="submit"
                      disabled={isPending}
                      className={`px-8 py-3 w-full rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                        isPending ? "opacity-70 pointer-events-none" : ""
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      <span>{isPending ? "處理中..." : "送出今日回報"}</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
    )
}