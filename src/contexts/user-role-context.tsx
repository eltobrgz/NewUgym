
"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import { allUsers as userDirectory } from '@/lib/user-directory';

export type UserRole = "Student" | "Trainer" | "Gym";

export interface User {
  id: string; // Add ID to user object
  name: string;
  email: string;
  // Student specific
  height?: number;
  weight?: number;
  birthdate?: string;
  // Trainer specific
  cref?: string;
  specializations?: string;
  bio?: string;
  // Gym specific
  phone?: string;
  address?: string;
}

interface UserRoleContextType {
  user: User;
  userRole: UserRole;
  isProfileComplete: boolean;
  setUserRole: (role: UserRole) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

// Find users from the directory to use as mock data
const mockStudent = userDirectory.find(u => u.id === 'stu-001');
const mockTrainer = userDirectory.find(u => u.id === 'trn-001');
const mockGym = userDirectory.find(u => u.id === 'gym-001');

const MOCK_USERS: Record<UserRole, User> = {
    Student: { 
        id: mockStudent!.id,
        name: mockStudent!.name,
        email: mockStudent!.email,
        height: 175, // Partially complete profile
    },
    Trainer: { 
        id: mockTrainer!.id,
        name: mockTrainer!.name, 
        email: mockTrainer!.email, 
        cref: "123456-G/SP", 
        specializations: "Treinamento Funcional, Nutrição Esportiva, Biomecânica", 
        bio: "Personal trainer com mais de 10 anos de experiência, focado em ajudar clientes a atingir seu potencial máximo através de ciência e dedicação."
    },
    Gym: { 
        id: mockGym!.id,
        name: mockGym!.name, 
        email: mockGym!.email, 
        phone: "(11) 98765-4321", 
        address: "Rua dos Atletas, 123, São Paulo - SP" 
    },
}

// Function to check if the profile for a given role is complete
const checkProfileCompleteness = (user: User, role: UserRole): boolean => {
    switch (role) {
        case "Student":
            return !!user.height && !!user.weight && !!user.birthdate;
        case "Trainer":
            return !!user.cref && !!user.specializations && !!user.bio;
        case "Gym":
            return !!user.phone && !!user.address;
        default:
            return false;
    }
}


export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>("Student");
  const user = MOCK_USERS[userRole];
  const isProfileComplete = checkProfileCompleteness(user, userRole);

  return (
    <UserRoleContext.Provider value={{ user, userRole, isProfileComplete, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole deve ser usado dentro de um UserRoleProvider');
  }
  return context;
};

    