"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "./ui";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { name: "首頁", href: "/manage", icon: "query_stats", exact: true },
  { name: "人員管理", href: "/manage/settings#section-personnel", icon: "manage_accounts" },
  { name: "系統設定", href: "/manage/settings", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(item.href.split("#")[0]);
  };


  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 z-40 bg-surface-container-low border-r border-outline-variant flex flex-col justify-between select-none -translate-x-full md:translate-x-0 transition-transform duration-300">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-32 px-space-lg flex items-center gap-space-sm border-b border-outline-variant bg-surface-container-lowest">
          <img
            src="../favicon.ico"
            className="w-16 h-16 rounded-lg"
          />
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-primary leading-tight">
              學務處生輔組
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              學生缺曠回報系統
            </span>
          </div>
        </div>

        {/* Menu Title */}
        <div className="px-space-md py-space-sm">
          <div className="px-space-sm py-space-xs text-label-sm font-label-sm text-outline tracking-wider uppercase">
            系統主選單
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col px-space-sm gap-space-xs">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors ${
                  active
                    ? "bg-surface-container-highest text-primary border-l-[3px] border-primary-container font-headline-sm"
                    : "text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container hover:text-on-surface border-l-[3px] border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex justify-center">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
