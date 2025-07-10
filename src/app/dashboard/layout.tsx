
"use client";
import { UserRoleProvider } from "@/contexts/user-role-context";
import { DashboardView } from "@/components/dashboard-view";
import { WorkoutsProvider } from "@/contexts/workouts-context";
import { EventsProvider } from "@/contexts/events-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserRoleProvider>
      <EventsProvider>
        <WorkoutsProvider>
          <DashboardView>{children}</DashboardView>
        </WorkoutsProvider>
      </EventsProvider>
    </UserRoleProvider>
  );
}
