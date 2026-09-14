import { redirect, forbidden, unauthorized } from "next/navigation";

import { getCurrentUser } from "../actions";

export default async function Header() {

  const user = await getCurrentUser()

  const today = new Date()

  if (!!!user) redirect("/login");

  if (user.role == "") unauthorized();

  if (user.role == "monitor") forbidden();
  type FormattedDateString = `${number}年${number}月${number}日 (${string})`;

  function getFormattedDate(date: Date = new Date()): FormattedDateString {
    const days = ['日', '一', '二', '三', '四', '五', '六'] as const;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = days[date.getDay()];

    return `${year}年${month}月${day}日 (${dayName})`;
  }

  return (
    <header className="fixed top-0 left-0 md:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant z-30 flex items-center justify-between px-space-md md:px-space-xl">
      <div className="flex items-center gap-space-xs md:gap-space-md">
        <button className="md:hidden p-2 text-on-surface" id="toggle-sidebar">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-md text-md text-on-surface font-medium">
            {getFormattedDate(today)}
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
