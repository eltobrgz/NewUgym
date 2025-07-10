
"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { UserProfile } from "./user-profile";
import { useUserRole } from "@/contexts/user-role-context";
import { cn } from "@/lib/utils";

export function Sidebar({ isCollapsed, onToggle, onMobileLinkClick }: { isCollapsed: boolean, onToggle: () => void, onMobileLinkClick?: () => void }) {
  const { user } = useUserRole();

  return (
    <div
      className={cn(
        "hidden md:flex md:flex-col fixed inset-y-0 z-40 bg-card border-r transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <UserProfile isCollapsed={isCollapsed} onToggle={onToggle} user={user} />
      <DashboardNav isCollapsed={isCollapsed} onLinkClick={onMobileLinkClick} />
    </div>
  );
}
