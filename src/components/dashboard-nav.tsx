
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, Calendar, Settings, Users, DollarSign, ClipboardList, CheckSquare, Award, UserSquare, Dumbbell } from "lucide-react";
import { useUserRole } from "@/contexts/user-role-context";
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
    { name: "Treinadores", href: "/dashboard/trainers", icon: Award },
    { name: "Membros", href: "/dashboard/members", icon: UserSquare },
    { name: "Financeiro", href: "/dashboard/finance", icon: DollarSign },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
  ],
};

export const commonNav = [
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];


export function DashboardNav({ className, inSheet = false }: { className?: string; inSheet?: boolean }) {
  const pathname = usePathname();
  const { userRole } = useUserRole();
  const lowerCaseRole = userRole.toLowerCase() as keyof typeof navConfig;
  const navItems = navConfig[lowerCaseRole] || navConfig.student;

  const linkClass = (href: string, baseClass: string) =>
    cn(
      baseClass,
      (pathname === href || (href !== "/dashboard" && pathname.startsWith(href)))
        ? "text-foreground"
        : "text-muted-foreground",
    );

  if (inSheet) {
    return (
      <nav className="grid gap-2 text-lg font-medium">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="sr-only">Ugym</span>
        </Link>
        {[...navItems, ...commonNav].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={linkClass(item.href, "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary")}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn("hidden md:flex md:flex-row md:items-center md:gap-5 lg:gap-6 text-sm font-medium", className)}>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Dumbbell className="h-6 w-6 text-primary" />
        <span className="sr-only">Ugym</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={linkClass(item.href, "transition-colors hover:text-foreground")}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
