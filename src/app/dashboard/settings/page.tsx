
'use client';
import { useUserRole } from "@/contexts/user-role-context";
import { UserProfileSettings } from "@/components/user-profile-settings";

export default function SettingsPage() {
    const { userRole, user } = useUserRole();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <UserProfileSettings user={user} role={userRole} />
        </div>
    );
}
