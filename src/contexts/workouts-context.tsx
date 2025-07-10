
"use client"

import { createContext, useState, ReactNode } from 'react';

export type Exercise = { id: string; name: string; sets: string; reps: string; isCompleted?: boolean };
export type DailyWorkout = { id:string; day: string; focus: string; exercises: Exercise[]; };
export type WorkoutPlan = { 
    id: string; 
    name: string; 
    description: string; 
    difficulty: string; 
    schedule: DailyWorkout[];
    assignedTo?: string[]; // student ids this plan is assigned to
    owner?: string; // student id if they created it themselves
};

const mockStudentPlanSchedule: DailyWorkout[] = [
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


const initialWorkoutTemplates: WorkoutPlan[] = [
    { id: "TPL-001", name: "Iniciante Força 3x", difficulty: "Iniciante", description: "Um plano de 3 dias para iniciantes focado em ganho de força.", schedule: mockStudentPlanSchedule, assignedTo: ['alex-johnson'] },
    { id: "TPL-002", name: "Hipertrofia Full Body", difficulty: "Intermediário", description: "Treino de corpo inteiro para hipertrofia.", schedule: [], assignedTo: ['maria-garcia'] },
    { id: "TPL-003", name: "Cardio Intenso 30min", difficulty: "Avançado", description: "Sessão de cardio de alta intensidade.", schedule: [] },
];

// studentId -> planId
type ActiveStudentPlans = Record<string, string>;

interface WorkoutsContextType {
    plans: WorkoutPlan[];
    activeStudentPlans: ActiveStudentPlans;
    addPlan: (planData: Omit<WorkoutPlan, 'id'|'assignedTo'>) => void;
    updatePlan: (planId: string, updates: WorkoutPlan) => void;
    deletePlan: (planId: string) => void;
    assignPlanToStudents: (planId: string, studentIds: string[]) => void;
    getAssignments: (students: {id: string, name: string}[]) => { studentName: string; planName: string; planId: string; }[];
    setActiveStudentPlan: (studentId: string, planId: string) => void;
    toggleExerciseCompletion: (planId: string, dayId: string, exerciseId: string) => void;
    getStudentPlan: (studentId: string) => WorkoutPlan | null;
    getStudentWorkoutProgress: (studentId: string) => number;
}

export const WorkoutsContext = createContext<WorkoutsContextType>({} as WorkoutsContextType);

export const WorkoutsProvider = ({ children }: { children: ReactNode }) => {
    const [plans, setPlans] = useState<WorkoutPlan[]>(initialWorkoutTemplates);
    const [activeStudentPlans, setActiveStudentPlans] = useState<ActiveStudentPlans>({
        'alex-johnson': 'TPL-001' // Mock active plan
    });

    const addPlan = (planData: Omit<WorkoutPlan, 'id' | 'assignedTo'>) => {
        const newPlan = { ...planData, id: `plan-${Date.now()}`, assignedTo: [] };
        setPlans(prev => [newPlan, ...prev]);
    };

    const updatePlan = (planId: string, updates: WorkoutPlan) => {
        setPlans(prev => prev.map(p => p.id === planId ? updates : p));
    };

    const deletePlan = (planId: string) => {
        setPlans(prev => prev.filter(p => p.id !== planId));
    };

    const assignPlanToStudents = (planId: string, studentIds: string[]) => {
        // This also sets the assigned plan as active for the student
        setPlans(prev => prev.map(p => {
            if (p.id === planId) {
                const currentAssigned = new Set(p.assignedTo || []);
                studentIds.forEach(id => currentAssigned.add(id));
                return { ...p, assignedTo: Array.from(currentAssigned) };
            }
            return p;
        }));
        
        const newActivePlans: ActiveStudentPlans = { ...activeStudentPlans };
        studentIds.forEach(studentId => {
            newActivePlans[studentId] = planId;
        });
        setActiveStudentPlans(newActivePlans);
    };

    const getAssignments = (students: {id: string, name: string}[]) => {
        const assignments: { studentName: string; planName: string; planId: string; }[] = [];
        plans.forEach(plan => {
            (plan.assignedTo || []).forEach(studentId => {
                const student = students.find(s => s.id === studentId);
                if (student) {
                    assignments.push({ studentName: student.name, planName: plan.name, planId: plan.id });
                }
            });
        });
        return assignments;
    }

    const setActiveStudentPlan = (studentId: string, planId: string) => {
        setActiveStudentPlans(prev => ({...prev, [studentId]: planId}));
    };
    
    const toggleExerciseCompletion = (planId: string, dayId: string, exerciseId: string) => {
        setPlans(prevPlans => prevPlans.map(plan => {
            if (plan.id === planId) {
                const newSchedule = plan.schedule.map(day => {
                    if (day.id === dayId) {
                        const newExercises = day.exercises.map(ex => {
                            if (ex.id === exerciseId) {
                                return { ...ex, isCompleted: !ex.isCompleted };
                            }
                            return ex;
                        });
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
        if (!plan || plan.schedule.length === 0) return 0;

        let totalExercises = 0;
        let completedExercises = 0;

        plan.schedule.forEach(day => {
            day.exercises.forEach(ex => {
                totalExercises++;
                if (ex.isCompleted) {
                    completedExercises++;
                }
            });
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
            toggleExerciseCompletion,
            getStudentPlan,
            getStudentWorkoutProgress,
        }}>
            {children}
        </WorkoutsContext.Provider>
    )
}
