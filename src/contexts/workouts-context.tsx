
"use client"

import { createContext, useState, ReactNode } from 'react';
import { allUsers } from '@/lib/user-directory';

export type SetLog = {
    id: string;
    weight: number;
    reps: number;
    isCompleted: boolean;
};

export type Exercise = { 
    id: string; 
    name: string; 
    sets: string; 
    reps: string; 
    mediaUrl?: string; // Added mediaUrl
    isCompleted?: boolean;
    notes?: string;
    setLogs?: SetLog[];
};

export type DailyWorkout = { id:string; day: string; focus: string; exercises: Exercise[]; };
export type WorkoutPlan = { 
    id: string; 
    name: string; 
    description: string; 
    difficulty: string; 
    schedule: DailyWorkout[];
    assignedTo?: string[]; // student ids this plan is assigned to (on templates)
    owner?: string; // student id if they created it themselves or it's a copy
    templateId?: string; // The ID of the template this plan was copied from
};

const strengthTemplateSchedule: DailyWorkout[] = [
    { id: 'day1-str', day: 'Segunda-feira', focus: 'Peito, Ombros e Tríceps', exercises: [
        { id: 'ex11-str', name: 'Supino Reto com Barra', sets: '4', reps: '6-8', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/EAB308/000000.gif?text=Ex' },
        { id: 'ex12-str', name: 'Desenvolvimento Militar com Barra', sets: '3', reps: '8-10', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/F472B6/000000.gif?text=Ex' },
        { id: 'ex13-str', name: 'Supino Fechado', sets: '3', reps: '8-10', isCompleted: false },
        { id: 'ex14-str', name: 'Elevação Lateral com Halteres', sets: '3', reps: '12-15', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/EF4444/000000.gif?text=Ex' },
    ]},
    { id: 'day2-str', day: 'Quarta-feira', focus: 'Costas e Bíceps', exercises: [
        { id: 'ex21-str', name: 'Levantamento Terra', sets: '4', reps: '5-6', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/3B82F6/000000.gif?text=Ex' },
        { id: 'ex22-str', name: 'Remada Curvada com Barra', sets: '4', reps: '8-10', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/8B5CF6/000000.gif?text=Ex' },
        { id: 'ex23-str', name: 'Rosca Direta com Barra', sets: '3', reps: '8-10', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/10B981/000000.gif?text=Ex' },
    ]},
    { id: 'day3-str', day: 'Sexta-feira', focus: 'Pernas', exercises: [
        { id: 'ex31-str', name: 'Agachamento Livre', sets: '5', reps: '5', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/F97316/000000.gif?text=Ex' },
        { id: 'ex32-str', name: 'Leg Press 45', sets: '4', reps: '10-12', isCompleted: false },
        { id: 'ex33-str', name: 'Stiff', sets: '3', reps: '10-12', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/A855F7/000000.gif?text=Ex' },
        { id: 'ex34-str', name: 'Panturrilha em Pé', sets: '5', reps: '15-20', isCompleted: false },
    ]},
     { id: 'day4-str', day: 'Terça-feira', focus: 'Descanso', exercises: [] },
     { id: 'day5-str', day: 'Quinta-feira', focus: 'Descanso', exercises: [] },
     { id: 'day6-str', day: 'Sábado', focus: 'Descanso', exercises: [] },
     { id: 'day7-str', day: 'Domingo', focus: 'Descanso', exercises: [] },
].sort((a,b) => ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].indexOf(a.day) - ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].indexOf(b.day));


const hypertrophyTemplateSchedule: DailyWorkout[] = [
    { id: 'day1-hyp', day: 'Segunda', focus: 'Peito e Tríceps', exercises: [
        { id: 'ex11-hyp', name: 'Supino Inclinado com Halteres', sets: '4', reps: '8-12', mediaUrl: 'https://placehold.co/100x100/F472B6/000000.gif?text=Ex' },
        { id: 'ex12-hyp', name: 'Crucifixo na Máquina', sets: '3', reps: '12-15' },
        { id: 'ex13-hyp', name: 'Tríceps Testa com Barra W', sets: '4', reps: '10-12', mediaUrl: 'https://placehold.co/100x100/EAB308/000000.gif?text=Ex' },
    ]},
    { id: 'day2-hyp', day: 'Terça', focus: 'Costas e Bíceps', exercises: [
        { id: 'ex21-hyp', name: 'Puxada Frontal', sets: '4', reps: '8-12' },
        { id: 'ex22-hyp', name: 'Remada Cavalinho', sets: '4', reps: '10-12', mediaUrl: 'https://placehold.co/100x100/8B5CF6/000000.gif?text=Ex' },
        { id: 'ex23-hyp', name: 'Rosca Scott', sets: '3', reps: '12-15', mediaUrl: 'https://placehold.co/100x100/10B981/000000.gif?text=Ex' },
    ]},
    { id: 'day3-hyp', day: 'Quarta', focus: 'Descanso', exercises: []},
    { id: 'day4-hyp', day: 'Quinta', focus: 'Pernas (Quadríceps e Panturrilha)', exercises: [
        { id: 'ex41-hyp', name: 'Agachamento Hack', sets: '4', reps: '10-12', mediaUrl: 'https://placehold.co/100x100/F97316/000000.gif?text=Ex' },
        { id: 'ex42-hyp', name: 'Cadeira Extensora', sets: '4', reps: '15-20' },
        { id: 'ex43-hyp', name: 'Panturrilha no Leg Press', sets: '5', reps: '15-20' },
    ]},
    { id: 'day5-hyp', day: 'Sexta', focus: 'Ombros e Posteriores', exercises: [
        { id: 'ex51-hyp', name: 'Elevação Lateral', sets: '5', reps: '12-15', mediaUrl: 'https://placehold.co/100x100/EF4444/000000.gif?text=Ex' },
        { id: 'ex52-hyp', name: 'Mesa Flexora', sets: '4', reps: '12-15' },
        { id: 'ex53-hyp', name: 'Cadeira Abdutora', sets: '4', reps: '15-20' },
    ]},
    { id: 'day6-hyp', day: 'Sábado', focus: 'Descanso', exercises: []},
    { id: 'day7-hyp', day: 'Domingo', focus: 'Descanso', exercises: []},
];

const initialWorkoutTemplates: WorkoutPlan[] = [
    { id: "TPL-001", name: "Iniciante Força 3x", difficulty: "Iniciante", description: "Um plano de 3 dias para iniciantes focado em ganho de força com exercícios compostos.", schedule: strengthTemplateSchedule, assignedTo: ['alex-johnson', 'stu-001'] },
    { id: "TPL-002", name: "Hipertrofia 5x Split", difficulty: "Intermediário", description: "Plano de 5 dias com divisão de grupamentos musculares para hipertrofia.", schedule: hypertrophyTemplateSchedule, assignedTo: ['maria-garcia'] },
    { id: "TPL-003", name: "Cardio Intenso 30min", difficulty: "Todos os Níveis", description: "Sessão de cardio de alta intensidade para ser usada em dias de descanso ativo ou como complemento.", schedule: [
        { id: 'day1-car', day: 'Sessão Única', focus: 'HIIT', exercises: [
            { id: 'ex11-car', name: 'Corrida na Esteira (Tiros)', sets: '10', reps: '1 min forte / 1 min leve' },
            { id: 'ex12-car', name: 'Bicicleta Ergométrica', sets: '1', reps: '15 minutos' },
        ]}
    ], assignedTo: [] },
];

const mockStudentPlanSchedule: DailyWorkout[] = [
    {
        id: 'day1', day: 'Segunda-feira', focus: 'Peito, Ombros e Tríceps', exercises: [
            { id: 'ex11', name: 'Supino Reto', sets: '4', reps: '8-12', isCompleted: true, setLogs: [{id: 'log1', weight: 80, reps: 10, isCompleted: true}, {id: 'log2', weight: 80, reps: 9, isCompleted: true}, {id: 'log3', weight: 75, reps: 11, isCompleted: true}], notes: 'Me senti forte hoje.', mediaUrl: 'https://placehold.co/100x100/EAB308/000000.gif?text=Ex' },
            { id: 'ex12', name: 'Desenvolvimento com Halteres', sets: '3', reps: '10', isCompleted: true, setLogs: [{id: 'log4', weight: 20, reps: 10, isCompleted: true}, {id: 'log5', weight: 20, reps: 10, isCompleted: true}, {id: 'log6', weight: 20, reps: 9, isCompleted: true}], notes: '' },
            { id: 'ex13', name: 'Tríceps na Polia', sets: '3', reps: '12-15', isCompleted: false, setLogs: [], notes: '' },
        ]
    },
    {
        id: 'day2', day: 'Terça-feira', focus: 'Costas e Bíceps', exercises: [
            { id: 'ex21', name: 'Barra Fixa', sets: '3', reps: 'Até a falha', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/8B5CF6/000000.gif?text=Ex' },
            { id: 'ex22', name: 'Remada Curvada', sets: '4', reps: '8-10', isCompleted: false },
            { id: 'ex23', name: 'Rosca Direta', sets: '3', reps: '12', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/10B981/000000.gif?text=Ex' },
        ]
    },
    { id: 'day3', day: 'Quarta-feira', focus: 'Descanso Ativo', exercises: [] },
    { id: 'day4', day: 'Quinta-feira', focus: 'Pernas', exercises: [
         { id: 'ex41', name: 'Agachamento Livre', sets: '5', reps: '5', isCompleted: false, mediaUrl: 'https://placehold.co/100x100/F97316/000000.gif?text=Ex' },
    ]},
    { id: 'day5', day: 'Sexta-feira', focus: 'Cardio', exercises: [
         { id: 'ex51', name: 'Corrida', sets: '1', reps: '30 min', isCompleted: false },
    ]},
    { id: 'day6', day: 'Sábado', focus: 'Descanso', exercises: [] },
    { id: 'day7', day: 'Domingo', focus: 'Descanso', exercises: [] },
];


const initialStudentOwnedPlans: WorkoutPlan[] = [
    { 
        id: "STU-PLN-alex-johnson",
        name: "Meu Treino de Força",
        difficulty: "Iniciante", 
        description: "Plano de 3 dias para iniciantes focado em ganho de força.", 
        schedule: mockStudentPlanSchedule, 
        owner: 'alex-johnson',
        templateId: 'TPL-001',
    },
     { 
        id: "STU-PLN-maria-garcia",
        name: "Hipertrofia 5x Split",
        difficulty: "Intermediário", 
        description: "Plano de 5 dias com divisão de grupamentos musculares para hipertrofia.",
        schedule: hypertrophyTemplateSchedule.map(day => ({...day, exercises: day.exercises.map(ex => ({...ex, isCompleted: Math.random() > 0.5}))})), 
        owner: 'maria-garcia',
        templateId: 'TPL-002',
    }
]


// studentId -> planId
type ActiveStudentPlans = Record<string, string>;

interface WorkoutsContextType {
    plans: WorkoutPlan[];
    activeStudentPlans: ActiveStudentPlans;
    addPlan: (planData: Omit<WorkoutPlan, 'id'>) => void;
    updatePlan: (planId: string, updates: WorkoutPlan) => void;
    deletePlan: (planId: string) => void;
    assignPlanToStudents: (planId: string, studentIds: string[]) => void;
    getAssignments: () => { studentId: string; studentName: string; plan: WorkoutPlan | null; }[];
    setActiveStudentPlan: (studentId: string, planId: string) => void;
    updateExerciseDetails: (planId: string, dayId: string, updatedExercise: Exercise) => void;
    getStudentPlan: (studentId: string) => WorkoutPlan | null;
    getStudentWorkoutProgress: (studentId: string) => number;
}

export const WorkoutsContext = createContext<WorkoutsContextType>({} as WorkoutsContextType);

export const WorkoutsProvider = ({ children }: { children: ReactNode }) => {
    const [plans, setPlans] = useState<WorkoutPlan[]>([...initialWorkoutTemplates, ...initialStudentOwnedPlans]);
    const [activeStudentPlans, setActiveStudentPlans] = useState<ActiveStudentPlans>({
        'stu-001': 'STU-PLN-alex-johnson',
        'alex-johnson': 'STU-PLN-alex-johnson',
        'maria-garcia': 'STU-PLN-maria-garcia'
    });

    const addPlan = (planData: Omit<WorkoutPlan, 'id'>) => {
        const newPlan = { ...planData, id: `plan-${Date.now()}` };
        setPlans(prev => [...prev, newPlan]);
        if(planData.owner) {
            setActiveStudentPlan(planData.owner, newPlan.id)
        }
    };

    const updatePlan = (planId: string, updates: WorkoutPlan) => {
        setPlans(prev => prev.map(p => p.id === planId ? updates : p));
    };

    const deletePlan = (planId: string) => {
        setPlans(prev => prev.filter(p => p.id !== planId));
    };

    const assignPlanToStudents = (planId: string, studentIds: string[]) => {
        const template = plans.find(p => p.id === planId);
        if (!template) return;

        const newStudentPlans: WorkoutPlan[] = [];
        const newActivePlans: ActiveStudentPlans = { ...activeStudentPlans };

        studentIds.forEach(studentId => {
            // Check if student already has a plan from this template
            const existingPlan = plans.find(p => p.owner === studentId && p.templateId === planId);
            if(existingPlan) {
                newActivePlans[studentId] = existingPlan.id;
            } else {
                // Create a new copy for the student
                const newPlanForStudent: WorkoutPlan = {
                    ...template,
                    id: `stu-pln-${studentId}-${Date.now()}`,
                    owner: studentId,
                    templateId: template.id,
                    assignedTo: undefined, // Clear this for student copies
                    schedule: template.schedule.map(day => ({...day, id: `${day.id}-copy-${Date.now()}`, exercises: day.exercises.map(ex => ({...ex, id: `${ex.id}-copy-${Date.now()}`, isCompleted: false, setLogs: []}))}))
                };
                newStudentPlans.push(newPlanForStudent);
                newActivePlans[studentId] = newPlanForStudent.id;
            }
        });
        
        setPlans(prev => [...prev, ...newStudentPlans]);
        setActiveStudentPlans(newActivePlans);
    };

    const getAssignments = () => {
        // This should return a list of students and their active plans
        const allStudents = allUsers.filter(u => u.role === 'Student').slice(0, 8); // Mock: trainer sees first 8 students

        return allStudents.map(student => {
            const activePlanId = activeStudentPlans[student.id];
            const plan = activePlanId ? plans.find(p => p.id === activePlanId) : null;
            return {
                studentId: student.id,
                studentName: student.name,
                plan: plan || null,
            };
        });
    }

    const setActiveStudentPlan = (studentId: string, planId: string) => {
        setActiveStudentPlans(prev => ({...prev, [studentId]: planId}));
    };
    
    const updateExerciseDetails = (planId: string, dayId: string, updatedExercise: Exercise) => {
        setPlans(prevPlans => prevPlans.map(plan => {
            if (plan.id === planId) {
                const newSchedule = plan.schedule.map(day => {
                    if (day.id === dayId) {
                        const newExercises = day.exercises.map(ex => 
                            ex.id === updatedExercise.id ? updatedExercise : ex
                        );
                        return { ...day, exercises: newExercises };
                    }
                    return day;
                });
                return { ...plan, schedule: newSchedule };
            }
            return plan;
        }));
    };

    const getStudentPlan = (studentId: string) => {
        const activePlanId = activeStudentPlans[studentId];
        if (!activePlanId) return null;
        return plans.find(p => p.id === activePlanId) || null;
    }
    
    const getStudentWorkoutProgress = (studentId: string) => {
        const plan = getStudentPlan(studentId);
        if (!plan || !plan.schedule || plan.schedule.length === 0) return 0;

        let totalExercises = 0;
        let completedExercises = 0;

        plan.schedule.forEach(day => {
            if (day.exercises && day.exercises.length > 0) {
                day.exercises.forEach(ex => {
                    totalExercises++;
                    if (ex.isCompleted) {
                        completedExercises++;
                    }
                });
            }
        });

        if (totalExercises === 0) return 0;
        return Math.round((completedExercises / totalExercises) * 100);
    }


    return (
        <WorkoutsContext.Provider value={{
            plans,
            activeStudentPlans,
            addPlan,
            updatePlan,
            deletePlan,
            assignPlanToStudents,
            getAssignments,
            setActiveStudentPlan,
            updateExerciseDetails,
            getStudentPlan,
            getStudentWorkoutProgress,
        }}>
            {children}
        </WorkoutsContext.Provider>
    )
}
