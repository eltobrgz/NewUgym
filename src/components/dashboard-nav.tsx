
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, Calendar, Settings, Users, DollarSign, ClipboardList, CheckSquare, Award, UserSquare, LogOut, Sun, Moon, Search } from "lucide-react";
import { useUserRole } from "@/contexts/user-role-context";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";

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

export function DashboardNav({ isCollapsed, onLinkClick }: { isCollapsed: boolean, onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { userRole } = useUserRole();
  const { theme, setTheme } = useTheme();

  const lowerCaseRole = userRole.toLowerCase() as keyof typeof navConfig;
  const navItems = navConfig[lowerCaseRole] || navConfig.student;

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  }

  const linkClass = (href: string) =>
    cn(
      "flex items-center gap-4 p-2.5 rounded-lg transition-colors text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground",
      (pathname === href || (href !== "/dashboard" && pathname.startsWith(href)))
        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
        : "",
      isCollapsed ? "justify-center" : ""
    );

  return (
    <div className="flex flex-col h-full">
      <div className={cn("relative my-2", isCollapsed ? "px-2.5" : "px-4")}>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className={cn("pl-8", isCollapsed ? "hidden" : "block")}
          />
          {isCollapsed && (
            <button className="w-full p-2.5 rounded-lg transition-colors text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground">
              <Search className="h-4 w-4 mx-auto" />
            </button>
          )}
      </div>
      
      <nav className="flex-1 space-y-2 px-2.5">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} onClick={handleLinkClick}>
            <div className={linkClass(item.href)}>
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn("truncate", isCollapsed ? "hidden" : "block")}>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-2 px-2.5 pb-4">
        <Link href="/dashboard/settings" onClick={handleLinkClick}>
          <div className={linkClass("/dashboard/settings")}>
            <Settings className="h-5 w-5 shrink-0" />
            <span className={cn("truncate", isCollapsed ? "hidden" : "block")}>Configurações</span>
          </div>
        </Link>
        <Link href="/" onClick={handleLinkClick}>
          <div className="flex items-center gap-4 p-2.5 rounded-lg transition-colors text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground">
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn("truncate", isCollapsed ? "hidden" : "block")}>Sair</span>
          </div>
        </Link>
        <div className="p-2.5 rounded-lg bg-muted-foreground/5">
          <div className="flex items-center gap-4">
            <div className={cn("p-1.5 rounded-lg bg-background shadow-sm", isCollapsed && 'mx-auto')}>
              {theme === 'dark' ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className={cn("flex-1", isCollapsed ? "hidden" : "block")}>
              <p className="text-sm font-semibold">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(isCollapsed ? "hidden" : "block")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
