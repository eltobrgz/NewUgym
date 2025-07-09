
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Circle, Dumbbell, PlusCircle, Edit, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useUserRole } from '@/contexts/user-role-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GenerateWorkoutForm } from '@/components/generate-workout-form';


const workouts = {
  Monday: [
    { name: "Bench Press", sets: 3, reps: "10", done: true },
    { name: "Squats", sets: 4, reps: "8", done: false },
    { name: "Overhead Press", sets: 3, reps: "12", done: true },
  ],
  Tuesday: [{ name: "Rest Day" }],
  Wednesday: [
    { name: "Deadlift", sets: 3, reps: "5", done: false },
    { name: "Pull-ups", sets: 5, reps: "5", done: false },
    { name: "Bicep Curls", sets: 3, reps: "15", done: false },
  ],
  Thursday: [
    { name: "Running", duration: "30 mins", done: true },
    { name: "Stretching", duration: "15 mins", done: false },
  ],
  Friday: [
    { name: "Leg Press", sets: 4, reps: "12", done: false },
    { name: "Calf Raises", sets: 3, reps: "20", done: false },
    { name: "Plank", duration: "3x 60s", done: false },
  ],
  Saturday: [{ name: "Rest Day" }],
  Sunday: [{ name: "Rest Day" }],
};

const workoutTemplates = [
    { id: "TPL-001", name: "Iniciante Força 3x", difficulty: "Iniciante", focus: "Força", assignments: 5 },
    { id: "TPL-002", name: "Hipertrofia Full Body", difficulty: "Intermediário", focus: "Hipertrofia", assignments: 12 },
    { id: "TPL-003", name: "Cardio Intenso 30min", difficulty: "Avançado", focus: "Cardio", assignments: 8 },
    { id: "TPL-004", name: "Upper/Lower Split 4x", difficulty: "Intermediário", focus: "Força", assignments: 10 },
]

type Exercise = { name: string; sets?: number; reps?: string; duration?: string; rest?: string };
type DailyWorkout = { day: string; focus: string; exercises?: Exercise[] };
type WorkoutPlan = { planName: string; weeklySchedule: DailyWorkout[] };

type WorkoutState = { name: string; sets?: number; reps?: string; duration?: string; done?: boolean };
type WorkoutsByDay = { [key: string]: WorkoutState[] };

const StudentView = () => {
  const [dailyWorkouts, setDailyWorkouts] = useState<WorkoutsByDay>(workouts);
  const today = new Date().toLocaleString('en-us', { weekday: 'long' });
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const toggleDone = (day: string, workoutName: string) => {
    setDailyWorkouts(prev => ({
      ...prev,
      [day]: prev[day].map(w => w.name === workoutName ? { ...w, done: !w.done } : w)
    }));
  };
  
  const handleAiGeneratedPlan = (plan: WorkoutPlan | null) => {
    if (plan && plan.weeklySchedule) {
        const newWorkouts: WorkoutsByDay = {};
        plan.weeklySchedule.forEach(day => {
            newWorkouts[day.day] = day.exercises ? day.exercises.map(ex => ({...ex, done: false})) : [{ name: 'Rest Day' }];
        });
        setDailyWorkouts(newWorkouts);
    }
    setIsAiModalOpen(false);
  };


  return (
    <>
    <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Meus Treinos</h1>
        <div className="flex gap-2">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar meu treino
            </Button>
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogTrigger asChild>
                    <Button>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Criar com IA
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Gerador de Treino com IA</DialogTitle>
                        <DialogDescription>
                            Descreva seus objetivos e deixe a IA criar um plano de treino personalizado para você.
                        </DialogDescription>
                    </DialogHeader>
                    <GenerateWorkoutForm onPlanGenerated={handleAiGeneratedPlan} />
                </DialogContent>
            </Dialog>
        </div>
      </div>
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
              <CardTitle>Plano de {day}</CardTitle>
              <CardDescription>Marque os exercícios conforme os completa.</CardDescription>
            </CardHeader>
            <CardContent>
              {workoutList[0].name === "Rest Day" ? (
                <div className="flex items-center text-lg text-muted-foreground p-8 justify-center">
                  <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
                  <span>Dia de Descanso</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {workoutList.map((workout) => (
                    <div key={workout.name} className={cn("flex items-center justify-between p-3 rounded-lg", workout.done ? "bg-primary/10 border border-primary/20" : "bg-secondary")}>
                      <div className="flex items-center">
                        <Dumbbell className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">{workout.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {workout.sets && workout.reps ? `${workout.sets} sets de ${workout.reps} reps` : workout.duration}
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
    </>
  );
};

const TrainerView = () => {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const handleAiGeneratedPlan = (plan: WorkoutPlan | null) => {
        // In a real app, you would save this new template to the database
        if (plan) {
            console.log("New AI-generated template:", plan);
            // Here you would add the new plan to your `workoutTemplates` state
        }
        setIsAiModalOpen(false);
    };

    return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Treinos</h1>
        <div className="flex gap-2">
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />Atribuir Treino</Button>
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogTrigger asChild>
                    <Button>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Criar Template com IA
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Gerador de Template com IA</DialogTitle>
                        <DialogDescription>
                            Descreva os objetivos do template e deixe a IA criar um plano de treino reutilizável.
                        </DialogDescription>
                    </DialogHeader>
                    <GenerateWorkoutForm onPlanGenerated={handleAiGeneratedPlan} />
                </DialogContent>
            </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Templates de Treino</CardTitle>
            <CardDescription>Crie e gerencie templates reutilizáveis para seus alunos.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Template</TableHead>
                    <TableHead>Foco</TableHead>
                    <TableHead>Dificuldade</TableHead>
                    <TableHead>Nº de Alunos</TableHead>
                    <TableHead><span className="sr-only">Ações</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workoutTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                          <Badge variant="secondary">{template.focus}</Badge>
                      </TableCell>
                       <TableCell>
                          <Badge variant="outline">{template.difficulty}</Badge>
                       </TableCell>
                      <TableCell>{template.assignments}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                <DropdownMenuItem>Atribuir a Alunos</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
    </>
    )
}

export default function WorkoutsPage() {
  const { userRole } = useUserRole();

  return (
    <div className="flex flex-col gap-6">
      {userRole === "Student" ? <StudentView /> : <TrainerView />}
    </div>
  );
}
