"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, LayoutDashboard, BarChart, Calendar, ListChecks, Settings, Users, ShieldCheck } from "lucide-react";

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
    { name: "My Workouts", href: "/dashboard/workouts", icon: BarChart },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Tasks", href: "/dashboard/tasks", icon: ListChecks },
  ],
  trainer: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Students", href: "/dashboard/students", icon: Users },
    { name: "Workouts", href: "/dashboard/workouts", icon: BarChart },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Tasks", href: "/dashboard/tasks", icon: ListChecks },
  ],
  gym: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Trainers", href: "/dashboard/trainers", icon: ShieldCheck },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  ],
};

const commonNav = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
