import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/interview';
import { INITIAL_USER } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ai_mock_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER; // Default logged in as demo user for easy preview
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_mock_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_mock_user');
    }
  }, [user]);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // Simulate Spring Boot REST API POST /api/v1/auth/login
    await new Promise((resolve) => setTimeout(resolve, 600));
    const loggedUser: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      avatarUrl: INITIAL_USER.avatarUrl,
      role: 'Backend Intern / Candidate',
    };
    setUser(loggedUser);
    return true;
  };

  const register = async (name: string, email: string, _pass: string): Promise<boolean> => {
    // Simulate Spring Boot REST API POST /api/v1/auth/register
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name,
      email: email,
      avatarUrl: INITIAL_USER.avatarUrl,
      role: 'Backend Intern / Candidate',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const demoLogin = () => {
    setUser(INITIAL_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
