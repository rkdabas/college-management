import { create } from "zustand";

interface User {
  id: string;
  username: string;
  role: "admin" | "teacher" | "student";
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (username: string, password: string) => {
    // Demo login credentials
    if (username === "admin" && password === "admin123") {
      const user: User = {
        id: "1",
        username: "admin",
        role: "admin",
        name: "Admin User",
        email: "admin@college.edu",
      };
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

