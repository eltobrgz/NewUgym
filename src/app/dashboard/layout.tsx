import { UserRoleProvider } from "@/contexts/user-role-context";
import { DashboardView } from "@/components/dashboard-view";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserRoleProvider>
      <DashboardView>{children}</DashboardView>
    </UserRoleProvider>
  );
}
