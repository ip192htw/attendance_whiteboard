import { SettingForms } from "./components/Forms";

import { getSettings } from "@/app/actions";

export default async function SettingsPage() {
  
  const settings = await getSettings()

  return (
    <div className="flex flex-col w-full gap-space-lg">
        <SettingForms config={settings} />
        {/* Section 3: Personnel */}
          <section
            id="section-personnel"
            className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg relative overflow-hidden border border-outline-variant"
          >
            <div className="flex items-center gap-space-sm border-b border-outline-variant pb-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[24px]">
                  badge
                </span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                  人員與教官導師權限管理
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  管理生輔組教官、各班導師及風紀股長之系統權限
                </p>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-center justify-between text-body-md">
              <div>
                <span className="font-semibold text-on-surface">生輔組長權限號：</span>
                <span className="font-numeric-data text-primary ml-1 font-bold">
                  ADMIN-STAFF-01
                </span>
              </div>
              <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-semibold rounded">
                全域最高管理權限
              </span>
            </div>
          </section>
    </div>
  );
}
