
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, Calendar, Settings, Users, DollarSign, LogOut, ClipboardList, CheckSquare, Whistle, UserSquare } from "lucide-react";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { useUserRole } from "@/contexts/user-role-context";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

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
    { name: "Treinadores", href: "/dashboard/trainers", icon: Whistle },
    { name: "Membros", href: "/dashboard/members", icon: UserSquare },
    { name: "Financeiro", href: "/dashboard/finance", icon: DollarSign },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
  ],
};

export const commonNav = [
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { userRole } = useUserRole();
  const { state } = useSidebar();
  const lowerCaseRole = userRole.toLowerCase() as keyof typeof navConfig;
  const navItems = navConfig[lowerCaseRole] || navConfig.student;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-5" fill="currentColor"><path d="M244.27,132.37,208,160.23V104a12,12,0,0,0-24,0v49.6l-34.67-24a12,12,0,0,0-12.52.8L96.3,158.4l-44-25.39a12,12,0,0,0-12.52.8L12.3,149.63a12,12,0,1,0,11.4,19.74l18.9,10.91,2.58,1.49,30,17.32,4.42,2.55a12,12,0,0,0,12.52-.8l40.51-28.94,36.22,25.87A12,12,0,0,0,180,200a11.9,11.9,0,0,0,6.27-1.88l60-36a12,12,0,1,0-12-20.24ZM42.1,170.81l-18.9-10.91,21.42-12.36,18.9,10.91Zm80,7.18L81.59,150.4l44-25.39,40.51,28.94Z"/></svg>
          </div>
          <div className={cn("duration-200", state === "collapsed" ? "opacity-0 w-0" : "opacity-100 w-auto")}>
            <span className="text-lg font-semibold whitespace-nowrap" data-testid="sidebar-title">
                Ugym
            </span>
          </div>
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
                          <span>{item.name}</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarFooter className="p-2 mt-4">
             <UserNav />
          </SidebarFooter>
        </div>
      </SidebarContent>
    </>
  );
}
