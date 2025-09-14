import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'faculty';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Simple mock authentication
    const foundUser = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
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