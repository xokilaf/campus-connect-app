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
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: any }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  selectClass: (className: string) => void;
  availableClasses: string[];
  needsClassSelection: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'student1@campus.edu',
    role: 'student',
  },
  {
    id: '2',
    name: 'Dr. Anjali Verma',
    email: 'faculty1@campus.edu',
    role: 'faculty',
  },
  {
    id: '3',
    name: 'Rohan Gupta',
    email: 'student2@campus.edu',
    role: 'student',
  },
  {
    id: '4',
    name: 'Prof. Vikram Singh',
    email: 'faculty2@campus.edu',
    role: 'faculty',
  },
];

const availableClasses = ['IT-A', 'IT-B', 'CSE-A', 'CSE-B'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<{ error: any }> => {
    setLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );
    
    setLoading(false);
    
    if (foundUser && password === 'demo') {
      setUser(foundUser);
      return { error: null };
    }
    
    return { error: { message: 'Invalid credentials' } };
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<{ error: any }> => {
    setLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );
    
    setLoading(false);
    
    if (existingUser) {
      return { error: { message: 'User already exists' } };
    }
    
    // Create new user
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role,
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    
    return { error: null };
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
    signup,
    logout,
    isAuthenticated: !!user,
    loading,
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