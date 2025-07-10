
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, Calendar, Settings, Users, DollarSign, ClipboardList, CheckSquare, Award, UserSquare, LogOut, Sun, Moon } from "lucide-react";
import { useUserRole } from "@/contexts/user-role-context";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";

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
    { name: "Personais", href: "/dashboard/trainers", icon: Award },
    { name: "Membros", href: "/dashboard/members", icon: UserSquare },
    { name: "Financeiro", href: "/dashboard/finance", icon: DollarSign },
    { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
  ],
};

export function DashboardNav({ isCollapsed, onLinkClick }: { isCollapsed: boolean, onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { userRole } = useUserRole();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lowerCaseRole = userRole.toLowerCase() as keyof typeof navConfig;
  const navItems = navConfig[lowerCaseRole] || navConfig.student;

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  }

  const linkClass = (href: string, isCollapsed: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
        ? "bg-primary text-primary-foreground hover:text-primary-foreground"
        : "hover:bg-muted",
      isCollapsed ? "justify-center" : ""
    );

  const renderThemeSwitcher = () => {
    if (!mounted) {
        return <div className="h-[52px] w-full" />; // Placeholder
    }
    return (
        <div className="p-2">
            <div className={cn("flex items-center rounded-lg p-2", isCollapsed ? 'justify-center' : 'justify-between')}>
                <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                    <div className="flex items-center justify-center">
                        {theme === 'dark' ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <span className={cn("text-muted-foreground", isCollapsed ? "hidden" : "block")}>
                        {theme === 'dark' ? 'Escuro' : 'Claro'}
                    </span>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={cn(isCollapsed ? "hidden" : "block")}
                  aria-label="Toggle theme"
                />
            </div>
        </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-2 px-2 py-4">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} onClick={handleLinkClick}>
            <div className={linkClass(item.href, isCollapsed)}>
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn("truncate", isCollapsed ? "hidden" : "block")}>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t">
        <div className="space-y-1 px-2 py-4">
            <Link href="/dashboard/settings" onClick={handleLinkClick}>
                <div className={linkClass("/dashboard/settings", isCollapsed)}>
                    <Settings className="h-5 w-5 shrink-0" />
                    <span className={cn("truncate", isCollapsed ? "hidden" : "block")}>Configurações</span>
                </div>
            </Link>
             <Link href="/" onClick={handleLinkClick}>
                <div className={linkClass("/", isCollapsed)}>
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span className={cn("truncate", isCollapsed ? "hidden" : "block")}>Sair</span>
                </div>
            </Link>
        </div>
        <div className="border-t">
            {renderThemeSwitcher()}
        </div>
      </div>
    </div>
  );
}
