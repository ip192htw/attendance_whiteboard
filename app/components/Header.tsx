import { redirect } from "next/navigation";

import { requireUser } from "@/src/dal/auth";

import { SidebarToggleButton } from "./SidebarToggleButton";

export const dynamic = 'force-dynamic';

export default async function Header() {

  const user = await requireUser()

  if (!!!user) redirect("/login");
  
  type FormattedDateString = `中華民國${number}年${number}月${number}日 (${string})`;

  function getFormattedDate(): FormattedDateString {
    const date = new Date()
    const days = ['日', '一', '二', '三', '四', '五', '六'] as const;
    
    const year = date.getFullYear() - 1911;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = days[date.getDay()];

    return `中華民國${year}年${month}月${day}日 (${dayName})`;
  }

  return (
    <header className="fixed top-0 left-0 md:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant z-30 flex items-center justify-between px-space-md md:px-space-xl">
      <div className="flex items-center gap-space-xs md:gap-space-md">
        <SidebarToggleButton />
        <span className="font-md text-md text-on-surface font-medium">
            {getFormattedDate()}
        </span>
      </div>

      <div className="flex items-center gap-space-md">
        
        <div className="flex items-center gap-space-sm pl-space-md border-l border-outline-variant">
          <div className="flex flex-col text-right">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold leading-tight">
              {user.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
