
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

const mockStudentPlanSchedule: DailyWorkout[] = [
    {
        id: 'day1', day: 'Segunda-feira', focus: 'Peito, Ombros e Tríceps', exercises: [
            { id: 'ex11', name: 'Supino Reto', sets: '4', reps: '8-12', isCompleted: true, setLogs: [], notes: '' },
            { id: 'ex12', name: 'Desenvolvimento com Halteres', sets: '3', reps: '10', isCompleted: false, setLogs: [], notes: '' },
            { id: 'ex13', name: 'Tríceps na Polia', sets: '3', reps: '12-15', isCompleted: false, setLogs: [], notes: '' },
        ]
    },
    {
        id: 'day2', day: 'Terça-feira', focus: 'Costas e Bíceps', exercises: [
            { id: 'ex21', name: 'Barra Fixa', sets: '3', reps: 'Até a falha', isCompleted: false, setLogs: [], notes: '' },
            { id: 'ex22', name: 'Remada Curvada', sets: '4', reps: '8-10', isCompleted: false, setLogs: [], notes: '' },
            { id: 'ex23', name: 'Rosca Direta', sets: '3', reps: '12', isCompleted: false, setLogs: [], notes: '' },
        ]
    },
    { id: 'day3', day: 'Quarta-feira', focus: 'Descanso Ativo', exercises: [] },
];


const initialWorkoutTemplates: WorkoutPlan[] = [
    { id: "TPL-001", name: "Iniciante Força 3x", difficulty: "Iniciante", description: "Um plano de 3 dias para iniciantes focado em ganho de força.", schedule: [], assignedTo: [] },
    { id: "TPL-002", name: "Hipertrofia Full Body", difficulty: "Intermediário", description: "Treino de corpo inteiro para hipertrofia.", schedule: [], assignedTo: [] },
    { id: "TPL-003", name: "Cardio Intenso 30min", difficulty: "Avançado", description: "Sessão de cardio de alta intensidade.", schedule: [] },
];

const initialStudentOwnedPlans: WorkoutPlan[] = [
    { 
        id: "STU-PLN-001", 
        name: "Meu Treino de Força", 
        difficulty: "Iniciante", 
        description: "Plano de 3 dias para iniciantes focado em ganho de força.", 
        schedule: mockStudentPlanSchedule, 
        owner: 'alex-johnson',
        templateId: 'TPL-001',
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
        'alex-johnson': 'STU-PLN-001' // Mock active plan for a student
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
        const studentPlans = plans.filter(p => p.owner && allUsers.some(u => u.id === p.owner && u.role === 'Student'));

        // This is a simplified logic. A real app would link trainers to students.
        // For now, let's assume the trainer can see all students.
        const allStudents = allUsers.filter(u => u.role === 'Student');

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
