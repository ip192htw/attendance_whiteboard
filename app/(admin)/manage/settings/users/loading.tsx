const tableColumns = ["w-32", "w-20", "w-24", "w-48", "w-16"];

export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="flex w-full animate-pulse flex-col gap-space-lg"
    >
      <p className="sr-only">正在載入人員資料</p>
      <div aria-hidden="true" className="flex flex-col gap-space-lg">
        <header className="flex flex-col justify-between gap-space-md border-b border-outline-variant/30 pb-space-sm md:flex-row md:items-end">
          <div className="h-4 w-48 rounded bg-surface-container-high" />
          <div className="h-10 w-28 rounded-lg bg-surface-container-high" />
        </header>

        <section className="flex flex-col gap-space-md rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
            <div className="h-10 w-full max-w-lg rounded-lg bg-surface-container" />
            <div className="flex flex-wrap justify-end gap-space-xs">
              <div className="h-10 w-28 rounded-lg bg-surface-container-high" />
              <div className="h-10 w-36 rounded-lg bg-surface-container" />
            </div>
          </div>
          <div className="flex flex-wrap gap-space-xs border-t border-outline-variant/30 pt-space-sm">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-7 w-20 rounded-full bg-surface-container"
              />
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container">
                  {Array.from({ length: 6 }, (_, index) => (
                    <th key={index} className="px-space-md py-space-sm">
                      <div className="h-4 w-16 rounded bg-surface-container-high" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }, (_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-outline-variant/20 last:border-0"
                  >
                    {tableColumns.map((width, columnIndex) => (
                      <td key={columnIndex} className="px-space-md py-space-md">
                        <div
                          className={`h-4 ${width} max-w-full rounded bg-surface-container`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="h-14 border-t border-outline-variant/30 bg-surface-container-low" />
        </section>
      </div>
    </div>
  );
}
