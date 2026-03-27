import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole } from '@/types';

interface AuthState {
  token: string | null;
  userName: string;
  role: UserRole;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, userName: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('ews_token');
    const userName = localStorage.getItem('ews_userName') || 'Yohannes Sintayhu Getan';
    const role = (localStorage.getItem('ews_role') as UserRole) || 'ADMIN';
    return {
      token,
      userName,
      role,
      isAuthenticated: !!token,
    };
  });

  const login = (token: string, userName: string, role: UserRole) => {
    localStorage.setItem('ews_token', token);
    localStorage.setItem('ews_userName', userName);
    localStorage.setItem('ews_role', role);
    setAuth({ token, userName, role, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('ews_token');
    localStorage.removeItem('ews_userName');
    localStorage.removeItem('ews_role');
    setAuth({ token: null, userName: '', role: 'ADMIN', isAuthenticated: false });
  };

  const switchRole = (role: UserRole) => {
    localStorage.setItem('ews_role', role);
    setAuth((prev) => ({ ...prev, role }));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
