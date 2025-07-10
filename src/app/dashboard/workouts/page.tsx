
"use client";

import { useState, useId, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, Dumbbell, PlusCircle, Sparkles, Trash2, MoreVertical, GripVertical, Save, X, UserPlus, ChevronDown } from "lucide-react";
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
  DialogFooter,
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
type WorkoutPlan = { id: string; name: string; description: string; difficulty: string; schedule: DailyWorkout[]; assignedTo?: string[]; };

type GeneratedWorkoutPlan = { planName: string; weeklySchedule: { day: string; focus: string; exercises?: { name: string; sets?: number; reps?: string; duration?: string; rest?: string }[] }[] };

const initialWorkoutTemplates: WorkoutPlan[] = [
    { id: "TPL-001", name: "Iniciante Força 3x", difficulty: "Iniciante", description: "Um plano de 3 dias para iniciantes focado em ganho de força.", schedule: [], assignedTo: ['alex-johnson'] },
    { id: "TPL-002", name: "Hipertrofia Full Body", difficulty: "Intermediário", description: "Treino de corpo inteiro para hipertrofia.", schedule: [], assignedTo: ['maria-garcia'] },
    { id: "TPL-003", name: "Cardio Intenso 30min", difficulty: "Avançado", description: "Sessão de cardio de alta intensidade.", schedule: [] },
];

const studentsForAssignment = [
  { id: "alex-johnson", name: "Alex Johnson" },
  { id: "maria-garcia", name: "Maria Garcia" },
  { id: "david-chen", name: "David Chen" },
  { id: "emily-white", name: "Emily White" },
];

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
];

const WorkoutBuilder = ({ open, onOpenChange, onSave, plan: initialPlan }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: (plan: WorkoutPlan) => void, plan: WorkoutPlan | null }) => {
    const formId = useId();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [schedule, setSchedule] = useState<DailyWorkout[]>([]);

    useEffect(() => {
        if (open) {
            if (initialPlan) {
                setName(initialPlan.name);
                setDescription(initialPlan.description);
                setDifficulty(initialPlan.difficulty);
                setSchedule(initialPlan.schedule.length > 0 ? initialPlan.schedule : [{ id: `day-${Date.now()}`, day: 'Segunda-feira', focus: 'Peito e Tríceps', exercises: [] }]);
            } else {
                 setName('');
                 setDescription('');
                 setDifficulty('');
                 setSchedule([{ id: `day-${Date.now()}`, day: 'Segunda-feira', focus: 'Peito e Tríceps', exercises: [] }]);
            }
        }
    }, [initialPlan, open]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: initialPlan?.id || `TPL-${Date.now()}`, name, description, difficulty, schedule });
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
                         <DialogTitle className="text-2xl">{initialPlan ? 'Editar Plano de Treino' : 'Criar Novo Plano'}</DialogTitle>
                         <div className="flex gap-2">
                             <Button variant="ghost" onClick={() => onOpenChange(false)}><X className="mr-2" /> Cancelar</Button>
                             <Button type="submit" form={formId}><Save className="mr-2"/> Salvar Plano</Button>
                         </div>
                    </div>
                    <DialogDescription>
                        Construa um plano de treino semanal detalhado, com exercícios, séries e repetições.
                    </DialogDescription>
                </DialogHeader>
                <form id={formId} onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Plano</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="plan-name">Nome do Plano</Label>
                                    <Input id="plan-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Hipertrofia Intensa 5x" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="plan-difficulty">Dificuldade</Label>
                                    <Input id="plan-difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)} placeholder="Ex: Intermediário" required/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan-description">Descrição</Label>
                                <Textarea id="plan-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o foco e objetivo deste plano..." />
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

