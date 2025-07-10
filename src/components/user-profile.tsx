
"use client";

import { Dumbbell, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/contexts/user-role-context";
import { Button } from "./ui/button";

export function UserProfile({ isCollapsed, onToggle, user }: { isCollapsed: boolean; onToggle: () => void; user: User; }) {
  return (
    <div className={cn("flex items-center border-b p-4", isCollapsed ? 'justify-center' : 'justify-between')}>
      <div className={cn("flex items-center gap-2 overflow-hidden", isCollapsed && "w-0")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-none">Ugym</h1>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onToggle} className="hidden md:flex">
        <ChevronLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
      </Button>
    </div>
  );
}
