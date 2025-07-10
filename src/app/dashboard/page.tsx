
"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Dumbbell, Users, Calendar, ListChecks, ArrowUp, ArrowDown, User, FileText, Megaphone, AlertTriangle, LineChart as LineChartIcon, BarChart3, UserCheck, UserX } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Legend, Line, LineChart } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/contexts/user-role-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- Data for Student Dashboard ---
const studentMetrics = [
  { title: "Workouts Completed", value: "12/20", icon: Dumbbell, change: "+2 this week" },
  { title: "Active Streak", value: "5 days", icon: Activity, change: "Keep it up!" },
  { title: "Upcoming Events", value: "3", icon: Calendar, change: "Yoga class tomorrow" },
  { title: "Pending Tasks", value: "2", icon: ListChecks, change: "Leg day plan" }
];

const studentWorkoutData = [
  { day: 'Mon', minutes: 60 }, { day: 'Tue', minutes: 45 }, { day: 'Wed', minutes: 75 },
  { day: 'Thu', minutes: 30 }, { day: 'Fri', minutes: 90 }, { day: 'Sat', minutes: 0 }, { day: 'Sun', minutes: 20 },
];
const studentChartConfig = { minutes: { label: 'Minutes', color: 'hsl(var(--primary))' } };

const studentRecentActivity = [
    { type: 'workout', description: 'Completed Leg Day workout', time: '2h ago', icon: Dumbbell, status: 'done' },
    { type: 'task', description: 'Updated meal plan', time: '5h ago', icon: ListChecks, status: 'done' },
    { type: 'event', description: 'Joined the "Summer Shred" challenge', time: '1d ago', icon: Calendar, status: 'joined' },
];

const StudentDashboard = () => (
    <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {studentMetrics.map(metric => (
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Workout Duration</CardTitle>
                    <CardDescription>Your workout minutes for the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={studentChartConfig} className="h-[250px] w-full">
                        <BarChart data={studentWorkoutData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="minutes" fill="var(--color-minutes)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of your recent actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {studentRecentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="bg-secondary p-2 rounded-full"><activity.icon className="h-5 w-5 text-muted-foreground" /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{activity.description}</p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                                <Badge variant={activity.status === 'joined' ? 'default' : 'secondary'} className={cn(activity.status === 'done' && 'bg-green-500/10 text-green-400 border-green-500/20')}>{activity.status}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </>
);

// --- Data for Trainer Dashboard ---
const trainerMetrics = [
    { title: "Active Students", value: "15", icon: Users, change: "+1 new this month" },
    { title: "Workouts Assigned", value: "45", icon: Dumbbell, change: "5 pending review" },
    { title: "Upcoming Sessions", value: "8", icon: Calendar, change: "2 today" },
    { title: "Overdue Tasks", value: "1", icon: AlertTriangle, change: "Follow up with Jane" }
];

const studentEngagementData = [
  { student: 'Alex J.', lastActive: 1, progress: 75 },
  { student: 'Maria G.', lastActive: 0, progress: 90 },
  { student: 'David C.', lastActive: 7, progress: 40 },
  { student: 'Emily W.', lastActive: 2, progress: 60 },
  { student: 'Sofia D.', lastActive: 15, progress: 25 },
];

const studentsNeedingAttention = [
    { name: 'David Chen', reason: 'Low workout progress (40%)', avatar: 'https://placehold.co/100x100.png', initials: 'DC', id: 'david-chen' },
    { name: 'Sofia Davis', reason: 'Inactive for 15 days', avatar: 'https://placehold.co/100x100.png', initials: 'SD', id: 'sofia-davis'},
]

const TrainerDashboard = () => (
    <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trainerMetrics.map(metric => (
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Student Engagement</CardTitle>
                    <CardDescription>Workout progress vs. days since last active.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={studentEngagementData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="student" />
                            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Legend />
                            <Bar dataKey="progress" name="Progress (%)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="lastActive" name="Last Active (Days)" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Students Needing Attention</CardTitle>
                    <CardDescription>Students with low activity or progress.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {studentsNeedingAttention.map((student) => (
                           <div key={student.id} className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{student.initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">{student.reason}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/students/${student.id}/progress`}>View</Link>
                                </Button>
                           </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </>
);


// --- Data for Gym Dashboard ---
const gymMetrics = [
    { title: "Total Members", value: "258", icon: Users, change: <span className="text-green-500 flex items-center"><ArrowUp className="h-4 w-4"/>+12 this month</span> },
    { title: "Active Trainers", value: "12", icon: UserCheck, change: "All active" },
    { title: "Classes Today", value: "6", icon: Calendar, change: "Spin class at 6 PM" },
    { title: "Facility Tasks", value: "3", icon: ListChecks, change: "Check equipment" }
];

const memberGrowthData = [
  { month: 'Jan', new: 15 }, { month: 'Feb', new: 22 }, { month: 'Mar', new: 18 },
  { month: 'Apr', new: 25 }, { month: 'May', new: 30 }, { month: 'Jun', new: 28 },
];
const gymChartConfig = { new: { label: 'New Members', color: 'hsl(var(--primary))' } };

const gymRecentAnnouncements = [
    { title: 'Summer Shred Challenge Starts Next Week!', icon: Megaphone, date: '2 days ago' },
    { title: 'New Yoga mats have arrived.', icon: FileText, date: '4 days ago' },
]

const GymDashboard = () => (
    <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {gymMetrics.map(metric => (
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>New Member Growth</CardTitle>
                    <CardDescription>Monthly new member sign-ups.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                     <ChartContainer config={gymChartConfig} className="h-[250px] w-full">
                        <LineChart data={memberGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                             <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Line type="monotone" dataKey="new" stroke="var(--color-new)" strokeWidth={2} dot={false} />
                        </LineChart>
                     </ChartContainer>
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Announcements & Events</CardTitle>
                    <CardDescription>Latest updates for your members.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        {gymRecentAnnouncements.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="bg-secondary p-2 rounded-full"><item.icon className="h-5 w-5 text-muted-foreground" /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                </div>
                            </div>
                        ))}
                         <div className="flex items-center gap-4">
                                <div className="bg-secondary p-2 rounded-full"><Calendar className="h-5 w-5 text-muted-foreground" /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Upcoming: Nutrition Seminar</p>
                                    <p className="text-xs text-muted-foreground">In 3 days</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/dashboard/calendar">View Calendar</Link>
                                </Button>
                           </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </>
);


const renderDashboardByRole = (role: string) => {
  switch(role) {
    case 'Student':
      return <StudentDashboard />;
    case 'Trainer':
      return <TrainerDashboard />;
    case 'Gym':
      return <GymDashboard />;
    default:
      return <StudentDashboard />;
  }
}

export default function DashboardPage() {
  const { userRole } = useUserRole();
  
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {userRole} Dashboard
      </h1>
      {renderDashboardByRole(userRole)}
    </div>
  );
}
