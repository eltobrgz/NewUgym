
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserRole, UserRole } from "@/contexts/user-role-context";
import { User, LogOut, Settings, SwatchBook } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";


export function UserNav() {
  const { user, userRole, setUserRole } = useUserRole();
  const { state } = useSidebar();

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length === 0) return "";
    const firstInitial = names[0][0];
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleRoleChange = (role: string) => {
    setUserRole(role as UserRole);
  };
  
  const triggerContent = (
    <div className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent">
        <Avatar className="h-9 w-9">
          <AvatarImage src={`https://placehold.co/100x100.png`} alt={`@${user.name}`} data-ai-hint="person portrait"/>
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className={cn("flex-1 truncate duration-200", state === "collapsed" ? "opacity-0 w-0" : "opacity-100 w-auto")}>
            <p className="text-base font-medium leading-none text-card-foreground">{user.name}</p>
            <p className="text-sm leading-none text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <button className="w-full">
            {triggerContent}
          </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
             <Link href="/dashboard/settings">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
             </Link>
          </DropdownMenuItem>
           <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <SwatchBook className="mr-2 h-4 w-4" />
                <span>Mudar Perfil</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={userRole} onValueChange={handleRoleChange}>
                  <DropdownMenuRadioItem value="Student">Aluno</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Trainer">Personal</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Gym">Academia</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
