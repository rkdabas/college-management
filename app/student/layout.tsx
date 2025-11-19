"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { StudentSidebar } from "@/components/student/sidebar";
import { StudentHeader } from "@/components/student/header";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "student") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 shadow-xl">
        <StudentSidebar />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8 scrollbar-professional">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

