
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { LayoutDashboard, LineChart, Calendar, Settings, Users, DollarSign, LogOut, ClipboardList, CheckSquare, Award, UserSquare, Moon, Sun, Dumbbell } from "lucide-react";
import { useUserRole } from "@/contexts/user-role-context";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export const navConfig = {
  student: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Meus Treinos", href: "/dashboard/workouts", icon: ClipboardList },
    { name: "Meu Progresso", href: "/dashboard/progress", icon: LineChart },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
    { name: "Tarefas", href: "/dashboard/tasks", icon: CheckSquare },
  ],
  trainer: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Alunos", href: "/dashboard/students", icon: Users },
    { name: "Treinos", href: "/dashboard/workouts", icon: ClipboardList },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
    { name: "Tarefas", href: "/dashboard/tasks", icon: CheckSquare },
  ],
  gym: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Treinadores", href: "/dashboard/trainers", icon: Award },
    { name: "Membros", href: "/dashboard/members", icon: UserSquare },
    { name: "Financeiro", href: "/dashboard/finance", icon: DollarSign },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
  ],
};

export const commonNav = [
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

const ThemeToggleButton = () => {
    const { theme, setTheme } = useTheme();
    const { state } = useSidebar();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    if (state === 'collapsed') {
         return (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-full">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start gap-2 px-2">
            <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="min-w-0">Alterar Tema</span>
            </div>
        </Button>
    );
};


export function DashboardNav() {
  const pathname = usePathname();
  const { userRole } = useUserRole();
  const { state } = useSidebar();
  const lowerCaseRole = userRole.toLowerCase() as keyof typeof navConfig;
  const navItems = navConfig[lowerCaseRole] || navConfig.student;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-2", state === "collapsed" && "justify-center")}>
              <Dumbbell className="size-7 shrink-0 text-primary" />
              <div className={cn("duration-200", state === "collapsed" ? "opacity-0 w-0" : "opacity-100 w-auto")}>
                <span className="text-lg font-bold whitespace-nowrap" data-testid="sidebar-title">
                    Ugym
                </span>
              </div>
            </div>
             <SidebarTrigger className="hidden sm:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                tooltip={{children: item.name, side:"right"}}
              >
                <Link href={item.href}>
                  <item.icon className="size-5" />
                  <span className="min-w-0">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div>
          <Separator className="my-2"/>
          <SidebarMenu>
            {commonNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={{children: item.name, side:"right"}}
                  >
                      <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span className="min-w-0">{item.name}</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <ThemeToggleButton />
             </SidebarMenuItem>
          </SidebarMenu>

          <SidebarFooter className="p-2 mt-2">
            <UserNav />
          </SidebarFooter>
        </div>
      </SidebarContent>
    </>
  );
}
