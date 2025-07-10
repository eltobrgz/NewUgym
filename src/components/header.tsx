
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserNav } from "@/components/user-nav";
import { SidebarContent } from "./sidebar-content";

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void; }) {
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex flex-col w-64">
           <SidebarContent 
            isCollapsed={false} 
            onToggle={() => {}} 
            onMobileLinkClick={() => setIsMobileSheetOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
