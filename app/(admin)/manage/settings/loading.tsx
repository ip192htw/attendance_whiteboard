function SettingsSectionSkeleton({
  fieldCount,
}: {
  fieldCount: number;
}) {
  return (
    <section className="flex flex-col gap-space-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-space-xl shadow-sm">
      <div className="flex items-center gap-space-sm border-b border-outline-variant pb-space-md">
        <div className="h-10 w-10 rounded-lg bg-surface-container-high" />
        <div className="flex flex-1 flex-col gap-space-xs">
          <div className="h-5 w-48 max-w-full rounded bg-surface-container-high" />
          <div className="h-4 w-64 max-w-full rounded bg-surface-container" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
        {Array.from({ length: fieldCount }, (_, index) => (
          <div key={index} className="flex flex-col gap-space-xs">
            <div className="h-4 w-24 rounded bg-surface-container" />
            <div className="h-11 rounded-lg bg-surface-container" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="flex w-full animate-pulse flex-col gap-space-lg"
    >
      <p className="sr-only">正在載入系統設定</p>
      <div aria-hidden="true" className="flex flex-col gap-space-lg">
        <SettingsSectionSkeleton fieldCount={3} />
        <SettingsSectionSkeleton fieldCount={2} />
        <SettingsSectionSkeleton fieldCount={3} />
        <div className="flex justify-end">
          <div className="h-12 w-36 rounded-lg bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}
