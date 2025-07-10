
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole, UserRole } from "@/contexts/user-role-context";
import { navConfig, commonNav } from "./dashboard-nav";
import { MoreHorizontal, LogOut, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { userRole } = useUserRole();
  const lowerCaseRole = userRole.toLowerCase() as keyof typeof navConfig;
  const navItems = navConfig[lowerCaseRole] || [];

  const mainNavItems = navItems.slice(0, 4);
  const moreNavItems = navItems.slice(4);

  const allMoreItems = [...moreNavItems, ...commonNav];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border sm:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {mainNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                ? "text-primary"
                : "text-muted-foreground"
            )}
            aria-label={item.name}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        ))}
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted group text-muted-foreground">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-48 mb-2">
                 {allMoreItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4"/>
                            <span>{item.name}</span>
                        </Link>
                    </DropdownMenuItem>
                 ))}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                    </Link>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