const AssignWorkoutModal = ({ open, onOpenChange, onAssign, planName }: { open: boolean, onOpenChange: (open: boolean) => void, onAssign: (studentIds: string[]) => void, planName: string }) => {
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
        onAssign(Array.from(selectedStudents));
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
                    <DialogTitle>Atribuir "{planName}"</DialogTitle>
                    <DialogDescription>Selecione os alunos para quem você deseja atribuir este plano de treino.</DialogDescription>
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
                    <Button onClick={handleAssign}>Atribuir a {selectedStudents.size} Aluno(s)</Button>
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
    const [plans, setPlans] = useState<WorkoutPlan[]>(initialWorkoutTemplates);
    const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

    const handleAiGeneratedPlan = (plan: GeneratedWorkoutPlan | null) => {
        if (plan) {
            const newPlan: WorkoutPlan = {
                id: `TPL-AI-${Date.now()}`,
                name: plan.planName,
                description: `Plano gerado por IA com foco em ${plan.weeklySchedule[0]?.focus || 'geral'}.`,
                difficulty: 'IA Gerado',
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
            setPlans(prev => [newPlan, ...prev]);
             toast({
                title: "Plano de IA Criado!",
                description: `O novo plano "${plan.planName}" foi adicionado à sua biblioteca.`,
            });
        }
        setIsAiModalOpen(false);
    };
    
    const handleSavePlan = (plan: WorkoutPlan) => {
         const isEditing = plans.some(p => p.id === plan.id);
         if (isEditing) {
             setPlans(plans.map(p => p.id === plan.id ? plan : p));
         } else {
             setPlans([plan, ...plans]);
         }
         toast({
            title: `Plano ${isEditing ? 'Atualizado' : 'Criado'}!`,
            description: `O plano de treino "${plan.name}" foi salvo com sucesso.`,
        });
    }

    const handleEditPlan = (plan: WorkoutPlan) => {
        setSelectedPlan(plan);
        setIsBuilderOpen(true);
    }
    
    const handleAddNewPlan = () => {
        setSelectedPlan(null);
        setIsBuilderOpen(true);
    }
    
    const handleOpenAssignModal = (plan: WorkoutPlan) => {
        setSelectedPlan(plan);
        setAssignModalOpen(true);
    }

    const handleDeletePlan = (planId: string) => {
        setPlans(plans.filter(p => p.id !== planId));
        toast({
            title: 'Plano Excluído',
            description: 'O plano de treino foi removido da sua biblioteca.',
            variant: 'destructive'
        })
    }

    const handleAssignStudents = (studentIds: string[]) => {
        if (!selectedPlan) return;
        setPlans(plans.map(p => {
            if (p.id === selectedPlan.id) {
                const currentAssigned = new Set(p.assignedTo || []);
                studentIds.forEach(id => currentAssigned.add(id));
                return { ...p, assignedTo: Array.from(currentAssigned) };
            }
            return p;
        }));
        toast({
            title: 'Plano Atribuído!',
            description: `O plano "${selectedPlan.name}" foi atribuído com sucesso.`,
        });
    }

    const getAssignments = () => {
        const assignments: { studentName: string; planName: string; planId: string; }[] = [];
        plans.forEach(plan => {
            (plan.assignedTo || []).forEach(studentId => {
                const student = studentsForAssignment.find(s => s.id === studentId);
                if (student) {
                    assignments.push({ studentName: student.name, planName: plan.name, planId: plan.id });
                }
            });
        });
        return assignments;
    }


    return (
    <>
      <WorkoutBuilder 
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSave={handleSavePlan}
        plan={selectedPlan}
      />
      {selectedPlan && (
          <AssignWorkoutModal 
            open={isAssignModalOpen}
            onOpenChange={setAssignModalOpen}
            planName={selectedPlan.name}
            onAssign={handleAssignStudents}
          />
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Treinos</h1>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleAddNewPlan} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" />Criar Plano</Button>
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogTrigger asChild>
                    <Button className="flex-1">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Criar com IA
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Gerador de Plano com IA</DialogTitle>
                        <DialogDescription>
                            Descreva os objetivos e deixe a IA criar um plano de treino completo.
                        </DialogDescription>
                    </DialogHeader>
                    <GenerateWorkoutForm onPlanGenerated={handleAiGeneratedPlan} />
                </DialogContent>
            </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="templates">
        <TabsList>
            <TabsTrigger value="templates">Meus Planos</TabsTrigger>
            <TabsTrigger value="assignments">Alunos Atribuídos</TabsTrigger>
        </TabsList>
        <TabsContent value="templates">
            <Card>
                <CardHeader>
                    <CardTitle>Biblioteca de Planos</CardTitle>
                    <CardDescription>Crie e gerencie planos reutilizáveis para seus alunos.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome do Plano</TableHead>
                            <TableHead className="hidden md:table-cell">Dificuldade</TableHead>
                            <TableHead className="hidden sm:table-cell">Atribuído a</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {plans.map((plan) => (
                            <TableRow key={plan.id}>
                              <TableCell className="font-medium">{plan.name}</TableCell>
                               <TableCell className="hidden md:table-cell">
                                  <Badge variant="outline">{plan.difficulty}</Badge>
                               </TableCell>
                              <TableCell className="hidden sm:table-cell">{plan.assignedTo?.length || 0} aluno(s)</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onSelect={() => handleEditPlan(plan)}>Editar</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleOpenAssignModal(plan)}>
                                            <UserPlus className="mr-2 h-4 w-4" /> Atribuir a Alunos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeletePlan(plan.id)} className="text-destructive">Excluir</DropdownMenuItem>
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
                    <CardDescription>Visualize quais alunos estão seguindo cada plano de treino.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Plano Atribuído</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                            {getAssignments().map((ass, i) => (
                               <TableRow key={`${ass.planId}-${i}`}>
                                   <TableCell className="font-medium">{ass.studentName}</TableCell>
                                   <TableCell>{ass.planName}</TableCell>
                                   <TableCell className="text-right">
                                       <Button variant="link" size="sm">Ver Progresso</Button>
                                   </TableCell>
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

const StudentView = () => {
    const { toast } = useToast();
    const [weeklyPlan, setWeeklyPlan] = useState<DailyWorkout[]>(mockStudentPlan);
    const [myPlans, setMyPlans] = useState<WorkoutPlan[]>([]);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
    
    const handleToggleExercise = (dayId: string, exerciseId: string) => {
        setWeeklyPlan(plan => 
            plan.map(day => {
                if (day.id === dayId) {
                    return { ...day, exercises: day.exercises.map(ex => ex.id === exerciseId ? { ...ex, isCompleted: !ex.isCompleted } : ex) };
                }
                return day;
            })
        );
    };

    const handleAiGeneratedPlan = (plan: GeneratedWorkoutPlan | null) => {
        if (plan) {
            const newPlan: WorkoutPlan = {
                id: `PLN-AI-${Date.now()}`,
                name: plan.planName,
                description: `Plano gerado por IA com foco em ${plan.weeklySchedule[0]?.focus || 'geral'}.`,
                difficulty: 'IA Gerado',
                schedule: plan.weeklySchedule.map((day, index) => ({
                    id: `day-ai-${index}`, day: day.day, focus: day.focus,
                    exercises: (day.exercises || []).map((ex, exIndex) => ({
                        id: `ex-ai-${index}-${exIndex}`, name: ex.name, sets: String(ex.sets || ''), reps: String(ex.reps || ex.duration || ''),
                    }))
                })),
            };
            setMyPlans(prev => [newPlan, ...prev]);
             toast({ title: "Plano de IA Criado!", description: `O novo plano "${plan.planName}" foi adicionado aos seus planos.` });
        }
        setIsAiModalOpen(false);
    };

    const handleSavePlan = (plan: WorkoutPlan) => {
         const isEditing = myPlans.some(p => p.id === plan.id);
         if (isEditing) {
             setMyPlans(myPlans.map(p => p.id === plan.id ? plan : p));
         } else {
             setMyPlans([plan, ...myPlans]);
         }
         toast({ title: `Plano ${isEditing ? 'Atualizado' : 'Criado'}!`, description: `Seu plano "${plan.name}" foi salvo com sucesso.` });
    };

    const handleAddNewPlan = () => { setSelectedPlan(null); setIsBuilderOpen(true); };
    const handleEditPlan = (plan: WorkoutPlan) => { setSelectedPlan(plan); setIsBuilderOpen(true); };
    const handleDeletePlan = (planId: string) => {
        setMyPlans(myPlans.filter(p => p.id !== planId));
        toast({ title: 'Plano Excluído', variant: 'destructive' });
    };
    const handleActivatePlan = (plan: WorkoutPlan) => {
        setWeeklyPlan(plan.schedule);
        toast({ title: 'Plano Ativado!', description: `Você começou o plano "${plan.name}".`});
    };

    return (
        <div className="flex flex-col gap-6">
            <WorkoutBuilder open={isBuilderOpen} onOpenChange={setIsBuilderOpen} onSave={handleSavePlan} plan={selectedPlan} />
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogTrigger asChild>
                    <Button className="sr-only">Criar com IA</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Gerador de Plano com IA</DialogTitle>
                        <DialogDescription>Descreva seus objetivos e deixe a IA criar um plano de treino para você.</DialogDescription>
                    </DialogHeader>
                    <GenerateWorkoutForm onPlanGenerated={handleAiGeneratedPlan} />
                </DialogContent>
            </Dialog>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Meus Treinos</h1>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleAddNewPlan} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" />Criar Plano</Button>
                    <Button onClick={() => setIsAiModalOpen(true)} className="flex-1"><Sparkles className="mr-2 h-4 w-4" />Criar com IA</Button>
                </div>
            </div>

            <Tabs defaultValue="weekly-plan">
                <TabsList>
                    <TabsTrigger value="weekly-plan">Meu Plano Semanal</TabsTrigger>
                    <TabsTrigger value="my-plans">Meus Planos Salvos</TabsTrigger>
                </TabsList>
                <TabsContent value="weekly-plan">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plano Ativo</CardTitle>
                            <CardDescription>Seu plano de treino para esta semana. Marque os exercícios conforme os completa.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {weeklyPlan.length > 0 ? (
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
                                                                    <Checkbox id={`${day.id}-${exercise.id}`} checked={exercise.isCompleted} onCheckedChange={() => handleToggleExercise(day.id, exercise.id)} className="h-5 w-5" />
                                                                    <label htmlFor={`${day.id}-${exercise.id}`} className="ml-3 flex-1">
                                                                        <span className={cn("font-medium", exercise.isCompleted && "line-through text-muted-foreground")}>{exercise.name}</span>
                                                                        <span className="text-muted-foreground ml-2">{exercise.sets} séries x {exercise.reps} reps</span>
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
                             ) : (
                                 <div className="text-center py-10">
                                     <p className="text-muted-foreground">Você ainda não tem um plano de treino ativo.</p>
                                     <p className="text-muted-foreground">Crie um novo plano ou ative um da sua biblioteca!</p>
                                 </div>
                             )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="my-plans">
                    <Card>
                        <CardHeader>
                            <CardTitle>Biblioteca de Planos</CardTitle>
                            <CardDescription>Gerencie seus planos de treino salvos e ative-os quando quiser.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Dificuldade</TableHead><TableHead><span className="sr-only">Ações</span></TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {myPlans.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell className="font-medium">{plan.name}</TableCell>
                                            <TableCell><Badge variant="outline">{plan.difficulty}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleActivatePlan(plan)}>Ativar</Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onSelect={() => handleEditPlan(plan)}>Editar</DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => handleDeletePlan(plan.id)} className="text-destructive">Excluir</DropdownMenuItem>
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
            </Tabs>
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

    

    