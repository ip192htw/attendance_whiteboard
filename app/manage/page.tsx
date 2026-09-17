


import { Metrics, ClassTable } from "./components"

import { getClassNumberingConfig, getReportsByDate } from "../actions";

export default async function DashboardPage() {
  const [config, report] = await Promise.all([
    getClassNumberingConfig(),
    getReportsByDate(new Date("2026-09-14"))
  ])

  if (!config) return;

  return (
    <div className="flex flex-col gap-space-lg w-full">
      <div className="flex flex-col">
          <h1 className="font-display text-4xl text-primary tracking-tight font-bold">
            今日全校回報概況
          </h1>
        </div>

      {/* Metrics Grid */}
      <Metrics />

      {/* Class List Table */}
      <ClassTable reports={report}  config={config}/>

    
    </div>
  );
}
