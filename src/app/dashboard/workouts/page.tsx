
"use client";

import { useState, useId, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Circle, Dumbbell, PlusCircle, Sparkles, Trash2, MoreVertical, GripVertical, Save, X } from "lucide-react";
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Exercise = { id: string; name: string; sets: string; reps: string; isCompleted?: boolean };
type DailyWorkout = { id: string; day: string; focus: string; exercises: Exercise[]; };
type WorkoutTemplate = { id: string; name: string; description: string; difficulty: string; schedule: DailyWorkout[]; };

type WorkoutPlan = { planName: string; weeklySchedule: { day: string; focus: string; exercises?: { name: string; sets?: number; reps?: string; duration?: string; rest?: string }[] }[] };

const initialWorkoutTemplates: WorkoutTemplate[] = [
    { id: "TPL-001", name: "Iniciante Força 3x", difficulty: "Iniciante", description: "Um plano de 3 dias para iniciantes focado em ganho de força.", schedule: [] },
    { id: "TPL-002", name: "Hipertrofia Full Body", difficulty: "Intermediário", description: "Treino de corpo inteiro para hipertrofia.", schedule: [] },
    { id: "TPL-003", name: "Cardio Intenso 30min", difficulty: "Avançado", description: "Sessão de cardio de alta intensidade.", schedule: [] },
];

const initialAssignments = [
    { studentName: "Alex Johnson", templateName: "Hipertrofia Full Body", assignedDate: "2024-08-15" },
    { studentName: "Maria Garcia", templateName: "Iniciante Força 3x", assignedDate: "2024-08-14" },
];

const studentsForAssignment = [
  { id: "alex-johnson", name: "Alex Johnson" },
  { id: "maria-garcia", name: "Maria Garcia" },
  { id: "david-chen", name: "David Chen" },
  { id: "emily-white", name: "Emily White" },
];


