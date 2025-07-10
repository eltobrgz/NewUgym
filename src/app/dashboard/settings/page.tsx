
'use client';
import { useUserRole } from "@/contexts/user-role-context";
import { UserProfileSettings } from "@/components/user-profile-settings";

export default function SettingsPage() {
    const { user, userRole } = useUserRole();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Configurações do Perfil</h1>
            <UserProfileSettings user={user} role={userRole} />
        </div>
    );
}
