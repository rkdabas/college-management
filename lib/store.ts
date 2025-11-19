import { create } from "zustand";
import { demoStudents, demoTeachers } from "./demo-data-v2";

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
  login: (username: string, password: string, role?: "admin" | "teacher" | "student") => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (username: string, password: string, role?: "admin" | "teacher" | "student") => {
    // Admin login
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
    
    // Student login (using rollNo as username)
    if (role === "student") {
      const student = demoStudents.find(s => s.rollNo === username);
      if (student && password === "student123") {
        const user: User = {
          id: student.id,
          username: student.rollNo,
          role: "student",
          name: student.name,
          email: student.email,
        };
        set({ user, isAuthenticated: true });
        return true;
      }
    }
    
    // Teacher login (using employeeId as username)
    if (role === "teacher") {
      const teacher = demoTeachers.find(t => t.employeeId === username);
      if (teacher && password === "teacher123") {
        const user: User = {
          id: teacher.id,
          username: teacher.employeeId,
          role: "teacher",
          name: teacher.name,
          email: teacher.email,
        };
        set({ user, isAuthenticated: true });
        return true;
      }
    }
    
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

