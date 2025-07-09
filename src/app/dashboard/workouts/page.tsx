"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, Dumbbell, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const MOCK_USER_ROLE = "Student"; // or 'Trainer'

const workouts = {
  Monday: [
    { name: "Bench Press", sets: 3, reps: 10, done: true },
    { name: "Squats", sets: 4, reps: 8, done: false },
    { name: "Overhead Press", sets: 3, reps: 12, done: true },
  ],
  Tuesday: [{ name: "Rest Day" }],
  Wednesday: [
    { name: "Deadlift", sets: 3, reps: 5, done: false },
    { name: "Pull-ups", sets: 5, reps: 5, done: false },
    { name: "Bicep Curls", sets: 3, reps: 15, done: false },
  ],
  Thursday: [
    { name: "Running", duration: "30 mins", done: true },
    { name: "Stretching", duration: "15 mins", done: false },
  ],
  Friday: [
    { name: "Leg Press", sets: 4, reps: 12, done: false },
    { name: "Calf Raises", sets: 3, reps: 20, done: false },
    { name: "Plank", duration: "3x 60s", done: false },
  ],
  Saturday: [{ name: "Rest Day" }],
  Sunday: [{ name: "Rest Day" }],
};

type Workout = { name: string; sets?: number; reps?: number; duration?: string; done?: boolean };
type WorkoutsByDay = { [key: string]: Workout[] };

const StudentView = () => {
  const [dailyWorkouts, setDailyWorkouts] = useState<WorkoutsByDay>(workouts);
  const today = new Date().toLocaleString('en-us', { weekday: 'long' });

  const toggleDone = (day: string, workoutName: string) => {
    setDailyWorkouts(prev => ({
      ...prev,
      [day]: prev[day].map(w => w.name === workoutName ? { ...w, done: !w.done } : w)
    }));
  };

  return (
    <Tabs defaultValue={today} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7">
        {Object.keys(dailyWorkouts).map(day => (
          <TabsTrigger key={day} value={day}>{day.substring(0, 3)}</TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(dailyWorkouts).map(([day, workoutList]) => (
        <TabsContent key={day} value={day}>
          <Card>
            <CardHeader>
              <CardTitle>{day}'s Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {workoutList[0].name === "Rest Day" ? (
                <div className="flex items-center text-lg text-muted-foreground p-8 justify-center">
                  <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
                  <span>Rest Day</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {workoutList.map((workout) => (
                    <div key={workout.name} className={cn("flex items-center justify-between p-3 rounded-lg", workout.done ? "bg-primary/10" : "bg-secondary")}>
                      <div className="flex items-center">
                        <Dumbbell className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">{workout.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {workout.sets && workout.reps ? `${workout.sets} sets of ${workout.reps} reps` : workout.duration}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => toggleDone(day, workout.name)} aria-label={`Mark ${workout.name} as ${workout.done ? 'not done' : 'done'}`}>
                        {workout.done ? (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

const TrainerView = () => (
    <Card>
        <CardHeader>
            <CardTitle>Workout Templates</CardTitle>
            <CardDescription>Create and manage reusable workout templates for your students.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
             <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Template
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Your created templates will appear here.</p>
        </CardContent>
    </Card>
)

export default function WorkoutsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
            {MOCK_USER_ROLE === "Student" ? "My Workouts" : "Workout Management"}
        </h1>
        {MOCK_USER_ROLE === "Trainer" && <Button><PlusCircle className="mr-2 h-4 w-4" />Assign Workout</Button>}
      </div>
      {MOCK_USER_ROLE === "Student" ? <StudentView /> : <TrainerView />}
    </div>
  );
}
