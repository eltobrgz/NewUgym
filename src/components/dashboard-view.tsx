
"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

export function DashboardView({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={cn(
          "flex flex-col transition-[margin-left] duration-300 ease-in-out",
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        )}>
        <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
