import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Dumbbell, Users, Calendar, ListChecks } from "lucide-react";

// In a real app, you would fetch user data and role.
const MOCK_USER_ROLE = "Student";

const metrics = {
  student: [
    { title: "Workouts Completed", value: "12/20", icon: Dumbbell, change: "+2 this week" },
    { title: "Active Streak", value: "5 days", icon: Activity, change: "Keep it up!" },
    { title: "Upcoming Events", value: "3", icon: Calendar, change: "Yoga class tomorrow" },
    { title: "Pending Tasks", value: "2", icon: ListChecks, change: "Leg day plan" }
  ],
  trainer: [
    { title: "Active Students", value: "15", icon: Users, change: "+1 new student" },
    { title: "Workouts Assigned", value: "45", icon: Dumbbell, change: "5 pending review" },
    { title: "Upcoming Sessions", value: "8", icon: Calendar, change: "2 today" },
    { title: "Overdue Tasks", value: "1", icon: ListChecks, change: "Follow up with Jane" }
  ],
  gym: [
    { title: "Total Members", value: "258", icon: Users, change: "+12 this month" },
    { title: "Active Trainers", value: "12", icon: Users, change: "All active" },
    { title: "Classes Today", value: "6", icon: Calendar, change: "Spin class at 6 PM" },
    { title: "Facility Tasks", value: "3", icon: ListChecks, change: "Check equipment" }
  ]
}

const renderMetrics = (role: keyof typeof metrics) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {(metrics[role] || []).map(metric => (
      <Card key={metric.title}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          <metric.icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metric.value}</div>
          <p className="text-xs text-muted-foreground">{metric.change}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function DashboardPage() {
  const roleKey = MOCK_USER_ROLE.toLowerCase() as keyof typeof metrics;
  
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {MOCK_USER_ROLE} Dashboard
      </h1>
      
      {renderMetrics(roleKey)}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <p>A beautiful chart showing progress over time will be displayed here.</p>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A log of recent workouts, completed tasks, and events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your recent activity feed will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
