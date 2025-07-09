import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function StudentsPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Student Roster</CardTitle>
                    <CardDescription>View and manage your assigned students.</CardDescription>
                </CardHeader>
                <div className="flex flex-col items-center justify-center gap-4 text-center p-12 text-muted-foreground">
                    <Users className="h-16 w-16" />
                    <p className="text-lg font-medium">This page is under construction.</p>
                    <p className="max-w-md">The student management feature is coming soon. You'll be able to view progress, assign workouts, and communicate with your students from here.</p>
                </div>
            </Card>
        </div>
    );
}
