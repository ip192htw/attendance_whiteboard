export function ReportFormSkeleton() {
    return (
        <div className="mt-8 space-y-4 animate-pulse">
            <div className="p-8 flex flex-col gap-8">
                {/* 4 個請假類別欄位 (病假、事假、公假、曠課/其他) */}
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            {/* 類別標題 */}
                            <div className="h-6 w-20 bg-surface-container-high rounded-md" />
                        </div>
                        {/* RadixMultiSelect 輸入框占位 */}
                        <div className="h-11 w-full bg-surface-container-high rounded-lg border border-outline-variant/40" />
                    </div>
                ))}

                {/* Submit Action Block Skeleton */}
                <div className="flex sm:flex-col gap-1.5 items-center justify-between pt-2 border-t border-outline-variant/40">
                    {/* 送出按鈕占位 (對應 px-8 py-3 w-full) */}
                    <div className="h-12 w-full rounded-lg bg-surface-container-high" />
                </div>
            </div>
        </div>
    );
}