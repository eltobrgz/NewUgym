
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserNav } from "@/components/user-nav";
import { DashboardNav } from "@/components/dashboard-nav";
import { useUserRole } from "@/contexts/user-role-context";
import { commonNav } from "./dashboard-nav";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { userRole } = useUserRole();
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
      <DashboardNav />
      <Sheet>
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
        <SheetContent side="left">
          <DashboardNav inSheet={true} />
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <UserNav />
      </div>
    </header>
  );
}
