'use client'

import { createContext, use, useState } from "react";


const DEMO_USER = {
    username: 'demo',
    password: 'demo123',
};

export const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string, password: string) => {
    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext value={{ user, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  return use(AuthContext);
}

