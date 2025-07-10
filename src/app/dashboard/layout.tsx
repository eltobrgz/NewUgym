
"use client";
import { UserRoleProvider } from "@/contexts/user-role-context";
import { DashboardView } from "@/components/dashboard-view";
import { WorkoutsProvider } from "@/contexts/workouts-context";
import { EventsProvider } from "@/contexts/events-context";
import { TasksProvider } from "@/contexts/tasks-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserRoleProvider>
      <TasksProvider>
        <EventsProvider>
          <WorkoutsProvider>
            <DashboardView>{children}</DashboardView>
          </WorkoutsProvider>
        </EventsProvider>
      </TasksProvider>
    </UserRoleProvider>
  );
}
