
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, Dumbbell, PlusCircle, Sparkles, Trash2, MoreVertical } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { GenerateWorkoutForm } from '@/components/generate-workout-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const studentsForAssignment = [
  { id: "alex-johnson", name: "Alex Johnson" },
  { id: "maria-garcia", name: "Maria Garcia" },
  { id: "david-chen", name: "David Chen" },
  { id: "emily-white", name: "Emily White" },
];


const initialWorkouts = {
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

const initialWorkoutTemplates = [
    { id: "TPL-001", name: "Iniciante Força 3x", difficulty: "Iniciante", focus: "Força", assignments: 5 },
    { id: "TPL-002", name: "Hipertrofia Full Body", difficulty: "Intermediário", focus: "Hipertrofia", assignments: 12 },
    { id: "TPL-003", name: "Cardio Intenso 30min", difficulty: "Avançado", focus: "Cardio", assignments: 8 },
    { id: "TPL-004", name: "Upper/Lower Split 4x", difficulty: "Intermediário", focus: "Força", assignments: 10 },
];

type Exercise = { name: string; sets?: number; reps?: string; duration?: string; rest?: string };
type DailyWorkout = { day: string; focus: string; exercises?: Exercise[] };
type WorkoutPlan = { planName: string; weeklySchedule: DailyWorkout[] };
type WorkoutState = { name: string; sets?: number; reps?: string; duration?: string; done?: boolean };
type WorkoutsByDay = { [key: string]: WorkoutState[] };

const StudentView = () => {
  const [dailyWorkouts, setDailyWorkouts] = useState<WorkoutsByDay>(initialWorkouts);
  const today = new Date().toLocaleString('en-us', { weekday: 'long' });
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const { toast } = useToast();

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
         toast({
            title: "Plano de Treino Criado!",
            description: `Seu novo plano "${plan.planName}" foi salvo e está pronto para uso.`,
        });
    }
    setIsAiModalOpen(false);
  };


  return (
    <>
    <WorkoutBuilder 
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSave={() => setIsBuilderOpen(false)}
        template={null}
      />
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Meus Treinos</h1>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1" onClick={() => setIsBuilderOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar meu treino
            </Button>
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogTrigger asChild>
                    <Button className="flex-1">
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
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
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

const WorkoutBuilder = ({ open, onOpenChange, onSave, template }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: () => void, template?: typeof initialWorkoutTemplates[0] | null }) => {
    const { toast } = useToast();
    
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: `Template ${template ? 'Atualizado' : 'Criado'}!`,
            description: `O template de treino foi salvo com sucesso.`,
        });
        onSave();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{template ? 'Editar' : 'Criar'} Template de Treino</DialogTitle>
                    <DialogDescription>Construa um plano de treino semanal reutilizável.</DialogDescription>
                </DialogHeader>
                <form id="workout-builder-form" onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-6 pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="template-name">Nome do Template</Label>
                            <Input id="template-name" defaultValue={template?.name} placeholder="Ex: Hipertrofia Intensa 5x" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="template-difficulty">Dificuldade</Label>
                            <Input id="template-difficulty" defaultValue={template?.difficulty} placeholder="Ex: Intermediário" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="template-description">Descrição</Label>
                        <Textarea id="template-description" placeholder="Descreva o foco e objetivo deste template..." />
                    </div>

                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                       <Card key={day}>
                           <CardHeader>
                               <CardTitle>{day}</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-4">
                               <div className="space-y-2">
                                   <Label>Foco do Dia</Label>
                                   <Input placeholder="Ex: Peito e Tríceps" />
                               </div>
                               <div className="border rounded-md p-4 space-y-4">
                                   <div className="flex items-center gap-2">
                                       <Input placeholder="Nome do exercício" className="flex-1" />
                                       <Input placeholder="Sets" type="number" className="w-20" />
                                       <Input placeholder="Reps" className="w-20" />
                                       <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                   </div>
                                    <div className="flex items-center gap-2">
                                       <Input placeholder="Nome do exercício" className="flex-1" />
                                       <Input placeholder="Duração" className="w-32" />
                                       <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                   </div>
                                    <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" />Adicionar Exercício</Button>
                               </div>
                           </CardContent>
                       </Card>
                    ))}
                </form>
                <DialogFooter>
                    <Button type="submit" form="workout-builder-form">Salvar Template</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const AssignWorkoutModal = ({ open, onOpenChange, templateName }: { open: boolean, onOpenChange: (open: boolean) => void, templateName: string }) => {
    const { toast } = useToast();
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

    const handleAssign = () => {
        if (selectedStudents.size === 0) {
            toast({
                title: 'Nenhum aluno selecionado',
                description: 'Por favor, selecione pelo menos um aluno para atribuir o treino.',
                variant: 'destructive',
            });
            return;
        }
        toast({
            title: 'Treino Atribuído!',
            description: `O template "${templateName}" foi atribuído a ${selectedStudents.size} aluno(s).`,
        });
        onOpenChange(false);
        setSelectedStudents(new Set());
    };

    const handleSelectStudent = (studentId: string, isSelected: boolean) => {
        const newSet = new Set(selectedStudents);
        if (isSelected) {
            newSet.add(studentId);
        } else {
            newSet.delete(studentId);
        }
        setSelectedStudents(newSet);
    };

    const handleSelectAll = (isAllSelected: boolean) => {
        if (isAllSelected) {
            setSelectedStudents(new Set(studentsForAssignment.map(s => s.id)));
        } else {
            setSelectedStudents(new Set());
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Atribuir "{templateName}"</DialogTitle>
                    <DialogDescription>Selecione os alunos para quem você deseja atribuir este template de treino.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex items-center px-4 pb-2 border-b">
                        <Checkbox id="select-all" onCheckedChange={(checked) => handleSelectAll(Boolean(checked))} checked={selectedStudents.size === studentsForAssignment.length && studentsForAssignment.length > 0} />
                        <Label htmlFor="select-all" className="ml-2 font-semibold">Selecionar Todos</Label>
                    </div>
                    <ScrollArea className="h-64">
                        <div className="p-4 space-y-2">
                        {studentsForAssignment.map(student => (
                            <div key={student.id} className="flex items-center">
                                <Checkbox id={student.id} onCheckedChange={(checked) => handleSelectStudent(student.id, Boolean(checked))} checked={selectedStudents.has(student.id)}/>
                                <Label htmlFor={student.id} className="ml-2">{student.name}</Label>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleAssign}>Atribuir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


const TrainerView = () => {
    const { toast } = useToast();
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<typeof initialWorkoutTemplates[0] | null>(null);

    const handleAiGeneratedPlan = (plan: WorkoutPlan | null) => {
        if (plan) {
            // In a real app, you would save this new template to the database
             toast({
                title: "Template de IA Criado!",
                description: `O novo template "${plan.planName}" foi adicionado à sua biblioteca.`,
            });
        }
        setIsAiModalOpen(false);
    };

    const handleEditTemplate = (template: typeof initialWorkoutTemplates[0]) => {
        setSelectedTemplate(template);
        setIsBuilderOpen(true);
    }
    
    const handleAddNewTemplate = () => {
        setSelectedTemplate(null);
        setIsBuilderOpen(true);
    }
    
    const handleOpenAssignModal = (template: typeof initialWorkoutTemplates[0]) => {
        setSelectedTemplate(template);
        setAssignModalOpen(true);
    }

    return (
    <>
      <WorkoutBuilder 
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSave={() => setIsBuilderOpen(false)}
        template={selectedTemplate}
      />
      {selectedTemplate && (
          <AssignWorkoutModal 
            open={isAssignModalOpen}
            onOpenChange={setAssignModalOpen}
            templateName={selectedTemplate.name}
          />
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Treinos</h1>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleAddNewTemplate} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" />Adicionar Template</Button>
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogTrigger asChild>
                    <Button className="flex-1">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Criar com IA
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
                    <TableHead className="hidden sm:table-cell">Foco</TableHead>
                    <TableHead className="hidden md:table-cell">Dificuldade</TableHead>
                    <TableHead>Nº de Alunos</TableHead>
                    <TableHead><span className="sr-only">Ações</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialWorkoutTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary">{template.focus}</Badge>
                      </TableCell>
                       <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{template.difficulty}</Badge>
                       </TableCell>
                      <TableCell>{template.assignments}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => handleEditTemplate(template)}>Editar</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleOpenAssignModal(template)}>Atribuir a Alunos</DropdownMenuItem>
                                <DropdownMenuItem>Duplicar</DropdownMenuItem>
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
