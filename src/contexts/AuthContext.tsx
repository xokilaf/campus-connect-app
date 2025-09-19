import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'faculty';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  className?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  selectClass: (className: string) => void;
  availableClasses: string[];
  needsClassSelection: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'student1@campus.edu',
    role: 'student',
  },
  {
    id: '2',
    name: 'Dr. Jane Smith',
    email: 'faculty1@campus.edu',
    role: 'faculty',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'student2@campus.edu',
    role: 'student',
  },
  {
    id: '4',
    name: 'Prof. Robert Brown',
    email: 'faculty2@campus.edu',
    role: 'faculty',
  },
];

const availableClasses = ['CSE-A', 'CSE-B', 'ECE-A', 'ECE-B', 'IT-A', 'IT-B'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Simple mock authentication
    const foundUser = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );
    
    if (foundUser) {
      // Don't set className for students initially, they need to select it
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const selectClass = (className: string) => {
    if (user) {
      setUser({ ...user, className });
    }
  };

  const needsClassSelection = !!user && user.role === 'student' && !user.className;

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    selectClass,
    availableClasses,
    needsClassSelection,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}