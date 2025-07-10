
"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { UserProfile } from "./user-profile";
import { useUserRole } from "@/contexts/user-role-context";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar({ isCollapsed, onMobileLinkClick }: { isCollapsed: boolean, onMobileLinkClick?: () => void }) {
  const { user } = useUserRole();

  return (
    <div
      className={cn(
        "hidden md:flex md:flex-col fixed inset-y-0 z-40 bg-background border-r transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <UserProfile isCollapsed={isCollapsed} user={user} />
      <DashboardNav isCollapsed={isCollapsed} onLinkClick={onMobileLinkClick} />
    </div>
  );
}
