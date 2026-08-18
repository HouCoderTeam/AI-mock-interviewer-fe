import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/interview";
import { authApi, tokenStore, ApiError } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  demoLogin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tài khoản admin được seed sẵn ở backend (ApplicationInitConfig)
const DEMO_EMAIL = "admin@webluyenpv.com";
const DEMO_PASSWORD = "admin123";

const USER_CACHE_KEY = "ai_mock_user";

const shouldLogoutOnAuthError = (error: unknown): boolean => {
  if (!(error instanceof ApiError)) return false;

  const isForbiddenPermission = error.status === 403 || error.code === 9000;
  const isExpiredOrInvalid = error.status === 401 || error.status === 400;

  return (
    isExpiredOrInvalid ||
    (isForbiddenPermission &&
      (error.code === 9000 || /not have permission/i.test(error.message)))
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Chỉ khôi phục user từ cache nếu còn token (tránh trạng thái "đăng nhập sẵn" giả)
    if (!tokenStore.get()) return null;
    const saved = localStorage.getItem(USER_CACHE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isInitializing, setIsInitializing] = useState<boolean>(
    !!tokenStore.get(),
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_CACHE_KEY);
    }
  }, [user]);

  // Xác thực lại token khi tải trang
  useEffect(() => {
    let active = true;
    if (!tokenStore.get()) {
      setIsInitializing(false);
      return;
    }
    authApi
      .me()
      .then((u) => {
        if (active) setUser(u);
      })
      .catch((e) => {
        // Token hết hạn, không hợp lệ hoặc không có quyền -> đăng xuất và buộc quay lại login
        if (shouldLogoutOnAuthError(e)) {
          tokenStore.clear();
          localStorage.removeItem(USER_CACHE_KEY);
          if (active) setUser(null);
        }
      })
      .finally(() => {
        if (active) setIsInitializing(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const u = await authApi.login(email.trim(), pass);
    setUser(u);
    return true;
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
  ): Promise<boolean> => {
    const u = await authApi.register(name.trim(), email.trim(), pass);
    setUser(u);
    return true;
  };

  const logout = () => {
    authApi.logout().finally(() => setUser(null));
  };

  const demoLogin = async (): Promise<boolean> => {
    const u = await authApi.login(DEMO_EMAIL, DEMO_PASSWORD);
    setUser(u);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isInitializing,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
