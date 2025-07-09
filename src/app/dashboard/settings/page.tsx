
'use client';
import { useUserRole } from "@/contexts/user-role-context";
import { UserProfile } from "@/components/user-profile";

export default function SettingsPage() {
    const { userRole, user } = useUserRole();

    return (
        <div className="flex flex-col gap-6">
            <UserProfile user={user} role={userRole} />
        </div>
    );
}
