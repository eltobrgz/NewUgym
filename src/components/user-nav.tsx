
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center w-full gap-2 p-1 rounded-md text-left hover:bg-accent flex-1">
        <Avatar className="h-9 w-9">
          <AvatarImage src={`https://placehold.co/100x100.png`} alt={`@${user.name}`} data-ai-hint="person portrait"/>
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 truncate" style={{ opacity: state === 'expanded' ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}>
            <p className="text-sm font-medium leading-none text-card-foreground">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {state === 'expanded' ? (
          <button className="w-full">{triggerContent}</button>
        ) : (
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://placehold.co/100x100.png`} alt={`@${user.name}`} data-ai-hint="person portrait"/>
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        )}
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
