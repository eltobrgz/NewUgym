"use client";

import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { UserNav } from "@/components/user-nav";
import { Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useUserRole } from "@/contexts/user-role-context";

export function DashboardView({ children }: { children: ReactNode }) {
  const { userRole } = useUserRole();

  return (
    <>
      <Sidebar>
        <DashboardNav />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <div className="relative flex-1" />
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-6">{children}</main>
      </SidebarInset>
    </>
  );
}
