
"use client"

import { createContext, useState, ReactNode } from 'react';

export type TaskStatus = "To Do" | "In Progress" | "Done" | "Canceled";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
};

const initialTasks: Task[] = [
  { id: "TASK-8782", title: "Plan next month's workout cycle", status: "In Progress", assignee: "Sarah Coach", dueDate: "2024-08-10" },
  { id: "TASK-7878", title: "Follow up with new student", status: "To Do", assignee: "Sarah Coach", dueDate: "2024-08-05" },
  { id: "TASK-4582", title: "Renew gym membership", status: "Done", assignee: "Alex Robinson", dueDate: "2024-07-30" },
  { id: "TASK-1245", title: "Update client progress charts", status: "Canceled", assignee: "Sarah Coach", dueDate: "2024-08-02" },
  { id: "TASK-9874", title: "Prepare for yoga seminar", status: "To Do", assignee: "Jane", dueDate: "2024-08-14" },
  { id: "TASK-3456", title: "Clean and check squat rack", status: "Done", assignee: "FitZone Admin", dueDate: "2024-08-01" },
];


interface TasksContextType {
    tasks: Task[];
    addTask: (taskData: Omit<Task, 'id'>) => void;
    updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
    deleteTask: (taskId: string) => void;
    toggleTaskStatus: (taskId: string, isChecked: boolean) => void;
}

export const TasksContext = createContext<TasksContextType>({
    tasks: [],
    addTask: () => {},
    updateTask: () => {},
    deleteTask: () => {},
    toggleTaskStatus: () => {},
});

export const TasksProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const addTask = (taskData: Omit<Task, 'id'>) => {
        const newTask: Task = {
            id: `TASK-${Date.now()}`,
            ...taskData,
        };
        setTasks(prev => [newTask, ...prev]);
    };

    const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    };
    
    const deleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };
    
    const toggleTaskStatus = (taskId: string, isChecked: boolean) => {
        setTasks(prev => prev.map(t => t.id === taskId ? {...t, status: isChecked ? 'Done' : 'To Do'} : t))
    }

    return (
        <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTaskStatus }}>
            {children}
        </TasksContext.Provider>
    )
}
