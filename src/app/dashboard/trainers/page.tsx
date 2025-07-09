import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function TrainersPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Manage Trainers</h1>
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Trainer Staff</CardTitle>
                    <CardDescription>Oversee all personal trainers at your facility.</CardDescription>
                </CardHeader>
                <div className="flex flex-col items-center justify-center gap-4 text-center p-12 text-muted-foreground">
                    <ShieldCheck className="h-16 w-16" />
                    <p className="text-lg font-medium">This page is under construction.</p>
                    <p className="max-w-md">The trainer management feature is coming soon. You'll be able to manage trainer schedules, assign members, and view performance metrics here.</p>
                </div>
            </Card>
        </div>
    );
}
