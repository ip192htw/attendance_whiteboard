import React from "react";

import NavWrapper from "../components/NavWrapper";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface">
      <NavWrapper sidebar={<Sidebar />}>
        <Header />
        <main className="pl-0 md:pl-72 pt-16 w-full min-h-screen bg-surface">
          <div className="max-w-310 mx-auto p-4 sm:p-space-md md:p-space-xl">{children}</div>
        </main>
      </NavWrapper>
    </div>
  );
}
