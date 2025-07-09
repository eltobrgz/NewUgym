"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = "Student" | "Trainer" | "Gym";

interface User {
  name: string;
  email: string;
}

interface UserRoleContextType {
  user: User;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, User> = {
    Student: { name: "Alex Robinson", email: "alex.rob@example.com" },
    Trainer: { name: "Sarah Coach", email: "sarah.c@example.com" },
    Gym: { name: "FitZone Admin", email: "admin@fitzone.com" },
}

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>("Student");
  const user = MOCK_USERS[userRole];

  return (
    <UserRoleContext.Provider value={{ user, userRole, setUserRole }}>
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
