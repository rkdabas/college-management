"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { GraduationCap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,116,185,0.05),rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="text-center relative z-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-700 rounded-2xl mb-6 shadow-lg shadow-sky-600/20 animate-pulse">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <div className="mb-4">
          <svg className="animate-spin h-10 w-10 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-700 tracking-tight">Loading JIMS ERP Portal...</p>
      </div>
    </div>
  );
}
