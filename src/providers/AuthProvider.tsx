import { createContext, useContext, type ReactNode } from "react";

/**
 * Skeleton AuthProvider. Implementasi (session Supabase, role guard)
 * ditambahkan saat sprint Auth. Sekarang hanya pass-through.
 */
type AuthContextValue = {
  user: null;
  role: null;
};

const AuthContext = createContext<AuthContextValue>({ user: null, role: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={{ user: null, role: null }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
