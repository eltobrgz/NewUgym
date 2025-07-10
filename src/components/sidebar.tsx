
"use client";

import { SidebarContent } from "@/components/sidebar-content";
import { cn } from "@/lib/utils";

export function Sidebar({ isCollapsed, onToggle, onMobileLinkClick }: { isCollapsed: boolean, onToggle: () => void, onMobileLinkClick?: () => void }) {

  return (
    <div
      className={cn(
        "hidden md:flex md:flex-col fixed inset-y-0 z-40 bg-card border-r transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarContent isCollapsed={isCollapsed} onToggle={onToggle} onMobileLinkClick={onMobileLinkClick} />
    </div>
  );
}
