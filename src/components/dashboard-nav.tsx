"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, LayoutDashboard, BarChart, Calendar, ListChecks, Settings, Users, ShieldCheck, LineChart, DollarSign } from "lucide-react";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useUserRole } from "@/contexts/user-role-context";

const navConfig = {
  student: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Meus Treinos", href: "/dashboard/workouts", icon: BarChart },
    { name: "Meu Progresso", href: "/dashboard/progress", icon: LineChart },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
    { name: "Tarefas", href: "/dashboard/tasks", icon: ListChecks },
  ],
  trainer: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Alunos", href: "/dashboard/students", icon: Users },
    { name: "Treinos", href: "/dashboard/workouts", icon: BarChart },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
    { name: "Tarefas", href: "/dashboard/tasks", icon: ListChecks },
  ],
  gym: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Treinadores", href: "/dashboard/trainers", icon: ShieldCheck },
    { name: "Membros", href: "/dashboard/members", icon: Users },
    { name: "Financeiro", href: "/dashboard/finance", icon: DollarSign },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
  ],
};

const commonNav = [
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { userRole } = useUserRole();
  const lowerCaseRole = userRole.toLowerCase() as keyof typeof navConfig;
  const navItems = navConfig[lowerCaseRole] || navConfig.student;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Dumbbell className="size-7 text-primary" />
          <span className="text-xl font-semibold" data-testid="sidebar-title">
            Ugym
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.name}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu>
          {commonNav.map((item) => (
            <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                >
                    <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
