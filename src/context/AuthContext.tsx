import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/interview';
import { INITIAL_USER } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ADMIN_EMAIL = 'admin@webluyenpv.com';
const ADMIN_PASSWORD = 'admin123';

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
    return INITIAL_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_mock_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_mock_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (email.trim().toLowerCase() === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Administrator',
        email: ADMIN_EMAIL,
        avatarUrl: INITIAL_USER.avatarUrl,
        role: 'admin',
      };
      setUser(adminUser);
      return true;
    }

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
        isAdmin: user?.role === 'admin',
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