const WorkoutBuilder = ({ open, onOpenChange, onSave, template }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: (template: WorkoutTemplate) => void, template: WorkoutTemplate | null }) => {
    const formId = useId();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [schedule, setSchedule] = useState<DailyWorkout[]>([]);

    useEffect(() => {
        if (template) {
            setName(template.name);
            setDescription(template.description);
            setDifficulty(template.difficulty);
            setSchedule(template.schedule || []);
        } else {
             setName('');
             setDescription('');
             setDifficulty('');
             setSchedule([
                { id: `day-${Date.now()}`, day: 'Segunda-feira', focus: 'Peito e Tríceps', exercises: [] }
             ]);
        }
    }, [template, open]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: template?.id || `TPL-${Date.now()}`, name, description, difficulty, schedule });
        onOpenChange(false);
    };

    const addDay = () => setSchedule([...schedule, { id: `day-${Date.now()}`, day: `Dia ${schedule.length + 1}`, focus: '', exercises: [] }]);
    const removeDay = (dayId: string) => setSchedule(schedule.filter(d => d.id !== dayId));
    
    const updateDay = (dayId: string, field: keyof Omit<DailyWorkout, 'exercises' | 'id'>, value: string) => {
        setSchedule(schedule.map(d => d.id === dayId ? { ...d, [field]: value } : d));
    };
    
    const addExercise = (dayId: string) => {
        const newExercise: Exercise = { id: `ex-${Date.now()}`, name: '', sets: '3', reps: '10' };
        setSchedule(schedule.map(d => d.id === dayId ? { ...d, exercises: [...d.exercises, newExercise] } : d));
    };

    const removeExercise = (dayId: string, exerciseId: string) => {
        setSchedule(schedule.map(d => d.id === dayId ? { ...d, exercises: d.exercises.filter(ex => ex.id !== exerciseId) } : d));
    };

    const updateExercise = (dayId: string, exerciseId: string, field: keyof Omit<Exercise, 'id' | 'isCompleted'>, value: string) => {
        setSchedule(schedule.map(d => d.id === dayId ? {
            ...d,
            exercises: d.exercises.map(ex => ex.id === exerciseId ? { ...ex, [field]: value } : ex)
        } : d));
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl w-full h-[95vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center justify-between">
                         <DialogTitle className="text-2xl">{template ? 'Editar Template de Treino' : 'Criar Novo Template'}</DialogTitle>
                         <div className="flex gap-2">
                             <Button variant="ghost" onClick={() => onOpenChange(false)}><X className="mr-2" /> Cancelar</Button>
                             <Button type="submit" form={formId}><Save className="mr-2"/> Salvar Template</Button>
                         </div>
                    </div>
                    <DialogDescription>
                        Construa um plano de treino semanal detalhado que pode ser reutilizado e atribuído aos seus alunos.
                    </DialogDescription>
                </DialogHeader>
                <form id={formId} onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Template</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="template-name">Nome do Template</Label>
                                    <Input id="template-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Hipertrofia Intensa 5x" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="template-difficulty">Dificuldade</Label>
                                    <Input id="template-difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)} placeholder="Ex: Intermediário" required/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="template-description">Descrição</Label>
                                <Textarea id="template-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o foco e objetivo deste template..." />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <Label className="text-lg font-semibold">Estrutura Semanal</Label>
                        <div className="space-y-4">
                            {schedule.map((day) => (
                               <Card key={day.id}>
                                   <CardHeader className="flex flex-row items-center justify-between py-3">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                            <Input value={day.day} onChange={(e) => updateDay(day.id, 'day', e.target.value)} className="text-lg font-bold border-none shadow-none p-1 h-auto focus-visible:ring-0" />
                                        </div>
                                       <Button variant="ghost" size="icon" onClick={() => removeDay(day.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                   </CardHeader>
                                   <CardContent className="space-y-4 pt-0">
                                       <div className="space-y-2">
                                           <Label>Foco do Dia</Label>
                                           <Input value={day.focus} onChange={(e) => updateDay(day.id, 'focus', e.target.value)} placeholder="Ex: Peito e Tríceps, Descanso" />
                                       </div>
                                       <div className="border rounded-md p-4 space-y-3">
                                            {day.exercises.map((exercise) => (
                                                <div key={exercise.id} className="flex items-center gap-2">
                                                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                   <Input value={exercise.name} onChange={e => updateExercise(day.id, exercise.id, 'name', e.target.value)} placeholder="Nome do exercício" className="flex-1" />
                                                   <Input value={exercise.sets} onChange={e => updateExercise(day.id, exercise.id, 'sets', e.target.value)} placeholder="Séries" type="text" className="w-20" />
                                                   <Input value={exercise.reps} onChange={e => updateExercise(day.id, exercise.id, 'reps', e.target.value)} placeholder="Reps" className="w-20" />
                                                   <Button variant="ghost" size="icon" onClick={() => removeExercise(day.id, exercise.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                               </div>
                                            ))}
                                            <Button variant="outline" size="sm" onClick={() => addExercise(day.id)}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Exercício</Button>
                                       </div>
                                   </CardContent>
                               </Card>
                            ))}
                        </div>
                    </div>
                     <Button variant="secondary" onClick={addDay} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Adicionar Dia</Button>
                </form>
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
    const [templates, setTemplates] = useState(initialWorkoutTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);

    const handleAiGeneratedPlan = (plan: WorkoutPlan | null) => {
        if (plan) {
            const newTemplate: WorkoutTemplate = {
                id: `TPL-AI-${Date.now()}`,
                name: plan.planName,
                description: `Plano gerado por IA com foco em ${plan.weeklySchedule[0]?.focus || 'geral'}.`,
                difficulty: 'IA Gerado', // Could be an input in the form
                schedule: plan.weeklySchedule.map((day, index) => ({
                    id: `day-ai-${index}`,
                    day: day.day,
                    focus: day.focus,
                    exercises: (day.exercises || []).map((ex, exIndex) => ({
                        id: `ex-ai-${index}-${exIndex}`,
                        name: ex.name,
                        sets: String(ex.sets || ''),
                        reps: String(ex.reps || ex.duration || ''),
                    }))
                })),
            };
            setTemplates(prev => [newTemplate, ...prev]);
             toast({
                title: "Template de IA Criado!",
                description: `O novo template "${plan.planName}" foi adicionado à sua biblioteca.`,
            });
        }
        setIsAiModalOpen(false);
    };
    
    const handleSaveTemplate = (template: WorkoutTemplate) => {
         const isEditing = templates.some(t => t.id === template.id);
         if (isEditing) {
             setTemplates(templates.map(t => t.id === template.id ? template : t));
         } else {
             setTemplates([template, ...templates]);
         }
         toast({
            title: `Template ${isEditing ? 'Atualizado' : 'Criado'}!`,
            description: `O template de treino "${template.name}" foi salvo com sucesso.`,
        });
    }

    const handleEditTemplate = (template: WorkoutTemplate) => {
        setSelectedTemplate(template);
        setIsBuilderOpen(true);
    }
    
    const handleAddNewTemplate = () => {
        setSelectedTemplate(null);
        setIsBuilderOpen(true);
    }
    
    const handleOpenAssignModal = (template: WorkoutTemplate) => {
        setSelectedTemplate(template);
        setAssignModalOpen(true);
    }

    const handleDeleteTemplate = (templateId: string) => {
        setTemplates(templates.filter(t => t.id !== templateId));
        toast({
            title: 'Template Excluído',
            description: 'O template de treino foi removido da sua biblioteca.',
            variant: 'destructive'
        })
    }

    return (
    <>
      <WorkoutBuilder 
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSave={handleSaveTemplate}
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
            <Button variant="outline" onClick={handleAddNewTemplate} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" />Criar Template</Button>
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
      
      <Tabs defaultValue="templates">
        <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="assignments">Alunos Atribuídos</TabsTrigger>
        </TabsList>
        <TabsContent value="templates">
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
                            <TableHead className="hidden md:table-cell">Dificuldade</TableHead>
                            <TableHead className="hidden sm:table-cell">Nº de Dias</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {templates.map((template) => (
                            <TableRow key={template.id}>
                              <TableCell className="font-medium">{template.name}</TableCell>
                               <TableCell className="hidden md:table-cell">
                                  <Badge variant="outline">{template.difficulty}</Badge>
                               </TableCell>
                              <TableCell className="hidden sm:table-cell">{template.schedule.length}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onSelect={() => handleEditTemplate(template)}>Editar</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleOpenAssignModal(template)}>Atribuir a Alunos</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeleteTemplate(template.id)} className="text-destructive">Excluir</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="assignments">
            <Card>
                <CardHeader>
                    <CardTitle>Atribuições de Treinos</CardTitle>
                    <CardDescription>Visualize quais alunos estão seguindo cada template de treino.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Template Atribuído</TableHead>
                            <TableHead className="text-right">Data</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialAssignments.map((ass, i) => (
                               <TableRow key={i}>
                                   <TableCell className="font-medium">{ass.studentName}</TableCell>
                                   <TableCell>{ass.templateName}</TableCell>
                                   <TableCell className="text-right">{ass.assignedDate}</TableCell>
                               </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
    )
}

const mockStudentPlan: DailyWorkout[] = [
    {
        id: 'day1', day: 'Segunda-feira', focus: 'Peito, Ombros e Tríceps', exercises: [
            { id: 'ex11', name: 'Supino Reto', sets: '4', reps: '8-12', isCompleted: true },
            { id: 'ex12', name: 'Desenvolvimento com Halteres', sets: '3', reps: '10', isCompleted: false },
            { id: 'ex13', name: 'Tríceps na Polia', sets: '3', reps: '12-15', isCompleted: false },
        ]
    },
    {
        id: 'day2', day: 'Terça-feira', focus: 'Costas e Bíceps', exercises: [
            { id: 'ex21', name: 'Barra Fixa', sets: '3', reps: 'Até a falha', isCompleted: false },
            { id: 'ex22', name: 'Remada Curvada', sets: '4', reps: '8-10', isCompleted: false },
            { id: 'ex23', name: 'Rosca Direta', sets: '3', reps: '12', isCompleted: false },
        ]
    },
    { id: 'day3', day: 'Quarta-feira', focus: 'Descanso Ativo', exercises: [] },
    {
        id: 'day4', day: 'Quinta-feira', focus: 'Pernas', exercises: [
            { id: 'ex41', name: 'Agachamento Livre', sets: '4', reps: '8-10', isCompleted: false },
            { id: 'ex42', name: 'Leg Press', sets: '3', reps: '12-15', isCompleted: false },
            { id: 'ex43', name: 'Cadeira Extensora', sets: '3', reps: '15', isCompleted: false },
        ]
    },
    { id: 'day5', day: 'Sexta-feira', focus: 'Cardio e Abdômen', exercises: [] },
    { id: 'day6', day: 'Sábado', focus: 'Descanso', exercises: [] },
    { id: 'day7', day: 'Domingo', focus: 'Descanso', exercises: [] },
];

const StudentView = () => {
    const [weeklyPlan, setWeeklyPlan] = useState(mockStudentPlan);
    
    const handleToggleExercise = (dayId: string, exerciseId: string) => {
        setWeeklyPlan(plan => 
            plan.map(day => {
                if (day.id === dayId) {
                    return {
                        ...day,
                        exercises: day.exercises.map(ex => {
                            if (ex.id === exerciseId) {
                                return { ...ex, isCompleted: !ex.isCompleted };
                            }
                            return ex;
                        })
                    };
                }
                return day;
            })
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Meu Plano de Treino</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Plano Semanal</CardTitle>
                    <CardDescription>Seu plano de treino para esta semana. Marque os exercícios conforme os completa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue={`item-${new Date().getDay()}`}>
                        {weeklyPlan.map((day, index) => {
                            const isRestDay = day.exercises.length === 0;
                             const allCompleted = !isRestDay && day.exercises.every(ex => ex.isCompleted);
                            
                            return (
                                <AccordionItem value={`item-${index+1}`} key={day.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                            <div className="flex items-center gap-3">
                                                 {allCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Dumbbell className="h-5 w-5 text-muted-foreground" />}
                                                <span className="font-semibold">{day.day}</span> - <span className="text-muted-foreground">{day.focus}</span>
                                            </div>
                                             {isRestDay && <Badge variant="outline">Descanso</Badge>}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {isRestDay ? (
                                            <p className="text-muted-foreground pl-10">Aproveite para descansar e se recuperar para o próximo treino!</p>
                                        ) : (
                                            <div className="pl-6 space-y-4">
                                                {day.exercises.map(exercise => (
                                                    <div key={exercise.id} className="flex items-center">
                                                        <Checkbox 
                                                            id={`${day.id}-${exercise.id}`}
                                                            checked={exercise.isCompleted}
                                                            onCheckedChange={() => handleToggleExercise(day.id, exercise.id)}
                                                            className="h-5 w-5"
                                                        />
                                                        <label htmlFor={`${day.id}-${exercise.id}`} className="ml-3 flex-1">
                                                            <span className={cn("font-medium", exercise.isCompleted && "line-through text-muted-foreground")}>{exercise.name}</span>
                                                            <span className="text-muted-foreground ml-2">
                                                                {exercise.sets} séries x {exercise.reps} reps
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}

export default function WorkoutsPage() {
  const { userRole } = useUserRole();

  return (
    <div className="flex flex-col gap-6 h-full">
      {userRole === "Student" ? <StudentView /> : <TrainerView />}
    </div>
  );
}

    