"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "../actions/auth";

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

  const handleSignOut = async () => {
    alert("signed out")
    await signOut()
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 z-40 bg-surface-container-low border-r border-outline-variant flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-lg flex items-center gap-space-sm border-b border-outline-variant bg-surface-container-lowest">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-display font-semibold text-label-lg shadow-sm">
            校
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary leading-tight">
              校園白板
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              出缺勤回報系統
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
      </div>

      {/* System Live Node Status Footer */}
      <div className="p-space-md border-t border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant">
          <div className="w-2 h-2 " />
          <div className="flex flex-col">
            <button onClick={handleSignOut} >
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                登出
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
