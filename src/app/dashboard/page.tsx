"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Dumbbell, Users, Calendar, ListChecks, CheckCircle2, Repeat } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/contexts/user-role-context";

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

const chartData = [
  { day: 'Mon', minutes: 60 },
  { day: 'Tue', minutes: 45 },
  { day: 'Wed', minutes: 75 },
  { day: 'Thu', minutes: 30 },
  { day: 'Fri', minutes: 90 },
  { day: 'Sat', minutes: 0 },
  { day: 'Sun', minutes: 20 },
]

const chartConfig = {
  minutes: {
    label: 'Minutes',
    color: 'hsl(var(--primary))',
  },
}

const recentActivity = [
    { type: 'workout', description: 'Completed Leg Day workout', time: '2h ago', icon: Dumbbell, status: 'done' },
    { type: 'task', description: 'Updated meal plan', time: '5h ago', icon: ListChecks, status: 'done' },
    { type: 'event', description: 'Joined the "Summer Shred" challenge', time: '1d ago', icon: Calendar, status: 'joined' },
    { type: 'workout', description: 'Missed Cardio session', time: '2d ago', icon: Repeat, status: 'missed' },
]

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
  const { userRole } = useUserRole();
  const roleKey = userRole.toLowerCase() as keyof typeof metrics;
  
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {userRole} Dashboard
      </h1>
      
      {renderMetrics(roleKey)}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Workout Progress</CardTitle>
            <CardDescription>Your workout duration for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    />
                     <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="minutes" fill="var(--color-minutes)" radius={8} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A log of your recent workouts and tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <div className="bg-secondary p-2 rounded-full">
                            <activity.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        {activity.status === 'done' && <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">Done</Badge>}
                        {activity.status === 'missed' && <Badge variant="destructive">Missed</Badge>}
                         {activity.status === 'joined' && <Badge variant="default">Joined</Badge>}
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
