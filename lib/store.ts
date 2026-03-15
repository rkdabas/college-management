import { create } from "zustand";

interface User {
  id: string;
  username: string;
  role: "admin" | "teacher" | "student";
  name: string;
  email: string;
  rollNo?: string;
  employeeId?: string;
  semester?: number;
  batch?: number;
  degreeId?: string;
  degreeName?: string;
  branchId?: string;
  branchName?: string;
  branchCode?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  admissionDate?: string;
  departmentId?: string;
  departmentName?: string;
  designation?: string;
  qualification?: string;
  experience?: number;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role?: "admin" | "teacher" | "student") => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (username: string, password: string, role?: "admin" | "teacher" | "student") => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password, role }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      const userRole = data.role.toLowerCase() as "admin" | "teacher" | "student";
      
      const user: User = {
        id: data.id,
        username: data.rollNo || data.employeeId || data.email,
        role: userRole,
        name: data.name,
        email: data.email,
        rollNo: data.rollNo,
        employeeId: data.employeeId,
        semester: data.semester,
        batch: data.batch,
        degreeId: data.degreeId,
        degreeName: data.degreeName,
        branchId: data.branchId,
        branchName: data.branchName,
        branchCode: data.branchCode,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        admissionDate: data.admissionDate,
        departmentId: data.departmentId,
        departmentName: data.departmentName,
        designation: data.designation,
        qualification: data.qualification,
        experience: data.experience,
      };

      set({ user, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));