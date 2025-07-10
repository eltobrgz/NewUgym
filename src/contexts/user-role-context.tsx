
"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = "Student" | "Trainer" | "Gym";

export interface User {
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

// Mock data now includes some incomplete profiles
const MOCK_USERS: Record<UserRole, User> = {
    Student: { name: "Alex Robinson", email: "alex.rob@example.com" }, // Incomplete profile
    Trainer: { 
        name: "Sarah Coach", 
        email: "sarah.c@example.com", 
        cref: "123456-G/SP", 
        specializations: "Treinamento Funcional, Nutrição Esportiva", 
        bio: "Personal trainer com mais de 10 anos de experiência."
    }, // Complete profile
    Gym: { name: "FitZone Admin", email: "admin@fitzone.com", phone: "(11) 98765-4321", address: "Rua dos Atletas, 123" }, // Complete profile
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
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
