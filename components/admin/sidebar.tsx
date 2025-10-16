"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  Settings,
  BarChart3,
  Library,
  ClipboardList,
  Bell,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Academic Structure",
    href: "/admin/academic-structure",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Faculty",
    href: "/admin/faculty",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: "Attendance",
    href: "/admin/attendance",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: "Library",
    href: "/admin/library",
    icon: <Library className="w-5 h-5" />,
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: <Bell className="w-5 h-5" />,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">College ERP</h2>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

