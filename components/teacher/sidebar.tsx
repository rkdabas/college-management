"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Calendar,
  FileText,
  Award,
  Users,
  CalendarDays,
  FileCheck,
  User,
  CheckCircle2,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "My Classes",
    href: "/teacher/my-classes",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: "Attendance",
    href: "/teacher/attendance",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    title: "Timetable",
    href: "/teacher/timetable",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: "Assignments",
    href: "/teacher/assignments",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Grading",
    href: "/teacher/grading",
    icon: <Award className="w-5 h-5" />,
  },
  {
    title: "Materials",
    href: "/teacher/materials",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Extracurricular",
    href: "/teacher/extracurricular",
    icon: <Award className="w-5 h-5" />,
  },
  {
    title: "Submit Records",
    href: "/teacher/records",
    icon: <FileCheck className="w-5 h-5" />,
  },
  {
    title: "Students",
    href: "/teacher/students",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Promotions",
    href: "/teacher/promotions",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  {
    title: "Events",
    href: "/teacher/events",
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    title: "Leave Application",
    href: "/teacher/leave",
    icon: <FileCheck className="w-5 h-5" />,
  },
  {
    title: "Profile",
    href: "/teacher/profile",
    icon: <User className="w-5 h-5" />,
  },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center shadow-md shadow-sky-600/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight text-gray-900">JIMS ERP</h2>
            <p className="text-xs text-gray-500 font-medium">Teacher Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-professional">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-600/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span className={cn(
                  "transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )}>
                  {item.icon}
                </span>
                <span className="tracking-tight">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-1">Need Help?</p>
          <p className="text-xs text-gray-500 mb-3">Contact admin for assistance</p>
          <button className="w-full px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors duration-200 border border-gray-200">
            Get Support
          </button>
        </div>
      </div>
    </div>
  );
}

