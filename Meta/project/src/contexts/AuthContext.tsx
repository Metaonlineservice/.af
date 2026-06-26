import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';
const USERS_SHEET = 'users';

const ADMIN_EMAIL = 'farhadehsan507@gmail.com';
const ADMIN_PASSWORD = '123456789';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('meta_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('meta_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Admin check
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin',
        firstName: 'Admin',
        lastName: 'Meta',
        email: ADMIN_EMAIL,
        phone: '',
        createdAt: new Date().toISOString(),
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem('meta_user', JSON.stringify(adminUser));
      return { success: true };
    }

    try {
      const res = await fetch(
        `${SHEETDB_API_URL}/search?sheet=${USERS_SHEET}&email=${encodeURIComponent(email.toLowerCase())}`
      );
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        return { success: false, error: 'ایمیل یا رمز عبور اشتباه است' };
      }

      const record = data[0];
      if (record.password !== password) {
        return { success: false, error: 'ایمیل یا رمز عبور اشتباه است' };
      }

      const loggedUser: User = {
        id: record.id,
        firstName: record.first_name,
        lastName: record.last_name,
        email: record.email,
        phone: record.phone,
        createdAt: record.created_at,
      };

      setUser(loggedUser);
      localStorage.setItem('meta_user', JSON.stringify(loggedUser));
      return { success: true };
    } catch {
      return { success: false, error: 'خطا در اتصال. لطفاً دوباره تلاش کنید.' };
    }
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if email exists
      const checkRes = await fetch(
        `${SHEETDB_API_URL}/search?sheet=${USERS_SHEET}&email=${encodeURIComponent(data.email.toLowerCase())}`
      );
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return { success: false, error: 'این ایمیل قبلاً ثبت شده است' };
      }

      const id = 'USR-' + Date.now().toString(36).toUpperCase();
      const newRecord = {
        id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        password: data.password,
        created_at: new Date().toISOString(),
      };

      await fetch(SHEETDB_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [newRecord], sheet: USERS_SHEET }),
      });

      const loggedUser: User = {
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        createdAt: newRecord.created_at,
      };

      setUser(loggedUser);
      localStorage.setItem('meta_user', JSON.stringify(loggedUser));
      return { success: true };
    } catch {
      return { success: false, error: 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('meta_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.isAdmin === true,
      isLoading,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
