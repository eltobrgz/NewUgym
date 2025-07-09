import { UserRoleProvider } from "@/contexts/user-role-context";
import { DashboardView } from "@/components/dashboard-view";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <UserRoleProvider>
        <DashboardView>{children}</DashboardView>
      </UserRoleProvider>
    </SidebarProvider>
  );
}
