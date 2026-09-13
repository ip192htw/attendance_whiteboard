import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Header />
      <main className="pl-60 pt-16 w-full min-h-screen bg-surface">
        <div className="max-w-[1240px] mx-auto p-space-xl">{children}</div>
      </main>
    </div>
  );
}
